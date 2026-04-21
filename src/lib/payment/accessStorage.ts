/**
 * Persists access unlock state in localStorage, keyed per product.
 * Survives browser refresh and re-visits — until the user clears site data.
 *
 * This is a client-side convenience. For true anti-tampering you need a
 * server-side record keyed by a user account (TODO: Firebase Auth + Firestore).
 */

import type { ProductKey } from './types'

const PREFIX = 'firob_access_'

interface AccessRecord {
  orderId:   string
  unlockedAt: number  // epoch ms
  amount?:   number
}

function key(product: ProductKey): string {
  return `${PREFIX}${product}`
}

export function saveAccess(product: ProductKey, record: AccessRecord): void {
  try {
    localStorage.setItem(key(product), JSON.stringify(record))
  } catch {
    // storage unavailable (e.g. private mode) — fall back to session-only unlock
  }
}

export function hasAccess(product: ProductKey): boolean {
  try {
    return localStorage.getItem(key(product)) != null
  } catch {
    return false
  }
}

export function readAccess(product: ProductKey): AccessRecord | null {
  try {
    const raw = localStorage.getItem(key(product))
    if (!raw) return null
    return JSON.parse(raw) as AccessRecord
  } catch {
    return null
  }
}

export function clearAccess(product: ProductKey): void {
  try {
    localStorage.removeItem(key(product))
  } catch {
    /* ignore */
  }
}

export function clearAllAccess(): void {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
