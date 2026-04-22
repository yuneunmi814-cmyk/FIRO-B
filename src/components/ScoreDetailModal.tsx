import { useEffect } from 'react';
import type { FIROBScores } from '../types';
import { SCALE_COLORS } from '../data/questions';

type ScaleKey = keyof FIROBScores;

interface Props {
  scaleKey: ScaleKey | null;
  score: number;
  onClose: () => void;
}

interface LevelBlock {
  range: string;
  label: string;
  emoji: string;
  headline: string;
  body: string;
  strengths: string[];
  weaknesses: string[];
}

interface ScaleInfo {
  code: string;
  koName: string;
  enName: string;
  icon: string;
  tagline: string;
  oneLiner: string;
  friendlyIntro: string;
  dailyExamples: string[];
  levels: [LevelBlock, LevelBlock, LevelBlock];
  tips: string[];
}

const SCALE_INFO: Record<ScaleKey, ScaleInfo> = {
  eI: {
    code: 'eI',
    koName: '포용 표현',
    enName: 'expressed Inclusion',
    icon: '🤝',
    tagline: '내가 먼저 사람들에게 다가가는 정도',
    oneLiner: '새로운 사람과 어울리거나, 모임을 만들거나, 먼저 말을 거는 일이 얼마나 편한가를 보여줘요.',
    friendlyIntro:
      'eI는 "내가 먼저" 사람들과 어울리려 하는 행동의 크기예요. 점수가 높을수록 \n' +
      '누군가가 불러주기를 기다리기보다, 내가 먼저 모임을 만들거나 말을 거는 편이에요. \n' +
      '낮다고 사교성이 부족한 건 절대 아니에요 — 단지 에너지를 소수에게 집중하는 스타일일 뿐입니다.',
    dailyExamples: [
      '새 동료에게 "같이 점심 어때요?" 하고 먼저 제안하기',
      '단톡방에서 먼저 아이디어를 던지기',
      '오랜만에 친구에게 먼저 안부 연락하기',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🌿',
        headline: '소수·깊이 중심 스타일',
        body:
          '넓은 모임보다 가까운 소수와 보내는 시간이 훨씬 편한 분이에요. 먼저 다가가기보다 ' +
          '상대의 초대를 기다리는 편이지만, 일단 관계가 깊어지면 오래 유지되는 든든한 관계를 만들어요. ' +
          '혼자 있는 시간이 충전 시간인 타입.',
        strengths: [
          '깊은 일대일 관계에서 상대가 "진짜 내 편"이라는 느낌을 받아요',
          '혼자 집중해야 하는 일에서 몰입도가 높고 성과가 안정적이에요',
          '말보다 행동·태도로 신뢰를 쌓아 관계가 가볍지 않아요',
          '무리한 사교 활동 없이도 에너지 소진이 적어요',
        ],
        weaknesses: [
          '새로운 기회·정보가 대부분 사람을 통해 오는데 네트워크가 좁아 기회 접근이 늦어요',
          '먼저 다가가지 않아서 상대가 "나한테 관심 없나?"로 오해할 수 있어요',
          '필요한 도움을 요청하는 것을 어려워해 혼자 떠안게 되기 쉬워요',
          '큰 행사·공개석상에서 본인 존재감을 드러내는 데 피로를 크게 느껴요',
        ],
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '☁️',
        headline: '상황에 따라 조율하는 스타일',
        body:
          '편한 자리에서는 꽤 적극적으로 어울리고, 낯선 자리에서는 한 걸음 물러서는 균형잡힌 분이에요. ' +
          '상황을 읽고 참여 정도를 스스로 조절할 줄 아는 점이 큰 강점이에요. "나설 때 나서고, ' +
          '물러날 때 물러나는" 유연함이 있어요.',
        strengths: [
          '상황 적응력이 높아 처음 보는 그룹에서도 금방 자리잡아요',
          '너무 눈에 띄지도, 너무 조용하지도 않아 사람들이 편안하게 느껴요',
          '사교 에너지를 효율적으로 써서 번아웃이 잘 오지 않아요',
          '내향·외향 어느 그룹에서도 "무리 없이 어울리는 사람"이라는 평가를 받아요',
        ],
        weaknesses: [
          '결정적인 자리에서 "이 사람 있어야 해"라는 강한 인상을 남기기 어려워요',
          '주도권을 잡을 수 있는 순간에도 "굳이?" 하고 물러서는 경향이 있어요',
          '리더 포지션보다 조력자 위치로 정체되기 쉬워요',
          '본인의 참여 기준이 애매해서 주변이 초대 여부를 혼동할 때가 있어요',
        ],
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '✨',
        headline: '분위기 메이커·연결자 스타일',
        body:
          '사람들 속에서 에너지를 얻는 분이에요. 새로운 사람에게 먼저 다가가고, 모임을 만들거나 ' +
          '단절된 사람들을 이어주는 역할을 자연스럽게 해요. 주변에서 "덕분에 사람들이 잘 모인다"는 ' +
          '말을 자주 들을 가능성이 커요.',
        strengths: [
          '인맥·정보망이 빠르게 넓어져 기회에 일찍 닿아요',
          '분위기를 깨우고 침묵을 풀어내는 자연스러운 리더십이 있어요',
          '서로 모르는 사람들을 연결하는 "허브" 역할로 조직에 가치를 줘요',
          '새로운 환경에서도 두려움보다 호기심이 먼저 작동해요',
        ],
        weaknesses: [
          '너무 넓은 관계 유지에 체력·감정 에너지를 크게 소모해요',
          '깊이 있는 관계 한두 개에 집중할 시간이 부족해지기 쉬워요',
          '혼자 있는 시간이 불편해 휴식이 제대로 이루어지지 않을 수 있어요',
          '모든 자리에 참여하려다 약속을 놓치거나 피상적인 관계만 남을 위험이 있어요',
        ],
      },
    ],
    tips: [
      '낮은 점수라면 — 1:1 만남부터 편하게 시작해 보세요. 넓힘보다 깊이가 당신의 강점이에요.',
      '중간 점수라면 — 가끔 불편한 자리에서도 먼저 한마디 건네보세요. 기회가 크게 늘어나요.',
      '높은 점수라면 — 혼자만의 충전 시간을 의식적으로 확보하세요. 번아웃을 막는 비결이에요.',
    ],
  },

  wI: {
    code: 'wI',
    koName: '포용 수용',
    enName: 'wanted Inclusion',
    icon: '🙌',
    tagline: '상대가 나를 챙겨주기를 바라는 정도',
    oneLiner: '사람들이 나를 모임에 불러주고, 기억해주고, 함께하고 싶어하기를 바라는 마음의 크기예요.',
    friendlyIntro:
      'wI는 눈에 잘 안 보이는 "속마음"의 욕구예요. 겉으로는 태연해 보여도, 누가 나를 불러주지 않으면 ' +
      '서운함이 쌓일 수 있어요. 반대로 낮다면 혼자만의 시간이 편하고, 누가 안 불러도 섭섭하지 않아요. ' +
      '어느 쪽이든 "내가 원하는 거리감"을 알면 관계가 훨씬 편해져요.',
    dailyExamples: [
      '친구들이 약속을 잡을 때 나를 꼭 포함시켜 주기를 바라는 마음',
      '동료들이 내 존재를 알아봐 주고 인사를 건네주기를 기대하는 마음',
      '오랜만에 친구가 먼저 연락해 주면 기분이 좋아지는 정도',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🌙',
        headline: '독립적이고 자율적인 스타일',
        body:
          '누가 불러주지 않아도 전혀 섭섭하지 않아요. 오히려 혼자만의 시간이 주는 자유로움을 ' +
          '즐기는 편이에요. "연락 자주 해야 친한 거"라는 통념에 얽매이지 않고, 내 페이스대로 ' +
          '관계를 유지해요. 관계 피로가 적은 타입.',
        strengths: [
          '외로움·소외감에 대한 저항력이 강해 감정이 흔들리지 않아요',
          '관계에 쏟는 시간을 자기 계발·취미에 재투자할 수 있어요',
          '연락 빈도·참여 여부에 스트레스를 덜 받아요',
          '혼자서도 잘 지내기 때문에 어떤 환경에서든 적응이 빨라요',
        ],
        weaknesses: [
          '상대가 "나한테 관심 없구나" 하고 거리감을 느낄 수 있어요',
          '무리에서 자연스럽게 빠지는 일이 누적되면 단절로 이어져요',
          '도움·지지가 필요한 순간에도 혼자 해결하려다 한계를 맞아요',
          '관계 유지 노력이 부족해 보여 장기적으로 "차가운 사람"이 될 수 있어요',
        ],
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🌤️',
        headline: '적당한 거리감을 좋아하는 스타일',
        body:
          '너무 외롭지도, 너무 번잡하지도 않은 상태를 좋아하는 분이에요. 가끔은 불러주면 반갑고, ' +
          '가끔은 혼자가 좋아요. 관계의 온도를 스스로 조절할 수 있는 건강한 기준선이에요.',
        strengths: [
          '관계에 대한 기대치가 적절해서 서운함이 누적되는 일이 적어요',
          '상대에게 부담을 주지 않으면서도 꾸준한 관계를 유지해요',
          '혼자의 시간과 함께의 시간을 모두 편안하게 즐길 수 있어요',
          '여러 사람과 적당한 깊이의 관계를 안정적으로 운영해요',
        ],
        weaknesses: [
          '내가 진짜 원하는 만남·거리감을 상대가 파악하기 어려울 수 있어요',
          '욕구 표현이 애매해서 중요한 순간 배려를 놓칠 수 있어요',
          '관계 우선순위가 또렷하지 않아 정작 필요한 사람과의 연결이 느슨해지기 쉬워요',
        ],
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '💫',
        headline: '함께함을 중요시하는 스타일',
        body:
          '사람들이 나를 떠올려주고, 챙겨주고, 함께하고 싶어할 때 큰 행복을 느껴요. ' +
          '단톡방에서 내 이름이 언급되는 것만으로도 기분이 좋아지는 분이에요. 반대로 배제되거나 ' +
          '빠진 느낌이 들면 상처도 깊게 받을 수 있으니, 내 기분을 주변에 솔직하게 전달하는 ' +
          '연습이 도움이 돼요.',
        strengths: [
          '강한 유대감 속에서 안정감과 소속감을 크게 느끼며 살아가요',
          '관계에 적극적으로 투자하므로 주변에 든든한 사람이 많아요',
          '사람들을 기억하고 챙기는 섬세함으로 조직의 감정적 중심이 되기 쉬워요',
          '"우리"라는 감각 속에서 더 좋은 퍼포먼스를 내요',
        ],
        weaknesses: [
          '초대받지 못하거나 배제되었을 때 상처가 오래 남아요',
          '서운함을 표현하지 않고 담아두면 관계 피로가 폭발할 수 있어요',
          '관계에 의존도가 커져서 혼자 결정해야 할 때 에너지가 쉽게 떨어져요',
          '상대가 바쁜 시기에 "나를 덜 챙긴다"로 확대 해석하기 쉬워요',
        ],
      },
    ],
    tips: [
      '높은 점수라면 — "나도 끼고 싶어"라고 솔직하게 말해 보세요. 기다리면 서운함이 더 커져요.',
      '중간 점수라면 — 원하는 거리감을 상대에게 알려주세요. 관계 오해가 크게 줄어요.',
      '낮은 점수라면 — 상대가 연락이 뜸해도 관계가 식은 게 아니란 걸 알려주면 좋아요.',
    ],
  },

  eC: {
    code: 'eC',
    koName: '통제 표현',
    enName: 'expressed Control',
    icon: '🧭',
    tagline: '내가 관계·상황을 주도하려는 정도',
    oneLiner: '팀의 방향을 정하거나, 결정을 내리거나, 먼저 의견을 내는 행동이 얼마나 편한가를 보여줘요.',
    friendlyIntro:
      'eC는 "내가 이끌어 볼게"라는 행동의 크기예요. 높다고 독재적인 것도, 낮다고 소극적인 것도 ' +
      '아니에요. 높으면 방향을 잡아주는 리더 역할이 편하고, 낮으면 팀 분위기를 해치지 않고 ' +
      '조용히 기여하는 방식이 편한 거예요. 둘 다 팀에 꼭 필요한 유형이에요.',
    dailyExamples: [
      '회의에서 "이렇게 하는 게 어때요?" 하고 먼저 제안하기',
      '여행 갈 때 일정·장소를 주도적으로 정하기',
      '갈등 상황에서 해결책을 먼저 내놓기',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🌾',
        headline: '수평적·협력형 스타일',
        body:
          '통제하거나 지시하는 것을 선호하지 않는 분이에요. 누구에게 명령받는 것도, 누구를 ' +
          '지시하는 것도 불편해요. 수평적이고 민주적인 환경에서 제일 편안함을 느끼며, ' +
          '강압적인 분위기에서는 에너지를 빨리 잃을 수 있어요.',
        strengths: [
          '권위적인 태도를 싫어하는 사람들에게 편안함을 줘요',
          '팀원이 자율적으로 움직일 때 오히려 최상의 결과를 끌어내요',
          '조용한 영향력으로 분위기를 망가뜨리지 않고 일을 돌아가게 해요',
          '협력·합의 과정을 중요시해 관계가 오래가요',
        ],
        weaknesses: [
          '방향을 정해야 하는 순간 결정이 지연돼 추진력이 떨어져요',
          '"의견이 없는 사람"으로 비쳐 기회·책임이 다른 사람에게 넘어갈 수 있어요',
          '강한 팀 안에서는 목소리가 묻혀 존재감이 약해지기 쉬워요',
          '리더 역할을 맡아야 할 때 심리적 부담이 크게 와요',
        ],
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🪁',
        headline: '상황에 맞춰 이끌거나 따르는 스타일',
        body:
          '필요할 때는 이끌고, 필요할 때는 따르는 유연한 분이에요. 자신이 잘 아는 영역에서는 ' +
          '주도권을 쥐고, 잘 모르는 영역에서는 기꺼이 전문가를 따라가요. 팀에 없어서는 안 될 ' +
          '균형잡힌 타입.',
        strengths: [
          '전문 영역에서는 주도하고 모르는 영역에서는 배우는 유연함이 있어요',
          '독단과 방임 사이의 중도를 찾아 팀 안정을 만들어요',
          '리더와 팔로워 역할을 자연스럽게 전환할 수 있어요',
          '협상·조율이 필요한 자리에 자주 초대받는 편이에요',
        ],
        weaknesses: [
          '결정적 리드가 필요한 순간 한 번 더 망설이다 타이밍을 놓칠 수 있어요',
          '어디까지가 내 권한인지 경계가 모호해 책임 소재가 흐려지기 쉬워요',
          '강한 의견 충돌에서는 중립을 유지하려다 오히려 양쪽에서 불만을 살 수 있어요',
        ],
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '🏆',
        headline: '결단력 있는 리더형 스타일',
        body:
          '결정을 내리고 책임지는 것을 두려워하지 않는 분이에요. 상황이 정체되면 누군가 방향을 ' +
          '잡아줘야 한다고 느끼고, 자연스럽게 그 역할을 떠맡아요. 다만 "내 방식이 맞다"는 ' +
          '확신이 강할 때, 주변 의견을 충분히 듣는 의식적 노력이 필요해요.',
        strengths: [
          '정체된 상황을 빠르게 움직이게 하는 돌파력이 있어요',
          '큰 책임을 두려워하지 않고 결과로 증명해내는 실행력이 강해요',
          '조직의 방향이 흔들릴 때 기준점이 되어주는 안정감을 줘요',
          '위기 상황에서 결단력이 빛나는 타입이에요',
        ],
        weaknesses: [
          '"내 말이 맞다"는 확신이 강해 타인의 의견을 충분히 듣지 않을 수 있어요',
          '지배적으로 비쳐 팀원들이 입을 닫는 분위기를 만들 위험이 있어요',
          '통제할 수 없는 상황에서 스트레스·좌절감이 크게 올라와요',
          '책임을 혼자 짊어지다가 번아웃이 올 가능성이 높아요',
        ],
      },
    ],
    tips: [
      '높은 점수라면 — 결정 전에 "다른 의견 있어?"를 한 번 더 묻는 것만으로 팀워크가 훨씬 좋아져요.',
      '중간 점수라면 — 중요한 자리에서 한 번 더 손을 들어 보세요. 리더십의 기회가 열려요.',
      '낮은 점수라면 — "내 의견은 이래요"라고 가볍게 말하는 연습이 조용한 자기주장을 만들어줘요.',
    ],
  },

  wC: {
    code: 'wC',
    koName: '통제 수용',
    enName: 'wanted Control',
    icon: '🧩',
    tagline: '상대가 이끌어 주기를 바라는 정도',
    oneLiner: '명확한 지시, 구조, 가이드라인을 받고 싶은 욕구의 크기예요.',
    friendlyIntro:
      'wC는 "누가 좀 정해줘요"라는 속마음의 크기예요. 높다고 의존적인 게 아니라 — 구조와 ' +
      '명확함 속에서 더 큰 성과를 내는 스타일이라는 뜻이에요. 낮으면 자기결정권이 중요해서 ' +
      '세세한 지시를 받으면 답답함을 느낄 수 있어요.',
    dailyExamples: [
      '상사가 명확한 가이드라인을 주면 일이 더 잘되는 정도',
      '여행 갈 때 누군가 일정을 짜주면 마음이 편한 정도',
      '선택지가 너무 많을 때 누군가 추천해 주면 고마운 마음',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🦅',
        headline: '자기주도형 스타일',
        body:
          '누가 시키는 것을 별로 원하지 않고, 스스로 정해서 가는 것을 훨씬 편해하는 분이에요. ' +
          '세세한 지시는 답답함으로 느껴지기 쉬워요. "뭘 해야 하는지" 정도만 주어지면, 방법은 ' +
          '직접 찾아내는 독립적인 추진력이 강점이에요.',
        strengths: [
          '지시 없이도 스스로 방향을 찾아가는 강한 자립심이 있어요',
          '답이 정해지지 않은 문제에서 창의적인 해결책을 만들어내요',
          '자기 페이스를 지키며 장기 프로젝트에도 흔들리지 않아요',
          '권위에 휘둘리지 않아 신념을 유지하는 힘이 있어요',
        ],
        weaknesses: [
          '조직의 규칙·위계와 충돌해 "고집 세다"는 평가를 받기 쉬워요',
          '지시·피드백을 받을 때 방어적으로 반응할 위험이 있어요',
          '협업 시 "나는 내 방식대로"라는 태도가 팀 갈등으로 이어질 수 있어요',
          '경험 많은 선배·전문가의 조언을 흘려버려 성장 속도가 늦어질 수 있어요',
        ],
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🌉',
        headline: '구조와 자율 사이 균형형',
        body:
          '큰 틀은 주어지기를 바라지만, 세부는 내가 정하고 싶은 분이에요. "목표는 공유하되, ' +
          '방법은 재량껏"이라는 업무 스타일이 가장 잘 맞아요. 자율성과 가이드를 동시에 존중하는 ' +
          '조직에서 성과를 냅니다.',
        strengths: [
          '목표는 받아들이고 방법은 직접 고안하는 건강한 업무 스타일이에요',
          '상사·조직과 마찰 없이도 본인 색깔을 유지할 수 있어요',
          '지나치게 수동적이지도, 반항적이지도 않아 협업하기 편해요',
          '조언은 경청하되 스스로 최종 판단을 내리는 성숙한 태도가 있어요',
        ],
        weaknesses: [
          '명확한 지시가 아닌 상황에서 의사결정이 느려질 수 있어요',
          '"얼마나 자율적으로 움직여도 되는지"에 대한 눈치를 많이 봐요',
          '모호한 지시가 반복되면 불만이 누적될 수 있어요',
        ],
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '🏛️',
        headline: '구조 기반 성과형',
        body:
          '명확한 지시·기대·우선순위가 있을 때 최고의 성과를 내는 분이에요. 혼란스럽거나 ' +
          '모호한 상황을 싫어해요. "이걸 왜 하는지, 언제까지, 어떻게"가 또렷할수록 마음이 편하고 ' +
          '집중력도 올라가요. 체계적인 조직에서 빛나는 타입.',
        strengths: [
          '구조·절차가 있는 환경에서 정밀하고 꾸준한 퍼포먼스를 내요',
          '지시를 성실히 수행하고 마감을 지키는 신뢰도가 높아요',
          '조직의 안정성과 일관성에 크게 기여해요',
          '경험 많은 선배의 지도를 스펀지처럼 흡수해 빠르게 성장해요',
        ],
        weaknesses: [
          '모호한 지시·스타트업·창업 환경에서 스트레스가 크게 와요',
          '지시가 없는 상황에서 "내가 알아서 해도 되나?"로 망설이기 쉬워요',
          '리더가 흔들릴 때 본인의 에너지도 같이 흔들릴 수 있어요',
          '새 방식을 직접 설계해야 하는 자리에서 어려움을 느껴요',
        ],
      },
    ],
    tips: [
      '높은 점수라면 — 모호한 지시를 받으면 "명확히 여쭤봐도 될까요?"라고 주저 말고 물어보세요.',
      '중간 점수라면 — 자율과 구조 중 어느 쪽이 필요한지 상황마다 의식적으로 구분해 보세요.',
      '낮은 점수라면 — 지시받는 게 불편하다는 걸 상대에게 부드럽게 알리면 충돌이 줄어요.',
    ],
  },

  eA: {
    code: 'eA',
    koName: '애정 표현',
    enName: 'expressed Affection',
    icon: '💞',
    tagline: '내가 먼저 따뜻함과 친밀감을 표현하는 정도',
    oneLiner: '속마음을 열고, 감정을 전하고, 친밀함을 먼저 표현하는 행동의 크기예요.',
    friendlyIntro:
      'eA는 "먼저 다가가는 마음의 거리"예요. 높다고 감정적이거나 낮다고 차가운 게 아니에요. ' +
      '높으면 가까운 사람에게 감정을 솔직하게 전하는 편이고, 낮으면 진심은 깊지만 표현은 ' +
      '조심스러운 스타일이에요. 둘 다 각자의 방식으로 사랑을 보여주고 있어요.',
    dailyExamples: [
      '가까운 사람에게 "고마워, 보고 싶었어" 같은 말을 먼저 하기',
      '친구의 어려움에 공감하며 속마음을 나누기',
      '좋아하는 사람에게 칭찬·애정 표현을 먼저 건네기',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🗝️',
        headline: '신중한 표현형 스타일',
        body:
          '감정을 함부로 드러내기보다 신중하게 고르는 분이에요. 속마음은 깊고 따뜻하지만, ' +
          '말이나 행동으로 옮기는 건 오랜 신뢰가 쌓인 후예요. 주변에서 "내성적", "차분함"으로 ' +
          '비칠 수 있지만, 한 번 마음을 열면 오래가는 관계를 만드는 분이에요.',
        strengths: [
          '감정에 휘둘리지 않고 이성적 판단을 유지하는 안정감이 있어요',
          '드물지만 건네는 한마디가 상대에게 크게 와닿아 무게감이 있어요',
          '관계에 과하게 몰입하지 않아 오래가는 신뢰를 만들어요',
          '위기·갈등 상황에서 감정에 흔들리지 않고 차분하게 대응해요',
        ],
        weaknesses: [
          '"나한테 관심 없나?"로 오해받기 쉬워 관계 초반이 힘들어요',
          '사랑하는 사람에게 표현하지 않아 서로 서운함이 쌓일 수 있어요',
          '공감 능력이 낮아 보여 따뜻한 관계가 필요한 사람과는 멀어지기 쉬워요',
          '감사·칭찬 표현 부족으로 상대의 노력이 무시당하는 느낌을 줄 수 있어요',
        ],
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🕯️',
        headline: '상황에 맞춘 따뜻함',
        body:
          '친한 사람에게는 따뜻하고, 아닌 사람에게는 예의바른 거리두기를 하는 건강한 분이에요. ' +
          '"공적 관계"와 "사적 관계"를 자연스럽게 구분할 줄 알고, 감정의 문을 열고 닫는 타이밍 ' +
          '감각이 좋아요.',
        strengths: [
          '공·사 구분이 또렷해 관계가 혼란스럽지 않아요',
          '적절한 감정 표현으로 상대에게 편안함을 줘요',
          '감정에 휘둘리지도, 감정을 억누르지도 않는 균형이 있어요',
          '새 관계와 오랜 관계 모두에서 자연스러운 태도를 유지해요',
        ],
        weaknesses: [
          '감정 표현 기준이 상대에게 애매하게 읽힐 수 있어요',
          '중요한 순간에 한 발 더 따뜻함을 보여주지 못해 기회를 놓칠 수 있어요',
          '깊은 정서 교류를 원하는 상대에게는 부족하게 느껴질 수 있어요',
        ],
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '🌷',
        headline: '애정 표현이 자연스러운 스타일',
        body:
          '가까운 사람에게 "좋아해", "고마워", "보고 싶었어" 같은 말을 자연스럽게 건네는 분이에요. ' +
          '따뜻한 말과 행동으로 관계를 돌보는 것이 본능처럼 되어 있어요. 다만 감정 표현이 적은 ' +
          '상대에게는 "왜 반응이 없지?" 하고 상처받기 쉬우니, 상대의 표현 방식도 존중해 주세요.',
        strengths: [
          '따뜻한 말·행동으로 관계에 활기를 불어넣는 정서적 리더예요',
          '상대의 감정을 섬세하게 알아채고 반응하는 공감력이 있어요',
          '관계에 갈등이 생겨도 빠르게 봉합하는 회복력이 강해요',
          '주변에 "덕분에 기분이 좋아졌어"라는 말을 자주 듣는 편이에요',
        ],
        weaknesses: [
          '상대의 반응이 미지근할 때 크게 상처받거나 소진될 수 있어요',
          '애정 표현이 적은 사람을 "차갑다"로 단정하기 쉬워요',
          '감정에 몰입하다 보면 이성적 판단이 흐려질 수 있어요',
          '관계에 투자한 감정 에너지가 보답받지 못할 때 번아웃이 와요',
        ],
      },
    ],
    tips: [
      '높은 점수라면 — 상대의 반응이 미지근해도 "이 사람만의 사랑 방식"이라고 받아들여 보세요.',
      '중간 점수라면 — 평소 덜 표현했던 한 사람에게 오늘 한 문장 건네보세요. 관계가 움직여요.',
      '낮은 점수라면 — 말 대신 행동(문자, 작은 배려)으로 마음을 전하는 것도 충분해요.',
    ],
  },

  wA: {
    code: 'wA',
    koName: '애정 수용',
    enName: 'wanted Affection',
    icon: '🌹',
    tagline: '상대의 따뜻함·애정을 받고 싶은 정도',
    oneLiner: '상대가 나를 아껴주고, 마음을 열어주고, 애정을 표현해주기를 바라는 마음의 크기예요.',
    friendlyIntro:
      'wA는 "사랑받고 싶은 마음"의 크기예요. 높을수록 따뜻한 말 한마디, 작은 애정 표현이 ' +
      '큰 힘이 돼요. 낮다면 과한 감정 표현은 오히려 부담스럽고, 신뢰와 존중이 사랑의 언어예요. ' +
      '어느 쪽이든 나에게 맞는 사랑의 방식을 아는 것이 관계의 시작이에요.',
    dailyExamples: [
      '누군가가 "네가 있어서 좋아"라고 말해주면 마음이 따뜻해지는 정도',
      '가까운 사람이 먼저 안부나 걱정을 표현해주기를 바라는 마음',
      '중요한 날 기억해주고 축하받고 싶은 정도',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🗿',
        headline: '담백한 관계를 선호하는 스타일',
        body:
          '과한 감정 표현은 오히려 부담스러워요. "좋아해"라는 말보다, 중요한 순간에 옆에 ' +
          '있어주는 묵직한 신뢰가 더 크게 와닿는 분이에요. 겉으로 차가워 보일 수 있지만 ' +
          '사실 담백함과 안정감을 더 사랑하는 타입이에요.',
        strengths: [
          '애정 표현에 좌우되지 않는 감정적 독립성이 강해요',
          '과장된 말보다 행동·신뢰로 관계를 평가하는 안목이 있어요',
          '상대의 감정 기복에 휘둘리지 않고 안정감을 줘요',
          '관계를 검증하는 데 시간을 들여 장기적으로 단단한 인연을 만들어요',
        ],
        weaknesses: [
          '상대의 애정 표현을 불편해해서 따뜻한 사람이 떠나가기 쉬워요',
          '"정서적 교류가 부족한 관계"라는 평가를 받을 수 있어요',
          '힘들 때 감정적 위로를 받지 못하고 혼자 감당하게 돼요',
          '사랑받는 감각이 무뎌져 관계가 건조해질 수 있어요',
        ],
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🍵',
        headline: '적당한 따뜻함을 좋아하는 스타일',
        body:
          '과하지 않은 진심 어린 애정 표현에 가장 편안함을 느끼는 분이에요. 너무 뜨거운 말은 ' +
          '부담스럽고, 너무 차가우면 서운해요. "은은한 온도"를 유지해 주는 상대가 이상적이에요.',
        strengths: [
          '감정 기대치가 과하지 않아 관계에 과부담을 주지 않아요',
          '적절한 애정 표현에 진심으로 고마워하고 보답할 줄 알아요',
          '관계 온도를 극단으로 몰지 않아 장기적 안정성이 높아요',
          '상대의 표현 방식을 유연하게 받아들이는 수용력이 있어요',
        ],
        weaknesses: [
          '내가 원하는 애정의 "온도"가 상대에게 애매하게 전달될 수 있어요',
          '너무 소극적으로 표현하면 상대가 "내 사랑이 닿나?"로 오해할 수 있어요',
          '중요한 순간 더 큰 애정 표현을 원할 때도 티 내지 못하고 지나칠 수 있어요',
        ],
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '💐',
        headline: '따뜻한 표현이 큰 힘이 되는 스타일',
        body:
          '상대의 한마디, 작은 스킨십, 기억해주는 마음이 하루의 에너지를 바꿀 만큼 소중한 분이에요. ' +
          '"너 덕분에", "고마워", "보고 싶었어" 같은 말이 큰 힘이 돼요. 반대로 무관심·냉랭함에 ' +
          '상처를 깊게 받을 수 있으니, 내 마음의 언어를 상대에게 알려주는 게 중요해요.',
        strengths: [
          '사랑받는 감각 속에서 자기다움이 깊이 꽃피우는 스타일이에요',
          '감수성이 풍부해 예술·공감 영역에서 큰 강점을 발휘해요',
          '상대의 애정을 깊이 느끼고 돌려주는 선순환을 만들어요',
          '정서적 유대가 동력이 되어 관계를 오래 유지해요',
        ],
        weaknesses: [
          '무관심·냉랭함에 상처가 크게 남아 회복이 오래 걸려요',
          '애정 표현이 부족한 상대 옆에서 "사랑받지 못한다"는 감각에 시달리기 쉬워요',
          '관계 기대치가 높아 작은 서운함도 크게 누적될 수 있어요',
          '감정적 의존도가 커져 상대에게 부담을 줄 위험이 있어요',
        ],
      },
    ],
    tips: [
      '높은 점수라면 — "이런 말 들으면 정말 힘이 나"라고 사랑의 언어를 알려주세요.',
      '중간 점수라면 — 내가 받고 싶은 애정의 온도를 스스로 정의해 보세요. 관계가 편해져요.',
      '낮은 점수라면 — 과한 감정보다 행동·신뢰로 사랑해주는 사람을 만나면 잘 맞아요.',
    ],
  },
};

function getUserLevelIndex(score: number): 0 | 1 | 2 {
  if (score <= 2) return 0;
  if (score <= 6) return 1;
  return 2;
}

export default function ScoreDetailModal({ scaleKey, score, onClose }: Props) {
  useEffect(() => {
    if (!scaleKey) return;
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
  }, [scaleKey, onClose]);

  if (!scaleKey) return null;

  const info = SCALE_INFO[scaleKey];
  const color = SCALE_COLORS[scaleKey] ?? '#7C6FFF';
  const userLv = getUserLevelIndex(score);
  const currentLevel = info.levels[userLv];

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
                <span className="score-modal-code-letter">{info.code}</span>
                <span className="score-modal-code-ko">{info.koName}</span>
              </div>
              <p className="score-modal-en">{info.enName}</p>
              <p className="score-modal-tag">{info.tagline}</p>
            </div>
            <div className="score-modal-score" style={{ color }}>
              {score.toFixed(1)}
              <span className="score-modal-score-denom">/ 9</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="score-modal-body">
          {/* Friendly intro */}
          <section className="score-sec">
            <h3 className="score-sec-title">📖 이 점수가 뜻하는 것</h3>
            <p className="score-sec-lead">{info.oneLiner}</p>
            <p className="score-sec-text">{info.friendlyIntro}</p>
          </section>

          {/* Daily examples */}
          <section className="score-sec">
            <h3 className="score-sec-title">🌱 일상 속에서는 이런 순간</h3>
            <ul className="score-ex-list">
              {info.dailyExamples.map((ex, i) => (
                <li key={i} className="score-ex-item">{ex}</li>
              ))}
            </ul>
          </section>

          {/* User's level highlight */}
          <section className="score-sec">
            <h3 className="score-sec-title">🎯 당신의 점수 해석</h3>
            <div className="score-level-card" style={{ borderColor: color, background: color + '10' }}>
              <div className="score-level-head">
                <span className="score-level-emoji">{currentLevel.emoji}</span>
                <div>
                  <p className="score-level-range" style={{ color }}>
                    {currentLevel.range} · {currentLevel.label}
                  </p>
                  <p className="score-level-headline">{currentLevel.headline}</p>
                </div>
              </div>
              <p className="score-level-body">{currentLevel.body}</p>
            </div>
          </section>

          {/* Strengths */}
          <section className="score-sec">
            <h3 className="score-sec-title score-sec-strength">✅ 이 점수에서 나오는 강점</h3>
            <ul className="score-sw-list">
              {currentLevel.strengths.map((s, i) => (
                <li key={i} className="score-sw-item score-sw-strength">
                  <span className="score-sw-mark" aria-hidden>＋</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Weaknesses */}
          <section className="score-sec">
            <h3 className="score-sec-title score-sec-weakness">⚠️ 주의해야 할 약점·사각지대</h3>
            <ul className="score-sw-list">
              {currentLevel.weaknesses.map((w, i) => (
                <li key={i} className="score-sw-item score-sw-weakness">
                  <span className="score-sw-mark" aria-hidden>！</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
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
            점수는 현재 시점의 대인관계 성향을 보여주는 지표일 뿐, 좋고 나쁨을 가리지 않아요.
          </div>
        </div>
      </div>
    </div>
  );
}
