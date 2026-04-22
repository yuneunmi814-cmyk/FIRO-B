/**
 * Polar checkout confirmation endpoint.
 * Runs on Cloudflare Pages Functions (Workers runtime).
 *
 * Flow:
 *   1. Polar redirects back with ?polar_checkout_id={id}
 *   2. Browser POSTs that ID here (/api/confirm-polar)
 *   3. This function calls Polar GET /v1/checkouts/{id} with the access token
 *   4. If status === 'succeeded' | 'confirmed' we return success
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables):
 *   POLAR_ACCESS_TOKEN=polar_oat_...   (Personal Access Token, server-only)
 */

interface Env {
  POLAR_ACCESS_TOKEN?: string
  /**
   * Base URL for Polar API. Defaults to production.
   * Set to "https://sandbox-api.polar.sh" in Cloudflare Pages Preview
   * environment variables to run sandbox tests without touching prod.
   */
  POLAR_API_BASE?: string
}

const DEFAULT_POLAR_API = 'https://api.polar.sh'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const POLAR_API = env.POLAR_API_BASE?.trim() || DEFAULT_POLAR_API
  let body: { checkoutId?: string } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const checkoutId = body.checkoutId
  if (!checkoutId) {
    return Response.json({ error: 'Missing checkoutId' }, { status: 400 })
  }

  if (!env.POLAR_ACCESS_TOKEN) {
    console.error('[confirm-polar] POLAR_ACCESS_TOKEN is not set')
    return Response.json({ error: 'Server not configured' }, { status: 500 })
  }

  try {
    const polarRes = await fetch(
      `${POLAR_API}/v1/checkouts/${encodeURIComponent(checkoutId)}`,
      {
        method:  'GET',
        headers: {
          Authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}`,
          Accept:        'application/json',
        },
      },
    )

    const data = await polarRes.json<any>()

    if (!polarRes.ok) {
      console.error('[confirm-polar] Polar returned error:', data)
      return Response.json(
        {
          error: data.detail ?? data.message ?? 'Polar confirmation failed',
          code:  polarRes.status,
        },
        { status: polarRes.status },
      )
    }

    const ok = data.status === 'succeeded' || data.status === 'confirmed'
    if (!ok) {
      return Response.json(
        { error: `Checkout not completed (status: ${data.status})`, status: data.status },
        { status: 409 },
      )
    }

    return Response.json({
      success:         true,
      checkoutId:      data.id,
      status:          data.status,
      amount:          data.total_amount ?? data.amount,
      product:         data.product?.name,
      customer:        data.customer_email ?? data.customer?.email ?? null,
      internalOrderId: data.metadata?.internal_order_id ?? null,
      productKey:      data.metadata?.product ?? null,
    })
  } catch (err) {
    console.error('[confirm-polar] Unexpected error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
