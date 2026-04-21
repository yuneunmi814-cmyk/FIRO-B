/**
 * Reads payment redirect params from the current URL.
 *
 * Toss Payments appends these params to successUrl / failUrl after checkout:
 *   Success: ?paymentKey=…&orderId=…&amount=…
 *   Fail:    ?code=…&message=…&orderId=…
 *
 * Call readPaymentCallback() once on app mount, then clearPaymentCallback()
 * to remove the params from the URL without reloading the page.
 */

export interface PaymentCallbackResult {
  status: 'success' | 'fail' | 'none'
  orderId?: string
  paymentKey?: string
  amount?: number
  errorCode?: string
  errorMessage?: string
}

export function readPaymentCallback(): PaymentCallbackResult {
  const params = new URLSearchParams(window.location.search)

  if (params.has('paymentKey') && params.has('orderId')) {
    return {
      status:     'success',
      paymentKey: params.get('paymentKey') ?? undefined,
      orderId:    params.get('orderId')    ?? undefined,
      amount:     Number(params.get('amount')),
    }
  }

  if (params.has('code') && params.has('orderId')) {
    return {
      status:       'fail',
      orderId:      params.get('orderId')  ?? undefined,
      errorCode:    params.get('code')     ?? undefined,
      errorMessage: params.get('message')  ?? undefined,
    }
  }

  return { status: 'none' }
}

export function clearPaymentCallback(): void {
  const url = new URL(window.location.href)
  ;['paymentKey', 'orderId', 'amount', 'code', 'message'].forEach(k =>
    url.searchParams.delete(k)
  )
  window.history.replaceState(null, '', url.toString())
}
