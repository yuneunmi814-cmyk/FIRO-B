import { useState } from 'react'
import type { FIROBScores } from '../types'
import ShareButtons from '../components/ShareButtons'
import EmailResultsForm from '../components/EmailResultsForm'
import FeedbackForm from '../components/FeedbackForm'
import DisqusSection from '../components/DisqusSection'
import AdBanner from '../components/AdBanner'
import PdfDownloadButton from '../components/PdfDownloadButton'
import LockedSection from '../components/LockedSection'
import PaywallCTA from '../components/PaywallCTA'
import CoupleUpsell from '../components/CoupleUpsell'
import ConsultationCTA from '../components/ConsultationCTA'
import {
  getDimTotals,
  getGrandTotalLabel,
  getScoreLevel,
  getInclusionAnalysis,
  getControlAnalysis,
  getAffectionAnalysis,
  getConflictStyle,
  getIdealPartner,
  getDetailedInterpretation,
  getOrgRoles,
} from '../utils/analysis'
import { SCALE_LABELS } from '../data/questions'

interface Props {
  scores: FIROBScores
  userName: string
  testDate: string
  hasAccess: boolean
  unlocking?: boolean
  onRequestUnlock: () => void
  onRetake: () => void
}

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */

// Convert raw FIRO-B score (0–9) to 0–100 for visualizations
const normalize = (n: number) => Math.round((n / 9) * 100)

// Circular SVG ring for a single dimension (0–100)
function RingScore({
  value, label, colorClass, displayValue,
}: {
  value: number
  label: string
  colorClass: string
  displayValue: string | number
}) {
  const r = 58
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="transparent"
            className="text-surface-container-highest" stroke="currentColor" strokeWidth="8" />
          <circle cx="64" cy="64" r={r} fill="transparent"
            className={`${colorClass} ring-animated`}
            stroke="currentColor" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <span className="text-2xl font-bold text-primary font-headline">{displayValue}</span>
      </div>
      <span className="mt-4 font-bold text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-headline">
        {label}
      </span>
    </div>
  )
}

// Archetype name derivation based on scores
function getArchetype(scores: FIROBScores): { ko: string; en: string; tagline: string } {
  const incTot  = scores.eI + scores.wI
  const ctlTot  = scores.eC + scores.wC
  const affTot  = scores.eA + scores.wA

  if (ctlTot >= 12 && affTot >= 12) return {
    ko: '조화의 건축가',
    en: 'The Architect of Harmony',
    tagline: '구조를 만들되, 사람을 잃지 않는 리더.',
  }
  if (ctlTot >= 12 && incTot <= 6)  return {
    ko: '고독한 전략가',
    en: 'The Solitary Strategist',
    tagline: '소수 정예의 관계에서 가장 강력하게 빛나는 타입.',
  }
  if (affTot >= 13) return {
    ko: '따뜻한 촉매자',
    en: 'The Warm Catalyst',
    tagline: '감정적 깊이로 관계를 움직이는 불꽃.',
  }
  if (incTot >= 13) return {
    ko: '사회적 매개자',
    en: 'The Social Connector',
    tagline: '사람과 사람을 잇는 데 타고난 감각.',
  }
  if (ctlTot <= 5 && affTot <= 5) return {
    ko: '조용한 관찰자',
    en: 'The Thoughtful Observer',
    tagline: '깊이 관찰하고 신중하게 움직이는 독립적 영혼.',
  }
  return {
    ko: '균형의 설계자',
    en: 'The Balanced Designer',
    tagline: '상황에 따라 유연하게 대응하는 다재다능한 관계형.',
  }
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */

export default function Results({
  scores, userName, testDate, hasAccess, unlocking, onRequestUnlock, onRetake,
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'partner' | 'conflict' | 'action'>('overview')

  const totals    = getDimTotals(scores)
  const inclusion = getInclusionAnalysis(scores.eI, scores.wI)
  const control   = getControlAnalysis(scores.eC, scores.wC)
  const affection = getAffectionAnalysis(scores.eA, scores.wA)
  const conflict  = getConflictStyle(scores)
  const partner   = getIdealPartner(scores)
  const interps   = getDetailedInterpretation(scores)
  const roles     = getOrgRoles(scores)
  const grandLabel = getGrandTotalLabel(totals.grand)
  const archetype  = getArchetype(scores)

  return (
    <div id="report-capture" className="min-h-screen bg-surface font-body text-on-surface">

      {/* ════════════════════════════════════════════════════════
          HERO — Editorial header
      ════════════════════════════════════════════════════════ */}
      <section className="px-6 pt-20 pb-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold tracking-[0.2em] uppercase mb-5 font-headline">
              FIRO-B 대인관계 심층 리포트
            </span>
            <h2 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tighter text-primary leading-[0.95] mb-6">
              {userName ? <>{userName}님의 <br /></> : '나의 프로파일'}
              {userName && <span className="text-secondary">{archetype.ko}</span>}
              {!userName && <><br /><span className="text-secondary">{archetype.ko}</span></>}
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl font-body">
              {archetype.tagline} FIRO-B 6개 영역 분석을 기반으로, 당신의 대인관계에서
              반복되는 패턴과 관계 욕구의 맥락을 정리했습니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <div className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant">검사일 · </span>
                <span className="font-semibold text-primary">{testDate}</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20">
                <span className="text-on-surface-variant">욕구 총합 · </span>
                <span className="font-semibold text-primary">{totals.grand.toFixed(0)} ({grandLabel})</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-secondary/20 p-2">
              <div className="w-full h-full rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined filled text-on-secondary-container text-5xl">psychology</span>
              </div>
            </div>
            {hasAccess && (
              <div className="no-capture">
                <PdfDownloadButton userName={userName} className="bg-primary text-white hover:bg-primary-container rounded-xl px-6 py-3 font-bold text-sm font-headline shadow-editorial-lg" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BENTO GRID — Core dashboard (always visible)
      ════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Orientations – 3 rings */}
          <div className="md:col-span-8 bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-headline text-primary mb-2">Interpersonal Orientations</h3>
              <p className="text-sm text-on-surface-variant mb-8">표현(Expressed)과 기대(Wanted) 행동의 총합으로 본 세 영역.</p>
              <div className="flex flex-wrap gap-12 items-center justify-center py-6">
                <RingScore label="Inclusion · 소속"  value={normalize(totals.inclusion / 2)} displayValue={totals.inclusion.toFixed(0)} colorClass="text-secondary" />
                <RingScore label="Control · 통제"     value={normalize(totals.control / 2)}   displayValue={totals.control.toFixed(0)}   colorClass="text-primary" />
                <RingScore label="Affection · 정서"   value={normalize(totals.affection / 2)} displayValue={totals.affection.toFixed(0)} colorClass="text-on-tertiary-container" />
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          </div>

          {/* Core needs (dark gradient) */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-[2rem] p-8 flex flex-col justify-between firo-gradient">
            <div>
              <h3 className="text-2xl font-bold font-headline mb-5">핵심 욕구</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined filled text-secondary-container mt-1">check_circle</span>
                  <div>
                    <p className="font-bold text-secondary-fixed">{inclusion.type}</p>
                    <p className="text-sm text-on-primary-container leading-snug mt-0.5">{inclusion.description.split('.')[0]}.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined filled text-secondary-container mt-1">check_circle</span>
                  <div>
                    <p className="font-bold text-secondary-fixed">{control.type}</p>
                    <p className="text-sm text-on-primary-container leading-snug mt-0.5">{control.description.split('.')[0]}.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined filled text-secondary-container mt-1">check_circle</span>
                  <div>
                    <p className="font-bold text-secondary-fixed">{affection.type}</p>
                    <p className="text-sm text-on-primary-container leading-snug mt-0.5">{affection.description.split('.')[0]}.</p>
                  </div>
                </li>
              </ul>
            </div>
            {hasAccess ? (
              <div className="mt-6 pt-5 border-t border-white/10 no-capture">
                <PdfDownloadButton userName={userName} className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all font-headline" />
              </div>
            ) : (
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-on-primary-container italic">전체 분석은 결제 후 열람 가능합니다.</p>
              </div>
            )}
          </div>

          {/* Archetype description (editorial split) */}
          <div className="md:col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-editorial border border-outline-variant/10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              <div className="md:col-span-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-4 font-headline">The Psychology</h4>
                <h3 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-6 leading-[1.15] tracking-tight">{archetype.ko}</h3>
                {interps.slice(0, 2).map((p, i) => (
                  <p key={i} className="text-on-surface-variant leading-relaxed mb-4">{p}</p>
                ))}
              </div>
              <div className="md:col-span-2 bg-gradient-to-br from-secondary/5 to-tertiary-fixed/40 rounded-2xl p-6 flex flex-col justify-center">
                <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">6개 영역 요약</h5>
                <div className="space-y-3">
                  {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => {
                    const lv = getScoreLevel(scores[key])
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">{SCALE_LABELS[key]}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-primary font-headline">{scores[key].toFixed(1)}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold font-headline"
                            style={{ background: lv.color + '22', color: lv.color }}>
                            {lv.ko}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility teaser */}
          <div className="md:col-span-12 lg:col-span-5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-[2rem] p-8 flex flex-col relative overflow-hidden">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-tertiary-fixed mb-4 font-headline">Compatibility</h4>
            <h3 className="text-4xl font-bold font-headline mb-5 tracking-tight leading-tight">이상적인 파트너</h3>
            <p className="text-on-tertiary-fixed-variant leading-relaxed mb-6 text-[15px]">
              당신의 기대를 자연스럽게 읽어주는 파트너와 가장 잘 맞습니다.
              {hasAccess ? ' 아래 탭의 「이상적인 파트너」에서 상세 프로필을 확인하세요.' : ' 전체 리포트에서 구체적인 궁합 예측과 주의해야 할 유형까지 확인할 수 있습니다.'}
            </p>
            <div className="mt-auto space-y-3">
              <div className="p-4 bg-white/40 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined filled text-white">favorite</span>
                </div>
                <div>
                  <p className="font-bold">{partner.narrative.split('.')[0].slice(0, 40)}…</p>
                  <p className="text-sm opacity-80 uppercase tracking-tighter font-medium">Ideal Profile</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-tertiary-container/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Dedicated PDF download card (shown only when unlocked) */}
      {hasAccess && (
        <section className="px-6 max-w-7xl mx-auto my-10 no-capture">
          <div className="rounded-[2rem] firo-gradient text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined filled text-white text-3xl">picture_as_pdf</span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-1 font-headline">Save Your Report</p>
                <h3 className="text-2xl md:text-3xl font-bold font-headline leading-tight mb-2">리포트를 PDF로 저장하기</h3>
                <p className="text-sm md:text-[15px] text-primary-fixed-dim leading-relaxed max-w-lg">
                  전체 리포트를 A4 멀티페이지 PDF로 다운로드하세요. 언제든 다시 열람하거나
                  파트너·상담 전문가와 공유할 수 있습니다.
                </p>
              </div>
            </div>
            <PdfDownloadButton
              userName={userName}
              className="bg-white text-primary rounded-xl px-6 py-4 font-bold text-sm md:text-base font-headline shadow-editorial-lg hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            />
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-secondary/20 rounded-full blur-[80px]" />
          </div>
        </section>
      )}

      <div className="px-6 max-w-7xl mx-auto"><AdBanner slot="1111111111" /></div>

      {/* ════════════════════════════════════════════════════════
          PAYWALL CTA
      ════════════════════════════════════════════════════════ */}
      {!hasAccess && (
        <section className="px-6 max-w-4xl mx-auto my-12">
          <PaywallCTA
            scores={scores}
            inclusion={inclusion}
            conflict={conflict}
            unlocking={unlocking}
            onUnlock={onRequestUnlock}
          />
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          TABBED DEEP DIVE
      ════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        {/* Tab bar — editorial pill style */}
        <div className="mb-10 flex flex-wrap items-center gap-3 py-2 overflow-x-auto whitespace-nowrap">
          {[
            { key: 'overview', label: '심층 해석',          icon: 'psychology' },
            { key: 'partner',  label: '이상적인 파트너',     icon: 'favorite' },
            { key: 'conflict', label: '갈등 해결 스타일',    icon: 'balance' },
            { key: 'action',   label: '행동 가이드',        icon: 'map' },
          ].map(t => {
            const active = activeTab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium font-headline transition-all cursor-pointer
                  ${active
                    ? 'bg-primary text-white shadow-editorial-lg'
                    : 'bg-surface-container-low text-on-surface border border-outline-variant/15 hover:border-secondary/40'
                  }`}
              >
                <span className="material-symbols-outlined text-sm">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Tab: Overview (deep interpretations + roles) ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Inclusion (free preview) */}
            <div className="md:col-span-6 bg-surface-container-lowest rounded-[2rem] p-8 shadow-editorial border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-2xl bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] font-headline">소속 (Inclusion)</p>
                  <h4 className="text-xl font-bold text-primary font-headline">{inclusion.type}</h4>
                </div>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest text-on-surface-variant px-2.5 py-1 rounded-full">미리보기</span>
              </div>
              <p className="text-sm leading-7 text-on-surface-variant mb-5">{inclusion.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface-container-low p-4 text-center">
                  <p className="text-[11px] text-on-surface-variant mb-1 font-headline">표현 (e)</p>
                  <p className="text-3xl font-black text-secondary font-headline">{scores.eI.toFixed(1)}</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4 text-center">
                  <p className="text-[11px] text-on-surface-variant mb-1 font-headline">기대 (w)</p>
                  <p className="text-3xl font-black text-secondary font-headline">{scores.wI.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Locked: control + affection + deep interp + roles */}
            <div className="md:col-span-6">
              <LockedSection
                hasAccess={hasAccess}
                unlocking={unlocking}
                onUnlock={onRequestUnlock}
                label="통제·정서 심층 분석 · 조직 역할"
                hint="표현과 기대의 간극, 관계 패턴, 조직 내 자연스러운 포지션까지"
              >
                <div className="space-y-6">
                  {/* Control */}
                  <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-editorial border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined">shield</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] font-headline">통제 (Control)</p>
                        <h4 className="text-xl font-bold text-primary font-headline">{control.type}</h4>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-on-surface-variant mb-4">{control.description}</p>
                    <div className="rounded-2xl bg-surface-container-low border border-outline-variant/10 p-4">
                      <p className="text-[11px] font-semibold text-on-surface-variant mb-1 font-headline">파트너에게 필요한 것</p>
                      <p className="text-sm leading-6 text-on-surface">{control.partnerNeed}</p>
                    </div>
                  </div>
                  {/* Affection */}
                  <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-editorial border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-11 w-11 rounded-2xl bg-on-tertiary-container text-white flex items-center justify-center">
                        <span className="material-symbols-outlined filled">favorite</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] font-headline">정서 (Affection)</p>
                        <h4 className="text-xl font-bold text-primary font-headline">{affection.type}</h4>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-on-surface-variant mb-4">{affection.description}</p>
                    <div className="rounded-2xl bg-surface-container-low border border-outline-variant/10 p-4">
                      <p className="text-[11px] font-semibold text-on-surface-variant mb-1 font-headline">파트너에게 필요한 것</p>
                      <p className="text-sm leading-6 text-on-surface">{affection.partnerNeed}</p>
                    </div>
                  </div>
                </div>
              </LockedSection>
            </div>

            {/* Detailed interpretation paragraphs */}
            <div className="md:col-span-12">
              <LockedSection
                hasAccess={hasAccess}
                unlocking={unlocking}
                onUnlock={onRequestUnlock}
                label="종합 심층 해석"
                hint="3개 영역의 상호작용과 당신의 관계 서사를 글로 풀어낸 분석"
              >
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-editorial border border-outline-variant/10">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Comprehensive Analysis</h4>
                  <h3 className="text-3xl font-bold font-headline text-primary mb-8 leading-tight">종합 심층 해석</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interps.map((para, i) => (
                      <p key={i} className="text-sm leading-7 text-on-surface-variant p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </LockedSection>
            </div>

            {/* Org roles */}
            <div className="md:col-span-12">
              <LockedSection
                hasAccess={hasAccess}
                unlocking={unlocking}
                onUnlock={onRequestUnlock}
                label="조직에서의 자연스러운 역할"
                hint="FIRO-B 프로파일 기반 팀 내 포지션 추천"
              >
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-editorial border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-secondary">explore</span>
                    <h3 className="text-xl font-bold text-primary font-headline">조직에서의 자연스러운 역할</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.map(({ role, description }) => (
                      <div key={role} className="flex items-start gap-4 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
                        <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-lg">workspace_premium</span>
                        </div>
                        <div>
                          <p className="font-bold text-primary mb-1 font-headline">{role}</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LockedSection>
            </div>
          </div>
        )}

        {/* ── Tab: Ideal Partner ── */}
        {activeTab === 'partner' && (
          <div>
            {/* Editorial hero */}
            <div className="mb-10 editorial-asymmetry">
              <h2 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-primary mb-4 leading-[0.95]">
                당신의 <br />
                <span className="text-secondary">이상적인 파트너</span>
              </h2>
              <p className="text-on-surface-variant max-w-xl font-body leading-relaxed">
                FIRO-B 6개 지표를 역산하여 당신과 심리적으로 가장 조화를 이루는
                파트너 프로파일을 도출했습니다. 아래는 관계의 흐름·궁합·주의 유형까지
                정리한 심층 분석입니다.
              </p>
            </div>

            <LockedSection
              hasAccess={hasAccess}
              unlocking={unlocking}
              onUnlock={onRequestUnlock}
              label="이상적인 파트너 프로필 & 궁합 예측"
              hint="프로파일 archetype · 복합 매치 점수 · 주의해야 할 유형까지"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Big archetype card */}
                <div className="md:col-span-2 group relative bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-editorial border border-outline-variant/10">
                  <div className="relative h-[340px] overflow-hidden bg-gradient-to-br from-tertiary-fixed via-secondary-fixed to-primary-fixed">
                    <div className="absolute inset-0 firo-gradient opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined filled text-white/95 text-[200px] leading-none">favorite</span>
                    </div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-secondary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-headline font-bold text-sm tracking-tight">
                        복합 궁합 94%
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-1 font-headline">Ideal Partner Archetype</p>
                      <h3 className="text-3xl font-extrabold text-white font-headline leading-tight">The Catalyst</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-on-surface-variant leading-relaxed mb-6">{partner.narrative}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-secondary-container/30 text-on-secondary-container text-[11px] font-bold uppercase tracking-[0.15em] font-headline">
                        Inclusion Match · {normalize(partner.profile.eI + partner.profile.wI) / 2 | 0}%
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-tertiary-fixed/60 text-on-tertiary-fixed-variant text-[11px] font-bold uppercase tracking-[0.15em] font-headline">
                        Complementary Control
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase tracking-[0.15em] font-headline">
                        Emotional Resonance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Partner score grid */}
                <div className="bg-primary text-on-primary rounded-[2rem] p-8 firo-gradient flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-2 font-headline">Profile Scores</h4>
                    <h3 className="text-2xl font-bold font-headline mb-6">예상 FIRO-B 점수</h3>
                    <div className="space-y-4">
                      {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-primary-fixed-dim">{SCALE_LABELS[key]}</span>
                            <span className="font-extrabold text-secondary-fixed font-headline">{partner.profile[key].toFixed(1)}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-secondary-container to-secondary-fixed rounded-full"
                              style={{ width: `${normalize(partner.profile[key])}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Traits */}
                <div className="md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 shadow-editorial border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-full bg-secondary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined filled text-on-secondary-fixed-variant">check_circle</span>
                    </div>
                    <h4 className="text-xl font-bold text-primary font-headline">이런 분을 찾으세요</h4>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {partner.traits.map((t, i) => (
                      <li key={i} className="flex gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                        <span className="material-symbols-outlined text-secondary text-lg mt-0.5 shrink-0">auto_awesome</span>
                        <span className="text-sm text-on-surface-variant leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cautions */}
                <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-full bg-tertiary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">warning</span>
                    </div>
                    <h4 className="text-xl font-bold font-headline">주의해야 할 유형</h4>
                  </div>
                  <ul className="space-y-3">
                    {partner.cautions.map((c, i) => (
                      <li key={i} className="flex gap-3 p-3 bg-white/40 rounded-xl">
                        <span className="text-sm leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Why these matches — editorial banner */}
              <div className="mt-8 bg-primary text-white rounded-[2rem] p-10 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden">
                <div className="flex-1 relative z-10">
                  <h3 className="text-3xl font-headline font-bold mb-4">왜 이 유형이 가장 잘 맞나요?</h3>
                  <p className="text-primary-fixed-dim leading-relaxed max-w-xl">
                    당신의 <strong className="text-secondary-fixed">기대(Wanted)</strong> 점수를 자연스럽게 표현하는
                    사람을 파트너로 두면, 관계에서 받는 에너지가 소모되지 않습니다.
                    FIRO-B 알고리즘은 당신이 굳이 말하지 않아도 상대가 자발적으로
                    채워줄 수 있는 영역을 계산해 위 프로파일을 도출했습니다.
                  </p>
                </div>
                <div className="flex gap-3 relative z-10">
                  <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium font-headline">Analytical Core</div>
                  <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium font-headline">FIRO-B 기반</div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary rounded-full blur-[100px] opacity-30" />
              </div>
            </LockedSection>
          </div>
        )}

        {/* ── Tab: Conflict Style ── */}
        {activeTab === 'conflict' && (
          <div className="space-y-6">
            {/* Editorial hero */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-editorial border border-outline-variant/10">
                <div className="flex items-start gap-5">
                  <span className="text-6xl">{conflict.icon}</span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 font-headline">Conflict Style</p>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-primary font-headline mb-3 leading-tight">{conflict.style}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{conflict.description.slice(0, 120)}…</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 bg-secondary-container p-8 rounded-[2rem] flex flex-col justify-center">
                <span className="material-symbols-outlined filled text-secondary text-5xl mb-3">balance</span>
                <h4 className="text-on-secondary-container text-xl font-bold font-headline mb-2">갈등은 관계의 건강도 지표</h4>
                <p className="text-on-secondary-container/80 text-sm leading-relaxed">
                  갈등을 피하지 말고, 당신의 스타일을 이해하고 활용하세요.
                  아래에 당신의 강점·약점·실전 대응 전략을 정리했습니다.
                </p>
              </div>
            </div>

            <LockedSection
              hasAccess={hasAccess}
              unlocking={unlocking}
              onUnlock={onRequestUnlock}
              label="갈등 패턴 상세 분석"
              hint="강점, 약점, 파트너와의 실전 대화 전략까지"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full description */}
                <div className="md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-editorial border border-outline-variant/10">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">심층 분석</h4>
                  <p className="text-on-surface-variant leading-[1.9] text-[15px]">{conflict.description}</p>
                </div>

                {/* Strengths */}
                <div className="bg-primary text-on-primary rounded-[2rem] p-8 firo-gradient">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-4 font-headline">Strengths</h4>
                  <ul className="space-y-4">
                    {conflict.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined filled text-secondary-container mt-0.5 text-xl shrink-0">check_circle</span>
                        <span className="text-sm leading-relaxed text-primary-fixed-dim">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-[2rem] p-8">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 font-headline">Watch Out</h4>
                  <ul className="space-y-4">
                    {conflict.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-tertiary-container mt-0.5 text-xl shrink-0">error</span>
                        <span className="text-sm leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="md:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-editorial border border-outline-variant/10">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Practical Tips</h4>
                  <h3 className="text-2xl font-bold text-primary font-headline mb-6">실전 대응 전략</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {conflict.tips.map((t, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                        <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shrink-0 font-headline">
                          {i + 1}
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed flex-1">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relationship advice — closing editorial */}
                <div className="md:col-span-2 bg-gradient-to-br from-secondary-fixed via-tertiary-fixed to-primary-fixed rounded-[2rem] p-8 md:p-10">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-secondary-fixed-variant mb-3 font-headline">Relationship Note</h4>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary font-headline mb-4 leading-tight">파트너에게 전하고 싶은 한 줄</h3>
                  <p className="text-on-secondary-fixed-variant leading-relaxed text-[15px] italic">"{conflict.relationshipAdvice}"</p>
                </div>
              </div>
            </LockedSection>
          </div>
        )}

        {/* ── Tab: Action Guide ── */}
        {activeTab === 'action' && (
          <div>
            <div className="mb-10 editorial-asymmetry">
              <h2 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-primary mb-4 leading-[0.95]">
                점수에서 <br /><span className="text-secondary">행동으로</span>
              </h2>
              <p className="text-on-surface-variant max-w-xl font-body leading-relaxed">
                이해만으로 관계는 바뀌지 않습니다. 당신의 FIRO-B 데이터에서
                가장 에너지가 큰 간극 4곳을 골라, 2주 안에 시도해볼 수 있는
                구체적 행동과 대화 스크립트를 정리했습니다.
              </p>
            </div>

            <LockedSection
              hasAccess={hasAccess}
              unlocking={unlocking}
              onUnlock={onRequestUnlock}
              label="관계를 바꾸는 4단계 행동 가이드"
              hint="오늘부터 쓸 수 있는 대화 스크립트 · 2주 실천 플랜"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {buildActionItems(scores).map((item, i) => (
                  <div key={i} className={`${i === 0 ? 'md:col-span-2 bg-primary text-white firo-gradient' : 'bg-surface-container-lowest shadow-editorial border border-outline-variant/10'} rounded-[2rem] p-8 md:p-10`}>
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold font-headline text-xl
                        ${i === 0 ? 'bg-secondary text-white' : 'bg-secondary-fixed text-on-secondary-fixed-variant'}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-2xl font-extrabold font-headline mb-2 ${i === 0 ? 'text-white' : 'text-primary'}`}>{item.title}</h4>
                        <p className={`text-sm leading-relaxed mb-4 ${i === 0 ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{item.description}</p>
                        <div className={`rounded-xl p-4 ${i === 0 ? 'bg-white/10' : 'bg-surface-container-low'}`}>
                          <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-2 font-headline ${i === 0 ? 'text-secondary-fixed-dim' : 'text-secondary'}`}>대화 스크립트</p>
                          <p className={`text-sm italic leading-relaxed ${i === 0 ? 'text-white' : 'text-on-surface'}`}>"{item.script}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2-week plan teaser */}
              <div className="mt-8 bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-editorial border border-outline-variant/10">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">14-Day Plan</h4>
                <h3 className="text-3xl font-bold text-primary font-headline mb-6">2주 실천 로드맵</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { week: 'Week 1 · 관찰', tasks: ['매일 밤 오늘 대인관계에서 느낀 감정 3개 기록', '가장 에너지 소모가 컸던 대화 1개 회고', '파트너·동료에게 이번 주 사소한 감사 1번 표현'] },
                    { week: 'Week 2 · 실행', tasks: ['가이드 1번 시도 후 반응 기록', '파트너에게 위 대화 스크립트 그대로 시도', '한 주 마무리에 관계 온도 1-10점 셀프 리포트'] },
                  ].map(({ week, tasks }, i) => (
                    <div key={i} className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">{week}</p>
                      <ul className="space-y-2.5">
                        {tasks.map((t, j) => (
                          <li key={j} className="flex gap-3 text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-secondary text-lg shrink-0">radio_button_unchecked</span>
                            <span className="leading-relaxed">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </LockedSection>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════
          POST-UNLOCK UPSELLS
      ════════════════════════════════════════════════════════ */}
      {hasAccess && (
        <section className="px-6 pb-20 max-w-7xl mx-auto no-capture">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CoupleUpsell userName={userName} />
            <ConsultationCTA userName={userName} />
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          SHARE · EMAIL · FEEDBACK · COMMENTS
      ════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-20 max-w-7xl mx-auto space-y-6 no-capture">
        <ShareButtons
          userName={userName}
          inclusionType={inclusion.type}
          controlType={control.type}
          affectionType={affection.type}
          conflictStyle={conflict.style}
        />
        <EmailResultsForm
          userName={userName}
          testDate={testDate}
          scores={scores}
          inclusionType={inclusion.type}
          controlType={control.type}
          affectionType={affection.type}
          conflictStyle={conflict.style}
        />
        <FeedbackForm />
        <AdBanner slot="2222222222" format="horizontal" />
        <DisqusSection
          pageUrl="https://projectyoon.com/"
          pageIdentifier="firob-results-main"
          title="결과 공유 & 후기"
          subtitle="당신의 리포트를 본 인상이나 궁금한 점을 자유롭게 남겨주세요"
        />
      </section>

      {/* ════════════════════════════════════════════════════════
          RETAKE
      ════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-20 max-w-3xl mx-auto text-center no-capture">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/20 hover:bg-surface-container transition-colors font-medium font-headline cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">restart_alt</span>
          <span>다시 검사하기</span>
        </button>
      </section>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Action items synthesized from score gaps
───────────────────────────────────────────────────────────── */

interface ActionItem {
  title: string
  description: string
  script: string
}

function buildActionItems(s: FIROBScores): ActionItem[] {
  const items: ActionItem[] = []
  const affGap = s.wA - s.eA
  const ctlGap = s.wC - s.eC
  const incGap = s.wI - s.eI

  if (affGap >= 2) {
    items.push({
      title: '원하는 애정을 말로 표현하기',
      description: `당신은 상대에게 기대하는 애정(${s.wA.toFixed(0)}점)이 실제 표현하는 애정(${s.eA.toFixed(0)}점)보다 ${affGap.toFixed(0)}점 큽니다. 이 간극은 파트너에게 "내 마음을 알아채 주길 바라는 욕구"로 이어져 종종 서운함으로 표출됩니다. 이번 주는 기대를 한 문장으로 꺼내어 말하는 연습부터.`,
      script: '요즘 많이 바빠 보여서 내가 먼저 챙겨주지 못했어. 이번 주말엔 네가 나한테 집중해주면 정말 좋을 것 같아.',
    })
  } else if (affGap <= -2) {
    items.push({
      title: '애정 표현 속도 조절하기',
      description: `표현하는 애정(${s.eA.toFixed(0)}점)이 상대에게 원하는 수준(${s.wA.toFixed(0)}점)보다 높습니다. 상대가 부담을 느끼거나, 당신이 감정적으로 소진될 위험이 있습니다. 표현 전에 상대의 수용 용량을 한 번 체크하는 습관을.`,
      script: '내가 요즘 너한테 자주 감정 표현을 하는데, 혹시 부담스러우면 언제든 말해줘. 너 페이스 맞추는 게 더 중요하니까.',
    })
  }

  if (ctlGap >= 2) {
    items.push({
      title: '주도권을 놓을 타이밍 설계',
      description: `당신은 리드받기를 원하지만(${s.wC.toFixed(0)}점) 실제로는 스스로 이끌고 있습니다(${s.eC.toFixed(0)}점). 이 불균형은 관계에서 "왜 항상 내가 결정해야 하지"라는 피로로 축적됩니다. 구체적으로 상대에게 결정권을 위임하는 영역을 정해두세요.`,
      script: '이번 주 데이트 장소는 네가 완전히 결정해줘. 나는 무조건 따를게. 어디든 좋아.',
    })
  } else if (ctlGap <= -2) {
    items.push({
      title: '리드 스타일을 부드럽게',
      description: `리드하는 정도(${s.eC.toFixed(0)}점)가 원하는 수준(${s.wC.toFixed(0)}점)보다 높습니다. 상대가 "내 의견이 없는 사람 취급받는다"고 느낄 수 있어요. 결정 전에 한 번 묻는 단순한 습관으로 관계가 크게 달라집니다.`,
      script: '이거 내가 바로 결정해도 될까, 아니면 너 생각도 들어볼까?',
    })
  }

  if (incGap >= 2) {
    items.push({
      title: '함께 있고 싶다는 신호 보내기',
      description: `함께하고 싶은 욕구(${s.wI.toFixed(0)}점)가 실제 초대 행동(${s.eI.toFixed(0)}점)보다 큽니다. 상대는 당신이 "혼자 있고 싶어 하는 것 같다"고 오해할 수 있어요. 작은 초대 한 번이 이 오해를 풀어줍니다.`,
      script: '오늘 저녁에 혹시 시간 돼? 딱히 할 건 없는데 그냥 같이 있고 싶어서.',
    })
  } else if (incGap <= -2) {
    items.push({
      title: '혼자만의 시간을 정당화하기',
      description: `초대·참여 행동(${s.eI.toFixed(0)}점)이 실제 원하는 수준(${s.wI.toFixed(0)}점)보다 높습니다. 에너지가 과소비되면서 점차 관계에서 번아웃될 위험이 있어요. "혼자 있는 시간"을 스케줄에 못 박아두세요.`,
      script: '이번 주말 하루는 나 혼자 집에서 쉬는 시간으로 정해둘게. 다음 주엔 다시 같이 움직이자.',
    })
  }

  // Universal fallback action
  items.push({
    title: '주간 관계 체크인 루틴',
    description: '매주 일요일 저녁 10분, 파트너와 "이번 주 우리 관계에서 좋았던 것 / 아쉬웠던 것 / 다음 주 바라는 것"을 각자 3개씩 공유하세요. 습관이 쌓이면 큰 갈등 이전에 작은 신호를 잡을 수 있습니다.',
    script: '이번 주 우리 관계에서 내가 제일 좋았던 건 ___이야. 네가 다음 주에 하나 더 해줬으면 하는 건 ___이고. 너는 어때?',
  })

  return items.slice(0, 4)
}
