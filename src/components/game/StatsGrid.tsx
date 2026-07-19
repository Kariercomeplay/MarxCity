'use client';

import { GameStats } from '@/types/game';
import StatBar from './StatBar';
import { STAT_LABELS, STAT_DESCRIPTIONS, STAT_COLORS } from '@/lib/engine/constants';

interface StatsGridProps {
  stats: GameStats;
  previousStats?: GameStats;
}

export default function StatsGrid({ stats, previousStats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {(Object.keys(stats) as Array<keyof GameStats>).map((key) => (
        <div key={key} className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <StatBar
            label={STAT_LABELS[key]}
            value={stats[key]}
            description={STAT_DESCRIPTIONS[key]}
            color={STAT_COLORS[key]}
            previousValue={previousStats?.[key]}
          />
        </div>
      ))}
    </div>
  );
}
