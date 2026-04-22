import { ACTIVE_PROVIDER, PRODUCTS } from './config'
import { mockAdapter } from './mock'
import type { PaymentAdapter, CheckoutRequest, CheckoutResult, ProductKey } from './types'

async function getAdapter(): Promise<PaymentAdapter> {
  switch (ACTIVE_PROVIDER) {
    case 'toss': {
      const { tossAdapter } = await import('./providers/toss')
      return tossAdapter
    }
    case 'polar': {
      const { polarAdapter } = await import('./providers/polar')
      return polarAdapter
    }
    default:
      return mockAdapter
  }
}

/**
 * Entry point for all checkout flows.
 * The calling component does not need to know which provider is active.
 *
 * For redirect-based providers (Toss, Polar), this function navigates the
 * browser away and the returned promise never resolves in the same session.
 * The app must handle the return via readPaymentCallback() on next mount.
 *
 * For the mock provider, the promise resolves immediately with success.
 */
export async function startCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
  const adapter = await getAdapter()
  return adapter.startCheckout(req)
}

/**
 * Creates a unique order ID suitable for Toss Payments (6–64 alphanumeric chars).
 */
export function generateOrderId(prefix = 'firob'): string {
  const ts  = Date.now().toString(36)
  const rnd = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${ts}_${rnd}`
}

/**
 * Format a PaymentProduct's price for display.
 * KRW → "9,900원"
 * USD → "$19"
 */
export function formatPrice(p: { amount: number; currency: 'KRW' | 'USD' }): string {
  if (p.currency === 'USD') return `$${p.amount}`
  return `${p.amount.toLocaleString()}원`
}

// Re-exports for convenience
export { ACTIVE_PROVIDER, PRODUCTS }
export type { ProductKey, CheckoutRequest, CheckoutResult }
export { readPaymentCallback, clearPaymentCallback } from './callback'
export { savePendingSession, loadPendingSession, clearPendingSession } from './session'
export type { PendingSession } from './session'
export { confirmPayment } from './confirmPayment'
export { confirmPolarCheckout } from './confirmPolar'
export { saveAccess, hasAccess, readAccess, clearAccess, clearAllAccess } from './accessStorage'
