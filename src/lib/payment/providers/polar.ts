import type { PaymentAdapter, CheckoutRequest, CheckoutResult } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// SETUP CHECKLIST (do before switching VITE_PAYMENT_PROVIDER=polar)
//
// 1. Dashboard: https://polar.sh/dashboard → create products for each
//    ProductKey in config.ts. Copy the public checkout URL for each.
//    (e.g. https://buy.polar.sh/polar_cl_xxx)
//
// 2. In each product's checkout settings set the Success URL to:
//      https://projectyoon.com/?polar_checkout_id={CHECKOUT_ID}
//    Polar substitutes {CHECKOUT_ID} at redirect time.
//
// 3. .env (local) and Vercel → Settings → Environment Variables:
//      VITE_PAYMENT_PROVIDER=polar
//      VITE_POLAR_INDIVIDUAL_REPORT_URL=https://buy.polar.sh/...
//      VITE_POLAR_COUPLE_ADDON_URL=https://buy.polar.sh/...
//      VITE_POLAR_CONSULTATION_URL=https://buy.polar.sh/...
//      POLAR_ACCESS_TOKEN=polar_oat_...   ← server-only, no VITE_ prefix
//
//    Generate POLAR_ACCESS_TOKEN at Dashboard → Settings → Developers → PATs.
//
// 4. WEBHOOK (recommended for production):
//    Dashboard → Settings → Webhooks. Subscribe to:
//      - checkout.updated
//      - order.created
//    Verify payload with POLAR_WEBHOOK_SECRET before granting access.
//    Until then, /api/confirm-polar polls the checkout status directly.
//
// Polar docs: https://docs.polar.sh/api-reference
// ─────────────────────────────────────────────────────────────────────────────

const CHECKOUT_URLS: Partial<Record<string, string | undefined>> = {
  individual_report:    import.meta.env.VITE_POLAR_INDIVIDUAL_REPORT_URL,
  couple_addon:         import.meta.env.VITE_POLAR_COUPLE_ADDON_URL,
  consultation_deposit: import.meta.env.VITE_POLAR_CONSULTATION_URL,
}

export const polarAdapter: PaymentAdapter = {
  async startCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    const checkoutUrl = CHECKOUT_URLS[req.product]

    if (!checkoutUrl) {
      console.error('[Polar] No checkout URL configured for product:', req.product)
      return { success: false, error: `Polar checkout URL missing for "${req.product}"` }
    }

    const url = new URL(checkoutUrl)

    // Pre-fill customer info when Polar supports it on the checkout page
    if (req.customerName) url.searchParams.set('customer_name', req.customerName)

    // Attach our internal orderId as Polar checkout metadata so the webhook
    // / status-poll can correlate a Polar order back to our order records.
    // Polar accepts arbitrary metadata via the checkout SDK but not via the
    // static checkout link — so we also round-trip it through sessionStorage.
    url.searchParams.set('metadata[internal_order_id]', req.orderId)
    url.searchParams.set('metadata[product]', req.product)
    if (req.metadata) {
      Object.entries(req.metadata).forEach(([k, v]) =>
        url.searchParams.set(`metadata[${k}]`, v),
      )
    }

    // Redirect to Polar-hosted checkout.
    // Access unlock is handled in App.tsx via readPaymentCallback() after the
    // success URL redirects back with ?polar_checkout_id=...
    window.location.href = url.toString()
    return { success: false, error: 'redirecting' }
  },
}
