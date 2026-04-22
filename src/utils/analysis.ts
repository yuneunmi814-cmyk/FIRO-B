import type { Answers, FIROBScores, DimensionResult, ConflictStyleResult, IdealPartnerResult } from '../types';
import { questions } from '../data/questions';

export function calculateScores(answers: Answers): FIROBScores {
  const scales = ['eI', 'wI', 'eC', 'wC', 'eA', 'wA'] as const;
  const scores = {} as FIROBScores;
  for (const scale of scales) {
    const qs = questions.filter(q => q.scale === scale);
    const sum = qs.reduce((acc, q) => acc + (answers[q.id] ?? 1), 0);
    // sum range 9–54 → normalize to 0–9
    scores[scale] = Math.round(((sum - 9) / 45) * 9 * 10) / 10;
  }
  return scores;
}

export function getScoreLabel(score: number): string {
  if (score < 2) return '매우 낮음';
  if (score < 4) return '낮음';
  if (score < 6) return '보통';
  if (score < 8) return '높음';
  return '매우 높음';
}

export function getInclusionAnalysis(eI: number, wI: number): DimensionResult {
  const hE = eI >= 5, hW = wI >= 5;
  if (hE && hW) return {
    type: '사교적 교류형',
    description: '활발하게 사람들과 어울리고 자신도 인정받기를 원합니다. 넓은 사회적 네트워크를 중요시하며 혼자 있는 것이 다소 불편할 수 있습니다.',
    partnerNeed: '파트너도 활동적이고 사교적이어야 하며, 함께하는 사회 활동에 적극적이어야 합니다.',
  };
  if (hE && !hW) return {
    type: '능동적 사교형',
    description: '먼저 다가가고 사람들을 이끌지만 반드시 인정을 필요로 하지는 않습니다. 독립적이면서도 사교적인 균형을 지닙니다.',
    partnerNeed: '파트너가 당신의 사교성을 지지해주되, 독립적인 공간도 존중해야 합니다.',
  };
  if (!hE && hW) return {
    type: '수동적 사교형',
    description: '관계에 포함되고 싶지만 먼저 나서기 어렵습니다. 상대가 먼저 다가와 주기를 기대하며, 거절에 민감할 수 있습니다.',
    partnerNeed: '파트너가 적극적으로 당신을 활동에 포함시키고 먼저 연락하는 사람이어야 합니다.',
  };
  return {
    type: '자기충족형',
    description: '혼자 있는 것을 편안하게 여기며 광범위한 사교 활동을 필요로 하지 않습니다. 깊이 있는 소수 관계를 선호합니다.',
    partnerNeed: '파트너도 독립적이고 넓은 사회적 활동보다는 깊은 둘만의 관계를 중시해야 합니다.',
  };
}

export function getControlAnalysis(eC: number, wC: number): DimensionResult {
  const hE = eC >= 5, hW = wC >= 5;
  if (hE && !hW) return {
    type: '주도적 리더형',
    description: '상황을 통제하고 주도권을 갖는 것을 선호하며 지시받는 것을 불편해합니다. 자신감 있고 결단력이 강합니다.',
    partnerNeed: '파트너가 당신의 리더십을 인정하고 따를 수 있어야 합니다. 지나치게 주도적인 파트너와는 갈등이 생길 수 있습니다.',
  };
  if (hE && hW) return {
    type: '협력적 리더형',
    description: '스스로 이끌면서도 명확한 지침과 협력을 원합니다. 민주적 리더십을 발휘하며 다양한 의견을 수용합니다.',
    partnerNeed: '파트너와 역할 분담을 유연하게 할 수 있어야 합니다. 서로 번갈아 이끄는 관계가 이상적입니다.',
  };
  if (!hE && hW) return {
    type: '팔로워형',
    description: '명확한 방향을 제시받아 따르는 것을 편안하게 여깁니다. 책임을 맡기보다 지원하는 역할에서 능력을 발휘합니다.',
    partnerNeed: '파트너가 결정을 주도하고 방향을 제시해 줄 수 있어야 합니다. 우유부단한 파트너는 답답할 수 있습니다.',
  };
  return {
    type: '자율형',
    description: '통제하거나 통제받기보다 자유롭게 행동하는 것을 선호합니다. 민주적이며 강압적인 상황을 피하려 합니다.',
    partnerNeed: '서로의 자율성을 존중하는 파트너가 필요합니다. 지나치게 통제적인 파트너와는 맞지 않습니다.',
  };
}

export function getAffectionAnalysis(eA: number, wA: number): DimensionResult {
  const hE = eA >= 5, hW = wA >= 5;
  if (hE && hW) return {
    type: '정서적 개방형',
    description: '깊은 감정 교류와 친밀감을 즐깁니다. 감정을 솔직하게 표현하고 상대방도 그렇게 해주기를 원합니다.',
    partnerNeed: '감정 표현이 풍부하고 친밀감을 중시하는 파트너가 이상적입니다.',
  };
  if (hE && !hW) return {
    type: '표현적 독립형',
    description: '감정을 표현하는 데 적극적이지만 상대방의 감정 표현을 많이 받는 것엔 신중합니다. 따뜻하지만 독립적입니다.',
    partnerNeed: '당신의 애정 표현을 잘 받아주되, 과도하게 의존하지 않는 파트너가 맞습니다.',
  };
  if (!hE && hW) return {
    type: '내성적 기대형',
    description: '감정적 친밀함을 원하지만 먼저 표현하기 어렵습니다. 상대방이 먼저 다가와주기를 기다리는 경향이 있습니다.',
    partnerNeed: '먼저 따뜻함과 애정을 표현해 주는 적극적인 파트너가 당신의 마음을 열어줄 것입니다.',
  };
  return {
    type: '감정적 독립형',
    description: '형식적인 관계를 선호하며 깊은 감정 공유에 신중합니다. 친밀감보다는 존중과 안정감을 중시합니다.',
    partnerNeed: '감정 표현을 강요하지 않고 당신의 페이스를 존중하는 파트너가 필요합니다.',
  };
}

export function getConflictStyle(scores: FIROBScores): ConflictStyleResult {
  const { eI, eC, wC, eA } = scores;
  const assertiveness = eC;
  const cooperativeness = (eA + eI) / 2;

  if (assertiveness >= 6.5 && cooperativeness < 5) return {
    style: '경쟁형', icon: '🦁',
    description: '갈등 상황에서 자신의 입장을 강하게 주장하고 목표를 달성하려 합니다. 빠른 결정과 행동력이 장점이지만, 상대방의 감정을 간과할 수 있습니다.',
    strengths: ['빠른 의사결정', '명확한 의사 표현', '목표 지향적'],
    weaknesses: ['상대방 의견 경청 부족', '관계 손상 가능성', '융통성 부족'],
    tips: [
      '상대방의 말을 끝까지 듣는 연습을 하세요',
      '"내가 이기야 한다"는 마음 대신 "우리가 함께 해결하자"로 접근해 보세요',
      '승패보다 장기적인 관계를 우선시해 보세요',
    ],
    relationshipAdvice: '파트너와 갈등 시 "이겨야 한다"는 마음을 내려놓고, 두 사람 모두에게 좋은 해결책을 찾으려 노력해 보세요.',
  };

  if (assertiveness >= 5 && cooperativeness >= 6) return {
    style: '협력형', icon: '🤝',
    description: '모두가 만족하는 해결책을 찾으려 노력합니다. 시간이 걸리더라도 서로의 요구를 모두 충족시키는 방향을 추구합니다.',
    strengths: ['상호 이해 증진', '창의적 해결책 발굴', '관계 강화'],
    weaknesses: ['시간과 에너지 소모', '긴급 상황에서 비효율적', '과정이 복잡할 수 있음'],
    tips: [
      '모든 갈등에서 완벽한 해결책을 찾으려 하지 말고, 때로는 빠른 결정도 필요합니다',
      '파트너의 의견도 소중하지만 자신의 핵심 요구를 명확히 전달하세요',
      '협력의 에너지가 소진될 때는 잠시 휴식을 취하세요',
    ],
    relationshipAdvice: '당신의 협력적 성향은 큰 장점입니다. 파트너에게도 이 접근법을 자연스럽게 가르쳐 줄 수 있습니다.',
  };

  if (wC >= 6 && eC < 4) return {
    style: '수용형', icon: '🕊️',
    description: '관계의 조화를 위해 자신의 입장을 양보하는 경향이 있습니다. 갈등을 피하고 상대방의 요구를 우선시합니다.',
    strengths: ['관계 유지 능력', '유연성', '팀 화합 도모'],
    weaknesses: ['자신의 욕구 억압', '장기적 불만 누적', '존중받지 못할 위험'],
    tips: [
      '자신의 필요와 감정도 중요합니다. "나도 ~이 필요해"라고 표현하세요',
      '작은 것부터 자신의 의견을 내는 연습을 해보세요',
      '양보가 아닌 진정한 협의를 통해 문제를 해결해 보세요',
    ],
    relationshipAdvice: '파트너를 위한 희생도 중요하지만, 당신 자신의 행복도 관계에서 필수적입니다. 자신의 필요를 표현하는 것이 이기적인 것이 아님을 기억하세요.',
  };

  if (eI < 4 && eC < 4) return {
    style: '회피형', icon: '🐢',
    description: '갈등 상황을 직면하기보다 피하거나 시간을 두려는 경향이 있습니다. 감정이 진정된 후 해결하려 합니다.',
    strengths: ['충동적 반응 방지', '침착한 태도', '시간을 두고 성찰'],
    weaknesses: ['문제 해결 지연', '상대방에게 무관심하게 보일 수 있음', '갈등이 누적될 수 있음'],
    tips: [
      '갈등을 피하는 것이 문제를 해결하지 않습니다. 용기를 내어 대화를 시작해 보세요',
      '"지금은 이야기하기 어렵지만, 나중에 꼭 이야기하자"고 파트너에게 알려주세요',
      '감정이 진정되면 그 감정을 어떻게 표현할지 미리 생각해두세요',
    ],
    relationshipAdvice: '회피는 일시적 안도를 주지만 장기적으로 관계에 상처를 남깁니다. 파트너와 안전한 대화 공간을 함께 만들어 보세요.',
  };

  return {
    style: '타협형', icon: '⚖️',
    description: '서로 조금씩 양보하여 중간 지점을 찾으려 합니다. 빠르고 실용적인 해결책을 선호하며 관계와 목표 사이에서 균형을 맞춥니다.',
    strengths: ['빠른 해결', '공정한 접근', '유연성'],
    weaknesses: ['최선이 아닌 차선으로 끝날 수 있음', '핵심 욕구가 충족되지 않을 수 있음', '반복적 양보로 인한 피로'],
    tips: [
      '타협 전에 당신이 절대 양보할 수 없는 것을 먼저 정하세요',
      '파트너의 핵심 요구도 확인하여 진정한 협의를 이루세요',
      '중요한 문제에서는 협력형을 시도해 더 만족스러운 결과를 얻어보세요',
    ],
    relationshipAdvice: '타협은 건강한 관계의 기반이지만, 항상 "중간"이 최선은 아닙니다. 중요한 문제에서는 두 사람 모두를 완전히 만족시키는 해결책을 찾아보세요.',
  };
}

export function getIdealPartner(scores: FIROBScores): IdealPartnerResult {
  const { eI, wI, eC, wC, eA, wA } = scores;

  const profile: FIROBScores = {
    eI: Math.min(9, Math.round(wI * 10) / 10),
    wI: Math.min(9, Math.round(eI * 10) / 10),
    eC: Math.min(9, Math.round(wC * 10) / 10),
    wC: Math.min(9, Math.round(eC * 10) / 10),
    eA: Math.min(9, Math.round(wA * 10) / 10),
    wA: Math.min(9, Math.round(eA * 10) / 10),
  };

  const traits: string[] = [];
  if (wI >= 6) traits.push('먼저 연락하고 적극적으로 함께하는 활동에 참여하는 사람');
  else if (wI <= 3) traits.push('독립적이고 당신만의 공간과 시간을 존중하는 사람');
  else traits.push('사교적이면서도 당신의 개인 공간을 이해하는 균형 잡힌 사람');

  if (wC >= 6) traits.push('결단력 있게 방향을 제시하고 자신감 있게 이끌어주는 사람');
  else if (wC <= 3) traits.push('당신의 주도권을 존중하고 잘 따라주는 사람');
  else traits.push('상황에 따라 이끌거나 따르는 역할을 유연하게 전환하는 사람');

  if (wA >= 6) traits.push('감정 표현이 풍부하고 먼저 따뜻함과 애정을 전달하는 사람');
  else if (wA <= 3) traits.push('과도한 감정 표현보다 행동으로 사랑을 보여주는 사람');
  else traits.push('적절한 감정 표현으로 관계에 따뜻함을 더해주는 사람');

  const cautions: string[] = [];
  if (eC >= 7) cautions.push('지나치게 통제적이거나 지배적인 성향이 강한 사람');
  if (eI <= 2) cautions.push('당신을 활동에서 자주 배제하거나 연락이 없는 사람');
  if (eA <= 2 && wA >= 5) cautions.push('감정 표현이 너무 부족하여 당신의 애정 표현에 반응이 없는 사람');
  if (eC >= 7 && wC >= 7) cautions.push('권위적이며 모든 것을 자신의 방식대로 하려는 사람');
  if (cautions.length === 0) cautions.push('상대방을 극단적으로 무시하거나 관계에 무관심한 사람');

  // Narrative
  const parts: string[] = [];
  if (wI >= 6) parts.push('당신은 파트너가 당신을 적극적으로 삶에 포함시켜 주기를 원합니다');
  else if (wI <= 3) parts.push('당신은 파트너와 함께이되 각자의 독립된 공간을 중요하게 여깁니다');
  else parts.push('당신은 파트너와 적절한 교류를 유지하면서 서로의 공간도 존중합니다');

  if (wC >= 6) parts.push('결정을 내려주고 이끌어주는 파트너에게서 안정감을 느낍니다');
  else if (wC <= 3) parts.push('스스로 결정하고 파트너도 그 결정을 존중해 주기를 원합니다');
  else parts.push('중요한 결정은 함께 상의하며 파트너십을 이루기를 원합니다');

  if (wA >= 6) parts.push('따뜻한 말과 행동으로 사랑을 표현해 주는 파트너를 필요로 합니다');
  else if (wA <= 3) parts.push('과도한 감정 표현보다는 신뢰와 안정을 바탕으로 한 관계를 선호합니다');
  else parts.push('적절한 감정 표현과 함께 서로를 존중하는 관계를 원합니다');

  return { profile, narrative: parts.join('. ') + '.', traits, cautions };
}

// ── Score level helpers ──

export function getScoreLevel(score: number): { en: string; ko: string; color: string } {
  if (score <= 2) return { en: 'Low',          ko: '낮음', color: '#6B7280' };
  if (score <= 5) return { en: 'Medium',        ko: '중간', color: '#3B82F6' };
  if (score <= 7) return { en: 'Medium-High',   ko: '중상', color: '#8B5CF6' };
  return              { en: 'High',          ko: '높음', color: '#EF4444' };
}

export function getDimLevel(total: number): { en: string; ko: string } {
  if (total <= 5)  return { en: 'Low',         ko: '낮음' };
  if (total <= 10) return { en: 'Medium',       ko: '중간' };
  if (total <= 14) return { en: 'Medium-High',  ko: '중상' };
  return                  { en: 'High',         ko: '높음' };
}

export function getGrandTotalLabel(total: number): string {
  if (total <= 17) return 'Low';
  if (total <= 31) return 'Medium';
  if (total <= 44) return 'Medium-High (M-H)';
  return 'High';
}

// ── Dimension totals ──

export interface DimTotals {
  inclusion: number;
  control: number;
  affection: number;
  expressed: number;
  wanted: number;
  grand: number;
}

export function getDimTotals(s: FIROBScores): DimTotals {
  return {
    inclusion:  Math.round((s.eI + s.wI) * 10) / 10,
    control:    Math.round((s.eC + s.wC) * 10) / 10,
    affection:  Math.round((s.eA + s.wA) * 10) / 10,
    expressed:  Math.round((s.eI + s.eC + s.eA) * 10) / 10,
    wanted:     Math.round((s.wI + s.wC + s.wA) * 10) / 10,
    grand:      Math.round((s.eI + s.wI + s.eC + s.wC + s.eA + s.wA) * 10) / 10,
  };
}

// ── Organizational roles ──

export interface OrgRole {
  role: string;
  description: string;
}

export function getOrgRoles(s: FIROBScores): OrgRole[] {
  const { eI, wI, eC, wC, eA, wA } = s;
  const roles: OrgRole[] = [];

  if (eC >= 6)              roles.push({ role: 'Director',         description: '행동과 결정을 촉진하고 명확한 방향을 제시' });
  if (eC >= 5 && wC <= 5)   roles.push({ role: 'Clarifier',        description: '이슈와 해결책을 명확히 정리하고 요약' });
  if (eI >= 6 && eC >= 4)   roles.push({ role: 'Initiator',        description: '새로운 아이디어와 활동을 먼저 제안' });
  if (eA >= 6)              roles.push({ role: 'Encourager',       description: '친절하고 수용적인 분위기 형성' });
  if (eA >= 5 && eI >= 5)   roles.push({ role: 'Harmonizer',       description: '갈등을 완화하고 팀 화합 도모' });
  if (eA >= 5)              roles.push({ role: 'Tension-Reducer',  description: '긴장 완화와 분위기 전환' });
  if (wC >= 6)              roles.push({ role: 'Questioner',       description: '설명과 명확성을 요구하여 이해를 높임' });
  if (wI >= 6)              roles.push({ role: 'Gatekeeper',       description: '다른 사람들의 참여를 권장하고 의견을 구함' });
  if (wA >= 6 && eA >= 3)   roles.push({ role: 'Supporter',        description: '팀원들을 지지하고 공감' });
  if (eI <= 3)              roles.push({ role: 'Listener',         description: '조용히 참여하며 목표에 관여' });

  // Ensure at least 3
  if (!roles.find(r => r.role === 'Clarifier'))  roles.push({ role: 'Clarifier',       description: '이슈와 해결책을 명확히 정리하고 요약' });
  if (!roles.find(r => r.role === 'Listener'))   roles.push({ role: 'Listener',        description: '조용히 참여하며 목표에 관여' });
  if (!roles.find(r => r.role === 'Questioner')) roles.push({ role: 'Questioner',      description: '설명과 명확성을 요구하여 이해를 높임' });

  // Deduplicate and limit to 6
  const seen = new Set<string>();
  return roles.filter(r => seen.has(r.role) ? false : (seen.add(r.role), true)).slice(0, 6);
}

// ── Pre-resignation self-reflection ──
//
// Designed as an educational self-check tool, NOT career/psychological advice.
// Every item is framed as a question to sit with or a 1-week self-experiment,
// never as a prescription. All copy stays in "self-reflection" voice to match
// the site-wide non-advisory framing.

export interface QuitReflectionAction {
  icon: string;
  title: string;
  why: string;
}

export interface QuitReflection {
  checklist: string[];
  actions: QuitReflectionAction[];
}

export function getQuitReflection(s: FIROBScores): QuitReflection {
  const { eI, wI, eC, wC, eA, wA } = s;
  const affGap = wA - eA;
  const ctrlGap = wC - eC;
  const incGap  = wI - eI;

  // ── Checklist: universal + personalized reflection questions ──
  const checklist: string[] = [
    '지금의 피로가 "업무 자체"에서 오는 건지, "관계"에서 오는 건지 구분해 본 적 있나요?',
    '최근 2주간 팀에서 잠깐이라도 "오늘 괜찮았다"고 느낀 순간이 있었나요?',
  ];

  if (incGap >= 2)
    checklist.push('팀이 나를 충분히 포함시켜 주고 있다고 느끼나요? (기대하는 만큼 먼저 다가가지는 않았지만, 마음속에서는 참여하고 싶었던 순간이 있지 않았나요?)');
  else if (eI - wI >= 2)
    checklist.push('내가 주도해서 팀에 합류시키고 있는 사람들이, 사실은 나를 다시 찾아주지 않고 있다는 느낌을 받고 있지 않나요?');

  if (ctrlGap >= 2)
    checklist.push('지금 팀에 내가 따를 만한 명확한 방향을 주는 리더/선배가 있나요? 없다면 그 공백이 지금의 피로감에 얼마나 기여하고 있을까요?');
  else if (eC - wC >= 2)
    checklist.push('주도권을 많이 쥐고 있는데, 사실 기대거나 위임할 수 있는 사람이 팀 안에 있나요? 혼자 다 짊어지고 있는 건 아닌가요?');

  if (affGap >= 2)
    checklist.push('동료에게 바라는 따뜻함의 기준이 지금 환경에서 충족될 수 있는 수준인가요? (현실적으로 이 회사에서 그걸 얻을 수 있는지, 아니면 기대 자체가 어긋나 있는지)');
  else if (eA <= 3 && wA <= 3)
    checklist.push('"사람"이 아니라 "역할"로만 동료를 대하고 있어서, 일의 의미도 함께 옅어진 건 아닌지 생각해 본 적 있나요?');

  checklist.push('퇴사 후 가고 싶은 그 다음 환경에, 지금 내가 지쳐 있는 바로 그 관계 패턴이 똑같이 반복될 가능성은 없나요?');
  checklist.push('이 결정을 "지금 이 순간의 피로" 밖에서도 같은 답으로 내릴 수 있는지, 하루만 미뤄두고 다시 봐도 괜찮은 결정인가요?');

  // ── This week's self-experiments: 3 personalized small actions ──
  const pool: QuitReflectionAction[] = [];

  if (incGap >= 2) {
    pool.push({
      icon: '💬',
      title: '이번 주 중 한 번, 편해 보이는 동료 한 명에게 먼저 "점심 같이 드실래요?" 메시지 보내기',
      why: '기대(wI)는 높은데 먼저 다가가지 않으면 고립감만 쌓입니다. 먼저 한 걸음 내딛었을 때 환경이 실제로 차가운 건지, 내가 기다리고만 있었던 건지 확인할 수 있는 작은 실험입니다.',
    });
  } else if (eI - wI >= 2) {
    pool.push({
      icon: '🛋️',
      title: '이번 주 하루는 "내가 먼저 연락하지 않기" 실험 — 주도적으로 모이게 하던 걸 하루만 멈춰보기',
      why: '먼저 움직이는 쪽이 늘 나라면, 그 에너지 자체가 피로의 큰 원인일 수 있습니다. 한 번 멈춰봐야 팀이 어떻게 움직이는지, 관계가 실제로 쌍방향인지 보입니다.',
    });
  }

  if (ctrlGap >= 2) {
    pool.push({
      icon: '🧭',
      title: '이번 주, 내가 맡은 업무 중 "이건 내가 선택한다"고 정할 수 있는 작은 구간 1개 고르기',
      why: '모든 방향이 위에서 내려오기를 기대하면 번아웃이 빠르게 옵니다. 아주 작은 선택권 하나라도 스스로 만들면 무력감의 일부가 풀립니다.',
    });
  } else if (eC - wC >= 2) {
    pool.push({
      icon: '🤝',
      title: '이번 주, 평소 같으면 내가 처리했을 결정 하나를 일부러 동료에게 넘겨보기',
      why: '주도권을 항상 쥐고 있으면 책임과 피로가 동시에 쌓입니다. 잠깐 내려놓았을 때 팀이 어떻게 반응하는지 새로 관찰해 볼 수 있는 실험입니다.',
    });
  }

  if (affGap >= 2 || (wA >= 6 && eA <= 4)) {
    pool.push({
      icon: '📩',
      title: '이번 주 하루, 업무 메시지 끝에 한 문장 — "덕분에 도움이 됐어요" 같은 짧은 감사 한 줄 붙이기',
      why: '따뜻함을 기대(wA)하는 마음이 큰데 먼저 표현하지 않으면, 환경이 실제로 차가워지기 쉽습니다. 먼저 작은 온기를 보내면 돌아오는 반응으로 환경을 다시 판단할 수 있습니다.',
    });
  } else if (eA <= 3 && wA <= 3) {
    pool.push({
      icon: '🫖',
      title: '이번 주, 동료 한 명과 업무 외 주제로 3분만 대화 나눠보기 (날씨·커피·주말 얘기도 OK)',
      why: '역할로만 관계를 맺으면 일의 의미가 빠르게 마릅니다. 작은 인간적 접점 하나만 만들어도 같은 환경이 다르게 보일 수 있습니다.',
    });
  }

  // Universal actions if pool is short
  pool.push({
    icon: '📔',
    title: '퇴사 결심이 드는 날마다, 오늘 하루 "관계로 힘들었던 순간"과 "업무 자체로 힘들었던 순간"을 한 줄씩 따로 적어보기',
    why: '두 가지를 구분해서 기록하면, 퇴사해도 따라올 패턴과 환경을 바꾸면 풀릴 문제가 선명하게 갈라집니다.',
  });
  pool.push({
    icon: '🕰️',
    title: '퇴사 결정을 내리기 전에, "일요일 밤"과 "목요일 낮" 두 시간대에 각각 같은 질문을 던져보기 — 답이 달라지는지 확인하기',
    why: '피로가 가장 높은 순간의 결정과, 비교적 맑은 순간의 결정이 다르다면, 지금 필요한 건 퇴사보다 짧은 회복일 수도 있습니다.',
  });
  pool.push({
    icon: '☕',
    title: '이번 주 하루, 점심시간을 완전히 혼자 쓰고 아무에게도 연락하지 않는 "관계 디톡스" 한 번 만들기',
    why: '관계 피로는 연결을 늘려서가 아니라 잠깐 끊었다가 다시 잇는 것에서 회복됩니다. 이게 효과가 있는지 여부 자체가 지금 나에게 필요한 게 뭔지 알려줍니다.',
  });

  return { checklist, actions: pool.slice(0, 3) };
}

// ── Detailed interpretation ──
//
// A structured, counselor-tone deep dive into the user's pattern.
// Each paragraph has an emoji-badged title so the reader can scan, and a
// long body that combines FIRO score patterns with concrete everyday scenes,
// recurring relationship loops, comfort/fatigue triggers, conflict responses,
// how others perceive them, and the "self-trap" that quietly drains them.
//
// Content is descriptive, not prescriptive — framed as self-observation to
// preserve the educational, non-advisory posture described in the site-wide
// disclaimers.

export interface InterpretationParagraph {
  title: string;
  body: string;
}

type Pattern = 'high' | 'low';

function p(v: number): Pattern { return v >= 5 ? 'high' : 'low'; }

function incLabel(eP: Pattern, wP: Pattern): string {
  if (eP === 'high' && wP === 'high') return '관계 중심형';
  if (eP === 'high' && wP === 'low')  return '독립 사교형';
  if (eP === 'low'  && wP === 'high') return '조용히 기다리는 참여자';
  return '자기충족형';
}
function ctrlLabel(eP: Pattern, wP: Pattern): string {
  if (eP === 'high' && wP === 'high') return '협력 리더형';
  if (eP === 'high' && wP === 'low')  return '단독 주도형';
  if (eP === 'low'  && wP === 'high') return '길잡이를 찾는 팔로워';
  return '수평·자율형';
}
function affLabel(eP: Pattern, wP: Pattern): string {
  if (eP === 'high' && wP === 'high') return '따뜻한 교류형';
  if (eP === 'high' && wP === 'low')  return '베풂의 애정형';
  if (eP === 'low'  && wP === 'high') return '속으로 기다리는 애정형';
  return '정서 독립형';
}

export function getDetailedInterpretation(s: FIROBScores): InterpretationParagraph[] {
  const { eI, wI, eC, wC, eA, wA } = s;
  const iE = p(eI), iW = p(wI);
  const cE = p(eC), cW = p(wC);
  const aE = p(eA), aW = p(wA);

  const iLabel = incLabel(iE, iW);
  const cL     = ctrlLabel(cE, cW);
  const aL     = affLabel(aE, aW);

  const incGap  = wI - eI;
  const ctrlGap = wC - eC;
  const affGap  = wA - eA;
  const gaps    = [
    { name: '소속', value: Math.abs(incGap),  signed: incGap  },
    { name: '통제', value: Math.abs(ctrlGap), signed: ctrlGap },
    { name: '애정', value: Math.abs(affGap),  signed: affGap  },
  ];
  const dominantGap = gaps.slice().sort((a, b) => b.value - a.value)[0];

  const paras: InterpretationParagraph[] = [];

  // ── Block 1 — 한 줄 프로필 ──
  {
    const pieces: string[] = [];
    pieces.push(`당신은 한 마디로 "**${iLabel}**이면서 **${cL}**이고, **${aL}**"인 사람입니다.`);

    // Combined metaphor based on the dominant tension
    if (iE === 'low' && iW === 'high' && aE === 'low' && aW === 'high') {
      pieces.push('사람이 필요 없어서 혼자인 게 아닙니다. 먼저 다가가는 방법을 몰라서 외로운 쪽이에요. 단체 카톡방을 소리 없이 읽어내려가면서도 "누가 내 이름을 불러주지 않을까" 속으로 기다려본 적 있다면, 그 장면이 지금 당신의 가장 솔직한 마음입니다.');
    } else if (iE === 'high' && iW === 'low' && cE === 'high' && cW === 'low') {
      pieces.push('겉으로는 "사람 좋아하고 리드 잘하는 사람"으로 보이지만, 속은 의외로 독립적이고 간섭받는 걸 가장 싫어하는 유형입니다. 주도권을 쥐어야 마음이 놓이고, 반대로 누가 당신의 페이스를 바꾸려 들면 숨이 턱 막히죠.');
    } else if (iE === 'high' && iW === 'high' && aE === 'high' && aW === 'high') {
      pieces.push('관계 속에서 에너지를 얻고, 관계가 흐릿해지면 존재감까지 희미해지는 유형입니다. "나는 사람이 좋아"가 단순한 취향이 아니라 삶을 지탱하는 축이에요. 다만 그만큼 관계가 어긋날 때 무너지는 낙차도 큽니다.');
    } else if (iE === 'low' && iW === 'low' && cE === 'low' && cW === 'low' && aE === 'low' && aW === 'low') {
      pieces.push('당신은 "혼자가 기본값"인 사람입니다. 관계가 부담이 아니라 선택이길 원하고, 자율과 거리감 속에서 가장 생산적이고 편안하죠. 번아웃의 주된 원인도 대개 "에너지를 쓸 가치가 없는 관계에 억지로 묶일 때"입니다.');
    } else if (cE === 'low' && cW === 'high') {
      pieces.push('스스로 결정하는 것보다 "믿을 만한 누군가가 방향을 잡아주는 상황"에서 가장 안정감을 느끼는 유형입니다. 혼자 모든 걸 짊어지는 포지션에 있으면 금방 탈진하고, 좋은 리더 밑에서는 놀라울 만큼 성실해집니다.');
    } else {
      pieces.push('세 영역의 욕구가 어느 쪽으로도 극단적이지 않아, 상황에 따라 다른 모드로 전환할 수 있는 유연함을 가지고 있습니다. 다만 그 유연함 때문에 "나는 도대체 뭐가 편한 거지?"라는 정체성 질문이 주기적으로 찾아오는 편이에요.');
    }
    paras.push({ title: '✨ 한 줄 프로필 — 당신은 이런 사람입니다', body: pieces.join(' ') });
  }

  // ── Block 2 — 일상에서 자주 보이는 모습 ──
  {
    const scenes: string[] = [];

    // Workplace morning
    if (iE === 'high') scenes.push('출근길에 엘리베이터에서 동료를 마주치면 먼저 "좋은 아침이에요" 건네는 쪽이에요.');
    else               scenes.push('출근길에 엘리베이터에서 동료를 마주치면 가볍게 목례만 하고 휴대폰을 한 번 더 들여다봅니다.');

    // Meetings (inclusion + control)
    if (iE === 'high' && cE === 'high') {
      scenes.push('회의 시작 10분 안에 어떤 식으로든 한 번은 발언을 하고, 정적이 길어지면 참지 못하고 먼저 "그럼 이렇게 가볼까요?"를 꺼내는 사람이죠.');
    } else if (iE === 'low' && cE === 'low') {
      scenes.push('회의에서는 대부분 듣는 쪽이고, 꼭 필요한 순간에만 짧고 정확하게 의견을 냅니다. 길게 말하는 동료를 보면 "저걸 왜 저렇게 끌지?" 싶지만 굳이 끊진 않아요.');
    } else if (cE === 'low' && cW === 'high') {
      scenes.push('회의에서 방향을 잡아주는 사람이 없으면 속이 답답해집니다. "그래서 뭘 하자는 거지?"라는 질문이 머릿속에 5분 간격으로 떠오르고, 결정이 미뤄지면 피로감이 급격히 올라가요.');
    } else {
      scenes.push('회의에서는 흐름을 보다가 결정적인 지점에서 한두 마디로 정리하는 타입입니다. 목소리를 자주 내진 않지만, 말을 꺼내면 무게가 실려요.');
    }

    // Lunch / social
    if (iE === 'low' && iW === 'high') {
      scenes.push('점심시간엔 먼저 "같이 드실래요?"를 꺼내긴 어렵지만, 누가 불러주면 내심 반갑습니다. 혼자 먹는 날이 이어지면 속으로는 "왜 아무도 안 부르지"라는 말이 하루에도 몇 번씩 스칩니다.');
    } else if (iE === 'high' && iW === 'low') {
      scenes.push('점심은 가끔 혼자 보내는 걸 오히려 선호합니다. 사람들이 좋지만, 에너지 회복을 위해서는 혼자만의 시간이 필요해요. "오늘은 혼밥하고 싶다"고 솔직히 말하는 것도 어려워하진 않고요.');
    } else if (iE === 'high' && iW === 'high') {
      scenes.push('점심은 누구와 먹을지 이미 머릿속에 두세 명 후보가 있고, 혼자 먹는 날이 이틀 연속 이어지면 "요즘 내가 왜 이렇게 고립돼 있지?"라는 생각이 올라옵니다.');
    } else {
      scenes.push('점심은 혼자 조용히 보내는 게 자연스럽습니다. 누가 불러주는 것도 좋지만 굳이 매일 어울릴 필요는 느끼지 않아요.');
    }

    // Affection at work
    if (aE === 'low' && aW === 'high') {
      scenes.push('퇴근 후 메신저에는 업무 얘기만 남아 있는 날이 많죠. 누가 "오늘 고생 많았어요" 한 마디만 건네줘도 그날 기분이 완전히 달라지는 걸 자신도 알고 있고, 그만큼 그런 말이 드물 때의 공허함도 큽니다.');
    } else if (aE === 'high' && aW === 'low') {
      scenes.push('동료가 지쳐 보이면 당신도 모르게 커피 한 잔을 사다 놓는 사람이에요. 다만 받는 쪽은 어색해서, 누가 당신을 챙겨주면 "괜찮아요 저는" 하고 한 발 물러섭니다.');
    } else if (aE === 'high' && aW === 'high') {
      scenes.push('동료의 표정을 가장 먼저 읽는 쪽이에요. 누가 힘들어하면 먼저 말을 걸고, 반대로 자신이 힘들 땐 말하지 않아도 알아봐 주는 사람이 있길 바랍니다.');
    } else {
      scenes.push('직장에서는 감정 교류보다 "역할과 성과" 중심으로 관계를 맺는 편입니다. 깊은 친밀감을 강요받는 분위기는 오히려 부담스럽고, 적당한 거리가 가장 편해요.');
    }
    paras.push({ title: '☕ 일상에서 자주 보이는 당신의 모습', body: scenes.join(' ') });
  }

  // ── Block 3 — 반복되는 관계 루프 (focus on dominant gap) ──
  {
    let body = '';
    if (dominantGap.name === '소속' && dominantGap.signed >= 2) {
      body = `당신의 관계에서 가장 자주 반복되는 장면은 이거예요: **"나도 그 자리 끼고 싶었는데, 말 안 한 내 탓이지 뭐."** 원하는 건 분명히 있는데, 그걸 말로 꺼내본 적은 많지 않습니다. 주변 사람들 눈에는 당신이 "알아서 잘 지내는 무심한 사람"으로 보이고, 당신은 속으로 "왜 아무도 안 불러?"라고 되뇌는 — 서로 전혀 다른 이야기를 혼자 읽고 있는 루프가 계속 돕니다. 이 간극이 쌓이면 "나는 이 그룹에서 있어도 그만, 없어도 그만인 사람"이라는 생각으로 번지고, 결국 자신이 먼저 관계를 정리하는 결정을 내리죠.`;
    } else if (dominantGap.name === '소속' && dominantGap.signed <= -2) {
      body = `당신은 먼저 사람들을 모으고, 자리를 만들고, 연락을 돌리는 쪽입니다. 문제는 그렇게 만든 관계의 반응이 당신만큼 돌아오지 않을 때입니다. "나만 신경 쓰는 건가?"라는 생각이 한두 번 들기 시작하면, 당신은 갑자기 연락을 끊어버리는 쪽으로 가곤 해요. 밖에서 보면 "주도적이고 사교적인 사람이 왜 갑자기 잠수를 타지?" 싶은 패턴이지만, 당신 안에서는 이미 "더 이상 에너지 쓸 가치가 없다"는 결론이 조용히 내려진 뒤입니다.`;
    } else if (dominantGap.name === '통제' && dominantGap.signed >= 2) {
      body = `당신이 자주 반복하는 장면은 이거예요: **명확한 방향을 제시해줄 사람이 없는 자리에서 혼자 피곤해지는 것.** 스스로 주도하는 건 체질에 맞지 않고, 그렇다고 누군가 무작정 지시만 내리는 것도 싫어합니다. 당신이 가장 살아나는 순간은 "믿을 만한 사람이 큰 방향을 주고, 그 안에서 내가 성실하게 일할 때"예요. 리더십 공백이 오면 하루하루 의욕이 바닥을 칩니다. "이 회사 너무 체계 없어" → "내가 왜 이걸 다 떠안아야 하지" → "퇴사하고 싶다"의 루프가 익숙할 수 있어요.`;
    } else if (dominantGap.name === '통제' && dominantGap.signed <= -2) {
      body = `당신의 반복 패턴은 "주도권을 놓으면 불안하고, 쥐고 있으면 지친다"는 모순입니다. 무언가 결정돼야 할 상황이면 자기도 모르게 먼저 나서서 정리하는데, 사실 마음 깊은 곳에선 "누가 이걸 좀 대신 해줬으면" 싶어해요. 팀에 당신만큼 방향을 잡는 사람이 없다는 걸 확인할 때마다 책임감이 무겁게 내려앉고, 집에 와서 "나는 왜 항상 내가 총대를 메야 하지?"라는 피로가 쌓이죠.`;
    } else if (dominantGap.name === '애정' && dominantGap.signed >= 2) {
      body = `당신의 관계에서 반복되는 루프는 **"나는 받고 싶은데, 먼저 표현하진 못하는 쪽"**이라는 점입니다. 상대방이 먼저 따뜻한 말을 건네주기를 속으로 기다리지만, 그 기다림을 상대가 알아채기는 어렵죠. 그래서 관계가 점점 사무적으로 변해가고, 당신은 "이 사람은 나한테 관심이 없구나"라는 결론을 혼자 내립니다. 사실은 상대가 당신에게 무관심한 게 아니라, 당신이 무표정으로 선 긋고 있다는 신호를 계속 보내고 있던 것이기도 해요.`;
    } else if (dominantGap.name === '애정' && dominantGap.signed <= -2) {
      body = `당신은 먼저 따뜻함을 주는 쪽이지만, 받는 건 의외로 어색합니다. 누가 당신을 깊이 챙기려 하면 "저는 괜찮아요" 하며 반사적으로 한 발 뒤로 물러서죠. 그래서 주변에는 "베풀어주는 좋은 사람"은 많은데, 정작 당신이 무너졌을 때 기댈 만한 관계는 적습니다. 이 구조가 반복되면서 "나는 왜 관계에서 항상 주는 쪽이지?"라는 피로가 천천히 쌓여요.`;
    } else {
      body = `당신의 세 영역은 어느 한쪽으로 극단적으로 기울지 않고, 표출과 기대 사이 간극도 크지 않습니다. 그래서 특정 루프에 갇히기보다는, 상황마다 다른 방식으로 관계가 어긋날 수 있어요. 다만 공통적으로 반복되는 패턴은 — "어느 순간 내가 이 관계에서 너무 많이 조율하고 있다"는 자각이 올 때, 조용히 거리를 두는 방식입니다.`;
    }
    paras.push({ title: '🔁 관계에서 자꾸 반복되는 장면', body });
  }

  // ── Block 4 — 편안함 vs 피로 트리거 ──
  {
    const comfort: string[] = [];
    const fatigue: string[] = [];

    if (iE === 'high' && iW === 'high') {
      comfort.push('좋아하는 사람들과 길게 이야기 나누는 저녁');
      fatigue.push('며칠 연속 혼자 점심 먹는 일상');
    } else if (iE === 'low' && iW === 'low') {
      comfort.push('누구의 방해도 없이 몰입할 수 있는 혼자의 시간');
      fatigue.push('불필요한 단체 모임에 "의무로" 끌려가는 자리');
    } else if (iE === 'low' && iW === 'high') {
      comfort.push('편한 사람이 먼저 불러주는, 부담 없는 작은 모임');
      fatigue.push('내가 먼저 말을 걸어야만 유지되는 관계');
    } else {
      comfort.push('적절한 거리를 지키면서 자주 볼 수 있는 관계');
      fatigue.push('친밀함을 강요받거나 과잉 반응을 요구받는 자리');
    }

    if (cE === 'high' && cW === 'low') {
      comfort.push('내가 방향을 정하고 주도적으로 굴릴 수 있는 프로젝트');
      fatigue.push('세세한 지시와 간섭이 끊임없이 내려오는 구조');
    } else if (cE === 'low' && cW === 'high') {
      comfort.push('명확한 목표와 단단한 리더 아래에서 내 역할을 성실히 해내는 구조');
      fatigue.push('방향이 수시로 바뀌거나 아무도 결정을 안 내리는 환경');
    } else if (cE === 'high' && cW === 'high') {
      comfort.push('서로 의견을 솔직하게 섞으면서 함께 방향을 만드는 협력');
      fatigue.push('아무도 의견을 내지 않는 수동적인 팀');
    } else {
      comfort.push('수평적이고 자율적인 분위기, 강요 없는 합의');
      fatigue.push('권위적인 지시나 의미 없는 위계질서');
    }

    if (aE === 'low' && aW === 'high') {
      comfort.push('먼저 따뜻한 말을 건네오는 상대');
      fatigue.push('아무도 먼저 챙겨주지 않는 사무적인 분위기');
    } else if (aE === 'high' && aW === 'low') {
      comfort.push('내가 편하게 베풀 수 있고, 부담 없는 거리를 지키는 관계');
      fatigue.push('상대가 감정적으로 과도하게 기대오는 상황');
    } else if (aE === 'high' && aW === 'high') {
      comfort.push('깊은 감정 교류가 오가는 소수의 친밀한 관계');
      fatigue.push('속 얘기 한 번 나눌 수 없는 피상적 관계들');
    } else {
      comfort.push('감정 노동 없이 깔끔하게 맺고 끊어지는 관계');
      fatigue.push('억지로 친밀한 척 연기해야 하는 자리');
    }

    const body = `**당신이 살아나는 순간**은 이런 때입니다 — ${comfort.join('; ')}. 반대로 **에너지가 빠르게 소진되는 순간**은 이런 때예요 — ${fatigue.join('; ')}. 지금 퇴사가 자주 떠오른다면, 업무 강도 그 자체보다 이 피로 트리거가 하루 중 몇 번씩 반복되고 있지는 않은지 돌아볼 가치가 있습니다.`;
    paras.push({ title: '🧲 편안함을 느끼는 순간 vs 피로가 쌓이는 순간', body });
  }

  // ── Block 5 — 갈등 상황에서의 대응 패턴 ──
  {
    const body: string[] = [];
    const assertiveness   = eC;
    const cooperativeness = (eA + eI) / 2;

    if (assertiveness >= 6.5 && cooperativeness < 5) {
      body.push('갈등이 오면 당신은 먼저 **논리와 팩트로 상대를 설득하려** 듭니다. 목소리가 커지기 전에 논점을 정리하고, 빠르게 결론을 내려 상황을 종결시키려 해요.');
      body.push('다만 급한 마음에 상대의 감정을 건너뛰기 쉽습니다. "지금 그게 중요한 게 아니라…"가 입 밖으로 나오기 전에 3초만 멈추면 대화의 질이 확 달라지는데, 그 3초가 가장 어려운 구간이죠.');
      body.push('회피 대신 정면 돌파를 선택하는 건 당신의 큰 강점입니다. 다만 "이겼다"의 기준을 "문제 해결"에서 "상대도 납득"으로 살짝만 옮기면, 같은 말로도 상처를 훨씬 덜 남기게 됩니다.');
    } else if (assertiveness >= 5 && cooperativeness >= 6) {
      body.push('갈등 상황에서 당신은 **양쪽 입장을 먼저 정리해 주는 사람**이에요. "잠깐, 네가 말한 건 이런 뜻이고, 이쪽이 화난 건 이 지점 때문이지?" 하고 통역하는 역할을 무의식적으로 맡습니다.');
      body.push('이 능력은 당신의 가장 큰 무기지만, 동시에 가장 빨리 지치는 지점이기도 해요. 당신이 중재자 역할을 하는 동안 정작 당신 자신의 감정은 뒷전으로 밀리고, 집에 와서 "오늘 나는 뭐였지?" 싶은 허탈함이 남죠.');
      body.push('모두를 만족시키는 답을 찾는 대신, 가끔은 "이건 내가 이렇게 했으면 좋겠어"를 먼저 꺼내 보세요. 협력형의 진짜 성장은 타인을 조율하는 기술이 아니라, 자기 목소리를 놓치지 않는 연습에서 나옵니다.');
    } else if (wC >= 6 && eC < 4) {
      body.push('갈등이 오면 당신은 **우선 한 발 물러서서 상황을 관찰**합니다. 감정이 튀기 전에 가라앉히고, 상대가 원하는 걸 먼저 살피려 해요.');
      body.push('문제는 그 과정에서 당신의 필요가 슬그머니 지워진다는 점이죠. "괜찮아요", "그래 네 말이 맞아"가 너무 빨리 나오고, 대화가 끝난 뒤에 혼자 집에서 "근데 나는 왜 그때 말을 못 했지"를 되새김질합니다.');
      body.push('갈등이 겁나는 건 대립 그 자체가 아니라, "내가 불편을 표현하면 이 관계가 끝날지 모른다"는 두려움 때문이에요. 작은 불만부터 조심스레 말해보는 연습이, 장기적으로 관계를 지키는 가장 확실한 길입니다.');
    } else if (eI < 4 && eC < 4) {
      body.push('갈등이 오면 당신의 첫 반응은 **침묵과 거리두기**예요. 즉답하지 않고 일단 시간을 벌어 생각을 정리하려 합니다. "지금 이야기하고 싶지 않아"가 내면의 기본 모드죠.');
      body.push('이 모드는 당신을 충동적 반응으로부터 지켜주지만, 상대 입장에선 "나를 투명인간 취급하는 것"으로 느껴질 수 있어요. 침묵이 길어질수록 오해는 두 배, 세 배로 부풀어 오릅니다.');
      body.push('갈등을 마주할 용기는 한 번에 생기지 않습니다. 대신 "지금은 이야기할 준비가 안 됐는데, 내일 아침에 다시 얘기해 보자"는 한 줄만 먼저 보내도 상대의 불안이 크게 줄어요.');
    } else {
      body.push('갈등이 생기면 당신은 **중간 지점을 빠르게 찾아내는** 사람입니다. "이 정도 선에서 마무리하는 게 서로 나아"라는 판단이 감각적으로 옵니다.');
      body.push('효율적이지만, 핵심 욕구까지 타협으로 처리해 버리면 장기적으론 "왜 나는 늘 조금씩만 받고 사는 거지?"라는 서운함이 누적될 수 있어요.');
      body.push('진짜 중요한 문제에선 "이건 양보 못 해"라고 분명히 선을 그어 두세요. 타협은 관계 유지의 기술이고, 선 긋기는 자신을 지키는 기술입니다.');
    }
    paras.push({ title: '⚔️ 갈등 상황에서 당신이 가장 먼저 하는 것', body: body.join(' ') });
  }

  // ── Block 6 — 주변 사람이 당신을 어떻게 경험하는가 ──
  {
    const out: string[] = [];

    // "겉-속" gaps
    if (iE === 'low' && iW === 'high') {
      out.push('사람들은 당신을 "조용하고 혼자가 편한 사람"으로 읽습니다. 사실 당신은 더 많은 관계를 원하는데, 먼저 손 내미는 법을 몰라서 반대로 보일 뿐이에요.');
    } else if (iE === 'high' && iW === 'low') {
      out.push('사람들은 당신을 "사교적이고 분위기 주도하는 사람"으로 봅니다. 정작 당신 안에는 "혼자만의 시간이 절실한 내성 모드"가 상당히 크게 자리 잡고 있고요.');
    }

    if (cE === 'low' && cW === 'high') {
      out.push('사람들은 당신을 "순응적이고 알아서 잘하는 사람"으로 알지만, 당신은 내심 누군가 강한 방향을 잡아주길 기다리고 있어요. 그 말을 안 하니까 점점 더 많은 걸 혼자 감당하게 되는 거죠.');
    } else if (cE === 'high' && cW === 'low') {
      out.push('사람들은 당신을 "주도적이고 자신감 넘치는 사람"으로 기억합니다. 다만 그 이면엔 "내 방식이 간섭받는 것"에 대한 꽤 큰 예민함이 있고, 그 선을 넘는 순간 관계를 정리하는 속도도 빠른 편입니다.');
    }

    if (aE === 'low' && aW === 'high') {
      out.push('사람들은 당신을 "감정이 얕고 사무적인 사람"으로 느낄 수 있습니다. 정작 당신 안은 훨씬 따뜻하고 기대가 많은데, 그걸 표현하는 채널이 익숙하지 않아서 밖으론 건조해 보이죠.');
    } else if (aE === 'high' && aW === 'low') {
      out.push('사람들은 당신에게 자주 기대옵니다. 당신이 따뜻하게 받아주니까요. 다만 당신이 지쳤을 때 그걸 알아채는 사람은 거의 없어요 — 당신이 먼저 "나 요즘 힘들어"라고 말해본 적이 거의 없기 때문입니다.');
    }

    if (out.length === 0) {
      out.push('당신의 표출(e)과 기대(w) 사이 간극이 크지 않아, 주변 사람들이 보는 당신과 당신 자신이 느끼는 자신이 비교적 일치합니다. 이건 드문 균형이에요. 다만 그만큼 "깊이 알아봐 준다"는 감각은 오히려 드물게 느껴질 수 있습니다 — 모든 게 겉으로 읽히니까요.');
    }
    paras.push({ title: '👀 주변 사람이 당신을 어떻게 경험하는가', body: out.join(' ') });
  }

  // ── Block 7 — 당신이 자꾸 빠지는 자기 함정 ──
  {
    let body = '';
    if (iE === 'low' && iW === 'high' && aE === 'low' && aW === 'high') {
      body = `당신이 빠지는 함정은 **"내가 말 안 해도 알아주는 사람이 진짜 친한 사람"이라는 신념**입니다. 그래서 먼저 표현할 생각도, 먼저 설명할 생각도 하지 않게 돼요. 결과적으로 모두가 당신의 기대를 조금씩 빗겨 가고, 당신은 "역시 이 관계도 별거 없었네"라는 결론을 반복해서 내립니다. 이 함정에서 빠져나오는 첫걸음은 **"원하는 걸 말하는 건 치사한 게 아니라 관계를 살리는 것"**이라는 문장을 하루에 한 번 꺼내 보는 거예요.`;
    } else if (cE === 'high' && aE === 'high' && aW === 'low') {
      body = `당신의 함정은 **"나는 강하니까 내가 다 해야 한다"는 각본**입니다. 사람들이 당신의 리드와 따뜻함에 기대오는 그림이 익숙하고, 당신도 그 역할이 당신의 정체성이라 믿고 있어요. 문제는 그 각본 안에서 당신이 무너질 공간이 없다는 점입니다. "나 지금 힘들어"라고 한 번 꺼내 보세요. 주변이 무너지는 게 아니라, 당신이 비로소 숨을 쉴 수 있게 되는 쪽이에요.`;
    } else if (cE === 'low' && cW === 'high') {
      body = `당신의 함정은 **"좋은 리더/선배만 만나면 다 해결될 것"이라는 기대**입니다. 그래서 회사·팀이 기대를 충족시키지 못하면 퇴사 버튼에 손이 가고, 새 환경에서 잠깐 살아나는 듯하다가 또 같은 피로가 반복돼요. 환경의 문제가 아예 없다는 얘기가 아니라, 스스로 "이 안에서 내가 선택할 수 있는 작은 구간"을 꾸준히 만드는 연습이 없으면 어떤 환경에서도 같은 패턴이 따라옵니다.`;
    } else if (iE === 'high' && aE === 'high') {
      body = `당신의 함정은 **"관계를 유지하는 건 내 책임"이라는 착각**입니다. 먼저 연락하고, 먼저 챙기고, 먼저 사과하는 쪽이 대부분 당신이었어요. 이 구조가 길어질수록 "나는 왜 늘 주는 쪽이지?"라는 허탈함이 깊어집니다. 관계는 한 사람이 책임지는 게 아니라는 당연한 사실을 — 정작 당신 자신에게 가장 늦게 허락해 주고 있는 중일지도 몰라요.`;
    } else if (iE === 'low' && iW === 'low' && aE === 'low' && aW === 'low') {
      body = `당신의 함정은 **"거리를 두면 상처받지 않는다"는 방어막**입니다. 넓은 사회적 활동도, 짙은 감정 교류도 불필요하다고 느끼는 건 성향이기도 하지만, 때로는 "가까워졌다가 실망할 바에는 처음부터 기대를 안 하는 게 낫다"는 과거의 학습일 수 있어요. 이 방어막이 당신을 보호해 주는 동시에, 안전한 몇 사람이 다가올 틈까지 막고 있진 않은지 한 번 확인해 볼 가치가 있습니다.`;
    } else {
      body = `당신의 함정은 **"나는 이 정도면 괜찮은 편"이라는 중간 지대의 안도**입니다. 극단적으로 외롭지도, 극단적으로 지치지도 않다 보니 "변화가 꼭 필요한가?"라는 질문이 안 생겨요. 하지만 오늘도 퇴사를 생각했다면, 그 중간 지대에서 사실은 조용히 새고 있는 부분이 있다는 신호일 수 있습니다. 수치로 보이지 않는 작은 불편감을 무시하지 않는 것 — 그게 당신 스타일의 성장입니다.`;
    }
    paras.push({ title: '🕳️ 당신이 자꾸 빠지는 자기 함정', body });
  }

  return paras;
}
