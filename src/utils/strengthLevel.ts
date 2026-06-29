const STRENGTH_LEVEL_MIN = 1;
const STRENGTH_LEVEL_MAX = 10;

/** Reference max plank hold (seconds) for level mapping until norms table exists. */
const REFERENCE_MAX_PLANK_SEC = 120;

export function calculateStrengthLevelFromPlankHold(holdSec: number): number {
  if (holdSec <= 0) return STRENGTH_LEVEL_MIN;
  const relativePerformance = holdSec / REFERENCE_MAX_PLANK_SEC;
  const raw = Math.floor(relativePerformance * STRENGTH_LEVEL_MAX);
  return Math.max(STRENGTH_LEVEL_MIN, Math.min(STRENGTH_LEVEL_MAX, raw));
}

export function plankHoldSecForLevel(level: number): number {
  return Math.ceil((level * REFERENCE_MAX_PLANK_SEC) / STRENGTH_LEVEL_MAX);
}
