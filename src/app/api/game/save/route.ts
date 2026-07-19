import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GameSave } from '@/lib/models/GameSave';
import { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const { gameId, name } = await req.json();
    if (!gameId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing gameId' },
        { status: 400 }
      );
    }
    await connectDB();
    const existing = await GameSave.findById(gameId);
    if (!existing) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }
    const updateName = name || existing.name;
    existing.name = updateName;
    await existing.save();
    return NextResponse.json<ApiResponse<{ id: string; name: string }>>({
      success: true,
      data: { id: existing._id.toString(), name: existing.name },
    });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Cannot save game' },
      { status: 500 }
    );
  }
}
