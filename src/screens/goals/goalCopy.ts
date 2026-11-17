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
