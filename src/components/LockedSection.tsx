import { Lock } from 'lucide-react'

interface Props {
  children: React.ReactNode
  hasAccess: boolean
  onUnlock: () => void
  label?: string      // section title shown in overlay
  hint?: string       // short hook text in overlay
}

export default function LockedSection({
  children,
  hasAccess,
  onUnlock,
  label = '이 섹션은 잠겨 있습니다',
  hint,
}: Props) {
  if (hasAccess) return <>{children}</>

  return (
    <div className="locked-wrap">
      <div className="locked-blur" aria-hidden>{children}</div>

      {/* top fade gradient */}
      <div className="locked-fade" />

      {/* overlay */}
      <div className="locked-overlay">
        <div className="locked-icon-ring">
          <Lock size={22} strokeWidth={2.5} />
        </div>
        <p className="locked-label">{label}</p>
        {hint && <p className="locked-hint">{hint}</p>}
        <button className="locked-btn" onClick={onUnlock}>
          전체 리포트 보기 →
        </button>
      </div>
    </div>
  )
}
