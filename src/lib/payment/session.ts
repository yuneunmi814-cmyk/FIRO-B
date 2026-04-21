/**
 * Persists test results to sessionStorage before a payment redirect.
 * Restored on the next mount so the results page is shown after Toss/Polar
 * redirects back to the app root (which would otherwise reset state).
 */

import type { FIROBScores } from '@/types'

const KEY = 'firob_pending_session'

export interface PendingSession {
  scores: FIROBScores
  userName: string
  testDate: string
  product: string
}

export function savePendingSession(data: PendingSession): void {
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function loadPendingSession(): PendingSession | null {
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingSession
  } catch {
    return null
  }
}

export function clearPendingSession(): void {
  sessionStorage.removeItem(KEY)
}
