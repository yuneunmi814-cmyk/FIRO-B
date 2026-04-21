import { Loader2 } from 'lucide-react'
import type { FIROBScores } from '@/types'
import type { DimensionResult, ConflictStyleResult } from '@/types'
import { PRODUCTS, ACTIVE_PROVIDER } from '@/lib/payment'

interface Props {
  scores: FIROBScores
  inclusion: DimensionResult
  conflict: ConflictStyleResult
  unlocking?: boolean
  onUnlock: () => void
}

function buildTeasers(
  scores: FIROBScores,
  inclusion: DimensionResult,
  conflict: ConflictStyleResult,
): string[] {
  const bullets: string[] = []
  const affGap = Math.abs(scores.eA - scores.wA)
  const ctlGap = Math.abs(scores.eC - scores.wC)
  const incGap = Math.abs(scores.eI - scores.wI)

  if (affGap >= 3)
    bullets.push(`애정 표현과 기대 사이에 ${affGap.toFixed(0)}점 차이가 있어, 상대에게 오해받기 쉬운 패턴이 있습니다`)
  else if (affGap >= 2)
    bullets.push(`속으로는 더 많은 애정을 원하지만 표현은 신중한 편 — 이 간극이 관계에서 거리감을 만들 수 있습니다`)

  if (ctlGap >= 3)
    bullets.push(`통제 방식에서 겉으로 드러나는 행동과 실제 원하는 것이 달라, 같은 상황이 반복되는 경향이 있습니다`)
  else if (ctlGap >= 2)
    bullets.push(`리드하는 방식과 원하는 방식 사이의 차이가 파트너에게 혼란을 줄 수 있습니다`)

  if (incGap >= 3)
    bullets.push(`함께 있고 싶은 욕구와 실제 행동 사이 간극 — 상대가 당신의 진짜 니즈를 파악하지 못할 수 있습니다`)

  if (bullets.length < 2)
    bullets.push(`${inclusion.type} 성향으로, 관계에서 반복되는 특정 패턴과 갈등 지점이 데이터에서 확인됩니다`)

  if (bullets.length < 2)
    bullets.push(`${conflict.style} 갈등 해결 방식이 파트너와의 관계에서 어떻게 작동하는지 상세 분석이 준비됐습니다`)

  return bullets.slice(0, 2)
}

const LOCKED_FEATURES = [
  { icon: '🔍', text: '갈등 패턴 상세 분석 & 반복되는 이유' },
  { icon: '💑', text: '이상적인 파트너 프로필 & 주의 유형' },
  { icon: '💬', text: '관계를 바꾸는 대화 스크립트' },
  { icon: '🗺️', text: '4단계 행동 가이드 & 실천 플랜' },
  { icon: '📄', text: '전체 리포트 PDF 다운로드 (A4 멀티페이지)' },
]

const product = PRODUCTS.individual_report
const priceLabel = ACTIVE_PROVIDER === 'mock'
  ? `${product.amount.toLocaleString()}원 · 1회 결제 · 평생 열람 (개발 모드)`
  : `${product.amount.toLocaleString()}원 · 1회 결제 · 평생 열람`

export default function PaywallCTA({ scores, inclusion, conflict, unlocking, onUnlock }: Props) {
  const teasers = buildTeasers(scores, inclusion, conflict)

  return (
    <div className="relative bg-surface-container-lowest rounded-[2rem] border border-outline-variant/15 shadow-editorial-lg overflow-hidden font-body">
      {/* decorative */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-secondary/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative px-6 md:px-10 py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary mb-4">
            <span className="material-symbols-outlined filled text-2xl">auto_awesome</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline block mb-2">Insight Unlocked</span>
          <h3 className="text-2xl md:text-3xl font-extrabold font-headline text-primary tracking-tight leading-tight mb-3">
            당신의 관계에서 반복되는<br />패턴을 발견했습니다
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-lg mx-auto">
            FIRO-B 분석이 완료됐습니다. 아래 인사이트는 전체 리포트의 일부입니다.
          </p>
        </div>

        {/* Personalized teasers */}
        <div className="bg-surface-container-low rounded-2xl p-5 md:p-6 mb-8 border border-secondary/15 max-w-xl mx-auto">
          {teasers.map((t, i) => (
            <div key={i} className={`flex items-start gap-3 ${i > 0 ? 'mt-3' : ''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
              <p className="text-sm text-on-surface leading-relaxed">{t}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 max-w-xl mx-auto mb-5">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant font-headline">전체 리포트 포함 항목</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Locked feature list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-xl mx-auto mb-8">
          {LOCKED_FEATURES.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white border border-outline-variant/15 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-[15px] text-on-surface-variant shrink-0">lock</span>
              <span className="text-base shrink-0">{icon}</span>
              <span className="text-[13px] text-on-surface font-medium leading-snug">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onUnlock}
            disabled={unlocking}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container transition-colors text-white rounded-xl px-10 py-4 font-bold font-headline shadow-editorial-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-base md:text-lg"
          >
            {unlocking ? (
              <><Loader2 size={18} className="animate-spin" /> 결제 준비 중…</>
            ) : (
              <>
                <span>지금 결과 확인하기</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
          <p className="text-xs text-on-surface-variant font-medium">{priceLabel}</p>
        </div>
      </div>
    </div>
  )
}
