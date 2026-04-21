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

// ── Detailed interpretation ──

export function getDetailedInterpretation(s: FIROBScores): string[] {
  const t = getDimTotals(s);
  const paras: string[] = [];

  // Overall
  if (t.grand <= 31) {
    paras.push('대인관계 욕구 총합이 중간 수준이며, 상황에 따라 사람들과 상호작용하고자 하는 편입니다. 가까운 관계는 중요하지만 때로는 개인적 공간과 혼자만의 시간도 필요합니다.');
  } else if (t.grand <= 44) {
    paras.push('대인관계 욕구 총합이 중상 수준으로, 다양한 사람들과 교류하는 것을 즐기며 사회적 연결을 중요하게 여깁니다. 활발한 대인관계 속에서 에너지를 얻는 경향이 있습니다.');
  } else {
    paras.push('대인관계 욕구 총합이 높은 수준으로, 사람들과 함께하는 것을 매우 선호합니다. 넓은 사회적 네트워크를 유지하며 혼자 있는 것이 다소 불편할 수 있습니다.');
  }

  // Inclusion
  if (t.inclusion <= 5) {
    paras.push('소속 욕구가 낮아 혼자 일하는 것을 선호하며, 대규모 집단 활동보다 소수 인원과의 깊은 관계를 선호합니다. 독립적인 환경에서 높은 성과를 발휘합니다.');
  } else if (t.inclusion <= 10) {
    paras.push('소속 욕구가 중간 수준으로, 집단 활동에 선택적으로 참여하며 개인 공간과 사회적 교류를 균형 있게 유지합니다. 필요에 따라 그룹에 기여하고 물러서는 유연함을 보입니다.');
  } else {
    paras.push('소속 욕구가 높아 다양한 사람들과 함께하는 것을 즐기며, 그룹 활동과 커뮤니티에 적극적으로 참여합니다. 사람들 속에 있을 때 활력을 느낍니다.');
  }

  // Control
  if (t.control >= 12) {
    paras.push('통제 욕구가 높아 과업 달성을 위해 명확한 권한과 책임이 부여되는 상황을 선호합니다. 구조화된 환경과 명확한 역할 분담 속에서 높은 성과를 발휘하며, 권위에 민감한 편입니다.');
  } else if (t.control >= 6) {
    paras.push('통제 욕구가 중간 수준으로, 상황에 따라 이끌거나 따르는 역할을 유연하게 수행합니다. 구조와 자율성 사이에서 적절한 균형을 추구합니다.');
  } else {
    paras.push('통제 욕구가 낮아 민주적이고 자율적인 환경을 선호합니다. 권위적 구조보다 수평적인 관계에서 편안함을 느끼며, 지시보다는 협력을 통한 문제 해결을 선호합니다.');
  }

  // Affection
  if (t.affection <= 4) {
    paras.push('정서 욕구가 낮아 보다 공식적이고 사무적인 관계를 선호하는 경향이 있습니다. 전문적 관계에서 감정보다 역할과 업무에 집중하며, 친밀감 형성에 신중한 편입니다.');
  } else if (t.affection <= 9) {
    paras.push('정서 욕구가 중간 수준으로, 신뢰하는 소수와 깊은 감정적 교류를 나눕니다. 공식적 관계와 친밀한 관계를 상황에 맞게 구분하여 유지합니다.');
  } else {
    paras.push('정서 욕구가 높아 따뜻한 인간관계를 매우 중시합니다. 감정을 나누고 상대방의 애정 표현을 중요하게 여기며, 깊은 친밀감 속에서 관계의 의미를 찾습니다.');
  }

  // Expressed vs Wanted
  if (t.expressed < t.wanted - 1) {
    paras.push('표출행동보다 기대행동이 높아 타인이 먼저 관계를 이끌어 주기를 기대하는 경향이 있습니다. 자신의 욕구를 보다 적극적으로 표현하는 연습이 관계 만족도를 높이는 데 도움이 될 수 있습니다.');
  } else if (t.expressed > t.wanted + 1) {
    paras.push('표출행동이 기대행동보다 높아 자신이 먼저 행동에 나서는 주도적인 경향이 있습니다. 타인에게 많은 것을 제공하면서도 그에 상응하는 기대가 낮아 관계에서 여유로운 편입니다.');
  } else {
    paras.push('표출행동과 기대행동이 균형을 이루고 있어 자신이 주는 만큼 받기를 원하는 상호적인 관계를 추구합니다. 공정하고 균형 잡힌 대인관계 방식을 보입니다.');
  }

  return paras;
}
