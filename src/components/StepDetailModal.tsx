import { useEffect } from 'react'

export type StepVariant = 'profile' | 'pattern' | 'sample'

interface Props {
  variant: StepVariant | null
  onClose: () => void
}

export default function StepDetailModal({ variant, onClose }: Props) {
  useEffect(() => {
    if (!variant) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [variant, onClose])

  if (!variant) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-4 md:p-8 font-body"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-surface-container-lowest rounded-[2rem] shadow-editorial-lg my-4 max-h-[95vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="overflow-y-auto">
          {variant === 'profile' && <ProfileContent />}
          {variant === 'pattern' && <PatternContent />}
          {variant === 'sample' && <SampleContent />}
        </div>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════
   1. 심리 프로파일 — What the assessment measures
═════════════════════════════════════════════════════════════════ */
function ProfileContent() {
  return (
    <article className="text-on-surface">
      {/* Editorial header */}
      <header className="bg-gradient-to-br from-primary to-primary-container text-white p-8 md:p-12">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary/30 text-secondary-fixed-dim text-[11px] font-bold tracking-[0.2em] uppercase mb-4 font-headline">
          Step 01 · Psychological Profile
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter leading-[1.05] mb-4">
          FIRO-B란 무엇이고<br /><span className="text-secondary-fixed">무엇을 측정하는가</span>
        </h2>
        <p className="text-primary-fixed-dim leading-relaxed max-w-xl">
          60년 이상 글로벌 조직에서 검증된 대인관계 욕구 측정 도구.
          성격의 우열이 아닌, 당신이 사람들과 상호작용하는 고유한 방식을 분석합니다.
        </p>
      </header>

      <div className="p-8 md:p-12 space-y-10">
        {/* Origin */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 font-headline">Origin</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-3">William Schutz 박사의 3차원 대인관계이론 (1958)</h4>
          <p className="text-on-surface-variant leading-relaxed">
            FIRO-B는 <em>Fundamental Interpersonal Relations Orientation–Behavior</em>의 약자로,
            미국 해군연구소에서 팀 편성 효율을 연구하던 심리학자 <strong>William Schutz</strong> 박사가
            1958년 개발했습니다. 현재는 Myers-Briggs Company의 등록 상표로, 전 세계 Fortune 500
            기업과 정부기관, 대학 연구기관의 공식 팀빌딩·리더십 평가 도구로 활용되고 있습니다.
          </p>
        </section>

        {/* 3 Dimensions */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Three Dimensions</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-6">대인관계 욕구 3영역</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                ko: '소속', en: 'Inclusion', color: 'bg-blue-50 border-blue-200 text-blue-900',
                words: ['소속', '참여', '관계', '관심', '주목'],
                desc: '새로운 인간관계를 맺고 상호작용하며 그룹에 소속하고자 하는 욕구',
              },
              {
                ko: '통제', en: 'Control', color: 'bg-amber-50 border-amber-200 text-amber-900',
                words: ['리더십', '권력', '책임', '영향', '의사결정'],
                desc: '사람들 사이의 영향력·책임·의사결정·권력과 지배력에 관련된 욕구',
              },
              {
                ko: '정서', en: 'Affection', color: 'bg-rose-50 border-rose-200 text-rose-900',
                words: ['개인적 유대', '지지', '개방', '배려', '따뜻함', '공감'],
                desc: '일대일의 정서적 유대와 개인적으로 따뜻한 관계를 맺고자 하는 욕구',
              },
            ].map(d => (
              <div key={d.en} className={`rounded-2xl p-5 border ${d.color}`}>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-70 font-headline mb-1">{d.en}</p>
                <h5 className="text-xl font-extrabold font-headline mb-2">{d.ko}욕구</h5>
                <p className="text-sm leading-relaxed mb-4 opacity-80">{d.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {d.words.map(w => (
                    <span key={w} className="px-2 py-0.5 bg-white/70 rounded-md text-[11px] font-medium">{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expressed vs Wanted */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Two Behavior Axes</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-6">표출(e) vs 기대(w) — 행동의 두 축</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-6 bg-surface-container-low border border-outline-variant/15">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-secondary text-2xl">arrow_outward</span>
                <h5 className="text-lg font-bold font-headline text-primary">표출행동 (expressed)</h5>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                내가 상대에게 <strong>직접 취하는</strong> 행동. 얼마나 편안하게 먼저 다가가고,
                제안하고, 리드할 수 있는가.
              </p>
              <ul className="text-[13px] text-on-surface-variant space-y-1.5 leading-relaxed">
                <li>• 행동을 주도하는 것이 얼마나 편한가?</li>
                <li>• 3개 욕구와 관련된 행동을 자신이 직접 하는 것이 얼마나 편한가?</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6 bg-surface-container-low border border-outline-variant/15">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-secondary text-2xl">arrow_downward</span>
                <h5 className="text-lg font-bold font-headline text-primary">기대행동 (wanted)</h5>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                상대가 나에게 <strong>해 주기를 바라는</strong> 행동. 겉으로 드러나는 행동과
                달리 속마음의 욕구를 측정합니다.
              </p>
              <ul className="text-[13px] text-on-surface-variant space-y-1.5 leading-relaxed">
                <li>• 타인이 먼저 행동하기를 얼마나 원하는가?</li>
                <li>• 3개 욕구와 관련된 행동을 타인이 해주는 것이 얼마나 편한가?</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant mt-4 italic leading-relaxed">
            → 3개 욕구 × 2개 축 = <strong className="text-primary not-italic">총 6개 지표(eI, wI, eC, wC, eA, wA)</strong>로 당신을 측정합니다.
          </p>
        </section>

        {/* Use cases */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Use Cases</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">이런 분들에게 유용합니다</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: 'groups', title: '팀 빌딩·리더십 개발', desc: '팀원 간 갈등 구조와 리더십 스타일 진단' },
              { icon: 'psychology_alt', title: '자기이해·자기코칭', desc: '대인관계에서 반복되는 내 패턴 파악' },
              { icon: 'favorite', title: '커플·부부 상담', desc: '파트너와의 소통 간극과 궁합 영역 분석' },
              { icon: 'work', title: '경력 개발·조직문화', desc: '조직 내 자연스러운 포지션 탐색' },
            ].map(u => (
              <div key={u.title} className="flex gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-secondary-fixed-variant text-lg">{u.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-primary font-headline">{u.title}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-amber-900 text-sm leading-relaxed">
          <p className="font-bold mb-1 font-headline">⚠️ FIRO-B 검사의 한계</p>
          <ul className="space-y-1">
            <li>• 종합적인 성격검사가 <strong>아닙니다</strong>.</li>
            <li>• 좋고 나쁜 사람을 판별하는 검사가 <strong>아닙니다</strong>.</li>
            <li>• 능력·직업흥미·성취도를 평가하는 검사가 <strong>아닙니다</strong>.</li>
            <li>• 임상 진단이나 전문 상담을 대체하지 않는 자기이해 도구입니다.</li>
          </ul>
        </section>
      </div>
    </article>
  )
}

/* ═════════════════════════════════════════════════════════════════
   2. 패턴 심층 분석 — How the analysis works
═════════════════════════════════════════════════════════════════ */
function PatternContent() {
  return (
    <article className="text-on-surface">
      <header className="bg-gradient-to-br from-secondary to-on-secondary-container text-white p-8 md:p-12">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-secondary-fixed text-[11px] font-bold tracking-[0.2em] uppercase mb-4 font-headline">
          Step 02 · Deep Pattern Analysis
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter leading-[1.05] mb-4">
          점수 너머의<br /><span className="text-secondary-fixed-dim">패턴을 읽어냅니다</span>
        </h2>
        <p className="text-secondary-fixed opacity-95 leading-relaxed max-w-xl">
          단순한 점수 합계가 아니라, 표출과 기대의 간극·총합의 층위·영역 간 상호작용을 분석해
          당신의 대인관계 패턴을 다층적으로 해석합니다.
        </p>
      </header>

      <div className="p-8 md:p-12 space-y-10">
        {/* Score ranges */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Layer 1 · Score Bands</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">점수 구간별 해석 체계</h4>
          <div className="rounded-2xl bg-surface-container-low p-5 border border-outline-variant/15">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700 mb-1 font-headline">Selective</p>
                <p className="text-2xl font-extrabold text-green-800 font-headline">0–2</p>
                <p className="text-[11px] text-green-700 mt-1">매우 선택적으로 하는 행동</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 mb-1 font-headline">Situational</p>
                <p className="text-2xl font-extrabold text-amber-800 font-headline">3–6</p>
                <p className="text-[11px] text-amber-700 mt-1">상황에 따라 다르게 하는 행동</p>
              </div>
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700 mb-1 font-headline">Frequent</p>
                <p className="text-2xl font-extrabold text-rose-800 font-headline">7–9</p>
                <p className="text-[11px] text-rose-700 mt-1">선호하여 자주 하는 행동</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant text-center mt-4 italic">
              6개 지표 각각이 이 3구간 중 어디에 속하는지 먼저 분류합니다.
            </p>
          </div>
        </section>

        {/* Expressed vs Wanted gap */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Layer 2 · Gap Analysis</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">표출과 기대 사이의 간극</h4>
          <p className="text-on-surface-variant leading-relaxed mb-5">
            가장 중요한 분석 축입니다. 당신이 <strong>겉으로 드러내는 행동(e)</strong>과
            <strong> 속으로 바라는 행동(w)</strong> 사이의 차이가 관계의 오해와 피로를 만들어냅니다.
          </p>
          <div className="space-y-3">
            {[
              {
                formula: 'e > w',
                title: '주도형 패턴',
                desc: '본인이 먼저 관계 행동을 주도합니다. 상대가 원하지 않는 말·행동을 할까봐 불편해서 아예 거리를 두기도 합니다. 독립적이지만 때로 지배적으로 비칠 수 있습니다.',
                color: 'from-blue-50 to-blue-100 border-blue-200',
              },
              {
                formula: 'e = w',
                title: '균형형 패턴',
                desc: '상대가 어떻게 반응할지 파악한 뒤 자신을 표현합니다. 상호성을 중시하지만 때로 수동적이라는 인상을 줄 수 있습니다.',
                color: 'from-amber-50 to-amber-100 border-amber-200',
              },
              {
                formula: 'e < w',
                title: '기다림형 패턴',
                desc: '본인보다 타인이 먼저 주도해주기를 바랍니다. 겉으로는 차분하지만 속으로는 상대의 행동을 기다리며 서운함이 누적되기 쉽습니다.',
                color: 'from-rose-50 to-rose-100 border-rose-200',
              },
            ].map(p => (
              <div key={p.formula} className={`rounded-2xl p-5 bg-gradient-to-br border ${p.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-white rounded-lg text-sm font-extrabold text-primary font-headline tracking-tight">{p.formula}</span>
                  <h5 className="text-lg font-bold text-primary font-headline">{p.title}</h5>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9 combinations matrix */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Layer 3 · 9-Cell Matrix</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-3">9가지 점수조합 매트릭스</h4>
          <p className="text-on-surface-variant leading-relaxed mb-5">
            각 영역(소속·통제·정서)마다 표출(Low/Mid/High) × 기대(Low/Mid/High) = 9가지 조합이 나옵니다.
            <strong> 3영역 × 9조합 = 총 27가지 패턴</strong>에서 당신의 정확한 프로필을 도출합니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline"></th>
                  <th className="p-2 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">기대 Low</th>
                  <th className="p-2 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">기대 Mid</th>
                  <th className="p-2 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant font-headline">기대 High</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { row: '표출 Low',  cells: ['독립·거리두기', '조용한 수용', '수줍은 갈망'] },
                  { row: '표출 Mid',  cells: ['선택적 개방', '균형형 상호성', '적극 교류 지향'] },
                  { row: '표출 High', cells: ['주도적 독립', '사교적 리더', '교류 몰입형'] },
                ].map(r => (
                  <tr key={r.row}>
                    <td className="p-3 bg-surface-container-low text-xs font-bold text-on-surface-variant border-r border-outline-variant/20 font-headline">{r.row}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className="p-3 bg-surface-container-lowest border border-outline-variant/10 text-center text-on-surface font-medium">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-on-surface-variant mt-3 italic">
            각 칸마다 일반적 성향 · TIP · 어려움을 느낄 수 있는 부분까지 상세 해석됩니다.
          </p>
        </section>

        {/* Grand total */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Layer 4 · Grand Total</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">대인관계 욕구 총합</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { range: '0–15', label: 'Low',          desc: '독립·관심사 중심',  color: 'bg-slate-50 border-slate-200 text-slate-900' },
              { range: '16–26', label: 'Medium-Low',  desc: '상황 기반 선택적',  color: 'bg-blue-50 border-blue-200 text-blue-900' },
              { range: '27–38', label: 'Medium-High', desc: '팀 기반 상호작용',   color: 'bg-amber-50 border-amber-200 text-amber-900' },
              { range: '39–54', label: 'High',        desc: '고도로 사교적',     color: 'bg-rose-50 border-rose-200 text-rose-900' },
            ].map(g => (
              <div key={g.range} className={`rounded-2xl p-4 border ${g.color}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-70 mb-1 font-headline">{g.label}</p>
                <p className="text-lg font-extrabold font-headline">{g.range}</p>
                <p className="text-xs mt-1 opacity-85">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Org roles */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Layer 5 · Organizational Roles</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">조직 내 자연스러운 역할 매핑</h4>
          <p className="text-on-surface-variant leading-relaxed mb-5">
            6개 지표 각각이 High 수준일 때 조직에서 자연스럽게 수행할 역할을 매핑합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'eI', role: 'Clarifier',       desc: '이슈·해결책 제시, 정보 공유, 신규 구성원 소개' },
              { key: 'wI', role: 'Tension-Reducer', desc: '농담·유머로 분위기 전환, 공통 관심사 형성' },
              { key: 'eC', role: 'Director',        desc: '의사결정 압박, 행동 촉진, 회의 주도' },
              { key: 'wC', role: 'Questioner',      desc: '명확성 추구, 건설적 비판, 정보 탐색' },
              { key: 'eA', role: 'Encourager',      desc: '친절·수용·따뜻한 격려, 관계 유지' },
              { key: 'wA', role: 'Listener',        desc: '말없이 참여, 경청, 몸짓으로 공감' },
            ].map(r => (
              <div key={r.key} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex flex-col items-center justify-center shrink-0 font-headline">
                  <span className="text-[10px] font-semibold tracking-wider">{r.key.toUpperCase()}</span>
                  <span className="text-[10px] opacity-60">High</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary font-headline">{r.role}</p>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-2xl firo-gradient text-white p-6 md:p-8">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-2 font-headline">Summary</h4>
          <p className="text-xl md:text-2xl font-bold font-headline leading-tight">
            6개 지표 · 5개 분석 레이어 · 27가지 조합 + 아키타입 + 파트너 매칭까지.
          </p>
          <p className="text-primary-fixed-dim mt-3 leading-relaxed text-sm">
            단순한 점수표가 아닌, <strong className="text-white">당신의 대인관계를 다층적으로 해석하는 심리 프로파일링 시스템</strong>입니다.
          </p>
        </section>
      </div>
    </article>
  )
}

/* ═════════════════════════════════════════════════════════════════
   3. 종합 리포트 — Sample report example
═════════════════════════════════════════════════════════════════ */
function SampleContent() {
  // 샘플 프로필: 홍길동 (PDF 예시 참고 + 아키타입 재구성)
  const sample = {
    name: '홍길동',
    date: '2026.04.21',
    archetype: '전략가형 리더',
    tagline: '명확한 구조를 설계하되, 친밀함은 신중하게 선택하는 유형.',
    eI: 6, wI: 3, eC: 5, wC: 9, eA: 1, wA: 4,
  }
  const incTot = sample.eI + sample.wI
  const ctlTot = sample.eC + sample.wC
  const affTot = sample.eA + sample.wA
  const grand  = incTot + ctlTot + affTot

  return (
    <article className="text-on-surface">
      <header className="bg-gradient-to-br from-tertiary-fixed-dim via-secondary-fixed to-primary-fixed p-8 md:p-12">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[11px] font-bold tracking-[0.2em] uppercase mb-4 font-headline">
          Step 03 · Example Report
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter leading-[1.05] mb-3 text-primary">
          이런 리포트를<br /><span className="text-secondary">받게 됩니다</span>
        </h2>
        <p className="text-primary/80 leading-relaxed max-w-xl">
          실제 검사를 완료하신 분의 샘플 리포트입니다. 당신도 이 수준의 맞춤 분석을 받게 됩니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 bg-white/70 backdrop-blur rounded-full font-medium text-primary">예시 · {sample.name}</span>
          <span className="px-3 py-1 bg-white/70 backdrop-blur rounded-full font-medium text-primary">검사일 {sample.date}</span>
        </div>
      </header>

      <div className="p-8 md:p-12 space-y-10">
        {/* Archetype */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 font-headline">Your Archetype</h3>
          <h4 className="text-3xl md:text-4xl font-extrabold font-headline text-primary tracking-tighter leading-tight mb-3">{sample.name}님의 유형<br /><span className="text-secondary">{sample.archetype}</span></h4>
          <p className="text-on-surface-variant leading-relaxed max-w-2xl">{sample.tagline}</p>
        </section>

        {/* Score board (mimics PDF table) */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Score Board</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">6개 지표 × 3개 총합</h4>
          <div className="rounded-2xl bg-surface-container-low p-5 border border-outline-variant/15">
            <div className="grid grid-cols-4 gap-2 text-center text-[13px]">
              <div />
              <div className="p-2 text-blue-700 font-bold font-headline">I (소속)</div>
              <div className="p-2 text-amber-700 font-bold font-headline">C (통제)</div>
              <div className="p-2 text-rose-700 font-bold font-headline">A (정서)</div>

              <div className="p-2 bg-slate-100 rounded-lg font-bold text-on-surface-variant">e (표출)</div>
              <ScoreCell value={sample.eI} max={9} />
              <ScoreCell value={sample.eC} max={9} />
              <ScoreCell value={sample.eA} max={9} />

              <div className="p-2 bg-slate-100 rounded-lg font-bold text-on-surface-variant">w (기대)</div>
              <ScoreCell value={sample.wI} max={9} />
              <ScoreCell value={sample.wC} max={9} />
              <ScoreCell value={sample.wA} max={9} />

              <div className="p-2 bg-primary text-white rounded-lg font-bold">총합</div>
              <ScoreCell value={incTot} max={18} highlight />
              <ScoreCell value={ctlTot} max={18} highlight />
              <ScoreCell value={affTot} max={18} highlight />
            </div>
            <div className="mt-5 pt-5 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm font-medium text-on-surface-variant font-headline">욕구 총합</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-primary font-headline">{grand}</span>
                <span className="text-xs font-bold uppercase tracking-[0.15em] px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-headline">Medium-High</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interpretation narrative */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Narrative Insight</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">당신의 관계 서사</h4>
          <div className="space-y-4">
            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/15">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 font-headline">총합 28 · Medium-High</p>
              <p className="text-sm text-on-surface-variant leading-[1.9]">
                상황에 따라 사람들과 적극적으로 상호작용합니다. 대인관계는 목표 달성에 도움이 된다고 판단하며,
                팀 작업을 선호하되 따뜻한 일대일 관계도 가치있게 여깁니다. 때로 사람들과 함께 있는 것이
                스트레스가 될 때가 있어 혼자만의 시간이 필요합니다.
              </p>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 mb-2 font-headline">통제 14 · High · 주요 강점</p>
              <p className="text-sm text-amber-900 leading-[1.9]">
                과업 달성을 위해 명확한 권한과 책임이 부여되는 상황을 선호합니다. 특히 기대(wC=9)가
                표출(eC=5)보다 크게 높아, 리드하는 것을 즐기기도 하지만 때로 책임에서 벗어나고 싶어하는
                양가적 성향이 보입니다. 구조화된 환경에서 최고의 성과를 냅니다.
              </p>
            </div>
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-700 mb-2 font-headline">정서 5 · Low · 주의 영역</p>
              <p className="text-sm text-rose-900 leading-[1.9]">
                표출(eA=1)은 매우 선택적이지만 기대(wA=4)는 상황적 수준 — 본인이 먼저 친밀함을 표현하는 일은
                드물지만 사람들이 관심을 표현해주기를 원하는 편입니다. 사람들은 당신을 내성적·이성적이라고
                인식하기 쉬워, 먼저 미소나 가벼운 인사를 시작하는 연습이 관계에 큰 변화를 만들 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Role */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Organizational Role</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">조직에서의 자연스러운 포지션</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-5 bg-primary text-white rounded-2xl firo-gradient">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-1 font-headline">Primary</p>
              <h5 className="text-xl font-extrabold font-headline mb-2">Questioner (wC=9, High)</h5>
              <p className="text-sm text-primary-fixed-dim leading-relaxed">
                일을 시작하기 전에 구체적 설명을 요구하고 매사에 명확함을 추구합니다.
                팀의 건설적 비판자 역할.
              </p>
            </div>
            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/15">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1 font-headline">Secondary</p>
              <h5 className="text-xl font-extrabold font-headline text-primary mb-2">Clarifier (eI=6, Mid)</h5>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                상황에 따라 이슈나 해결책을 제시하고 논의된 바를 요약하는 역할도 자연스럽게 수행합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Tips section */}
        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-3 font-headline">Personalized Tips</h3>
          <h4 className="text-2xl font-bold font-headline text-primary mb-5">더 나은 관계를 위한 TIP</h4>
          <div className="space-y-3">
            {[
              '리더십을 발휘할 수 있는 구조화된 프로젝트에서 주도권 유지 — 권한이 분산된 환경에서는 피로도가 높아질 수 있음',
              '친밀함을 먼저 표현하는 작은 행동 1개씩 시도 (눈맞춤·미소·가벼운 안부 인사)',
              '소수의 오래된 사람들과의 관계에 정기적 시간 투자 — 광범위한 네트워킹보다 효과적',
              '책임감이 과도해질 때 적극적으로 위임 — "혼자 감당하는 것이 더 빠르다"는 판단이 번아웃의 지름길',
            ].map((t, i) => (
              <div key={i} className="flex gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shrink-0 font-headline">
                  {i + 1}
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed flex-1">{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What else is included */}
        <section className="rounded-2xl firo-gradient text-white p-6 md:p-8">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-2 font-headline">전체 리포트에는 이 외에도</h4>
          <ul className="space-y-2.5 mt-4">
            {[
              '이상적인 파트너 프로필 + 예상 FIRO-B 점수 + 주의해야 할 유형',
              '갈등 해결 스타일 + 강점·약점 + 파트너용 대화 스크립트',
              '점수 간극 기반 4단계 행동 가이드 + 2주 실천 로드맵',
              'PDF 다운로드 · 이메일 전송 · 영구 재열람',
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="material-symbols-outlined filled text-secondary-container mt-0.5 text-xl shrink-0">check_circle</span>
                <span className="text-[15px] text-primary-fixed-dim leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}

function ScoreCell({ value, max, highlight = false }: { value: number; max: number; highlight?: boolean }) {
  const level =
    max === 9
      ? (value <= 2 ? 'L' : value <= 6 ? 'M' : 'H')
      : (value <= 5 ? 'L' : value <= 12 ? 'M' : 'H')
  const colorMap = {
    L: 'bg-green-50  text-green-800  border-green-200',
    M: 'bg-amber-50  text-amber-800  border-amber-200',
    H: 'bg-rose-50   text-rose-800   border-rose-200',
  }
  return (
    <div className={`p-2 rounded-lg border font-bold font-headline ${highlight ? 'text-base ' : ''}${colorMap[level]}`}>
      {value} <span className="text-[10px] opacity-70">({level})</span>
    </div>
  )
}
