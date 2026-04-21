import { useState } from 'react';
import emailjs from '@emailjs/browser';
import type { FIROBScores } from '../types';
import { getDimTotals, getGrandTotalLabel, getScoreLevel } from '../utils/analysis';
import { SCALE_LABELS } from '../data/questions';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

interface Props {
  scores: FIROBScores;
  userName: string;
  testDate: string;
  inclusionType: string;
  controlType: string;
  affectionType: string;
  conflictStyle: string;
}

function buildScoreRows(scores: FIROBScores): string {
  return (Object.keys(SCALE_LABELS) as (keyof FIROBScores)[])
    .map(k => `${SCALE_LABELS[k]}(${k}): ${scores[k].toFixed(1)}점 — ${getScoreLevel(scores[k]).ko}`)
    .join('\n');
}

export default function EmailResultsForm({
  scores, userName, testDate,
  inclusionType, controlType, affectionType, conflictStyle,
}: Props) {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const totals = getDimTotals(scores);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const templateParams = {
      to_email:     email,
      to_name:      userName || '익명',
      test_date:    testDate,
      score_rows:   buildScoreRows(scores),
      inclusion_total: `${totals.inclusion.toFixed(1)} / 18`,
      control_total:   `${totals.control.toFixed(1)} / 18`,
      affection_total: `${totals.affection.toFixed(1)} / 18`,
      grand_total:     `${totals.grand.toFixed(1)} (${getGrandTotalLabel(totals.grand)})`,
      expressed_total: totals.expressed.toFixed(1),
      wanted_total:    totals.wanted.toFixed(1),
      inclusion_type:  inclusionType,
      control_type:    controlType,
      affection_type:  affectionType,
      conflict_style:  conflictStyle,
      site_url:        'https://firob.vercel.app/',
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fs-card">
      <div className="fs-card-header">
        <span className="fs-icon">📧</span>
        <div>
          <h3 className="fs-title">결과를 이메일로 받으세요</h3>
          <p className="fs-sub">FIRO-B 결과 리포트 요약을 이메일로 보내드립니다</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="fs-success">✅ &nbsp;전송 완료! 입력하신 이메일로 결과가 발송되었습니다.</div>
      ) : (
        <form onSubmit={handleSubmit} className="fs-form">
          <input
            type="email"
            className="fs-input"
            placeholder="결과를 받을 이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="fs-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '전송 중…' : '결과 받기'}
          </button>
          {status === 'error' && (
            <p className="fs-error">전송에 실패했습니다. EmailJS 설정을 확인하거나 다시 시도해 주세요.</p>
          )}
        </form>
      )}
    </div>
  );
}
