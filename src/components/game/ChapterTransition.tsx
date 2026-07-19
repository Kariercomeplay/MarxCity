'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CLO_LABELS } from '@/lib/engine/constants';

interface ChapterTransitionProps {
  chapterId: number;
  chapterName: string;
  cloTags: string[];
  onContinue: () => void;
}

export default function ChapterTransition({ chapterId, chapterName, cloTags, onContinue }: ChapterTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center space-y-6"
      >
        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {chapterId === 1 ? 'Bắt đầu' : `Chương ${chapterId - 1} hoàn thành`}
          </span>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            Chương {chapterId}
          </h2>
          <p className="text-lg text-red-600 font-semibold">{chapterName}</p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CLO áp dụng</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {cloTags.map(clo => (
              <div key={clo} className="group relative">
                <Badge variant="purple">{clo}</Badge>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                  <div className="bg-zinc-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg max-w-xs">
                    {CLO_LABELS[clo] || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {chapterId > 1 && (
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i < chapterId ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              />
            ))}
          </div>
        )}

        <Button size="lg" onClick={onContinue}>
          {chapterId === 1 ? 'Bắt đầu chương 1' : 'Tiếp tục'}
        </Button>
      </motion.div>
    </motion.div>
  );
}
