'use client';

import { motion } from 'framer-motion';
import { STAT_COLORS } from '@/lib/engine/constants';

interface StatBarProps {
  label: string;
  value: number;
  description: string;
  color?: string;
  previousValue?: number;
}

export default function StatBar({ label, value, description, color, previousValue }: StatBarProps) {
  const barColor = color || '#3b82f6';
  const diff = previousValue !== undefined ? value - previousValue : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2">{description}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold tabular-nums"
            style={{ color: barColor }}
          >
            {value}
          </motion.span>
          {diff !== 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-xs font-bold ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {diff > 0 ? `+${diff}` : diff}
            </motion.span>
          )}
        </div>
      </div>
      <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
