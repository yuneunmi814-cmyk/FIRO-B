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
  readPaymentCallback,
  clearPaymentCallback,
  loadPendingSession,
  clearPendingSession,
  confirmPayment,
  confirmPolarCheckout,
  saveAccess,
} from './lib/payment';
import './App.css';

type Page = 'welcome' | 'test' | 'results';

function App() {
  const [page, setPage]         = useState<Page>('welcome');
  const [scores, setScores]     = useState<FIROBScores | null>(null);
  const [userName, setUserName] = useState('');
  const [testDate, setTestDate] = useState('');

  // Payment redirect handler kept wired for Toss / Polar returns.
  // Access persistence stays so re-adding paywall later is a drop-in change.
  useEffect(() => {
    const cb = readPaymentCallback();
    if (cb.status === 'none') return;
    clearPaymentCallback();

    if (cb.status === 'fail') {
      alert(`결제에 실패했습니다.\n(${cb.errorCode}: ${cb.errorMessage})`);
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
        const r = await confirmPayment(cb.paymentKey, cb.orderId, cb.amount);
        if (r.success) {
          ok = true;
          unlockedOrderId = cb.orderId;
          unlockedAmount  = cb.amount;
        } else {
          alert(`결제 승인 실패: ${r.error ?? ''}`);
        }
      } else if (cb.provider === 'polar' && cb.checkoutId) {
        const r = await confirmPolarCheckout(cb.checkoutId);
        if (r.success) {
          ok = true;
          unlockedOrderId = r.internalOrderId ?? cb.checkoutId;
          unlockedAmount  = r.amount;
        } else {
          alert(`결제 확인 실패: ${r.error ?? ''}`);
        }
      }

      clearPendingSession();
      if (!ok) return;

      saveAccess('individual_report', {
        orderId: unlockedOrderId,
        unlockedAt: Date.now(),
        amount: unlockedAmount,
      });

      if (session) {
        setScores(session.scores);
        setUserName(session.userName);
        setTestDate(session.testDate);
        setPage('results');
      }
    })();
  }, []);

  const handleStart = (name: string) => {
    setUserName(name);
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
    setPage('welcome');
  };

  return (
    <>
      <SiteHeader />
      {page === 'welcome' && <Welcome onStart={handleStart} />}
      {page === 'test'    && <Test onComplete={handleComplete} />}
      {page === 'results' && scores && (
        <Results
          scores={scores}
          userName={userName}
          testDate={testDate}
          onRetake={handleRetake}
        />
      )}
      <SiteFooter />
    </>
  );
}

export default App;
