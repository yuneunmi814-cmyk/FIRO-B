import '@/firo-report.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Shield, Heart, Compass,
  ChevronDown,
} from 'lucide-react'
import type { FIROBScores } from '../types'
import RadarChart from '../components/RadarChart'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import {
  getDimTotals,
  getGrandTotalLabel,
  getScoreLevel,
  getDimLevel,
  getInclusionAnalysis,
  getControlAnalysis,
  getAffectionAnalysis,
  getConflictStyle,
  getIdealPartner,
  getDetailedInterpretation,
  getOrgRoles,
} from '../utils/analysis'
import { SCALE_LABELS, SCALE_COLORS } from '../data/questions'

interface Props {
  scores: FIROBScores
  userName: string
  testDate: string
  hasAccess: boolean
  onUnlock: () => void
  onRetake: () => void
}

/* ── tiny helpers ─────────────────────────────────── */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

/* ── ScoreRow (reusable bar row) ──────────────────── */
function ScoreRow({ label, score, color }: { label: string; score: number; color: string }) {
  const lv = getScoreLevel(score)
  return (
    <div className="rpt-bar-row">
      <span className="rpt-bar-name">{label}</span>
      <div className="rpt-bar-track">
        <div className="rpt-bar-fill" style={{ width: `${(score / 9) * 100}%`, background: color }} />
      </div>
      <span className="rpt-bar-num" style={{ color }}>{score.toFixed(1)}</span>
      <span className="rpt2-level-badge" style={{ background: lv.color + '22', color: lv.color }}>
        {lv.ko}
      </span>
    </div>
  )
}

/* ── DomainDetailCard ─────────────────────────────── */
function DomainDetailCard({
  icon: Icon, title, type, description, partnerNeed, colorClass, bgClass,
}: {
  icon: React.ElementType
  title: string
  type: string
  description: string
  partnerNeed: string
  colorClass: string
  bgClass: string
}) {
  return (
    <Card className="rounded-3xl border-zinc-200 shadow-sm overflow-hidden">
      <CardHeader className={`${bgClass} border-b border-zinc-100`}>
        <div className="flex items-center gap-3">
          <div className={`h-11 w-11 rounded-2xl ${colorClass} text-white flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
            <CardTitle className="text-lg">{type}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <p className="text-sm leading-7 text-zinc-700">{description}</p>
        <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
          <p className="text-xs font-semibold text-zinc-500 mb-1.5">파트너에게 필요한 것</p>
          <p className="text-sm leading-6 text-zinc-700">{partnerNeed}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── Main component ───────────────────────────────── */
export default function Results({ scores, userName, testDate, hasAccess, onUnlock, onRetake }: Props) {
  const [activeTab, setActiveTab] = useState('individual')

  const totals    = getDimTotals(scores)
  const inclusion = getInclusionAnalysis(scores.eI, scores.wI)
  const control   = getControlAnalysis(scores.eC, scores.wC)
  const affection = getAffectionAnalysis(scores.eA, scores.wA)
  const conflict  = getConflictStyle(scores)
  const partner   = getIdealPartner(scores)
  const interps   = getDetailedInterpretation(scores)
  const roles     = getOrgRoles(scores)
  const grandLabel = getGrandTotalLabel(totals.grand)

  return (
    <div id="report-capture">

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <div className="rpt2-hero">
        <div className="rpt2-hero-inner">
          <motion.div {...fade(0)}>
            <span className="rpt2-product-badge">관계 리듬 리포트</span>
            <h1 className="rpt2-hero-headline">
              우리 관계,<br />왜 이렇게 느껴질까?
            </h1>
            <p className="rpt2-hero-sub">
              당신의 관계 욕구와 행동 패턴, 그리고 반복되는 오해의 이유를 분석합니다
            </p>
          </motion.div>

          <motion.div {...fade(0.1)} className="rpt2-hero-meta">
            {userName && (
              <div className="rpt2-meta-chip">
                <span className="rpt2-meta-label">이름</span>
                <span className="rpt2-meta-val">{userName}</span>
              </div>
            )}
            <div className="rpt2-meta-chip">
              <span className="rpt2-meta-label">검사일</span>
              <span className="rpt2-meta-val">{testDate}</span>
            </div>
            <div className="rpt2-meta-chip">
              <span className="rpt2-meta-label">욕구 총합</span>
              <span className="rpt2-meta-val">{totals.grand.toFixed(0)}</span>
            </div>
            <div className="rpt2-meta-chip">
              <span className="rpt2-meta-label">수준</span>
              <span className="rpt2-meta-val">{grandLabel}</span>
            </div>
          </motion.div>

          <motion.div {...fade(0.15)} className="rpt2-hero-actions no-capture">
            {hasAccess && (
              <PdfDownloadButton userName={userName} className="rpt2-action-btn rpt2-action-btn--pdf" />
            )}
          </motion.div>
        </div>

        {/* scroll cue */}
        <div className="rpt2-scroll-cue no-capture">
          <ChevronDown size={20} />
        </div>
      </div>

      {/* ════════════════════════════════════════════
          CORE SUMMARY (always visible)
      ════════════════════════════════════════════ */}
      <div className="rpt2-body">
        <motion.section
          className="rpt2-section"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="rpt2-sec-title">핵심 점수 요약</h2>
          <p className="rpt2-sec-sub">아래 점수는 항상 무료로 확인할 수 있습니다.</p>

          <div className="rpt2-summary-grid">
            {/* Radar */}
            <div className="rpt2-radar-wrap">
              <RadarChart scores={scores} size={260} />
            </div>

            {/* Score cards */}
            <div>
              <div className="rpt2-score-cards">
                {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => {
                  const lv    = getScoreLevel(scores[key])
                  const color = SCALE_COLORS[key]
                  return (
                    <div key={key} className="rpt2-score-card">
                      <span className="rpt2-sc-label">{key}</span>
                      <span className="rpt2-sc-score" style={{ color }}>{scores[key].toFixed(1)}</span>
                      <span className="rpt2-sc-badge" style={{ background: lv.color + '22', color: lv.color }}>
                        {lv.ko}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Dim total bars */}
              <div className="rpt2-dim-bars">
                {[
                  { label: '소속 (Inclusion)', value: totals.inclusion, color: '#43D39E' },
                  { label: '통제 (Control)',   value: totals.control,   color: '#FF9F43' },
                  { label: '정서 (Affection)', value: totals.affection, color: '#FF6B9D' },
                ].map(({ label, value, color }) => {
                  const lv = getDimLevel(value)
                  return (
                    <div key={label} className="rpt2-dim-bar-row">
                      <div className="rpt2-dim-bar-header">
                        <span className="rpt2-dim-bar-label">{label}</span>
                        <div className="flex items-center gap-2">
                          <span style={{ color }} className="rpt2-dim-bar-val">{value.toFixed(1)}</span>
                          <span className="rpt2-dim-level">{lv.ko}</span>
                        </div>
                      </div>
                      <div className="rpt2-dim-track">
                        <div className="rpt2-dim-fill" style={{ width: `${(value / 18) * 100}%`, background: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Full score bar rows */}
          <div className="rpt2-score-bars">
            {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => (
              <ScoreRow key={key} label={SCALE_LABELS[key]} score={scores[key]} color={SCALE_COLORS[key]} />
            ))}
          </div>
        </motion.section>

        <AdBanner slot="1111111111" />

        {/* ════════════════════════════════════════
            PAYWALL CTA  (shown when locked)
        ════════════════════════════════════════ */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <PaywallCTA
              scores={scores}
              inclusion={inclusion}
              conflict={conflict}
              onUnlock={onUnlock}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════
            TABBED REPORT
        ════════════════════════════════════════ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl rounded-2xl h-auto p-1 bg-zinc-100">
            <TabsTrigger value="individual" className="rounded-xl py-3 px-1 text-xs">개인 해석</TabsTrigger>
            <TabsTrigger value="couple"     className="rounded-xl py-3 px-1 text-xs">커플 분석</TabsTrigger>
            <TabsTrigger value="conflict"   className="rounded-xl py-3 px-1 text-xs">갈등 해결</TabsTrigger>
            <TabsTrigger value="action"     className="rounded-xl py-3 px-1 text-xs">행동 가이드</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: 개인 해석 ─────────────────── */}
          <TabsContent value="individual" className="space-y-6">

            {/* FREE: inclusion summary card */}
            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">소속 (Inclusion)</p>
                    <CardTitle>{inclusion.type}</CardTitle>
                  </div>
                  <Badge variant="outline" className="ml-auto">미리보기</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-zinc-600 mb-4">{inclusion.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3 text-center">
                    <p className="text-xs text-zinc-500 mb-1">표현</p>
                    <p className="text-2xl font-black" style={{ color: '#43D39E' }}>{scores.eI.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3 text-center">
                    <p className="text-xs text-zinc-500 mb-1">기대</p>
                    <p className="text-2xl font-black" style={{ color: '#43D39E' }}>{scores.wI.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LOCKED: control + affection + interpretations */}
            <LockedSection
              hasAccess={hasAccess}
              onUnlock={onUnlock}
              label="통제·애정 영역 상세 분석"
              hint="표현 방식과 기대 사이의 간극, 그리고 관계 패턴을 자세히 분석합니다"
            >
              <div className="space-y-6">
                <DomainDetailCard
                  icon={Shield}
                  title="통제 (Control)"
                  type={control.type}
                  description={control.description}
                  partnerNeed={control.partnerNeed}
                  colorClass="bg-violet-500"
                  bgClass="bg-violet-50"
                />
                <DomainDetailCard
                  icon={Heart}
                  title="정서 (Affection)"
                  type={affection.type}
                  description={affection.description}
                  partnerNeed={affection.partnerNeed}
                  colorClass="bg-rose-500"
                  bgClass="bg-rose-50"
                />

                {/* Detailed interpretations */}
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">종합 심층 해석</CardTitle>
                    <CardDescription>전체적인 관계 패턴과 대인관계 욕구의 맥락을 분석합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {interps.map((para, i) => (
                      <p key={i} className="text-sm leading-7 text-zinc-600 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        {para}
                      </p>
                    ))}
                  </CardContent>
                </Card>

                {/* Org roles */}
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Compass className="h-5 w-5" /> 조직에서의 자연스러운 역할
                    </CardTitle>
                    <CardDescription>FIRO-B 프로파일을 기반으로 한 팀 내 역할 예측입니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {roles.map(({ role, description }) => (
                      <div key={role} className="flex items-baseline gap-3 bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                        <span className="font-bold text-violet-600 shrink-0 min-w-[120px]">{role}</span>
                        <span className="text-sm text-zinc-600">{description}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </LockedSection>
          </TabsContent>

          {/* ── Tab 2: 커플 분석 ─────────────────── */}
          <TabsContent value="couple" className="space-y-6">
            <LockedSection
              hasAccess={hasAccess}
              onUnlock={onUnlock}
              label="이상적인 파트너 프로필 & 커플 궁합"
              hint="나와 가장 잘 맞는 파트너 유형과 주의해야 할 유형을 분석합니다"
            >
              <div className="space-y-6">
                {/* Ideal partner narrative */}
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" /> 이상적인 파트너 프로필
                    </CardTitle>
                    <CardDescription>당신의 FIRO-B 점수를 역으로 분석해 가장 잘 맞는 상대를 도출했습니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-rose-50 p-5 border border-purple-100">
                      <p className="text-sm leading-7 text-zinc-700">{partner.narrative}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-700 mb-3">✅ 이런 분을 찾으세요</p>
                      <ul className="space-y-2">
                        {partner.traits.map((t, i) => (
                          <li key={i} className="flex gap-2 text-sm text-zinc-600">
                            <span className="text-emerald-500 mt-0.5 shrink-0">●</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-700 mb-3">⚠️ 이런 분은 주의하세요</p>
                      <ul className="space-y-2">
                        {partner.cautions.map((c, i) => (
                          <li key={i} className="flex gap-2 text-sm text-zinc-600">
                            <span className="text-amber-500 mt-0.5 shrink-0">●</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Partner score chips */}
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">이상적인 파트너 예상 점수</CardTitle>
                    <CardDescription>나의 기대 방식을 표현하는 파트너가 가장 잘 맞습니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {(Object.keys(SCALE_LABELS) as (keyof FIROBScores)[]).map(key => {
                        const color = SCALE_COLORS[key]
                        return (
                          <div key={key} className="flex flex-col items-center p-3 rounded-2xl border min-w-[72px]"
                            style={{ background: color + '18', borderColor: color + '55' }}>
                            <span className="text-xs font-bold mb-1" style={{ color }}>{key}</span>
                            <span className="text-xl font-black" style={{ color }}>
                              {partner.profile[key].toFixed(1)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Radar of partner */}
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-500">이상적인 파트너 FIRO-B 프로파일</p>
                    <RadarChart scores={partner.profile} size={220} />
                  </CardContent>
                </Card>
              </div>
            </LockedSection>
          </TabsContent>

          {/* ── Tab 3: 갈등 해결 ─────────────────── */}
          <TabsContent value="conflict" className="space-y-6">

            {/* FREE: style name + brief */}
            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardContent className="p-6 flex items-center gap-5">
                <span className="text-5xl">{conflict.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">주요 갈등 해결 유형</p>
                  <h3 className="text-2xl font-black text-violet-600">{conflict.style}</h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{conflict.description.slice(0, 60)}…</p>
                </div>
                {!hasAccess && <Badge variant="outline" className="ml-auto shrink-0">미리보기</Badge>}
              </CardContent>
            </Card>

            {/* LOCKED: full analysis */}
            <LockedSection
              hasAccess={hasAccess}
              onUnlock={onUnlock}
              label="갈등 패턴 상세 분석"
              hint="강점과 약점, 파트너와의 대화 전략까지 상세히 분석합니다"
            >
              <div className="space-y-5">
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-sm leading-7 text-zinc-700">{conflict.description}</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="rounded-3xl border-zinc-200 shadow-sm" style={{ borderTop: '3px solid #43D39E' }}>
                    <CardHeader>
                      <CardTitle className="text-base">강점</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {conflict.strengths.map((s, i) => (
                        <div key={i} className="flex gap-2 text-sm text-zinc-600">
                          <span className="text-emerald-500">●</span>{s}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="rounded-3xl border-zinc-200 shadow-sm" style={{ borderTop: '3px solid #FF6B6B' }}>
                    <CardHeader>
                      <CardTitle className="text-base">주의할 점</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {conflict.weaknesses.map((w, i) => (
                        <div key={i} className="flex gap-2 text-sm text-zinc-600">
                          <span className="text-rose-400">●</span>{w}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-3xl border-zinc-200 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="text-base">💑 관계에서의 조언</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-zinc-700">{conflict.relationshipAdvice}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">📝 성장을 위한 팁</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {conflict.tips.map((tip, i) => (
                      <p key={i} className="text-sm text-zinc-600 leading-6 pl-4 border-l-2 border-violet-200">{tip}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </LockedSection>
          </TabsContent>

          {/* ── Tab 4: 행동 가이드 ───────────────── */}
          <TabsContent value="action" className="space-y-6">
            <LockedSection
              hasAccess={hasAccess}
              onUnlock={onUnlock}
              label="관계를 바꾸는 행동 가이드"
              hint="점수에서 행동으로 — 오늘 당장 쓸 수 있는 대화 스크립트와 실천 플랜"
            >
              <div className="space-y-6">
                <Card className="rounded-3xl border-zinc-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">맞춤 행동 가이드</CardTitle>
                    <CardDescription>당신의 갭 분석을 기반으로 가장 효과적인 변화 순서를 제안합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    {buildActionItems(scores).map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.35, delay: index * 0.07 }}
                        className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-zinc-900 text-sm">{item.title}</h4>
                              <p className="mt-1 text-xs leading-5 text-zinc-500">{item.description}</p>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3">
                              <p className="text-xs font-semibold text-zinc-500 mb-1">💬 대화 예시</p>
                              <p className="text-xs leading-5 text-zinc-700 italic">"{item.script}"</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* 2-week action plan teaser */}
                <Card className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 text-white shadow-lg">
                  <CardContent className="p-7">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-3">2주 실천 플랜</p>
                    <h3 className="text-xl font-black mb-3">오늘부터 2주, 관계가 달라집니다</h3>
                    <p className="text-sm leading-6 opacity-75">
                      위 행동 가이드를 기반으로, 매일 하나의 작은 실천으로 관계 패턴을 바꾸는
                      2주 플랜이 준비되어 있습니다.
                    </p>
                    {/* TODO: link to downloadable 2-week plan PDF or dedicated page */}
                    <p className="text-xs mt-4 opacity-40">곧 출시 예정 · 전문가 상담 시 함께 제공됩니다</p>
                  </CardContent>
                </Card>
              </div>
            </LockedSection>
          </TabsContent>
        </Tabs>

        {/* ════════════════════════════════════════
            POST-UNLOCK UPSELLS
        ════════════════════════════════════════ */}
        {hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 mt-8"
          >
            <CoupleUpsell />
            <ConsultationCTA />
          </motion.div>
        )}

        {/* ════════════════════════════════════════
            SHARING / EMAIL / SOCIAL
        ════════════════════════════════════════ */}
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

        {/* Retake */}
        <div className="rpt-retake no-capture">
          <p className="rpt-retake-note">이 결과는 현재 시점의 대인관계 욕구를 반영합니다. 시간이 지나면 다시 검사해 보세요.</p>
          <button className="rpt-retake-btn" onClick={onRetake}>다시 검사하기</button>
        </div>

      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────
   Action item builder (derived from gaps)
──────────────────────────────────────────────── */
function buildActionItems(scores: FIROBScores) {
  const items: { title: string; description: string; script: string }[] = []

  const aGap = Math.abs(scores.eA - scores.wA)
  const cGap = Math.abs(scores.eC - scores.wC)
  const iGap = Math.abs(scores.eI - scores.wI)

  if (aGap >= 3) items.push({
    title: '애정 표현 언어 맞추기',
    description: '원하는 애정 방식 3가지를 문장으로 적고, 상대가 이해하기 쉬운 표현으로 전달해보세요.',
    script: '나는 특히 "자주 표현해주기 / 반응해주기 / 시간을 내주기"에서 사랑을 느껴.',
  })

  if (cGap >= 3) items.push({
    title: '결정 규칙 만들기',
    description: '반복적으로 부딪히는 주제에 대해 누가 먼저 제안하고 어떻게 합의할지 미리 정해보세요.',
    script: '이 주제는 감정이 섞이기 전에, 우리만의 결정 규칙을 하나 정해두면 좋겠어.',
  })

  if (iGap >= 3) items.push({
    title: '함께하는 빈도 조율하기',
    description: '함께하고 싶은 빈도와 혼자 충전이 필요한 시간을 숫자로 말해보세요.',
    script: '나는 일주일에 최소 2번은 함께여야 연결감을 느껴. 혼자 쉬는 시간도 필요하지만.',
  })

  if (items.length < 2) items.push({
    title: '주간 체크인 루틴',
    description: '주 1회, 이번 주 좋았던 점·아쉬웠던 점·다음 주 바라는 점을 5분씩 나눠보세요.',
    script: '이번 주에 고마웠던 거 하나, 아쉬웠던 거 하나, 다음 주에 바라는 거 하나만 말해볼래?',
  }, {
    title: '오해 번역하기',
    description: '상대의 행동을 의도가 아니라 욕구 표현으로 번역해보세요.',
    script: '지금 이 반응은 나를 밀어내는 게 아니라, 자기만의 방식으로 안정을 찾는 걸 수도 있겠구나.',
  })

  if (items.length < 4) items.push({
    title: '감사 표현 실천',
    description: '하루에 한 번, 상대의 구체적인 행동에 감사를 표현하는 연습을 해보세요.',
    script: '오늘 ○○해줬을 때 정말 좋았어. 그게 나한테 얼마나 큰 의미인지 알아?',
  })

  return items.slice(0, 4)
}
