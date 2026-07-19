import { Policies, GameStats, Difficulty } from '@/types/game';
import { MIN_STAT, MAX_STAT, DIFFICULTY_CONFIG } from './constants';

export function clampStat(value: number): number {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, Math.round(value)));
}

/**
 * Soft diminishing returns: linear near 0, sub-linear at extremes.
 * Input: -1 to +1. Output: -1 to +1, but squeezed at edges.
 */
function softDiminish(n: number): number {
  const clamped = Math.max(-1, Math.min(1, n));
  return Math.sign(clamped) * Math.pow(Math.abs(clamped), 0.75);
}

/**
 * POSITION-BASED policy effects.
 * Each policy's absolute value (relative to neutral=50) affects stats.
 * This means keeping tax=100 ALWAYS gives budget bonus + production penalty,
 * not just in the year you changed it.
 * 
 * softDiminish ensures diminishing returns — going 50→80 matters more than 80→100.
 */
export function applyPolicyEffects(
  policies: Policies,
  difficulty: Difficulty = 'normal'
): Record<string, number> {
  const m = DIFFICULTY_CONFIG[difficulty].effectMultiplier;
  const S = 1.0 * m; // base scale

  // Normalize 0-100 → -1 to +1 (50 = neutral)
  const norm = (v: number) => (v - 50) / 50;

  const tax = softDiminish(norm(policies.taxRate));
  const wage = softDiminish(norm(policies.minWage));
  const edu = softDiminish(norm(policies.eduInvestment));
  const infra = softDiminish(norm(policies.infraInvestment));
  const fdi = softDiminish(norm(policies.fdiPolicy));
  const env = softDiminish(norm(policies.envProtection));

  // Each stat = weighted sum of all policies
  // Positive weight = policy increase improves this stat
  // Negative weight = policy increase harms this stat
  const delta: Record<string, number> = {
    production:      (tax * -3.0 + wage * -1.5 + edu *  1.5 + infra *  4.0 + fdi *  2.0 + env * -0.5) * S,
    employment:      (tax * -1.5 + wage * -2.0 + edu *  1.0 + infra *  2.5 + fdi *  3.0 + env *  0.0) * S,
    socialWelfare:   (tax * -0.5 + wage *  3.0 + edu *  3.5 + infra *  0.5 + fdi * -0.5 + env *  1.0) * S,
    marketStability: (tax * -1.5 + wage *  0.5 + edu *  1.0 + infra *  1.0 + fdi * -1.5 + env *  0.5) * S,
    nationalCapacity:(tax *  0.0 + wage *  0.0 + edu *  3.0 + infra *  2.0 + fdi * -1.5 + env *  1.0) * S,
    environment:     (tax *  0.5 + wage *  0.0 + edu *  0.0 + infra * -1.0 + fdi * -2.5 + env *  4.0) * S,
    budget:          (tax *  4.0 + wage * -1.0 + edu * -2.0 + infra * -3.0 + fdi *  1.5 + env * -1.5) * S,
  };

  return delta;
}

export function applyStakeholderEffects(
  policies: Policies,
  difficulty: Difficulty = 'normal'
): Record<string, number> {
  const m = DIFFICULTY_CONFIG[difficulty].effectMultiplier;
  const S = 1.0 * m;
  const norm = (v: number) => (v - 50) / 50;

  const tax = softDiminish(norm(policies.taxRate));
  const wage = softDiminish(norm(policies.minWage));
  const edu = softDiminish(norm(policies.eduInvestment));
  const infra = softDiminish(norm(policies.infraInvestment));
  const fdi = softDiminish(norm(policies.fdiPolicy));
  const env = softDiminish(norm(policies.envProtection));

  return {
    workers:    (wage *  4.0 + edu *  2.0 + env *  1.0 + tax * -0.5 + fdi * -0.5) * S,
    businesses: (tax * -3.5 + wage * -2.5 + infra *  2.0 + fdi *  3.0 + env * -0.5) * S,
    state:      (tax *  3.0 + edu * -1.5 + infra * -2.0 + env *  1.0 + fdi *  0.5) * S,
  };
}

/**
 * List policy levers and their primary effects (for UI tooltips)
 */
export const POLICY_EFFECT_DESCRIPTIONS: Record<string, { label: string; icon: string; effects: string }> = {
  taxRate: {
    label: 'Thuế TNDN',
    icon: '💰',
    effects: 'Tăng → Ngân sách ↑ Mạnh · Sản xuất ↓ · Việc làm ↓ · DN ↓ Mạnh · Ổn định ↓',
  },
  minWage: {
    label: 'Lương tối thiểu',
    icon: '💵',
    effects: 'Tăng → Phúc lợi ↑ Mạnh · LĐ ↑ Mạnh · Việc làm ↓ · Sản xuất ↓ · DN ↓',
  },
  eduInvestment: {
    label: 'Đầu tư giáo dục',
    icon: '🎓',
    effects: 'Tăng → Tự chủ ↑ Mạnh · Phúc lợi ↑ Mạnh · Sản xuất ↑ · Ngân sách ↓ · Việc làm ↑',
  },
  infraInvestment: {
    label: 'Đầu tư hạ tầng',
    icon: '🏗️',
    effects: 'Tăng → Sản xuất ↑ Mạnh · Việc làm ↑ · Tự chủ ↑ · Ngân sách ↓ Mạnh · Môi trường ↓',
  },
  fdiPolicy: {
    label: 'Thu hút FDI',
    icon: '🌐',
    effects: 'Tăng → Việc làm ↑ · Sản xuất ↑ · DN ↑ · Tự chủ ↓ · Ổn định ↓ · Môi trường ↓ Mạnh',
  },
  envProtection: {
    label: 'Bảo vệ môi trường',
    icon: '🌿',
    effects: 'Tăng → Môi trường ↑ Mạnh · Tự chủ ↑ · Sản xuất ↓ · Ngân sách ↓ · DN ↓',
  },
};

export function calcBaseYearEffects(stats: GameStats, difficulty: Difficulty = 'normal'): Record<string, number> {
  const m = DIFFICULTY_CONFIG[difficulty].effectMultiplier;
  const effects: Record<string, number> = {
    production: 0.8 * m,
    employment: -0.5 * m,
    marketStability: -0.3 * m,
    environment: -0.5 * m,
    budget: -0.3 * m,
  };
  // Vicious cycles at low stats
  if (stats.budget < 20) effects.budget = (effects.budget || 0) - 3 * m;
  if (stats.environment < 15) effects.production = (effects.production || 0) - 2 * m;
  if (stats.marketStability < 15) effects.employment = (effects.employment || 0) - 2 * m;
  if (stats.employment < 15) effects.socialWelfare = (effects.socialWelfare || 0) - 2 * m;
  return effects;
}

export function checkCrisisTrigger(stats: GameStats): string | null {
  if (stats.budget <= 5) return 'debt_trap';
  if (stats.environment <= 5) return 'environmental_collapse';
  if (stats.employment <= 5 && stats.socialWelfare <= 10) return 'social_unrest';
  return null;
}
