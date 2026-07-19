'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStats } from '@/types/game';
import { getReactions, getEventReactionHeadline, getEventIcon } from '@/lib/engine/stakeholderReactions';
import { STAT_LABELS, STAT_COLORS, CLO_LABELS } from '@/lib/engine/constants';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ConsequenceScreenProps {
  eventTitle: string;
  eventScenario: string;
  choiceLabel: string;
  statsBefore: GameStats;
  statsAfter: GameStats;
  effectsApplied: Record<string, number>;
  stakeholderImpact: Record<string, number>;
  explanation: {
    content: string;
    cloReferences: string[];
    conceptTags: string[];
    learningObjectives: string[];
  };
  onContinue: () => void;
}

type Phase = 'headline' | 'stats' | 'reactions' | 'explanation' | 'done';

export default function ConsequenceScreen({
  eventTitle, eventScenario, choiceLabel,
  statsBefore, statsAfter, effectsApplied,
  stakeholderImpact, explanation, onContinue,
}: ConsequenceScreenProps) {
  const [phase, setPhase] = useState<Phase>('headline');
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const headline = getEventReactionHeadline(eventTitle, choiceLabel);
  const eventIcon = getEventIcon(eventTitle);
  const reactions = getReactions(stakeholderImpact);

  // Auto-advance phases
  useEffect(() => {
    const go = (next: Phase, delay: number) => {
      timerRef.current = setTimeout(() => setPhase(next), delay);
    };
    if (phase === 'headline') go('stats', 1800);
    else if (phase === 'stats') go('reactions', 2500);
    else if (phase === 'reactions') go('explanation', 2000 + reactions.length * 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, reactions.length]);

  const statEntries = (Object.keys(statsBefore) as (keyof GameStats)[]).filter(
    k => statsBefore[k] !== undefined
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget && phase === 'done') onContinue(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8 space-y-6">
          {/* Phase 1: Headline */}
          <AnimatePresence mode="wait">
            {phase === 'headline' && (
              <motion.div
                key="headline"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-4 py-8"
              >
                <motion.span
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  className="text-6xl block"
                >
                  {eventIcon}
                </motion.span>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">HẬU QUẢ KINH TẾ</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
                    {headline}
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-4">
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Stat Bars */}
          <AnimatePresence mode="wait">
            {phase === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center mb-4">
                  CÁC CHỈ SỐ KINH TẾ THAY ĐỔI
                </p>
                <div className="space-y-2.5">
                  {statEntries.map((key, i) => {
                    const before = statsBefore[key];
                    const after = statsAfter[key];
                    const diff = after - before;
                    const maxVal = 100;
                    const beforePct = (before / maxVal) * 100;
                    const afterPct = (after / maxVal) * 100;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAT_COLORS[key] }} />
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{STAT_LABELS[key]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400">{before}</span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className={`text-sm font-bold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-zinc-400'}`}
                            >
                              {diff > 0 ? `→ ${after} (+${diff})` : diff < 0 ? `→ ${after} (${diff})` : `→ ${after}`}
                            </motion.span>
                          </div>
                        </div>
                        <div className="relative h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          {/* Before bar */}
                          <div
                            className="absolute inset-0 rounded-full opacity-40"
                            style={{ width: `${beforePct}%`, backgroundColor: STAT_COLORS[key] }}
                          />
                          {/* After bar (animated) */}
                          <motion.div
                            initial={{ width: `${beforePct}%` }}
                            animate={{ width: `${afterPct}%` }}
                            transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : STAT_COLORS[key] }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3: Stakeholder Reactions */}
          <AnimatePresence mode="wait">
            {phase === 'reactions' && reactions.length > 0 && (
              <motion.div
                key="reactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center mb-2">
                  PHẢN ỨNG TỪ CÁC BÊN LIÊN QUAN
                </p>
                <div className="space-y-2">
                  {reactions.map((r, i) => (
                    <motion.div
                      key={r.group}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className={`p-3 rounded-xl border text-sm flex items-start gap-3 ${
                        r.sentiment === 'positive'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                          : r.sentiment === 'negative'
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{r.icon}</span>
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{r.group}</p>
                        <p className={`text-xs mt-0.5 ${
                          r.sentiment === 'positive' ? 'text-emerald-700 dark:text-emerald-300' :
                          r.sentiment === 'negative' ? 'text-rose-700 dark:text-rose-300' :
                          'text-zinc-500'
                        }`}>
                          {r.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: Explanation */}
          <AnimatePresence mode="wait">
            {phase === 'explanation' && (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">CỐ VẤN LÝ LUẬN</span>
                    <span className="text-[10px] text-zinc-300 dark:text-zinc-500 italic">
                      — Phân tích dựa trên Kinh tế chính trị Mác-Lênin
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {showFullExplanation ? explanation.content : explanation.content.slice(0, 200) + (explanation.content.length > 200 ? '...' : '')}
                  </p>
                  {explanation.content.length > 200 && (
                    <button
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="text-xs text-red-600 hover:text-red-700 mt-1 font-medium"
                    >
                      {showFullExplanation ? 'Thu gọn' : 'Đọc thêm'}
                    </button>
                  )}
                </div>

                {/* CLO badges */}
                {explanation.cloReferences.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {explanation.cloReferences.map(clo => (
                      <div key={clo} className="group relative">
                        <Badge variant="purple" size="sm">{clo}</Badge>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                          <div className="bg-zinc-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                            {CLO_LABELS[clo] || ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Concepts */}
                {explanation.conceptTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {explanation.conceptTags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={onContinue}>
                    Tiếp tục
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick click-to-skip during animation */}
          {(phase === 'stats' || phase === 'reactions') && (
            <div className="text-center">
              <button
                onClick={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  setPhase('explanation');
                }}
                className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Bỏ qua →
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
