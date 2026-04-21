import { useState } from 'react';
import { postToFormspree } from '../utils/formspree';

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const ok = await postToFormspree({
      _subject: `[FIRO-B] 피드백 / 문의 — ${form.name || '익명'}`,
      _replyto: form.email,
      유형: '피드백_문의',
      이름: form.name || '익명',
      이메일: form.email,
      메시지: form.message,
    });

    setStatus(ok ? 'success' : 'error');
    if (ok) setForm({ name: '', email: '', message: '' });
  };

  const inputCls =
    'w-full bg-white border border-outline-variant/25 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all';

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/15 shadow-editorial p-7 md:p-8 font-body">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">chat_bubble</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Feedback</span>
          <h3 className="text-xl md:text-2xl font-extrabold font-headline text-primary tracking-tight">문의 · 피드백</h3>
          <p className="text-sm text-on-surface-variant mt-1">검사에 대한 의견이나 문의사항을 남겨주세요.</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 text-green-900 px-5 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined filled text-green-600">check_circle</span>
          <p className="text-sm font-medium">소중한 의견 감사합니다! 빠르게 답변드리겠습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name"  type="text"  placeholder="이름 (선택)" value={form.name}  onChange={change} className={inputCls} />
            <input name="email" type="email" placeholder="이메일"       value={form.email} onChange={change} required className={inputCls} />
          </div>
          <textarea
            name="message" rows={4}
            placeholder="문의 내용이나 피드백을 입력해 주세요"
            value={form.message} onChange={change} required
            className={`${inputCls} resize-none`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container transition-colors text-white rounded-xl px-7 py-3 font-bold font-headline text-sm shadow-editorial-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{status === 'loading' ? '전송 중…' : '보내기'}</span>
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
