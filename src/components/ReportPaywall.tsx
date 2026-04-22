import { useState } from 'react';
import type { FIROBScores } from '../types';
import {
  startCheckout,
  generateOrderId,
  savePendingSession,
  PRODUCTS,
  formatPrice,
} from '../lib/payment';

interface Props {
  scores: FIROBScores;
  userName: string;
  testDate: string;
}

const LOCKED_FEATURES = [
  { icon: '💑', text: '이상적인 파트너 프로파일 · 잘 맞는 유형 / 주의할 유형' },
  { icon: '🛡️', text: '갈등 해결 방식 · 강점·약점·실천 팁' },
  { icon: '🏢', text: '조직에서 자연스럽게 맡게 되는 역할' },
  { icon: '🔍', text: '점수 카드별 심층 해석 (강점·약점·일상 예시)' },
  { icon: '📄', text: 'PDF 다운로드 · 이메일 전송 · 영구 재열람' },
];

export default function ReportPaywall({ scores, userName, testDate }: Props) {
  const [unlocking, setUnlocking] = useState(false);
  const product = PRODUCTS.individual_report;
  const priceLabel = formatPrice(product);

  const handleUnlock = async () => {
    if (unlocking) return;
    setUnlocking(true);

    const orderId = generateOrderId();
    savePendingSession({ scores, userName, testDate, product: 'individual_report' });

    try {
      const result = await startCheckout({
        product: 'individual_report',
        orderId,
        customerName: userName,
      });

      // Polar/Toss redirect paths return {success:false, error:'redirecting'}
      // and never actually reach here before page navigation. If we DO get
      // here, either the redirect was blocked or we're running the mock
      // adapter — unlock the UI and surface the reason.
      if (result.error === 'redirecting') {
        // page is navigating; leave unlocking=true
        return;
      }
      if (!result.success) {
        alert(`결제 진입 실패: ${result.error ?? '알 수 없는 오류'}`);
      } else {
        // success path only fires for mockAdapter in dev mode
        console.warn('[Paywall] Checkout resolved without redirect. Payment provider may be set to "mock".');
        alert('결제 모듈이 개발(mock) 모드입니다. Cloudflare Pages의 VITE_PAYMENT_PROVIDER 환경변수가 polar로 설정되어 있는지 확인해 주세요.');
      }
      setUnlocking(false);
    } catch (err) {
      console.error('[Paywall] checkout error:', err);
      alert('결제 시작 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setUnlocking(false);
    }
  };

  return (
    <section className="rpt-paywall no-capture">
      <div className="rpt-paywall-top">
        <span className="rpt-paywall-badge">🔒 전체 리포트 잠금 해제</span>
        <h3 className="rpt-paywall-title">
          당신만의 관계 패턴을<br />
          <span className="rpt-paywall-accent">깊이 있게 확인해 보세요</span>
        </h3>
        <p className="rpt-paywall-sub">
          위의 점수는 요약일 뿐이에요. 아래 잠긴 섹션에 "왜 그렇게 행동하는지"에 대한
          심층 해석과 관계·조직에서 활용 가능한 실천 가이드가 모두 담겨 있습니다.
        </p>
      </div>

      <ul className="rpt-paywall-features">
        {LOCKED_FEATURES.map((f) => (
          <li key={f.text} className="rpt-paywall-feature">
            <span className="rpt-paywall-feature-icon">{f.icon}</span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="rpt-paywall-cta-wrap">
        <button
          type="button"
          className="rpt-paywall-cta"
          onClick={handleUnlock}
          disabled={unlocking}
        >
          {unlocking ? '결제 준비 중…' : '전체 리포트 잠금 해제'}
          {!unlocking && <span className="rpt-paywall-cta-arrow">→</span>}
        </button>
        <p className="rpt-paywall-price">
          {priceLabel} · 1회 결제 · 결제 직후 즉시 열람
        </p>
        <p className="rpt-paywall-assurance">
          ✓ 가입 불필요 &nbsp; ✓ PDF 영구 재열람 &nbsp; ✓ 이메일 전송 포함
        </p>
      </div>

      <div className="rpt-paywall-disclaimer">
        <p className="rpt-paywall-disclaimer-title">
          📘 교육용 자가진단 · 의학적·심리학적 자문 아님
        </p>
        <p>
          본 리포트는 <strong>자기이해를 위한 교육용 자가진단 콘텐츠</strong>이며,
          의학적 진단·치료·심리 상담을 제공하지 않습니다. 결과는 관계 패턴을
          스스로 돌아보는 참고 자료로만 활용해 주세요.
        </p>
        <p className="rpt-paywall-disclaimer-en">
          This report is an <strong>educational self-reflection product</strong>.
          It is not a medical device, clinical assessment, or psychological
          advice service, and is not intended to diagnose, treat, cure, or
          prevent any condition. Results are for personal self-understanding
          only. Not affiliated with the FIRO-B<sup>®</sup> instrument by The
          Myers-Briggs Company.
        </p>
      </div>
    </section>
  );
}
