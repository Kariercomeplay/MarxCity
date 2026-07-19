'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameEvent } from '@/types/game';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { STAT_LABELS, STAT_COLORS } from '@/lib/engine/constants';

interface EventPanelProps {
  event: GameEvent;
  onChoice: (choiceId: string) => void;
  disabled?: boolean;
}

export default function EventPanel({ event, onChoice, disabled }: EventPanelProps) {
  const [previewChoice, setPreviewChoice] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (choiceId: string) => {
    setSelectedId(choiceId);
    onChoice(choiceId);
  };

  const selectedChoice = event.choices.find(c => c.id === previewChoice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="red">Chương {event.chapter}</Badge>
          {event.cloReferences.map(clo => (
            <Badge key={clo} variant="purple" size="sm">{clo}</Badge>
          ))}
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{event.title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{event.scenario}</p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Bạn sẽ làm gì?</p>
        {event.choices.map((choice, idx) => {
          const isPreviewed = previewChoice === choice.id;
          return (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleClick(choice.id)}
              onMouseEnter={() => setPreviewChoice(choice.id)}
              onMouseLeave={() => setPreviewChoice(null)}
              disabled={disabled}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed group
                ${isPreviewed
                  ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-600 bg-white dark:bg-zinc-800/50'
                }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center transition-colors
                  ${isPreviewed
                    ? 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/50'
                  }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`font-medium text-sm ${isPreviewed ? 'text-red-800 dark:text-red-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {choice.label}
                  </span>
                  {/* Effect preview */}
                  {isPreviewed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 space-y-1"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(choice.effects)
                          .filter(([, v]) => v !== 0)
                          .map(([key, val]) => (
                            <span
                              key={key}
                              className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium
                                ${(val as number) > 0
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                            >
                              {(val as number) > 0 ? '+' : ''}{val}
                              <span className="opacity-70">{STAT_LABELS[key as keyof typeof STAT_LABELS]?.substring(0, 6) || key}</span>
                            </span>
                          ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(choice.stakeholderImpact || {})
                          .filter(([, v]) => v !== 0)
                          .map(([key, val]) => {
                            const labels: Record<string, string> = { workers: '👷 LĐ', businesses: '🏢 DN', state: '🏛 NN' };
                            return (
                              <span
                                key={key}
                                className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded-full font-medium
                                  ${(val as number) > 0
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                  }`}
                              >
                                {(val as number) > 0 ? '+' : ''}{val} {labels[key] || key}
                              </span>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedChoice && (
        <div className="text-xs text-zinc-400 italic text-center border-t border-zinc-100 dark:border-zinc-700 pt-3">
          Di chuột để xem trước tác động. Click để chọn.
        </div>
      )}
    </motion.div>
  );
}
