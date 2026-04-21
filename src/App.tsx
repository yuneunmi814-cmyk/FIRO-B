import { useState, useEffect } from 'react';
import type { Answers, FIROBScores } from './types';
import { calculateScores, getDimTotals, getGrandTotalLabel } from './utils/analysis';
import { postToFormspree } from './utils/formspree';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Welcome from './pages/Welcome';
import Test from './pages/Test';
import Results from './pages/Results';
import {
  startCheckout,
  generateOrderId,
  readPaymentCallback,
  clearPaymentCallback,
  loadPendingSession,
  clearPendingSession,
  savePendingSession,
  confirmPayment,
  saveAccess,
  hasAccess as hasStoredAccess,
  clearAllAccess,
  ACTIVE_PROVIDER,
} from './lib/payment';
import './App.css';

type Page = 'welcome' | 'test' | 'results';

function App() {
  const [page, setPage]         = useState<Page>('welcome');
  const [scores, setScores]     = useState<FIROBScores | null>(null);
  const [userName, setUserName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // ── Handle return from payment redirect (Toss / Polar) ──────────────────
  useEffect(() => {
    // Restore previously purchased access on mount (survives refresh)
    if (hasStoredAccess('individual_report')) {
      setHasAccess(true);
    }

    const cb = readPaymentCallback();
    if (cb.status === 'none') return;

    clearPaymentCallback();

    if (cb.status === 'fail') {
      alert(`결제에 실패했습니다. 다시 시도해 주세요.\n(${cb.errorCode}: ${cb.errorMessage})`);
      clearPendingSession();
      return;
    }

    if (cb.status === 'success' && cb.paymentKey && cb.orderId && cb.amount) {
      const session = loadPendingSession();

      (async () => {
        // Call our Vercel Function → Toss /v1/payments/confirm
        const confirmed = await confirmPayment(cb.paymentKey!, cb.orderId!, cb.amount!);

        if (!confirmed.success) {
          alert(`결제 승인에 실패했습니다.\n${confirmed.error ?? ''}`);
          clearPendingSession();
          return;
        }

        // Persist access so refreshing doesn't lock the report again
        saveAccess('individual_report', {
          orderId:    cb.orderId!,
          unlockedAt: Date.now(),
          amount:     cb.amount,
        });
        clearPendingSession();

        if (session) {
          setScores(session.scores);
          setUserName(session.userName);
          setTestDate(session.testDate);
          setHasAccess(true);
          setPage('results');
        } else {
          setHasAccess(true);
        }
      })();
    }
  }, []); // runs once on mount

  // ── Request unlock (called by PaywallCTA / LockedSection) ───────────────
  const handleRequestUnlock = async (): Promise<void> => {
    if (unlocking) return;
    setUnlocking(true);

    try {
      // Save scores to sessionStorage so they survive a page redirect
      if (scores) {
        savePendingSession({ scores, userName, testDate, product: 'individual_report' });
      }

      const result = await startCheckout({
        product:      'individual_report',
        orderId:      generateOrderId(),
        customerName: userName || undefined,
      });

      if (result.success) {
        // Mock provider resolves here; redirect providers never reach this line
        saveAccess('individual_report', {
          orderId:    result.orderId ?? 'mock',
          unlockedAt: Date.now(),
        });
        setHasAccess(true);
        clearPendingSession();
      } else if (result.error && result.error !== 'redirecting') {
        alert(`결제를 시작할 수 없습니다: ${result.error}`);
        clearPendingSession();
      }
      // If redirecting: browser navigates away — no further code runs
    } catch (err) {
      console.error('[Payment] Checkout error:', err);
      alert('결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      clearPendingSession();
    } finally {
      setUnlocking(false);
    }
  };

  // ── Test lifecycle ────────────────────────────────────────────────────────
  const handleStart = (name: string) => {
    setUserName(name);
    setHasAccess(false);
    setPage('test');
  };

  const handleComplete = (answers: Answers) => {
    const computed = calculateScores(answers);
    const date = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
    setScores(computed);
    setTestDate(date);
    setPage('results');

    const totals = getDimTotals(computed);
    postToFormspree({
      _subject: `[FIRO-B] 검사 완료 — ${userName || '익명'}`,
      유형: '검사_완료_자동_알림',
      이름: userName || '익명',
      검사일: date,
      eI: computed.eI.toFixed(1), wI: computed.wI.toFixed(1),
      eC: computed.eC.toFixed(1), wC: computed.wC.toFixed(1),
      eA: computed.eA.toFixed(1), wA: computed.wA.toFixed(1),
      소속_총합: `${totals.inclusion.toFixed(1)} / 18`,
      통제_총합: `${totals.control.toFixed(1)} / 18`,
      정서_총합: `${totals.affection.toFixed(1)} / 18`,
      욕구_총합: `${totals.grand.toFixed(1)} (${getGrandTotalLabel(totals.grand)})`,
    });
  };

  const handleRetake = () => {
    setScores(null);
    setHasAccess(false);
    clearAllAccess();
    setPage('welcome');
  };

  // Dev banner so it is always clear which payment mode is active
  const isDev = import.meta.env.DEV;

  return (
    <>
      {isDev && ACTIVE_PROVIDER === 'mock' && (
        <div style={{
          background: '#FEF9C3', borderBottom: '1px solid #FCD34D',
          textAlign: 'center', padding: '6px 12px', fontSize: '12px', color: '#92400E',
        }}>
          결제 모드: <strong>mock</strong> — 실제 결제 없이 즉시 잠금 해제됩니다
          (VITE_PAYMENT_PROVIDER로 변경 가능)
        </div>
      )}
      <SiteHeader />
      {page === 'welcome' && <Welcome onStart={handleStart} />}
      {page === 'test'    && <Test onComplete={handleComplete} />}
      {page === 'results' && scores && (
        <Results
          scores={scores}
          userName={userName}
          testDate={testDate}
          hasAccess={hasAccess}
          unlocking={unlocking}
          onRequestUnlock={handleRequestUnlock}
          onRetake={handleRetake}
        />
      )}
      <SiteFooter />
    </>
  );
}

export default App;
