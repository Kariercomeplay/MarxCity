import mongoose, { Schema, Document } from 'mongoose';
import { GameStats, Policies, StakeholderBalance } from '@/types/game';

export interface IGameSave extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  name: string;
  currentTurn: number;
  maxTurns: number;
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  score: number;
  title: string;
  status: 'playing' | 'completed';
  seed: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSaveSchema = new Schema<IGameSave>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  sessionId: { type: String, required: true, index: true },
  name: { type: String, default: 'Game mới' },
  currentTurn: { type: Number, default: 1, min: 1 },
  maxTurns: { type: Number, default: 10 },
  stats: {
    production: { type: Number, default: 50 },
    employment: { type: Number, default: 50 },
    socialWelfare: { type: Number, default: 45 },
    marketStability: { type: Number, default: 55 },
    nationalCapacity: { type: Number, default: 40 },
    environment: { type: Number, default: 60 },
    budget: { type: Number, default: 50 },
  },
  policies: {
    taxRate: { type: Number, default: 50 },
    minWage: { type: Number, default: 50 },
    eduInvestment: { type: Number, default: 40 },
    infraInvestment: { type: Number, default: 40 },
    fdiPolicy: { type: Number, default: 50 },
    envProtection: { type: Number, default: 50 },
  },
  stakeholderBalance: {
    workers: { type: Number, default: 50 },
    businesses: { type: Number, default: 50 },
    state: { type: Number, default: 50 },
  },
  score: { type: Number, default: 0 },
  title: { type: String, default: '' },
  status: { type: String, enum: ['playing', 'completed'], default: 'playing' },
  seed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

GameSaveSchema.pre('save', async function () {
  this.updatedAt = new Date();
});

export const GameSave = mongoose.models.GameSave || mongoose.model<IGameSave>('GameSave', GameSaveSchema);
