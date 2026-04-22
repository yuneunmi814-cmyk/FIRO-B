import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  userName?: string;
}

export default function DownloadReport({ userName }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleDownload = async () => {
    const el = document.getElementById('report-capture');
    if (!el) {
      alert('리포트 영역을 찾을 수 없습니다.');
      return;
    }
    setStatus('loading');

    try {
      // Capture the whole report as a high-dpi canvas.
      // Any element with .no-capture is skipped (buttons, share UI, etc).
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5F3FF',
        logging: false,
        ignoreElements: node => (node as HTMLElement).classList?.contains('no-capture'),
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW   = pdf.internal.pageSize.getWidth();
      const pageH   = pdf.internal.pageSize.getHeight();
      const imgW    = pageW;
      const imgH    = (canvas.height * imgW) / canvas.width;

      // Slice the tall image across multiple A4 pages by shifting the
      // same full-height image up on each page.
      let remaining = imgH;
      let offset    = 0;
      while (remaining > 0) {
        pdf.addImage(imgData, 'JPEG', 0, -offset, imgW, imgH);
        remaining -= pageH;
        offset    += pageH;
        if (remaining > 0) pdf.addPage();
      }

      const stamp    = new Date().toISOString().slice(0, 10);
      const filename = userName
        ? `관계욕구진단_${userName}_${stamp}.pdf`
        : `관계욕구진단_결과리포트_${stamp}.pdf`;
      pdf.save(filename);
    } catch (e) {
      console.error('[PDF] 생성 실패', e);
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.');
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
        <><span className="download-spin">⏳</span> PDF 생성 중…</>
      ) : (
        <><span>📄</span> PDF로 저장</>
      )}
    </button>
  );
}
