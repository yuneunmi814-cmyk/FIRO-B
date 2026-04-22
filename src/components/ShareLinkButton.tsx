import { useState } from 'react';

const SITE_URL = 'https://projectyoon.com/';
const SHARE_TEXT = '관계 욕구 자가진단 — 나의 대인관계 욕구와 갈등 스타일을 돌아보세요';

/**
 * Hero-level link share button.
 *  - Native share sheet if supported (iOS/Android)
 *  - Falls back to clipboard copy (with visual confirmation)
 */
export default function ShareLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const nav = typeof navigator !== 'undefined' ? navigator : null;

    // Try native share first (mobile sheet)
    if (nav?.share) {
      try {
        await nav.share({
          title: '관계 욕구 자가진단',
          text: SHARE_TEXT,
          url: SITE_URL,
        });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }

    // Fallback: clipboard copy
    const payload = `${SHARE_TEXT}\n${SITE_URL}`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = payload;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="download-btn no-capture"
      onClick={handleShare}
    >
      {copied ? (
        <><span>✅</span> 링크 복사 완료!</>
      ) : (
        <><span>🔗</span> 링크 공유</>
      )}
    </button>
  );
}
