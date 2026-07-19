import { GameStats, StakeholderBalance } from '@/types/game';
import { MAX_STAT } from './constants';

export function calcScore(
  stats: GameStats,
  stakeholderBalance: StakeholderBalance,
  quizCorrect: number,
  quizTotal: number
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

  const penalties = calcPenalties(stats, stakeholderBalance);
  total += penalties;

  return Math.max(0, Math.round(total));
}

function calcPenalties(stats: GameStats, balance: StakeholderBalance): number {
  let penalty = 0;
  if (stats.budget < 10) penalty -= 5;
  if (stats.environment < 20) penalty -= 10;
  if (Math.abs(balance.workers - balance.businesses) > 40) penalty -= 5;
  if (Math.abs(balance.workers - balance.state) > 40) penalty -= 3;
  if (stats.marketStability < 20) penalty -= 5;
  return penalty;
}

export function getTitle(stats: GameStats): string {
  const highStats = Object.entries(stats)
    .filter(([, v]) => v >= 70)
    .map(([k]) => k);

  if (highStats.length >= 6) return 'Nhà hoạch định hài hòa';
  if (stats.production >= 80 && stats.nationalCapacity >= 70) return 'Nhà hiện đại hóa';
  if (stats.employment >= 75 && stats.socialWelfare >= 75) return 'Nhà nước phúc lợi';
  if (stats.environment >= 70 && stats.production >= 65) return 'Kiến trúc sư phát triển bền vững';
  if (stats.nationalCapacity >= 65 && stats.production >= 60) return 'Nhà công nghiệp hóa';
  if (stats.marketStability >= 70 && stats.budget >= 60) return 'Nhà điều hành thận trọng';
  if (stats.socialWelfare >= 75 && stats.environment >= 60) return 'Nhà bảo vệ công bằng xã hội';
  return 'Nhà hoạch định kinh tế';
}

export function getTitleDescription(title: string): string {
  const descriptions: Record<string, string> = {
    'Nhà hoạch định hài hòa': 'Bạn đã đạt được sự cân bằng xuất sắc giữa tăng trưởng, phúc lợi và môi trường.',
    'Nhà hiện đại hóa': 'Bạn đã thúc đẩy công nghiệp hóa và nâng cao năng lực công nghệ quốc gia.',
    'Nhà nước phúc lợi': 'Bạn ưu tiên việc làm và phúc lợi xã hội, xây dựng nền tảng an sinh vững chắc.',
    'Kiến trúc sư phát triển bền vững': 'Bạn đã cân bằng giữa tăng trưởng kinh tế và bảo vệ môi trường.',
    'Nhà công nghiệp hóa': 'Bạn đã thúc đẩy mạnh mẽ quá trình công nghiệp hóa và nâng cao năng lực sản xuất.',
    'Nhà điều hành thận trọng': 'Bạn quản lý ổn định thị trường và ngân sách một cách thận trọng, bền vững.',
    'Nhà bảo vệ công bằng xã hội': 'Bạn ưu tiên phúc lợi xã hội và bảo vệ môi trường trong phát triển.',
    'Nhà hoạch định kinh tế': 'Bạn đã hoàn thành hành trình điều hành nền kinh tế.',
  };
  return descriptions[title] || '';
}
