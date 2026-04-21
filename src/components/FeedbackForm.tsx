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

  return (
    <div className="fs-card">
      <div className="fs-card-header">
        <span className="fs-icon">💬</span>
        <div>
          <h3 className="fs-title">문의 / 피드백</h3>
          <p className="fs-sub">검사에 대한 의견이나 문의사항을 남겨주세요</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="fs-success">✅ &nbsp;소중한 의견 감사합니다! 빠르게 답변드리겠습니다.</div>
      ) : (
        <form onSubmit={handleSubmit} className="fs-form">
          <div className="fs-row">
            <input type="text"  name="name"  className="fs-input" placeholder="이름 (선택)" value={form.name}    onChange={change} />
            <input type="email" name="email" className="fs-input" placeholder="이메일"       value={form.email}   onChange={change} required />
          </div>
          <textarea
            name="message"
            className="fs-textarea"
            placeholder="문의 내용이나 피드백을 입력해 주세요"
            rows={4}
            value={form.message}
            onChange={change}
            required
          />
          <button type="submit" className="fs-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '전송 중…' : '보내기'}
          </button>
          {status === 'error' && <p className="fs-error">전송에 실패했습니다. 다시 시도해 주세요.</p>}
        </form>
      )}
    </div>
  );
}
