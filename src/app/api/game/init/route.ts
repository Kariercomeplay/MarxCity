import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { initState } from '@/lib/engine/simulate';
import { ApiResponse, InitGameResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing sessionId' },
        { status: 400 }
      );
    }
    const seed = Math.floor(Math.random() * 2147483647);
    const { stats, policies, stakeholderBalance } = initState(seed);
    await connectDB();
    const game = await GameSave.create({
      sessionId,
      name: `Phiên chơi ${new Date().toLocaleDateString('vi-VN')}`,
      stats,
      policies,
      stakeholderBalance,
      seed,
      currentTurn: 1,
      maxTurns: 10,
      status: 'playing',
    });
    return NextResponse.json<ApiResponse<InitGameResponse>>({
      success: true,
      data: {
        gameId: game._id.toString(),
        currentTurn: game.currentTurn,
        maxTurns: game.maxTurns,
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
