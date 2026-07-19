'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TurnResult, GameStats } from '@/types/game';
import { calcScore, getEnding } from '@/lib/engine/calculator';
import { STAT_LABELS, STAT_COLORS } from '@/lib/engine/constants';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Button from '@/components/ui/Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ReportViewProps {
  stats: GameStats;
  history: TurnResult[];
  stakeholderBalance: { workers: number; businesses: number; state: number };
  quizCorrect: number;
  quizTotal: number;
  onPlayAgain: () => void;
}

const ECON_STATS: (keyof GameStats)[] = ['production', 'employment', 'marketStability', 'nationalCapacity'];
const SOC_STATS: (keyof GameStats)[] = ['socialWelfare', 'environment', 'budget'];

function makeChart(stats: (keyof GameStats)[], history: TurnResult[]) {
  const labels = history.map(h => `Năm ${h.year}`);
  const values = stats.flatMap(key => history.map(h => h.statsAfter?.[key] ?? 50));
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const yMin = Math.max(0, Math.floor(dataMin / 5) * 5);
  const yMax = Math.min(100, Math.ceil(dataMax / 5) * 5);

  const datasets = stats.map(key => ({
    label: STAT_LABELS[key],
    data: history.map(h => h.statsAfter?.[key] ?? 50),
    borderColor: STAT_COLORS[key],
    backgroundColor: STAT_COLORS[key] + '20',
    borderWidth: 2,
    tension: 0.3,
    fill: false,
    pointRadius: 3,
    pointHoverRadius: 5,
    pointBackgroundColor: '#fff',
    pointBorderColor: STAT_COLORS[key],
    pointBorderWidth: 2,
  }));

  return { labels, datasets, yMin, yMax };
}

export default function ReportView({ stats, history, stakeholderBalance, quizCorrect, quizTotal, onPlayAgain }: ReportViewProps) {
  const score = calcScore(stats, stakeholderBalance, quizCorrect, quizTotal);
  const ending = getEnding(stats, stakeholderBalance);
  const title = ending.title;
  const titleDesc = ending.description;
  const endingType = ending.type || 'neutral';

  const econ = makeChart(ECON_STATS, history);
  const soc = makeChart(SOC_STATS, history);

  const allStats = Object.keys(stats) as (keyof GameStats)[];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`text-center space-y-4 p-6 sm:p-8 rounded-3xl border-2 shadow-lg ${
            endingType === 'success' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' :
            endingType === 'failure' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' :
            'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
          }`}>
          <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
            endingType === 'success' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300' :
            endingType === 'failure' ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300' :
            'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
          }`}>
            {endingType === 'success' ? '🎉 THÀNH CÔNG' : endingType === 'failure' ? '⚠️ THẤT BẠI' : '⚖️ TRUNG BÌNH'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">{title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">{titleDesc}</p>
          {ending.narrative && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic bg-white dark:bg-zinc-800/50 p-3 rounded-xl max-w-xl mx-auto">
              &ldquo;{ending.narrative}&rdquo;
            </p>
          )}
        </motion.div>

        {/* Score stats */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="text-3xl font-black text-amber-500">{score}</div>
            <div className="text-xs text-zinc-500 mt-1">Tổng điểm</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="text-3xl font-black text-blue-500">{stats.production}</div>
            <div className="text-xs text-zinc-500 mt-1">{STAT_LABELS.production}</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="text-3xl font-black text-emerald-500">{stats.employment}</div>
            <div className="text-xs text-zinc-500 mt-1">{STAT_LABELS.employment}</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="text-3xl font-black text-purple-500">{stats.environment}</div>
            <div className="text-xs text-zinc-500 mt-1">{STAT_LABELS.environment}</div>
          </div>
        </motion.div>

        {/* 2 split charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Kinh tế</h3>
            <div className="h-48">
              <Line data={{ labels: econ.labels, datasets: econ.datasets }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 10, padding: 6, usePointStyle: true } } },
                  scales: {
                    y: { min: econ.yMin, max: econ.yMax, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 9 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 8 } } },
                  },
                }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Xã hội & Ngân sách</h3>
            <div className="h-48">
              <Line data={{ labels: soc.labels, datasets: soc.datasets }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 10, padding: 6, usePointStyle: true } } },
                  scales: {
                    y: { min: soc.yMin, max: soc.yMax, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 9 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 8 } } },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* 7 stats grid */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allStats.map(key => (
            <div key={key} className="bg-white dark:bg-zinc-800 rounded-xl p-3 shadow-sm border border-zinc-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAT_COLORS[key] }} />
                <span className="text-xs text-zinc-500 truncate">{STAT_LABELS[key]}</span>
              </div>
              <div className="text-lg font-bold" style={{ color: STAT_COLORS[key] }}>{stats[key]}</div>
            </div>
          ))}
        </motion.div>

        {/* Stakeholder + Quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <span>⚖️</span> Cân bằng lợi ích
            </h3>
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

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <span>🧠</span> Quiz
            </h3>
            <div className="text-center py-4">
              <div className="text-4xl font-black text-purple-500">{quizCorrect}/{quizTotal}</div>
              <p className="text-xs text-zinc-500 mt-2">
                {quizTotal === 0 ? 'Chưa làm quiz nào' : `${Math.round((quizCorrect / quizTotal) * 100)}% đúng`}
              </p>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: quizTotal > 0 ? `${(quizCorrect / quizTotal) * 100}%` : '0%' }} />
            </div>
          </motion.div>
        </div>

        {/* History */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
            <span>📜</span> Lịch sử các năm
          </h2>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {history.map((turn, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                <span className="font-bold text-zinc-400 w-12">Năm {turn.year}</span>
                <span className="text-zinc-600 dark:text-zinc-400 flex-1 truncate">{turn.eventTitle || turn.eventId}</span>
                <span className="px-1.5 py-0.5 rounded font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 truncate max-w-[160px]">
                  {turn.selectedChoiceId}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Play again */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="text-center pb-8 pt-2">
          <Button size="lg" onClick={onPlayAgain} className="px-10">
            🔄 Chơi lại
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
