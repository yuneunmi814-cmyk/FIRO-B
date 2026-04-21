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
      site_url:        'https://projectyoon.com/',
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputCls =
    'flex-1 bg-white border border-outline-variant/25 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all';

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/15 shadow-editorial p-7 md:p-8 font-body">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">mail</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Email Report</span>
          <h3 className="text-xl md:text-2xl font-extrabold font-headline text-primary tracking-tight">결과를 이메일로 받기</h3>
          <p className="text-sm text-on-surface-variant mt-1">FIRO-B 결과 리포트 요약을 이메일로 보내드립니다.</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 text-green-900 px-5 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined filled text-green-600">check_circle</span>
          <p className="text-sm font-medium">전송 완료! 입력하신 이메일로 결과가 발송되었습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="결과를 받을 이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={inputCls}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container transition-colors text-white rounded-xl px-7 py-3 font-bold font-headline text-sm shadow-editorial-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            <span>{status === 'loading' ? '전송 중…' : '결과 받기'}</span>
            {status !== 'loading' && <span className="material-symbols-outlined text-base">send</span>}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          전송에 실패했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
