import { PLANK_STRENGTH_TYPE } from '../types/strengthAssessment';
import { formatPlankDuration } from './formatPlankDuration';
import { getStrengthLevel, strengthRequiredHoldSec } from './strengthPerformance';

export type PlankLevelTip = {
  level: number;
  targetSec: number;
  message: string;
};

/**
 * Next hold target tip while recording.
 * Starts at level 2 — grading already treats any short hold as level 1.
 */
export function nextPlankLevelTip(
  elapsedSec: number,
  dob: Date | null,
  gender: string | null,
): PlankLevelTip | null {
  const safeElapsed = Math.max(0, Math.floor(elapsedSec));

  if (!dob || !gender) {
    if (safeElapsed >= 120) {
      return {
        level: 10,
        targetSec: 120,
        message: 'Level 10 unlocked — keep going if you can',
      };
    }
    // 12s per level heuristic; never tip level 1.
    const nextLevel = Math.min(10, Math.max(2, Math.floor(safeElapsed / 12) + 1));
    const targetSec = nextLevel * 12;
    return {
      level: nextLevel,
      targetSec,
      message: `Hit ${formatPlankDuration(targetSec)} for level ${nextLevel}`,
    };
  }

  const levelTwoSec = strengthRequiredHoldSec(2, dob, gender, PLANK_STRENGTH_TYPE);
  if (safeElapsed < levelTwoSec) {
    return {
      level: 2,
      targetSec: levelTwoSec,
      message: `Hit ${formatPlankDuration(levelTwoSec)} for level 2`,
    };
  }

  const currentLevel = getStrengthLevel(dob, gender, safeElapsed, PLANK_STRENGTH_TYPE);
  if (currentLevel >= 10) {
    const top = strengthRequiredHoldSec(10, dob, gender, PLANK_STRENGTH_TYPE);
    return {
      level: 10,
      targetSec: top,
      message: 'Level 10 unlocked — keep going if you can',
    };
  }

  const targetLevel = Math.min(10, Math.max(2, currentLevel + 1));
  const targetSec = strengthRequiredHoldSec(targetLevel, dob, gender, PLANK_STRENGTH_TYPE);
  return {
    level: targetLevel,
    targetSec,
    message: `Hit ${formatPlankDuration(targetSec)} for level ${targetLevel}`,
  };
}
