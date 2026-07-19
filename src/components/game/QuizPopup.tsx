'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface QuizPopupProps {
  isOpen: boolean;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onAnswer: (correct: boolean, selectedIndex: number) => void;
  onClose: () => void;
}

export default function QuizPopup({
  isOpen,
  question,
  options,
  correctIndex,
  explanation,
  onAnswer,
  onClose,
}: QuizPopupProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === correctIndex;
    onAnswer(correct, idx);
  };

  const handleClose = () => {
    setSelected(null);
    setAnswered(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                QUIZ
              </span>
              <span className="text-xs text-zinc-400">Kiểm tra kiến thức</span>
            </div>

            <p className="text-base font-semibold text-zinc-900 dark:text-white">{question}</p>

            <div className="space-y-2">
              {options.map((opt, idx) => {
                let style = 'border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-600';
                if (answered && idx === correctIndex) style = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                else if (answered && idx === selected && idx !== correctIndex) style = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                else if (selected === idx) style = 'border-red-500';

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${style} 
                      ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className={`text-sm font-semibold ${selected === correctIndex ? 'text-green-600' : 'text-red-600'}`}>
                  {selected === correctIndex ? 'Chính xác!' : 'Chưa chính xác.'}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed break-words whitespace-pre-wrap">{explanation}</p>
                <Button onClick={handleClose} className="w-full">Tiếp tục</Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
