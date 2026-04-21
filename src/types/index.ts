export type ScaleKey = 'eI' | 'wI' | 'eC' | 'wC' | 'eA' | 'wA';

export interface Question {
  id: number;
  text: string;
  scale: ScaleKey;
}

export type Answers = Record<number, number>;

export interface FIROBScores {
  eI: number;
  wI: number;
  eC: number;
  wC: number;
  eA: number;
  wA: number;
}

export interface DimensionResult {
  type: string;
  description: string;
  partnerNeed: string;
}

export interface ConflictStyleResult {
  style: string;
  icon: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  relationshipAdvice: string;
}

export interface IdealPartnerResult {
  profile: FIROBScores;
  narrative: string;
  traits: string[];
  cautions: string[];
}
