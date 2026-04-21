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

  return (
    <div className="fs-card">
      <div className="fs-card-header">
        <span className="fs-icon">🤝</span>
        <div>
          <h3 className="fs-title">제휴 문의</h3>
          <p className="fs-sub">광고·콘텐츠·교육 기관 등 다양한 제휴를 환영합니다</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="fs-success">✅ &nbsp;문의가 접수되었습니다! 영업일 기준 2일 내 답변드리겠습니다.</div>
      ) : (
        <form onSubmit={handleSubmit} className="fs-form">
          <div className="fs-row">
            <input
              type="text" name="company" className="fs-input"
              placeholder="회사 / 단체명" value={form.company}
              onChange={change} required
            />
            <input
              type="text" name="name" className="fs-input"
              placeholder="담당자 이름" value={form.name}
              onChange={change} required
            />
          </div>
          <div className="fs-row">
            <input
              type="email" name="email" className="fs-input"
              placeholder="이메일" value={form.email}
              onChange={change} required
            />
            <select name="type" className="fs-input" value={form.type} onChange={change} required>
              <option value="">제휴 유형 선택</option>
              <option value="광고">광고 제휴</option>
              <option value="콘텐츠">콘텐츠 제휴</option>
              <option value="교육기관">교육 기관 협력</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <textarea
            name="message" className="fs-textarea"
            placeholder="제휴 목적 및 내용을 간략히 설명해 주세요"
            rows={5} value={form.message}
            onChange={change} required
          />
          <button type="submit" className="fs-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '전송 중…' : '문의 보내기'}
          </button>
          {status === 'error' && <p className="fs-error">전송에 실패했습니다. 다시 시도해 주세요.</p>}
        </form>
      )}
    </div>
  );
}
