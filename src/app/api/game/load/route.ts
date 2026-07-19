import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { GameTurn } from '@/lib/models/GameTurn';
import { ApiResponse, LoadGameResponse } from '@/types/api';
import { Ending } from '@/types/game';
import { ENDINGS } from '@/lib/engine/constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');
    const sessionId = searchParams.get('sessionId');
    if (!gameId && !sessionId) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: 'Missing params' }, { status: 400 });
    }
    await connectDB();
    let game;
    if (gameId) game = await GameSave.findById(gameId);
    else game = await GameSave.findOne({ sessionId, status: 'playing' }).sort({ updatedAt: -1 });
    if (!game) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: 'Game not found' }, { status: 404 });
    }
    const turns = await GameTurn.find({ gameSaveId: game._id }).sort({ turnNumber: 1 });

const quizCorrect = turns.filter(t => t.quizCorrect === true).length;
const quizTotal = turns.filter(t => t.quizSelectedIndex !== undefined).length;

    let ending: Ending | null = null;
    if (game.status === 'completed' && game.title) {
      ending = ENDINGS.find(e => e.title === game.title) || null;
    }

    return NextResponse.json<ApiResponse<LoadGameResponse>>({
      success: true,
      data: {
        gameId: game._id.toString(),
        name: game.name,
        currentTurn: game.currentTurn,
        maxTurns: game.maxTurns,
        difficulty: game.difficulty || 'normal',
        stats: game.stats,
        policies: game.policies,
        stakeholderBalance: game.stakeholderBalance,
        score: game.score || 0,
        title: game.title || '',
        status: game.status,
        unlockedEvents: game.unlockedEvents || [],
        completedEvents: game.completedEvents || [],
        quizCorrect, quizTotal,
        ending,
        history: turns.map(t => ({
          year: t.turnNumber,
          eventId: t.eventId,
          eventTitle: t.eventTitle || t.eventId,
          selectedChoiceId: t.selectedChoiceLabel || t.selectedChoiceId,
          policiesBefore: t.policiesBefore as any,
          policiesAfter: t.policiesAfter as any,
          statsBefore: t.statsBefore as any,
          effectsApplied: t.effectsApplied,
          statsAfter: t.statsAfter as any,
          stakeholderImpact: t.stakeholderImpact,
          explanationIds: t.explanationIds,
        })),
      },
    });
  } catch (error) {
    console.error('Load error:', error);
    return NextResponse.json<ApiResponse<null>>({ success: false, error: 'Cannot load game' }, { status: 500 });
  }
}
