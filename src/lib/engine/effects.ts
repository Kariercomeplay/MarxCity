import { Policies, GameStats, StakeholderBalance } from '@/types/game';
import { MIN_STAT, MAX_STAT } from './constants';

export function clampStat(value: number): number {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, Math.round(value)));
}

export function clampStats(stats: Partial<GameStats>): GameStats {
  const result: any = {};
  for (const [key, value] of Object.entries(stats)) {
    result[key] = clampStat(value as number);
  }
  return result as GameStats;
}

export type PolicyEffect = {
  production: number;
  employment: number;
  socialWelfare: number;
  marketStability: number;
  nationalCapacity: number;
  environment: number;
  budget: number;
  stakeholderWorkers: number;
  stakeholderBusinesses: number;
  stakeholderState: number;
};

export function applyPolicyEffects(policies: Policies, prevPolicies: Policies): Partial<Record<string, number>> {
  const delta: Record<string, number> = {};
  const taxDiff = policies.taxRate - prevPolicies.taxRate;
  const wageDiff = policies.minWage - prevPolicies.minWage;
  const eduDiff = policies.eduInvestment - prevPolicies.eduInvestment;
  const infraDiff = policies.infraInvestment - prevPolicies.infraInvestment;
  const fdiDiff = policies.fdiPolicy - prevPolicies.fdiPolicy;
  const envDiff = policies.envProtection - prevPolicies.envProtection;

  const TAX_FACTOR = 0.1;
  const WAGE_FACTOR = 0.08;
  const EDU_FACTOR = 0.12;
  const INFRA_FACTOR = 0.1;
  const FDI_FACTOR = 0.08;
  const ENV_FACTOR = 0.1;

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

export function applyStakeholderEffects(policies: Policies, prevPolicies: Policies): Partial<Record<string, number>> {
  const taxDiff = policies.taxRate - prevPolicies.taxRate;
  const wageDiff = policies.minWage - prevPolicies.minWage;
  const eduDiff = policies.eduInvestment - prevPolicies.eduInvestment;
  const infraDiff = policies.infraInvestment - prevPolicies.infraInvestment;
  const fdiDiff = policies.fdiPolicy - prevPolicies.fdiPolicy;
  const envDiff = policies.envProtection - prevPolicies.envProtection;

  const FACTOR = 0.1;

  return {
    workers: (wageDiff * FACTOR * 0.5) + (eduDiff * FACTOR * 0.3) + (fdiDiff * FACTOR * -0.1) + (envDiff * FACTOR * 0.2),
    businesses: (taxDiff * FACTOR * -0.5) + (wageDiff * FACTOR * -0.4) + (fdiDiff * FACTOR * 0.4) + (infraDiff * FACTOR * 0.3),
    state: (taxDiff * FACTOR * 0.4) + (eduDiff * FACTOR * -0.2) + (infraDiff * FACTOR * -0.3) + (envDiff * FACTOR * 0.2),
  };
}

export function calcBaseTurnEffects(budget: number): Partial<Record<string, number>> {
  const effects: Record<string, number> = {};
  effects.production = 0.5;
  effects.employment = -0.3;
  effects.marketStability = -0.2;
  effects.environment = -0.3;
  if (budget < 10) effects.budget = -2;
  return effects;
}
