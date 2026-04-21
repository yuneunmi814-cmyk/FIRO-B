import { useState } from 'react';

interface Props {
  onStart: (name: string) => void;
}

export default function Welcome({ onStart }: Props) {
  const [name, setName] = useState('');

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-badge">심리검사</div>
        <h1 className="welcome-title">FIRO-B</h1>
        <p className="welcome-subtitle">나에게 가장 잘 맞는 배우자를 찾고<br />갈등 해결 방식을 알아보세요</p>
      </div>

      <div className="welcome-content">
        <div className="dimension-cards">
          <div className="dimension-card inclusion">
            <span className="dim-icon">🤝</span>
            <h3>포용 (Inclusion)</h3>
            <p>사람들과 어울리고 싶은 욕구와 포함되고 싶은 욕구</p>
          </div>
          <div className="dimension-card control">
            <span className="dim-icon">⚡</span>
            <h3>통제 (Control)</h3>
            <p>상황을 주도하거나 안내받고 싶은 욕구</p>
          </div>
          <div className="dimension-card affection">
            <span className="dim-icon">❤️</span>
            <h3>애정 (Affection)</h3>
            <p>친밀감을 나누고 사랑받고 싶은 욕구</p>
          </div>
        </div>

        <div className="welcome-info">
          <div className="info-item">
            <span className="info-icon">📝</span>
            <span>총 54문항</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏱️</span>
            <span>약 5~10분 소요</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💌</span>
            <span>배우자 궁합 + 갈등 해결 리포트</span>
          </div>
        </div>

        <div className="name-input-section">
          <label htmlFor="name-input" className="name-label">이름 (선택)</label>
          <input
            id="name-input"
            type="text"
            className="name-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
          />
        </div>

        <button className="start-btn" onClick={() => onStart(name)}>
          검사 시작하기
        </button>

        <p className="welcome-note">
          각 문항은 1~6점으로 답변합니다.<br />
          솔직하게 답할수록 정확한 결과를 얻을 수 있어요.
        </p>
      </div>
    </div>
  );
}
