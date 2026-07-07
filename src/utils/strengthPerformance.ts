/** Port of Flutter `getStrengthStandardsTable`, `getStrengthLvl`, `getStrengthPct`. */

import { calculateAge, formatAgeBracketLabel, formatGenderCohort, type AgeBracket } from './cardioPerformance';

export type StrengthType = 'Plank' | 'Wall Sit';

type StrengthStandardsTable = Record<number, Record<AgeBracket, number>>;

const PLANK_MALE: StrengthStandardsTable = {
  1: { '18-29': 60, '30-39': 57, '40-49': 55, '50-59': 53, '60-69': 51, '70+': 50 },
  2: { '18-29': 80, '30-39': 76, '40-49': 73, '50-59': 70, '60-69': 68, '70+': 66 },
  3: { '18-29': 100, '30-39': 95, '40-49': 91, '50-59': 88, '60-69': 85, '70+': 83 },
  4: { '18-29': 120, '30-39': 114, '40-49': 109, '50-59': 106, '60-69': 102, '70+': 100 },
  5: { '18-29': 140, '30-39': 133, '40-49': 127, '50-59': 123, '60-69': 119, '70+': 116 },
  6: { '18-29': 160, '30-39': 152, '40-49': 146, '50-59': 141, '60-69': 136, '70+': 133 },
  7: { '18-29': 180, '30-39': 171, '40-49': 164, '50-59': 158, '60-69': 153, '70+': 149 },
  8: { '18-29': 200, '30-39': 190, '40-49': 182, '50-59': 176, '60-69': 170, '70+': 166 },
  9: { '18-29': 220, '30-39': 209, '40-49': 200, '50-59': 194, '60-69': 187, '70+': 183 },
  10: { '18-29': 240, '30-39': 228, '40-49': 218, '50-59': 211, '60-69': 204, '70+': 199 },
};

const PLANK_FEMALE: StrengthStandardsTable = {
  1: { '18-29': 50, '30-39': 48, '40-49': 46, '50-59': 44, '60-69': 43, '70+': 42 },
  2: { '18-29': 70, '30-39': 67, '40-49': 64, '50-59': 62, '60-69': 60, '70+': 58 },
  3: { '18-29': 90, '30-39': 86, '40-49': 82, '50-59': 79, '60-69': 77, '70+': 75 },
  4: { '18-29': 110, '30-39': 105, '40-49': 100, '50-59': 97, '60-69': 94, '70+': 91 },
  5: { '18-29': 130, '30-39': 124, '40-49': 118, '50-59': 114, '60-69': 111, '70+': 108 },
  6: { '18-29': 150, '30-39': 143, '40-49': 137, '50-59': 132, '60-69': 128, '70+': 125 },
  7: { '18-29': 170, '30-39': 162, '40-49': 155, '50-59': 150, '60-69': 145, '70+': 141 },
  8: { '18-29': 190, '30-39': 181, '40-49': 173, '50-59': 167, '60-69': 162, '70+': 158 },
  9: { '18-29': 210, '30-39': 200, '40-49': 192, '50-59': 185, '60-69': 179, '70+': 174 },
  10: { '18-29': 230, '30-39': 219, '40-49': 209, '50-59': 202, '60-69': 196, '70+': 191 },
};

const WALL_SIT_MALE: StrengthStandardsTable = {
  1: { '18-29': 30, '30-39': 28, '40-49': 25, '50-59': 21, '60-69': 18, '70+': 12 },
  2: { '18-29': 40, '30-39': 38, '40-49': 33, '50-59': 28, '60-69': 24, '70+': 16 },
  3: { '18-29': 50, '30-39': 47, '40-49': 41, '50-59': 35, '60-69': 30, '70+': 20 },
  4: { '18-29': 60, '30-39': 56, '40-49': 49, '50-59': 42, '60-69': 35, '70+': 24 },
  5: { '18-29': 70, '30-39': 66, '40-49': 57, '50-59': 49, '60-69': 41, '70+': 28 },
  6: { '18-29': 80, '30-39': 75, '40-49': 66, '50-59': 56, '60-69': 47, '70+': 32 },
  7: { '18-29': 90, '30-39': 85, '40-49': 74, '50-59': 63, '60-69': 53, '70+': 36 },
  8: { '18-29': 100, '30-39': 94, '40-49': 82, '50-59': 70, '60-69': 59, '70+': 40 },
  9: { '18-29': 110, '30-39': 103, '40-49': 90, '50-59': 77, '60-69': 65, '70+': 44 },
  10: { '18-29': 120, '30-39': 113, '40-49': 98, '50-59': 84, '60-69': 71, '70+': 48 },
};

const WALL_SIT_FEMALE: StrengthStandardsTable = {
  1: { '18-29': 20, '30-39': 19, '40-49': 16, '50-59': 14, '60-69': 12, '70+': 8 },
  2: { '18-29': 30, '30-39': 28, '40-49': 25, '50-59': 21, '60-69': 18, '70+': 12 },
  3: { '18-29': 40, '30-39': 38, '40-49': 33, '50-59': 28, '60-69': 24, '70+': 16 },
  4: { '18-29': 50, '30-39': 47, '40-49': 41, '50-59': 35, '60-69': 30, '70+': 20 },
  5: { '18-29': 60, '30-39': 56, '40-49': 49, '50-59': 42, '60-69': 35, '70+': 24 },
  6: { '18-29': 70, '30-39': 66, '40-49': 57, '50-59': 49, '60-69': 41, '70+': 28 },
  7: { '18-29': 80, '30-39': 75, '40-49': 66, '50-59': 56, '60-69': 47, '70+': 32 },
  8: { '18-29': 90, '30-39': 85, '40-49': 74, '50-59': 63, '60-69': 53, '70+': 36 },
  9: { '18-29': 100, '30-39': 94, '40-49': 82, '50-59': 70, '60-69': 59, '70+': 40 },
  10: { '18-29': 110, '30-39': 103, '40-49': 90, '50-59': 77, '60-69': 65, '70+': 44 },
};

export function normalizeStrengthType(type: string): StrengthType {
  const t = type.trim().toLowerCase();
  if (t === 'wallsit' || t === 'wall sit' || t === 'wall_sit') return 'Wall Sit';
  return 'Plank';
}

export function resolveStrengthAgeBracket(age: number): AgeBracket | null {
  if (age >= 18 && age <= 29) return '18-29';
  if (age >= 30 && age <= 39) return '30-39';
  if (age >= 40 && age <= 49) return '40-49';
  if (age >= 50 && age <= 59) return '50-59';
  if (age >= 60 && age <= 69) return '60-69';
  if (age >= 70) return '70+';
  return null;
}

export function getStrengthStandardsTable(
  type: string,
  gender: string,
): StrengthStandardsTable {
  const normalized = normalizeStrengthType(type);
  const isFemale = gender.trim().toLowerCase() === 'female';

  if (normalized === 'Wall Sit') {
    return isFemale ? WALL_SIT_FEMALE : WALL_SIT_MALE;
  }

  return isFemale ? PLANK_FEMALE : PLANK_MALE;
}

/** Flutter `getStrengthLvl` — highest level whose threshold the hold meets. */
export function getStrengthLevel(
  dob: Date,
  gender: string,
  timeSeconds: number,
  type: string,
): number {
  const ageBracket = resolveStrengthAgeBracket(calculateAge(dob));
  if (!ageBracket) return 0;

  const table = getStrengthStandardsTable(type, gender);
  for (let lvl = 10; lvl >= 1; lvl--) {
    const required = table[lvl]?.[ageBracket];
    if (required != null && timeSeconds >= required) {
      return lvl;
    }
  }

  return 1;
}

/** Flutter `getStrengthPct` — hold time vs level-10 standard for age/gender. */
export function getStrengthPct(
  dob: Date,
  gender: string,
  timeSeconds: number,
  type: string,
): number {
  const ageBracket = resolveStrengthAgeBracket(calculateAge(dob));
  if (!ageBracket) return 0;

  const table = getStrengthStandardsTable(type, gender);
  const maxLevelTime = table[10]?.[ageBracket];
  if (!maxLevelTime) return 0;

  const pct = Math.max(0, Math.min(100, (timeSeconds / maxLevelTime) * 100));
  return Math.round(pct * 100) / 100;
}

/** Histogram / headline RP display — mirrors cardio rounding. */
export function strengthRelativePerformancePercent(rp: number): number {
  const clamped = Math.max(0, Math.min(100, rp));
  if (clamped >= 99.5) return 100;
  return Math.round(clamped);
}

export function strengthRequiredHoldSec(
  level: number,
  dob: Date,
  gender: string,
  type: string,
): number {
  const ageBracket = resolveStrengthAgeBracket(calculateAge(dob));
  if (!ageBracket) return 0;

  const clampedLevel = Math.max(1, Math.min(10, Math.floor(level)));
  const table = getStrengthStandardsTable(type, gender);
  return table[clampedLevel]?.[ageBracket] ?? 0;
}

export function buildStrengthRpText(
  dob: Date,
  gender: string,
  timeSeconds: number,
  type: string,
): { percentile: number; rpText: string } {
  const pct = getStrengthPct(dob, gender, timeSeconds, type);
  const percentile = strengthRelativePerformancePercent(pct);
  const ageBracket = resolveStrengthAgeBracket(calculateAge(dob));
  const cohort = formatGenderCohort(gender);
  const bracketLabel = ageBracket ? formatAgeBracketLabel(ageBracket) : 'your age group';

  return {
    percentile,
    rpText: `Stronger than ${percentile}% of ${cohort} aged ${bracketLabel}.`,
  };
}
