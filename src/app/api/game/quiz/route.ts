import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameTurn } from '@/lib/models/GameTurn';
import { GameSave } from '@/lib/models/GameSave';
import { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const { gameId, turnNumber, selectedIndex, correctIndex } = await req.json();
    if (!gameId || !turnNumber) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing params' },
        { status: 400 }
      );
    }
    await connectDB();
    const turn = await GameTurn.findOne({ gameSaveId: gameId, turnNumber });
    if (turn) {
      turn.quizSelectedIndex = selectedIndex;
      turn.quizCorrectIndex = correctIndex;
      turn.quizCorrect = selectedIndex === correctIndex;
      await turn.save();
    }
    return NextResponse.json<ApiResponse<{ correct: boolean }>>({
      success: true,
      data: { correct: selectedIndex === correctIndex },
    });
  } catch (error) {
    console.error('Quiz save error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Cannot save quiz' },
      { status: 500 }
    );
  }
}
