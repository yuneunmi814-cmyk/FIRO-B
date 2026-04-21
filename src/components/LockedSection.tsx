import { Lock, Loader2 } from 'lucide-react'

interface Props {
  children: React.ReactNode
  hasAccess: boolean
  onUnlock: () => void
  unlocking?: boolean
  label?: string
  hint?: string
}

export default function LockedSection({
  children,
  hasAccess,
  onUnlock,
  unlocking,
  label = '이 섹션은 잠겨 있습니다',
  hint,
}: Props) {
  if (hasAccess) return <>{children}</>

  return (
    <div className="locked-wrap">
      <div className="locked-blur" aria-hidden>{children}</div>
      <div className="locked-fade" />
      <div className="locked-overlay">
        <div className="locked-icon-ring">
          <Lock size={22} strokeWidth={2.5} />
        </div>
        <p className="locked-label">{label}</p>
        {hint && <p className="locked-hint">{hint}</p>}
        <button className="locked-btn" onClick={onUnlock} disabled={unlocking}>
          {unlocking
            ? <><Loader2 size={14} className="paywall-btn-spin" /> 결제 준비 중…</>
            : '전체 리포트 보기 →'
          }
        </button>
      </div>
    </div>
  )
}
