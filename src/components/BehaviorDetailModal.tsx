import { useEffect } from 'react';
import type { FIROBScores } from '../types';

export type BehaviorKey = 'expressed' | 'wanted';

interface Props {
  behaviorKey: BehaviorKey | null;
  scores: FIROBScores;
  onClose: () => void;
}

interface Band {
  range: string;
  label: string;
  emoji: string;
  headline: string;
  body: string;
}

interface BehaviorInfo {
  koName: string;
  enName: string;
  icon: string;
  color: string;
  tagline: string;
  formula: string;
  friendlyIntro: string;
  whatItMeans: string;
  bands: [Band, Band, Band, Band]; // 0–6 / 7–13 / 14–20 / 21–27
  tips: string[];
}

const BEHAVIOR_INFO: Record<BehaviorKey, BehaviorInfo> = {
  expressed: {
    koName: '표출행동',
    enName: 'Expressed Behavior',
    icon: '📣',
    color: '#7C6FFF',
    tagline: '내가 먼저 하는 행동의 총량',
    formula: 'eI + eC + eA',
    friendlyIntro:
      '표출행동(e)은 "내가 관계에서 먼저 하는 행동"의 총합이에요. 포용(eI)·통제(eC)·정서(eA) ' +
      '세 영역에서 내가 얼마나 적극적으로 움직이는지를 다 더한 값이에요.\n\n' +
      '점수가 높을수록 관계 속에서 능동적이고 주도적인 역할을 자연스럽게 떠맡아요. ' +
      '낮을수록 조용히 상황을 살피고, 필요한 순간에만 움직이는 신중한 스타일이에요.\n\n' +
      '중요한 건 이 점수 자체가 "좋다/나쁘다"가 아니라, 기대행동(w)과의 관계에서 ' +
      '진짜 의미가 드러난다는 거예요. 둘의 차이가 관계 패턴을 만들어내요.',
    whatItMeans:
      '표출행동이 높은 사람은 주변에서 "활발하다", "주도적이다"로 인식되기 쉬워요. ' +
      '낮은 사람은 "신중하다", "차분하다"로 보이고요. 어느 쪽이든 조직과 관계에 ' +
      '꼭 필요한 역할이에요.',
    bands: [
      {
        range: '0–6',
        label: '매우 낮음',
        emoji: '🌙',
        headline: '조용한 관찰자형',
        body:
          '관계에서 거의 움직이지 않는 편이에요. 먼저 다가가거나, 주도하거나, 감정을 ' +
          '표현하는 행동 모두 신중해요. 혼자 생각하고 판단하는 시간을 중요하게 여겨요. ' +
          '다만 상대가 "무관심한가?"로 오해할 수 있으니, 가끔은 의도적으로 신호를 ' +
          '보내주면 관계가 훨씬 따뜻해져요.',
      },
      {
        range: '7–13',
        label: '낮음',
        emoji: '🌾',
        headline: '선택적 표현형',
        body:
          '필요할 때만 움직이고, 아닐 땐 조용히 기다리는 신중한 분이에요. 행동을 아끼는 ' +
          '만큼 움직일 때의 영향력이 커요. "이 사람이 나서면 뭔가 중요한 일이다"라는 ' +
          '인식이 생기기도 해요.',
      },
      {
        range: '14–20',
        label: '중상',
        emoji: '🌤️',
        headline: '적극적 참여형',
        body:
          '관계에서 꽤 능동적이고 주도적인 분이에요. 먼저 다가가고, 의견을 내고, 감정을 ' +
          '표현하는 것이 자연스러워요. 조직과 관계에서 활력의 원천이 되어주는 타입이에요.',
      },
      {
        range: '21–27',
        label: '매우 높음',
        emoji: '✨',
        headline: '주도적 행동형',
        body:
          '관계에서 매우 적극적이고 앞서 움직이는 분이에요. 내가 먼저 연락하고, 내가 먼저 ' +
          '이끌고, 내가 먼저 애정을 표현하는 것이 본능처럼 되어 있어요. 다만 상대가 ' +
          '수동적이면 "왜 나만 노력하지?"라는 피로가 쌓일 수 있으니, 기대치 조절이 ' +
          '필요해요.',
      },
    ],
    tips: [
      '낮다면 — 한 달에 한 번, 평소보다 한 걸음 더 적극적인 행동을 시도해 보세요.',
      '중간이라면 — 내가 주도하고 싶은 관계와 그렇지 않은 관계를 구분해 보세요.',
      '높다면 — 상대가 따라올 시간을 주는 인내심이 관계의 균형을 만들어줘요.',
      '어느 구간이든 — 기대행동(w) 점수와 함께 봐야 진짜 의미가 드러나요.',
    ],
  },

  wanted: {
    koName: '기대행동',
    enName: 'Wanted Behavior',
    icon: '🙏',
    color: '#FF9F43',
    tagline: '상대가 해주기를 바라는 행동의 총량',
    formula: 'wI + wC + wA',
    friendlyIntro:
      '기대행동(w)은 "상대가 나에게 해주기를 바라는 행동"의 총합이에요. 포용(wI)·통제(wC)·정서(wA) ' +
      '세 영역에서 내가 얼마나 많은 것을 기대하는지를 다 더한 값이에요.\n\n' +
      '이 점수의 독특한 점은, 눈에 잘 안 보이는 "속마음"이라는 거예요. 겉으로는 태연해 ' +
      '보여도 속으로는 상대가 먼저 다가와 주기를, 이끌어 주기를, 따뜻하게 대해주기를 ' +
      '바라고 있을 수 있어요.\n\n' +
      '기대행동 점수를 솔직하게 마주하는 것이 건강한 관계의 출발점이에요. "나는 ' +
      '아무것도 안 바래"라고 쿨한 척하지만 사실은 많은 걸 바라고 있을 수 있거든요. ' +
      '또는 정말로 낮아서 상대의 무심함에 섭섭해하지 않는 스타일일 수도 있고요.',
    whatItMeans:
      '기대행동이 높은 사람은 관계에서 풍부한 상호작용을 원해요. 낮은 사람은 자율성과 ' +
      '독립을 더 중시하고요. 자신의 기대치를 스스로 알면, 상대에게 솔직하게 전할 수 ' +
      '있고 서운함이 크게 줄어들어요.',
    bands: [
      {
        range: '0–6',
        label: '매우 낮음',
        emoji: '🦅',
        headline: '독립·자율형',
        body:
          '상대에게 기대하는 것이 거의 없는 분이에요. 혼자 결정하고, 혼자 챙기고, 혼자 ' +
          '감당하는 것이 편해요. 관계에서 오는 의존감이나 서운함이 적은 안정된 타입이지만, ' +
          '상대는 "나를 필요로 하지 않는구나"로 느껴 거리감을 가질 수 있어요.',
      },
      {
        range: '7–13',
        label: '낮음',
        emoji: '🌉',
        headline: '선택적 기대형',
        body:
          '적당한 기대와 적당한 독립의 균형을 유지하는 분이에요. 가까운 사람에게만 ' +
          '선택적으로 기대하고, 나머지 관계에선 담백함을 유지해요. 관계 피로가 적고 ' +
          '지속 가능한 인연을 만들기 좋은 위치예요.',
      },
      {
        range: '14–20',
        label: '중상',
        emoji: '💫',
        headline: '상호 교류 중시',
        body:
          '상대가 먼저 다가와 주고, 챙겨주고, 표현해 주기를 꽤 원하는 분이에요. ' +
          '관계에서 풍부한 상호작용이 삶의 큰 에너지원이에요. 다만 상대가 바쁘거나 ' +
          '무심할 때 서운함이 커질 수 있으니, 기대를 솔직하게 전달하는 것이 ' +
          '관계의 열쇠예요.',
      },
      {
        range: '21–27',
        label: '매우 높음',
        emoji: '💐',
        headline: '깊은 교류 갈망',
        body:
          '관계에서 많은 것을 주고받고 싶어하는 분이에요. 상대가 나를 빠짐없이 챙겨주고, ' +
          '이끌어주고, 따뜻하게 대해주기를 강하게 원해요. 이런 관계를 만나면 활짝 ' +
          '피어나지만, 반대의 경우 서운함과 상처가 깊게 누적될 수 있어요. 내 기대를 ' +
          '상대에게 구체적으로 알리는 것이 꼭 필요해요.',
      },
    ],
    tips: [
      '높다면 — 기대를 속으로 담아두지 말고 구체적인 말로 표현하세요. 서운함이 줄어요.',
      '중간이라면 — 관계마다 다른 기대치를 가지는 것이 자연스러워요. 억지로 통일할 필요 없어요.',
      '낮다면 — 상대가 "내가 이 사람에게 필요한가?"로 오해하지 않도록 가끔 신호를 주세요.',
      '어느 구간이든 — 솔직한 기대 공유가 서운함을 가장 빨리 없애는 방법이에요.',
    ],
  },
};

function getBandIndex(total: number): 0 | 1 | 2 | 3 {
  if (total <= 6) return 0;
  if (total <= 13) return 1;
  if (total <= 20) return 2;
  return 3;
}

interface GapPattern {
  formula: string;
  title: string;
  emoji: string;
  body: string;
}

function getGapPattern(e: number, w: number): GapPattern {
  const gap = e - w;
  if (gap > 1) {
    return {
      formula: 'e > w',
      title: '주도형 패턴',
      emoji: '🚀',
      body:
        '표출이 기대보다 커요. 내가 먼저 움직이고 관계를 주도하는 스타일이에요. ' +
        '독립적이고 자기주도적이지만, 상대에게 따뜻한 것을 받는 것엔 조심스러울 수 있어요. ' +
        '때로 "내가 다 해"라는 피로가 올 수 있으니, 상대의 도움도 받아들이는 연습이 ' +
        '건강한 균형을 만들어줘요.',
    };
  }
  if (gap < -1) {
    return {
      formula: 'e < w',
      title: '기다림형 패턴',
      emoji: '🕊️',
      body:
        '기대가 표출보다 커요. 상대가 먼저 다가와주기를 속으로 바라지만, 나는 ' +
        '조용히 기다리는 편이에요. 겉으로는 차분해 보여도 속으로는 서운함이 쌓이기 ' +
        '쉬워요. "나도 원한다"를 솔직하게 말로 전달하는 연습이 관계의 열쇠예요.',
    };
  }
  return {
    formula: 'e ≈ w',
    title: '균형형 패턴',
    emoji: '⚖️',
    body:
      '표출과 기대가 균형을 이루고 있어요. 내가 주는 만큼 받기를 원하고, 받는 만큼 ' +
      '주려 하는 상호적인 관계 방식이에요. 공정하고 균형 잡힌 대인관계의 건강한 ' +
      '기준선이에요.',
  };
}

export default function BehaviorDetailModal({ behaviorKey, scores, onClose }: Props) {
  useEffect(() => {
    if (!behaviorKey) return;
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
  }, [behaviorKey, onClose]);

  if (!behaviorKey) return null;

  const info = BEHAVIOR_INFO[behaviorKey];
  const expressed = Math.round((scores.eI + scores.eC + scores.eA) * 10) / 10;
  const wanted = Math.round((scores.wI + scores.wC + scores.wA) * 10) / 10;
  const myTotal = behaviorKey === 'expressed' ? expressed : wanted;
  const bandIdx = getBandIndex(myTotal);
  const gap = getGapPattern(expressed, wanted);
  const color = info.color;

  const breakdown =
    behaviorKey === 'expressed'
      ? [
          { label: 'eI · 포용 표현', value: scores.eI },
          { label: 'eC · 통제 표현', value: scores.eC },
          { label: 'eA · 애정 표현', value: scores.eA },
        ]
      : [
          { label: 'wI · 포용 수용', value: scores.wI },
          { label: 'wC · 통제 수용', value: scores.wC },
          { label: 'wA · 애정 수용', value: scores.wA },
        ];

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
                <span className="score-modal-code-letter">{info.koName}</span>
                <span className="score-modal-code-ko">{info.formula}</span>
              </div>
              <p className="score-modal-en">{info.enName}</p>
              <p className="score-modal-tag">{info.tagline}</p>
            </div>
            <div className="score-modal-score" style={{ color }}>
              {myTotal.toFixed(1)}
              <span className="score-modal-score-denom">/ 27</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="score-modal-body">
          {/* Breakdown */}
          <section className="score-sec">
            <h3 className="score-sec-title">🔎 점수 구성</h3>
            <div className="beh-break-list">
              {breakdown.map((b) => (
                <div key={b.label} className="beh-break-item" style={{ borderColor: color }}>
                  <span className="beh-break-lbl">{b.label}</span>
                  <span className="beh-break-val" style={{ color }}>{b.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Friendly intro */}
          <section className="score-sec">
            <h3 className="score-sec-title">📖 이 행동이 뜻하는 것</h3>
            <p className="score-sec-text">{info.friendlyIntro}</p>
            <p className="score-sec-text" style={{ marginTop: 10 }}>{info.whatItMeans}</p>
          </section>

          {/* Band highlight */}
          <section className="score-sec">
            <h3 className="score-sec-title">🎯 당신의 점수 해석</h3>
            <div className="score-level-card" style={{ borderColor: color, background: color + '10' }}>
              <div className="score-level-head">
                <span className="score-level-emoji">{info.bands[bandIdx].emoji}</span>
                <div>
                  <p className="score-level-range" style={{ color }}>
                    {info.bands[bandIdx].range} · {info.bands[bandIdx].label}
                  </p>
                  <p className="score-level-headline">{info.bands[bandIdx].headline}</p>
                </div>
              </div>
              <p className="score-level-body">{info.bands[bandIdx].body}</p>
            </div>
          </section>

          {/* Gap analysis */}
          <section className="score-sec">
            <h3 className="score-sec-title">🧬 표출 vs 기대 패턴</h3>
            <div className="beh-gap-card">
              <div className="beh-gap-head">
                <span className="beh-gap-emoji">{gap.emoji}</span>
                <div>
                  <p className="beh-gap-formula">
                    표출 {expressed.toFixed(1)} <strong>{gap.formula}</strong> 기대 {wanted.toFixed(1)}
                  </p>
                  <p className="beh-gap-title">{gap.title}</p>
                </div>
              </div>
              <p className="beh-gap-body">{gap.body}</p>
            </div>
          </section>

          {/* All bands */}
          <section className="score-sec">
            <h3 className="score-sec-title">📊 점수 구간별 스타일</h3>
            <div className="dim-band-list">
              {info.bands.map((b, i) => (
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
            표출(e)과 기대(w)의 간극이 관계 패턴을 만들어요. 두 값을 함께 해석해 주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
