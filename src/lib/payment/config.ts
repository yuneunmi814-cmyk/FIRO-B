import type { PaymentProvider, PaymentProduct, ProductKey } from './types'

/**
 * Active provider is controlled by VITE_PAYMENT_PROVIDER env var.
 * Falls back to 'mock' so the app works in development without any credentials.
 *
 * .env values:
 *   VITE_PAYMENT_PROVIDER=mock    → instant simulated unlock (default)
 *   VITE_PAYMENT_PROVIDER=toss   → Toss Payments (requires VITE_TOSS_CLIENT_KEY)
 *   VITE_PAYMENT_PROVIDER=polar  → Polar (requires VITE_POLAR_* checkout URLs)
 */
export const ACTIVE_PROVIDER: PaymentProvider =
  (import.meta.env.VITE_PAYMENT_PROVIDER as PaymentProvider | undefined) ?? 'mock'

export const PRODUCTS: Record<ProductKey, PaymentProduct> = {
  individual_report: {
    key: 'individual_report',
    name: '관계 욕구 자가진단 전체 리포트',
    amount: 19,
    currency: 'USD',
  },
}
