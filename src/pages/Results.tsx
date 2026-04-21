import type { FIROBScores } from '../types'
import EmailResultsForm from '../components/EmailResultsForm'
import ShareButtons from '../components/ShareButtons'
import FeedbackForm from '../components/FeedbackForm'
import DisqusSection from '../components/DisqusSection'
import AdBanner from '../components/AdBanner'
import DownloadReport from '../components/DownloadReport'
import FiroBReport from '../components/FiroBReport'
import RadarChart from '../components/RadarChart'
import {
  getScoreLevel,
  getGrandTotalLabel,
  getDimTotals,
  getInclusionAnalysis,
  getControlAnalysis,
  getAffectionAnalysis,
  getConflictStyle,
} from '../utils/analysis'
import { SCALE_LABELS, SCALE_COLORS } from '../data/questions'

interface Props {
  scores: FIROBScores
  userName: string
  testDate: string
  onRetake: () => void
}

function Badge({ level, color }: { level: string; color: string }) {
  return (
    <span className="rpt-badge" style={{ background: color + '22', color, border: `1px solid ${color}66` }}>
      {level}
    </span>
  )
}

export default function Results({ scores, userName, testDate, onRetake }: Props) {
  const totals     = getDimTotals(scores)
  const conflict   = getConflictStyle(scores)
  const inclusion  = getInclusionAnalysis(scores.eI, scores.wI)
  const control    = getControlAnalysis(scores.eC, scores.wC)
  const affection  = getAffectionAnalysis(scores.eA, scores.wA)
  const grandLabel = getGrandTotalLabel(totals.grand)

  return (
    <div className="rpt-page" id="report-capture">

      {/* ── Hero ── */}
      <div className="rpt-hero">
        <div className="rpt-hero-inner">
          <p className="rpt-hero-sub">FIRO-B 전문해석 프로파일</p>
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
            <DownloadReport />
          </div>
        </div>
      </div>

      {/* ── 점수 요약 바 ── */}
      <div className="rpt-body">
        <section className="rpt-section">
          <h2 className="rpt-sec-title">핵심 결과</h2>
          <div className="rpt-core-grid">
            <div className="rpt-radar-wrap">
              <RadarChart scores={scores} size={260} />
            </div>
            <div className="rpt-six-scores">
              {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => {
                const lv    = getScoreLevel(scores[key])
                const color = SCALE_COLORS[key]
                return (
                  <div key={key} className="rpt-score-card">
                    <div className="rpt-sc-label">{key}</div>
                    <div className="rpt-sc-score" style={{ color }}>{scores[key].toFixed(1)}</div>
                    <Badge level={lv.ko} color={lv.color} />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="rpt-bars">
            {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => {
              const color = SCALE_COLORS[key]
              return (
                <div key={key} className="rpt-bar-row">
                  <span className="rpt-bar-name">{SCALE_LABELS[key]}</span>
                  <div className="rpt-bar-track">
                    <div className="rpt-bar-fill" style={{ width: `${(scores[key] / 9) * 100}%`, background: color }} />
                  </div>
                  <span className="rpt-bar-num" style={{ color }}>{scores[key].toFixed(1)}</span>
                </div>
              )
            })}
          </div>
        </section>

        <AdBanner slot="1111111111" />
      </div>

      {/* ── 탭 리포트 (FiroBReport) ── */}
      <FiroBReport
        scores={scores}
        userName={userName}
        testDate={testDate}
        onRetake={onRetake}
      />

      {/* ── 공유·이메일·피드백·Disqus ── */}
      <div className="rpt-body">

        <ShareButtons
          userName={userName}
          inclusionType={inclusion.type}
          controlType={control.type}
          affectionType={affection.type}
          conflictStyle={conflict.style}
        />

        <EmailResultsForm
          scores={scores}
          userName={userName}
          testDate={testDate}
          inclusionType={inclusion.type}
          controlType={control.type}
          affectionType={affection.type}
          conflictStyle={conflict.style}
        />

        <FeedbackForm />

        <AdBanner slot="3333333333" />

        <DisqusSection />

      </div>
    </div>
  )
}
