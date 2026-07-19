import mongoose, { Schema, Document } from 'mongoose';
import { GameStats, Policies } from '@/types/game';

export interface IGameTurn extends Document {
  gameSaveId: mongoose.Types.ObjectId;
  turnNumber: number;
  chapterId: number;
  eventId: string;
  eventTitle: string;
  selectedChoiceId: string;
  selectedChoiceLabel: string;
  policiesBefore: Policies;
  policiesAfter: Policies;
  statsBefore: GameStats;
  effectsApplied: Record<string, number>;
  statsAfter: GameStats;
  stakeholderImpact: Record<string, number>;
  explanationIds: string[];
  createdAt: Date;
}

const GameTurnSchema = new Schema<IGameTurn>({
  gameSaveId: { type: Schema.Types.ObjectId, ref: 'GameSave', required: true, index: true },
  turnNumber: { type: Number, required: true },
  chapterId: { type: Number, required: true },
  eventId: { type: String, required: true },
  eventTitle: { type: String, required: true },
  selectedChoiceId: { type: String, required: true },
  selectedChoiceLabel: { type: String, required: true },
  policiesBefore: { type: Schema.Types.Mixed, required: true },
  policiesAfter: { type: Schema.Types.Mixed, required: true },
  statsBefore: { type: Schema.Types.Mixed, required: true },
  effectsApplied: { type: Schema.Types.Mixed, default: {} },
  statsAfter: { type: Schema.Types.Mixed, required: true },
  stakeholderImpact: { type: Schema.Types.Mixed, default: {} },
  explanationIds: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

GameTurnSchema.index({ gameSaveId: 1, turnNumber: 1 });

export const GameTurn = mongoose.models.GameTurn || mongoose.model<IGameTurn>('GameTurn', GameTurnSchema);
