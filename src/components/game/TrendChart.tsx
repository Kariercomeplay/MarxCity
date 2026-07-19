'use client';

import { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TurnResult, GameStats } from '@/types/game';
import { STAT_LABELS, STAT_COLORS } from '@/lib/engine/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TrendChartProps {
  history: TurnResult[];
  currentStats: GameStats;
}

export default function TrendChart({ history, currentStats }: TrendChartProps) {
  const [selectedStats, setSelectedStats] = useState<(keyof GameStats)[]>(['production', 'employment', 'socialWelfare']);

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <p className="text-sm text-zinc-400 text-center py-8">Chưa có dữ liệu. Hãy bắt đầu chơi để xem biểu đồ.</p>
      </div>
    );
  }

  const labels = history.map(h => `Năm ${h.year}`);
  const allStats = Object.keys(currentStats) as (keyof GameStats)[];

  const datasets = selectedStats.map(key => ({
    label: STAT_LABELS[key],
    data: [...history.map(h => h.statsAfter[key]), currentStats[key]],
    borderColor: STAT_COLORS[key],
    backgroundColor: STAT_COLORS[key] + '25',
    borderWidth: 2,
    tension: 0.35,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 6,
    pointBackgroundColor: '#fff',
    pointBorderColor: STAT_COLORS[key],
    pointBorderWidth: 2,
  }));

  const allValues = datasets.flatMap(d => d.data);
  const dataMin = allValues.length > 0 ? Math.min(...allValues) : 40;
  const dataMax = allValues.length > 0 ? Math.max(...allValues) : 60;
  const yMin = Math.max(0, Math.floor(dataMin / 5) * 5 - 5);
  const yMax = Math.min(100, Math.ceil(dataMax / 5) * 5 + 5);

  const toggleStat = (key: keyof GameStats) => {
    setSelectedStats(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {allStats.map(key => (
              <button
                  key={key}
                  onClick={() => toggleStat(key as keyof GameStats)}
            className={`px-2 py-0.5 text-xs rounded-full border transition-colors
              ${selectedStats.includes(key)
                ? 'border-zinc-800 dark:border-zinc-200 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400'
              }`}
          >
            {STAT_LABELS[key]}
          </button>
        ))}
      </div>
      <div className="h-48">
        <Line
          data={{
            labels: [...labels, `Lượt ${history.length + 1}`],
            datasets,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fff',
                bodyColor: '#a1a1aa',
                padding: 10,
                cornerRadius: 8,
              },
            },
            scales: {
              y: {
                min: yMin,
                max: yMax,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 10 } },
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 9 } },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
