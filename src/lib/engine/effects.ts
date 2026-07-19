import { Policies, GameStats, StakeholderBalance, Difficulty } from '@/types/game';
import { MIN_STAT, MAX_STAT, DIFFICULTY_CONFIG } from './constants';

export function clampStat(value: number): number {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, Math.round(value)));
}

export function applyPolicyEffects(
  policies: Policies,
  prevPolicies: Policies,
  difficulty: Difficulty = 'normal'
): Record<string, number> {
  const config = DIFFICULTY_CONFIG[difficulty];
  const m = config.effectMultiplier;
  const delta: Record<string, number> = {};
  const taxDiff = policies.taxRate - prevPolicies.taxRate;
  const wageDiff = policies.minWage - prevPolicies.minWage;
  const eduDiff = policies.eduInvestment - prevPolicies.eduInvestment;
  const infraDiff = policies.infraInvestment - prevPolicies.infraInvestment;
  const fdiDiff = policies.fdiPolicy - prevPolicies.fdiPolicy;
  const envDiff = policies.envProtection - prevPolicies.envProtection;

  const TAX_FACTOR = 0.1 * m;
  const WAGE_FACTOR = 0.08 * m;
  const EDU_FACTOR = 0.12 * m;
  const INFRA_FACTOR = 0.1 * m;
  const FDI_FACTOR = 0.08 * m;
  const ENV_FACTOR = 0.1 * m;

  delta.production = (taxDiff * TAX_FACTOR * -0.3)
    + (wageDiff * WAGE_FACTOR * -0.2)
    + (eduDiff * EDU_FACTOR * 0.2)
    + (infraDiff * INFRA_FACTOR * 0.5)
    + (fdiDiff * FDI_FACTOR * 0.3);

  delta.employment = (taxDiff * TAX_FACTOR * -0.2)
    + (wageDiff * WAGE_FACTOR * -0.3)
    + (eduDiff * EDU_FACTOR * 0.1)
    + (infraDiff * INFRA_FACTOR * 0.3)
    + (fdiDiff * FDI_FACTOR * 0.4);

  delta.socialWelfare = (wageDiff * WAGE_FACTOR * 0.5)
    + (eduDiff * EDU_FACTOR * 0.6)
    + (envDiff * ENV_FACTOR * 0.2)
    + (taxDiff * TAX_FACTOR * -0.1);

  delta.marketStability = (taxDiff * TAX_FACTOR * -0.2)
    + (wageDiff * WAGE_FACTOR * 0.1)
    + (infraDiff * INFRA_FACTOR * 0.1)
    + (fdiDiff * FDI_FACTOR * -0.2);

  delta.nationalCapacity = (eduDiff * EDU_FACTOR * 0.4)
    + (infraDiff * INFRA_FACTOR * 0.3)
    + (fdiDiff * FDI_FACTOR * -0.2)
    + (envDiff * ENV_FACTOR * 0.1);

  delta.environment = (fdiDiff * FDI_FACTOR * -0.3)
    + (envDiff * ENV_FACTOR * 0.5)
    + (taxDiff * TAX_FACTOR * 0.1)
    + (infraDiff * INFRA_FACTOR * -0.1);

  delta.budget = (taxDiff * TAX_FACTOR * 0.5)
    + (wageDiff * WAGE_FACTOR * -0.1)
    + (eduDiff * EDU_FACTOR * -0.3)
    + (infraDiff * INFRA_FACTOR * -0.4)
    + (fdiDiff * FDI_FACTOR * 0.2)
    + (envDiff * ENV_FACTOR * -0.2);

  return delta;
}

export function applyStakeholderEffects(
  policies: Policies,
  prevPolicies: Policies,
  difficulty: Difficulty = 'normal'
): Record<string, number> {
  const config = DIFFICULTY_CONFIG[difficulty];
  const m = config.effectMultiplier;
  const taxDiff = policies.taxRate - prevPolicies.taxRate;
  const wageDiff = policies.minWage - prevPolicies.minWage;
  const eduDiff = policies.eduInvestment - prevPolicies.eduInvestment;
  const infraDiff = policies.infraInvestment - prevPolicies.infraInvestment;
  const fdiDiff = policies.fdiPolicy - prevPolicies.fdiPolicy;
  const envDiff = policies.envProtection - prevPolicies.envProtection;

  const FACTOR = 0.1 * m;

  return {
    workers: (wageDiff * FACTOR * 0.5) + (eduDiff * FACTOR * 0.3) + (fdiDiff * FACTOR * -0.1) + (envDiff * FACTOR * 0.2),
    businesses: (taxDiff * FACTOR * -0.5) + (wageDiff * FACTOR * -0.4) + (fdiDiff * FACTOR * 0.4) + (infraDiff * FACTOR * 0.3),
    state: (taxDiff * FACTOR * 0.4) + (eduDiff * FACTOR * -0.2) + (infraDiff * FACTOR * -0.3) + (envDiff * FACTOR * 0.2),
  };
}

export function calcBaseYearEffects(stats: GameStats, difficulty: Difficulty = 'normal'): Record<string, number> {
  const m = DIFFICULTY_CONFIG[difficulty].effectMultiplier;
  const effects: Record<string, number> = {
    production: 0.3 * m,
    employment: -0.2 * m,
    marketStability: -0.2 * m,
    environment: -0.3 * m,
  };
  if (stats.budget < 20) effects.budget = -2 * m;
  if (stats.environment < 15) effects.production = (effects.production || 0) - 1 * m;
  if (stats.marketStability < 15) effects.employment = (effects.employment || 0) - 1 * m;
  return effects;
}

export function checkCrisisTrigger(stats: GameStats): string | null {
  if (stats.budget <= 5) return 'debt_trap';
  if (stats.environment <= 5) return 'environmental_collapse';
  if (stats.employment <= 5 && stats.socialWelfare <= 10) return 'social_unrest';
  return null;
}
