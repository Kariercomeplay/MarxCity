'use client';

import { motion } from 'framer-motion';
import { GameEvent } from '@/types/game';
import Badge from '@/components/ui/Badge';

interface EventPanelProps {
  event: GameEvent;
  onChoice: (choiceId: string) => void;
  disabled?: boolean;
}

export default function EventPanel({ event, onChoice, disabled }: EventPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Scenario — like a story or news report */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="red">Chương {event.chapter}</Badge>
          {event.cloReferences.slice(0, 1).map(clo => (
            <Badge key={clo} variant="purple" size="sm">{clo}</Badge>
          ))}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{event.title}</h3>
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
          <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-sm sm:text-base">{event.scenario}</p>
        </div>
      </div>

      {/* Choices — labels only, no numbers, no previews */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Bạn sẽ làm gì?
        </p>

        {event.choices.map((choice, idx) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => onChoice(choice.id)}
            disabled={disabled}
            className="w-full text-left p-4 rounded-2xl border-2 border-zinc-200/90 dark:border-zinc-700/80 
              bg-white dark:bg-zinc-800/80 hover:border-red-300 dark:hover:border-red-600 
              hover:bg-red-50/30 dark:hover:bg-red-950/20 hover:shadow-md 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-start gap-3.5">
              <span className="w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm flex-shrink-0 
                bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300
                group-hover:bg-red-600 group-hover:text-white transition-colors">
                {String.fromCharCode(65 + idx)}
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-snug">
                  {choice.label}
                </h4>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
