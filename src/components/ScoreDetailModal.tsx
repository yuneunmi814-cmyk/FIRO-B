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
  whenHigh: string;
  whenLow: string;
}

const SCALE_INFO: Record<ScaleKey, ScaleInfo> = {
  eI: {
    code: 'eI',
    koName: '포용 표현',
    enName: 'expressed Inclusion',
    icon: '🤝',
    tagline: '내가 먼저 사람들에게 다가가는 정도',
    oneLiner:
      '새로운 사람과 어울리거나, 모임을 만들거나, 먼저 말을 거는 일이 얼마나 편한가를 보여줘요.',
    friendlyIntro:
      'eI는 "내가 먼저" 사람들과 어울리려 하는 행동의 크기를 재요. 점수가 높을수록 누군가 ' +
      '불러주기를 기다리기보다 직접 모임을 만들거나, 침묵이 흐를 때 먼저 말을 거는 편이에요.\n\n' +
      '점수가 낮다고 해서 "사교성이 부족하다"는 뜻은 절대 아니에요. 단지 에너지를 ' +
      '아무 자리에나 흘려보내지 않고, 소수의 의미 있는 관계에 집중하는 스타일이라는 뜻이에요.\n\n' +
      '중요한 건 내 점수가 "좋고 나쁨"이 아니라, 내가 어떤 자리에서 가장 편안하고 가장 ' +
      '빛나는 사람인지를 알려준다는 거예요. 파티에서 빛나는 사람이 있고, 작은 카페 테이블에서 ' +
      '빛나는 사람이 있는 것처럼요.',
    dailyExamples: [
      '새 동료에게 "같이 점심 어때요?" 하고 먼저 제안하기',
      '단톡방에서 침묵이 길어질 때 먼저 주제를 던지기',
      '오랜만에 친구에게 이유 없이 먼저 안부 연락하기',
      '처음 간 모임에서 한 번도 말을 섞지 않은 사람에게 말 걸기',
      '회의 후 "커피 한잔 하실래요?" 같은 가벼운 약속 잡기',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🌿',
        headline: '소수·깊이 중심 스타일',
        body:
          '넓은 모임보다 가까운 소수와 보내는 시간이 훨씬 편한 분이에요. 먼저 다가가기보다는 ' +
          '상대의 초대를 기다리는 편이지만, 한 번 관계가 깊어지면 오래 유지되는 든든한 ' +
          '인연을 만들어요. 혼자 있는 시간은 외로운 시간이 아니라 에너지를 회복하는 ' +
          '충전 시간이에요.\n\n' +
          '사람들과 함께 있을 때 생기는 미세한 긴장감에 민감해서, 많은 자리에 참여하는 것이 ' +
          '금방 피곤하게 느껴져요. 대신 한두 명과의 깊은 대화에서 진짜 활력을 얻어요.',
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '☁️',
        headline: '상황에 따라 조율하는 스타일',
        body:
          '편한 자리에서는 꽤 적극적으로 어울리고, 낯선 자리에서는 한 걸음 물러서는 ' +
          '균형잡힌 분이에요. 상황을 읽고 내 참여 정도를 스스로 조절할 줄 아는 점이 큰 ' +
          '강점이에요.\n\n' +
          '"나설 때 나서고, 물러날 때 물러나는" 유연함 덕분에 어느 그룹에서나 무리 없이 ' +
          '녹아들어요. 너무 눈에 띄지도, 너무 조용하지도 않은 건강한 중간 지대에 머무는 ' +
          '편이에요.',
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '✨',
        headline: '분위기 메이커·연결자 스타일',
        body:
          '사람들 속에서 에너지를 얻는 분이에요. 새로운 사람에게 먼저 다가가고, 모임을 ' +
          '만들거나, 단절된 사람들을 이어주는 "허브" 역할을 자연스럽게 해요. 주변에서 ' +
          '"덕분에 사람들이 잘 모인다"는 말을 자주 듣게 될 가능성이 커요.\n\n' +
          '낯선 자리에서도 두려움보다 호기심이 먼저 작동하고, 어색한 침묵을 그냥 두지 못해요. ' +
          '이 에너지를 방향성 있게 쓰면 조직과 커뮤니티에 큰 가치를 만들어내지만, 혼자만의 ' +
          '충전 시간을 의식적으로 확보하지 않으면 쉽게 번아웃이 올 수 있어요.',
      },
    ],
    tips: [
      '낮은 점수라면 — 1:1 만남부터 시작해 보세요. 넓이가 아니라 깊이가 당신의 강점이에요.',
      '중간 점수라면 — 가끔 불편한 자리에서도 먼저 한마디 건네보세요. 기회의 문이 크게 넓어져요.',
      '높은 점수라면 — 혼자만의 충전 시간을 달력에 꼭 넣어두세요. 번아웃을 막는 비결이에요.',
      '어느 점수든 — 내가 가장 편한 "관계 밀도"가 있어요. 그걸 존중하는 사람과 더 가까워져요.',
    ],
    whenHigh:
      '모임에 활기를 불어넣고, 단절된 사람들을 연결하는 허브 역할을 합니다. 사람들 사이에서 ' +
      '에너지를 얻고, 새로운 기회를 빠르게 포착해요.',
    whenLow:
      '시끄럽지 않고 진심 어린 소수의 관계에 집중하는 깊이 있는 스타일입니다. 혼자만의 시간이 ' +
      '창의성과 몰입의 원천이 되어줘요.',
  },

  wI: {
    code: 'wI',
    koName: '포용 수용',
    enName: 'wanted Inclusion',
    icon: '🙌',
    tagline: '상대가 나를 챙겨주기를 바라는 정도',
    oneLiner:
      '사람들이 나를 모임에 불러주고, 기억해주고, 함께하고 싶어하기를 바라는 마음의 크기예요.',
    friendlyIntro:
      'wI는 눈에 잘 안 보이는 "속마음"의 욕구예요. 겉으로는 태연하지만, 누가 나를 불러주지 ' +
      '않으면 서운함이 쌓일 수 있어요. 반대로 낮다면 혼자만의 시간이 편하고, 누가 안 불러도 ' +
      '전혀 섭섭하지 않아요.\n\n' +
      '재미있는 건 wI는 행동(e)과 달리 쉽게 보이지 않기 때문에, 내 자신도 정확히 알아차리기 ' +
      '어려울 때가 많다는 점이에요. "나는 혼자가 편해"라고 말하면서도 동시에 ' +
      '"왜 나를 안 불러주지?"라며 서운해하는 경우가 있을 수 있어요.\n\n' +
      '어느 쪽이든 "내가 원하는 거리감"을 정확히 알면, 관계에서 생기는 오해와 서운함이 ' +
      '크게 줄어들어요. 이 점수는 그걸 스스로에게 물어보는 출발점이에요.',
    dailyExamples: [
      '친구들이 약속을 잡을 때 나를 꼭 포함시켜 주기를 바라는 마음',
      '동료들이 내 존재를 알아봐 주고 인사를 건네주기를 기대하는 마음',
      '오랜만에 친구가 먼저 연락해 주면 기분이 좋아지는 정도',
      '단톡방에서 내 이름이 언급되면 괜히 기분이 좋아지는 순간',
      '내가 빠진 사진·이야기에 은근히 서운해지는 마음',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🌙',
        headline: '독립적이고 자율적인 스타일',
        body:
          '누가 불러주지 않아도 전혀 섭섭하지 않은 분이에요. 오히려 혼자만의 시간이 주는 ' +
          '자유로움을 즐기는 편이에요. "연락 자주 해야 친한 거"라는 통념에 얽매이지 않고, ' +
          '내 페이스대로 관계를 유지해요.\n\n' +
          '사람들로부터 받는 관심보다 내 일·취미·개인 시간에서 더 큰 만족을 얻어요. 관계 ' +
          '피로도가 낮은 건강한 타입이지만, 한편으론 상대가 내 무심함을 오해할 수 있으니 ' +
          '"연락이 뜸해도 마음은 같다"는 걸 가끔 전해주면 좋아요.',
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🌤️',
        headline: '적당한 거리감을 좋아하는 스타일',
        body:
          '너무 외롭지도, 너무 번잡하지도 않은 상태를 좋아하는 분이에요. 가끔은 불러주면 ' +
          '반갑고, 가끔은 혼자가 좋아요. 관계의 온도를 스스로 조절할 수 있는 건강한 ' +
          '기준선이에요.\n\n' +
          '이 지점에 있으면 관계에 대한 서운함도, 관계 피로도도 적당해서 지속 가능한 ' +
          '인연을 오래 유지하기에 좋은 위치예요.',
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '💫',
        headline: '함께함을 중요시하는 스타일',
        body:
          '사람들이 나를 떠올려주고, 챙겨주고, 함께하고 싶어할 때 큰 행복을 느껴요. ' +
          '단톡방에서 내 이름이 언급되는 것만으로도 기분이 좋아지고, 누군가가 "보고 ' +
          '싶었다"고 말해주면 하루가 환해지는 분이에요.\n\n' +
          '반대로 배제되거나 빠진 느낌이 들면 상처를 깊게 받을 수 있어요. 서운함을 ' +
          '속으로 삼키지 말고, "나도 끼고 싶어"라고 솔직하게 말하는 연습이 관계를 ' +
          '훨씬 가볍게 만들어줘요.',
      },
    ],
    tips: [
      '높은 점수라면 — "나도 끼고 싶어"라고 솔직하게 말해 보세요. 기다리면 서운함만 더 커져요.',
      '중간 점수라면 — 원하는 거리감을 상대에게 알려주세요. 관계 오해가 크게 줄어요.',
      '낮은 점수라면 — 상대가 연락이 뜸해도 관계가 식은 게 아니라는 신호를 가끔 보내주세요.',
      '어느 점수든 — 내가 받고 싶은 "관심의 양"을 정확히 아는 게 관계의 출발점이에요.',
    ],
    whenHigh:
      '관계의 온기와 "우리"라는 감각을 깊게 느끼며 살아갑니다. 사람들과의 연결 속에서 ' +
      '자기다움을 꽃피워요.',
    whenLow:
      '독립적인 시간과 자율성에서 에너지를 충전하는 스타일입니다. 혼자여도 결코 외롭지 ' +
      '않은 내적 안정감이 있어요.',
  },

  eC: {
    code: 'eC',
    koName: '통제 표현',
    enName: 'expressed Control',
    icon: '🧭',
    tagline: '내가 관계·상황을 주도하려는 정도',
    oneLiner:
      '팀의 방향을 정하거나, 결정을 내리거나, 먼저 의견을 내는 행동이 얼마나 편한가를 보여줘요.',
    friendlyIntro:
      'eC는 "내가 이끌어 볼게"라는 행동의 크기예요. 높다고 독재적인 것도, 낮다고 소극적인 ' +
      '것도 아니에요. 높으면 방향을 잡아주는 리더 역할이 편하고, 낮으면 팀 분위기를 해치지 ' +
      '않고 조용히 기여하는 방식이 편한 거예요.\n\n' +
      '조직에는 두 스타일 모두 꼭 필요해요. 결정을 내려주는 사람이 있어야 일이 진행되고, ' +
      '그 결정을 섬세하게 실행하는 사람이 있어야 팀이 살아 움직여요. eC 점수는 내가 주로 ' +
      '어느 쪽에서 더 가치를 내는지를 알려줘요.\n\n' +
      '다만 높은 점수든 낮은 점수든, 상황에 따라 유연하게 반대 역할도 맡을 수 있다는 걸 ' +
      '잊지 마세요. 점수는 "내 편안한 default"이지, "내 한계"가 아니에요.',
    dailyExamples: [
      '회의에서 "이렇게 하는 게 어때요?" 하고 먼저 제안하기',
      '여행 갈 때 일정·장소를 주도적으로 정하기',
      '갈등 상황에서 해결책을 먼저 내놓기',
      '팀원에게 역할 분담을 제안하는 것',
      '의견이 엇갈릴 때 "이 방향으로 가보자"고 교통정리 하기',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🌾',
        headline: '수평적·협력형 스타일',
        body:
          '통제하거나 지시하는 것을 선호하지 않는 분이에요. 누구에게 명령받는 것도, ' +
          '누구를 지시하는 것도 불편해요. 수평적이고 민주적인 환경에서 제일 편안함을 ' +
          '느끼며, 강압적인 분위기에서는 에너지를 빨리 잃을 수 있어요.\n\n' +
          '자기 일을 묵묵히 해내는 조용한 신뢰감이 있고, 권위적인 태도에 질린 사람들에게 ' +
          '큰 안정감을 주는 타입이에요. 리더를 세우기보다 함께 결정하는 구조를 선호해요.',
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🪁',
        headline: '상황에 맞춰 이끌거나 따르는 스타일',
        body:
          '필요할 때는 이끌고, 필요할 때는 따르는 유연한 분이에요. 자신이 잘 아는 영역에서는 ' +
          '주도권을 쥐고, 잘 모르는 영역에서는 기꺼이 전문가를 따라가요.\n\n' +
          '팀에 없어서는 안 될 균형잡힌 타입이에요. 협상과 조율이 필요한 자리에 자연스럽게 ' +
          '초대받는 편이고, 독단과 방임 사이의 중도를 찾아 팀 안정을 만들어내요.',
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '🏆',
        headline: '결단력 있는 리더형 스타일',
        body:
          '결정을 내리고 책임지는 것을 두려워하지 않는 분이에요. 상황이 정체되면 누군가 ' +
          '방향을 잡아줘야 한다고 느끼고, 자연스럽게 그 역할을 떠맡아요.\n\n' +
          '위기 상황이나 정체된 프로젝트에서 돌파력이 빛나는 타입이에요. 다만 "내 방식이 ' +
          '맞다"는 확신이 강할 때, 주변 의견을 충분히 듣는 의식적 노력이 필요해요. ' +
          '리더십과 독단은 종이 한 장 차이예요.',
      },
    ],
    tips: [
      '높은 점수라면 — 결정 전에 "다른 의견 있어?"를 한 번 더 묻는 것만으로 팀워크가 훨씬 좋아져요.',
      '중간 점수라면 — 중요한 자리에서 한 번 더 손을 들어 보세요. 리더십의 기회가 열려요.',
      '낮은 점수라면 — "내 의견은 이래요"라고 가볍게 말하는 연습이 조용한 자기주장을 만들어줘요.',
      '어느 점수든 — 내 결정 스타일을 상대에게 미리 알리면 협업이 훨씬 편해져요.',
    ],
    whenHigh:
      '방향을 잃은 팀에 기준점을 제시하고, 빠른 결정으로 흐름을 만들어냅니다. 책임을 ' +
      '두려워하지 않는 실행력이 조직의 돌파구가 되어줘요.',
    whenLow:
      '강압 없이 협력과 합의를 만들어내는 수평적인 힘을 발휘합니다. 팀원들이 자율적으로 ' +
      '움직일 수 있는 공간을 만들어주는 조용한 리더십이에요.',
  },

  wC: {
    code: 'wC',
    koName: '통제 수용',
    enName: 'wanted Control',
    icon: '🧩',
    tagline: '상대가 이끌어 주기를 바라는 정도',
    oneLiner: '명확한 지시, 구조, 가이드라인을 받고 싶은 욕구의 크기예요.',
    friendlyIntro:
      'wC는 "누가 좀 정해줘요"라는 속마음의 크기예요. 높다고 의존적인 게 아니라, 구조와 ' +
      '명확함 속에서 더 큰 성과를 내는 스타일이라는 뜻이에요.\n\n' +
      'wC가 높은 사람은 "이걸 왜 하는지, 언제까지, 어떻게"가 또렷할수록 집중력이 폭발해요. ' +
      '반대로 낮으면 자기결정권이 중요해서 세세한 지시를 받으면 답답함을 느끼고, ' +
      '모호한 상황에서 오히려 창의력이 터지는 편이에요.\n\n' +
      '재미있는 건 wC와 eC의 조합이 당신의 리더십 스타일을 결정한다는 거예요. 높은 eC + ' +
      '낮은 wC = 자율 리더, 낮은 eC + 높은 wC = 성실한 팔로워, 높은 eC + 높은 wC = ' +
      '협력적 리더, 낮은 eC + 낮은 wC = 자유인. 어떤 조합이든 장점이 있어요.',
    dailyExamples: [
      '상사가 명확한 가이드라인을 주면 일이 훨씬 잘되는 정도',
      '여행 갈 때 누군가 일정을 짜주면 마음이 편한 정도',
      '선택지가 너무 많을 때 누군가 추천해 주면 고마운 마음',
      '새 프로젝트에서 "정해진 틀"이 있을 때 안심되는 정도',
      '우유부단한 상황에서 누군가 결정해 주면 홀가분해지는 순간',
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
          '직접 찾아내는 독립적인 추진력이 강점이에요.\n\n' +
          '스타트업·프리랜서·창업처럼 자율성이 보장된 환경에서 진짜 실력을 발휘하는 타입이에요. ' +
          '반면 규율이 강한 조직에서는 답답함을 느낄 수 있어요.',
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🌉',
        headline: '구조와 자율 사이 균형형',
        body:
          '큰 틀은 주어지기를 바라지만, 세부는 내가 정하고 싶은 분이에요. "목표는 공유하되, ' +
          '방법은 재량껏"이라는 업무 스타일이 가장 잘 맞아요.\n\n' +
          '자율성과 가이드를 동시에 존중하는 조직에서 성과를 내고, 지나치게 수동적이지도 ' +
          '반항적이지도 않아 어떤 팀과도 협업하기 편한 타입이에요.',
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '🏛️',
        headline: '구조 기반 성과형',
        body:
          '명확한 지시·기대·우선순위가 있을 때 최고의 성과를 내는 분이에요. 혼란스럽거나 ' +
          '모호한 상황을 싫어해요. "이걸 왜 하는지, 언제까지, 어떻게"가 또렷할수록 마음이 ' +
          '편하고 집중력도 올라가요.\n\n' +
          '체계적인 조직·공공기관·큰 기업에서 빛나는 타입이에요. 스펀지처럼 지도를 흡수해 ' +
          '빠르게 성장하지만, 모호한 지시가 반복되는 환경에서는 스트레스가 크게 쌓일 수 있어요.',
      },
    ],
    tips: [
      '높은 점수라면 — 모호한 지시를 받으면 "명확히 여쭤봐도 될까요?"라고 주저 말고 물어보세요.',
      '중간 점수라면 — 자율과 구조 중 어느 쪽이 필요한지 상황마다 의식적으로 구분해 보세요.',
      '낮은 점수라면 — 지시받는 게 불편하다는 걸 상대에게 부드럽게 알리면 충돌이 줄어요.',
      '어느 점수든 — 내가 가장 일이 잘되는 "조건"을 알면 그런 환경을 찾아갈 수 있어요.',
    ],
    whenHigh:
      '구조화된 환경에서 놀라울 정도로 정밀하고 꾸준한 성과를 만들어냅니다. 지시를 ' +
      '성실히 수행하고 마감을 지키는 신뢰도가 조직의 기둥이 되어줘요.',
    whenLow:
      '자유로운 환경에서 독립적으로 큰 그림을 그려내는 힘을 발휘합니다. 모호한 상황에서 ' +
      '오히려 창의적인 해답을 찾아내는 타입이에요.',
  },

  eA: {
    code: 'eA',
    koName: '애정 표현',
    enName: 'expressed Affection',
    icon: '💞',
    tagline: '내가 먼저 따뜻함과 친밀감을 표현하는 정도',
    oneLiner:
      '속마음을 열고, 감정을 전하고, 친밀함을 먼저 표현하는 행동의 크기예요.',
    friendlyIntro:
      'eA는 "먼저 다가가는 마음의 거리"예요. 높다고 감정적이거나 낮다고 차가운 게 아니에요. ' +
      '높으면 가까운 사람에게 감정을 솔직하게 전하는 편이고, 낮으면 진심은 깊지만 표현은 ' +
      '조심스러운 스타일이에요.\n\n' +
      '중요한 건 "사랑의 언어"가 사람마다 다르다는 거예요. 어떤 사람은 말로, 어떤 사람은 ' +
      '행동으로, 어떤 사람은 묵묵한 곁에 있어줌으로 사랑을 표현해요. eA가 낮은 사람은 ' +
      '말은 적지만 묵직한 신뢰와 행동으로 사랑을 보여주는 경우가 많아요.\n\n' +
      '파트너와의 eA 점수 차이가 크면 "나는 이만큼 사랑하는데 저 사람은 표현이 없다"는 ' +
      '오해가 생기기 쉬워요. 서로의 사랑의 언어를 이해하는 것이 관계의 핵심이에요.',
    dailyExamples: [
      '가까운 사람에게 "고마워, 보고 싶었어" 같은 말을 먼저 하기',
      '친구의 어려움에 공감하며 속마음을 나누기',
      '좋아하는 사람에게 칭찬·애정 표현을 먼저 건네기',
      '오랜 친구에게 "너는 나한테 특별해"라고 말해주기',
      '힘든 날 동료에게 "괜찮아요?"라고 먼저 물어봐 주기',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🗝️',
        headline: '신중한 표현형 스타일',
        body:
          '감정을 함부로 드러내기보다 신중하게 고르는 분이에요. 속마음은 깊고 따뜻하지만, ' +
          '말이나 행동으로 옮기는 건 오랜 신뢰가 쌓인 후예요.\n\n' +
          '주변에서 "내성적", "차분함", "이성적"으로 비칠 수 있지만, 한 번 마음을 열면 ' +
          '오래가는 관계를 만드는 분이에요. 감정에 휘둘리지 않는 안정감이 주변 사람들에게 ' +
          '큰 위안이 되어주기도 해요.',
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🕯️',
        headline: '상황에 맞춘 따뜻함',
        body:
          '친한 사람에게는 따뜻하고, 아닌 사람에게는 예의바른 거리두기를 하는 건강한 분이에요. ' +
          '"공적 관계"와 "사적 관계"를 자연스럽게 구분할 줄 알고, 감정의 문을 열고 닫는 ' +
          '타이밍 감각이 좋아요.\n\n' +
          '너무 감정적이지도 차갑지도 않은 이 지점은 관계를 지속 가능하게 유지하기에 ' +
          '최적의 위치예요.',
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '🌷',
        headline: '애정 표현이 자연스러운 스타일',
        body:
          '가까운 사람에게 "좋아해", "고마워", "보고 싶었어" 같은 말을 자연스럽게 건네는 ' +
          '분이에요. 따뜻한 말과 행동으로 관계를 돌보는 것이 본능처럼 되어 있어요.\n\n' +
          '상대의 감정을 섬세하게 알아채고 반응하는 공감력이 강점이지만, 감정 표현이 적은 ' +
          '상대에게는 "왜 반응이 없지?" 하고 상처받기 쉬워요. 상대의 "사랑의 언어"가 ' +
          '내 것과 다를 수 있다는 걸 기억하면 관계가 더 편해져요.',
      },
    ],
    tips: [
      '높은 점수라면 — 상대의 반응이 미지근해도 "이 사람만의 사랑 방식"이라고 받아들여 보세요.',
      '중간 점수라면 — 평소 덜 표현했던 한 사람에게 오늘 한 문장 건네보세요. 관계가 움직여요.',
      '낮은 점수라면 — 말 대신 행동(문자, 작은 배려)으로도 충분히 사랑을 전할 수 있어요.',
      '어느 점수든 — 내 사랑의 언어와 상대의 사랑의 언어가 다를 수 있다는 걸 기억해 주세요.',
    ],
    whenHigh:
      '따뜻한 말과 행동으로 관계에 생기를 불어넣는 "관계의 정원사"입니다. 상대의 감정을 ' +
      '빠르게 알아채고 반응하는 섬세함이 큰 장점이에요.',
    whenLow:
      '말보다 행동으로, 얕은 공감보다 깊은 신뢰로 사랑을 표현하는 스타일입니다. 오래갈수록 ' +
      '진가가 드러나는 묵직한 애정 방식이에요.',
  },

  wA: {
    code: 'wA',
    koName: '애정 수용',
    enName: 'wanted Affection',
    icon: '🌹',
    tagline: '상대의 따뜻함·애정을 받고 싶은 정도',
    oneLiner:
      '상대가 나를 아껴주고, 마음을 열어주고, 애정을 표현해주기를 바라는 마음의 크기예요.',
    friendlyIntro:
      'wA는 "사랑받고 싶은 마음"의 크기예요. 높을수록 따뜻한 말 한마디, 작은 애정 표현이 ' +
      '큰 힘이 돼요. 낮다면 과한 감정 표현은 오히려 부담스럽고, 신뢰와 존중이 사랑의 ' +
      '언어예요.\n\n' +
      'wA를 솔직하게 인정하는 건 생각보다 어려워요. "나는 애정 같은 거 필요없어"라고 ' +
      '쿨한 척하지만 사실은 따뜻한 말 한마디를 절실히 원하는 경우도 많거든요. 점수는 ' +
      '그 속마음을 있는 그대로 마주할 기회예요.\n\n' +
      '어느 쪽이든 나에게 맞는 사랑의 방식을 아는 것이 관계의 시작이에요. 그리고 그걸 ' +
      '상대에게 솔직하게 알려주는 것이 관계의 완성이고요.',
    dailyExamples: [
      '누군가가 "네가 있어서 좋아"라고 말해주면 마음이 따뜻해지는 정도',
      '가까운 사람이 먼저 안부나 걱정을 표현해주기를 바라는 마음',
      '중요한 날 기억해주고 축하받고 싶은 정도',
      '힘든 날 누군가 이유 없이 걱정해 주면 위안이 되는 순간',
      '"보고 싶었어" 같은 말을 듣고 싶은 은근한 갈망',
    ],
    levels: [
      {
        range: '0–2',
        label: '낮음',
        emoji: '🗿',
        headline: '담백한 관계를 선호하는 스타일',
        body:
          '과한 감정 표현은 오히려 부담스러워요. "좋아해"라는 말보다, 중요한 순간에 옆에 ' +
          '있어주는 묵직한 신뢰가 더 크게 와닿는 분이에요.\n\n' +
          '겉으로 차가워 보일 수 있지만 사실 담백함과 안정감을 더 사랑하는 타입이에요. ' +
          '감정에 휘둘리지 않고 이성적으로 관계를 유지하는 힘이 있어요. 다만 ' +
          '"감정 표현이 너무 없는 사람"이라는 평가를 받을 수 있으니, 감사의 한마디 정도는 ' +
          '익혀두면 좋아요.',
      },
      {
        range: '3–6',
        label: '중간',
        emoji: '🍵',
        headline: '적당한 따뜻함을 좋아하는 스타일',
        body:
          '과하지 않은 진심 어린 애정 표현에 가장 편안함을 느끼는 분이에요. 너무 뜨거운 ' +
          '말은 부담스럽고, 너무 차가우면 서운해요. "은은한 온도"를 유지해 주는 상대가 ' +
          '이상적이에요.\n\n' +
          '관계 온도가 극단으로 치우치지 않아 장기적으로 안정적인 인연을 만들기 ' +
          '좋은 타입이에요.',
      },
      {
        range: '7–9',
        label: '높음',
        emoji: '💐',
        headline: '따뜻한 표현이 큰 힘이 되는 스타일',
        body:
          '상대의 한마디, 작은 스킨십, 기억해주는 마음이 하루의 에너지를 바꿀 만큼 소중한 ' +
          '분이에요. "너 덕분에", "고마워", "보고 싶었어" 같은 말이 하루를 환하게 만들어요.\n\n' +
          '반대로 무관심·냉랭함에 상처를 깊게 받을 수 있어요. 내 마음의 언어를 상대에게 ' +
          '알려주는 게 중요해요. "이런 말 들으면 정말 힘이 나"라고 직접적으로 ' +
          '전해주세요. 상대는 당신의 속마음을 자동으로 알 수 없어요.',
      },
    ],
    tips: [
      '높은 점수라면 — "이런 말 들으면 정말 힘이 나"라고 사랑의 언어를 알려주세요.',
      '중간 점수라면 — 내가 받고 싶은 애정의 온도를 스스로 정의해 보세요. 관계가 편해져요.',
      '낮은 점수라면 — 과한 감정보다 행동·신뢰로 사랑해주는 사람을 만나면 잘 맞아요.',
      '어느 점수든 — 내가 원하는 사랑의 언어를 상대에게 직접 알려주는 것이 관계의 정답이에요.',
    ],
    whenHigh:
      '사랑받는다는 느낌 속에서 자기다움이 깊이 피어나는 스타일입니다. 감수성이 풍부해 ' +
      '예술·공감 영역에서 큰 강점을 발휘해요.',
    whenLow:
      '말이나 감정보다 묵직한 신뢰와 존중에서 사랑을 느끼는 스타일입니다. 과장된 ' +
      '표현보다 꾸준한 행동이 당신의 사랑의 언어예요.',
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
                <span className="score-level-emoji">{info.levels[userLv].emoji}</span>
                <div>
                  <p className="score-level-range" style={{ color }}>
                    {info.levels[userLv].range} · {info.levels[userLv].label}
                  </p>
                  <p className="score-level-headline">{info.levels[userLv].headline}</p>
                </div>
              </div>
              <p className="score-level-body">{info.levels[userLv].body}</p>
            </div>
          </section>

          {/* Full range reference */}
          <section className="score-sec">
            <h3 className="score-sec-title">📊 점수 구간별 스타일</h3>
            <div className="score-range-grid">
              {info.levels.map((lv, i) => (
                <div
                  key={lv.range}
                  className={`score-range-card ${i === userLv ? 'active' : ''}`}
                  style={i === userLv ? { borderColor: color } : undefined}
                >
                  <div className="score-range-emoji">{lv.emoji}</div>
                  <p className="score-range-num">{lv.range}</p>
                  <p className="score-range-label">{lv.label}</p>
                  <p className="score-range-head">{lv.headline}</p>
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

          {/* High / Low bookends */}
          <section className="score-sec score-sec-bookend">
            <div className="score-bookend-card">
              <p className="score-bookend-lbl">높을 때의 강점</p>
              <p className="score-bookend-text">{info.whenHigh}</p>
            </div>
            <div className="score-bookend-card">
              <p className="score-bookend-lbl">낮을 때의 강점</p>
              <p className="score-bookend-text">{info.whenLow}</p>
            </div>
          </section>

          <div className="score-modal-footnote">
            점수는 현재 시점의 대인관계 성향을 보여주는 지표일 뿐, 좋고 나쁨을 가리지 않아요.
          </div>
        </div>
      </div>
    </div>
  );
}
