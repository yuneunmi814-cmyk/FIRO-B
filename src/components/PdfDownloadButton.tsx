import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Props {
  userName?: string
  className?: string
}

export default function PdfDownloadButton({ userName, className = '' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const handleDownload = async () => {
    const el = document.getElementById('report-capture')
    if (!el) return
    setStatus('loading')

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5F3FF',
        logging: false,
        ignoreElements: node => (node as HTMLElement).classList?.contains('no-capture'),
      })

      const imgData  = canvas.toDataURL('image/jpeg', 0.92)
      const pdf      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW    = pdf.internal.pageSize.getWidth()
      const pageH    = pdf.internal.pageSize.getHeight()
      const imgW     = pageW
      const imgH     = (canvas.height * imgW) / canvas.width

      let remaining  = imgH
      let srcY       = 0

      while (remaining > 0) {
        pdf.addImage(imgData, 'JPEG', 0, -srcY, imgW, imgH)
        remaining -= pageH
        srcY      += pageH
        if (remaining > 0) pdf.addPage()
      }

      const filename = userName
        ? `FIRO-B_${userName}_관계리듬리포트.pdf`
        : 'FIRO-B_관계리듬리포트.pdf'
      pdf.save(filename)
    } catch (e) {
      console.error('PDF 생성 실패', e)
    } finally {
      setStatus('idle')
    }
  }

  return (
    <button
      className={`pdf-btn no-capture ${className}`}
      onClick={handleDownload}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? (
        <><span className="pdf-btn-spin">⏳</span> PDF 생성 중…</>
      ) : (
        <><span>📄</span> PDF로 저장</>
      )}
    </button>
  )
}
