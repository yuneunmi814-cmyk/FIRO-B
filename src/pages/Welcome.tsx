import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import PartnershipForm from '../components/PartnershipForm';
import DisqusSection from '../components/DisqusSection';
import type { StepVariant } from '../components/StepDetailModal';

interface Props {
  onStart: (name: string) => void;
  onShowDetail: (variant: StepVariant) => void;
}

export default function Welcome({ onStart, onShowDetail }: Props) {
  const [name, setName] = useState('');

  const scrollToStart = () => {
    document.getElementById('wl-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-body text-on-surface">

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute top-60 -left-40 w-[500px] h-[500px] bg-tertiary-fixed/40 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Headline */}
          <div className="lg:col-span-7">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold tracking-[0.2em] uppercase mb-6 font-headline">
              FIRO-B 대인관계 진단
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[88px] font-extrabold font-headline tracking-tighter text-primary leading-[0.95] mb-7">
              나의 소통 방식,<br />
              <span className="italic text-secondary font-black">과학적으로</span><br />
              이해하세요.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl mb-8">
              William Schutz 박사의 3차원 대인관계이론에 기반한 FIRO-B는
              70년 이상 Fortune 500 기업과 연구기관에서 검증된 대인관계
              심리 도구입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={scrollToStart}
                className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-7 py-4 font-bold font-headline text-sm shadow-editorial-lg hover:bg-primary-container transition-colors cursor-pointer"
              >
                <span>검사 시작하기</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
              <a
                href="#wl-method"
                className="inline-flex items-center gap-2 bg-surface-container-low text-primary rounded-xl px-6 py-4 font-semibold font-headline text-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
              >
                <span>작동 방식 알아보기</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">timer</span>
                <span>5–10분 소요</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">edit_note</span>
                <span>총 54문항</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">lock</span>
                <span>개인정보 미수집</span>
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-editorial-lg border border-outline-variant/10 p-6 md:p-7 relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant font-headline">
                    대인관계 욕구 분석
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Live</span>
              </div>

              {[
                { label: '소속 (Inclusion)', w: 82, color: 'bg-blue-500' },
                { label: '통제 (Control)',   w: 67, color: 'bg-amber-500' },
                { label: '정서 (Affection)', w: 91, color: 'bg-rose-500' },
              ].map(({ label, w, color }, i) => (
                <div key={label} className={`${i > 0 ? 'mt-4' : ''}`}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-on-surface-variant font-medium">{label}</span>
                    <span className="font-extrabold text-primary font-headline">{w}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width: `${w}%`, transition: 'width 1.4s ease-out' }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-sm text-on-surface-variant font-medium">종합 분석 상태</span>
                <span className="text-sm font-extrabold text-secondary font-headline flex items-center gap-1.5">
                  <span className="material-symbols-outlined filled text-base">check_circle</span>
                  분석 완료
                </span>
              </div>
            </div>

            {/* decorative */}
            <div className="absolute -z-10 -top-5 -left-5 w-full h-full rounded-[2rem] bg-secondary/10" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          METHODOLOGY — 3 clickable step cards
      ═══════════════════════════════════════════════════ */}
      <section id="wl-method" className="bg-surface-container-low py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 flex-wrap">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 block font-headline">Methodology</span>
              <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter text-primary leading-[1.05] mb-4">
                어떻게 작동하나요
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                3단계 분석으로 행동 데이터 기반의 대인관계 패턴을 체계적으로 진단하고,
                실질적으로 활용 가능한 인사이트를 제공합니다. 각 단계를 눌러 자세히 알아보세요.
              </p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant font-headline">01 · 02 · 03</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              {
                num: '01', variant: 'profile' as StepVariant,
                icon: 'psychology',
                title: '심리 프로파일',
                desc: 'William Schutz 박사(1958)의 FIRO-B 이론에 기반한 54문항으로 소속·통제·정서 욕구를 정밀하게 측정합니다.',
                bg: 'bg-surface-container-lowest', accent: 'text-secondary', accentBg: 'bg-secondary-fixed',
                offset: false,
              },
              {
                num: '02', variant: 'pattern' as StepVariant,
                icon: 'insights',
                title: '패턴 심층 분석',
                desc: '표출과 기대의 간극, 9가지 조합 매트릭스, 총합 층위까지 — 단순 점수가 아닌 다층 분석으로 당신의 패턴을 읽습니다.',
                bg: 'bg-primary text-white firo-gradient', accent: 'text-secondary-fixed-dim', accentBg: 'bg-white/10',
                offset: true,
              },
              {
                num: '03', variant: 'sample' as StepVariant,
                icon: 'description',
                title: '종합 리포트',
                desc: '아키타입 · 6영역 상세 해석 · 이상적 파트너 · 갈등 해결 스타일 · 2주 행동 가이드까지 담긴 맞춤 리포트를 받습니다.',
                bg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', accent: 'text-on-tertiary-fixed-variant', accentBg: 'bg-white/40',
                offset: false,
              },
            ]).map(s => (
              <button
                key={s.num}
                type="button"
                onClick={() => onShowDetail(s.variant)}
                className={`${s.bg} ${s.offset ? 'md:translate-y-8' : ''}
                  rounded-[2rem] p-7 md:p-8 text-left border border-outline-variant/10 shadow-editorial
                  hover:-translate-y-1.5 ${s.offset ? 'md:hover:translate-y-6' : ''}
                  hover:shadow-editorial-lg transition-all duration-300 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 group relative overflow-hidden`}
              >
                <div className={`w-12 h-12 rounded-2xl ${s.accentBg} flex items-center justify-center mb-5`}>
                  <span className={`material-symbols-outlined text-2xl ${s.accent}`}>{s.icon}</span>
                </div>
                <span className={`absolute top-6 right-7 text-4xl font-black font-headline ${s.accent} opacity-30`}>{s.num}</span>
                <h3 className="text-2xl font-extrabold font-headline mb-3 tracking-tight">{s.title}</h3>
                <p className={`text-[14px] leading-relaxed mb-6 ${s.bg.includes('primary') ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{s.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] ${s.accent} group-hover:gap-2.5 transition-all font-headline`}>
                  자세히 보기
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DIFFERENTIATORS (dark)
      ═══════════════════════════════════════════════════ */}
      <section className="bg-primary text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-tertiary-container/20 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="w-64 h-64 mx-auto relative">
              {/* Orbital rings */}
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-white/15"
                  style={{
                    transform: `scale(${0.55 + i * 0.22})`,
                    animation: `spin ${20 + i * 10}s linear infinite${i % 2 ? ' reverse' : ''}`,
                  }}
                />
              ))}
              <div className="absolute inset-[30%] rounded-full firo-gradient flex flex-col items-center justify-center text-center shadow-editorial-lg">
                <span className="text-4xl font-black font-headline">70+</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary-fixed-dim font-headline">년 학술 검증</span>
              </div>
              <div className="absolute top-4 right-2 w-3 h-3 rounded-full bg-secondary-fixed" />
              <div className="absolute bottom-6 left-0 w-2 h-2 rounded-full bg-tertiary-fixed" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-3 block font-headline">Why FIRO-B</span>
            <h2 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tighter leading-[0.95] mb-8">
              <span className="italic text-secondary-fixed">과학적 근거</span>가<br />만드는 차이.
            </h2>
            <div className="space-y-5">
              {[
                { n: '01', title: '소속 지향성 (Inclusion)', desc: '사회적 교류와 소속감에 대한 욕구를 측정해 관계의 깊이와 폭을 파악합니다.' },
                { n: '02', title: '통제 역동성 (Control)',   desc: '파트너십 내 리더십·의사결정 방식·영향력에 대한 편안함을 파악합니다.' },
                { n: '03', title: '정서 수준 (Affection)',   desc: '친밀감·온기·감정적 취약성에 대한 욕구를 정밀하게 측정합니다.' },
              ].map(d => (
                <div key={d.n} className="flex gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-colors">
                  <span className="text-3xl font-black font-headline text-secondary-fixed-dim leading-none">{d.n}</span>
                  <div>
                    <h4 className="text-lg font-bold font-headline text-white mb-1">{d.title}</h4>
                    <p className="text-sm leading-relaxed text-primary-fixed-dim">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ACADEMIC CREDIBILITY
      ═══════════════════════════════════════════════════ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 block font-headline">Academic Foundation</span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter text-primary leading-[1.05] mb-4">
              학술적으로 검증된 도구
            </h2>
            <p className="text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
              FIRO-B는 William Schutz 박사가 1958년 개발한 이래 60년 이상 Fortune 500 기업,
              대학 연구기관, 팀빌딩 전문가들이 활용해온 대인관계 측정 도구입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: 'school', title: '학술 출판', desc: 'Schutz, W. (1958). FIRO: A Three-Dimensional Theory of Interpersonal Behavior. 이후 수십 편의 동료 심사 논문으로 지속 검증.' },
              { icon: 'apartment', title: '기업 HR 활용', desc: 'Google, NASA, 글로벌 컨설팅 펌 등에서 리더십 개발·팀 빌딩·채용 도구로 표준 활용.' },
              { icon: 'analytics', title: '자기보고식 진단', desc: '임상 진단이 아닌 개인 성장·자기 이해를 목적으로 하는 자기보고식 심리 진단 소프트웨어입니다.' },
            ].map(c => (
              <div key={c.title} className="bg-surface-container-lowest rounded-[2rem] p-7 border border-outline-variant/10 shadow-editorial">
                <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">{c.icon}</span>
                </div>
                <h4 className="text-xl font-bold font-headline text-primary mb-3">{c.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-5 text-[13px] text-amber-900 leading-relaxed">
            <span className="inline-flex items-center gap-2 font-bold mb-1.5 font-headline">
              <span className="material-symbols-outlined text-base">info</span>
              본 서비스의 범위
            </span>
            <p>
              본 서비스는 개인 성장·자기이해를 목적으로 하는 자기보고식 심리 진단 소프트웨어입니다.
              임상 진단, 의료 상담, 또는 정신건강 치료를 대체하지 않으며, 결과는 참고용입니다.
              전문 상담이 필요한 경우 자격을 갖춘 심리 전문가에게 문의하시기 바랍니다.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          START CTA
      ═══════════════════════════════════════════════════ */}
      <section id="wl-start" className="bg-surface-container-low py-20 md:py-28 relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-tertiary-fixed/40 rounded-full blur-[80px]" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-5 font-headline">
            지금 시작하세요
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tighter text-primary leading-[0.98] mb-4">
            나의 대인관계 유형,<br /><span className="text-secondary italic">지금 진단받으세요</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-10 max-w-xl mx-auto">
            5~10분 안에 54문항에 답하고, 즉시 당신만의 FIRO-B 프로파일을 확인할 수 있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              placeholder="이름을 입력하세요 (선택)"
              className="flex-1 bg-white border border-outline-variant/20 rounded-xl px-5 py-4 text-base font-medium text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
            <button
              onClick={() => onStart(name)}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-8 py-4 font-bold font-headline text-sm shadow-editorial-lg hover:bg-primary-container transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>검사 시작하기</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 text-[13px] text-on-surface-variant">
            {[
              { icon: 'edit_note',  text: '총 54문항' },
              { icon: 'timer',      text: '5~10분 소요' },
              { icon: 'diversity_3', text: '소통 + 갈등 리포트' },
              { icon: 'lock',       text: '개인정보 미수집' },
            ].map(c => (
              <span key={c.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-outline-variant/15 font-medium">
                <span className="material-symbols-outlined text-sm text-secondary">{c.icon}</span>
                {c.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BOTTOM — Ad / Partnership / Disqus
      ═══════════════════════════════════════════════════ */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <AdBanner slot="4444444444" format="horizontal" />
          <p className="text-center text-sm text-on-surface-variant leading-relaxed">
            각 문항은 1~6점으로 답변합니다. 솔직하게 답할수록 정확한 결과를 얻을 수 있어요.
          </p>
          <PartnershipForm />
          <DisqusSection
            pageUrl="https://projectyoon.com/"
            pageIdentifier="firob-welcome"
            title="자유 게시판"
            subtitle="FIRO-B 검사 결과나 궁금한 점을 자유롭게 나눠보세요"
          />
        </div>
      </section>
    </div>
  );
}
