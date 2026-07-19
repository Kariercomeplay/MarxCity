'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStats } from '@/types/game';
import { getReactions, getEventReactionHeadline, getEventIcon } from '@/lib/engine/stakeholderReactions';
import { STAT_LABELS, STAT_COLORS, CLO_LABELS } from '@/lib/engine/constants';
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

type Phase = 'headline' | 'stats' | 'reactions' | 'explanation';

export default function ConsequenceScreen({
  eventTitle, eventScenario, choiceLabel,
  statsBefore, statsAfter, effectsApplied,
  stakeholderImpact, explanation, onContinue,
}: ConsequenceScreenProps) {
  const [phase, setPhase] = useState<Phase>('headline');
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  const headline = getEventReactionHeadline(eventTitle, choiceLabel);
  const eventIcon = getEventIcon(eventTitle);
  const reactions = getReactions(stakeholderImpact);

  const statEntries = (Object.keys(statsBefore) as (keyof GameStats)[]).filter(
    k => statsBefore[k] !== undefined
  );

  const nextPhase = () => {
    if (phase === 'headline') setPhase('stats');
    else if (phase === 'stats') setPhase('reactions');
    else if (phase === 'reactions') setPhase('explanation');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
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
                className="text-center space-y-5 py-8"
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
                  <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider">HẬU QUẢ KINH TẾ</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
                    {headline}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    &ldquo;{choiceLabel}&rdquo;
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={nextPhase}>
                    Xem chỉ số thay đổi
                  </Button>
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
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center mb-4">
                  CÁC CHỈ SỐ KINH TẾ THAY ĐỔI
                </p>
                <div className="space-y-3">
                  {statEntries.map((key, i) => {
                    const before = statsBefore[key];
                    const after = statsAfter[key];
                    const diff = after - before;
                    const beforePct = (before / 100) * 100;
                    const afterPct = (after / 100) * 100;
                    const hasEffect = diff !== 0;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
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
                              transition={{ delay: 0.4 + i * 0.06 }}
                              className={`text-sm font-bold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-zinc-400'}`}
                            >
                              → {after}
                              {hasEffect && <span className="ml-1">({diff > 0 ? '+' : ''}{diff})</span>}
                            </motion.span>
                          </div>
                        </div>
                        <div className="relative h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-0 rounded-full opacity-30"
                            style={{ width: `${beforePct}%`, backgroundColor: STAT_COLORS[key] }}
                          />
                          <motion.div
                            initial={{ width: `${beforePct}%` }}
                            animate={{ width: `${afterPct}%` }}
                            transition={{ duration: 1, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : STAT_COLORS[key],
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex justify-center pt-4">
                  <Button onClick={nextPhase} variant="secondary">
                    {reactions.length > 0 ? 'Xem phản ứng từ các bên' : 'Xem phân tích'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3: Stakeholder Reactions */}
          <AnimatePresence mode="wait">
            {phase === 'reactions' && (
              <motion.div
                key="reactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {reactions.length > 0 ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center mb-2">
                      PHẢN ỨNG TỪ CÁC BÊN LIÊN QUAN
                    </p>
                    <div className="space-y-3">
                      {reactions.map((r, i) => (
                        <motion.div
                          key={r.group}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className={`p-3.5 rounded-xl border text-sm flex items-start gap-3 ${
                            r.sentiment === 'positive'
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                              : r.sentiment === 'negative'
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{r.icon}</span>
                          <div>
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{r.group}</p>
                            <p className={`text-sm mt-0.5 leading-relaxed ${
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
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-zinc-400 text-sm">Không có phản ứng đáng kể từ các bên liên quan.</p>
                  </div>
                )}
                <div className="flex justify-center pt-2">
                  <Button onClick={nextPhase}>Xem phân tích lý luận</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: Cố vấn lý luận */}
          <AnimatePresence mode="wait">
            {phase === 'explanation' && (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">CỐ VẤN LÝ LUẬN</span>
                    <span className="text-[10px] text-zinc-300 dark:text-zinc-500 italic">
                      — Kinh tế chính trị Mác-Lênin
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {showFullExplanation ? explanation.content : explanation.content.slice(0, 250) + (explanation.content.length > 250 ? '...' : '')}
                  </p>
                  {explanation.content.length > 250 && (
                    <button
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="text-xs text-red-600 hover:text-red-700 mt-1.5 font-medium"
                    >
                      {showFullExplanation ? 'Thu gọn' : 'Đọc thêm'}
                    </button>
                  )}
                </div>

                {explanation.cloReferences.length > 0 && (
                  <div className="group relative inline-block">
                    <span className="text-xs text-zinc-400 cursor-help border-b border-dotted border-zinc-300 dark:border-zinc-600">
                      📖 Cơ sở lý luận
                    </span>
                    <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10 w-64">
                      <div className="bg-zinc-900 dark:bg-zinc-700 text-white text-xs rounded-lg p-3 shadow-lg space-y-1.5">
                        {explanation.cloReferences.map(clo => (
                          <div key={clo}>
                            <span className="font-bold text-purple-300">{clo}:</span>{' '}
                            <span>{CLO_LABELS[clo] || ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {explanation.conceptTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {explanation.conceptTags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* End of year summary */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">TỔNG KẾT</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-zinc-600 dark:text-zinc-400">Sự kiện:</div>
                    <div className="text-right font-medium text-zinc-800 dark:text-zinc-200 truncate">{eventTitle}</div>
                    <div className="text-zinc-600 dark:text-zinc-400">Lựa chọn:</div>
                    <div className="text-right font-medium text-zinc-800 dark:text-zinc-200 truncate">{choiceLabel}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={onContinue} size="lg">
                    Kết thúc năm → Xem tổng quan
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
