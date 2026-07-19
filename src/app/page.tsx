'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import HeroSection from '@/components/landing/HeroSection';
import CityAnimation from '@/components/landing/CityAnimation';

export default function Home() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);

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
    const sessionId = getSessionId();
    try {
      const res = await fetch('/api/game/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem('marxcity_gameId', json.data.gameId);
        router.push('/game/intro');
      } else {
        console.error('Failed to init game:', json.error);
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
    } catch (e) {
      handleStart();
    }
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
    </div>
  );
}
