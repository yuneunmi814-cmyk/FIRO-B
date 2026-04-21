export type PaymentProvider = 'mock' | 'toss' | 'polar'

export type ProductKey =
  | 'individual_report'
  | 'couple_addon'
  | 'consultation_deposit'

export interface PaymentProduct {
  key: ProductKey
  name: string      // shown in checkout UI and order name
  amount: number    // KRW, integer (Toss requires integer)
  currency: 'KRW'
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
