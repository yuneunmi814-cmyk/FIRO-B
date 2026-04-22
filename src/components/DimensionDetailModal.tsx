import { useEffect } from 'react';
import type { FIROBScores } from '../types';

export type DimensionKey = 'inclusion' | 'control' | 'affection';

interface Props {
  dimKey: DimensionKey | null;
  scores: FIROBScores;
  onClose: () => void;
}

interface TotalBand {
  range: string;
  label: string;
  emoji: string;
  headline: string;
  body: string;
}

interface ComboInfo {
  key: 'hE_hW' | 'hE_lW' | 'lE_hW' | 'lE_lW';
  title: string;
  emoji: string;
  summary: string;
  body: string;
}

interface DimensionInfo {
  koName: string;
  enName: string;
  icon: string;
  color: string;
  tagline: string;
  friendlyIntro: string;
  eKey: keyof FIROBScores;
  wKey: keyof FIROBScores;
  eLabel: string;
  wLabel: string;
  totalBands: [TotalBand, TotalBand, TotalBand, TotalBand]; // 0–5 / 6–10 / 11–14 / 15–18
  combos: Record<ComboInfo['key'], ComboInfo>;
  tips: string[];
}

const DIMENSION_INFO: Record<DimensionKey, DimensionInfo> = {
  inclusion: {
    koName: '소속 (Inclusion)',
    enName: 'Inclusion',
    icon: '🤝',
    color: '#43D39E',
    tagline: '관계의 "넓이" — 사람들과 얼마나 어울리고 싶은가',
    friendlyIntro:
      '소속 욕구는 "내가 얼마나 많은 사람과 어울리고 싶은가"를 재는 영역이에요. ' +
      '쉽게 말해 관계의 폭(width)에 대한 욕구예요.\n\n' +
      '소속 욕구가 높은 사람은 다양한 사람과 교류할 때 활력을 얻고, 낮은 사람은 소수의 ' +
      '사람과 깊은 관계를 맺을 때 만족감을 느껴요. 둘 다 나름의 방식으로 관계를 ' +
      '잘 꾸려가는 것이에요 — 단지 "관계의 크기"가 다른 것뿐이에요.\n\n' +
      '소속 욕구는 다시 두 갈래로 나뉘어요. 내가 먼저 다가가는 "표출(eI)"과 상대가 ' +
      '나를 챙겨주기를 바라는 "수용(wI)". 이 두 축의 조합이 당신만의 독특한 ' +
      '사교 스타일을 만들어요.',
    eKey: 'eI',
    wKey: 'wI',
    eLabel: 'eI · 먼저 다가가기',
    wLabel: 'wI · 포함되고 싶은 마음',
    totalBands: [
      {
        range: '0–5',
        label: '낮음',
        emoji: '🌿',
        headline: '소수·깊이 중심',
        body:
          '혼자 있는 시간이 불편하지 않고, 넓은 모임보다 소수와의 깊은 관계에서 만족을 ' +
          '찾는 분이에요. 사교적 에너지를 함부로 소모하지 않아 자기 일에 집중하기 ' +
          '좋은 타입이에요. 다만 관계망이 좁아 새 기회·정보에 닿는 속도가 느릴 수 있어요.',
      },
      {
        range: '6–10',
        label: '중간',
        emoji: '☁️',
        headline: '상황별 조율형',
        body:
          '필요할 땐 적극적으로 어울리고, 쉴 땐 혼자만의 시간을 즐기는 유연한 분이에요. ' +
          '"이 정도가 딱 좋다"는 감각이 있어 관계 피로가 적고, 어떤 그룹에서도 무리 없이 ' +
          '자리잡아요.',
      },
      {
        range: '11–14',
        label: '중상',
        emoji: '🌤️',
        headline: '활발한 사교형',
        body:
          '여러 사람과 교류하는 것을 즐기고, 다양한 관계 속에서 에너지를 얻는 분이에요. ' +
          '네트워킹·팀빌딩·커뮤니티 활동에서 강점이 드러나요. 인맥을 통해 기회가 빠르게 ' +
          '닿는 타입이에요.',
      },
      {
        range: '15–18',
        label: '높음',
        emoji: '✨',
        headline: '고도로 사교적',
        body:
          '사람들 속에서 살아 숨쉬는 분이에요. 혼자 있는 시간이 오히려 불편할 수 있고, ' +
          '다양한 모임과 커뮤니티가 인생의 활력소예요. 다만 넓은 관계 유지에 에너지를 ' +
          '크게 쓰므로, 의식적인 휴식 관리가 필요해요.',
      },
    ],
    combos: {
      hE_hW: {
        key: 'hE_hW',
        title: '사교적 교류형',
        emoji: '🎉',
        summary: 'eI 높음 + wI 높음 — 주고 받는 관계 모두 활발',
        body:
          '넓게 어울리고, 동시에 사람들이 나를 챙겨주기도 원하는 타입이에요. "관계의 ' +
          '쌍방향 흐름"에서 큰 만족을 얻어요. 파트너나 친구에게 사교적이고 함께하는 ' +
          '활동을 중요시하는 사람이 잘 맞아요.',
      },
      hE_lW: {
        key: 'hE_lW',
        title: '능동적 사교형',
        emoji: '🌊',
        summary: 'eI 높음 + wI 낮음 — 내가 주도하되, 꼭 돌려받을 필요는 없음',
        body:
          '먼저 다가가고 주도적으로 관계를 만들지만, 상대가 반드시 나를 챙겨줘야 한다는 ' +
          '욕구는 크지 않아요. 독립적이면서도 사교적인 균형이 있어서 리더 포지션에 ' +
          '자연스럽게 서는 타입이에요.',
      },
      lE_hW: {
        key: 'lE_hW',
        title: '수동적 사교형',
        emoji: '🕊️',
        summary: 'eI 낮음 + wI 높음 — 관계에 포함되고 싶지만 먼저 못 가는 마음',
        body:
          '사람들과 함께하고 싶은 마음은 크지만, 먼저 다가가는 건 어려운 타입이에요. ' +
          '거절에 민감해 "괜히 갔다가 거절당하면 어쩌지?"가 발목을 잡기도 해요. ' +
          '적극적으로 나를 포함시켜주는 따뜻한 사람이 있으면 관계가 활짝 피어나요.',
      },
      lE_lW: {
        key: 'lE_lW',
        title: '자기충족형',
        emoji: '🌙',
        summary: 'eI 낮음 + wI 낮음 — 혼자가 가장 편한 독립적 스타일',
        body:
          '혼자의 시간이 외로움이 아니라 충전이 되는 타입이에요. 광범위한 사교가 ' +
          '필요하지 않고, 소수와의 깊은 관계에 만족해요. 혼자서도 즐거운 삶을 만들 ' +
          '수 있는 내적 힘이 있는 분이에요.',
      },
    },
    tips: [
      '낮다면 — 당신의 "적정 관계 수"를 스스로 정의하세요. 남들과 비교할 필요 없어요.',
      '중간이라면 — 상황에 따라 관계 모드를 전환하는 유연성을 강점으로 키워보세요.',
      '높다면 — 혼자만의 충전 시간을 의도적으로 확보하지 않으면 번아웃이 와요.',
      '어느 구간이든 — 내 관계 욕구를 파트너/친구에게 솔직하게 알려야 오해가 줄어요.',
    ],
  },

  control: {
    koName: '통제 (Control)',
    enName: 'Control',
    icon: '⚡',
    color: '#FF9F43',
    tagline: '관계의 "주도권" — 누가 결정하고 누가 따르는가',
    friendlyIntro:
      '통제 욕구는 "관계에서 누가 방향을 정하는가"를 재는 영역이에요. 이건 권력 다툼 ' +
      '얘기가 아니라, 결정과 책임을 얼마나 편안하게 받아들이는가에 대한 성향이에요.\n\n' +
      '통제 욕구가 높다고 "지배적"인 게 아니고, 낮다고 "소극적"인 것도 아니에요. ' +
      '리더십의 색깔이 다를 뿐이에요. 앞에서 이끄는 리더, 뒤에서 받치는 리더, ' +
      '수평적으로 협력하는 리더 — 각자의 자리가 있어요.\n\n' +
      '통제 욕구도 두 축으로 나뉘어요. 내가 먼저 이끌려는 "표출(eC)"과 상대가 ' +
      '이끌어주기를 바라는 "수용(wC)". 이 두 축의 조합이 당신의 리더십/팔로워십 ' +
      '스타일을 결정해요.',
    eKey: 'eC',
    wKey: 'wC',
    eLabel: 'eC · 먼저 이끌기',
    wLabel: 'wC · 이끌어주길 바라는 마음',
    totalBands: [
      {
        range: '0–5',
        label: '낮음',
        emoji: '🌾',
        headline: '평등·협력형',
        body:
          '위계나 지시를 싫어하고, 자율적·수평적 환경을 선호하는 분이에요. ' +
          '누구에게 명령하지도, 누구의 명령을 받지도 않는 "내 페이스"가 가장 편해요. ' +
          '창의성과 자유를 중시하는 환경에서 빛나는 타입이에요.',
      },
      {
        range: '6–10',
        label: '중간',
        emoji: '🪁',
        headline: '유연형',
        body:
          '이끄는 역할과 따르는 역할을 상황에 따라 자연스럽게 전환하는 분이에요. ' +
          '잘 아는 영역에서는 주도하고, 모르는 영역에서는 배워요. 협상·조율이 ' +
          '필요한 자리에 자주 초대받는 균형형 리더십이에요.',
      },
      {
        range: '11–14',
        label: '중상',
        emoji: '🧭',
        headline: '주도 지향형',
        body:
          '방향을 정하고 책임을 지는 역할에 익숙한 분이에요. 팀이 정체되면 자연스럽게 ' +
          '리더 포지션에 서고, 구조화된 의사결정 환경에서 성과를 크게 내는 타입이에요.',
      },
      {
        range: '15–18',
        label: '높음',
        emoji: '🏆',
        headline: '강한 통제 지향',
        body:
          '명확한 권한과 책임이 있는 환경에서 최고의 성과를 내는 분이에요. 위기·정체 ' +
          '상황에서 돌파력이 빛나요. 다만 통제할 수 없는 상황에서 스트레스가 크고, ' +
          '혼자 책임을 짊어지다 번아웃이 올 수 있어요.',
      },
    ],
    combos: {
      hE_hW: {
        key: 'hE_hW',
        title: '협력적 리더형',
        emoji: '🤝',
        summary: 'eC 높음 + wC 높음 — 스스로 이끌되 가이드도 원함',
        body:
          '앞장서는 것도 편하고, 동시에 명확한 방향이나 체계가 있으면 더 잘하는 타입이에요. ' +
          '민주적 리더십을 발휘하며 다양한 의견을 수용해요. 역할 분담이 유연한 조직에서 ' +
          '진가를 드러내요.',
      },
      hE_lW: {
        key: 'hE_lW',
        title: '주도적 리더형',
        emoji: '🏆',
        summary: 'eC 높음 + wC 낮음 — 자기결정으로 밀고 나가는 강한 리더',
        body:
          '주도권을 갖는 것을 선호하고 지시받는 건 불편해하는 타입이에요. 자신감 있고 ' +
          '결단력이 강해요. 자유도가 높은 환경에서 극대화된 실력을 보이지만, 위계가 ' +
          '강한 조직에서는 마찰이 생기기 쉬워요.',
      },
      lE_hW: {
        key: 'lE_hW',
        title: '팔로워형',
        emoji: '🎯',
        summary: 'eC 낮음 + wC 높음 — 명확한 방향을 따라가는 성실형',
        body:
          '주도하기보다 명확한 방향을 받아 정확히 실행하는 것을 편해하는 타입이에요. ' +
          '책임을 맡기보다 지원하는 역할에서 진가가 드러나요. 신뢰할 수 있는 리더 ' +
          '밑에서 최고의 성과를 내요.',
      },
      lE_lW: {
        key: 'lE_lW',
        title: '자율형',
        emoji: '🕊️',
        summary: 'eC 낮음 + wC 낮음 — 통제 자체를 싫어하는 자유인',
        body:
          '통제하는 것도, 통제받는 것도 모두 싫어하는 타입이에요. 민주적이고 자율적인 ' +
          '환경에서 가장 자유롭게 숨쉬어요. 강압적인 구조에서는 에너지를 빨리 잃을 수 있어요.',
      },
    },
    tips: [
      '높다면 — 결정 전에 한 번 더 경청하는 연습이 독단을 막아줘요.',
      '중간이라면 — 상황별로 리더/팔로워를 의식적으로 선택하면 영향력이 커져요.',
      '낮다면 — 강압적인 환경을 피하고 자율성이 보장된 자리를 적극적으로 찾아가세요.',
      '어느 구간이든 — 내 리더십 스타일을 팀에 솔직하게 공유하면 협업이 훨씬 편해져요.',
    ],
  },

  affection: {
    koName: '정서 (Affection)',
    enName: 'Affection',
    icon: '❤️',
    color: '#FF6B9D',
    tagline: '관계의 "깊이" — 얼마나 따뜻한 감정을 주고받고 싶은가',
    friendlyIntro:
      '정서 욕구는 "관계가 얼마나 따뜻하고 친밀해지기를 원하는가"를 재는 영역이에요. ' +
      '관계의 깊이(depth)에 대한 욕구예요.\n\n' +
      '정서 욕구가 높다고 감정적이거나 낮다고 차가운 게 아니에요. "사랑의 언어"가 ' +
      '다를 뿐이에요. 어떤 사람은 말로, 어떤 사람은 행동으로, 어떤 사람은 묵묵한 곁으로 ' +
      '사랑을 표현하고 받아들여요.\n\n' +
      '정서 욕구도 두 축으로 나뉘어요. 내가 먼저 따뜻함을 표현하는 "표출(eA)"과 ' +
      '상대가 따뜻함을 보여주기를 바라는 "수용(wA)". 이 두 축의 조합이 당신의 ' +
      '사랑의 언어를 결정해요.',
    eKey: 'eA',
    wKey: 'wA',
    eLabel: 'eA · 먼저 애정 표현',
    wLabel: 'wA · 애정받고 싶은 마음',
    totalBands: [
      {
        range: '0–4',
        label: '낮음',
        emoji: '🗿',
        headline: '담백·공식형',
        body:
          '친밀감보다 신뢰와 존중이 더 중요한 분이에요. 과한 감정 표현은 부담스럽고, ' +
          '묵직한 안정감이 더 큰 사랑으로 느껴져요. 전문적 관계에서 감정보다 역할과 ' +
          '업무에 집중하는 타입이에요.',
      },
      {
        range: '5–9',
        label: '중간',
        emoji: '🕯️',
        headline: '선택적 친밀',
        body:
          '신뢰할 수 있는 소수와 깊은 감정적 교류를 나누는 분이에요. 공적 관계와 ' +
          '사적 관계를 자연스럽게 구분할 줄 알고, 감정의 문을 열고 닫는 타이밍 ' +
          '감각이 좋아요.',
      },
      {
        range: '10–14',
        label: '중상',
        emoji: '🌷',
        headline: '따뜻한 관계 지향',
        body:
          '따뜻한 인간관계를 매우 중시하는 분이에요. 감정을 나누고 친밀감을 만드는 ' +
          '것이 삶의 큰 동력이에요. 관계의 온도가 따뜻할 때 가장 행복해요.',
      },
      {
        range: '15–18',
        label: '높음',
        emoji: '💐',
        headline: '깊은 친밀감 중시',
        body:
          '사람과의 감정적 연결 속에서 진짜 "나답게" 살아가는 분이에요. 깊은 감정 ' +
          '교류, 상호 돌봄, 따뜻한 애정 표현이 삶의 의미예요. 다만 감정 표현이 적은 ' +
          '상대에게 상처받기 쉬우니 "내 사랑의 언어"를 솔직히 알려주세요.',
      },
    ],
    combos: {
      hE_hW: {
        key: 'hE_hW',
        title: '정서적 개방형',
        emoji: '💐',
        summary: 'eA 높음 + wA 높음 — 감정을 주고받는 깊은 교류형',
        body:
          '감정을 솔직하게 표현하고, 상대도 그렇게 해주기를 원하는 타입이에요. ' +
          '깊은 감정 교류 속에서 관계의 의미를 찾아요. 감정 표현이 풍부한 파트너가 ' +
          '이상적이에요.',
      },
      hE_lW: {
        key: 'hE_lW',
        title: '표현적 독립형',
        emoji: '🌹',
        summary: 'eA 높음 + wA 낮음 — 내가 먼저 표현하되, 돌려받을 필요는 없음',
        body:
          '감정 표현에 적극적이지만 상대의 감정 표현을 많이 받는 것엔 신중한 타입이에요. ' +
          '따뜻하면서도 독립적인 균형이 있어요. 애정을 주는 것이 자연스럽지만 과도한 ' +
          '의존은 불편할 수 있어요.',
      },
      lE_hW: {
        key: 'lE_hW',
        title: '내성적 기대형',
        emoji: '🗝️',
        summary: 'eA 낮음 + wA 높음 — 받고 싶지만 먼저 못 표현하는 속마음',
        body:
          '감정적 친밀함을 원하지만 먼저 표현하기 어려운 타입이에요. "나도 사랑받고 ' +
          '싶은데 말이 안 나와"라는 상태예요. 먼저 따뜻하게 다가와 주는 적극적인 ' +
          '파트너가 당신의 마음을 활짝 열어줄 거예요.',
      },
      lE_lW: {
        key: 'lE_lW',
        title: '감정적 독립형',
        emoji: '🗿',
        summary: 'eA 낮음 + wA 낮음 — 감정보다 신뢰·존중에서 안정감을 찾음',
        body:
          '형식적인 관계를 선호하고 깊은 감정 공유에 신중한 타입이에요. 친밀감보다 ' +
          '존중과 안정감을 중시하고, 담백한 관계에서 가장 편안함을 느껴요. 감정을 ' +
          '강요하지 않는 파트너와 잘 맞아요.',
      },
    },
    tips: [
      '낮다면 — "감사합니다" 같은 가벼운 표현부터 연습하면 관계가 따뜻해져요.',
      '중간이라면 — 사랑의 언어(말/행동/시간/선물/스킨십)가 뭔지 스스로 정의해 보세요.',
      '높다면 — 상대의 표현 방식이 내 것과 다를 수 있다는 걸 기억하면 상처가 줄어요.',
      '어느 구간이든 — "내가 받고 싶은 사랑의 방식"을 상대에게 솔직히 알리면 관계가 움직여요.',
    ],
  },
};

function getTotalBandIndex(total: number, key: DimensionKey): 0 | 1 | 2 | 3 {
  if (key === 'affection') {
    if (total <= 4) return 0;
    if (total <= 9) return 1;
    if (total <= 14) return 2;
    return 3;
  }
  if (total <= 5) return 0;
  if (total <= 10) return 1;
  if (total <= 14) return 2;
  return 3;
}

function getComboKey(eScore: number, wScore: number): ComboInfo['key'] {
  const hE = eScore >= 5;
  const hW = wScore >= 5;
  if (hE && hW) return 'hE_hW';
  if (hE && !hW) return 'hE_lW';
  if (!hE && hW) return 'lE_hW';
  return 'lE_lW';
}

export default function DimensionDetailModal({ dimKey, scores, onClose }: Props) {
  useEffect(() => {
    if (!dimKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [dimKey, onClose]);

  if (!dimKey) return null;

  const info = DIMENSION_INFO[dimKey];
  const eScore = scores[info.eKey];
  const wScore = scores[info.wKey];
  const total = Math.round((eScore + wScore) * 10) / 10;
  const bandIdx = getTotalBandIndex(total, dimKey);
  const comboKey = getComboKey(eScore, wScore);
  const combo = info.combos[comboKey];
  const color = info.color;

  return (
    <div className="score-modal-overlay" onClick={onClose}>
      <div className="score-modal" onClick={(e) => e.stopPropagation()}>
        <button className="score-modal-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {/* Header */}
        <div className="score-modal-head" style={{ background: color + '18' }}>
          <div className="score-modal-head-row">
            <span className="score-modal-icon" aria-hidden>{info.icon}</span>
            <div className="score-modal-titleblock">
              <div className="score-modal-code" style={{ color }}>
                <span className="score-modal-code-letter">{info.enName}</span>
                <span className="score-modal-code-ko">{info.koName}</span>
              </div>
              <p className="score-modal-tag">{info.tagline}</p>
            </div>
            <div className="score-modal-score" style={{ color }}>
              {total.toFixed(1)}
              <span className="score-modal-score-denom">/ 18</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="score-modal-body">
          {/* e / w breakdown */}
          <section className="score-sec">
            <h3 className="score-sec-title">🔎 점수 구성</h3>
            <div className="dim-ew-grid">
              <div className="dim-ew-item" style={{ borderColor: color }}>
                <p className="dim-ew-lbl">{info.eLabel}</p>
                <p className="dim-ew-val" style={{ color }}>{eScore.toFixed(1)}</p>
                <p className="dim-ew-max">/ 9</p>
              </div>
              <div className="dim-ew-plus">+</div>
              <div className="dim-ew-item" style={{ borderColor: color }}>
                <p className="dim-ew-lbl">{info.wLabel}</p>
                <p className="dim-ew-val" style={{ color }}>{wScore.toFixed(1)}</p>
                <p className="dim-ew-max">/ 9</p>
              </div>
            </div>
          </section>

          {/* Friendly intro */}
          <section className="score-sec">
            <h3 className="score-sec-title">📖 이 욕구가 뜻하는 것</h3>
            <p className="score-sec-text">{info.friendlyIntro}</p>
          </section>

          {/* Total band highlight */}
          <section className="score-sec">
            <h3 className="score-sec-title">🎯 당신의 총합 해석</h3>
            <div className="score-level-card" style={{ borderColor: color, background: color + '10' }}>
              <div className="score-level-head">
                <span className="score-level-emoji">{info.totalBands[bandIdx].emoji}</span>
                <div>
                  <p className="score-level-range" style={{ color }}>
                    {info.totalBands[bandIdx].range} · {info.totalBands[bandIdx].label}
                  </p>
                  <p className="score-level-headline">{info.totalBands[bandIdx].headline}</p>
                </div>
              </div>
              <p className="score-level-body">{info.totalBands[bandIdx].body}</p>
            </div>
          </section>

          {/* Combo quadrant */}
          <section className="score-sec">
            <h3 className="score-sec-title">🧬 당신의 조합 패턴</h3>
            <div className="score-level-card" style={{ borderColor: color, background: '#fff' }}>
              <div className="score-level-head">
                <span className="score-level-emoji">{combo.emoji}</span>
                <div>
                  <p className="score-level-range" style={{ color }}>{combo.summary}</p>
                  <p className="score-level-headline">{combo.title}</p>
                </div>
              </div>
              <p className="score-level-body">{combo.body}</p>
            </div>
          </section>

          {/* Full band reference */}
          <section className="score-sec">
            <h3 className="score-sec-title">📊 총합 구간별 스타일</h3>
            <div className="dim-band-list">
              {info.totalBands.map((b, i) => (
                <div
                  key={b.range}
                  className={`dim-band-item ${i === bandIdx ? 'active' : ''}`}
                  style={i === bandIdx ? { borderColor: color } : undefined}
                >
                  <span className="dim-band-emoji">{b.emoji}</span>
                  <span className="dim-band-range">{b.range}</span>
                  <span className="dim-band-head">{b.headline}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section className="score-sec">
            <h3 className="score-sec-title">💡 관계에 써볼 만한 팁</h3>
            <ul className="score-tip-list">
              {info.tips.map((tip, i) => (
                <li key={i} className="score-tip-item">
                  <span className="score-tip-dot" style={{ background: color }} />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <div className="score-modal-footnote">
            총합은 표출(e) + 수용(w)의 합이에요. 같은 총합이어도 e/w 비율에 따라 결이
            전혀 달라져요.
          </div>
        </div>
      </div>
    </div>
  );
}
