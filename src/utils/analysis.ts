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
// Flowing, narrative-style deep read of the user's pattern — written so it
// reads like a single connected self-report (the "사주풀이 style" the product
// direction calls for). The function returns 3 long paragraphs with
// cause-and-effect chains weaving inclusion / control / affection together
// plus the resulting conflict tendencies, perception gaps, and the self-trap
// each pattern quietly falls into.
//
// Content is descriptive, not prescriptive, to preserve the site-wide
// educational / non-advisory framing.

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

export function getDetailedInterpretation(s: FIROBScores): string[] {
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

  // ── Fragment library (sentence-level) — each returns a short flowing
  // phrase that naturally glues into the surrounding narrative.

  // Identity metaphor — 1 sentence combining all three dims
  const identityMetaphor = (() => {
    if (iE === 'low' && iW === 'high' && aE === 'low' && aW === 'high')
      return '사람이 필요 없어서 혼자인 게 아니라, 먼저 다가가는 방법을 몰라서 외로운 쪽이에요.';
    if (iE === 'high' && iW === 'low' && cE === 'high' && cW === 'low')
      return '겉으로는 "사람 좋아하고 리드 잘하는 사람"으로 보이지만, 속은 의외로 독립적이고 간섭받는 걸 가장 싫어하는 유형입니다.';
    if (iE === 'high' && iW === 'high' && aE === 'high' && aW === 'high')
      return '관계 속에서 에너지를 얻고, 관계가 흐릿해지면 존재감까지 희미해지는 유형이에요.';
    if (iE === 'low' && iW === 'low' && cE === 'low' && cW === 'low' && aE === 'low' && aW === 'low')
      return '"혼자가 기본값"인 사람이라, 관계가 부담이 아니라 선택이길 원하고 자율과 거리감 속에서 가장 편안하죠.';
    if (cE === 'low' && cW === 'high')
      return '스스로 결정하는 것보다 "믿을 만한 누군가가 방향을 잡아주는 상황"에서 가장 안정감을 느끼는 유형입니다.';
    if (cE === 'high' && cW === 'low')
      return '주도권을 손에 쥐고 있을 때 가장 편안하고, 반대로 간섭받는 순간 숨이 턱 막히는 쪽이에요.';
    return '세 영역이 어느 쪽으로도 극단적이지 않아 상황에 맞게 유연하게 전환되지만, 그만큼 "나는 도대체 뭐가 편한 거지?"라는 정체성 질문이 주기적으로 찾아오는 편입니다.';
  })();

  // Morning greeting scene
  const morningScene = iE === 'high'
    ? '평소 출근길 엘리베이터에서 동료를 마주치면 먼저 "좋은 아침이에요" 건네는 편이고'
    : '평소 출근길 엘리베이터에서 동료를 마주치면 가볍게 목례만 하고 휴대폰을 한 번 더 들여다보는 쪽이고';

  // Meeting scene
  const meetingScene = (() => {
    if (iE === 'high' && cE === 'high')
      return '회의에서는 정적이 길어지면 참지 못하고 먼저 "그럼 이렇게 가볼까요?"를 꺼내는 사람이라';
    if (iE === 'low' && cE === 'low')
      return '회의에서는 대부분 듣는 쪽에 서 있다가 꼭 필요한 순간에만 짧고 정확하게 의견을 내는 타입이고';
    if (cE === 'low' && cW === 'high')
      return '회의에서 방향을 잡아주는 사람이 없으면 "그래서 뭘 하자는 거지?"가 머릿속에 5분 간격으로 떠오르며 피로감이 급격히 올라가고';
    return '회의에서는 흐름을 보다가 결정적인 지점에서 한두 마디로 정리하는 타입이고';
  })();

  // Lunch / social scene
  const lunchScene = (() => {
    if (iE === 'low' && iW === 'high')
      return '점심시간엔 먼저 "같이 드실래요?"를 꺼내진 못하지만 누가 불러주면 내심 반가워하는 쪽이라, 혼자 먹는 날이 이어지면 속으로는 "왜 아무도 안 부르지"라는 말이 하루에 몇 번씩 스칩니다.';
    if (iE === 'high' && iW === 'low')
      return '점심은 가끔 혼자 보내는 걸 오히려 선호하고, "오늘은 혼밥하고 싶다"고 솔직히 말하는 것도 어렵지 않게 하죠.';
    if (iE === 'high' && iW === 'high')
      return '점심은 누구와 먹을지 이미 머릿속에 후보가 두세 명 있고, 혼자 먹는 날이 이틀 연속 이어지면 "요즘 내가 왜 이렇게 고립돼 있지?"라는 생각이 올라옵니다.';
    return '점심은 혼자 조용히 보내는 게 자연스럽고, 누가 불러주는 것도 좋지만 굳이 매일 어울릴 필요는 느끼지 않는 편이에요.';
  })();

  // Affection at work
  const affScene = (() => {
    if (aE === 'low' && aW === 'high')
      return '그리고 사실은 누가 "오늘 고생 많았어요" 한 마디만 건네줘도 하루 기분이 완전히 달라지는 사람인데, 그런 말이 드물 때의 공허함이 얼마나 큰지는 당신만 압니다.';
    if (aE === 'high' && aW === 'low')
      return '동료가 지쳐 보이면 모르게 커피 한 잔을 사다 놓는 쪽인데, 정작 누가 당신을 챙기려 하면 "괜찮아요 저는" 하고 한 발 물러서는 편이죠.';
    if (aE === 'high' && aW === 'high')
      return '동료의 표정을 가장 먼저 읽고 먼저 말을 거는 쪽이지만, 정작 당신이 힘들 땐 말하지 않아도 알아봐 주는 사람이 있길 바라는 마음이 크죠.';
    return '직장에선 감정보다 "역할과 성과" 중심으로 관계를 맺는 편이라, 깊은 친밀감이 강요되는 분위기는 오히려 부담스럽고 적당한 거리가 가장 편합니다.';
  })();

  // Relationship loop (dominant gap)
  const loopNarrative = (() => {
    if (dominantGap.name === '소속' && dominantGap.signed >= 2)
      return `이런 성향이 관계에 드러나면, 가장 자주 반복되는 장면은 **"나도 그 자리 끼고 싶었는데, 말 안 한 내 탓이지 뭐"**라는 자책의 루프예요. 원하는 건 분명히 있는데 그걸 언어로 꺼내지 않으니, 주변 사람들은 당신을 "알아서 잘 지내는 무심한 사람"으로 읽고, 당신은 속으로 "왜 아무도 안 불러?"를 되뇌는 — 서로 전혀 다른 이야기를 혼자 읽고 있는 구조가 계속 돕니다.`;
    if (dominantGap.name === '소속' && dominantGap.signed <= -2)
      return `이런 성향이 관계에 드러나면, 당신이 먼저 모으고 자리를 만들고 연락을 돌리는 쪽이 됩니다. 문제는 그렇게 만든 관계의 반응이 당신만큼 돌아오지 않을 때예요. "나만 신경 쓰는 건가?"라는 생각이 한두 번 들기 시작하면 갑자기 연락을 끊어버리는 쪽으로 가곤 해서, 밖에서 보면 "주도적이던 사람이 왜 갑자기 잠수를 타지?" 싶지만 당신 안에서는 이미 "더는 에너지 쓸 가치가 없다"는 결론이 조용히 내려진 뒤죠.`;
    if (dominantGap.name === '통제' && dominantGap.signed >= 2)
      return `이런 성향이 일에 드러나면, 당신이 자주 반복하는 장면은 **명확한 방향을 제시해줄 사람이 없는 자리에서 혼자 피곤해지는 것**이에요. 스스로 주도하는 건 체질에 맞지 않고, 그렇다고 무작정 지시만 내리는 것도 싫어합니다. 리더십 공백이 오면 "이 회사 너무 체계 없어 → 내가 왜 이걸 다 떠안아야 하지 → 퇴사하고 싶다"라는 루프가 익숙할 수밖에요.`;
    if (dominantGap.name === '통제' && dominantGap.signed <= -2)
      return `이런 성향이 일에 드러나면, 주도권을 쥐고 있으면 지치고 놓으면 불안한 모순이 반복됩니다. 결정이 필요한 순간이 오면 자기도 모르게 먼저 나서서 정리하는데, 마음 깊은 곳에선 "누가 이걸 좀 대신 해줬으면" 싶어해요. 팀에 당신만큼 방향 잡는 사람이 없다는 걸 확인할 때마다 책임감이 무겁게 내려앉아, 집에 와서 "나는 왜 항상 총대를 메야 하지?"라는 피로가 쌓이죠.`;
    if (dominantGap.name === '애정' && dominantGap.signed >= 2)
      return `이런 성향이 관계에 드러나면 반복되는 루프는 **"나는 받고 싶은데 먼저 표현하진 못하는 쪽"**이에요. 상대가 먼저 따뜻한 말을 건네주기를 속으로 기다리지만 그 기다림을 상대가 알아채기 어렵고, 그래서 관계는 점점 사무적으로 변해갑니다. 당신은 "이 사람은 나한테 관심이 없구나"라는 결론을 혼자 내리지만, 사실은 상대가 무관심한 게 아니라 당신이 무표정으로 선 긋고 있다는 신호를 계속 보내고 있던 것이기도 해요.`;
    if (dominantGap.name === '애정' && dominantGap.signed <= -2)
      return `이런 성향이 관계에 드러나면, 당신은 먼저 따뜻함을 주는 쪽이지만 받는 건 의외로 어색합니다. 누가 당신을 깊이 챙기려 하면 "저는 괜찮아요" 하며 반사적으로 한 발 뒤로 물러서죠. 그래서 주변엔 "베풀어주는 좋은 사람"은 많은데 정작 당신이 무너졌을 때 기댈 만한 관계는 적고, "나는 왜 관계에서 항상 주는 쪽이지?"라는 피로가 천천히 쌓입니다.`;
    return `당신의 표출과 기대 사이 간극이 크지 않아 특정 루프에 갇히기보다는 상황마다 다른 방식으로 관계가 어긋날 수 있어요. 다만 공통적으로 반복되는 패턴은 — "어느 순간 내가 이 관계에서 너무 많이 조율하고 있다"는 자각이 올 때 조용히 거리를 두는 방식입니다.`;
  })();

  // Conflict response narrative
  const assertiveness   = eC;
  const cooperativeness = (eA + eI) / 2;
  const conflictNarrative = (() => {
    if (assertiveness >= 6.5 && cooperativeness < 5)
      return `갈등이 오면 당신은 먼저 **논리와 팩트로 상대를 설득하려** 듭니다. 목소리가 커지기 전에 논점을 정리하고 빠르게 결론을 내려 상황을 종결시키려 해요. 회피 대신 정면 돌파를 선택하는 건 당신의 큰 강점이지만, 급한 마음에 상대의 감정을 건너뛰기 쉽죠. "지금 그게 중요한 게 아니라…"가 입 밖으로 나오기 전에 3초만 멈출 수 있으면 같은 말로도 상처를 훨씬 덜 남기게 됩니다.`;
    if (assertiveness >= 5 && cooperativeness >= 6)
      return `갈등 상황에서는 **양쪽 입장을 먼저 정리해 주는 사람**이 됩니다. "잠깐, 네가 말한 건 이런 뜻이고 이쪽이 화난 건 이 지점 때문이지?" 하고 통역하는 역할을 무의식적으로 맡죠. 이 능력은 당신의 가장 큰 무기지만 동시에 가장 빨리 지치는 지점이기도 해서, 중재자 역할을 하는 동안 정작 당신 자신의 감정은 뒷전으로 밀리고 집에 와서 "오늘 나는 뭐였지?" 싶은 허탈함이 남습니다.`;
    if (wC >= 6 && eC < 4)
      return `갈등이 오면 당신은 **우선 한 발 물러서서 상황을 관찰**합니다. 감정이 튀기 전에 가라앉히고 상대가 원하는 걸 먼저 살피려 하죠. 문제는 그 과정에서 당신의 필요가 슬그머니 지워진다는 점이에요. "괜찮아요", "그래 네 말이 맞아"가 너무 빨리 나오고, 대화가 끝난 뒤 혼자 "근데 나는 왜 그때 말을 못 했지"를 되새김질합니다. 갈등이 겁나는 건 대립 그 자체가 아니라 "내가 불편을 표현하면 이 관계가 끝날지 모른다"는 두려움 때문이에요.`;
    if (eI < 4 && eC < 4)
      return `갈등이 오면 당신의 첫 반응은 **침묵과 거리두기**입니다. 즉답하지 않고 일단 시간을 벌어 생각을 정리하려 하고, "지금 이야기하고 싶지 않아"가 내면의 기본 모드죠. 이 모드가 충동적 반응으로부터 당신을 지켜주는 건 사실이지만, 상대 입장에선 "나를 투명인간 취급하는 것"으로 느껴져서 침묵이 길어질수록 오해는 두 배 세 배 부풀어 오릅니다.`;
    return `갈등이 생기면 당신은 **중간 지점을 빠르게 찾아내는** 사람이에요. "이 정도 선에서 마무리하는 게 서로 나아"라는 판단이 감각적으로 오죠. 효율적이지만 핵심 욕구까지 타협으로 처리해 버리면 장기적으론 "왜 나는 늘 조금씩만 받고 사는 거지?"라는 서운함이 누적될 수 있습니다.`;
  })();

  // How others see you (perception gap)
  const perceptionFragments: string[] = [];
  if (iE === 'low' && iW === 'high')
    perceptionFragments.push('당신의 표현 방식 때문에 사람들은 당신을 "조용하고 혼자가 편한 사람"으로 읽지만, 사실 당신은 더 많은 연결을 원하는 쪽이라 그 간극이 당신을 외롭게 만들고');
  else if (iE === 'high' && iW === 'low')
    perceptionFragments.push('당신의 표현 방식 때문에 사람들은 당신을 "사교적이고 분위기 주도하는 사람"으로 기억하지만, 정작 당신 안엔 "혼자만의 시간이 절실한 내성 모드"가 상당히 크게 자리 잡고 있어서 그 간극이 피로로 돌아오고');

  if (cE === 'low' && cW === 'high')
    perceptionFragments.push('주변은 당신을 "순응적이고 알아서 잘하는 사람"으로 알지만 당신은 내심 누군가 강한 방향을 잡아주길 기다리고 있어서, 그 말을 꺼내지 않으니 점점 더 많은 걸 혼자 감당하게 되고');
  else if (cE === 'high' && cW === 'low')
    perceptionFragments.push('주변은 당신을 "주도적이고 자신감 넘치는 사람"으로 기억하지만 그 이면엔 "내 방식이 간섭받는 것"에 대한 꽤 큰 예민함이 있어서 그 선을 넘는 순간 관계를 정리하는 속도도 빠른 편이고');

  if (aE === 'low' && aW === 'high')
    perceptionFragments.push('사람들은 당신을 "감정이 얕고 사무적인 사람"으로 느낄 수 있지만 당신 안은 훨씬 따뜻하고 기대가 많은데, 표현하는 채널이 익숙하지 않아 밖으론 건조해 보이는 거죠');
  else if (aE === 'high' && aW === 'low')
    perceptionFragments.push('사람들은 당신에게 자주 기대는데, 정작 당신이 지쳤을 때 그걸 알아채는 사람은 거의 없어요 — 당신이 먼저 "나 요즘 힘들어"라고 말해본 적이 거의 없기 때문이고요');

  const perceptionNarrative = perceptionFragments.length > 0
    ? '그래서 ' + perceptionFragments.join(', ') + '.'
    : '당신의 표출(e)과 기대(w) 사이 간극이 크지 않아, 주변이 보는 당신과 당신 자신이 느끼는 자신이 비교적 일치해요. 이건 드문 균형이지만, 그만큼 "깊이 알아봐 준다"는 감각은 오히려 드물게 느껴질 수 있습니다.';

  // Self-trap + closing
  const selfTrap = (() => {
    if (iE === 'low' && iW === 'high' && aE === 'low' && aW === 'high')
      return `결국 당신이 자꾸 빠지는 함정은 **"내가 말 안 해도 알아주는 사람이 진짜 친한 사람"이라는 신념**이에요. 그래서 먼저 표현할 생각도, 먼저 설명할 생각도 하지 않게 되고, 모두가 당신의 기대를 조금씩 빗겨 가면 "역시 이 관계도 별거 없었네"라는 결론이 반복됩니다. 오늘도 퇴사가 머릿속을 떠나지 않는다면, 일 그 자체의 무게보다 이 "말 못한 기대"가 조용히 쌓이고 있지는 않은지 한 번 돌아봐 주세요.`;
    if (cE === 'high' && aE === 'high' && aW === 'low')
      return `결국 당신이 자꾸 빠지는 함정은 **"나는 강하니까 내가 다 해야 한다"는 각본**이에요. 사람들이 당신의 리드와 따뜻함에 기대오는 그림이 익숙해서 그 역할을 정체성이라 믿고 있지만, 그 각본 안에서 정작 당신이 무너질 공간이 없다는 게 가장 큰 문제입니다. "나 지금 힘들어"라고 한 번 꺼낼 수 있다면, 주변이 무너지는 게 아니라 당신이 비로소 숨을 쉬게 되는 쪽일 거예요.`;
    if (cE === 'low' && cW === 'high')
      return `결국 당신이 자꾸 빠지는 함정은 **"좋은 리더/선배만 만나면 다 해결될 것"이라는 기대**입니다. 그래서 회사가 기대를 충족시키지 못하면 퇴사 버튼에 손이 가고, 새 환경에서 잠깐 살아나는 듯하다 또 같은 피로가 반복돼요. 환경 탓이 아예 없다는 얘기가 아니라, "이 안에서 내가 선택할 수 있는 작은 구간"을 스스로 만드는 연습이 없으면 어떤 환경에서도 같은 패턴이 따라옵니다.`;
    if (iE === 'high' && aE === 'high')
      return `결국 당신이 자꾸 빠지는 함정은 **"관계를 유지하는 건 내 책임"이라는 착각**이에요. 먼저 연락하고 먼저 챙기고 먼저 사과하는 쪽이 늘 당신이었고, 이 구조가 길어질수록 "나는 왜 늘 주는 쪽이지?"라는 허탈함이 깊어지죠. 관계는 한 사람이 책임지는 게 아니라는 당연한 사실을 정작 당신 자신에게 가장 늦게 허락해 주고 있는 중일지도 몰라요.`;
    if (iE === 'low' && iW === 'low' && aE === 'low' && aW === 'low')
      return `결국 당신이 자꾸 빠지는 함정은 **"거리를 두면 상처받지 않는다"는 방어막**이에요. 넓은 사교도 짙은 감정 교류도 불필요하다고 느끼는 건 성향이기도 하지만, 때로는 "가까워졌다가 실망할 바에는 처음부터 기대를 안 하는 게 낫다"는 과거의 학습일 수도 있습니다. 이 방어막이 당신을 보호하는 동시에, 안전한 몇 사람이 다가올 틈까지 막고 있진 않은지 한 번 확인해 볼 가치가 있어요.`;
    return `결국 당신이 자꾸 빠지는 함정은 **"나는 이 정도면 괜찮은 편"이라는 중간 지대의 안도**예요. 극단적으로 외롭지도 지치지도 않다 보니 "변화가 꼭 필요한가?"라는 질문이 안 생기죠. 하지만 오늘도 퇴사를 생각했다면, 그 중간 지대에서 사실 조용히 새고 있는 부분이 있다는 신호일 수 있습니다. 수치로 보이지 않는 작은 불편감을 무시하지 않는 것 — 그게 당신 스타일의 성장입니다.`;
  })();

  // ── Compose 3 flowing paragraphs ──

  const para1 = `당신은 한 마디로 **"${iLabel}**이면서 **${cL}**이고, **${aL}**"인 사람입니다. ${identityMetaphor} ${morningScene}, ${meetingScene}, ${lunchScene} ${affScene}`;

  const para2 = `${loopNarrative} ${conflictNarrative} ${perceptionNarrative}`;

  const para3 = selfTrap;

  return [para1, para2, para3];
}
