'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameEvent, GameStats } from '@/types/game';
import Badge from '@/components/ui/Badge';
import { STAT_LABELS } from '@/lib/engine/constants';

interface EventPanelProps {
  event: GameEvent;
  onChoice: (choiceId: string) => void;
  disabled?: boolean;
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

const STAKEHOLDER_LABELS: Record<string, { label: string; icon: string }> = {
  workers: { label: 'Người lao động', icon: '👷' },
  businesses: { label: 'Doanh nghiệp', icon: '🏢' },
  state: { label: 'Nhà nước', icon: '🏛️' },
};

export default function EventPanel({ event, onChoice, disabled }: EventPanelProps) {
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const handleClick = (choiceId: string) => {
    onChoice(choiceId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header tags & title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="red">Chương {event.chapter}</Badge>
          {event.cloReferences.map(clo => (
            <Badge key={clo} variant="purple" size="sm">{clo}</Badge>
          ))}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{event.title}</h3>
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
          <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-sm sm:text-base">{event.scenario}</p>
        </div>
      </div>

      {/* Choice Options */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Chọn giải pháp điều hành:
        </p>

        {event.choices.map((choice, idx) => {
          const isHovered = hoveredChoice === choice.id;
          return (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => handleClick(choice.id)}
              onMouseEnter={() => setHoveredChoice(choice.id)}
              onMouseLeave={() => setHoveredChoice(null)}
              disabled={disabled}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed group shadow-xs
                ${isHovered
                  ? 'border-red-500 bg-red-50/40 dark:bg-red-950/30 shadow-md scale-[1.01]'
                  : 'border-zinc-200/90 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 hover:border-red-300 dark:hover:border-red-600'
                }`}
            >
              <div className="flex items-start gap-3.5">
                <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm flex-shrink-0 transition-colors ${
                  isHovered
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>

                <div className="flex-1 space-y-2.5 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-snug">
                    {choice.label}
                  </h4>

                  {/* Impact Badges - Full label without truncation */}
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-700/50">
                    {/* Stat Effects */}
                    {Object.entries(choice.effects)
                      .filter(([, v]) => v !== 0)
                      .map(([key, val]) => {
                        const statLabel = STAT_LABELS[key as keyof typeof STAT_LABELS] || key;
                        const statIcon = STAT_ICONS[key as keyof typeof STAT_ICONS] || '';
                        const isPositive = (val as number) > 0;
                        return (
                          <span
                            key={key}
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                              isPositive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
                                : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40'
                            }`}
                          >
                            <span className="font-extrabold">{isPositive ? `+${val}` : val}</span>
                            <span>{statIcon} {statLabel}</span>
                          </span>
                        );
                      })}

                    {/* Stakeholder Impact */}
                    {Object.entries(choice.stakeholderImpact || {})
                      .filter(([, v]) => v !== 0)
                      .map(([key, val]) => {
                        const item = STAKEHOLDER_LABELS[key] || { label: key, icon: '' };
                        const isPositive = (val as number) > 0;
                        return (
                          <span
                            key={key}
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                              isPositive
                                ? 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40'
                                : 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
                            }`}
                          >
                            <span className="font-extrabold">{isPositive ? `+${val}` : val}</span>
                            <span>{item.icon} {item.label}</span>
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="text-xs text-zinc-400 italic text-center border-t border-zinc-100 dark:border-zinc-800 pt-3">
        Mỗi lựa chọn đều có sự đánh đổi giữa các chỉ số kinh tế và nhóm lợi ích. Click để đưa ra quyết định.
      </div>
    </motion.div>
  );
}
