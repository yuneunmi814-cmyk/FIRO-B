/**
 * Client-side helper that calls /api/confirm-polar to verify a Polar
 * checkout reached a completed state before unlocking access.
 */

import type { ProductKey } from './types'

export interface ConfirmPolarResult {
  success: boolean
  checkoutId?: string
  productKey?: ProductKey | null
  amount?: number
  internalOrderId?: string | null
  error?: string
}

export async function confirmPolarCheckout(checkoutId: string): Promise<ConfirmPolarResult> {
  try {
    const res = await fetch('/api/confirm-polar', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ checkoutId }),
    })
    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data.error ?? `HTTP ${res.status}` }
    }

    return {
      success:         true,
      checkoutId:      data.checkoutId,
      productKey:      data.productKey,
      amount:          data.amount,
      internalOrderId: data.internalOrderId,
    }
  } catch (err) {
    console.error('[confirmPolarCheckout] Network error:', err)
    return { success: false, error: 'Network error' }
  }
}
