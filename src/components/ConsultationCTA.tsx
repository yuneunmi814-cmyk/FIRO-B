import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { startCheckout, generateOrderId, PRODUCTS } from '@/lib/payment'

interface Props {
  userName?: string
}

const product = PRODUCTS.consultation_deposit
const priceLabel = `예약금 ${product.amount.toLocaleString()}원`

export default function ConsultationCTA({ userName }: Props) {
  const [loading, setLoading] = useState(false)

  const handleBook = async () => {
    if (loading) return
    setLoading(true)
    try {
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
    <div className="relative rounded-[2rem] firo-gradient text-white p-8 md:p-9 overflow-hidden font-body">
      <div className="absolute -right-20 -bottom-20 w-56 h-56 bg-secondary/20 rounded-full blur-[70px]" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <span className="material-symbols-outlined filled text-white text-2xl">calendar_month</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim font-headline">1:1 Consultation</span>
        </div>
        <h3 className="text-2xl font-extrabold font-headline leading-tight mb-3">전문가와 함께<br />더 깊이 이해하기</h3>
        <p className="text-[14px] leading-relaxed text-primary-fixed-dim mb-5">
          FIRO-B 전문 해석사와 1:1 상담으로 리포트에서 놓친 맥락과 실제
          관계에서 어떻게 적용할지 구체적인 가이드를 받아보세요.
        </p>
        <ul className="space-y-2 mb-7 text-sm">
          {[
            '50분 개인 맞춤 해석 세션',
            '관계 패턴 심층 코칭',
            '커플 세션 옵션 제공',
          ].map(t => (
            <li key={t} className="flex gap-2 items-center">
              <span className="material-symbols-outlined filled text-secondary-container text-lg shrink-0">check_circle</span>
              <span className="text-primary-fixed-dim">{t}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-white rounded-xl px-6 py-3.5 font-bold font-headline text-sm shadow-editorial-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin" /> 처리 중…</>
          ) : (
            <>
              <span>전문가 해석 상담 예약 · {priceLabel}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
