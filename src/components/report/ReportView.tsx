'use client';

import { motion } from 'framer-motion';
import { GameState, TurnResult, GameStats } from '@/types/game';
import { calcScore, getEnding } from '@/lib/engine/calculator';
import { STAT_LABELS, STAT_COLORS, CLO_LABELS } from '@/lib/engine/constants';
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
  const ending = getEnding(stats, stakeholderBalance);
  const title = ending.title;
  const titleDesc = ending.description;

  const labels = history.map(h => `Năm ${h.year}`);
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">BÁO CÁO CUỐI GAME</h1>
          <div className="inline-block px-6 py-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
            <p className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400">{title}</p>
            <p className="text-xs sm:text-sm text-red-600/70 dark:text-red-400/70 mt-1 max-w-md">{titleDesc}</p>
          </div>
        </motion.div>

        {/* Score board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
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

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-4 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">Biểu đồ phát triển</h2>
          <div className="h-48 sm:h-64">
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

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {allStats.map(key => (
            <div key={key} className="bg-white dark:bg-zinc-800 rounded-xl p-3 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAT_COLORS[key] }} />
                <span className="text-xs text-zinc-500 truncate">{STAT_LABELS[key]}</span>
              </div>
              <div className="text-lg font-bold" style={{ color: STAT_COLORS[key] }}>{stats[key]}</div>
            </div>
          ))}
        </motion.div>

        {/* Stakeholder balance + Quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
          >
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">Cân bằng lợi ích</h3>
            {[
              { key: 'workers' as const, label: 'Người lao động 👷', color: '#3b82f6' },
              { key: 'businesses' as const, label: 'Doanh nghiệp 🏢', color: '#f59e0b' },
              { key: 'state' as const, label: 'Nhà nước 🏛', color: '#ef4444' },
            ].map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-3 py-1.5">
                <span className="text-xs text-zinc-500 w-28 sm:w-36">{label}</span>
                <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${stakeholderBalance[key]}%`, backgroundColor: color }} />
                </div>
                <span className="text-xs font-bold" style={{ color }}>{Math.round(stakeholderBalance[key])}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
          >
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">Kết quả Quiz</h3>
            <div className="text-center py-4">
              <div className="text-4xl font-black text-purple-600">{quizCorrect}/{quizTotal}</div>
              <p className="text-xs text-zinc-500 mt-2">
                {quizTotal === 0 ? 'Chưa làm quiz nào' : `${Math.round((quizCorrect / quizTotal) * 100)}% đúng`}
              </p>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: quizTotal > 0 ? `${(quizCorrect / quizTotal) * 100}%` : '0%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Turn history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">Lịch sử lượt chơi</h2>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {history.map((turn, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                <span className="font-bold text-zinc-400 w-12">Năm {turn.year}</span>
                <span className="text-zinc-600 dark:text-zinc-400 flex-1 truncate">{turn.eventId}</span>
                <span className={`px-1.5 py-0.5 rounded font-medium ${
                  (turn.effectsApplied as any)?.production > 0 ||
                  (turn.effectsApplied as any)?.employment > 0
                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                }`}>
                  {turn.selectedChoiceId}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Play again */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pb-8"
        >
          <Button size="lg" onClick={onPlayAgain}>Chơi lại</Button>
        </motion.div>
      </div>
    </div>
  );
}
