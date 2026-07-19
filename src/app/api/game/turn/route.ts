import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { GameTurn } from '@/lib/models/GameTurn';
import { simulateTurn, pickEvent } from '@/lib/engine/simulate';
import { ApiResponse, TurnResponse, TurnRequest } from '@/types/api';
import eventsData from '@/data/events.json';
import explanationsData from '@/data/explanations.json';
import quizData from '@/data/quiz.json';
import { CHAPTERS } from '@/lib/engine/constants';
import { calcScore, getTitle } from '@/lib/engine/calculator';
import { GameEvent, Explanation } from '@/types/game';

export async function POST(req: NextRequest) {
  try {
    const body: TurnRequest = await req.json();
    const { gameId, sessionId, eventId, selectedChoiceId, policies } = body;

    if (!gameId || !sessionId || !eventId || !selectedChoiceId || !policies) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Thiếu thông tin lượt chơi' },
        { status: 400 }
      );
    }

    await connectDB();
    const game = await GameSave.findById(gameId);
    if (!game) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Không tìm thấy game' },
        { status: 404 }
      );
    }

    const events = eventsData as GameEvent[];
    const event = events.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Không tìm thấy sự kiện' },
        { status: 404 }
      );
    }

    const choice = event.choices.find(c => c.id === selectedChoiceId);
    if (!choice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Lựa chọn không hợp lệ' },
        { status: 400 }
      );
    }

    const turnSeed = game.seed + game.currentTurn * 1000;
    const result = simulateTurn(
      game.stats,
      game.policies,
      policies,
      choice,
      turnSeed
    );

    const chapter = CHAPTERS.find(c => c.turns.includes(game.currentTurn));

    const explanations = explanationsData as Explanation[];
    const explanationIds = [...event.cloReferences];
    const explanation = explanations.find(e => e.id === choice.explanationId);

    const statsBefore = { ...game.stats };

    await GameTurn.create({
      gameSaveId: game._id,
      turnNumber: game.currentTurn,
      chapterId: chapter?.id || 1,
      eventId: event.id,
      eventTitle: event.title,
      selectedChoiceId: choice.id,
      selectedChoiceLabel: choice.label,
      policiesBefore: game.policies,
      policiesAfter: policies,
      statsBefore,
      effectsApplied: result.effectsApplied,
      statsAfter: result.statsAfter,
      stakeholderImpact: result.stakeholderImpact,
      explanationIds,
    });

    const oldBalance = { ...game.stakeholderBalance };
    const newBalance = {
      workers: Math.max(0, Math.min(100, oldBalance.workers + (result.stakeholderImpact.workers || 0))),
      businesses: Math.max(0, Math.min(100, oldBalance.businesses + (result.stakeholderImpact.businesses || 0))),
      state: Math.max(0, Math.min(100, oldBalance.state + (result.stakeholderImpact.state || 0))),
    };

    game.stats = result.statsAfter;
    game.policies = policies;
    game.stakeholderBalance = newBalance;
    game.currentTurn += 1;

    const isLastTurn = game.currentTurn > game.maxTurns;
    if (isLastTurn) {
      game.status = 'completed';
      const quizTurns = await GameTurn.find({ gameSaveId: game._id, quizCorrect: { $ne: null } });
      const qCorrect = quizTurns.filter(t => t.quizCorrect === true).length;
      const qTotal = quizTurns.length;
      game.score = calcScore(game.stats, game.stakeholderBalance, qCorrect, qTotal);
      game.title = getTitle(game.stats);
    } else {
      game.score = game.currentTurn;
    }
    await game.save();

    let quiz: TurnResponse['quiz'] = undefined;
    if (game.currentTurn % 2 === 0 && !isLastTurn) {
      const chapterQuiz = (quizData as any[]).filter(q => q.relatedChapter === chapter?.id);
      if (chapterQuiz.length > 0) {
        const q = chapterQuiz[Math.floor(Math.random() * chapterQuiz.length)];
        const qExplanation = explanations.find(e => e.id === q.explanationId);
        quiz = {
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: qExplanation?.content || '',
        };
      }
    }

    const responseEvent = {
      id: event.id,
      title: event.title,
      scenario: event.scenario,
      selectedChoice: { label: choice.label },
      choices: event.choices.map(c => ({ id: c.id, label: c.label })),
    };

    return NextResponse.json<ApiResponse<TurnResponse>>({
      success: true,
      data: {
        turnNumber: game.currentTurn - 1,
        statsBefore,
        statsAfter: result.statsAfter,
        effectsApplied: result.effectsApplied,
        event: responseEvent,
        stakeholderImpact: result.stakeholderImpact,
        explanation: explanation || {
          id: '',
          content: 'Không có giải thích cho lựa chọn này.',
          cloReferences: [],
          conceptTags: [],
          learningObjectives: [],
        },
        gameOver: isLastTurn,
        quiz,
      },
    });
  } catch (error) {
    console.error('Turn error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi xử lý lượt chơi' },
      { status: 500 }
    );
  }
}
