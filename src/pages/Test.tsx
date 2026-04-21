import { useState } from 'react';
import type { Answers } from '../types';
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES, RESPONSE_LABELS } from '../data/questions';

interface Props {
  onComplete: (answers: Answers) => void;
}

const SCALE_ICONS: Record<string, string> = {
  eI: '🤝', wI: '🤝', eC: '⚡', wC: '⚡', eA: '❤️', wA: '❤️',
};

export default function Test({ onComplete }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE,
  );

  const isPageComplete = pageQuestions.every(q => answers[q.id] !== undefined);
  const progress = ((currentPage * QUESTIONS_PER_PAGE + pageQuestions.filter(q => answers[q.id] !== undefined).length) / (TOTAL_PAGES * QUESTIONS_PER_PAGE)) * 100;

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
    <div className="test-page">
      <div className="test-header">
        <div className="test-progress-bar">
          <div className="test-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="test-page-info">
          <span className="test-page-label">{currentPage + 1} / {TOTAL_PAGES}</span>
          <span className="test-progress-pct">{Math.round(progress)}% 완료</span>
        </div>
      </div>

      <div className="test-body">
        <div className="test-scale-hint">
          <span>1점 = 전혀 아니다</span>
          <span>6점 = 항상 그렇다</span>
        </div>

        {pageQuestions.map((q, idx) => (
          <div key={q.id} className={`question-card ${answers[q.id] ? 'answered' : ''}`}>
            <div className="question-top">
              <span className="question-num">Q{currentPage * QUESTIONS_PER_PAGE + idx + 1}</span>
              <span className="question-scale-icon">{SCALE_ICONS[q.scale]}</span>
            </div>
            <p className="question-text">{q.text}</p>
            <div className="options-row">
              {[1, 2, 3, 4, 5, 6].map(val => (
                <button
                  key={val}
                  className={`option-btn ${answers[q.id] === val ? 'selected' : ''}`}
                  onClick={() => handleAnswer(q.id, val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="options-labels">
              <span>{RESPONSE_LABELS[0].replace('\n', ' ')}</span>
              <span>{RESPONSE_LABELS[5].replace('\n', ' ')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="test-nav">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <button
          className={`nav-btn next-btn ${!isPageComplete ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!isPageComplete}
        >
          {currentPage === TOTAL_PAGES - 1 ? '결과 보기' : '다음'}
        </button>
      </div>
    </div>
  );
}
