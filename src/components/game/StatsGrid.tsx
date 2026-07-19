'use client';

import { GameStats } from '@/types/game';
import StatBar from './StatBar';
import { STAT_LABELS, STAT_DESCRIPTIONS, STAT_COLORS } from '@/lib/engine/constants';

interface StatsGridProps {
  stats: GameStats;
  previousStats?: GameStats;
  className?: string;
  statKeys?: Array<keyof GameStats>;
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

export default function StatsGrid({ stats, previousStats, className, statKeys }: StatsGridProps) {
  const containerClass = className || "grid grid-cols-1 gap-2.5";
  const keysToRender = statKeys || (Object.keys(stats) as Array<keyof GameStats>);

  return (
    <div className={containerClass}>
      {keysToRender.map((key) => (
        <div
          key={key}
          className="bg-white dark:bg-zinc-800/80 rounded-2xl p-3 shadow-xs hover:shadow-sm border border-zinc-200/80 dark:border-zinc-700/60 transition-all duration-150 backdrop-blur-sm"
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
