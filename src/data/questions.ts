import type { Question } from '../types';

// 54 questions: 9 per scale, mixed 6-per-page (eI, wI, eC, wC, eA, wA order)
export const questions: Question[] = [
  // Page 1
  { id: 1,  text: '나는 처음 만나는 사람들에게 먼저 다가가 말을 건다', scale: 'eI' },
  { id: 2,  text: '다른 사람들이 자신의 모임에 나를 초대해 주기를 바란다', scale: 'wI' },
  { id: 3,  text: '나는 그룹에서 일의 방향을 정하는 역할을 맡는다', scale: 'eC' },
  { id: 4,  text: '다른 사람들이 나에게 명확한 지시와 방향을 제시해 주기를 바란다', scale: 'wC' },
  { id: 5,  text: '나는 가까운 친구들에게 속마음을 털어놓는다', scale: 'eA' },
  { id: 6,  text: '가까운 사람들이 나에게 따뜻함과 애정을 표현해 주기를 바란다', scale: 'wA' },
  // Page 2
  { id: 7,  text: '나는 다양한 사람들과 어울리는 자리를 직접 마련한다', scale: 'eI' },
  { id: 8,  text: '내가 없어도 되는 자리에 굳이 나를 불러주기를 원한다', scale: 'wI' },
  { id: 9,  text: '나는 다른 사람들에게 해야 할 일을 알려주는 편이다', scale: 'eC' },
  { id: 10, text: '다른 사람들이 내 대신 중요한 결정을 내려주기를 원한다', scale: 'wC' },
  { id: 11, text: '나는 특별한 관계의 사람들에게 애정을 적극적으로 표현한다', scale: 'eA' },
  { id: 12, text: '친밀한 사람들이 나에게 개인적인 이야기를 나눠주기를 원한다', scale: 'wA' },
  // Page 3
  { id: 13, text: '나는 혼자 할 수 있는 일도 다른 사람과 함께 하려고 한다', scale: 'eI' },
  { id: 14, text: '다른 사람들이 나와 함께 있는 것을 즐겨주기를 바란다', scale: 'wI' },
  { id: 15, text: '나는 상황이 내가 원하는 방향으로 흘러가도록 조율한다', scale: 'eC' },
  { id: 16, text: '다른 사람들이 나의 일을 감독하고 점검해 주기를 바란다', scale: 'wC' },
  { id: 17, text: '나는 친밀한 사람들과 개인적인 이야기를 나눈다', scale: 'eA' },
  { id: 18, text: '다른 사람들이 나를 특별히 좋아한다고 표현해 주기를 바란다', scale: 'wA' },
  // Page 4
  { id: 19, text: '나는 여럿이 모이는 자리에서 활발하게 대화한다', scale: 'eI' },
  { id: 20, text: '사람들이 나를 그들 그룹의 일원으로 받아들여 주기를 원한다', scale: 'wI' },
  { id: 21, text: '나는 결정이 필요한 순간에 먼저 의견을 제시한다', scale: 'eC' },
  { id: 22, text: '누군가가 상황을 통제하고 나를 안내해 주기를 원한다', scale: 'wC' },
  { id: 23, text: '나는 사랑하는 사람들에게 따뜻한 말과 행동으로 감정을 전달한다', scale: 'eA' },
  { id: 24, text: '가까운 관계의 사람들이 나에게 먼저 감정을 표현해 주기를 원한다', scale: 'wA' },
  // Page 5
  { id: 25, text: '나는 새로운 사람들을 내 친구 모임에 초대한다', scale: 'eI' },
  { id: 26, text: '사람들이 나의 존재를 알아보고 인정해 주기를 바란다', scale: 'wI' },
  { id: 27, text: '나는 그룹의 규칙이나 방향을 제안한다', scale: 'eC' },
  { id: 28, text: '다른 사람들이 내가 할 일의 우선순위를 정해주기를 바란다', scale: 'wC' },
  { id: 29, text: '나는 신뢰하는 사람들에게 나의 약점이나 두려움도 공유한다', scale: 'eA' },
  { id: 30, text: '신뢰하는 사람들이 나에게 마음을 열고 깊은 이야기를 해주기를 바란다', scale: 'wA' },
  // Page 6
  { id: 31, text: '나는 주변 사람들에게 먼저 연락한다', scale: 'eI' },
  { id: 32, text: '다른 사람들이 나에게 먼저 연락해 주기를 원한다', scale: 'wI' },
  { id: 33, text: '나는 다른 사람들이 나의 방식을 따르기를 원한다', scale: 'eC' },
  { id: 34, text: '리더가 있어서 내가 그 지시를 따를 수 있기를 원한다', scale: 'wC' },
  { id: 35, text: '나는 관심 있는 사람들에게 먼저 애정 표현을 한다', scale: 'eA' },
  { id: 36, text: '다른 사람들이 나를 아끼고 소중히 여긴다는 것을 느끼고 싶다', scale: 'wA' },
  // Page 7
  { id: 37, text: '나는 사람들과 함께하는 활동을 직접 계획하고 이끈다', scale: 'eI' },
  { id: 38, text: '사람들이 나를 빼놓지 않고 함께하려 해주기를 바란다', scale: 'wI' },
  { id: 39, text: '나는 조직이나 팀에서 책임을 맡는 위치를 선호한다', scale: 'eC' },
  { id: 40, text: '다른 사람들이 나를 체계적으로 관리해 주기를 원한다', scale: 'wC' },
  { id: 41, text: '나는 가까운 사람들과 깊은 감정적 교류를 한다', scale: 'eA' },
  { id: 42, text: '가까운 사람들이 나와의 관계를 특별하게 여겨주기를 바란다', scale: 'wA' },
  // Page 8
  { id: 43, text: '나는 어색한 분위기를 먼저 풀어주려 노력한다', scale: 'eI' },
  { id: 44, text: '다른 사람들이 내 의견과 참여를 환영해 주기를 원한다', scale: 'wI' },
  { id: 45, text: '나는 계획을 세우고 사람들을 이끄는 것을 즐긴다', scale: 'eC' },
  { id: 46, text: '업무에서 내가 해야 할 역할이 명확히 주어지기를 바란다', scale: 'wC' },
  { id: 47, text: '나는 사람들과의 관계에서 따뜻함을 중요시하고 이를 표현한다', scale: 'eA' },
  { id: 48, text: '누군가가 나에게 진심 어린 관심과 사랑을 보여주기를 원한다', scale: 'wA' },
  // Page 9
  { id: 49, text: '나는 사람이 많은 모임에서도 편안하게 어울린다', scale: 'eI' },
  { id: 50, text: '모임에서 내가 중심 멤버로 여겨지기를 원한다', scale: 'wI' },
  { id: 51, text: '나는 의사결정 과정에서 주도적인 역할을 한다', scale: 'eC' },
  { id: 52, text: '나보다 경험 많은 사람이 나를 이끌어 주기를 원한다', scale: 'wC' },
  { id: 53, text: '나는 가까운 관계에서 친밀감을 쌓는 것을 즐긴다', scale: 'eA' },
  { id: 54, text: '다른 사람들이 나와 깊은 감정적 연결을 원해주기를 바란다', scale: 'wA' },
];

export const QUESTIONS_PER_PAGE = 6;
export const TOTAL_PAGES = 9;

export const SCALE_LABELS: Record<string, string> = {
  eI: '포용 표현',
  wI: '포용 수용',
  eC: '통제 표현',
  wC: '통제 수용',
  eA: '애정 표현',
  wA: '애정 수용',
};

export const SCALE_COLORS: Record<string, string> = {
  eI: '#43D39E',
  wI: '#45B7D1',
  eC: '#FF6B6B',
  wC: '#FF9F43',
  eA: '#DDA0FF',
  wA: '#FF6B9D',
};

export const RESPONSE_LABELS = [
  '전혀\n아니다',
  '아니다',
  '약간\n그렇다',
  '그렇다',
  '매우\n그렇다',
  '항상\n그렇다',
];
