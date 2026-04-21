import { Lock, Sparkles, ChevronRight } from 'lucide-react'
import type { FIROBScores } from '@/types'
import type { DimensionResult, ConflictStyleResult } from '@/types'

interface Props {
  scores: FIROBScores
  inclusion: DimensionResult
  conflict: ConflictStyleResult
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
  { icon: '💑', text: '이상적인 파트너 프로필 & 궁합 예측' },
  { icon: '💬', text: '관계를 바꾸는 대화 스크립트' },
  { icon: '🗺️', text: '4단계 행동 가이드 & 실천 플랜' },
]

export default function PaywallCTA({ scores, inclusion, conflict, onUnlock }: Props) {
  const teasers = buildTeasers(scores, inclusion, conflict)

  return (
    <div className="paywall-card">
      {/* Header */}
      <div className="paywall-header">
        <div className="paywall-sparkle-wrap">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="paywall-headline">
            당신의 관계에서 반복되는 패턴을 발견했습니다
          </h3>
          <p className="paywall-subhead">
            FIRO-B 분석이 완료됐습니다. 아래 인사이트는 전체 리포트의 일부입니다.
          </p>
        </div>
      </div>

      {/* Personalized teasers */}
      <div className="paywall-teasers">
        {teasers.map((t, i) => (
          <div key={i} className="paywall-teaser-row">
            <span className="paywall-teaser-dot" />
            <p className="paywall-teaser-text">{t}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="paywall-divider">
        <span className="paywall-divider-text">전체 리포트에서 확인할 수 있는 내용</span>
      </div>

      {/* Locked feature list */}
      <div className="paywall-features">
        {LOCKED_FEATURES.map(({ icon, text }) => (
          <div key={text} className="paywall-feature-row">
            <Lock size={13} className="paywall-lock-icon" />
            <span className="paywall-feature-emoji">{icon}</span>
            <span className="paywall-feature-text">{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="paywall-cta-wrap">
        {/* TODO: replace onUnlock with real payment flow (Toss Payments or Stripe) */}
        <button className="paywall-btn" onClick={onUnlock}>
          전체 리포트 보기
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
        {/* TODO: set real price from environment / product config */}
        <p className="paywall-price-note">
          지금은 무료 체험 모드입니다 · 결제 연동 후 가격 표시 예정
        </p>
      </div>
    </div>
  )
}
