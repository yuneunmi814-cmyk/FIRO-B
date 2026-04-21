import { useState } from 'react';
import type { Answers } from '../types';
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES, RESPONSE_LABELS } from '../data/questions';

interface Props {
  onComplete: (answers: Answers) => void;
}

const SCALE_META: Record<string, { label: string; icon: string }> = {
  eI: { label: '소속 · 표출',   icon: 'groups' },
  wI: { label: '소속 · 기대',   icon: 'group_add' },
  eC: { label: '통제 · 표출',   icon: 'shield' },
  wC: { label: '통제 · 기대',   icon: 'gavel' },
  eA: { label: '정서 · 표출',   icon: 'favorite' },
  wA: { label: '정서 · 기대',   icon: 'volunteer_activism' },
};

export default function Test({ onComplete }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE,
  );

  const answeredCount = pageQuestions.filter(q => answers[q.id] !== undefined).length;
  const isPageComplete = answeredCount === pageQuestions.length;
  const globalAnswered = Object.keys(answers).length;
  const progress = Math.round((globalAnswered / questions.length) * 100);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!isPageComplete) return;
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Sticky progress */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-4">
          <div className="flex items-end justify-between mb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Progress</span>
              <p className="text-xl font-extrabold tracking-tight font-headline text-primary">
                {progress}% 완료
              </p>
            </div>
            <span className="text-sm font-medium text-on-surface-variant italic">
              {currentPage + 1} / {TOTAL_PAGES} 페이지 · {globalAnswered} / {questions.length} 문항
            </span>
          </div>
          <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Page intro */}
        <div className="mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 block font-headline">
            Set {String(currentPage + 1).padStart(2, '0')} of {String(TOTAL_PAGES).padStart(2, '0')}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-primary leading-[1.15] mb-3">
            각 문항을 1~6점으로<br />솔직하게 평가해 주세요
          </h1>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-outline" />1점 = 전혀 아니다
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />6점 = 항상 그렇다
            </span>
          </div>
        </div>

        {/* Question cards */}
        <div className="space-y-5">
          {pageQuestions.map((q, idx) => {
            const selected = answers[q.id];
            const isAnswered = selected !== undefined;
            const meta = SCALE_META[q.scale];
            const qNum = currentPage * QUESTIONS_PER_PAGE + idx + 1;
            return (
              <div
                key={q.id}
                className={`bg-surface-container-lowest rounded-[1.75rem] border p-6 md:p-7 transition-all duration-300
                  ${isAnswered ? 'border-secondary/30 shadow-editorial' : 'border-outline-variant/15 shadow-editorial'}
                `}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold font-headline">
                    Q{qNum}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-headline">
                    <span className="material-symbols-outlined text-base text-secondary">{meta.icon}</span>
                    <span>{meta.label}</span>
                  </div>
                  {isAnswered && (
                    <span className="ml-auto material-symbols-outlined filled text-secondary text-lg">check_circle</span>
                  )}
                </div>

                <p className="text-lg md:text-xl font-bold font-headline text-primary leading-[1.45] mb-6">
                  {q.text}
                </p>

                <div className="grid grid-cols-6 gap-2 md:gap-3">
                  {[1, 2, 3, 4, 5, 6].map(val => {
                    const active = selected === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleAnswer(q.id, val)}
                        className={`h-14 md:h-16 rounded-xl border-2 font-bold font-headline text-lg md:text-xl transition-all duration-200 cursor-pointer
                          ${active
                            ? 'bg-primary border-primary text-white shadow-editorial-lg scale-[1.02]'
                            : 'bg-surface-container-low border-transparent text-on-surface-variant hover:border-secondary/40 hover:text-primary'
                          }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-2 px-1">
                  <span>{RESPONSE_LABELS[0].replace(/\n/g, ' ')}</span>
                  <span>{RESPONSE_LABELS[5].replace(/\n/g, ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <footer className="mt-12 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="inline-flex items-center gap-2 py-4 px-7 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors font-medium font-headline disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>이전</span>
          </button>

          {/* Completion helper text */}
          {!isPageComplete && (
            <span className="hidden md:block text-xs text-on-surface-variant">
              {pageQuestions.length - answeredCount}개 문항이 남았습니다
            </span>
          )}

          <button
            onClick={handleNext}
            disabled={!isPageComplete}
            className="inline-flex items-center gap-2 py-4 px-9 rounded-xl bg-primary text-white hover:bg-primary-container transition-all font-bold font-headline shadow-editorial-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{currentPage === TOTAL_PAGES - 1 ? '결과 확인' : '다음 페이지'}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
