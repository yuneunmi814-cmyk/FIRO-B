import { useEffect } from 'react'
import {
  ProfileContent,
  PatternContent,
  SampleContent,
  type StepVariant,
} from '../components/StepDetailModal'

interface Props {
  variant: StepVariant
  onBack: () => void
  onStart: () => void
}

const TITLES: Record<StepVariant, { label: string; step: string }> = {
  profile: { label: '심리 프로파일',     step: 'Step 01 of 03' },
  pattern: { label: '패턴 심층 분석',    step: 'Step 02 of 03' },
  sample:  { label: '종합 리포트 예시',  step: 'Step 03 of 03' },
}

export default function StepDetail({ variant, onBack, onStart }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [variant])

  const title = TITLES[variant]

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Sticky top nav bar */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer font-medium font-headline text-sm"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>돌아가기</span>
          </button>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant font-headline">{title.step}</span>
            <span className="text-sm font-semibold text-primary font-headline">{title.label}</span>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 font-bold font-headline text-sm shadow-editorial hover:bg-primary-container transition-colors cursor-pointer"
          >
            <span>검사 시작</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Content card */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <article className="bg-surface-container-lowest rounded-[2rem] shadow-editorial overflow-hidden">
          {variant === 'profile' && <ProfileContent />}
          {variant === 'pattern' && <PatternContent />}
          {variant === 'sample'  && <SampleContent  />}
        </article>

        {/* Bottom CTA band */}
        <section className="mt-8 md:mt-12 rounded-[2rem] firo-gradient text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-2 font-headline">Ready?</p>
            <h3 className="text-2xl md:text-3xl font-bold font-headline leading-tight mb-2">설명을 다 읽으셨다면</h3>
            <p className="text-primary-fixed-dim text-sm md:text-base">5~10분이면 당신만의 FIRO-B 프로파일을 받아볼 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-3 relative z-10">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white rounded-xl px-5 py-3 font-medium font-headline text-sm hover:bg-white/15 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              <span>메인으로</span>
            </button>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 bg-secondary text-white rounded-xl px-6 py-3 font-bold font-headline text-sm shadow-editorial-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>검사 시작하기</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-secondary/20 rounded-full blur-[80px]" />
        </section>
      </main>
    </div>
  )
}
