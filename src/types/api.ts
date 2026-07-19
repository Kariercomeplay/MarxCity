import { GameStats, Policies, StakeholderBalance, TurnResult, StatName, Difficulty, Ending } from './game';

export type ApiResponse<T> = { success: boolean; data?: T; error?: string };

export type TurnResponse = {
  year: number;
  statsBefore: GameStats;
  statsAfter: GameStats;
  effectsApplied: Record<string, number>;
  event: {
    id: string; title: string; scenario: string;
    selectedChoice: { label: string };
    choices: { id: string; label: string }[];
    type?: string; flavor?: string;
  };
  stakeholderImpact: Record<string, number>;
  explanation: { id: string; content: string; cloReferences: string[]; conceptTags: string[]; learningObjectives: string[] };
  gameOver: boolean;
  ending?: Ending | null;
  crisisId?: string | null;
  quiz?: { question: string; options: string[]; correctIndex: number; explanation: string } | null;
  unlockedEvents?: string[];
  completedEventId?: string;
};

export type LoadGameResponse = {
  gameId: string; name: string;
  currentTurn: number; maxTurns: number;
  difficulty: string;
  stats: GameStats; policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number; title: string; status: string;
  history: TurnResult[];
  unlockedEvents: string[];
  completedEvents: string[];
  quizCorrect: number; quizTotal: number;
  ending?: Ending | null;
};
