import type { QuarterGoalType } from '../../types/goals';

export const MAX_LEVEL = 10;

export const GOAL_TITLES: Record<QuarterGoalType, string> = {
  up: 'Go up one level',
  hold: 'Maintain my level',
};

/** "Reach L6" / "Stay at L5" from the level the goal was set at. */
export function goalTargetLabel(type: QuarterGoalType, level: number): string {
  if (type === 'up') return `Reach L${Math.min(level + 1, MAX_LEVEL)}`;
  return `Stay at L${level}`;
}

export type PillarKey = 'cardio' | 'strength' | 'knowledge';
type PillarLevels = Record<PillarKey, number>;

const PILLAR_ORDER: PillarKey[] = ['cardio', 'strength', 'knowledge'];
const PILLAR_NAMES: Record<PillarKey, string> = {
  cardio: 'Cardio',
  strength: 'Strength',
  knowledge: 'Knowledge',
};

function joinWith(parts: string[], word: 'or' | 'and'): string {
  if (parts.length <= 1) return parts[0] ?? '';
  return `${parts.slice(0, -1).join(', ')} ${word} ${parts[parts.length - 1]}`;
}

/**
 * Which next-level steps are enough to lift the overall Longevity Level by one,
 * using the app's own weighting (athleteLevelCalculation: 0.7 cardio, 0.2 strength,
 * 0.1 knowledge, capped at cardio + 1). Each step is one pillar going up one level,
 * matching the targets on the progress bars.
 */
export function levelUpPathLine(
  levels: PillarLevels,
  calculate: (cardio: number, strength: number, knowledge: number) => number,
): string | null {
  const current = calculate(levels.cardio, levels.strength, levels.knowledge);
  if (current >= MAX_LEVEL) return null;
  const goal = current + 1;

  const raise = (keys: PillarKey[]) => {
    const next = { ...levels };
    for (const key of keys) next[key] = Math.min(MAX_LEVEL, next[key] + 1);
    return calculate(next.cardio, next.strength, next.knowledge) >= goal;
  };
  const step = (key: PillarKey) => `${PILLAR_NAMES[key].toLowerCase()} to L${Math.min(MAX_LEVEL, levels[key] + 1)}`;
  const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  const open = PILLAR_ORDER.filter((key) => levels[key] < MAX_LEVEL);

  const singles = open.filter((key) => raise([key]));
  if (singles.length > 0) {
    return `${capitalise(joinWith(singles.map(step), 'or'))} on its own gets you to L${goal}.`;
  }

  const pairs: PillarKey[][] = [];
  for (let i = 0; i < open.length; i++) {
    for (let j = i + 1; j < open.length; j++) {
      if (raise([open[i], open[j]])) pairs.push([open[i], open[j]]);
    }
  }
  if (pairs.length > 0) {
    const options = pairs.map((pair) => joinWith(pair.map(step), 'and'));
    return `${capitalise(joinWith(options, 'or'))} together get you to L${goal}.`;
  }

  if (open.length > 0 && raise(open)) {
    return `You need all three to reach L${goal}.`;
  }
  return null;
}

/** Overall level now and the pillars whose next level alone lifts it by one. */
export function pillarsEnoughAlone(
  levels: PillarLevels,
  calculate: (cardio: number, strength: number, knowledge: number) => number,
): { current: number; enough: PillarKey[] } {
  const current = calculate(levels.cardio, levels.strength, levels.knowledge);
  if (current >= MAX_LEVEL) return { current, enough: [] };
  const enough = PILLAR_ORDER.filter((key) => {
    if (levels[key] >= MAX_LEVEL) return false;
    const next = { ...levels, [key]: levels[key] + 1 };
    return calculate(next.cardio, next.strength, next.knowledge) >= current + 1;
  });
  return { current, enough };
}

/** A goal belongs to one assessment; older goals stop counting so a new one can be set. */
const GOAL_MAX_AGE_DAYS = 100;

export function isCurrentQuarterGoal(
  goal: { window: string | null; setAt: Date | null } | null,
  nextWindow: string | null,
  now: Date,
): boolean {
  if (!goal) return false;
  if (goal.window && nextWindow && goal.window !== nextWindow) return false;
  // Window names repeat every year, so also require the goal to be recent.
  if (goal.setAt && now.getTime() - goal.setAt.getTime() > GOAL_MAX_AGE_DAYS * 86_400_000) return false;
  return true;
}
