import '@/firo-report.css'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Heart, Shield, MessageCircle,
  CheckCircle2, AlertTriangle, Sparkles,
  ArrowRight, Target, Activity,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import type { FIROBScores } from '@/types'

/* ────────────────────────────────────────────────
   Props
──────────────────────────────────────────────── */
interface Props {
  scores: FIROBScores
  userName: string
  testDate: string
  onRetake: () => void
}

/* ────────────────────────────────────────────────
   Internal types
──────────────────────────────────────────────── */
interface DomainScore { expressed: number; wanted: number }
interface SelfData {
  inclusion: DomainScore
  control: DomainScore
  affection: DomainScore
}
type DomainKey = 'inclusion' | 'control' | 'affection'

/* ────────────────────────────────────────────────
   Constants
──────────────────────────────────────────────── */
const DOMAIN_META: Record<DomainKey, {
  label: string
  icon: React.ElementType
  color: string
  soft: string
  text: string
  description: string
}> = {
  inclusion: {
    label: '포함',
    icon: Users,
    color: 'bg-sky-500',
    soft: 'bg-sky-50',
    text: 'text-sky-700',
    description: '사람들과 함께하고 소속감을 느끼고자 하는 욕구',
  },
  control: {
    label: '통제',
    icon: Shield,
    color: 'bg-violet-500',
    soft: 'bg-violet-50',
    text: 'text-violet-700',
    description: '결정, 주도권, 역할 분담과 관련된 욕구',
  },
  affection: {
    label: '애정',
    icon: Heart,
    color: 'bg-rose-500',
    soft: 'bg-rose-50',
    text: 'text-rose-700',
    description: '정서적 친밀감과 애착을 주고받고자 하는 욕구',
  },
}

const ORDER: DomainKey[] = ['inclusion', 'control', 'affection']

/* ────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────── */
function getLevel(score: number) {
  if (score <= 2) return { label: '낮음', tone: 'text-zinc-500' }
  if (score <= 6) return { label: '중간', tone: 'text-zinc-700' }
  return { label: '높음', tone: 'text-zinc-900 font-bold' }
}

function gapTone(gap: number) {
  if (gap <= 1) return { label: '균형', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (gap <= 3) return { label: '주의', style: 'bg-amber-50 text-amber-700 border-amber-200' }
  return { label: '갈등 가능성 높음', style: 'bg-rose-50 text-rose-700 border-rose-200' }
}

function scoreToPercent(score: number) {
  return Math.max(0, Math.min(100, Math.round((score / 9) * 100)))
}

function domainInterpretation(key: DomainKey, expressed: number, wanted: number) {
  const gap = Math.abs(expressed - wanted)
  const map: Record<DomainKey, Record<string, string>> = {
    inclusion: {
      highExpressed: '먼저 사람들과 연결되고 모임을 이끄는 편입니다.',
      lowExpressed:  '필요할 때만 참여하고 혼자만의 페이스를 지키는 편입니다.',
      highWanted:    '초대, 관심, 함께함을 분명히 느낄 때 안정감을 느낍니다.',
      lowWanted:     '관계 속에서도 과도한 개입보다 적절한 거리를 선호합니다.',
      highGap:       '겉으로 보이는 참여 방식과 내면의 소속 욕구 사이에 차이가 있어 서운함이 쌓일 수 있습니다.',
      lowGap:        '사람들과의 거리 조절 방식이 비교적 일관적입니다.',
    },
    control: {
      highExpressed: '의사결정과 구조화를 주도할 때 편안함을 느낍니다.',
      lowExpressed:  '주도권을 강하게 쥐기보다 흐름을 따르거나 협의하려는 편입니다.',
      highWanted:    '역할, 기준, 방향성이 분명할 때 안정감을 느낍니다.',
      lowWanted:     '간섭 없이 자율적으로 움직일 수 있을 때 편안합니다.',
      highGap:       '겉으로는 리드하거나 양보하지만, 실제로 원하는 통제 수준과 달라 답답함이 생길 수 있습니다.',
      lowGap:        '의사결정 방식과 원하는 자율성 수준이 비교적 잘 맞습니다.',
    },
    affection: {
      highExpressed: '마음 표현, 다정한 반응, 친밀감 형성에 적극적인 편입니다.',
      lowExpressed:  '애정 표현은 신중하거나 절제되어 보일 수 있습니다.',
      highWanted:    '정서적 확인, 애정 표현, 친밀한 교류가 충분할 때 만족도가 높습니다.',
      lowWanted:     '친밀감은 중요하지만 지나친 정서적 밀착은 부담스럽게 느낄 수 있습니다.',
      highGap:       '속으로는 애정을 원하지만 표현 방식이 조심스러워 오해가 생기기 쉽습니다.',
      lowGap:        '애정 표현 방식과 기대 수준이 비교적 일치합니다.',
    },
  }
  const copy = map[key]
  return {
    expressed:  expressed >= 7 ? copy.highExpressed : copy.lowExpressed,
    wanted:     wanted    >= 7 ? copy.highWanted    : copy.lowWanted,
    gap:        gap       >= 4 ? copy.highGap       : copy.lowGap,
  }
}

function relationshipSummary(self: SelfData) {
  const domains = ORDER.map(key => ({
    key,
    total: (self[key].expressed) + (self[key].wanted),
    gap: Math.abs(self[key].expressed - self[key].wanted),
  }))
  const strongest  = [...domains].sort((a, b) => b.total - a.total)[0]
  const biggestGap = [...domains].sort((a, b) => b.gap   - a.gap)[0]
  return `이 관계 스타일의 중심은 ${DOMAIN_META[strongest.key].label} 욕구입니다. 관계에서 중요하게 느끼는 핵심이 분명하고, 특히 ${DOMAIN_META[biggestGap.key].label} 영역에서는 겉으로 드러나는 행동과 실제 기대 사이에 조율이 필요할 수 있습니다.`
}

function recommendedActions(self: SelfData) {
  const actions: { title: string; description: string; script: string }[] = []

  const affectionGap  = Math.abs(self.affection.expressed  - self.affection.wanted)
  const controlGap    = Math.abs(self.control.expressed    - self.control.wanted)
  const inclusionGap  = Math.abs(self.inclusion.expressed  - self.inclusion.wanted)

  if (affectionGap >= 3) actions.push({
    title: '애정 표현 언어 맞추기',
    description: '원하는 애정 방식 3가지를 문장으로 적고, 상대가 이해하기 쉬운 표현으로 바꿔 전달해보세요.',
    script: '나는 애정을 중요하게 느끼는데, 특히 "자주 표현해주기 / 반응해주기 / 시간을 내주기"에서 크게 느껴져.',
  })

  if (controlGap >= 3) actions.push({
    title: '결정 규칙 만들기',
    description: '반복적으로 부딪히는 주제에 대해 "누가 먼저 제안하고 어떻게 합의할지"를 정해보세요.',
    script: '이 주제는 감정적으로 부딪히기 전에, 우리만의 결정 규칙을 하나 정해두면 좋겠어.',
  })

  if (inclusionGap >= 3) actions.push({
    title: '함께하는 빈도 조율하기',
    description: '함께 있고 싶은 빈도와 혼자 충전이 필요한 시간을 각각 숫자로 말해보세요.',
    script: '나는 일주일에 최소 2번은 함께 시간을 보내야 연결감을 느껴. 대신 혼자 쉬는 시간도 필요해.',
  })

  if (actions.length < 3) actions.push(
    {
      title: '주간 체크인 루틴',
      description: '주 1회, 이번 주에 좋았던 점·아쉬웠던 점·다음 주 바라는 점을 5분씩 나눠보세요.',
      script: '이번 주에 고마웠던 점 하나, 아쉬웠던 점 하나, 다음 주에 바라는 점 하나만 말해볼래?',
    },
    {
      title: '오해 번역하기',
      description: '상대의 행동을 의도 해석이 아니라 욕구 표현으로 번역해보세요.',
      script: '지금 이 반응은 나를 밀어내려는 게 아니라, 자기만의 방식으로 안정감을 찾으려는 걸 수도 있겠구나.',
    }
  )

  return actions.slice(0, 4)
}

/* ────────────────────────────────────────────────
   Sub-components
──────────────────────────────────────────────── */
function ScoreBar({ label, score }: { label: string; score: number }) {
  const level = getLevel(score)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className={`font-semibold ${level.tone}`}>{score}/9 · {level.label}</span>
      </div>
      <Progress value={scoreToPercent(score)} className="h-2" />
    </div>
  )
}

function InsightBox({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 mb-2">
        {icon}
        {title}
      </div>
      <p className="text-sm leading-6 text-zinc-600">{content}</p>
    </div>
  )
}

function DomainCard({ domainKey, data }: { domainKey: DomainKey; data: DomainScore }) {
  const meta   = DOMAIN_META[domainKey]
  const Icon   = meta.icon
  const gap    = Math.abs(data.expressed - data.wanted)
  const tone   = gapTone(gap)
  const interp = domainInterpretation(domainKey, data.expressed, data.wanted)

  return (
    <Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className={`${meta.soft} border-b border-zinc-100`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl ${meta.color} text-white flex items-center justify-center`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{meta.label}</CardTitle>
              <CardDescription className="text-sm text-zinc-600 mt-1">{meta.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={`${tone.style} border shrink-0`}>
            갭 {gap} · {tone.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreBar label="표현된 욕구" score={data.expressed} />
          <ScoreBar label="원하는 욕구" score={data.wanted} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <InsightBox title="겉으로 보이는 모습" content={interp.expressed} icon={<Activity className="h-4 w-4" />} />
          <InsightBox title="내면의 기대"        content={interp.wanted}    icon={<Sparkles  className="h-4 w-4" />} />
          <InsightBox title="관계에서의 포인트"  content={interp.gap}       icon={<Target    className="h-4 w-4" />} />
        </div>
      </CardContent>
    </Card>
  )
}

function PairRow({ title, mine, partner }: { title: string; mine: number; partner: number }) {
  const diff   = Math.abs(mine - partner)
  const status = diff <= 1 ? '잘 맞음' : diff <= 3 ? '조율 필요' : '차이 큼'
  return (
    <div className="rounded-2xl border border-zinc-200 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-zinc-900 text-sm">{title}</div>
        <Badge variant="outline">{status}</Badge>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
        <div>
          <div className="text-zinc-500 mb-1">나</div>
          <div className="font-semibold text-zinc-900">{mine}/9</div>
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-400" />
        <div className="text-right">
          <div className="text-zinc-500 mb-1">상대</div>
          <div className="font-semibold text-zinc-900">{partner}/9</div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ item, index }: { item: { title: string; description: string; script: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-semibold text-sm">
          {index + 1}
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-zinc-900">{item.title}</h4>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{item.description}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-sm leading-6 text-zinc-700">
            <div className="font-medium text-zinc-900 mb-1">대화 예시</div>
            "{item.script}"
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────
   Main component
──────────────────────────────────────────────── */
export default function FiroBReport({ scores, userName, testDate, onRetake }: Props) {
  const [activeTab, setActiveTab] = useState('overview')

  const self: SelfData = {
    inclusion: { expressed: scores.eI, wanted: scores.wI },
    control:   { expressed: scores.eC, wanted: scores.wC },
    affection: { expressed: scores.eA, wanted: scores.wA },
  }

  const summary = useMemo(() => relationshipSummary(self), [scores])
  const actions = useMemo(() => recommendedActions(self),  [scores])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900">
      <section className="max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12 space-y-8">

        {/* ── Header cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <Card className="rounded-[28px] border-zinc-200 shadow-sm overflow-hidden">
            <CardContent className="p-7 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="rounded-full px-3 py-1 bg-zinc-900 hover:bg-zinc-900">FIRO-B 결과 리포트</Badge>
                <Badge variant="outline">완료일 {testDate}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {userName ? `${userName}님의 관계 리듬을 한눈에 보는 리포트` : '관계 리듬을 한눈에 보는 FIRO-B 리포트'}
              </h1>
              <p className="mt-4 text-base text-zinc-600 leading-8 max-w-3xl">
                소속·통제·정서 욕구의 표현 방식과 기대 방식을 분석한 결과입니다.
              </p>
              <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 mb-2">
                  <Sparkles className="h-4 w-4" />
                  한 줄 해석
                </div>
                <p className="text-sm md:text-base leading-7 text-zinc-700">{summary}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">핵심 지표 요약</CardTitle>
              <CardDescription>표현하는 방식과 원하는 방식의 차이를 먼저 보세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {ORDER.map(key => {
                const gap = Math.abs(self[key].expressed - self[key].wanted)
                return (
                  <div key={key} className="rounded-2xl border border-zinc-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-zinc-900">{DOMAIN_META[key].label}</div>
                      <Badge variant="outline">갭 {gap}</Badge>
                    </div>
                    <div className="space-y-3">
                      <ScoreBar label="표현" score={self[key].expressed} />
                      <ScoreBar label="기대" score={self[key].wanted} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl rounded-2xl h-auto p-1 bg-zinc-100">
            <TabsTrigger value="overview" className="rounded-xl py-3 px-2 text-sm">개인 해석</TabsTrigger>
            <TabsTrigger value="couple"   className="rounded-xl py-3 px-2 text-sm">커플 분석</TabsTrigger>
            <TabsTrigger value="action"   className="rounded-xl py-3 px-2 text-sm">행동 가이드</TabsTrigger>
          </TabsList>

          {/* 개인 해석 */}
          <TabsContent value="overview" className="space-y-6">
            {ORDER.map(key => (
              <DomainCard key={key} domainKey={key} data={self[key]} />
            ))}
          </TabsContent>

          {/* 커플 분석 */}
          <TabsContent value="couple" className="space-y-6">
            <Card className="rounded-3xl border-dashed border-zinc-300 shadow-none bg-zinc-50">
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">커플 비교 데이터가 아직 없어요</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 max-w-xl mx-auto">
                  상대의 FIRO-B 결과가 추가되면, 욕구 궁합·갈등 포인트·대화 가이드까지 자동으로 확장할 수 있어요.
                </p>
              </CardContent>
            </Card>

            {/* 내 표현/기대 비교 미리보기 */}
            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">내 표현 vs 기대 비교</CardTitle>
                <CardDescription>나의 표현 방식과 내가 원하는 방식의 차이를 먼저 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ORDER.map(key => (
                  <div key={key} className="grid gap-4 md:grid-cols-2">
                    <PairRow
                      title={`${DOMAIN_META[key].label} · 내가 표현하는 방식`}
                      mine={self[key].expressed}
                      partner={self[key].wanted}
                    />
                    <PairRow
                      title={`${DOMAIN_META[key].label} · 내가 원하는 방식`}
                      mine={self[key].wanted}
                      partner={self[key].expressed}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 행동 가이드 */}
          <TabsContent value="action" className="space-y-6">
            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">관계를 바꾸는 맞춤 액션</CardTitle>
                <CardDescription>점수를 읽고 끝내지 않고, 행동으로 연결되도록 구성했습니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {actions.map((item, index) => (
                  <ActionCard key={item.title} item={item} index={index} />
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">상담 연결 가이드</CardTitle>
                <CardDescription>더 깊은 이해를 위한 방향을 제안합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <InsightBox
                  title="먼저 다룰 부분"
                  content="가장 큰 갭이 있는 영역부터 다루면 변화 체감이 빠릅니다. 애정 갭은 서운함, 통제 갭은 답답함, 포함 갭은 거리감으로 나타나기 쉽습니다."
                  icon={<AlertTriangle className="h-4 w-4" />}
                />
                <InsightBox
                  title="강점으로 활용할 부분"
                  content="높은 점수 자체보다 일관성이 강점입니다. 표현과 기대가 비슷한 영역은 이 관계의 안정축으로 사용할 수 있습니다."
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                <InsightBox
                  title="다음 단계"
                  content="심화 해석, 2주 실천 플랜, 자기 점검 체크리스트로 연결하면 실제 관계 습관을 돌아보고 다듬어 볼 수 있습니다."
                  icon={<MessageCircle className="h-4 w-4" />}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Footer actions ── */}
        <div className="flex flex-wrap gap-3 pb-4">
          <Button className="rounded-2xl h-11 px-5 text-sm" onClick={onRetake}>
            다시 검사하기
          </Button>
          <Button variant="outline" className="rounded-2xl h-11 px-5 text-sm"
            onClick={() => window.print()}>
            PDF로 저장
          </Button>
        </div>

      </section>
    </div>
  )
}
