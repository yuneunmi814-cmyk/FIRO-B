import { useState } from 'react';
import type { FIROBScores } from '../types';
import {
  startCheckout,
  generateOrderId,
  savePendingSession,
  PRODUCTS,
  formatPrice,
} from '../lib/payment';
import { postToFormspree } from '../utils/formspree';

interface Props {
  scores: FIROBScores;
  userName: string;
  testDate: string;
}

const LOCKED_FEATURES = [
  { icon: '💑', text: '이상적인 파트너 프로파일 · 잘 맞는 유형 / 주의할 유형' },
  { icon: '🛡️', text: '갈등 해결 방식 · 강점·약점·실천 팁' },
  { icon: '🏢', text: '조직에서 자연스럽게 맡게 되는 역할' },
  { icon: '📋', text: '퇴사 전 자기 점검 체크리스트 (내 FIRO 패턴에 맞춰 개인화)' },
  { icon: '🎯', text: '이번 주 해볼 수 있는 3가지 작은 자기 실험' },
  { icon: '🔍', text: '점수 카드별 심층 해석 (강점·약점·일상 예시)' },
  { icon: '📄', text: 'PDF 다운로드 · 이메일 전송 · 영구 재열람' },
];

// When the payment provider is undergoing approval review, we keep the paywall
// UI intact (so reviewers can verify the product structure) but re-route the
// click into a waitlist email capture instead of redirecting to the provider's
// error page. Flip VITE_PAYMENT_UNDER_REVIEW=false once approval lands.
const UNDER_REVIEW = import.meta.env.VITE_PAYMENT_UNDER_REVIEW === 'true';

export default function ReportPaywall({ scores, userName, testDate }: Props) {
  const [unlocking, setUnlocking] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const product = PRODUCTS.individual_report;
  const priceLabel = formatPrice(product);

  const handleUnlock = async () => {
    if (unlocking) return;

    if (UNDER_REVIEW) {
      setWaitlistOpen(true);
      return;
    }

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

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistStatus === 'loading') return;

    const email = waitlistEmail.trim();
    if (!email || !email.includes('@')) {
      setWaitlistStatus('error');
      return;
    }

    setWaitlistStatus('loading');
    const ok = await postToFormspree({
      _subject: '[FIRO-B] 결제 오픈 알림 대기자 등록',
      form_type: 'payment_waitlist',
      email,
      user_name: userName || '익명',
      test_date: testDate,
      note: 'User signed up to be notified when payment opens (Polar under review).',
    });
    setWaitlistStatus(ok ? 'success' : 'error');
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

      {UNDER_REVIEW && waitlistOpen && (
        <div className="rpt-paywall-waitlist">
          {waitlistStatus === 'success' ? (
            <div className="rpt-waitlist-success">
              <p className="rpt-waitlist-title">✅ 등록 완료!</p>
              <p className="rpt-waitlist-body">
                결제 오픈 시 <strong>{waitlistEmail}</strong>로 가장 먼저 알려드릴게요.
                보통 1~3일 내 승인 예정입니다. 감사합니다.
              </p>
            </div>
          ) : (
            <>
              <p className="rpt-waitlist-title">⏳ 결제 시스템 최종 승인 대기 중</p>
              <p className="rpt-waitlist-body">
                현재 결제 파트너사의 최종 승인 절차 중입니다. 이메일을 남겨 주시면
                <strong> 결제 오픈 직후 가장 먼저 알림</strong>을 보내드릴게요.
                (보통 1~3일 내 오픈 예정)
              </p>
              <form className="rpt-waitlist-form" onSubmit={handleWaitlistSubmit}>
                <input
                  type="email"
                  className="rpt-waitlist-input"
                  placeholder="이메일 주소"
                  value={waitlistEmail}
                  onChange={(e) => {
                    setWaitlistEmail(e.target.value);
                    if (waitlistStatus === 'error') setWaitlistStatus('idle');
                  }}
                  required
                  aria-label="알림 받을 이메일"
                />
                <button
                  type="submit"
                  className="rpt-waitlist-submit"
                  disabled={waitlistStatus === 'loading'}
                >
                  {waitlistStatus === 'loading' ? '전송 중…' : '알림 받기'}
                </button>
              </form>
              {waitlistStatus === 'error' && (
                <p className="rpt-waitlist-error">
                  이메일을 확인해 주세요. 문제가 계속되면 yuneunmi814@gmail.com으로 연락 주세요.
                </p>
              )}
              <p className="rpt-waitlist-note">
                ※ 지금은 결제를 받지 않습니다. 요금은 오픈 시점에 안내드립니다.
              </p>
            </>
          )}
        </div>
      )}

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
