import type { FIROBScores } from '../types';
import RadarChart from '../components/RadarChart';
import {
  getScoreLabel,
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
  onRetake: () => void;
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="score-bar-item">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-value" style={{ color }}>{score.toFixed(1)} / 9</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${(score / 9) * 100}%`, background: color }}
        />
      </div>
      <span className="score-bar-tag" style={{ color }}>{getScoreLabel(score)}</span>
    </div>
  );
}

export default function Results({ scores, userName, onRetake }: Props) {
  const inclusion = getInclusionAnalysis(scores.eI, scores.wI);
  const control = getControlAnalysis(scores.eC, scores.wC);
  const affection = getAffectionAnalysis(scores.eA, scores.wA);
  const conflict = getConflictStyle(scores);
  const partner = getIdealPartner(scores);

  const displayName = userName ? `${userName}님의` : '나의';

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <div className="results-badge">FIRO-B 결과 리포트</div>
        <h1 className="results-title">{displayName} 대인관계 유형</h1>
        <p className="results-subtitle">
          {inclusion.type} · {control.type} · {affection.type}
        </p>
      </div>

      {/* Profile Section */}
      <section className="result-section">
        <h2 className="section-title">나의 FIRO-B 프로필</h2>

        <div className="profile-grid">
          <div className="radar-wrapper">
            <RadarChart scores={scores} size={280} />
          </div>
          <div className="score-bars">
            {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => (
              <ScoreBar
                key={key}
                label={SCALE_LABELS[key]}
                score={scores[key]}
                color={SCALE_COLORS[key]}
              />
            ))}
          </div>
        </div>

        <div className="dimension-results">
          {[
            { icon: '🤝', title: '포용 (Inclusion)', data: inclusion, color: '#43D39E' },
            { icon: '⚡', title: '통제 (Control)', data: control, color: '#FF9F43' },
            { icon: '❤️', title: '애정 (Affection)', data: affection, color: '#FF6B9D' },
          ].map(({ icon, title, data, color }) => (
            <div key={title} className="dimension-result-card" style={{ borderLeft: `4px solid ${color}` }}>
              <div className="dim-result-header">
                <span className="dim-result-icon">{icon}</span>
                <div>
                  <span className="dim-result-category">{title}</span>
                  <h3 className="dim-result-type" style={{ color }}>{data.type}</h3>
                </div>
              </div>
              <p className="dim-result-desc">{data.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ideal Partner Section */}
      <section className="result-section partner-section">
        <h2 className="section-title">
          <span className="section-icon">💑</span>
          이상적인 배우자 프로필
        </h2>

        <div className="partner-narrative">{partner.narrative}</div>

        <div className="partner-grid">
          <div className="partner-radar">
            <p className="partner-radar-label">이상적인 파트너의 FIRO-B</p>
            <RadarChart scores={partner.profile} size={240} />
          </div>
          <div className="partner-details">
            <div className="partner-traits">
              <h4 className="trait-title success">이런 분을 찾으세요</h4>
              <ul>
                {partner.traits.map((t, i) => (
                  <li key={i} className="trait-item success-item">
                    <span className="trait-dot">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="partner-cautions">
              <h4 className="trait-title caution">이런 분은 주의하세요</h4>
              <ul>
                {partner.cautions.map((c, i) => (
                  <li key={i} className="trait-item caution-item">
                    <span className="trait-dot">!</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="partner-score-preview">
          <p className="partner-score-title">이상적인 파트너의 예상 점수</p>
          <div className="partner-scores-row">
            {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => (
              <div key={key} className="partner-score-chip" style={{ background: SCALE_COLORS[key] + '22', border: `1px solid ${SCALE_COLORS[key]}` }}>
                <span className="partner-score-chip-label" style={{ color: SCALE_COLORS[key] }}>{SCALE_LABELS[key]}</span>
                <span className="partner-score-chip-val" style={{ color: SCALE_COLORS[key] }}>{partner.profile[key].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conflict Section */}
      <section className="result-section conflict-section">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          갈등 해결 방식
        </h2>

        <div className="conflict-style-card">
          <div className="conflict-style-header">
            <span className="conflict-icon">{conflict.icon}</span>
            <div>
              <p className="conflict-label">주요 갈등 해결 유형</p>
              <h3 className="conflict-style-name">{conflict.style}</h3>
            </div>
          </div>
          <p className="conflict-desc">{conflict.description}</p>
        </div>

        <div className="conflict-detail-grid">
          <div className="conflict-detail-card strength-card">
            <h4 className="conflict-detail-title">강점</h4>
            <ul>
              {conflict.strengths.map((s, i) => (
                <li key={i} className="conflict-list-item">
                  <span style={{ color: '#43D39E', marginRight: 6 }}>●</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="conflict-detail-card weakness-card">
            <h4 className="conflict-detail-title">약점</h4>
            <ul>
              {conflict.weaknesses.map((w, i) => (
                <li key={i} className="conflict-list-item">
                  <span style={{ color: '#FF6B6B', marginRight: 6 }}>●</span>{w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="conflict-advice-card">
          <div className="advice-section">
            <h4 className="advice-title">💑 관계에서의 조언</h4>
            <p>{conflict.relationshipAdvice}</p>
          </div>
          <div className="advice-section">
            <h4 className="advice-title">📝 성장을 위한 팁</h4>
            <ul>
              {conflict.tips.map((tip, i) => (
                <li key={i} className="tip-item">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Retake */}
      <div className="retake-section">
        <p className="retake-note">결과는 현재의 당신을 반영합니다. 시간이 지나면 다시 검사해 보세요.</p>
        <button className="retake-btn" onClick={onRetake}>
          다시 검사하기
        </button>
      </div>
    </div>
  );
}
