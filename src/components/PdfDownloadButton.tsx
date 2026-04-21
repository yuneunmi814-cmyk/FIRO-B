import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Props {
  userName?: string
  className?: string
  /** Override the inner label/icon. Rendering happens inside the <button>. */
  children?: React.ReactNode
  /** Shown while the PDF is rendering. Defaults to "PDF 생성 중…". */
  loadingLabel?: React.ReactNode
  /** Full-width button layout. */
  block?: boolean
}

/**
 * Captures the element with id="report-capture" and saves it as a
 * multi-page A4 PDF. Any descendant with class .no-capture is excluded
 * from the screenshot (interactive UI, buttons, shares, etc.).
 */
export default function PdfDownloadButton({
  userName,
  className = '',
  children,
  loadingLabel,
  block = false,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const handleDownload = async () => {
    const el = document.getElementById('report-capture')
    if (!el) {
      console.error('[PDF] #report-capture not found')
      alert('리포트 영역을 찾을 수 없습니다.')
      return
    }
    setStatus('loading')

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f8f9fa',
        logging: false,
        ignoreElements: node => (node as HTMLElement).classList?.contains('no-capture'),
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW   = pdf.internal.pageSize.getWidth()
      const pageH   = pdf.internal.pageSize.getHeight()
      const imgW    = pageW
      const imgH    = (canvas.height * imgW) / canvas.width

      let remaining = imgH
      let srcY      = 0

      while (remaining > 0) {
        pdf.addImage(imgData, 'JPEG', 0, -srcY, imgW, imgH)
        remaining -= pageH
        srcY      += pageH
        if (remaining > 0) pdf.addPage()
      }

      const stamp    = new Date().toISOString().slice(0, 10)
      const filename = userName
        ? `FIROB_${userName}_${stamp}.pdf`
        : `FIROB_Report_${stamp}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error('[PDF] 생성 실패', err)
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저를 새로고침한 뒤 다시 시도해주세요.')
    } finally {
      setStatus('idle')
    }
  }

  const defaultIdle = (
    <>
      <span className="material-symbols-outlined text-xl" aria-hidden>download</span>
      <span>PDF로 저장</span>
    </>
  )
  const defaultLoading = (
    <>
      <span className="animate-spin inline-block" aria-hidden>⏳</span>
      <span>PDF 생성 중…</span>
    </>
  )

  return (
    <button
      type="button"
      className={`no-capture inline-flex items-center justify-center gap-2 ${block ? 'w-full' : ''} ${className}`.trim()}
      onClick={handleDownload}
      disabled={status === 'loading'}
    >
      {status === 'loading'
        ? (loadingLabel ?? defaultLoading)
        : (children ?? defaultIdle)
      }
    </button>
  )
}
