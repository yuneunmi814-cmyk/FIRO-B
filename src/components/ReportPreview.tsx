import { useEffect, useState } from 'react';

const SAMPLE_SCORES: { key: string; score: string; color: string; ko: string }[] = [
  { key: 'eI', score: '5.8', color: '#43D39E', ko: '포용 표현' },
  { key: 'wI', score: '4.2', color: '#45B7D1', ko: '포용 수용' },
  { key: 'eC', score: '5.0', color: '#FF6B6B', ko: '통제 표현' },
  { key: 'wC', score: '6.2', color: '#FF9F43', ko: '통제 수용' },
  { key: 'eA', score: '5.0', color: '#DDA0FF', ko: '애정 표현' },
  { key: 'wA', score: '5.8', color: '#FF6B9D', ko: '애정 수용' },
];

const SAMPLE_DIMS = [
  { label: '소속 (Inclusion)', value: '10.0', icon: '🤝', color: '#43D39E' },
  { label: '통제 (Control)', value: '11.2', icon: '⚡', color: '#FF9F43' },
  { label: '정서 (Affection)', value: '10.8', icon: '❤️', color: '#FF6B9D' },
];

const REPORT_SECTIONS = [
  { icon: '🎯', title: '핵심 결과', desc: '6개 지표(eI/wI/eC/wC/eA/wA)와 레이더 차트' },
  { icon: '📊', title: '3개 욕구 총합', desc: '소속·통제·정서 각 총점과 수준 해석' },
  { icon: '📣', title: '표출행동 vs 기대행동', desc: '내가 먼저 하는 행동과 상대에게 바라는 행동의 차이' },
  { icon: '🔍', title: '해석 요약', desc: '욕구 영역별 유형 + 종합 대인관계 프로파일' },
  { icon: '💑', title: '이상적인 배우자 프로필', desc: '잘 맞는 파트너 FIRO-B + 주의해야 할 유형' },
  { icon: '🛡️', title: '갈등 해결 방식', desc: '내 갈등 스타일의 강점·약점·실천 팁' },
  { icon: '🏢', title: '조직에서의 역할', desc: '팀 안에서 자연스럽게 맡게 되는 포지션' },
];

// Mini radar chart with sample data
function MiniRadar({ size = 180 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const angles = [-90, -30, 30, 90, 150, 210];
  const scores = [5.8, 5.0, 5.0, 5.8, 6.2, 4.2];

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (angle: number, s: number) => ({
    x: cx + (s / 9) * R * Math.cos(toRad(angle)),
    y: cy + (s / 9) * R * Math.sin(toRad(angle)),
  });

  const dataPath = angles
    .map((a, i) => {
      const p = pt(a, scores[i]);
      return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rp-mini-radar">
      {[0.33, 0.66, 1].map((t, i) => {
        const path = angles
          .map((a, j) => {
            const x = cx + t * R * Math.cos(toRad(a));
            const y = cy + t * R * Math.sin(toRad(a));
            return `${j === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ') + ' Z';
        return <path key={i} d={path} fill="none" stroke="#E0DCFF" strokeWidth={1} />;
      })}
      {angles.map((a, i) => {
        const outer = pt(a, 9);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="#E0DCFF"
            strokeWidth={1}
          />
        );
      })}
      <path d={dataPath} fill="rgba(124, 111, 255, 0.25)" stroke="#7C6FFF" strokeWidth={2} />
    </svg>
  );
}

interface MockReportProps {
  expanded?: boolean;
}

function MockReport({ expanded = false }: MockReportProps) {
  return (
    <div className={`rp-mock ${expanded ? 'rp-mock-expanded' : ''}`}>
      {/* Hero */}
      <div className="rp-mock-hero">
        <p className="rp-mock-hero-sub">FIRO-B 전문해석 프로파일</p>
        <h3 className="rp-mock-hero-title">대인관계 욕구 및 행동 프로파일</h3>
        <div className="rp-mock-meta">
          <div className="rp-mock-meta-item">
            <span className="rp-mock-meta-lbl">이름</span>
            <span className="rp-mock-meta-val rp-blur">홍길동</span>
          </div>
          <div className="rp-mock-meta-item">
            <span className="rp-mock-meta-lbl">욕구 총합</span>
            <span className="rp-mock-meta-val rp-blur">32</span>
          </div>
          <div className="rp-mock-meta-item">
            <span className="rp-mock-meta-lbl">수준</span>
            <span className="rp-mock-meta-val rp-blur">Medium-High</span>
          </div>
        </div>
      </div>

      {/* Core result */}
      <div className="rp-mock-section">
        <h4 className="rp-mock-sec-title">🎯 핵심 결과</h4>
        <div className="rp-mock-core">
          <MiniRadar size={expanded ? 220 : 160} />
          <div className="rp-mock-scores">
            {SAMPLE_SCORES.map((s) => (
              <div key={s.key} className="rp-mock-score-card">
                <div className="rp-mock-score-lbl">{s.key}</div>
                <div className="rp-mock-score-val rp-blur" style={{ color: s.color }}>
                  {s.score}
                </div>
                <div className="rp-mock-score-ko">{s.ko}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 dims */}
      <div className="rp-mock-section">
        <h4 className="rp-mock-sec-title">📊 3개 욕구 총합</h4>
        <div className="rp-mock-dim-grid">
          {SAMPLE_DIMS.map((d) => (
            <div key={d.label} className="rp-mock-dim-card" style={{ borderTop: `3px solid ${d.color}` }}>
              <span className="rp-mock-dim-icon">{d.icon}</span>
              <div className="rp-mock-dim-lbl">{d.label}</div>
              <div className="rp-mock-dim-val rp-blur" style={{ color: d.color }}>{d.value}</div>
              <div className="rp-mock-dim-max">/ 18</div>
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <>
          {/* Expressed vs Wanted */}
          <div className="rp-mock-section">
            <h4 className="rp-mock-sec-title">📣 표출행동 vs 기대행동</h4>
            <div className="rp-mock-ew">
              <div className="rp-mock-ew-card">
                <div className="rp-mock-ew-icon">📣</div>
                <div className="rp-mock-ew-lbl">표출행동 총합</div>
                <div className="rp-mock-ew-val rp-blur">15.8</div>
              </div>
              <div className="rp-mock-ew-mid rp-blur">expressed &gt; wanted</div>
              <div className="rp-mock-ew-card">
                <div className="rp-mock-ew-icon">🙏</div>
                <div className="rp-mock-ew-lbl">기대행동 총합</div>
                <div className="rp-mock-ew-val rp-blur">16.2</div>
              </div>
            </div>
          </div>

          {/* 해석 요약 */}
          <div className="rp-mock-section">
            <h4 className="rp-mock-sec-title">🔍 해석 요약</h4>
            <div className="rp-mock-types">
              <div className="rp-mock-type-chip">
                <span>🤝 소속</span>
                <span className="rp-blur">사교적 교류형</span>
              </div>
              <div className="rp-mock-type-chip">
                <span>⚡ 통제</span>
                <span className="rp-blur">협력적 리더형</span>
              </div>
              <div className="rp-mock-type-chip">
                <span>❤️ 정서</span>
                <span className="rp-blur">정서적 개방형</span>
              </div>
            </div>
            <p className="rp-mock-paragraph rp-blur">
              대인관계 욕구 총합이 중상 수준으로, 다양한 사람들과 교류하는 것을 즐기며 사회적 연결을
              중요하게 여깁니다. 활발한 대인관계 속에서 에너지를 얻는 경향이 있습니다. 소속 욕구가
              높아 다양한 사람들과 함께하는 것을 즐기며, 그룹 활동과 커뮤니티에 적극적으로 참여합니다.
            </p>
          </div>

          {/* Partner */}
          <div className="rp-mock-section">
            <h4 className="rp-mock-sec-title">💑 이상적인 배우자 프로필</h4>
            <p className="rp-mock-paragraph rp-blur">
              당신은 파트너와 적절한 교류를 유지하면서 서로의 공간도 존중합니다. 중요한 결정은 함께
              상의하며 파트너십을 이루기를 원합니다. 적절한 감정 표현과 함께 서로를 존중하는 관계를
              원합니다.
            </p>
            <div className="rp-mock-trait-row">
              <div className="rp-mock-trait-col">
                <p className="rp-mock-trait-head" style={{ color: '#22A66A' }}>✅ 이런 분을 찾으세요</p>
                <p className="rp-blur" style={{ fontSize: 12, lineHeight: 1.6 }}>
                  · 사교적이면서도 당신의 개인 공간을 이해하는 사람<br />
                  · 상황에 따라 이끌거나 따르는 역할을 유연하게 전환하는 사람<br />
                  · 적절한 감정 표현으로 관계에 따뜻함을 더해주는 사람
                </p>
              </div>
              <div className="rp-mock-trait-col">
                <p className="rp-mock-trait-head" style={{ color: '#D97035' }}>⚠️ 주의하세요</p>
                <p className="rp-blur" style={{ fontSize: 12, lineHeight: 1.6 }}>
                  · 지나치게 통제적이거나 지배적인 성향이 강한 사람<br />
                  · 당신을 자주 배제하거나 연락이 없는 사람
                </p>
              </div>
            </div>
          </div>

          {/* Conflict */}
          <div className="rp-mock-section">
            <h4 className="rp-mock-sec-title">🛡️ 갈등 해결 방식</h4>
            <div className="rp-mock-conflict">
              <span className="rp-mock-conflict-icon rp-blur">🤝</span>
              <div>
                <p className="rp-mock-conflict-lbl">주요 갈등 해결 유형</p>
                <p className="rp-mock-conflict-name rp-blur">협력형</p>
              </div>
            </div>
            <p className="rp-mock-paragraph rp-blur">
              모두가 만족하는 해결책을 찾으려 노력합니다. 시간이 걸리더라도 서로의 요구를 모두
              충족시키는 방향을 추구합니다.
            </p>
          </div>

          {/* Org role */}
          <div className="rp-mock-section">
            <h4 className="rp-mock-sec-title">🏢 조직에서의 역할</h4>
            <ul className="rp-mock-role-list">
              <li><span className="rp-blur">Initiator</span> — 새로운 아이디어와 활동을 먼저 제안</li>
              <li><span className="rp-blur">Encourager</span> — 친절하고 수용적인 분위기 형성</li>
              <li><span className="rp-blur">Harmonizer</span> — 갈등을 완화하고 팀 화합 도모</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default function ReportPreview() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <section className="report-preview-section">
      <div className="rp-header">
        <span className="rp-badge">👀 RESULTS PREVIEW</span>
        <h2 className="rp-heading">내 리포트가 이렇게 나와요</h2>
        <p className="rp-sub">
          검사를 마치면 아래와 같은 리포트를 받게 돼요.
          <br />실제 결과 수치는 검사 완료 후 확인할 수 있어요.
        </p>
      </div>

      <button
        type="button"
        className="rp-preview-trigger"
        onClick={() => setOpen(true)}
        aria-label="리포트 전체 미리보기 열기"
      >
        <div className="rp-preview-frame">
          <MockReport />
          <div className="rp-preview-overlay">
            <span className="rp-preview-lock">🔒</span>
            <span className="rp-preview-cta-text">클릭해서 크게 보기 →</span>
          </div>
        </div>
      </button>

      <div className="rp-sections-grid">
        <h3 className="rp-sections-title">📋 리포트에 이런 항목들이 담겨요</h3>
        <ul className="rp-sections-list">
          {REPORT_SECTIONS.map((s) => (
            <li key={s.title} className="rp-section-item">
              <span className="rp-section-icon">{s.icon}</span>
              <div className="rp-section-body">
                <p className="rp-section-title">{s.title}</p>
                <p className="rp-section-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Full Preview Modal */}
      {open && (
        <div className="rp-modal-overlay" onClick={() => setOpen(false)}>
          <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="rp-modal-close"
              onClick={() => setOpen(false)}
              aria-label="닫기"
            >
              ✕
            </button>
            <div className="rp-modal-head">
              <span className="rp-badge">👀 RESULTS PREVIEW</span>
              <h3 className="rp-modal-title">전체 리포트 미리보기</h3>
              <p className="rp-modal-sub">
                실제 수치는 검사를 완료하면 확인할 수 있어요.
              </p>
            </div>
            <div className="rp-modal-body">
              <MockReport expanded />
            </div>
            <div className="rp-modal-footer">
              <p className="rp-modal-footnote">
                🔒 블러 처리된 부분이 당신의 실제 분석 결과로 채워집니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
