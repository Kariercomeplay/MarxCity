'use client';

import { motion } from 'framer-motion';
import { StakeholderBalance } from '@/types/game';

interface StakeholderMeterProps {
  balance: StakeholderBalance;
}

const groups = [
  { key: 'workers' as const, label: 'Người lao động', sub: 'Tiền lương & Phúc lợi', color: '#3b82f6', icon: '👷' },
  { key: 'businesses' as const, label: 'Doanh nghiệp', sub: 'Lợi nhuận & Cạnh tranh', color: '#f59e0b', icon: '🏢' },
  { key: 'state' as const, label: 'Nhà nước', sub: 'Ngân sách & Quản trị', color: '#ef4444', icon: '🏛️' },
];

export default function StakeholderMeter({ balance }: StakeholderMeterProps) {
  const values = [balance.workers, balance.businesses, balance.state];
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const diff = maxVal - minVal;

  let statusBadge = { label: '🌿 Hài hòa', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200' };
  if (diff > 25) {
    statusBadge = { label: '🚨 Mất cân bằng', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200' };
  } else if (diff > 15) {
    statusBadge = { label: '⚠️ Chênh lệch', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200' };
  }

  return (
    <div className="bg-white dark:bg-zinc-800/80 rounded-2xl p-4 shadow-sm border border-zinc-200/80 dark:border-zinc-700/60 space-y-4 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Cán Cân Lợi Ích</h3>
          <p className="text-[11px] text-zinc-400">3 Lực lượng xã hội</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge.color}`}>
          {statusBadge.label}
        </span>
      </div>

      <div className="space-y-3.5">
        {groups.map(({ key, label, sub, color, icon }) => {
          const val = Math.round(balance[key]);
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{icon}</span>
                  <div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{label}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-1.5 hidden xs:inline">{sub}</span>
                  </div>
                </div>
                <span className="font-extrabold text-sm tabular-nums" style={{ color }}>
                  {val}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-700/60 rounded-full overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full"
                  initial={false}
                  animate={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
