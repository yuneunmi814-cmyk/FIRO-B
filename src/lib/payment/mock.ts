import type { PaymentAdapter, CheckoutRequest, CheckoutResult } from './types'
import { PRODUCTS } from './config'

export const mockAdapter: PaymentAdapter = {
  async startCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    const product = PRODUCTS[req.product]
    // Simulate network latency so loading states are visible during development
    await new Promise(r => setTimeout(r, 700))
    console.info(
      `[PaymentMock] ✅ Checkout succeeded — ${product.name} (${product.amount.toLocaleString()}원) orderId=${req.orderId}`
    )
    return {
      success: true,
      orderId: req.orderId,
      paymentKey: `mock_${Date.now()}`,
    }
  },
}
