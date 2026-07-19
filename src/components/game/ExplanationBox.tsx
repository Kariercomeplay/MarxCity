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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
        >
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Cố vấn lý luận</span>
                <span className="text-xs text-zinc-400">Phân tích dựa trên Kinh tế chính trị Mác-Lênin</span>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{content}</p>

            {cloReferences.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CLO áp dụng</span>
                <div className="flex flex-wrap gap-1.5">
                  {cloReferences.map(clo => (
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
              </div>
            )}

            {conceptTags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Khái niệm</span>
                <div className="flex flex-wrap gap-1.5">
                  {conceptTags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                      {tag.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {learningObjectives.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mục tiêu học tập</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {learningObjectives.map((obj, i) => (
                    <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400">{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-zinc-400 italic border-t border-zinc-100 dark:border-zinc-700 pt-3">
              Các chỉ số trong MarxCity được đơn giản hóa nhằm phục vụ mục tiêu học tập.
              Kết quả không đại diện cho dự báo kinh tế thực tế.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
