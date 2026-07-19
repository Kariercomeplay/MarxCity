'use client';

import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  description: string;
  color?: string;
  previousValue?: number;
  icon?: string;
}

export default function StatBar({ label, value, description, color, previousValue, icon }: StatBarProps) {
  const barColor = color || '#3b82f6';
  const diff = previousValue !== undefined ? value - previousValue : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-xs"
              style={{ backgroundColor: `${barColor}18`, color: barColor }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">{label}</h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <motion.span
            key={value}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-base font-black tabular-nums"
            style={{ color: barColor }}
          >
            {value}
          </motion.span>
          {diff !== 0 && (
            <motion.span
              initial={{ opacity: 0, y: diff > 0 ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                diff > 0
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
              }`}
            >
              {diff > 0 ? `↑ +${diff}` : `↓ ${diff}`}
            </motion.span>
          )}
        </div>
      </div>

      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 shadow-inner">
        <motion.div
          className="h-full rounded-full shadow-xs"
          initial={false}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ type: 'spring', damping: 22, stiffness: 120 }}
          style={{ backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
