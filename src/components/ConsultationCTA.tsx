import { useState } from 'react'
import { CalendarDays, ChevronRight, Loader2 } from 'lucide-react'
import { startCheckout, generateOrderId, PRODUCTS, ACTIVE_PROVIDER } from '@/lib/payment'

interface Props {
  userName?: string
}

const product = PRODUCTS.consultation_deposit
const priceLabel = ACTIVE_PROVIDER === 'mock'
  ? '체험 모드 · 무료 예약'
  : `예약금 ${product.amount.toLocaleString()}원`

export default function ConsultationCTA({ userName }: Props) {
  const [loading, setLoading] = useState(false)

  const handleBook = async () => {
    if (loading) return
    setLoading(true)
    try {
      // TODO: once a booking system (Calendly / KakaoTalk channel) is connected,
      // call startCheckout for the deposit, then redirect to the scheduler on success.
      const result = await startCheckout({
        product:      'consultation_deposit',
        orderId:      generateOrderId('consult'),
        customerName: userName,
      })
      if (result.success) {
        alert('상담 예약금이 접수됐습니다. 담당자가 곧 연락드립니다!')
      } else if (result.error && result.error !== 'redirecting') {
        alert(`결제를 시작할 수 없습니다: ${result.error}`)
      }
    } catch (err) {
      console.error('[ConsultationCTA] Checkout error:', err)
      alert('결제 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="consult-card">
      <div className="consult-inner">
        <div className="consult-text">
          <div className="consult-icon-wrap">
            <CalendarDays size={22} />
          </div>
          <div>
            <h3 className="consult-title">전문가와 함께 더 깊이 이해하고 싶으신가요?</h3>
            <p className="consult-desc">
              FIRO-B 전문 해석사와 1:1 상담으로, 리포트에서 놓친 맥락과
              실제 관계에서 어떻게 적용할지 구체적인 가이드를 받아보세요.
            </p>
            <ul className="consult-bullets">
              <li>50분 개인 맞춤 해석 세션</li>
              <li>관계 패턴 심층 코칭</li>
              <li>커플 세션 옵션 제공</li>
            </ul>
          </div>
        </div>
        <button className="consult-btn" onClick={handleBook} disabled={loading}>
          {loading
            ? <><Loader2 size={15} className="paywall-btn-spin" /> 처리 중…</>
            : <>전문가 해석 상담 예약 · {priceLabel} <ChevronRight size={16} /></>
          }
        </button>
      </div>
    </div>
  )
}
