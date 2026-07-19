'use client';

import { GameStats } from '@/types/game';
import StatBar from './StatBar';
import { STAT_LABELS, STAT_DESCRIPTIONS, STAT_COLORS } from '@/lib/engine/constants';

interface StatsGridProps {
  stats: GameStats;
  previousStats?: GameStats;
}

const STAT_ICONS: Record<keyof GameStats, string> = {
  production: '🏭',
  employment: '💼',
  socialWelfare: '🤝',
  marketStability: '📈',
  nationalCapacity: '🛡️',
  environment: '🌿',
  budget: '🏛️',
};

export default function StatsGrid({ stats, previousStats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
      {(Object.keys(stats) as Array<keyof GameStats>).map((key) => (
        <div
          key={key}
          className="bg-white dark:bg-zinc-800/80 rounded-2xl p-3.5 shadow-sm hover:shadow-md border border-zinc-200/80 dark:border-zinc-700/60 transition-all duration-200 backdrop-blur-sm"
        >
          <StatBar
            label={STAT_LABELS[key]}
            value={stats[key]}
            description={STAT_DESCRIPTIONS[key]}
            color={STAT_COLORS[key]}
            previousValue={previousStats?.[key]}
            icon={STAT_ICONS[key]}
          />
        </div>
      ))}
    </div>
  );
}
