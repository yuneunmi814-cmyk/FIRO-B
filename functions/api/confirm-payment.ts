/**
 * Toss Payments server-side confirmation endpoint.
 * Runs on Cloudflare Pages Functions (Workers runtime, not Node.js).
 *
 * Flow:
 *   1. Browser receives ?paymentKey=...&orderId=...&amount=... after Toss redirect
 *   2. Browser POSTs those values to this endpoint (/api/confirm-payment)
 *   3. This function calls Toss /v1/payments/confirm with the secret key
 *   4. Toss finalizes the payment and returns the confirmed payment object
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables):
 *   TOSS_SECRET_KEY=test_sk_...   (test)
 *   TOSS_SECRET_KEY=live_sk_...   (production)
 */

interface Env {
  TOSS_SECRET_KEY?: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { paymentKey?: string; orderId?: string; amount?: number } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { paymentKey, orderId, amount } = body
  if (!paymentKey || !orderId || amount == null) {
    return Response.json(
      { error: 'Missing paymentKey, orderId, or amount' },
      { status: 400 },
    )
  }

  if (!env.TOSS_SECRET_KEY) {
    console.error('[confirm-payment] TOSS_SECRET_KEY is not set')
    return Response.json({ error: 'Server not configured' }, { status: 500 })
  }

  // Toss requires Basic auth with "secretKey:" (trailing colon, empty password)
  const auth = btoa(`${env.TOSS_SECRET_KEY}:`)

  try {
    const tossRes = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization:  `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
      },
    )

    const data = await tossRes.json<any>()

    if (!tossRes.ok) {
      console.error('[confirm-payment] Toss returned error:', data)
      return Response.json(
        {
          error: data.message ?? 'Toss confirmation failed',
          code:  data.code,
          orderId,
        },
        { status: tossRes.status },
      )
    }

    // TODO (production): persist the purchase server-side (D1 / Workers KV)
    // so the user's access cannot be forged by tampering with localStorage.

    return Response.json({
      success:     true,
      orderId:     data.orderId,
      paymentKey:  data.paymentKey,
      totalAmount: data.totalAmount,
      method:      data.method,
      approvedAt:  data.approvedAt,
    })
  } catch (err) {
    console.error('[confirm-payment] Unexpected error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
