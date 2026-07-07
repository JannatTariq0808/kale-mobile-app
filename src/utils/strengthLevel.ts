import { PLANK_STRENGTH_TYPE } from '../types/strengthAssessment';
import {
  getStrengthLevel,
  strengthRequiredHoldSec,
  type StrengthType,
} from './strengthPerformance';

/** @deprecated Use getStrengthLevel with dob/gender from health profile. */
export function calculateStrengthLevelFromPlankHold(holdSec: number): number {
  if (holdSec <= 0) return 1;
  const raw = Math.floor((holdSec / 120) * 10);
  return Math.max(1, Math.min(10, raw));
}

export function calculatePlankLevel(
  dob: Date,
  gender: string,
  holdSec: number,
): number {
  return getStrengthLevel(dob, gender, holdSec, PLANK_STRENGTH_TYPE);
}

export function plankHoldSecForLevel(
  level: number,
  dob: Date,
  gender: string,
  type: StrengthType | string = PLANK_STRENGTH_TYPE,
): number {
  return strengthRequiredHoldSec(level, dob, gender, type);
}
