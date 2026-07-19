import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { GameTurn } from '@/lib/models/GameTurn';
import { simulateYear, pickEventsForYear, getChapterForYear, shouldEndGame } from '@/lib/engine/simulate';
import { getEnding } from '@/lib/engine/calculator';
import { ApiResponse } from '@/types/api';
import eventsData from '@/data/events.json';
import explanationsData from '@/data/explanations.json';
import quizData from '@/data/quiz.json';
import { GameEvent, Explanation, Difficulty } from '@/types/game';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, sessionId, eventId, selectedChoiceId, policies } = body;
    if (!gameId || !sessionId || !eventId || !selectedChoiceId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Thiếu thông tin' }, { status: 400 }
      );
    }
    await connectDB();
    const game = await GameSave.findById(gameId);
    if (!game) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Game not found' }, { status: 404 }
      );
    }

    const events = eventsData as GameEvent[];
    const event = events.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Event not found' }, { status: 404 }
      );
    }
    const choice = event.choices.find(c => c.id === selectedChoiceId);
    if (!choice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid choice' }, { status: 400 }
      );
    }

    const difficulty: Difficulty = game.difficulty || 'normal';
    const currentYear = game.currentTurn;
    const statsHistory = [...(game.statsHistory || [])];

    const result = simulateYear(
      game.stats,
      game.policies,
      policies || game.policies,
      choice,
      difficulty,
      game.seed,
      currentYear,
      statsHistory
    );

    statsHistory.push({ ...game.stats });

    const explanations = explanationsData as Explanation[];
    const explanation = explanations.find(e => e.id === choice.explanationId);

    const oldBalance = { ...game.stakeholderBalance };
    const newBalance = {
      workers: Math.max(0, Math.min(100, oldBalance.workers + (result.stakeholderImpact.workers || 0))),
      businesses: Math.max(0, Math.min(100, oldBalance.businesses + (result.stakeholderImpact.businesses || 0))),
      state: Math.max(0, Math.min(100, oldBalance.state + (result.stakeholderImpact.state || 0))),
    };

    game.stats = result.statsAfter;
    game.policies = policies || game.policies;
    game.stakeholderBalance = newBalance;
    game.currentTurn = currentYear + 1;
    game.statsHistory = statsHistory;
    await game.save();

    // Check ending
    const crisisEnding = result.crisisId ? getEnding(result.statsAfter, newBalance) : null;
    const isEndingEvent = event.isEnding === true || !!crisisEnding;
    const { ended } = shouldEndGame(
      currentYear, game.minYears || 6, game.maxYears || 10,
      isEndingEvent, result.crisisId
    );

    let finalEnding = crisisEnding || null;
    if (ended && !finalEnding) {
      finalEnding = getEnding(result.statsAfter, newBalance);
    }

    if (finalEnding) {
      game.status = 'completed';
      game.score = finalEnding.type === 'success' ? 100 : finalEnding.type === 'neutral' ? 60 : 30;
      game.title = finalEnding.title;
      await game.save();
    }

    // Quiz
    const chapter = getChapterForYear(currentYear);
    let quiz: any = undefined;
    if ((currentYear % 2 === 0 || ended) && !ended) {
      const pool = (quizData as any[]).filter(q => q.relatedChapter === chapter?.id);
      if (pool.length > 0) {
        const q = pool[Math.floor(Math.random() * pool.length)];
        const qExp = explanations.find(e => e.id === q.explanationId);
        quiz = {
          question: q.question, options: q.options,
          correctIndex: q.correctIndex,
          explanation: qExp?.content || '',
        };
      }
    }

    // Check for event unlocks
    const unlockedKeys: string[] = [];
    if (choice.unlocks) {
      choice.unlocks.forEach((unlockId: string) => {
        unlockedKeys.push(unlockId);
      });
    }

    const responseEvent = {
      id: event.id, title: event.title, scenario: event.scenario,
      selectedChoice: { label: choice.label },
      choices: event.choices.map(c => ({ id: c.id, label: c.label })),
      type: event.type,
      flavor: event.flavor,
    };

    try {
      await GameTurn.create({
        gameSaveId: game._id,
        turnNumber: currentYear,
        chapterId: chapter?.id || 1,
        eventId: event.id,
        eventTitle: event.title,
        selectedChoiceId: choice.id,
        selectedChoiceLabel: choice.label,
        policiesBefore: game.policies,
        policiesAfter: policies || game.policies,
        statsBefore: game.stats,
        effectsApplied: result.effectsApplied,
        statsAfter: result.statsAfter,
        stakeholderImpact: result.stakeholderImpact,
        explanationIds: [choice.explanationId],
        quizQuestion: quiz?.question,
        quizCorrectIndex: quiz?.correctIndex,
      });
    } catch (turnSaveErr) {
      console.error('GameTurn save error:', turnSaveErr);
    }

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        year: currentYear,
        statsBefore: game.stats,
        statsAfter: result.statsAfter,
        effectsApplied: result.effectsApplied,
        event: responseEvent,
        stakeholderImpact: result.stakeholderImpact,
        explanation: explanation || { id: '', content: 'Không có giải thích.', cloReferences: [], conceptTags: [], learningObjectives: [] },
        gameOver: ended,
        ending: finalEnding || null,
        crisisId: result.crisisId || null,
        quiz,
        unlockedEvents: unlockedKeys,
        completedEventId: event.id,
      },
    });
  } catch (error) {
    console.error('Turn error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi xử lý' }, { status: 500 }
    );
  }
}
