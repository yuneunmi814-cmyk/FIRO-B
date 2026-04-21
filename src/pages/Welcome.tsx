import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import PartnershipForm from '../components/PartnershipForm';
import DisqusSection from '../components/DisqusSection';

interface Props {
  onStart: (name: string) => void;
}

export default function Welcome({ onStart }: Props) {
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
            <span className="wl-badge">FIRO-B 심리검사</span>
            <h1 className="wl-hero-title">
              나를 가장 잘<br />
              <em className="wl-em">보완</em>해 주는<br />
              배우자를 찾으세요
            </h1>
            <p className="wl-hero-desc">
              54문항의 FIRO-B 심리분석으로 소속·통제·정서 욕구를
              진단하고, 깊은 궁합과 갈등 해결 유형을 알아보세요.
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
                실시간 궁합 분석
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
                <span className="wl-card-match-label">종합 매칭 점수</span>
                <span className="wl-card-match-val">94%</span>
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
              <h2 className="wl-section-title">연결의 방법론</h2>
              <p className="wl-section-sub">
                스와이프를 과학으로 대체합니다. 3단계 분석 과정이
                행동 데이터를 기반으로 진정한 관계를 안내합니다.
              </p>
            </div>
            <span className="wl-method-num">01—03</span>
          </div>

          <div className="wl-step-grid">
            {[
              {
                num: '01',
                icon: '🧠',
                color: '#7C6FFF',
                bg: '#EAE7FF',
                title: '심리 프로파일',
                desc: 'FIRO-B 이론에 기반한 54문항으로 소속·통제·정서 욕구를 정밀하게 측정합니다.',
                offset: false,
              },
              {
                num: '02',
                icon: '🔗',
                color: '#43D39E',
                bg: '#E8FBF3',
                title: '깊은 매칭 분석',
                desc: '표출행동과 기대행동의 균형을 분석해 나와 심리적으로 보완되는 파트너 유형을 도출합니다.',
                offset: true,
              },
              {
                num: '03',
                icon: '📋',
                color: '#FF9F43',
                bg: '#FFF4E6',
                title: '종합 리포트',
                desc: '이상적인 배우자 프로필, 갈등 해결 방식, 조직 내 역할까지 상세한 리포트를 제공합니다.',
                offset: false,
              },
            ].map(({ num, icon, color, bg, title, desc, offset }) => (
              <div key={num} className={`wl-step-card${offset ? ' wl-step-card--offset' : ''}`}>
                <div className="wl-step-icon" style={{ background: bg, color }}>
                  {icon}
                </div>
                <span className="wl-step-num" style={{ color: color + '55' }}>{num}</span>
                <h3 className="wl-step-title">{title}</h3>
                <p className="wl-step-desc">{desc}</p>
                <div className="wl-step-bar" style={{ background: color }} />
              </div>
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
              <span className="wl-orbit-pct">98%</span>
              <span className="wl-orbit-lbl">정확도</span>
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
            나와 맞는 배우자,<br />여기서 찾으세요.
          </h2>
          <p className="wl-start-desc">
            약 5~10분 · 54문항 · 무료 제공
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
            {['📝 총 54문항', '⏱️ 5~10분 소요', '💌 배우자 궁합 + 갈등 리포트', '🔒 개인정보 수집 없음'].map(t => (
              <span key={t} className="wl-chip">{t}</span>
            ))}
          </div>
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
          pageUrl="https://firob.vercel.app/"
          pageIdentifier="firob-welcome"
          title="자유 게시판"
          subtitle="FIRO-B 검사 결과나 궁금한 점을 자유롭게 나눠보세요"
        />
      </div>
    </div>
  );
}
