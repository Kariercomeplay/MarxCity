'use client';

import { motion } from 'framer-motion';
import { GameState, TurnResult, GameStats } from '@/types/game';
import { calcScore, getTitle, getTitleDescription } from '@/lib/engine/calculator';
import { STAT_LABELS, STAT_COLORS } from '@/lib/engine/constants';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Button from '@/components/ui/Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ReportViewProps {
  stats: GameStats;
  history: TurnResult[];
  stakeholderBalance: { workers: number; businesses: number; state: number };
  quizCorrect: number;
  quizTotal: number;
  onPlayAgain: () => void;
}

export default function ReportView({ stats, history, stakeholderBalance, quizCorrect, quizTotal, onPlayAgain }: ReportViewProps) {
  const score = calcScore(stats, stakeholderBalance, quizCorrect, quizTotal);
  const title = getTitle(stats);
  const titleDesc = getTitleDescription(title);

  const labels = history.map(h => `Lượt ${h.turnNumber}`);
  const allStats = Object.keys(stats) as (keyof GameStats)[];

  const datasets = allStats.map(key => ({
    label: STAT_LABELS[key],
    data: history.map(h => h.statsAfter[key]),
    borderColor: STAT_COLORS[key],
    backgroundColor: STAT_COLORS[key] + '20',
    tension: 0.4,
    fill: false,
    pointRadius: 2,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white">BÁO CÁO CUỐI GAME</h1>
          <div className="inline-block px-6 py-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{title}</p>
            <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">{titleDesc}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">{score}</div>
            <div className="text-xs text-zinc-500 mt-1">Tổng điểm</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{stats.production}</div>
            <div className="text-xs text-zinc-500 mt-1">{STAT_LABELS.production}</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.employment}</div>
            <div className="text-xs text-zinc-500 mt-1">{STAT_LABELS.employment}</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{stats.environment}</div>
            <div className="text-xs text-zinc-500 mt-1">{STAT_LABELS.environment}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-4">Biểu đồ phát triển</h2>
          <div className="h-64">
            <Line
              data={{ labels, datasets }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
                },
                scales: {
                  y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {allStats.map(key => (
            <div key={key} className="bg-white dark:bg-zinc-800 rounded-xl p-3 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAT_COLORS[key] }} />
                <span className="text-xs text-zinc-500">{STAT_LABELS[key]}</span>
              </div>
              <div className="text-lg font-bold" style={{ color: STAT_COLORS[key] }}>{stats[key]}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-3">Lịch sử các lượt</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map((turn, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                <span className="text-xs font-bold text-zinc-400 w-12">Lượt {turn.turnNumber}</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1 truncate">{turn.eventId}</span>
                <span className="text-xs text-zinc-400">{turn.selectedChoiceId}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button size="lg" onClick={onPlayAgain}>Chơi lại</Button>
        </motion.div>
      </div>
    </div>
  );
}
