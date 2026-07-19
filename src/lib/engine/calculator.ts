import { GameStats, StakeholderBalance, Ending, Difficulty } from '@/types/game';
import { ENDINGS } from './constants';

export function calcScore(
  stats: GameStats,
  stakeholderBalance: StakeholderBalance,
  quizCorrect: number,
  quizTotal: number,
  difficulty: Difficulty = 'normal'
): number {
  const economicWeight = 0.40;
  const socialWeight = 0.25;
  const balanceWeight = 0.15;
  const envWeight = 0.10;
  const quizWeight = 0.10;

  const economicScore = (stats.production + stats.nationalCapacity + stats.marketStability) / 3;
  const socialScore = (stats.employment + stats.socialWelfare) / 2;
  const envScore = stats.environment;
  const balanceScore = 100 - (
    Math.abs(stakeholderBalance.workers - stakeholderBalance.businesses)
    + Math.abs(stakeholderBalance.workers - stakeholderBalance.state)
    + Math.abs(stakeholderBalance.businesses - stakeholderBalance.state)
  ) / 3;
  const quizScore = quizTotal > 0 ? (quizCorrect / quizTotal) * 100 : 0;

  let total = economicScore * economicWeight
    + socialScore * socialWeight
    + balanceScore * balanceWeight
    + envScore * envWeight
    + quizScore * quizWeight;

  total += calcPenalties(stats, stakeholderBalance);

  const diffMultiplier = difficulty === 'hard' ? 1.15 : difficulty === 'easy' ? 0.85 : 1.0;
  return Math.max(0, Math.round(total * diffMultiplier));
}

function calcPenalties(stats: GameStats, balance: StakeholderBalance): number {
  let penalty = 0;
  if (stats.budget < 10) penalty -= 5;
  if (stats.budget < 5) penalty -= 10;
  if (stats.environment < 20) penalty -= 10;
  if (stats.environment < 10) penalty -= 15;
  if (Math.abs(balance.workers - balance.businesses) > 40) penalty -= 5;
  if (Math.abs(balance.workers - balance.businesses) > 60) penalty -= 10;
  if (stats.marketStability < 20) penalty -= 5;
  if (stats.employment < 10) penalty -= 5;
  return penalty;
}

export function getEnding(stats: GameStats, balance: StakeholderBalance): Ending {
  const highStats = Object.values(stats).filter(v => v >= 70).length;
  const score = calcScore(stats, balance, 0, 0);

  // Failure endings (checked first)
  if (stats.budget < 5 || (stats.marketStability < 10 && stats.budget < 15))
    return ENDINGS.find(e => e.id === 'debt_trap') || ENDINGS[0];
  if (stats.environment < 10)
    return ENDINGS.find(e => e.id === 'environmental_collapse') || ENDINGS[0];
  if (stats.employment < 10 && stats.socialWelfare < 15)
    return ENDINGS.find(e => e.id === 'social_unrest') || ENDINGS[0];
  if (stats.nationalCapacity < 15 && stats.production < 30)
    return ENDINGS.find(e => e.id === 'foreign_dependency') || ENDINGS[0];
  if (stats.marketStability < 15 && stats.budget < 15)
    return ENDINGS.find(e => e.id === 'economic_crisis') || ENDINGS[0];

  const imbalance = Math.abs(balance.workers - balance.businesses)
    + Math.abs(balance.businesses - balance.state)
    + Math.abs(balance.state - balance.workers);
  if (imbalance > 150) return ENDINGS.find(e => e.id === 'social_unrest') || ENDINGS[0];

  // Success endings
  if (highStats >= 5 && score >= 80) return ENDINGS.find(e => e.id === 'great_achievement') || ENDINGS[0];
  if (stats.production >= 80 && stats.nationalCapacity >= 70) return ENDINGS.find(e => e.id === 'industrial_power') || ENDINGS[0];
  if (stats.employment >= 75 && stats.socialWelfare >= 75) return ENDINGS.find(e => e.id === 'prosperous_society') || ENDINGS[0];
  if (stats.environment >= 70 && stats.production >= 65) return ENDINGS.find(e => e.id === 'sustainable_development') || ENDINGS[0];
  if (stats.nationalCapacity >= 70 && stats.budget >= 65) return ENDINGS.find(e => e.id === 'dragon_asia') || ENDINGS[0];

  // Neutral endings
  if (stats.marketStability >= 65) return ENDINGS.find(e => e.id === 'stability_first') || ENDINGS[0];
  if (stats.production >= 55) return ENDINGS.find(e => e.id === 'pragmatic') || ENDINGS[0];
  return ENDINGS.find(e => e.id === 'waiting') || ENDINGS[0];
}
