import { useState } from 'react';
import type { FIROBScores } from '../types';
import RadarChart from '../components/RadarChart';
import EmailResultsForm from '../components/EmailResultsForm';
import FeedbackForm from '../components/FeedbackForm';
import DisqusSection from '../components/DisqusSection';
import AdBanner from '../components/AdBanner';
import DownloadReport from '../components/DownloadReport';
import ShareImageButton from '../components/ShareImageButton';
import ShareLinkButton from '../components/ShareLinkButton';
import ShareReportSection from '../components/ShareReportSection';
import ScoreDetailModal from '../components/ScoreDetailModal';
import DimensionDetailModal, { type DimensionKey } from '../components/DimensionDetailModal';
import BehaviorDetailModal, { type BehaviorKey } from '../components/BehaviorDetailModal';
import {
  getScoreLevel,
  getDimLevel,
  getGrandTotalLabel,
  getDimTotals,
  getOrgRoles,
  getDetailedInterpretation,
  getInclusionAnalysis,
  getControlAnalysis,
  getAffectionAnalysis,
  getConflictStyle,
  getIdealPartner,
} from '../utils/analysis';
import { SCALE_LABELS, SCALE_COLORS } from '../data/questions';

interface Props {
  scores: FIROBScores;
  userName: string;
  testDate: string;
  onRetake: () => void;
}

function Badge({ level, color }: { level: string; color: string }) {
  return (
    <span className="rpt-badge" style={{ background: color + '22', color, border: `1px solid ${color}66` }}>
      {level}
    </span>
  );
}

function ScoreCard({
  label,
  score,
  onClick,
}: {
  label: string;
  score: number;
  onClick: () => void;
}) {
  const lv = getScoreLevel(score);
  const color = SCALE_COLORS[label] ?? '#7C6FFF';
  return (
    <button
      type="button"
      className="rpt-score-card rpt-score-card-clickable"
      onClick={onClick}
      aria-label={`${label} 상세 설명 보기`}
    >
      <div className="rpt-sc-label">{label}</div>
      <div className="rpt-sc-score" style={{ color }}>{score.toFixed(1)}</div>
      <Badge level={lv.ko} color={lv.color} />
      <span className="rpt-sc-more no-capture" style={{ color }}>자세히 보기 →</span>
    </button>
  );
}

export default function Results({ scores, userName, testDate, onRetake }: Props) {
  const [activeScale, setActiveScale] = useState<keyof FIROBScores | null>(null);
  const [activeDim, setActiveDim] = useState<DimensionKey | null>(null);
  const [activeBehavior, setActiveBehavior] = useState<BehaviorKey | null>(null);
  const totals = getDimTotals(scores);
  const roles   = getOrgRoles(scores);
  const interps = getDetailedInterpretation(scores);
  const conflict = getConflictStyle(scores);
  const partner  = getIdealPartner(scores);
  const inclusion = getInclusionAnalysis(scores.eI, scores.wI);
  const control   = getControlAnalysis(scores.eC, scores.wC);
  const affection = getAffectionAnalysis(scores.eA, scores.wA);

  const grandLabel = getGrandTotalLabel(totals.grand);
  const expVsWant  = totals.expressed < totals.wanted ? 'expressed < wanted' : totals.expressed > totals.wanted ? 'expressed > wanted' : 'expressed = wanted';
  const expWantNote = totals.expressed < totals.wanted ? '타인 주도 기대 경향' : totals.expressed > totals.wanted ? '자기 주도 표출 경향' : '균형 유지';

  return (
    <div className="rpt-page" id="report-capture">

      {/* ── Hero ── */}
      <div className="rpt-hero">
        <div className="rpt-hero-inner">
          <p className="rpt-hero-sub">관계 욕구 프로파일 · FIRO 이론 기반</p>
          <h1 className="rpt-hero-title">대인관계 욕구 및 행동 프로파일</h1>
          <div className="rpt-meta">
            <div className="rpt-meta-item">
              <span className="rpt-meta-label">이름</span>
              <span className="rpt-meta-val">{userName || '—'}</span>
            </div>
            <div className="rpt-meta-item">
              <span className="rpt-meta-label">검사일</span>
              <span className="rpt-meta-val">{testDate}</span>
            </div>
            <div className="rpt-meta-item">
              <span className="rpt-meta-label">욕구 총합</span>
              <span className="rpt-meta-val">{totals.grand.toFixed(0)}</span>
            </div>
            <div className="rpt-meta-item">
              <span className="rpt-meta-label">수준</span>
              <span className="rpt-meta-val">{grandLabel}</span>
            </div>
          </div>
          <div className="rpt-hero-actions no-capture">
            <DownloadReport userName={userName} />
            <ShareImageButton userName={userName} />
            <ShareLinkButton />
          </div>
        </div>
      </div>

      <div className="rpt-body">

        {/* ── 이론 소개 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">이 진단의 이론적 배경</h2>
          <p className="rpt-text">
            본 자가진단은 1958년 심리학자 William Schutz 박사가 제안한 <strong>FIRO(Fundamental
            Interpersonal Relations Orientation)</strong> 이론을 참고하여 개발되었습니다. FIRO 이론은
            사람이 관계에서 갖는 세 가지 기본 욕구 — <strong>소속(Inclusion)</strong>,
            <strong> 통제(Control)</strong>, <strong>정서(Affection)</strong> — 를 다룹니다.
            각 영역에서 내가 먼저 표출하는 행동(e)과 상대에게 기대하는 행동(w)을 0–9점으로 측정합니다.
          </p>
          <div className="rpt-highlight-box">
            개인이 사람들과의 관계에서 어떻게 행동하는지, 또 타인이 어떻게 행동해주길 기대하는지를
            돌아보는 데 도움을 줍니다.
          </div>
          <p className="rpt-disclaimer-inline">
            ⚠️ 본 서비스는 The Myers-Briggs Company의 FIRO-B<sup>®</sup> 공식 검사와 무관한 자체 개발 자가진단이며,
            의학적·임상적 진단이 아닌 자기이해를 위한 교육용 도구입니다.
          </p>
        </section>

        {/* ── 핵심 결과 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">핵심 결과</h2>

          {/* ── 척도 읽는 법 ── */}
          <div className="rpt-scale-legend">
            <h3 className="rpt-legend-title">📖 점수 읽는 법</h3>
            <p className="rpt-legend-hint">
              영문 2자리 = <strong>앞: 행동 방향</strong> + <strong>뒤: 욕구 영역</strong>
            </p>

            {/* 행동 축 (e / w) */}
            <div className="rpt-legend-axes">
              <div className="rpt-legend-axis expressed">
                <span className="rpt-legend-axis-letter">e</span>
                <div className="rpt-legend-axis-body">
                  <strong>표출 (expressed)</strong>
                  <span>내가 먼저 하는 행동</span>
                </div>
              </div>
              <div className="rpt-legend-axis wanted">
                <span className="rpt-legend-axis-letter">w</span>
                <div className="rpt-legend-axis-body">
                  <strong>기대 (wanted)</strong>
                  <span>상대가 해주길 바라는 정도</span>
                </div>
              </div>
            </div>

            {/* 3 욕구 × 표출/기대 매트릭스 */}
            <div className="rpt-legend-scales">
              <div className="rpt-legend-scale inclusion">
                <div className="rpt-legend-head">
                  <span className="rpt-legend-letter">I</span>
                  <span className="rpt-legend-ko">포용 (Inclusion)</span>
                  <span className="rpt-legend-tag">사람들과의 어울림</span>
                </div>
                <div className="rpt-legend-rows">
                  <div className="rpt-legend-row">
                    <code className="rpt-legend-code">eI</code>
                    <span>내가 먼저 어울리려 하는 정도</span>
                  </div>
                  <div className="rpt-legend-row">
                    <code className="rpt-legend-code">wI</code>
                    <span>상대가 날 포함시켜 주길 원하는 정도</span>
                  </div>
                </div>
              </div>

              <div className="rpt-legend-scale control">
                <div className="rpt-legend-head">
                  <span className="rpt-legend-letter">C</span>
                  <span className="rpt-legend-ko">통제 (Control)</span>
                  <span className="rpt-legend-tag">관계 주도권</span>
                </div>
                <div className="rpt-legend-rows">
                  <div className="rpt-legend-row">
                    <code className="rpt-legend-code">eC</code>
                    <span>내가 관계를 주도·리드하려는 정도</span>
                  </div>
                  <div className="rpt-legend-row">
                    <code className="rpt-legend-code">wC</code>
                    <span>상대가 주도해 주길 바라는 정도</span>
                  </div>
                </div>
              </div>

              <div className="rpt-legend-scale affection">
                <div className="rpt-legend-head">
                  <span className="rpt-legend-letter">A</span>
                  <span className="rpt-legend-ko">애정 (Affection)</span>
                  <span className="rpt-legend-tag">친밀감·따뜻함</span>
                </div>
                <div className="rpt-legend-rows">
                  <div className="rpt-legend-row">
                    <code className="rpt-legend-code">eA</code>
                    <span>내가 먼저 친밀함·애정을 표현하는 정도</span>
                  </div>
                  <div className="rpt-legend-row">
                    <code className="rpt-legend-code">wA</code>
                    <span>상대가 친밀감·애정을 보여주길 원하는 정도</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="rpt-legend-foot">
              예: <code className="rpt-legend-code">eA</code> 점수가 낮다면,
              <strong> 내가 먼저 애정을 표현하는 편은 아니라는 뜻</strong>입니다.
            </p>
          </div>

          <p className="rpt-sc-hint no-capture">👆 각 점수 카드를 눌러 상세 설명을 볼 수 있어요.</p>
          <div className="rpt-core-grid">
            <div className="rpt-radar-wrap">
              <RadarChart scores={scores} size={260} />
            </div>
            <div className="rpt-six-scores">
              {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => (
                <ScoreCard
                  key={key}
                  label={key}
                  score={scores[key]}
                  onClick={() => setActiveScale(key)}
                />
              ))}
            </div>
          </div>

          {/* score bars */}
          <div className="rpt-bars">
            {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => {
              const color = SCALE_COLORS[key];
              return (
                <div key={key} className="rpt-bar-row">
                  <span className="rpt-bar-name">{SCALE_LABELS[key]}</span>
                  <div className="rpt-bar-track">
                    <div className="rpt-bar-fill" style={{ width: `${(scores[key] / 9) * 100}%`, background: color }} />
                  </div>
                  <span className="rpt-bar-num" style={{ color }}>{scores[key].toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 광고 #1 ── */}
        <AdBanner slot="1111111111" />

        {/* ── 3개 욕구 총합 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">3개 욕구 총합</h2>
          <p className="rpt-sc-hint no-capture">👆 각 욕구 카드를 눌러 상세 설명을 볼 수 있어요.</p>
          <div className="rpt-dim-grid">
            {[
              { dimKey: 'inclusion' as DimensionKey, label: '소속 욕구 (Inclusion)', value: totals.inclusion, max: 18, color: '#43D39E', icon: '🤝' },
              { dimKey: 'control' as DimensionKey,   label: '통제 욕구 (Control)',   value: totals.control,   max: 18, color: '#FF9F43', icon: '⚡' },
              { dimKey: 'affection' as DimensionKey, label: '정서 욕구 (Affection)', value: totals.affection, max: 18, color: '#FF6B9D', icon: '❤️' },
            ].map(({ dimKey, label, value, max, color, icon }) => {
              const lv = getDimLevel(value);
              return (
                <button
                  key={label}
                  type="button"
                  className="rpt-dim-card rpt-dim-card-clickable"
                  style={{ borderTop: `3px solid ${color}` }}
                  onClick={() => setActiveDim(dimKey)}
                  aria-label={`${label} 상세 설명 보기`}
                >
                  <span className="rpt-dim-icon">{icon}</span>
                  <div className="rpt-dim-label">{label}</div>
                  <div className="rpt-dim-score" style={{ color }}>{value.toFixed(1)}</div>
                  <div className="rpt-dim-max">/ {max}</div>
                  <div className="rpt-dim-bar-track">
                    <div className="rpt-dim-bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
                  </div>
                  <Badge level={lv.ko} color={color} />
                  <span className="rpt-sc-more no-capture" style={{ color }}>자세히 보기 →</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 표출 / 기대 행동 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">표출행동 vs 기대행동</h2>
          <p className="rpt-sc-hint no-capture">👆 각 카드를 눌러 상세 설명을 볼 수 있어요.</p>
          <div className="rpt-ew-grid">
            <button
              type="button"
              className="rpt-ew-card rpt-ew-card-clickable expressed"
              onClick={() => setActiveBehavior('expressed')}
              aria-label="표출행동 상세 설명 보기"
            >
              <div className="rpt-ew-icon">📣</div>
              <div className="rpt-ew-lbl">표출행동 총합</div>
              <div className="rpt-ew-val">{totals.expressed.toFixed(1)}</div>
              <div className="rpt-ew-sub">eI + eC + eA</div>
              <span className="rpt-sc-more no-capture" style={{ color: '#7C6FFF' }}>자세히 보기 →</span>
            </button>
            <div className="rpt-ew-mid">
              <div className="rpt-ew-compare">{expVsWant}</div>
              <div className="rpt-ew-note">{expWantNote}</div>
            </div>
            <button
              type="button"
              className="rpt-ew-card rpt-ew-card-clickable wanted"
              onClick={() => setActiveBehavior('wanted')}
              aria-label="기대행동 상세 설명 보기"
            >
              <div className="rpt-ew-icon">🙏</div>
              <div className="rpt-ew-lbl">기대행동 총합</div>
              <div className="rpt-ew-val">{totals.wanted.toFixed(1)}</div>
              <div className="rpt-ew-sub">wI + wC + wA</div>
              <span className="rpt-sc-more no-capture" style={{ color: '#FF9F43' }}>자세히 보기 →</span>
            </button>
          </div>
        </section>

        {/* ── 해석 요약 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">해석 요약</h2>
          <div className="rpt-dim-types">
            {[
              { icon: '🤝', dim: '소속 (Inclusion)', type: inclusion.type,  color: '#43D39E' },
              { icon: '⚡', dim: '통제 (Control)',   type: control.type,    color: '#FF9F43' },
              { icon: '❤️', dim: '정서 (Affection)', type: affection.type,  color: '#FF6B9D' },
            ].map(({ icon, dim, type, color }) => (
              <div key={dim} className="rpt-type-chip" style={{ borderLeft: `4px solid ${color}` }}>
                <span className="rpt-type-chip-icon">{icon}</span>
                <div>
                  <span className="rpt-type-chip-dim">{dim}</span>
                  <span className="rpt-type-chip-name" style={{ color }}>{type}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rpt-interp-list">
            {interps.map((para, i) => (
              <p key={i} className="rpt-interp-para">{para}</p>
            ))}
          </div>
        </section>

        {/* ── SNS 공유 카드 ── */}
        <ShareReportSection userName={userName} />

        {/* ── 광고 #2 ── */}
        <AdBanner slot="2222222222" />

        {/* ── 이상적인 배우자 ── */}
        <section className="rpt-section partner-sec">
          <h2 className="rpt-sec-title">💑 이상적인 배우자 프로필</h2>
          <p className="rpt-text">{partner.narrative}</p>

          <div className="rpt-partner-grid">
            <div className="rpt-partner-radar">
              <p className="rpt-partner-radar-lbl">이상적인 파트너 프로파일</p>
              <RadarChart scores={partner.profile} size={220} />
            </div>
            <div className="rpt-partner-detail">
              <div className="rpt-trait-block">
                <h4 className="rpt-trait-head success">✅ 이런 분을 찾으세요</h4>
                <ul>
                  {partner.traits.map((t, i) => (
                    <li key={i} className="rpt-trait-item">
                      <span className="rpt-trait-dot" style={{ color: '#43D39E' }}>●</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rpt-trait-block">
                <h4 className="rpt-trait-head caution">⚠️ 이런 분은 주의하세요</h4>
                <ul>
                  {partner.cautions.map((c, i) => (
                    <li key={i} className="rpt-trait-item">
                      <span className="rpt-trait-dot" style={{ color: '#FF9F43' }}>●</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rpt-partner-scores">
            <p className="rpt-partner-scores-title">이상적인 파트너 예상 프로파일 점수</p>
            <div className="rpt-partner-chips">
              {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => (
                <div key={key} className="rpt-partner-chip"
                  style={{ background: SCALE_COLORS[key] + '18', border: `1px solid ${SCALE_COLORS[key]}66` }}>
                  <span className="rpt-pchip-label" style={{ color: SCALE_COLORS[key] }}>{SCALE_LABELS[key]}</span>
                  <span className="rpt-pchip-val" style={{ color: SCALE_COLORS[key] }}>{partner.profile[key].toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 갈등 해결 방식 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">🛡️ 갈등 해결 방식</h2>
          <div className="rpt-conflict-top">
            <span className="rpt-conflict-icon">{conflict.icon}</span>
            <div>
              <p className="rpt-conflict-lbl">주요 갈등 해결 유형</p>
              <p className="rpt-conflict-name">{conflict.style}</p>
            </div>
          </div>
          <p className="rpt-text">{conflict.description}</p>

          <div className="rpt-sw-grid">
            <div className="rpt-sw-card" style={{ borderTop: '3px solid #43D39E' }}>
              <h4 className="rpt-sw-title">강점</h4>
              <ul>
                {conflict.strengths.map((s, i) => (
                  <li key={i} className="rpt-sw-item">
                    <span style={{ color: '#43D39E', marginRight: 6 }}>●</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rpt-sw-card" style={{ borderTop: '3px solid #FF6B6B' }}>
              <h4 className="rpt-sw-title">약점</h4>
              <ul>
                {conflict.weaknesses.map((w, i) => (
                  <li key={i} className="rpt-sw-item">
                    <span style={{ color: '#FF6B6B', marginRight: 6 }}>●</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rpt-advice-box">
            <div className="rpt-advice-block">
              <h4 className="rpt-advice-title">💑 관계에서의 조언</h4>
              <p className="rpt-text">{conflict.relationshipAdvice}</p>
            </div>
            <div className="rpt-advice-block">
              <h4 className="rpt-advice-title">📝 성장을 위한 팁</h4>
              <ul>
                {conflict.tips.map((tip, i) => (
                  <li key={i} className="rpt-tip-item">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 조직에서의 역할 ── */}
        <section className="rpt-section">
          <h2 className="rpt-sec-title">🏢 조직에서의 역할</h2>
          <p className="rpt-text" style={{ marginBottom: 20 }}>
            이 프로파일을 바탕으로 팀 내에서 자연스럽게 수행하게 되는 역할입니다.
          </p>
          <ul className="rpt-role-list">
            {roles.map(({ role, description }) => (
              <li key={role} className="rpt-role-item">
                <span className="rpt-role-name">{role}</span>
                <span className="rpt-role-desc">— {description}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Formspree: 이메일 받기 ── */}
        <EmailResultsForm
          scores={scores}
          userName={userName}
          inclusionType={inclusion.type}
          controlType={control.type}
          affectionType={affection.type}
          conflictStyle={conflict.style}
        />

        {/* ── Formspree: 피드백 ── */}
        <FeedbackForm />

        {/* ── 광고 #3 ── */}
        <AdBanner slot="3333333333" />

        {/* ── Disqus ── */}
        <DisqusSection />

        {/* ── Retake ── */}
        <div className="rpt-retake">
          <p className="rpt-retake-note">이 결과는 현재 시점의 대인관계 욕구를 반영합니다. 시간이 지나면 다시 검사해 보세요.</p>
          <button className="rpt-retake-btn" onClick={onRetake}>다시 검사하기</button>
        </div>

      </div>

      <ScoreDetailModal
        scaleKey={activeScale}
        score={activeScale ? scores[activeScale] : 0}
        onClose={() => setActiveScale(null)}
      />
      <DimensionDetailModal
        dimKey={activeDim}
        scores={scores}
        onClose={() => setActiveDim(null)}
      />
      <BehaviorDetailModal
        behaviorKey={activeBehavior}
        scores={scores}
        onClose={() => setActiveBehavior(null)}
      />
    </div>
  );
}
