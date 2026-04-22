import { useEffect, useState } from 'react';

const SITE_URL  = 'https://projectyoon.com/';
const OG_IMAGE  = 'https://projectyoon.com/og-image.png';
const KAKAO_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string | undefined;

interface Props {
  userName?: string;
  headline?: string;
}

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share?: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export default function ShareReportSection({ userName, headline }: Props) {
  const [copied, setCopied]         = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    if (!KAKAO_KEY || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      try { window.Kakao.init(KAKAO_KEY); } catch { /* already initialized */ }
    }
    setKakaoReady(true);
  }, []);

  const title = headline ?? '관계 욕구 자가진단';
  const desc  = userName
    ? `${userName}님의 관계 욕구와 갈등 스타일 — 5분 자가진단으로 돌아보세요!`
    : '나의 관계 욕구와 갈등 스타일을 돌아보는 자가진단. 5분이면 결과 확인 가능!';

  const shareText = `${title}\n${desc}\n${SITE_URL}`;

  const handleKakao = () => {
    if (!window.Kakao?.Share) {
      alert('카카오 공유가 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description: desc,
        imageUrl:    OG_IMAGE,
        link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
      },
      buttons: [
        { title: '나도 검사하기', link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL } },
      ],
    });
  };

  const handleTwitter = () => {
    const url =
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n${desc}`)}` +
      `&url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNative = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: desc, url: SITE_URL });
    } catch { /* cancelled */ }
  };
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section className="rpt-share-section no-capture">
      <div className="rpt-share-head">
        <span className="rpt-share-emoji">📣</span>
        <div>
          <h3 className="rpt-share-title">널리 알려주세요</h3>
          <p className="rpt-share-sub">
            나의 결과가 인상 깊었다면, 주변 친구·파트너에게도 공유해보세요.
          </p>
        </div>
      </div>

      <div className="rpt-share-buttons">
        {kakaoReady && (
          <button className="rpt-share-btn rpt-share-btn--kakao" onClick={handleKakao}>
            <span>💛</span> 카카오톡으로 공유
          </button>
        )}
        <button className="rpt-share-btn rpt-share-btn--x" onClick={handleTwitter}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X (트위터)
        </button>
        <button className="rpt-share-btn rpt-share-btn--fb" onClick={handleFacebook}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          페이스북
        </button>
        {hasNativeShare && (
          <button className="rpt-share-btn rpt-share-btn--native" onClick={handleNative}>
            <span>📱</span> 더보기
          </button>
        )}
        <button className="rpt-share-btn rpt-share-btn--copy" onClick={handleCopy}>
          {copied ? <><span>✅</span> 복사 완료!</> : <><span>🔗</span> 링크 복사</>}
        </button>
      </div>
    </section>
  );
}
