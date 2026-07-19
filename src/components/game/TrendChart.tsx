'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TurnResult, GameStats } from '@/types/game';
import { STAT_LABELS, STAT_COLORS } from '@/lib/engine/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TrendChartProps {
  history: TurnResult[];
  currentStats: GameStats;
}

const ECONOMIC_STATS: (keyof GameStats)[] = ['production', 'employment', 'marketStability', 'nationalCapacity'];
const SOCIAL_STATS: (keyof GameStats)[] = ['socialWelfare', 'environment', 'budget'];

function makeChartData(stats: (keyof GameStats)[], history: TurnResult[], currentStats: GameStats) {
  const labels = history.map(h => `Năm ${h.year}`);
  const values = stats.flatMap(key => [...history.map(h => h.statsAfter[key]), currentStats[key]]);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const yMin = Math.max(0, Math.floor(dataMin / 5) * 5);
  const yMax = Math.min(100, Math.ceil(dataMax / 5) * 5);

  const datasets = stats.map(key => ({
    label: STAT_LABELS[key],
    data: [...history.map(h => h.statsAfter[key]), currentStats[key]],
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

  return { labels: labels, datasets, yMin, yMax };
}

function MiniChart({ title, stats, history, currentStats }: { title: string; stats: (keyof GameStats)[]; history: TurnResult[]; currentStats: GameStats }) {
  const { labels, datasets, yMin, yMax } = makeChartData(stats, history, currentStats);

  return (
    <div className="flex-1 min-w-0">
      <h4 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="h-36">
        <Line
          data={{ labels, datasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 10, padding: 4, usePointStyle: true } },
              tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fff',
                bodyColor: '#a1a1aa',
                padding: 8,
                cornerRadius: 6,
              },
            },
            scales: {
              y: { min: yMin, max: yMax, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 9 } } },
              x: { grid: { display: false }, ticks: { font: { size: 8 } } },
            },
          }}
        />
      </div>
    </div>
  );
}

export default function TrendChart({ history, currentStats }: TrendChartProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <p className="text-sm text-zinc-400 text-center py-8">Chưa có dữ liệu. Hãy bắt đầu chơi để xem biểu đồ.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Xu hướng phát triển</h3>
      <div className="flex flex-col sm:flex-row gap-6">
        <MiniChart title="Kinh tế" stats={ECONOMIC_STATS} history={history} currentStats={currentStats} />
        <div className="hidden sm:block w-px bg-zinc-200 dark:bg-zinc-700" />
        <MiniChart title="Xã hội & Ngân sách" stats={SOCIAL_STATS} history={history} currentStats={currentStats} />
      </div>
    </div>
  );
}
