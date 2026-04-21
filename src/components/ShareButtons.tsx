import { useState, useEffect } from 'react';

const SITE_URL   = 'https://projectyoon.com/';
const KAKAO_KEY  = import.meta.env.VITE_KAKAO_APP_KEY as string | undefined;

interface Props {
  userName: string;
  inclusionType: string;
  controlType: string;
  affectionType: string;
  conflictStyle: string;
}

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export default function ShareButtons({ userName, inclusionType, controlType, affectionType, conflictStyle }: Props) {
  const [copied, setCopied]       = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    if (!KAKAO_KEY || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_KEY);
    setKakaoReady(true);
  }, []);

  const shareText =
    `${userName ? `${userName}님의 ` : '나의 '}FIRO-B 결과\n` +
    `소속: ${inclusionType} | 통제: ${controlType} | 정서: ${affectionType}\n` +
    `갈등 해결: ${conflictStyle}\n` +
    `나도 검사해보기 👉 ${SITE_URL}`;

  const handleKakao = () => {
    if (!window.Kakao?.Share) return;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${userName ? `${userName}님의 ` : '나의 '}FIRO-B 결과`,
        description:
          `소속: ${inclusionType} / 통제: ${controlType} / 정서: ${affectionType}\n갈등 해결: ${conflictStyle}`,
        imageUrl: 'https://projectyoon.com/og-image.png',
        link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
      },
      buttons: [{ title: '나도 검사하기', link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL } }],
    });
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    await navigator.share({ title: 'FIRO-B 결과', text: shareText, url: SITE_URL });
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="share-card">
      <div className="share-header">
        <span className="share-icon">🔗</span>
        <div>
          <h3 className="share-title">결과 공유하기</h3>
          <p className="share-sub">친구에게 나의 FIRO-B 결과를 공유해보세요</p>
        </div>
      </div>

      <div className="share-btn-row">
        {kakaoReady && (
          <button className="share-btn share-btn--kakao" onClick={handleKakao}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.672 2 11.16c0 2.913 1.86 5.48 4.68 6.96-.18.66-.66 2.4-.75 2.76-.12.45.165.444.348.324.144-.096 2.28-1.536 3.204-2.16.492.072.996.108 1.518.108 5.52 0 10-3.672 10-8.16S17.52 3 12 3z"/>
            </svg>
            카카오톡
          </button>
        )}

        <button className="share-btn share-btn--twitter" onClick={handleTwitter}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X (트위터)
        </button>

        <button className="share-btn share-btn--facebook" onClick={handleFacebook}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          페이스북
        </button>

        {hasNativeShare && (
          <button className="share-btn share-btn--native" onClick={handleNativeShare}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
            더보기
          </button>
        )}

        <button className="share-btn share-btn--copy" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              복사됨!
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              링크 복사
            </>
          )}
        </button>
      </div>
    </div>
  );
}
