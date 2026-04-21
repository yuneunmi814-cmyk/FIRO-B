import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Toss Payments server-side confirmation endpoint.
 *
 * Flow:
 *   1. Browser receives ?paymentKey=...&orderId=...&amount=... after Toss redirect
 *   2. Browser POSTs those values to this endpoint
 *   3. This endpoint calls Toss /v1/payments/confirm with the secret key
 *   4. Toss finalizes the payment and returns the confirmed payment object
 *
 * Without this step, the payment stays in a pending state and is automatically
 * cancelled by Toss. The secret key MUST stay server-side — do not expose it
 * to the browser.
 *
 * Env vars (set in Vercel dashboard, Production + Preview):
 *   TOSS_SECRET_KEY=test_sk_...   (test)
 *   TOSS_SECRET_KEY=live_sk_...   (production)
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { paymentKey, orderId, amount } = req.body ?? {}

  if (!paymentKey || !orderId || amount == null) {
    return res.status(400).json({ error: 'Missing paymentKey, orderId, or amount' })
  }

  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) {
    console.error('[confirm-payment] TOSS_SECRET_KEY is not set')
    return res.status(500).json({ error: 'Server not configured' })
  }

  // Toss requires Basic auth with "secretKey:" (trailing colon, empty password)
  const auth = Buffer.from(`${secretKey}:`).toString('base64')

  try {
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method:  'POST',
      headers: {
        Authorization:  `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })

    const data = await tossRes.json()

    if (!tossRes.ok) {
      console.error('[confirm-payment] Toss returned error:', data)
      return res.status(tossRes.status).json({
        error:   data.message ?? 'Toss confirmation failed',
        code:    data.code,
        orderId,
      })
    }

    // TODO (production): persist the purchase server-side (Firestore / DB)
    // so the user's access cannot be forged by tampering with localStorage.
    // For now we trust the client to store the orderId.

    return res.status(200).json({
      success:     true,
      orderId:     data.orderId,
      paymentKey:  data.paymentKey,
      totalAmount: data.totalAmount,
      method:      data.method,
      approvedAt:  data.approvedAt,
    })
  } catch (err) {
    console.error('[confirm-payment] Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
