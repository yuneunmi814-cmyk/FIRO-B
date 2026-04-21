import { useState } from 'react';
import type { Answers } from '../types';
import { questions, RESPONSE_LABELS } from '../data/questions';

interface Props {
  onComplete: (answers: Answers) => void;
}

const SCALE_LABEL: Record<string, string> = {
  eI: 'Part I · Inclusion (Expressed)',
  wI: 'Part II · Inclusion (Wanted)',
  eC: 'Part III · Control (Expressed)',
  wC: 'Part IV · Control (Wanted)',
  eA: 'Part V · Affection (Expressed)',
  wA: 'Part VI · Affection (Wanted)',
};

export default function Test({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total    = questions.length;
  const current  = questions[index];
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / total) * 100);
  const selected = answers[current.id];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (selected === undefined) return;
    if (index < total - 1) {
      setIndex(i => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(i => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Background decorative gradient */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-bl from-secondary/5 to-transparent -z-20 pointer-events-none" />

      <main className="min-h-screen pt-12 pb-12 flex flex-col items-center px-6">
        {/* Progress Section */}
        <div className="w-full max-w-2xl mb-16">
          <div className="flex justify-between items-end mb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Progress</span>
              <h2 className="text-3xl font-extrabold tracking-tighter font-headline text-primary">{progress}% 완료</h2>
            </div>
            <span className="text-sm font-medium text-on-surface-variant italic">{index + 1} / {total} 문항</span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Canvas */}
        <div className="flex-grow w-full max-w-4xl flex flex-col justify-center">
          <div className="relative">
            <div className="absolute -top-20 -left-10 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl -z-10" />

            <section className="space-y-12">
              <div className="space-y-4">
                <span className="inline-block py-1 px-3 bg-secondary/10 text-secondary text-[11px] font-bold uppercase tracking-[0.2em] rounded-full">
                  {SCALE_LABEL[current.scale] ?? 'FIRO-B'}
                </span>
                <p className="text-3xl md:text-5xl font-extrabold font-headline leading-[1.15] tracking-tight text-primary max-w-3xl">
                  {current.text}
                </p>
              </div>

              {/* Likert scale */}
              <div className="w-full">
                <div className="flex justify-between mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline">
                    {RESPONSE_LABELS[0].replace(/\n/g, ' ')}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline">
                    {RESPONSE_LABELS[5].replace(/\n/g, ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2 md:gap-4">
                  {[1, 2, 3, 4, 5, 6].map(val => {
                    const isSelected = selected === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleAnswer(val)}
                        className={`h-20 md:h-24 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 cursor-pointer
                          ${isSelected
                            ? 'bg-secondary-container/20 border-secondary'
                            : 'bg-surface-container-low border-transparent hover:border-secondary/40'
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 mb-2 transition-colors
                          ${isSelected
                            ? 'bg-secondary border-secondary'
                            : 'border-outline'
                          }`}
                        />
                        <span className={`text-[11px] font-bold uppercase tracking-tighter font-headline
                          ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`}
                        >
                          {val}
                        </span>
                        <span className={`text-[10px] font-medium mt-0.5 font-body
                          ${isSelected ? 'text-secondary' : 'text-on-surface-variant/60'}`}
                        >
                          {RESPONSE_LABELS[val - 1].split('\n')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Navigation */}
        <footer className="w-full max-w-2xl mt-16 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="flex items-center gap-2 py-4 px-8 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors duration-300 font-medium font-headline disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>이전</span>
          </button>
          <button
            onClick={handleNext}
            disabled={selected === undefined}
            className="group flex items-center gap-2 py-4 px-10 rounded-xl bg-primary text-white hover:bg-primary-container transition-all duration-300 shadow-editorial-lg font-bold font-headline disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{index === total - 1 ? '결과 확인' : '다음 문항'}</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </footer>

        {/* Side editorial note (desktop only) */}
        <div className="hidden lg:block fixed bottom-12 right-12 max-w-[220px] text-right pointer-events-none opacity-40">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-2 font-headline">Insight</p>
          <p className="text-xs italic leading-relaxed text-on-surface-variant font-body">
            FIRO-B 검사는 대인관계에서 당신의 욕구가 행동으로 어떻게 표현되는지 측정합니다.
          </p>
        </div>
      </main>
    </div>
  );
}
