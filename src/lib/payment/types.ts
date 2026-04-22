export type PaymentProvider = 'mock' | 'toss' | 'polar'

export type ProductKey = 'individual_report'

export interface PaymentProduct {
  key: ProductKey
  name: string      // shown in checkout UI and order name
  amount: number    // major units (KRW integer, USD whole dollars)
  currency: 'KRW' | 'USD'
}

export interface CheckoutRequest {
  product: ProductKey
  orderId: string         // unique per attempt — use generateOrderId()
  customerName?: string
  successUrl?: string     // defaults to current origin; Toss appends its own params
  failUrl?: string        // defaults to current origin
  metadata?: Record<string, string>
}

export interface CheckoutResult {
  success: boolean
  orderId?: string
  paymentKey?: string
  error?: string
}

export interface PaymentAdapter {
  startCheckout(req: CheckoutRequest): Promise<CheckoutResult>
}
