import { GameStats, Policies, StakeholderBalance, TurnResult, StatName } from './game';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type SignupRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type InitGameRequest = {
  sessionId: string;
};

export type InitGameResponse = {
  gameId: string;
  currentTurn: number;
  maxTurns: number;
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  seed: number;
};

export type TurnRequest = {
  gameId: string;
  sessionId: string;
  eventId: string;
  selectedChoiceId: string;
  policies: Policies;
};

export type TurnResponse = {
  turnNumber: number;
  statsBefore: GameStats;
  statsAfter: GameStats;
  effectsApplied: Partial<Record<StatName, number>>;
  event: {
    id: string;
    title: string;
    scenario: string;
    selectedChoice: {
      label: string;
    };
    choices: {
      id: string;
      label: string;
    }[];
  };
  stakeholderImpact: Partial<Record<'workers' | 'businesses' | 'state', number>>;
  explanation: {
    id: string;
    content: string;
    cloReferences: string[];
    conceptTags: string[];
    learningObjectives: string[];
  };
  gameOver: boolean;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
};

export type SaveGameRequest = {
  gameId: string;
  name: string;
};

export type LoadGameResponse = {
  gameId: string;
  name: string;
  currentTurn: number;
  maxTurns: number;
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number;
  status: string;
  history: TurnResult[];
  quizCorrect: number;
  quizTotal: number;
};
