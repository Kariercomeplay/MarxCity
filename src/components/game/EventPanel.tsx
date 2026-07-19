'use client';

import { motion } from 'framer-motion';
import { GameEvent } from '@/types/game';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface EventPanelProps {
  event: GameEvent;
  onChoice: (choiceId: string) => void;
  disabled?: boolean;
}

export default function EventPanel({ event, onChoice, disabled }: EventPanelProps) {
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
        {event.choices.map((choice, idx) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onChoice(choice.id)}
            disabled={disabled}
            className="w-full text-left p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 
              hover:border-red-500 dark:hover:border-red-400 
              bg-white dark:bg-zinc-800/50
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              group"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 
                text-red-700 dark:text-red-400 text-sm font-bold flex items-center justify-center
                group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                {String.fromCharCode(65 + idx)}
              </span>
              <div>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{choice.label}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
