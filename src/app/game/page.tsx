'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import StatsGrid from '@/components/game/StatsGrid';
import TrendChart from '@/components/game/TrendChart';
import EventPanel from '@/components/game/EventPanel';
import PolicyPanel from '@/components/game/PolicyPanel';
import ExplanationBox from '@/components/game/ExplanationBox';
import QuizPopup from '@/components/game/QuizPopup';
import StakeholderMeter from '@/components/game/StakeholderMeter';
import ChapterTransition from '@/components/game/ChapterTransition';
import SurpriseBadge from '@/components/game/SurpriseBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { CHAPTERS } from '@/lib/engine/constants';
import eventsData from '@/data/events.json';
import { GameEvent } from '@/types/game';

export default function GamePage() {
  const router = useRouter();
  const store = useGameStore();
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [randomEvent, setRandomEvent] = useState<GameEvent | null>(null);
  const [surpriseEvent, setSurpriseEvent] = useState<GameEvent | null>(null);
  const [turnPhase, setTurnPhase] = useState<'loading' | 'event' | 'policy' | 'result'>('loading');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [pendingPolicies, setPendingPolicies] = useState(store.policies);
  const [previousStats, setPreviousStats] = useState(store.stats);
  const [showChapterTransition, setShowChapterTransition] = useState(false);
  const [nextChapter, setNextChapter] = useState<{ id: number; name: string; cloTags: string[] } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const initRef = useRef(false);

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const initGame = useCallback(async () => {
    if (initRef.current) return; initRef.current = true;
    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) { router.push('/'); return; }
    try {
      const res = await fetch(`/api/game/load?gameId=${gameId}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.status === 'completed') {
          localStorage.setItem('marxcity_report', gameId);
          router.push(`/report/${gameId}`);
          return;
        }
        store.initGame({
          gameId: d.gameId, currentYear: d.currentTurn,
          difficulty: d.difficulty, stats: d.stats,
          policies: d.policies, stakeholderBalance: d.stakeholderBalance,
        });
        store.setPolicies(d.policies);
        setPendingPolicies(d.policies);
        setPreviousStats(d.stats);

        // Fetch events for this year
        await fetchEventsForYear(d.currentTurn);
      } else {
        router.push('/');
      }
    } catch { router.push('/'); }
  }, [router, store]);

  const fetchEventsForYear = async (year: number) => {
    const events = eventsData as GameEvent[];
    const unlocked = store.unlockedEvents;
    const completed = store.completedEvents;
    const rng = (seed: number) => {
      let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    };
    const r = rng(year * 777 + unlocked.length * 13);
    const gameSeed = parseInt(localStorage.getItem('marxcity_seed') || '0', 10) || year * 12345;

    const available = events.filter(e => {
      if (completed.includes(e.id)) return false;
      if (e.yearMin > year || e.yearMax < year) return false;
      if (e.requires) { if (!e.requires.every(id => completed.includes(id))) return false; }
      if (e.requiresChoice) { if (!unlocked.includes(e.requiresChoice)) return false; }
      return true;
    });

    const storyEv = available.filter(e => e.type === 'story');
    const chainEv = available.filter(e => e.type === 'chain');
    const randomEv = available.filter(e => e.type === 'random');
    const surpriseEv = available.filter(e => e.type === 'surprise');

    const mainPool = chainEv.length > 0 ? chainEv : storyEv;
    const main = mainPool.length > 0 ? mainPool[Math.floor(r() * mainPool.length)] : null;

    let rand: GameEvent | null = null;
    if (randomEv.length > 0 && r() < 0.35) {
      rand = randomEv[Math.floor(r() * randomEv.length)];
    }

    let surp: GameEvent | null = null;
    if (surpriseEv.length > 0 && r() < 0.15) {
      surp = surpriseEv[Math.floor(r() * surpriseEv.length)];
    }

    setCurrentEvent(main);
    setRandomEvent(rand);
    setSurpriseEvent(surp);

    if (surp) setShowSurpriseModal(true);
    else if (main) { setTimeout(() => setShowEventModal(true), 300); setTurnPhase('event'); }
    else setTurnPhase('policy');

    store.setAvailableEvents({ main, random: rand, surprise: surp });
  };

  useEffect(() => { initGame(); }, [initGame]);

  const handleChoice = async (choiceId: string) => {
    if (!currentEvent || isSubmitting) return;
    setIsSubmitting(true);
    setShowEventModal(false); setShowSurpriseModal(false);

    const choice = currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) { setIsSubmitting(false); return; }

    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) { setIsSubmitting(false); return; }

    setTurnPhase('loading');
    try {
      const res = await fetch('/api/game/turn', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId, sessionId: store.sessionId || localStorage.getItem('marxcity_session'),
          eventId: currentEvent.id, selectedChoiceId: choiceId, policies: pendingPolicies,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const r = json.data;
        setPreviousStats(store.stats);
        store.setPolicies(pendingPolicies);
        store.setResult(r);
        store.addCompletedEvent(currentEvent.id);
        if (choice.unlocks) choice.unlocks.forEach(u => store.addUnlockedChoice(u));

        setShowExplanation(true);
        if (r.quiz) { setTimeout(() => { setCurrentQuiz(r.quiz); setShowQuiz(true); }, 1200); }

        if (r.gameOver) {
          setTimeout(() => {
            setShowEnding(true);
          }, 1000);
        }

        setTimeout(() => {
          setTurnPhase('result');
        }, 600);
        showNotif('Đã áp dụng quyết định!');
      }
    } catch { showNotif('Lỗi kết nối'); } finally { setIsSubmitting(false); }
  };

  const handleNextYear = () => {
    setShowExplanation(false); setCurrentQuiz(null); setShowQuiz(false);
    setShowEventModal(false); setShowSurpriseModal(false);
    setCurrentEvent(null); setRandomEvent(null); setSurpriseEvent(null);

    const nextYear = store.currentYear;
    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) return;

    const curChapter = CHAPTERS.find(c => c.years.includes(nextYear - 1));
    const nextChapter = CHAPTERS.find(c => c.years.includes(nextYear));
    if (curChapter && nextChapter && curChapter.id !== nextChapter.id) {
      setNextChapter(nextChapter);
      setShowChapterTransition(true);
      return;
    }
    fetchEventsForYear(nextYear);
  };

  const handleChapterContinue = () => {
    setShowChapterTransition(false); setNextChapter(null);
    fetchEventsForYear(store.currentYear);
  };

  const handleQuizAnswer = async (correct: boolean, idx: number) => {
    if (correct) showNotif('✅ Chính xác!');
    else showNotif('❌ Chưa chính xác.');
    const gameId = localStorage.getItem('marxcity_gameId');
    if (gameId && store.lastResult) {
      try {
        await fetch('/api/game/quiz', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId, turnNumber: store.currentYear - 1, selectedIndex: idx, correctIndex: currentQuiz?.correctIndex ?? 0 }),
        });
      } catch {}
    }
  };

  const handleEndingContinue = () => {
    const gameId = localStorage.getItem('marxcity_gameId');
    if (gameId) {
      localStorage.setItem('marxcity_report', gameId);
      router.push(`/report/${gameId}`);
    }
  };

  const currentChapter = CHAPTERS.find(c => c.years.includes(store.currentYear))
    || CHAPTERS.find(c => c.years.includes(store.currentYear - 1));
  const chapterProgress = currentChapter?.id || 0;

  if (turnPhase === 'loading' && !store.stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-zinc-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-base font-black text-red-600 flex-shrink-0">MARXCITY</span>
            <span className="text-sm text-zinc-500">Năm thứ {store.currentYear}</span>
            <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium hidden sm:inline
              ${store.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                store.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'}`}>
              {store.difficulty === 'easy' ? 'Dễ' : store.difficulty === 'hard' ? 'Khó' : 'Thường'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= chapterProgress ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
              ))}
            </div>
            <div className="h-2 w-20 sm:w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, ((store.currentYear - 1) / 10) * 100)}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div key="n" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium whitespace-nowrap">
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Transition */}
      <AnimatePresence>
        {showChapterTransition && nextChapter && (
          <ChapterTransition chapterId={nextChapter.id} chapterName={nextChapter.name} cloTags={nextChapter.cloTags} onContinue={handleChapterContinue} />
        )}
      </AnimatePresence>

      {/* Ending Modal */}
      <Modal isOpen={showEnding} onClose={handleEndingContinue} title="Kết thúc nhiệm kỳ" size="lg">
        <div className="text-center space-y-4">
          <div className={`text-3xl font-black ${
            store.lastResult?.ending?.type === 'success' ? 'text-green-600' :
            store.lastResult?.ending?.type === 'failure' ? 'text-red-600' : 'text-yellow-600'}`}>
            {store.lastResult?.ending?.title || 'Kết thúc'}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">{store.lastResult?.ending?.description}</p>
          <p className="text-sm text-zinc-500 italic leading-relaxed">{store.lastResult?.ending?.narrative}</p>
          <div className={`px-3 py-1 inline-block rounded-full text-xs font-bold ${
            store.lastResult?.ending?.type === 'success' ? 'bg-green-100 text-green-700' :
            store.lastResult?.ending?.type === 'failure' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'}`}>
            {store.lastResult?.ending?.type === 'success' ? 'THÀNH CÔNG' :
             store.lastResult?.ending?.type === 'failure' ? 'THẤT BẠI' : 'TRUNG BÌNH'}
          </div>
          <Button onClick={handleEndingContinue} className="w-full">Xem báo cáo chi tiết</Button>
        </div>
      </Modal>

      {/* Surprise Modal */}
      <Modal isOpen={showSurpriseModal && !!surpriseEvent} onClose={() => { setShowSurpriseModal(false); if (currentEvent) setTimeout(() => setShowEventModal(true), 300); else setTurnPhase('policy'); }}
        title={surpriseEvent?.title || ''} size="md">
        {surpriseEvent && (
          <div className="space-y-4">
            <div className="text-center">
              <SurpriseBadge type={surpriseEvent.id} />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{surpriseEvent.scenario}</p>
            {surpriseEvent.flavor && (
              <p className="text-xs text-zinc-400 italic">{surpriseEvent.flavor}</p>
            )}
            <div className="flex justify-end gap-2">
              {currentEvent ? (
                <Button onClick={() => { setShowSurpriseModal(false); setTimeout(() => setShowEventModal(true), 300); }}>
                  Tiếp tục với tình huống chính
                </Button>
              ) : (
                <Button onClick={() => setShowSurpriseModal(false)}>Đã rõ</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-4">
        <motion.div key={store.currentYear} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StatsGrid stats={store.stats!} previousStats={previousStats || undefined} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <TrendChart history={store.history} currentStats={store.stats!} />

            <AnimatePresence mode="wait">
              {(surpriseEvent && showSurpriseModal) ? (
                <motion.div key="surprise-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-300">🎉 Sự kiện bất ngờ xuất hiện!</p>
                </motion.div>
              ) : turnPhase === 'result' && store.lastResult && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Kết quả năm {store.lastResult.event?.id ? `— ${store.lastResult.event.selectedChoice.label}` : ''}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(store.lastResult.effectsApplied).filter(([, v]) => v !== 0).map(([key, val]) => (
                      <div key={key} className="bg-zinc-50 dark:bg-zinc-800/80 rounded-lg p-2 text-center">
                        <div className={`text-sm font-bold ${(val as number) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {(val as number) > 0 ? '+' : ''}{String(val)}</div>
                        <div className="text-xs text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                  {store.lastResult.crisisId && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                      <span className="text-sm font-bold text-red-600">⚠️ Khủng hoảng đang đến gần!</span>
                    </div>
                  )}
                  {!showQuiz && !showChapterTransition && !showEnding && (
                    <Button onClick={handleNextYear} className="w-full">
                      {store.status === 'completed' ? 'Xem kết quả' : `Sang năm ${store.currentYear}`}
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <StakeholderMeter balance={store.stakeholderBalance} />
            {currentChapter && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Chương {currentChapter.id}: {currentChapter.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {currentChapter.cloTags.map(clo => (
                    <span key={clo} className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">{clo}</span>
                  ))}
                </div>
              </motion.div>
            )}
            <div className="hidden lg:block">
              <PolicyPanel policies={pendingPolicies} onChange={(p) => { setPendingPolicies(p); store.setPolicies(p); }}
                onConfirm={() => {}} disabled={isSubmitting} />
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <Modal isOpen={showEventModal && !!currentEvent} onClose={() => setShowEventModal(false)} title="" size="lg">
        {currentEvent && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              {currentEvent.type === 'chain' && <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">🔗 Mở khóa</span>}
              {currentEvent.type === 'story' && <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">📖 Cốt truyện</span>}
            </div>
            <EventPanel event={currentEvent} onChoice={handleChoice} disabled={isSubmitting} />
          </div>
        )}
      </Modal>

      {/* Explanation + Quiz */}
      <ExplanationBox isOpen={showExplanation}
        content={store.lastResult?.explanation.content || ''}
        cloReferences={store.lastResult?.explanation.cloReferences || []}
        conceptTags={store.lastResult?.explanation.conceptTags || []}
        learningObjectives={store.lastResult?.explanation.learningObjectives || []}
        onClose={() => setShowExplanation(false)}
      />
      {currentQuiz && (
        <QuizPopup isOpen={showQuiz} question={currentQuiz.question} options={currentQuiz.options}
          correctIndex={currentQuiz.correctIndex} explanation={currentQuiz.explanation}
          onAnswer={handleQuizAnswer} onClose={() => setShowQuiz(false)} />
      )}

      <div className="text-center py-3 px-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">MarxCity — công cụ giáo dục, không phải dự báo kinh tế thực tế.</p>
      </div>
    </div>
  );
}
