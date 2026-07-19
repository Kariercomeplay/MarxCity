'use client';

import { useEffect, useState, useCallback } from 'react';
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
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { CHAPTERS, CLO_LABELS } from '@/lib/engine/constants';
import eventsData from '@/data/events.json';
import quizData from '@/data/quiz.json';
import { GameEvent, QuizQuestion } from '@/types/game';

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
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [pendingPolicies, setPendingPolicies] = useState(store.policies);
  const [previousStats, setPreviousStats] = useState(store.stats);

  const initGame = useCallback(async () => {
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
        loadEvent(data.currentTurn, data.gameId, data.seed);
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [router, store]);

  const loadEvent = useCallback((turn: number, gameId: string, seed: number) => {
    const events = eventsData as GameEvent[];
    const available = events.filter(e => e.turn === turn);
    if (available.length > 0) {
      // deterministic: use seed + turn to pick
      const idx = (seed + turn * 7) % available.length;
      setEvent(available[idx]);
      setTurnPhase('event');
      setShowEventModal(true);
    } else {
      setTurnPhase('policy');
    }
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleChoice = async (choiceId: string) => {
    if (!event) return;
    setSelectedChoice(choiceId);
    setShowEventModal(false);

    const events = eventsData as GameEvent[];
    const gameEvent = events.find(e => e.id === event.id);
    if (!gameEvent) return;

    const choice = gameEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;

    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) return;

    setTurnPhase('loading');

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
            }, 2000);
          }
        }, 500);
      }
    } catch (e) {
      console.error('Turn error:', e);
    }
  };

  const handleNextTurn = () => {
    setSelectedChoice(null);
    setShowExplanation(false);
    setCurrentQuiz(null);
    setShowQuiz(false);
    const gameId = localStorage.getItem('marxcity_gameId');
    if (!gameId) return;
    const turn = store.currentTurn;
    if (turn > store.maxTurns) return;
    loadEvent(turn, gameId, store.lastTurnResult ? store.lastTurnResult.turnNumber : Date.now());
  };

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) setQuizCorrect(p => p + 1);
    setQuizTotal(p => p + 1);
  };

  const currentChapter = CHAPTERS.find(c => c.turns.includes(store.currentTurn));

  if (turnPhase === 'loading' && !store.stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-zinc-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-red-600">MARXCITY</span>
            {currentChapter && (
              <span className="text-xs text-zinc-400 hidden sm:inline">
                Chương {currentChapter.id}: {currentChapter.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              Lượt <span className="font-bold text-zinc-800 dark:text-zinc-200">{store.currentTurn}</span>
              <span className="text-zinc-300">/{store.maxTurns}</span>
            </span>
            <div className="h-2 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-500"
                style={{ width: `${(store.currentTurn / store.maxTurns) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <motion.div key={store.currentTurn} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StatsGrid stats={store.stats!} previousStats={previousStats || undefined} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chart + Gameplay */}
          <div className="lg:col-span-2 space-y-6">
            <TrendChart history={store.history} currentStats={store.stats!} />

            <AnimatePresence mode="wait">
              {turnPhase === 'result' && store.lastTurnResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Kết quả lượt {store.lastTurnResult.turnNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Hoàn thành
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(store.lastTurnResult.effectsApplied)
                      .filter(([, v]) => v !== undefined && v !== 0)
                      .map(([key, val]) => (
                        <div key={key} className="bg-zinc-50 dark:bg-zinc-800/80 rounded-lg p-2 text-center">
                          <div className={`text-sm font-bold ${(val as number) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {(val as number) > 0 ? '+' : ''}{String(val)}
                          </div>
                          <div className="text-xs text-zinc-400 capitalize">{key}</div>
                        </div>
                      ))}
                  </div>

                  {store.currentTurn <= store.maxTurns && !showQuiz && (
                    <Button onClick={handleNextTurn} className="w-full">
                      Sang lượt {store.currentTurn}
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {store.currentTurn <= store.maxTurns && turnPhase === 'event' && (
              <Button onClick={() => setShowEventModal(true)} className="w-full">
                Xem tình huống kinh tế
              </Button>
            )}

            {/* Policy section */}
            {turnPhase !== 'result' && (
              <div className="lg:hidden">
                <PolicyPanel
                  policies={pendingPolicies}
                  onChange={setPendingPolicies}
                  onConfirm={() => {}}
                  disabled
                />
              </div>
            )}
          </div>

          {/* Right: Stakeholder + Policies */}
          <div className="space-y-6">
            <StakeholderMeter balance={store.stakeholderBalance} />

            {/* Current Chapter Info */}
            {currentChapter && (
              <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Chương {currentChapter.id}: {currentChapter.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentChapter.cloTags.map(clo => (
                    <span key={clo} className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {clo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Policy Panel - Desktop */}
            <div className="hidden lg:block">
              <PolicyPanel
                policies={pendingPolicies}
                onChange={(p) => {
                  setPendingPolicies(p);
                  store.setPolicies(p);
                }}
                onConfirm={() => {}}
                disabled={turnPhase === 'loading'}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} title="Tình huống kinh tế" size="lg">
        {event && (
          <EventPanel
            event={event}
            onChoice={handleChoice}
            disabled={turnPhase === 'loading'}
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

      {/* Quiz Popup */}
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

      {/* Disclaimer */}
      <div className="text-center py-4 px-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          MarxCity là công cụ giáo dục mô phỏng các mối quan hệ kinh tế dựa trên Kinh tế chính trị Mác-Lênin.
          Kết quả không đại diện cho dự báo kinh tế thực tế.
        </p>
      </div>
    </div>
  );
}
