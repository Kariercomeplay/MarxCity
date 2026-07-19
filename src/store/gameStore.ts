'use client';

import { create } from 'zustand';
import { GameStats, Policies, StakeholderBalance, TurnResult, Difficulty, Ending, GameEvent } from '@/types/game';
import { TurnResponse } from '@/types/api';

interface GameUIState {
  sessionId: string;
  gameId: string | null;
  currentYear: number;
  difficulty: Difficulty;
  stats: GameStats | null;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number;
  status: 'idle' | 'playing' | 'completed';
  loading: boolean;
  error: string | null;
  lastResult: {
    effectsApplied: Record<string, number>;
    stakeholderImpact: Record<string, number>;
    explanation: { content: string; cloReferences: string[]; conceptTags: string[]; learningObjectives: string[] };
    event: { id: string; title: string; scenario: string; selectedChoice: { label: string } };
    gameOver: boolean;
    quiz?: { question: string; options: string[]; correctIndex: number; explanation: string } | null;
    crisisId?: string | null;
    ending?: Ending | null;
  } | null;
  history: TurnResult[];
  unlockedEvents: string[];
  completedEvents: string[];
  quizCorrect: number;
  quizTotal: number;
  showEventModal: boolean;
  showExplanation: boolean;
  showQuizModal: boolean;
  notification: string | null;
  availableEvents: { main: GameEvent | null; random: GameEvent | null; surprise: GameEvent | null };

  setSessionId: (id: string) => void;
  initGame: (data: { gameId: string; currentYear: number; difficulty: Difficulty; stats: GameStats; policies: Policies; stakeholderBalance: StakeholderBalance }) => void;
  setPolicies: (p: Policies) => void;
  setLoading: (v: boolean) => void;
  setAvailableEvents: (v: { main: GameEvent | null; random: GameEvent | null; surprise: GameEvent | null }) => void;
  setResult: (r: TurnResponse) => void;
  setUnlockedEvents: (ids: string[]) => void;
  addCompletedEvent: (id: string) => void;
  addUnlockedChoice: (key: string) => void;
  setQuizCorrect: (v: number) => void;
  setQuizTotal: (v: number) => void;
  setShowEventModal: (v: boolean) => void;
  setShowExplanation: (v: boolean) => void;
  setShowQuizModal: (v: boolean) => void;
  setNotification: (msg: string | null) => void;
  reset: () => void;
}

const initialState = {
  gameId: null,
  currentYear: 1,
  difficulty: 'normal' as Difficulty,
  stats: null,
  policies: { taxRate: 50, minWage: 50, eduInvestment: 40, infraInvestment: 40, fdiPolicy: 50, envProtection: 50 } as Policies,
  stakeholderBalance: { workers: 50, businesses: 50, state: 50 },
  score: 0,
  status: 'idle' as const,
  loading: false,
  error: null,
  lastResult: null,
  history: [],
  unlockedEvents: [],
  completedEvents: [],
  quizCorrect: 0,
  quizTotal: 0,
  showEventModal: false,
  showExplanation: false,
  showQuizModal: false,
  notification: null,
  availableEvents: { main: null, random: null, surprise: null },
};

export const useGameStore = create<GameUIState>((set) => ({
  ...initialState,
  sessionId: '',
  setSessionId: (id) => set({ sessionId: id }),
  initGame: (data) => set({
    gameId: data.gameId,
    currentYear: data.currentYear,
    difficulty: data.difficulty,
    stats: data.stats,
    policies: data.policies,
    stakeholderBalance: data.stakeholderBalance,
    status: 'playing',
    history: [],
    lastResult: null,
    unlockedEvents: [],
    completedEvents: [],
    quizCorrect: 0,
    quizTotal: 0,
  }),
  setPolicies: (p) => set({ policies: p }),
  setLoading: (v) => set({ loading: v }),
  setAvailableEvents: (v) => set({ availableEvents: v }),
  setResult: (r) => set((state) => {
    const statsAfter = r.statsAfter || state.stats!;
    const stakeholderImpact = r.stakeholderImpact || {};
    const historyEntry: TurnResult = {
      year: r.year || state.currentYear,
      eventId: r.event?.id || '',
      selectedChoiceId: r.event?.selectedChoice?.label || '',
      policiesBefore: state.policies,
      policiesAfter: state.policies,
      statsBefore: r.statsBefore || state.stats!,
      effectsApplied: r.effectsApplied || {},
      statsAfter,
      stakeholderImpact,
      explanationIds: [],
      eventTitle: r.event?.title || '',
    };
    return {
      lastResult: {
        effectsApplied: r.effectsApplied || {},
        stakeholderImpact,
        explanation: r.explanation || { content: '', cloReferences: [], conceptTags: [], learningObjectives: [] },
        event: r.event || { id: '', title: '', scenario: '', selectedChoice: { label: '' } },
        gameOver: r.gameOver || false,
        quiz: r.quiz,
        crisisId: r.crisisId || null,
        ending: r.ending || null,
      },
      stats: statsAfter,
      currentYear: state.currentYear + 1,
      stakeholderBalance: {
        workers: Math.max(0, Math.min(100, state.stakeholderBalance.workers + (stakeholderImpact.workers || 0))),
        businesses: Math.max(0, Math.min(100, state.stakeholderBalance.businesses + (stakeholderImpact.businesses || 0))),
        state: Math.max(0, Math.min(100, state.stakeholderBalance.state + (stakeholderImpact.state || 0))),
      },
      history: [...state.history, historyEntry],
      status: r.gameOver ? 'completed' : 'playing',
      score: r.gameOver && r.ending ? (r as any).endingScore || state.score : state.score + 1,
    };
  }),
  setUnlockedEvents: (ids) => set({ unlockedEvents: ids }),
  addCompletedEvent: (id) => set((state) => ({ completedEvents: [...state.completedEvents, id] })),
  addUnlockedChoice: (key) => set((state) => ({ unlockedEvents: [...state.unlockedEvents, key] })),
  setQuizCorrect: (v) => set({ quizCorrect: v }),
  setQuizTotal: (v) => set({ quizTotal: v }),
  setShowEventModal: (v) => set({ showEventModal: v }),
  setShowExplanation: (v) => set({ showExplanation: v }),
  setShowQuizModal: (v) => set({ showQuizModal: v }),
  setNotification: (msg) => set({ notification: msg }),
  reset: () => set(initialState),
}));
