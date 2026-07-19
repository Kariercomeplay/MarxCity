'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

type Entry = {
  rank: number;
  name: string;
  score: number;
  title: string;
  turn: number;
  date: string;
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(json => {
        if (json.success) setEntries(json.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">BẢNG XẾP HẠNG</h1>
          <p className="text-sm text-zinc-500 mt-2">Những nhà hoạch định kinh tế xuất sắc nhất</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 text-center shadow-sm">
            <p className="text-zinc-500">Chưa có người chơi nào hoàn thành game.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Bắt đầu chơi
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border flex items-center gap-4
                  ${i === 0 ? 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-200 dark:ring-yellow-800' :
                    i < 3 ? 'border-zinc-300 dark:border-zinc-600' : 'border-zinc-100 dark:border-zinc-800'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${i === 0 ? 'bg-yellow-100 text-yellow-700' :
                    i === 1 ? 'bg-zinc-100 text-zinc-600' :
                    i === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-zinc-50 text-zinc-400'}`}>
                  {entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{entry.name}</div>
                  {entry.title && <div className="text-xs text-zinc-400 truncate">{entry.title}</div>}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{entry.score}</div>
                  <div className="text-xs text-zinc-400">{entry.date}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            ← Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
