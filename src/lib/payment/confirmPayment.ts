/**
 * Client-side helper that calls the server endpoint (/api/confirm-payment)
 * to finalize a Toss payment after the browser is redirected back from
 * the Toss checkout page.
 */

export interface ConfirmPaymentResult {
  success: boolean
  orderId?: string
  paymentKey?: string
  totalAmount?: number
  error?: string
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<ConfirmPaymentResult> {
  try {
    const res = await fetch('/api/confirm-payment', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ paymentKey, orderId, amount }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data.error ?? `HTTP ${res.status}` }
    }

    return {
      success:     true,
      orderId:     data.orderId,
      paymentKey:  data.paymentKey,
      totalAmount: data.totalAmount,
    }
  } catch (err) {
    console.error('[confirmPayment] Network error:', err)
    return { success: false, error: 'Network error' }
  }
}
