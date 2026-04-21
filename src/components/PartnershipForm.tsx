import { useState } from 'react';

const PARTNERSHIP_URL = 'https://formspree.io/f/mnjlbrej';

type FormState = {
  company: string;
  name: string;
  email: string;
  type: string;
  message: string;
};

export default function PartnershipForm() {
  const [form, setForm] = useState<FormState>({ company: '', name: '', email: '', type: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(PARTNERSHIP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[FIRO-B] 제휴 문의 — ${form.company || form.name}`,
          _replyto: form.email,
          유형: '제휴_문의',
          회사명: form.company,
          담당자: form.name,
          이메일: form.email,
          제휴유형: form.type,
          내용: form.message,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setForm({ company: '', name: '', email: '', type: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputCls =
    'w-full bg-white border border-outline-variant/25 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all';

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/15 shadow-editorial p-7 md:p-9 font-body">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">handshake</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Partnerships</span>
          <h3 className="text-xl md:text-2xl font-extrabold font-headline text-primary tracking-tight">제휴 문의</h3>
          <p className="text-sm text-on-surface-variant mt-1">광고·콘텐츠·교육 기관 등 다양한 제휴를 환영합니다.</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 text-green-900 px-5 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined filled text-green-600">check_circle</span>
          <p className="text-sm font-medium">문의가 접수되었습니다! 영업일 기준 2일 내 답변드리겠습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="company" type="text" placeholder="회사 / 단체명" value={form.company} onChange={change} required className={inputCls} />
            <input name="name" type="text" placeholder="담당자 이름" value={form.name} onChange={change} required className={inputCls} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="email" type="email" placeholder="이메일" value={form.email} onChange={change} required className={inputCls} />
            <select name="type" value={form.type} onChange={change} required className={inputCls}>
              <option value="">제휴 유형 선택</option>
              <option value="광고">광고 제휴</option>
              <option value="콘텐츠">콘텐츠 제휴</option>
              <option value="교육기관">교육 기관 협력</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <textarea
            name="message" placeholder="제휴 목적 및 내용을 간략히 설명해 주세요"
            rows={5} value={form.message} onChange={change} required
            className={`${inputCls} resize-none`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container transition-colors text-white rounded-xl px-8 py-3.5 font-bold font-headline text-sm shadow-editorial-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{status === 'loading' ? '전송 중…' : '문의 보내기'}</span>
            {status !== 'loading' && <span className="material-symbols-outlined text-base">send</span>}
          </button>
          {status === 'error' && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">전송에 실패했습니다. 다시 시도해 주세요.</p>
          )}
        </form>
      )}
    </div>
  );
}
