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

export type Difficulty = 'easy' | 'normal' | 'hard';

export type EventType = 'story' | 'random' | 'chain' | 'surprise' | 'ending';

export type Choice = {
  id: string;
  label: string;
  effects: Partial<Record<StatName, number>>;
  stakeholderImpact: Partial<Record<StakeholderGroup, number>>;
  explanationId: string;
  unlocks?: string[];
};

export type GameEvent = {
  id: string;
  title: string;
  scenario: string;
  chapter: number;
  yearMin: number;
  yearMax: number;
  type: EventType;
  choices: Choice[];
  cloReferences: string[];
  conceptTags: string[];
  learningObjectives: string[];
  requires?: string[];
  requiresChoice?: string;
  isEnding?: boolean;
  endingId?: string;
  sourceReferences?: string[];
  flavor?: string;
};

export type Ending = {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'neutral' | 'failure';
  narrative: string;
};

export type TurnResult = {
  year: number;
  eventId: string;
  selectedChoiceId: string;
  policiesBefore: Policies;
  policiesAfter: Policies;
  statsBefore: GameStats;
  effectsApplied: Partial<Record<StatName, number>>;
  statsAfter: GameStats;
  stakeholderImpact: Partial<Record<StakeholderGroup, number>>;
  explanationIds: string[];
  eventTitle?: string;
};

export type GameState = {
  id?: string;
  userId?: string;
  sessionId: string;
  name: string;
  currentYear: number;
  difficulty: Difficulty;
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number;
  status: 'playing' | 'completed';
  history: TurnResult[];
  seed: number;
  unlockedEvents: string[];
  completedEvents: string[];
  quizCorrect: number;
  quizTotal: number;
  ending?: Ending;
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
