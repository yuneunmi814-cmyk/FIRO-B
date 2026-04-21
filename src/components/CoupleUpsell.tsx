import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { startCheckout, generateOrderId, PRODUCTS } from '@/lib/payment'

interface Props {
  userName?: string
}

const product = PRODUCTS.couple_addon
const priceLabel = `${product.amount.toLocaleString()}원`

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
    <div className="relative rounded-[2rem] bg-gradient-to-br from-tertiary-fixed to-tertiary-fixed-dim p-8 md:p-9 overflow-hidden font-body text-on-tertiary-fixed-variant">
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-tertiary-container/20 rounded-full blur-[60px]" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined filled text-white text-2xl">favorite</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 font-headline">Couple Add-on</span>
        </div>
        <h3 className="text-2xl font-extrabold font-headline leading-tight mb-3">파트너와 함께라면<br />더 정확해집니다</h3>
        <p className="text-[14px] leading-relaxed mb-5 opacity-90">
          파트너의 FIRO-B 결과를 추가하면 욕구 궁합, 갈등 지점, 서로에게 필요한
          대화 방식까지 자동으로 분석해 드립니다.
        </p>
        <ul className="space-y-2 mb-7 text-sm">
          {[
            '소속·통제·애정 욕구 3개 영역 비교',
            '서로의 기대 vs 표현 갭 시각화',
            '커플 맞춤 대화 스크립트 제공',
          ].map(t => (
            <li key={t} className="flex gap-2 items-center">
              <span className="material-symbols-outlined filled text-tertiary-container text-lg shrink-0">check_circle</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-tertiary-container text-white rounded-xl px-6 py-3.5 font-bold font-headline text-sm shadow-editorial-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin" /> 처리 중…</>
          ) : (
            <>
              <span>커플 분석 추가하기 · {priceLabel}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
