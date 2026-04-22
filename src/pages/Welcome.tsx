import AdBanner from '../components/AdBanner';
import ReportPreview from '../components/ReportPreview';

interface Props {
  onStart: (name: string) => void;
}

export default function Welcome({ onStart }: Props) {
  return (
    <div className="welcome-page">
      {/* ── HERO : 문제 공감 + 강력한 CTA ── */}
      <div className="welcome-hero">
        <div className="welcome-badge">FIRO 이론 기반 · 관계 욕구 자가진단</div>

        <h1 className="welcome-title">
          나는 왜<br />혼자 있는 게<br />더 편할까?
        </h1>

        <p className="welcome-subtitle">
          혼자가 편한 당신에게, <strong>관계가 어려운 진짜 이유</strong>를 알려드립니다.
        </p>

        <button className="hero-cta-btn" onClick={() => onStart('')}>
          내 관계 분석 시작하기
          <span className="hero-cta-arrow" aria-hidden>→</span>
        </button>

        <p className="welcome-hero-meta">
          5분 · 54문항 · 가입 불필요
        </p>
      </div>

      <div className="welcome-content">
        {/* ── 3개 영역 ── */}
        <div className="dimension-cards">
          <div className="dimension-card inclusion">
            <span className="dim-icon">🤝</span>
            <h3>포용 <span className="dim-en">(Inclusion)</span></h3>
            <p>사람들과 얼마나 함께하고 싶은지</p>
          </div>
          <div className="dimension-card control">
            <span className="dim-icon">⚡</span>
            <h3>통제 <span className="dim-en">(Control)</span></h3>
            <p>누가 관계를 주도해야 편한지</p>
          </div>
          <div className="dimension-card affection">
            <span className="dim-icon">❤️</span>
            <h3>애정 <span className="dim-en">(Affection)</span></h3>
            <p>얼마나 사랑을 주고받고 싶은지</p>
          </div>
        </div>

        {/* ── 결과 리포트 미리보기 ── */}
        <ReportPreview />

        {/* ── 가치 뱃지 ── */}
        <div className="welcome-info">
          <div className="info-item">
            <span className="info-icon">⏱</span>
            <span>5분이면 결과 확인 가능</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span>당신의 관계 패턴 바로 분석</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💡</span>
            <span>갈등 원인 + 해결 방법 제공</span>
          </div>
        </div>

        <AdBanner slot="4444444444" format="horizontal" />

        <p className="welcome-note">
          각 문항은 1~6점으로 답변합니다.<br />
          솔직하게 답할수록 정확한 결과를 얻을 수 있어요.
        </p>
      </div>
    </div>
  );
}
