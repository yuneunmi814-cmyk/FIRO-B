import { useState, useEffect } from 'react';
import type { Answers, FIROBScores } from './types';
import { calculateScores, getDimTotals, getGrandTotalLabel } from './utils/analysis';
import { postToFormspree } from './utils/formspree';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Welcome from './pages/Welcome';
import Test from './pages/Test';
import Results from './pages/Results';
import StepDetail from './pages/StepDetail';
import type { StepVariant } from './components/StepDetailModal';
import {
  startCheckout,
  generateOrderId,
  readPaymentCallback,
  clearPaymentCallback,
  loadPendingSession,
  clearPendingSession,
  savePendingSession,
  confirmPayment,
  confirmPolarCheckout,
  saveAccess,
  hasAccess as hasStoredAccess,
  clearAllAccess,
  ACTIVE_PROVIDER,
} from './lib/payment';
import './App.css';

type Page = 'welcome' | 'test' | 'results' | 'detail';

function App() {
  const [page, setPage]         = useState<Page>('welcome');
  const [detailVariant, setDetailVariant] = useState<StepVariant>('profile');
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

    if (cb.status !== 'success') return;

    const session = loadPendingSession();

    (async () => {
      let ok = false;
      let unlockedOrderId = '';
      let unlockedAmount: number | undefined;

      if (cb.provider === 'toss' && cb.paymentKey && cb.orderId && cb.amount) {
        // Toss requires a server-side confirm call to finalize the payment
        const r = await confirmPayment(cb.paymentKey, cb.orderId, cb.amount);
        if (r.success) {
          ok = true;
          unlockedOrderId = cb.orderId;
          unlockedAmount  = cb.amount;
        } else {
          alert(`결제 승인에 실패했습니다.\n${r.error ?? ''}`);
        }
      } else if (cb.provider === 'polar' && cb.checkoutId) {
        // Polar finalizes itself — we just verify the checkout succeeded
        const r = await confirmPolarCheckout(cb.checkoutId);
        if (r.success) {
          ok = true;
          unlockedOrderId = r.internalOrderId ?? cb.checkoutId;
          unlockedAmount  = r.amount;
        } else {
          alert(`결제 확인에 실패했습니다.\n${r.error ?? ''}`);
        }
      }

      clearPendingSession();

      if (!ok) return;

      saveAccess('individual_report', {
        orderId:    unlockedOrderId,
        unlockedAt: Date.now(),
        amount:     unlockedAmount,
      });

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

  // ── Detail page navigation ────────────────────────────────────────────────
  const handleShowDetail = (variant: StepVariant) => {
    setDetailVariant(variant);
    setPage('detail');
  };
  const handleCloseDetail = () => setPage('welcome');
  const handleStartFromDetail = () => {
    document.getElementById('wl-start')?.scrollIntoView({ behavior: 'auto' });
    setPage('welcome');
    // scroll after navigation completes
    setTimeout(() => {
      document.getElementById('wl-start')?.scrollIntoView({ behavior: 'smooth' });
    }, 30);
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

  // Dev-only mock-mode indicator (does not render in production builds)
  const showDevBanner = import.meta.env.DEV && ACTIVE_PROVIDER === 'mock';

  return (
    <>
      {showDevBanner && (
        <div style={{
          background: '#FEF9C3', borderBottom: '1px solid #FCD34D',
          textAlign: 'center', padding: '6px 12px', fontSize: '12px', color: '#92400E',
        }}>
          개발 모드 · mock 결제
        </div>
      )}
      <SiteHeader />
      {page === 'welcome' && <Welcome onStart={handleStart} onShowDetail={handleShowDetail} />}
      {page === 'test'    && <Test onComplete={handleComplete} />}
      {page === 'detail'  && (
        <StepDetail
          variant={detailVariant}
          onBack={handleCloseDetail}
          onStart={handleStartFromDetail}
        />
      )}
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
