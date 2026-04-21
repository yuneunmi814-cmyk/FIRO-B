import { Heart, ChevronRight } from 'lucide-react'

interface Props {
  onAddCouple?: () => void
}

export default function CoupleUpsell({ onAddCouple }: Props) {
  const handleClick = () => {
    if (onAddCouple) {
      onAddCouple()
    } else {
      // TODO: route to couple comparison flow or open partner-score input modal
      alert('커플 분석 기능은 곧 출시됩니다! 파트너도 검사를 완료하면 자동으로 비교 분석됩니다.')
    }
  }

  return (
    <div className="upsell-card">
      <div className="upsell-icon-wrap">
        <Heart size={24} fill="currentColor" />
      </div>
      <div className="upsell-body">
        <h3 className="upsell-title">파트너와 함께라면 더 정확해집니다</h3>
        <p className="upsell-desc">
          파트너의 FIRO-B 결과를 추가하면 욕구 궁합, 갈등 지점,
          서로에게 필요한 대화 방식까지 자동으로 분석해 드립니다.
        </p>
        <ul className="upsell-bullets">
          <li>소속·통제·애정 욕구 3개 영역 비교</li>
          <li>서로의 기대 vs 표현 갭 시각화</li>
          <li>커플 맞춤 대화 스크립트 제공</li>
        </ul>
      </div>
      <button className="upsell-btn" onClick={handleClick}>
        커플 분석 추가하기
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
