import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { initState } from '@/lib/engine/simulate';
import { ApiResponse } from '@/types/api';
import { Difficulty } from '@/types/game';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, difficulty } = await req.json();
    if (!sessionId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing sessionId' },
        { status: 400 }
      );
    }
    const diff: Difficulty = difficulty || 'normal';
    const seed = Math.floor(Math.random() * 2147483647);
    const { stats, policies, stakeholderBalance } = initState(diff, seed);

    await connectDB();
    const game = await GameSave.create({
      sessionId,
      name: `Phiên chơi ${new Date().toLocaleDateString('vi-VN')}`,
      difficulty: diff,
      stats,
      policies,
      stakeholderBalance,
      seed,
      currentTurn: 1,
      maxTurns: 12,
      status: 'playing',
    });

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        gameId: game._id.toString(),
        currentYear: 1,
        difficulty: diff,
        stats: game.stats,
        policies: game.policies,
        stakeholderBalance: game.stakeholderBalance,
        seed: game.seed,
      },
    });
  } catch (error) {
    console.error('Init game error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Không thể khởi tạo game' },
      { status: 500 }
    );
  }
}
