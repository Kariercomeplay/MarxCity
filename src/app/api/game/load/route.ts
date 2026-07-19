import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { GameTurn } from '@/lib/models/GameTurn';
import { ApiResponse, LoadGameResponse } from '@/types/api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');
    const sessionId = searchParams.get('sessionId');

    if (!gameId && !sessionId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing gameId or sessionId' },
        { status: 400 }
      );
    }
    await connectDB();
    let game;
    if (gameId) {
      game = await GameSave.findById(gameId);
    } else {
      game = await GameSave.findOne({ sessionId, status: 'playing' }).sort({ updatedAt: -1 });
    }
    if (!game) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }
    const turns = await GameTurn.find({ gameSaveId: game._id }).sort({ turnNumber: 1 });
    return NextResponse.json<ApiResponse<LoadGameResponse>>({
      success: true,
      data: {
        gameId: game._id.toString(),
        name: game.name,
        currentTurn: game.currentTurn,
        maxTurns: game.maxTurns,
        stats: game.stats,
        policies: game.policies,
        stakeholderBalance: game.stakeholderBalance,
        score: game.score,
        status: game.status,
        history: turns.map(t => ({
          turnNumber: t.turnNumber,
          eventId: t.eventId,
          selectedChoiceId: t.selectedChoiceId,
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
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Cannot load game' },
      { status: 500 }
    );
  }
}
