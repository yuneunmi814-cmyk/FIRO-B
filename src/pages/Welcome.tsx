import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import PartnershipForm from '../components/PartnershipForm';
import DisqusSection from '../components/DisqusSection';
import type { StepVariant } from '../components/StepDetailModal';

interface Props {
  onStart: (name: string) => void;
  onShowDetail: (variant: StepVariant) => void;
}

export default function Welcome({ onStart, onShowDetail }: Props) {
  const [name, setName] = useState('');

  const scrollToStart = () => {
    document.getElementById('wl-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="wl-page">

      {/* ── Hero ── */}
      <section className="wl-hero">
        <div className="wl-blob wl-blob--1" />
        <div className="wl-blob wl-blob--2" />

        <div className="wl-hero-inner">
          <div className="wl-hero-text">
            <span className="wl-badge">FIRO-B 대인관계 진단</span>
            <h1 className="wl-hero-title">
              나의 소통 방식,<br />
              <em className="wl-em">과학적으로</em><br />
              이해하세요
            </h1>
            <p className="wl-hero-desc">
              70년간 글로벌 기업·연구기관에서 검증된 FIRO-B 검사로
              소속·통제·정서 욕구를 진단하고, 대인관계 패턴을 정확하게 파악하세요.
            </p>
            <div className="wl-hero-btns">
              <button className="wl-btn-primary" onClick={scrollToStart}>
                검사 시작하기
              </button>
              <a className="wl-btn-ghost" href="#wl-method">
                작동 방식 →
              </a>
            </div>
          </div>

          <div className="wl-hero-visual">
            <div className="wl-hero-card">
              <div className="wl-hero-card-label">
                <span className="wl-card-dot" />
                대인관계 욕구 분석
              </div>
              <div className="wl-compat-bars">
                {[
                  { label: '소속 (Inclusion)', w: 82, color: '#43D39E' },
                  { label: '통제 (Control)',   w: 67, color: '#FF9F43' },
                  { label: '정서 (Affection)', w: 91, color: '#FF6B9D' },
                ].map(({ label, w, color }) => (
                  <div key={label} className="wl-compat-row">
                    <div className="wl-compat-track">
                      <div className="wl-compat-fill" style={{ width: `${w}%`, background: color }} />
                    </div>
                    <div className="wl-compat-meta">
                      <span className="wl-compat-label">{label}</span>
                      <span className="wl-compat-val" style={{ color }}>{w}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wl-card-footer">
                <span className="wl-card-match-label">욕구 충족 지수</span>
                <span className="wl-card-match-val">분석 완료</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 방법론 ── */}
      <section className="wl-method" id="wl-method">
        <div className="wl-section-inner">
          <div className="wl-method-head">
            <div>
              <h2 className="wl-section-title">어떻게 작동하나요</h2>
              <p className="wl-section-sub">
                3단계 분석으로 행동 데이터에 기반한 대인관계 패턴을
                체계적으로 진단하고 실질적인 인사이트를 제공합니다.
              </p>
            </div>
            <span className="wl-method-num">01—03</span>
          </div>

          <div className="wl-step-grid">
            {([
              {
                num: '01', variant: 'profile' as StepVariant,
                icon: '🧠', color: '#7C6FFF', bg: '#EAE7FF',
                title: '심리 프로파일',
                desc: 'William Schutz 박사(1958)의 FIRO-B 이론에 기반한 54문항으로 소속·통제·정서 욕구를 정밀하게 측정합니다.',
                offset: false,
              },
              {
                num: '02', variant: 'pattern' as StepVariant,
                icon: '🔗', color: '#43D39E', bg: '#E8FBF3',
                title: '패턴 심층 분석',
                desc: '표출과 기대의 간극, 9가지 조합 매트릭스, 총합 층위까지 — 단순 점수가 아닌 다층 분석으로 당신의 패턴을 읽습니다.',
                offset: true,
              },
              {
                num: '03', variant: 'sample' as StepVariant,
                icon: '📋', color: '#FF9F43', bg: '#FFF4E6',
                title: '종합 리포트',
                desc: '아키타입 · 6영역 상세 해석 · 이상적 파트너 · 갈등 해결 스타일 · 2주 행동 가이드까지 담긴 맞춤 리포트. 예시를 확인해 보세요.',
                offset: false,
              },
            ]).map(({ num, variant, icon, color, bg, title, desc, offset }) => (
              <button
                key={num}
                type="button"
                onClick={() => onShowDetail(variant)}
                className={`wl-step-card wl-step-card--btn${offset ? ' wl-step-card--offset' : ''}`}
              >
                <div className="wl-step-icon" style={{ background: bg, color }}>
                  {icon}
                </div>
                <span className="wl-step-num" style={{ color: color + '55' }}>{num}</span>
                <h3 className="wl-step-title">{title}</h3>
                <p className="wl-step-desc">{desc}</p>
                <span className="wl-step-cta" style={{ color }}>
                  자세히 보기 →
                </span>
                <div className="wl-step-bar" style={{ background: color }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIRO-B 차이점 (dark) ── */}
      <section className="wl-diff">
        <div className="wl-diff-bg-lines" aria-hidden>
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <path d="M0,100 C20,80 50,110 80,90 S100,50 100,0" fill="none" stroke="white" strokeWidth="0.08" vectorEffect="non-scaling-stroke" />
            <path d="M0,80 C30,60 40,90 70,70 S100,30 100,-20" fill="none" stroke="white" strokeWidth="0.08" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div className="wl-section-inner wl-diff-inner">
          <div className="wl-orbit-wrap">
            <div className="wl-orbit wl-orbit--1" />
            <div className="wl-orbit wl-orbit--2" />
            <div className="wl-orbit wl-orbit--3" />
            <div className="wl-orbit-glow wl-orbit-glow--a" />
            <div className="wl-orbit-glow wl-orbit-glow--b" />
            <div className="wl-orbit-center">
              <span className="wl-orbit-pct">70+</span>
              <span className="wl-orbit-lbl">년 검증</span>
            </div>
          </div>

          <div className="wl-diff-content">
            <h2 className="wl-diff-title">FIRO-B의<br />차이점.</h2>
            <div className="wl-diff-list">
              {[
                {
                  n: '01',
                  title: '소속 지향성 (Inclusion)',
                  desc: '사회적 교류와 소속감에 대한 욕구를 측정해 관계 깊이를 파악합니다.',
                },
                {
                  n: '02',
                  title: '통제 역동성 (Control)',
                  desc: '파트너십 내 리더십과 의사결정 방식에 대한 편안함을 파악합니다.',
                },
                {
                  n: '03',
                  title: '정서 수준 (Affection)',
                  desc: '친밀감·온기·감정적 취약성에 대한 욕구를 정밀하게 측정합니다.',
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="wl-diff-item">
                  <span className="wl-diff-num">{n}</span>
                  <div>
                    <h4 className="wl-diff-item-title">{title}</h4>
                    <p className="wl-diff-item-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 검사 시작 CTA ── */}
      <section className="wl-start" id="wl-start">
        <div className="wl-start-blob wl-start-blob--1" />
        <div className="wl-start-blob wl-start-blob--2" />
        <div className="wl-start-inner">
          <span className="wl-badge">지금 시작하세요</span>
          <h2 className="wl-start-title">
            나의 대인관계 유형,<br />지금 진단받으세요.
          </h2>
          <p className="wl-start-desc">
            약 5~10분 · 54문항 · 즉시 결과 확인
          </p>

          <div className="wl-start-form">
            <input
              type="text"
              className="wl-start-input"
              placeholder="이름을 입력하세요 (선택)"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
            />
            <button className="wl-btn-primary wl-start-btn" onClick={() => onStart(name)}>
              검사 시작하기
            </button>
          </div>

          <div className="wl-info-chips">
            {['📝 총 54문항', '⏱️ 5~10분 소요', '💌 소통 패턴 + 갈등 해결 리포트', '🔒 개인정보 수집 없음'].map(t => (
              <span key={t} className="wl-chip">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 학술 근거 & 신뢰성 ── */}
      <section className="wl-trust">
        <div className="wl-section-inner">
          <div className="wl-trust-head">
            <h2 className="wl-section-title">학술적으로 검증된 도구</h2>
            <p className="wl-section-sub">
              FIRO-B는 심리학자 William Schutz 박사가 1958년 개발한 대인관계 욕구 측정 도구입니다.<br />
              60년 이상 Fortune 500 기업, 대학 연구기관, 팀 빌딩 전문가들이 활용해 왔습니다.
            </p>
          </div>
          <div className="wl-trust-grid">
            {[
              { icon: '🎓', title: '학술 출판', desc: 'SCHUTZ, W. (1958). FIRO: A Three-Dimensional Theory of Interpersonal Behavior. 이후 수십 편의 동료 심사 논문으로 검증.' },
              { icon: '🏢', title: '기업 HR 활용', desc: 'Google, NASA, 글로벌 컨설팅 펌 등에서 리더십 개발, 팀 빌딩, 채용 도구로 표준 활용.' },
              { icon: '📊', title: '자기보고식 진단', desc: '임상 진단이 아닌 개인 성장·자기 이해를 목적으로 하는 자기보고식 심리 검사 소프트웨어입니다.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="wl-trust-card">
                <span className="wl-trust-icon">{icon}</span>
                <h4 className="wl-trust-title">{title}</h4>
                <p className="wl-trust-desc">{desc}</p>
              </div>
            ))}
          </div>
          <p className="wl-disclaimer">
            ⚠️ 본 서비스는 개인 성장 및 자기 이해를 목적으로 하는 자기보고식 심리 진단 소프트웨어입니다.
            임상 진단, 의료 상담, 또는 정신건강 치료를 대체하지 않습니다.
            결과는 참고용이며, 전문 상담이 필요한 경우 자격을 갖춘 심리 전문가에게 문의하시기 바랍니다.
          </p>
        </div>
      </section>

      {/* ── 기타 ── */}
      <div className="wl-bottom">
        <AdBanner slot="4444444444" format="horizontal" />
        <p className="welcome-note">
          각 문항은 1~6점으로 답변합니다.<br />
          솔직하게 답할수록 정확한 결과를 얻을 수 있어요.
        </p>
        <PartnershipForm />
        <DisqusSection
          pageUrl="https://projectyoon.com/"
          pageIdentifier="firob-welcome"
          title="자유 게시판"
          subtitle="FIRO-B 검사 결과나 궁금한 점을 자유롭게 나눠보세요"
        />
      </div>

    </div>
  );
}
