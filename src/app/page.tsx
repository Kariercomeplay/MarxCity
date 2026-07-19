'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import HeroSection from '@/components/landing/HeroSection';
import CityAnimation from '@/components/landing/CityAnimation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

type Difficulty = 'easy' | 'normal' | 'hard';

export default function Home() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  useEffect(() => {
    const sid = localStorage.getItem('marxcity_session');
    setHasSession(!!sid);
  }, []);

  const getSessionId = () => {
    let sid = localStorage.getItem('marxcity_session');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('marxcity_session', sid);
    }
    return sid;
  };

  const handleStart = async () => {
    setShowDifficulty(true);
  };

  const handleDifficultySelect = async (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    setShowDifficulty(false);
    const sessionId = getSessionId();
    try {
      const res = await fetch('/api/game/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, difficulty: diff }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem('marxcity_gameId', json.data.gameId);
        localStorage.setItem('marxcity_difficulty', diff);
        router.push('/game/intro');
      }
    } catch (e) {
      console.error('Init error:', e);
    }
  };

  const handleContinue = async () => {
    const sessionId = localStorage.getItem('marxcity_session');
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/game/load?sessionId=${sessionId}`);
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem('marxcity_gameId', json.data.gameId);
        router.push('/game');
      } else {
        handleStart();
      }
    } catch {
      handleStart();
    }
  };

  const diffConfig = {
    easy: { desc: 'Khởi đầu thuận lợi, ít biến động', color: 'green' },
    normal: { desc: 'Cân bằng giữa thử thách và cơ hội', color: 'yellow' },
    hard: { desc: 'Khủng hoảng thường trực, chỉ dành cho chuyên gia', color: 'red' },
  };

  return (
    <div className="relative">
      <CityAnimation />
      <HeroSection
        onStart={handleStart}
        hasSession={hasSession}
        onContinue={handleContinue}
      />
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-zinc-600">
          Game mô phỏng giáo dục — kết quả không phải dự báo kinh tế thực tế
        </p>
      </div>

      <Modal isOpen={showDifficulty} onClose={() => setShowDifficulty(false)} title="Chọn độ khó" size="sm">
        <div className="space-y-3">
          {(['easy', 'normal', 'hard'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => handleDifficultySelect(diff)}
              className="w-full text-left p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 
                hover:border-red-500 transition-all duration-200 bg-white dark:bg-zinc-800/50 group"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full
                  ${diff === 'easy' ? 'bg-green-100 text-green-700' :
                    diff === 'normal' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}`}>
                  {diff === 'easy' ? 'Dễ' : diff === 'normal' ? 'Thường' : 'Khó'}
                </span>
                <span className="text-sm text-zinc-500">{diffConfig[diff].desc}</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
