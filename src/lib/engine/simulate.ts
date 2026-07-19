import { GameStats, Policies, StakeholderBalance, TurnResult, Choice, GameEvent } from '@/types/game';
import { clampStat, applyPolicyEffects, applyStakeholderEffects, calcBaseTurnEffects } from './effects';
import { STARTING_STATS, DEFAULT_POLICIES } from './constants';
import { getSeededRandom } from '@/lib/utils/rng';

export function initState(seed: number): {
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
} {
  return {
    stats: { ...STARTING_STATS },
    policies: { ...DEFAULT_POLICIES },
    stakeholderBalance: { workers: 50, businesses: 50, state: 50 },
  };
}

export function simulateTurn(
  previousStats: GameStats,
  previousPolicies: Policies,
  currentPolicies: Policies,
  selectedChoice: Choice,
  seed: number
): {
  statsAfter: GameStats;
  effectsApplied: Partial<Record<string, number>>;
  stakeholderImpact: Partial<Record<string, number>>;
} {
  const rng = getSeededRandom(seed);
  const noise = () => (rng() - 0.5) * 2;

  const policyEffects = applyPolicyEffects(currentPolicies, previousPolicies);
  const stakeEffects = applyStakeholderEffects(currentPolicies, previousPolicies);
  const baseEffects = calcBaseTurnEffects(previousStats.budget);

  const combinedEffects: Record<string, number> = {};

  const allKeys = new Set([
    ...Object.keys(policyEffects),
    ...Object.keys(baseEffects),
    ...Object.keys(selectedChoice.effects),
  ]);

  for (const key of allKeys) {
    combinedEffects[key] = (policyEffects[key] || 0)
      + (baseEffects[key] || 0)
      + (selectedChoice.effects[key as keyof typeof selectedChoice.effects] || 0)
      + noise() * 0.5;
  }

  const newStats: GameStats = {
    production: clampStat(previousStats.production + (combinedEffects.production || 0)),
    employment: clampStat(previousStats.employment + (combinedEffects.employment || 0)),
    socialWelfare: clampStat(previousStats.socialWelfare + (combinedEffects.socialWelfare || 0)),
    marketStability: clampStat(previousStats.marketStability + (combinedEffects.marketStability || 0)),
    nationalCapacity: clampStat(previousStats.nationalCapacity + (combinedEffects.nationalCapacity || 0)),
    environment: clampStat(previousStats.environment + (combinedEffects.environment || 0)),
    budget: clampStat(previousStats.budget + (combinedEffects.budget || 0)),
  };

  const effectsApplied: Partial<Record<string, number>> = {};
  for (const key of allKeys) {
    const effectValue = combinedEffects[key];
    if (Math.abs(effectValue) >= 0.5) {
      effectsApplied[key] = Math.round(effectValue * 10) / 10;
    }
  }

  const stakeholderImpact: Partial<Record<string, number>> = {};
  const combinedStake: Record<string, number> = {};
  const allStakeKeys = new Set([
    ...Object.keys(stakeEffects),
    ...Object.keys(selectedChoice.stakeholderImpact || {}),
  ]);
  for (const key of allStakeKeys) {
    combinedStake[key] = (stakeEffects[key] || 0) + ((selectedChoice.stakeholderImpact as any)?.[key] || 0) + noise() * 0.3;
    stakeholderImpact[key] = Math.round(combinedStake[key] * 10) / 10;
  }

  return { statsAfter: newStats, effectsApplied, stakeholderImpact };
}

export function pickEvent(
  events: GameEvent[],
  currentTurn: number,
  seed: number
): GameEvent | null {
  const rng = getSeededRandom(seed);
  const available = events.filter(e => e.turn === currentTurn);
  if (available.length === 0) return null;
  const idx = Math.floor(rng() * available.length);
  return available[idx];
}
