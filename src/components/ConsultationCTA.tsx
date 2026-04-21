import { CalendarDays, ChevronRight } from 'lucide-react'

interface Props {
  onBook?: () => void
}

export default function ConsultationCTA({ onBook }: Props) {
  const handleBook = () => {
    if (onBook) {
      onBook()
    } else {
      // TODO: connect to booking system (Calendly / custom booking page / kakao channel)
      // e.g. window.open('https://calendly.com/your-link', '_blank')
      alert('상담 예약 시스템을 준비 중입니다. 곧 연결됩니다!')
    }
  }

  return (
    <div className="consult-card">
      <div className="consult-inner">
        <div className="consult-text">
          <div className="consult-icon-wrap">
            <CalendarDays size={22} />
          </div>
          <div>
            <h3 className="consult-title">전문가와 함께 더 깊이 이해하고 싶으신가요?</h3>
            <p className="consult-desc">
              FIRO-B 전문 해석사와 1:1 상담으로, 리포트에서 놓친 맥락과
              실제 관계에서 어떻게 적용할지 구체적인 가이드를 받아보세요.
            </p>
            <ul className="consult-bullets">
              <li>50분 개인 맞춤 해석 세션</li>
              <li>관계 패턴 심층 코칭</li>
              <li>커플 세션 옵션 제공</li>
            </ul>
          </div>
        </div>
        <button className="consult-btn" onClick={handleBook}>
          전문가 해석 상담 예약
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
