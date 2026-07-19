'use client';

import { motion } from 'framer-motion';
import { StakeholderBalance } from '@/types/game';

interface StakeholderMeterProps {
  balance: StakeholderBalance;
}

const groups = [
  { key: 'workers' as const, label: 'Người lao động', color: '#3b82f6', icon: '👷' },
  { key: 'businesses' as const, label: 'Doanh nghiệp', color: '#f59e0b', icon: '🏢' },
  { key: 'state' as const, label: 'Nhà nước', color: '#ef4444', icon: '🏛' },
];

export default function StakeholderMeter({ balance }: StakeholderMeterProps) {
  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">Cân bằng lợi ích</h3>
      <div className="space-y-3">
        {groups.map(({ key, label, color, icon }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">{icon} {label}</span>
              <span className="font-bold" style={{ color }}>{Math.round(balance[key])}</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={false}
                animate={{ width: `${balance[key]}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
