import { useState } from 'react';
import type { FIROBScores } from '../types';
import { postToFormspree } from '../utils/formspree';
import { getDimTotals, getGrandTotalLabel, getScoreLevel } from '../utils/analysis';
import { SCALE_LABELS } from '../data/questions';

interface Props {
  scores: FIROBScores;
  userName: string;
  inclusionType: string;
  controlType: string;
  affectionType: string;
  conflictStyle: string;
}

export default function EmailResultsForm({ scores, userName, inclusionType, controlType, affectionType, conflictStyle }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const totals = getDimTotals(scores);
    const scoreLines = (Object.keys(SCALE_LABELS) as (keyof FIROBScores)[])
      .map(k => `${k}: ${scores[k].toFixed(1)} (${getScoreLevel(scores[k]).ko})`)
      .join(' | ');

    const ok = await postToFormspree({
      _subject: `[FIRO-B] 결과 이메일 요청 — ${userName || '익명'}`,
      _replyto: email,
      유형: '결과_이메일_요청',
      이름: userName || '익명',
      이메일: email,
      검사_점수: scoreLines,
      소속_총합: `${totals.inclusion.toFixed(1)} / 18`,
      통제_총합: `${totals.control.toFixed(1)} / 18`,
      정서_총합: `${totals.affection.toFixed(1)} / 18`,
      욕구_총합: `${totals.grand.toFixed(1)} (${getGrandTotalLabel(totals.grand)})`,
      소속_유형: inclusionType,
      통제_유형: controlType,
      정서_유형: affectionType,
      갈등_해결_방식: conflictStyle,
    });

    setStatus(ok ? 'success' : 'error');
  };

  return (
    <div className="fs-card">
      <div className="fs-card-header">
        <span className="fs-icon">📧</span>
        <div>
          <h3 className="fs-title">결과를 이메일로 받으세요</h3>
          <p className="fs-sub">관계 욕구 자가진단 결과 요약을 이메일로 보내드립니다</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="fs-success">✅ &nbsp;전송 완료! 곧 이메일로 결과가 전달됩니다.</div>
      ) : (
        <form onSubmit={handleSubmit} className="fs-form">
          <input
            type="email"
            className="fs-input"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="fs-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '전송 중…' : '결과 받기'}
          </button>
          {status === 'error' && <p className="fs-error">전송에 실패했습니다. 다시 시도해 주세요.</p>}
        </form>
      )}
    </div>
  );
}
