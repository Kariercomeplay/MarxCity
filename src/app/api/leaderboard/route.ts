import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { ApiResponse } from '@/types/api';

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  title: string;
  turn: number;
  date: string;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const games = await GameSave.find({ status: 'completed' })
      .sort({ score: -1, updatedAt: -1 })
      .limit(50)
      .lean();

    const entries: LeaderboardEntry[] = games.map((g: any, i: number) => ({
      rank: i + 1,
      name: g.name || 'Vô danh',
      score: g.score || 0,
      title: g.title || '',
      turn: g.currentTurn || 0,
      date: g.updatedAt ? new Date(g.updatedAt).toLocaleDateString('vi-VN') : '',
    }));

    return NextResponse.json<ApiResponse<LeaderboardEntry[]>>({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Cannot load leaderboard' },
      { status: 500 }
    );
  }
}
