export type StatName = 'production' | 'employment' | 'socialWelfare' | 'marketStability' | 'nationalCapacity' | 'environment' | 'budget';

export type GameStats = Record<StatName, number>;

export type Policies = {
  taxRate: number;
  minWage: number;
  eduInvestment: number;
  infraInvestment: number;
  fdiPolicy: number;
  envProtection: number;
};

export type StakeholderGroup = 'workers' | 'businesses' | 'state';

export type StakeholderBalance = Record<StakeholderGroup, number>;

export type Choice = {
  id: string;
  label: string;
  effects: Partial<Record<StatName, number>>;
  stakeholderImpact: Partial<Record<StakeholderGroup, number>>;
  explanationId: string;
};

export type GameEvent = {
  id: string;
  title: string;
  scenario: string;
  chapter: number;
  turn: number;
  choices: Choice[];
  cloReferences: string[];
  conceptTags: string[];
  learningObjectives: string[];
  sourceReferences?: string[];
};

export type TurnResult = {
  turnNumber: number;
  eventId: string;
  selectedChoiceId: string;
  policiesBefore: Policies;
  policiesAfter: Policies;
  statsBefore: GameStats;
  effectsApplied: Partial<Record<StatName, number>>;
  statsAfter: GameStats;
  stakeholderImpact: Partial<Record<StakeholderGroup, number>>;
  explanationIds: string[];
};

export type GameState = {
  id?: string;
  userId?: string;
  sessionId: string;
  name: string;
  currentTurn: number;
  maxTurns: number;
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number;
  status: 'playing' | 'completed';
  history: TurnResult[];
  seed: number;
};

export type Explanation = {
  id: string;
  content: string;
  cloReferences: string[];
  conceptTags: string[];
  learningObjectives: string[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanationId: string;
  relatedChapter: number;
  difficulty: 'easy' | 'medium' | 'hard';
};
