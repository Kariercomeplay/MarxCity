'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { CLO_LABELS } from '@/lib/engine/constants';

interface ExplanationBoxProps {
  isOpen: boolean;
  content: string;
  cloReferences: string[];
  conceptTags: string[];
  learningObjectives: string[];
  onClose: () => void;
}

export default function ExplanationBox({
  isOpen,
  content,
  cloReferences,
  conceptTags,
  learningObjectives,
  onClose,
}: ExplanationBoxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="bg-white dark:bg-zinc-800/90 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-700/60 overflow-hidden backdrop-blur-md"
        >
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg font-bold">
                  📜
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Cố Vấn Lý Luận KTCT</h4>
                  <p className="text-[11px] text-zinc-400">Góc nhìn lý luận Mác-Lênin & Thực tiễn</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30">
              <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed italic">
                "{content}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cloReferences.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Mục tiêu CLO</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cloReferences.map(clo => (
                      <div key={clo} className="group relative">
                        <Badge variant="purple" size="sm">{clo}</Badge>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20">
                          <div className="bg-zinc-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl border border-zinc-700">
                            {CLO_LABELS[clo] || ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {conceptTags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Khái niệm cốt lõi</span>
                  <div className="flex flex-wrap gap-1.5">
                    {conceptTags.map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-medium">
                        #{tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {learningObjectives.length > 0 && (
              <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-700/60 pt-3">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Mục tiêu học tập</span>
                <ul className="space-y-1">
                  {learningObjectives.map((obj, i) => (
                    <li key={i} className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
