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
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { CHAPTERS } from '@/lib/engine/constants';
import eventsData from '@/data/events.json';
import { GameEvent } from '@/types/game';

export default function GamePage() {
  const router = useRouter();
  const store = useGameStore();
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [turnPhase, setTurnPhase] = useState<'event' | 'policy' | 'result' | 'loading'>('loading');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [pendingPolicies, setPendingPolicies] = useState(store.policies);
  const [previousStats, setPreviousStats] = useState(store.stats);
  const [showChapterTransition, setShowChapterTransition] = useState(false);
  const [nextChapter, setNextChapter] = useState<{ id: number; name: string; cloTags: string[] } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameSeed, setGameSeed] = useState<number>(0);
  const isInitialized = useRef(false);
  const noEventThisTurn = useRef(false);

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const getGameSeed = useCallback((): number => {
    let seed = parseInt(localStorage.getItem('marxcity_seed') || '0', 10);
    if (!seed) {
      seed = Math.floor(Math.random() * 2147483647);
      localStorage.setItem('marxcity_seed', String(seed));
    }
    return seed;
  }, []);

  const pickEventForTurn = useCallback((turn: number, seed: number): GameEvent | null => {
    const events = eventsData as GameEvent[];
    const available = events.filter(e => e.turn === turn);
    if (available.length === 0) return null;
    const idx = (seed + turn * 13 + turn * turn * 7) % available.length;
    return available[idx];
  }, []);

  const initGame = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) {
      router.push('/');
      return;
    }
    try {
      const res = await fetch(`/api/game/load?gameId=${gameId}`);
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        if (data.status === 'completed') {
          localStorage.setItem('marxcity_report', gameId);
          router.push(`/report/${gameId}`);
          return;
        }
        const seed = data.seed || getGameSeed();
        setGameSeed(seed);
        localStorage.setItem('marxcity_seed', String(seed));

        store.initGame({
          gameId: data.gameId,
          currentTurn: data.currentTurn,
          maxTurns: data.maxTurns,
          stats: data.stats,
          policies: data.policies,
          stakeholderBalance: data.stakeholderBalance,
        });
        store.setPolicies(data.policies);
        setPendingPolicies(data.policies);
        setPreviousStats(data.stats);

        const turn = data.currentTurn;
        const ev = pickEventForTurn(turn, seed);
        if (ev) {
          setEvent(ev);
          setTurnPhase('event');
          setTimeout(() => setShowEventModal(true), 300);
        } else {
          noEventThisTurn.current = true;
          setTurnPhase('policy');
          showNotif('Không có tình huống đặc biệt cho lượt này. Hãy điều chỉnh chính sách và tiếp tục.');
        }
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [router, store, pickEventForTurn, getGameSeed, showNotif]);

  useEffect(() => { initGame(); }, [initGame]);

  const checkChapterBoundary = useCallback((completedTurn: number): boolean => {
    const cur = CHAPTERS.find(c => c.turns.includes(completedTurn));
    const next = CHAPTERS.find(c => c.turns.includes(completedTurn + 1));
    if (cur && next && cur.id !== next.id) {
      setNextChapter(next);
      setShowChapterTransition(true);
      return true;
    }
    return false;
  }, []);

  const handleChoice = async (choiceId: string) => {
    if (!event || isSubmitting) return;
    setIsSubmitting(true);
    setShowEventModal(false);
    setTurnPhase('loading');

    const gameEvent = (eventsData as GameEvent[]).find(e => e.id === event.id);
    const choice = gameEvent?.choices.find(c => c.id === choiceId);
    if (!choice) { setIsSubmitting(false); return; }

    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) { setIsSubmitting(false); return; }

    try {
      const res = await fetch('/api/game/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          sessionId: store.sessionId || localStorage.getItem('marxcity_session'),
          eventId: event.id,
          selectedChoiceId: choiceId,
          policies: pendingPolicies,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const result = json.data;
        setPreviousStats(store.stats);
        store.setPolicies(pendingPolicies);
        store.setTurnResult(result);
        setShowExplanation(true);

        if (result.quiz) {
          setTimeout(() => {
            setCurrentQuiz(result.quiz);
            setShowQuiz(true);
          }, 1500);
        }

        setTimeout(() => {
          setTurnPhase('result');
          if (result.gameOver) {
            setTimeout(() => {
              localStorage.setItem('marxcity_report', gameId);
              router.push(`/report/${gameId}`);
            }, 2500);
          }
        }, 800);

        showNotif('Đã áp dụng quyết định!');
      } else {
        showNotif(json.error || 'Lỗi xử lý');
      }
    } catch {
      showNotif('Lỗi kết nối');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTurn = () => {
    setShowExplanation(false);
    setCurrentQuiz(null);
    setShowQuiz(false);
    setShowEventModal(false);
    noEventThisTurn.current = false;

    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) return;

    const nextTurn = store.currentTurn;
    if (nextTurn > store.maxTurns) return;

    if (checkChapterBoundary(nextTurn - 1)) return;

    loadTurn(nextTurn);
  };

  const handleChapterContinue = () => {
    setShowChapterTransition(false);
    setNextChapter(null);
    loadTurn(store.currentTurn);
  };

  const loadTurn = (turn: number) => {
    if (!gameSeed) return;
    const ev = pickEventForTurn(turn, gameSeed);
    if (ev) {
      setEvent(ev);
      setTurnPhase('event');
      setTimeout(() => setShowEventModal(true), 300);
    } else {
      noEventThisTurn.current = true;
      setTurnPhase('policy');
      showNotif('Không có tình huống đặc biệt cho lượt này.');
    }
  };

  const handleAdvanceNoEvent = () => {
    if (noEventThisTurn.current) {
      handleNextTurn();
    }
  };

  const handleQuizAnswer = async (correct: boolean, selectedIndex: number) => {
    if (correct) { setQuizCorrect(p => p + 1); showNotif('✅ Chính xác!'); }
    else { showNotif('❌ Chưa chính xác.'); }
    setQuizTotal(p => p + 1);

    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId || !store.lastTurnResult) return;
    try {
      await fetch('/api/game/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          turnNumber: store.lastTurnResult.turnNumber,
          selectedIndex,
          correctIndex: currentQuiz?.correctIndex ?? 0,
        }),
      });
    } catch {}
  };

  const currentChapter = CHAPTERS.find(c => c.turns.includes(store.currentTurn))
    || CHAPTERS.find(c => c.turns.includes(store.currentTurn - 1));

  const chapterProgress = currentChapter ? currentChapter.id : 0;

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
            {currentChapter && (
              <span className="text-xs text-zinc-400 truncate hidden sm:inline">
                C{currentChapter.id}: {currentChapter.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i <= chapterProgress ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-zinc-500 whitespace-nowrap">
              Lượt <span className="font-bold text-zinc-800 dark:text-zinc-200">{store.currentTurn}</span>
              <span className="text-zinc-300">/{store.maxTurns}</span>
            </span>
            <div className="h-2 w-20 sm:w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, ((store.currentTurn - 1) / store.maxTurns) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Overlays */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="notif"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-zinc-700 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium whitespace-nowrap"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChapterTransition && nextChapter && (
          <ChapterTransition
            chapterId={nextChapter.id}
            chapterName={nextChapter.name}
            cloTags={nextChapter.cloTags}
            onContinue={handleChapterContinue}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <motion.div key={store.currentTurn} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StatsGrid stats={store.stats!} previousStats={previousStats || undefined} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <TrendChart history={store.history} currentStats={store.stats!} />

            <AnimatePresence mode="wait">
              {turnPhase === 'result' && store.lastTurnResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Kết quả lượt {store.lastTurnResult.turnNumber}
                    </span>
                    {store.lastTurnResult.event && (
                      <span className="text-xs text-zinc-400 truncate max-w-[200px]">
                        — {store.lastTurnResult.event.selectedChoice.label}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(store.lastTurnResult.effectsApplied)
                      .filter(([, v]) => v !== undefined && v !== 0)
                      .map(([key, val]) => (
                        <div key={key} className="bg-zinc-50 dark:bg-zinc-800/80 rounded-lg p-2 text-center">
                          <div className={`text-sm font-bold ${(val as number) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {(val as number) > 0 ? '+' : ''}{String(val)}
                          </div>
                          <div className="text-xs text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                      ))}
                  </div>

                  {store.currentTurn <= store.maxTurns && !showQuiz && !showChapterTransition && (
                    <Button onClick={handleNextTurn} className="w-full">
                      Sang lượt {store.currentTurn}
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {store.currentTurn <= store.maxTurns && turnPhase === 'event' && !showEventModal && (
              <Button onClick={() => setShowEventModal(true)} className="w-full">
                Xem tình huống kinh tế
              </Button>
            )}

            {/* No-event state: allow advancing */}
            {noEventThisTurn.current && turnPhase === 'policy' && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 text-center space-y-3">
                <p className="text-sm text-zinc-500">Không có tình huống đặc biệt cho lượt này.</p>
                <Button onClick={handleAdvanceNoEvent} className="w-full">
                  Tiếp tục sang lượt {store.currentTurn}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <StakeholderMeter balance={store.stakeholderBalance} />

            {currentChapter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
              >
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Chương {currentChapter.id}: {currentChapter.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {currentChapter.cloTags.map(clo => (
                    <span key={clo} className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {clo}
                    </span>
                  ))}
                </div>
                {quizTotal > 0 && (
                  <div className="text-xs text-zinc-400">
                    Quiz: {quizCorrect}/{quizTotal} đúng
                  </div>
                )}
              </motion.div>
            )}

            <div className="hidden lg:block">
              <PolicyPanel
                policies={pendingPolicies}
                onChange={(p) => { setPendingPolicies(p); store.setPolicies(p); }}
                onConfirm={() => {}}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <Modal isOpen={showEventModal && !!event} onClose={() => setShowEventModal(false)} title="Tình huống kinh tế" size="lg">
        {event && (
          <EventPanel
            event={event}
            onChoice={handleChoice}
            disabled={isSubmitting}
          />
        )}
      </Modal>

      {/* Explanation */}
      <ExplanationBox
        isOpen={showExplanation}
        content={store.lastTurnResult?.explanation.content || ''}
        cloReferences={store.lastTurnResult?.explanation.cloReferences || []}
        conceptTags={store.lastTurnResult?.explanation.conceptTags || []}
        learningObjectives={store.lastTurnResult?.explanation.learningObjectives || []}
        onClose={() => setShowExplanation(false)}
      />

      {/* Quiz */}
      {currentQuiz && (
        <QuizPopup
          isOpen={showQuiz}
          question={currentQuiz.question}
          options={currentQuiz.options}
          correctIndex={currentQuiz.correctIndex}
          explanation={currentQuiz.explanation}
          onAnswer={handleQuizAnswer}
          onClose={() => setShowQuiz(false)}
        />
      )}

      <div className="text-center py-3 px-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          MarxCity là công cụ giáo dục — kết quả không phải dự báo kinh tế thực tế.
        </p>
      </div>
    </div>
  );
}

