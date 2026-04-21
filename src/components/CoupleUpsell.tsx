import { useState } from 'react'
import { Heart, ChevronRight, Loader2 } from 'lucide-react'
import { startCheckout, generateOrderId, PRODUCTS, ACTIVE_PROVIDER } from '@/lib/payment'

interface Props {
  userName?: string
}

const product  = PRODUCTS.couple_addon
const priceLabel = ACTIVE_PROVIDER === 'mock'
  ? '체험 모드 · 무료'
  : `${product.amount.toLocaleString()}원 추가`

export default function CoupleUpsell({ userName }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await startCheckout({
        product:      'couple_addon',
        orderId:      generateOrderId('couple'),
        customerName: userName,
      })
      if (result.success) {
        // TODO: set coupleAccess=true in App.tsx via a prop callback
        alert('커플 분석이 추가됐습니다! (연동 후 자동으로 활성화됩니다)')
      } else if (result.error && result.error !== 'redirecting') {
        alert(`결제를 시작할 수 없습니다: ${result.error}`)
      }
    } catch (err) {
      console.error('[CoupleUpsell] Checkout error:', err)
      alert('결제 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
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
      <button className="upsell-btn" onClick={handleClick} disabled={loading}>
        {loading
          ? <><Loader2 size={15} className="paywall-btn-spin" /> 처리 중…</>
          : <>커플 분석 추가하기 · {priceLabel} <ChevronRight size={16} /></>
        }
      </button>
    </div>
  )
}
