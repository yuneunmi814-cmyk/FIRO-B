import { useState } from 'react';
import html2canvas from 'html2canvas';

export default function DownloadReport() {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleDownload = async () => {
    const el = document.getElementById('report-capture');
    if (!el) return;
    setStatus('loading');
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5F3FF',
        logging: false,
        // hide download/share buttons from the screenshot
        ignoreElements: (node) => node.classList?.contains('no-capture'),
      });
      const link = document.createElement('a');
      link.download = 'FIRO-B_결과리포트.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <button
      className="download-btn no-capture"
      onClick={handleDownload}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? (
        <><span className="download-spin">⏳</span> 이미지 생성 중…</>
      ) : (
        <><span>📥</span> 결과 이미지로 저장</>
      )}
    </button>
  );
}
