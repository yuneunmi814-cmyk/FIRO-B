import { Loader2 } from 'lucide-react'

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
    <div className="relative rounded-[2rem] overflow-hidden font-body">
      <div className="blur-[6px] opacity-60 pointer-events-none select-none" aria-hidden>
        {children}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/85 to-surface pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
        <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center border border-secondary/30 shadow-editorial">
          <span className="material-symbols-outlined text-2xl text-secondary">lock</span>
        </div>
        <p className="text-lg md:text-xl font-extrabold font-headline text-primary tracking-tight max-w-md">{label}</p>
        {hint && <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">{hint}</p>}
        <button
          onClick={onUnlock}
          disabled={unlocking}
          className="mt-1 inline-flex items-center gap-2 bg-primary hover:bg-primary-container transition-colors text-white rounded-xl px-6 py-3 font-bold font-headline text-sm shadow-editorial-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {unlocking ? (
            <><Loader2 size={14} className="animate-spin" /> 결제 준비 중…</>
          ) : (
            <>
              <span>전체 리포트 보기</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
