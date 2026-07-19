'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReportView from '@/components/report/ReportView';
import { GameStats, TurnResult } from '@/types/game';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<{
    stats: GameStats;
    history: TurnResult[];
    stakeholderBalance: { workers: number; businesses: number; state: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gameId = params.saveId as string || localStorage.getItem('marxcity_report');
    if (!gameId) {
      router.push('/');
      return;
    }
    fetch(`/api/game/load?gameId=${gameId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setData({
            stats: json.data.stats,
            history: json.data.history,
            stakeholderBalance: json.data.stakeholderBalance,
          });
        } else {
          router.push('/');
        }
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [params.saveId, router]);

  const handlePlayAgain = () => {
    localStorage.removeItem('marxcity_gameId');
    localStorage.removeItem('marxcity_report');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-zinc-500">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <ReportView
      stats={data.stats}
      history={data.history}
      stakeholderBalance={data.stakeholderBalance}
      quizCorrect={0}
      quizTotal={0}
      onPlayAgain={handlePlayAgain}
    />
  );
}
