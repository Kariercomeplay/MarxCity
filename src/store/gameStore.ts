'use client';

import { create } from 'zustand';
import { GameStats, Policies, StakeholderBalance, TurnResult } from '@/types/game';
import { TurnResponse } from '@/types/api';

interface GameUIState {
  sessionId: string;
  gameId: string | null;
  currentTurn: number;
  maxTurns: number;
  stats: GameStats | null;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number;
  status: 'idle' | 'playing' | 'completed';
  loading: boolean;
  error: string | null;
  lastTurnResult: TurnResponse | null;
  history: TurnResult[];
  showEventModal: boolean;
  showQuizModal: boolean;
  showExplanation: boolean;
  animatingStats: boolean;

  setSessionId: (id: string) => void;
  initGame: (data: { gameId: string; currentTurn: number; maxTurns: number; stats: GameStats; policies: Policies; stakeholderBalance: StakeholderBalance }) => void;
  setPolicies: (p: Policies) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setTurnResult: (r: TurnResponse) => void;
  setShowEventModal: (v: boolean) => void;
  setShowQuizModal: (v: boolean) => void;
  setShowExplanation: (v: boolean) => void;
  setAnimatingStats: (v: boolean) => void;
  reset: () => void;
}

const initialState = {
  gameId: null,
  currentTurn: 1,
  maxTurns: 10,
  stats: null,
  policies: {
    taxRate: 50,
    minWage: 50,
    eduInvestment: 40,
    infraInvestment: 40,
    fdiPolicy: 50,
    envProtection: 50,
  } as Policies,
  stakeholderBalance: { workers: 50, businesses: 50, state: 50 },
  score: 0,
  status: 'idle' as const,
  loading: false,
  error: null,
  lastTurnResult: null,
  history: [],
  showEventModal: false,
  showQuizModal: false,
  showExplanation: false,
  animatingStats: false,
};

export const useGameStore = create<GameUIState>((set) => ({
  ...initialState,
  sessionId: '',
  setSessionId: (id) => set({ sessionId: id }),
  initGame: (data) => set({
    gameId: data.gameId,
    currentTurn: data.currentTurn,
    maxTurns: data.maxTurns,
    stats: data.stats,
    policies: data.policies,
    stakeholderBalance: data.stakeholderBalance,
    status: 'playing',
    history: [],
    lastTurnResult: null,
  }),
  setPolicies: (p) => set({ policies: p }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
  setTurnResult: (r) => set((state) => ({
    lastTurnResult: r,
    stats: r.statsAfter,
    currentTurn: state.currentTurn + 1,
    stakeholderBalance: {
      workers: Math.max(0, Math.min(100, state.stakeholderBalance.workers + (r.stakeholderImpact.workers || 0))),
      businesses: Math.max(0, Math.min(100, state.stakeholderBalance.businesses + (r.stakeholderImpact.businesses || 0))),
      state: Math.max(0, Math.min(100, state.stakeholderBalance.state + (r.stakeholderImpact.state || 0))),
    },
    history: [...state.history, {
      turnNumber: r.turnNumber,
      eventId: r.event.id,
      selectedChoiceId: r.event.selectedChoice.label,
      policiesBefore: state.policies,
      policiesAfter: state.policies,
      statsBefore: r.statsBefore,
      effectsApplied: r.effectsApplied,
      statsAfter: r.statsAfter,
      stakeholderImpact: r.stakeholderImpact,
      explanationIds: r.explanation.cloReferences,
    }],
    status: r.gameOver ? 'completed' : 'playing',
    score: state.score + 1,
  })),
  setShowEventModal: (v) => set({ showEventModal: v }),
  setShowQuizModal: (v) => set({ showQuizModal: v }),
  setShowExplanation: (v) => set({ showExplanation: v }),
  setAnimatingStats: (v) => set({ animatingStats: v }),
  reset: () => set(initialState),
}));
