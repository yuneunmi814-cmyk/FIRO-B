import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Polar checkout confirmation endpoint.
 *
 * Unlike Toss (which requires a POST /confirm call to finalize), Polar
 * finalizes the payment itself — this endpoint just verifies the checkout
 * reached a terminal success state before we unlock access on the client.
 *
 * Flow:
 *   1. Polar redirects back with ?polar_checkout_id={id}
 *   2. Browser POSTs that ID to this endpoint
 *   3. This endpoint calls Polar GET /v1/checkouts/{id} with the access token
 *   4. If status === 'succeeded' (or 'confirmed'), we return success
 *
 * In production prefer the webhook flow (checkout.updated / order.created)
 * and store the result in your DB — the client then checks against your DB
 * instead of polling Polar. See TODO at bottom.
 *
 * Env vars (Vercel → Settings → Environment Variables):
 *   POLAR_ACCESS_TOKEN=polar_oat_...   (Personal Access Token, server-only)
 */

const POLAR_API = 'https://api.polar.sh'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { checkoutId } = req.body ?? {}
  if (!checkoutId) {
    return res.status(400).json({ error: 'Missing checkoutId' })
  }

  const token = process.env.POLAR_ACCESS_TOKEN
  if (!token) {
    console.error('[confirm-polar] POLAR_ACCESS_TOKEN is not set')
    return res.status(500).json({ error: 'Server not configured' })
  }

  try {
    const polarRes = await fetch(`${POLAR_API}/v1/checkouts/${encodeURIComponent(checkoutId)}`, {
      method:  'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:        'application/json',
      },
    })

    const data = await polarRes.json()

    if (!polarRes.ok) {
      console.error('[confirm-polar] Polar returned error:', data)
      return res.status(polarRes.status).json({
        error: data.detail ?? data.message ?? 'Polar confirmation failed',
        code:  polarRes.status,
      })
    }

    // Polar checkout states: open | expired | confirmed | succeeded | failed
    const ok = data.status === 'succeeded' || data.status === 'confirmed'
    if (!ok) {
      return res.status(409).json({
        error:  `Checkout not completed (status: ${data.status})`,
        status: data.status,
      })
    }

    // TODO (production): persist the purchase in your DB (Firestore / Supabase)
    // keyed by the customer email or internal_order_id metadata, so the client
    // cannot forge access by tampering with localStorage. Webhooks
    // (checkout.updated / order.created) are the right place for this write.

    return res.status(200).json({
      success:    true,
      checkoutId: data.id,
      status:     data.status,
      amount:     data.total_amount ?? data.amount,
      product:    data.product?.name,
      customer:   data.customer_email ?? data.customer?.email ?? null,
      internalOrderId: data.metadata?.internal_order_id ?? null,
      productKey:      data.metadata?.product ?? null,
    })
  } catch (err) {
    console.error('[confirm-polar] Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
