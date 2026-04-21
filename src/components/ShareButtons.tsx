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

  const chipBase =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold font-headline text-sm transition-all cursor-pointer';

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/15 shadow-editorial p-7 md:p-8 font-body">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">share</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Share</span>
          <h3 className="text-xl md:text-2xl font-extrabold font-headline text-primary tracking-tight">결과 공유하기</h3>
          <p className="text-sm text-on-surface-variant mt-1">친구에게 나의 FIRO-B 결과를 공유해보세요.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {kakaoReady && (
          <button
            onClick={handleKakao}
            className={`${chipBase} bg-[#FEE500] text-[#391B1B] hover:brightness-95`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3C6.48 3 2 6.672 2 11.16c0 2.913 1.86 5.48 4.68 6.96-.18.66-.66 2.4-.75 2.76-.12.45.165.444.348.324.144-.096 2.28-1.536 3.204-2.16.492.072.996.108 1.518.108 5.52 0 10-3.672 10-8.16S17.52 3 12 3z"/>
            </svg>
            카카오톡
          </button>
        )}
        <button
          onClick={handleTwitter}
          className={`${chipBase} bg-black text-white hover:bg-zinc-800`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X (트위터)
        </button>
        <button
          onClick={handleFacebook}
          className={`${chipBase} bg-[#1877F2] text-white hover:brightness-110`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          페이스북
        </button>
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className={`${chipBase} bg-surface-container-low text-primary border border-outline-variant/20 hover:bg-surface-container-high`}
          >
            <span className="material-symbols-outlined text-base">ios_share</span>
            더보기
          </button>
        )}
        <button
          onClick={handleCopy}
          className={`${chipBase} bg-primary text-white hover:bg-primary-container`}
        >
          <span className="material-symbols-outlined text-base">{copied ? 'check' : 'content_copy'}</span>
          {copied ? '복사됨!' : '링크 복사'}
        </button>
      </div>
    </div>
  );
}
