import { GameStats, Policies, StakeholderBalance, GameEvent, Choice, Difficulty } from '@/types/game';
import { clampStat, applyPolicyEffects, applyStakeholderEffects, calcBaseYearEffects, checkCrisisTrigger } from './effects';
import { DIFFICULTY_CONFIG, CHAPTERS } from './constants';
import { getSeededRandom } from '@/lib/utils/rng';

export function initState(difficulty: Difficulty, seed: number): {
  stats: GameStats;
  policies: Policies;
  stakeholderBalance: StakeholderBalance;
  minYears: number;
  maxYears: number;
} {
  const config = DIFFICULTY_CONFIG[difficulty];
  return {
    stats: { ...config.startingStats },
    policies: { taxRate: 50, minWage: 50, eduInvestment: 40, infraInvestment: 40, fdiPolicy: 50, envProtection: 50 },
    stakeholderBalance: { workers: 50, businesses: 50, state: 50 },
    minYears: config.yearRange[0],
    maxYears: config.yearRange[1],
  };
}

export function simulateYear(
  previousStats: GameStats,
  previousPolicies: Policies,
  currentPolicies: Policies,
  selectedChoice: Choice,
  difficulty: Difficulty,
  seed: number,
  currentYear: number,
  statsHistory: GameStats[]
): {
  statsAfter: GameStats;
  effectsApplied: Record<string, number>;
  stakeholderImpact: Record<string, number>;
  crisisId: string | null;
} {
  const rng = getSeededRandom(seed + currentYear * 1000);
  const noise = () => (rng() - 0.5) * 2;
  const config = DIFFICULTY_CONFIG[difficulty];

  const policyEffects = applyPolicyEffects(currentPolicies, previousPolicies, difficulty);
  const stakeEffects = applyStakeholderEffects(currentPolicies, previousPolicies, difficulty);
  const baseEffects = calcBaseYearEffects(previousStats, difficulty);

  const combinedEffects: Record<string, number> = {};
  const allKeys = new Set([
    ...Object.keys(policyEffects),
    ...Object.keys(baseEffects),
    ...Object.keys(selectedChoice.effects),
  ]);

  for (const key of allKeys) {
    combinedEffects[key] = (policyEffects[key] || 0)
      + (baseEffects[key] || 0)
      + (selectedChoice.effects[key as keyof typeof selectedChoice.effects] || 0)
      + noise() * 0.5;
  }

  const newStats: GameStats = {
    production: clampStat(previousStats.production + (combinedEffects.production || 0)),
    employment: clampStat(previousStats.employment + (combinedEffects.employment || 0)),
    socialWelfare: clampStat(previousStats.socialWelfare + (combinedEffects.socialWelfare || 0)),
    marketStability: clampStat(previousStats.marketStability + (combinedEffects.marketStability || 0)),
    nationalCapacity: clampStat(previousStats.nationalCapacity + (combinedEffects.nationalCapacity || 0)),
    environment: clampStat(previousStats.environment + (combinedEffects.environment || 0)),
    budget: clampStat(previousStats.budget + (combinedEffects.budget || 0)),
  };

  const effectsApplied: Record<string, number> = {};
  for (const key of allKeys) {
    const ev = combinedEffects[key];
    if (Math.abs(ev) >= 0.5) effectsApplied[key] = Math.round(ev * 10) / 10;
  }

  const stakeholderImpact: Record<string, number> = {};
  const combinedStake: Record<string, number> = {};
  const allStakeKeys = new Set([
    ...Object.keys(stakeEffects),
    ...Object.keys(selectedChoice.stakeholderImpact || {}),
  ]);
  for (const key of allStakeKeys) {
    combinedStake[key] = (stakeEffects[key] || 0) + ((selectedChoice.stakeholderImpact as any)?.[key] || 0) + noise() * 0.3;
    stakeholderImpact[key] = Math.round(combinedStake[key] * 10) / 10;
  }

  const crisisId = checkCrisisTrigger(newStats);

  // Check if there's a downward spiral
  if (statsHistory.length >= 2) {
    const lastStats = statsHistory[statsHistory.length - 1];
    if (newStats.production < lastStats.production - 10 && newStats.employment < lastStats.employment - 5) {
      // Recession feedback loop
      newStats.budget = clampStat(newStats.budget - 1);
      newStats.marketStability = clampStat(newStats.marketStability - 1);
    }
  }

  return { statsAfter: newStats, effectsApplied, stakeholderImpact, crisisId };
}

export function pickEventsForYear(
  events: GameEvent[],
  currentYear: number,
  unlockedEvents: string[],
  completedEvents: string[],
  difficulty: Difficulty,
  seed: number
): { mainEvent: GameEvent | null; randomEvent: GameEvent | null; surpriseEvent: GameEvent | null } {
  const rng = getSeededRandom(seed + currentYear * 777 + unlockedEvents.length * 13);
  const config = DIFFICULTY_CONFIG[difficulty];

  // Filter available events
  const available = events.filter(e => {
    if (completedEvents.includes(e.id)) return false;
    if (e.yearMin > currentYear || e.yearMax < currentYear) return false;
    if (e.requires) {
      const allMet = e.requires.every(reqId => completedEvents.includes(reqId));
      if (!allMet) return false;
    }
    if (e.requiresChoice) {
      const [eventId, choiceId] = e.requiresChoice.split('.');
      // Check if the specific choice was made in a completed event
      const choiceKey = `${eventId}.${choiceId}`;
      if (!unlockedEvents.includes(choiceKey)) return false;
    }
    return true;
  });

  // Ending events trigger based on conditions
  const endingEvents = available.filter(e => e.type === 'ending');

  // Check if crisis should trigger
  if (endingEvents.length > 0 && rng() < 0.15) {
    const idx = Math.floor(rng() * endingEvents.length);
    return { mainEvent: endingEvents[idx], randomEvent: null, surpriseEvent: null };
  }

  // Story events (chapter-appropriate)
  const storyEvents = available.filter(e => e.type === 'story');
  const randomEvents = available.filter(e => e.type === 'random');
  const chainEvents = available.filter(e => e.type === 'chain');
  const surpriseEvents = available.filter(e => e.type === 'surprise');

  // Pick main event (story or chain)
  let mainEvent: GameEvent | null = null;
  const mainPool = chainEvents.length > 0 ? chainEvents : storyEvents;
  if (mainPool.length > 0) {
    mainEvent = mainPool[Math.floor(rng() * mainPool.length)];
  }

  // Pick random event (30% chance)
  let randomEvent: GameEvent | null = null;
  if (randomEvents.length > 0 && rng() < 0.3) {
    randomEvent = randomEvents[Math.floor(rng() * randomEvents.length)];
  }

  // Pick surprise (10% chance, higher on easy)
  let surpriseEvent: GameEvent | null = null;
  if (surpriseEvents.length > 0 && rng() < (difficulty === 'easy' ? 0.2 : 0.1)) {
    surpriseEvent = surpriseEvents[Math.floor(rng() * surpriseEvents.length)];
  }

  return { mainEvent, randomEvent, surpriseEvent };
}

export function getChapterForYear(year: number): { id: number; name: string; cloTags: string[] } | null {
  const chapter = CHAPTERS.find(c => c.years.includes(year));
  return chapter || null;
}

export function shouldEndGame(
  currentYear: number,
  minYears: number,
  maxYears: number,
  lastEventWasEnding: boolean,
  crisisId: string | null
): { ended: boolean; endingId: string | null } {
  if (lastEventWasEnding) return { ended: true, endingId: null };
  if (crisisId) return { ended: true, endingId: crisisId };
  if (currentYear >= maxYears) return { ended: true, endingId: null };
  if (currentYear >= minYears) {
    // Random chance to end after min years
    const rng = getSeededRandom(currentYear * 999);
    if (rng() < 0.2) return { ended: true, endingId: null };
  }
  return { ended: false, endingId: null };
}
