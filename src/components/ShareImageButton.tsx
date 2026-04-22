import { useState } from 'react';
import html2canvas from 'html2canvas';

interface Props {
  userName?: string;
}

/**
 * Captures #report-capture as a PNG and either:
 *  - triggers native share sheet (mobile, if supported) with the image file
 *  - downloads as PNG (desktop fallback)
 */
export default function ShareImageButton({ userName }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleShare = async () => {
    const el = document.getElementById('report-capture');
    if (!el) {
      alert('리포트 영역을 찾을 수 없습니다.');
      return;
    }
    setStatus('loading');

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5F3FF',
        logging: false,
        ignoreElements: node => (node as HTMLElement).classList?.contains('no-capture'),
      });

      const stamp    = new Date().toISOString().slice(0, 10);
      const filename = userName
        ? `관계욕구진단_${userName}_${stamp}.png`
        : `관계욕구진단_결과리포트_${stamp}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setStatus('idle');
          return;
        }
        const file = new File([blob], filename, { type: 'image/png' });

        // Try native share (iOS/Android) with the image file attached
        const nav = typeof navigator !== 'undefined' ? navigator : null;
        const canShareFile =
          !!nav?.share && !!nav?.canShare && nav.canShare({ files: [file] });

        if (canShareFile) {
          try {
            await nav!.share({
              files: [file],
              title: '관계 욕구 자가진단 결과',
              text: '나의 관계 패턴 자가진단 결과를 확인해 보세요!',
            });
            setStatus('idle');
            return;
          } catch {
            // user cancelled or share failed — fall through to download
          }
        }

        // Fallback: download as PNG
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        setStatus('idle');
      }, 'image/png');
    } catch (e) {
      console.error('[Image] 생성 실패', e);
      alert('이미지 생성 중 오류가 발생했습니다.');
      setStatus('idle');
    }
  };

  return (
    <button
      className="download-btn no-capture"
      onClick={handleShare}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? (
        <><span className="download-spin">⏳</span> 이미지 생성 중…</>
      ) : (
        <><span>🖼️</span> 이미지로 공유</>
      )}
    </button>
  );
}
