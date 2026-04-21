import type { PaymentAdapter, CheckoutRequest, CheckoutResult } from '../types'
import { PRODUCTS } from '../config'

// ─────────────────────────────────────────────────────────────────────────────
// SETUP CHECKLIST (do before switching VITE_PAYMENT_PROVIDER=toss)
//
// 1. Install the SDK:
//      npm install @tosspayments/tosspayments-sdk
//
// 2. Add env vars (in .env and in Vercel dashboard):
//      VITE_TOSS_CLIENT_KEY=test_ck_...   ← test key for dev/staging
//      VITE_TOSS_CLIENT_KEY=live_ck_...   ← production key
//    Dashboard: https://developers.tosspayments.com/
//
// 3. SERVER-SIDE CONFIRMATION (required by Toss):
//    After redirect-back, the client receives paymentKey + orderId + amount.
//    You must call the Toss Payments confirm API from your server:
//      POST https://api.tosspayments.com/v1/payments/confirm
//      Authorization: Basic base64(secretKey + ":")
//      Body: { paymentKey, orderId, amount }
//    Without this step, the payment is NOT finalized.
//
//    Implement this in a Firebase Cloud Function or a Vercel edge function
//    and call it from App.tsx inside handlePaymentCallback().
//    Until then, the callback handler in App.tsx skips server confirmation
//    and grants access optimistically (fine for testing, not for production).
//
// 4. WEBHOOK (recommended for production):
//    Register your webhook endpoint in the Toss dashboard so that
//    payment status changes (cancellations, failures) are reflected server-side.
//
// SDK docs: https://docs.tosspayments.com/reference/widget-sdk
// ─────────────────────────────────────────────────────────────────────────────

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string | undefined

export const tossAdapter: PaymentAdapter = {
  async startCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    if (!CLIENT_KEY) {
      console.error('[TossPayments] VITE_TOSS_CLIENT_KEY is not set.')
      return { success: false, error: 'Toss client key missing — set VITE_TOSS_CLIENT_KEY' }
    }

    const product    = PRODUCTS[req.product]
    const origin     = window.location.origin
    const successUrl = req.successUrl ?? `${origin}?paymentKey={PAYMENT_KEY}&orderId={ORDER_ID}&amount={AMOUNT}`
    const failUrl    = req.failUrl    ?? `${origin}?code={ERROR_CODE}&message={MESSAGE}&orderId={ORDER_ID}`

    // TODO: uncomment once @tosspayments/tosspayments-sdk is installed
    //
    // const { TossPayments } = await import('@tosspayments/tosspayments-sdk')
    // const toss    = await TossPayments(CLIENT_KEY)
    // const payment = toss.payment({ customerKey: req.orderId })
    //
    // await payment.requestPayment({
    //   method:       'CARD',
    //   amount:       { currency: product.currency, value: product.amount },
    //   orderId:      req.orderId,
    //   orderName:    product.name,
    //   customerName: req.customerName,
    //   successUrl,
    //   failUrl,
    // })
    //
    // requestPayment() navigates the browser away.
    // This return is never reached in the normal flow.
    // Access unlock is handled in App.tsx via readPaymentCallback() on next mount.

    void product; void successUrl; void failUrl  // suppress unused warnings until TODO is resolved

    throw new Error(
      '[TossPayments] SDK not installed. Run: npm install @tosspayments/tosspayments-sdk'
    )
  },
}
