/**
 * Reads payment-provider redirect params from the current URL.
 *
 * Toss Payments (after payment.requestPayment redirect):
 *   Success: ?paymentKey=…&orderId=…&amount=…
 *   Fail:    ?code=…&message=…&orderId=…
 *
 * Polar (success URL configured in product settings as
 *   https://<your-site>/?polar_checkout_id={CHECKOUT_ID}):
 *   Success: ?polar_checkout_id=…
 *   Fail:    ?polar_error=…
 */

export type PaymentCallbackProvider = 'toss' | 'polar'

export interface PaymentCallbackResult {
  status: 'success' | 'fail' | 'none'
  provider?: PaymentCallbackProvider
  // Toss
  orderId?: string
  paymentKey?: string
  amount?: number
  // Polar
  checkoutId?: string
  // Common
  errorCode?: string
  errorMessage?: string
}

export function readPaymentCallback(): PaymentCallbackResult {
  const params = new URLSearchParams(window.location.search)

  // ── Toss Payments ──────────────────────────────────────────────────────
  if (params.has('paymentKey') && params.has('orderId')) {
    return {
      status:     'success',
      provider:   'toss',
      paymentKey: params.get('paymentKey') ?? undefined,
      orderId:    params.get('orderId')    ?? undefined,
      amount:     Number(params.get('amount')),
    }
  }

  if (params.has('code') && params.has('orderId') && !params.has('polar_checkout_id')) {
    return {
      status:       'fail',
      provider:     'toss',
      orderId:      params.get('orderId')  ?? undefined,
      errorCode:    params.get('code')     ?? undefined,
      errorMessage: params.get('message')  ?? undefined,
    }
  }

  // ── Polar ──────────────────────────────────────────────────────────────
  if (params.has('polar_checkout_id')) {
    return {
      status:     'success',
      provider:   'polar',
      checkoutId: params.get('polar_checkout_id') ?? undefined,
    }
  }

  if (params.has('polar_error')) {
    return {
      status:       'fail',
      provider:     'polar',
      errorCode:    params.get('polar_error') ?? undefined,
      errorMessage: params.get('polar_error_description') ?? undefined,
    }
  }

  return { status: 'none' }
}

export function clearPaymentCallback(): void {
  const url = new URL(window.location.href)
  ;[
    'paymentKey', 'orderId', 'amount', 'code', 'message',
    'polar_checkout_id', 'polar_error', 'polar_error_description',
  ].forEach(k => url.searchParams.delete(k))
  window.history.replaceState(null, '', url.toString())
}
