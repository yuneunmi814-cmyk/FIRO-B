import type { PaymentAdapter, CheckoutRequest, CheckoutResult } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// SETUP CHECKLIST (do before switching VITE_PAYMENT_PROVIDER=polar)
//
// 1. Create products in the Polar dashboard (https://polar.sh/dashboard)
//    and copy the checkout URL for each product.
//
// 2. Add env vars (in .env and Vercel dashboard):
//      VITE_POLAR_INDIVIDUAL_REPORT_URL=https://buy.polar.sh/...
//      VITE_POLAR_COUPLE_ADDON_URL=https://buy.polar.sh/...
//      VITE_POLAR_CONSULTATION_URL=https://buy.polar.sh/...
//
// 3. Configure your successUrl in the Polar product settings so users
//    are redirected back to your site after checkout.
//
// 4. WEBHOOK (recommended):
//    Register a webhook endpoint in Polar → Settings → Webhooks.
//    Events to listen for: order.created, subscription.created
//    Verify the signature with the webhook secret (POLAR_WEBHOOK_SECRET).
//
// Polar docs: https://docs.polar.sh/
// ─────────────────────────────────────────────────────────────────────────────

const CHECKOUT_URLS: Partial<Record<string, string | undefined>> = {
  // TODO: fill in once Polar products are created
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

    // Append metadata so you can identify the customer on the webhook
    const url = new URL(checkoutUrl)
    url.searchParams.set('orderId', req.orderId)
    if (req.customerName) url.searchParams.set('customerName', req.customerName)
    if (req.metadata) {
      Object.entries(req.metadata).forEach(([k, v]) => url.searchParams.set(k, v))
    }

    // Redirect to Polar-hosted checkout
    // Access unlock is handled in App.tsx via readPaymentCallback() on next mount.
    window.location.href = url.toString()

    // Never reached — here for TypeScript return type compliance
    return { success: false, error: 'redirecting' }
  },
}
