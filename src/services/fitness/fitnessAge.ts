/**
 * Fitness Age from the Kale model — mirrors Kale-Website `lib/ip/rating.ts`
 * (fitness_age_to_level_map.csv). Mortality-calibrated and motivational only,
 * so it can be older than real age. Stored as offsets from real age at each
 * anchor age, per sex, for levels 1 to 10; ages between anchors are interpolated.
 *
 * Keep these tables in sync with the website if the model changes.
 */

export type Sex = 'Male' | 'Female';

export const FITNESS_LEVEL_MIN = 1;
export const FITNESS_LEVEL_MAX = 10;

const ANCHOR_AGES = [25, 35, 45, 55, 65, 75] as const;

/** Fitness Age minus real age, by sex, anchor age and level (index 0 = L1). */
const FITNESS_OFFSET: Record<'male' | 'female', Record<number, number[]>> = {
  male: {
    25: [7, 5, 2, 0, -2, -5, -7, -7, -7, -7],
    35: [6, 4, 1, -1, -3, -6, -9, -13, -17, -17],
    45: [5, 3, 1, -1, -3, -5, -9, -13, -17, -20],
    55: [5, 3, 1, -2, -4, -6, -9, -13, -17, -20],
    65: [4, 2, 0, -2, -4, -6, -9, -12, -16, -19],
    75: [3, 1, -1, -2, -4, -6, -8, -11, -15, -17],
  },
  female: {
    25: [4, 2, 0, -2, -5, -7, -7, -7, -7, -7],
    35: [3, 1, -1, -3, -5, -7, -10, -15, -17, -17],
    45: [3, 1, -1, -3, -5, -7, -10, -14, -18, -21],
    55: [3, 2, 0, -2, -4, -6, -8, -12, -15, -18],
    65: [3, 2, 0, -1, -3, -5, -7, -10, -13, -15],
    75: [3, 2, 0, -1, -2, -4, -6, -8, -11, -13],
  },
};

const AGE_FLOOR = 18;

function offsetAt(sex: Sex, age: number, level: number): number {
  const rows = FITNESS_OFFSET[sex === 'Female' ? 'female' : 'male'];
  const i = Math.max(FITNESS_LEVEL_MIN, Math.min(FITNESS_LEVEL_MAX, Math.round(level))) - 1;
  const first = ANCHOR_AGES[0];
  const last = ANCHOR_AGES[ANCHOR_AGES.length - 1];
  if (age <= first) return rows[first]![i]!;
  if (age >= last) return rows[last]![i]!;
  const lo = ANCHOR_AGES.filter((a) => a <= age).pop()!;
  const hi = ANCHOR_AGES.find((a) => a > age)!;
  const t = (age - lo) / (hi - lo);
  return rows[lo]![i]! + (rows[hi]![i]! - rows[lo]![i]!) * t;
}

/** Customer-facing Fitness Age for this level. Can be older than real age. */
export function fitnessAge(level: number, age: number, sex: Sex): number {
  return Math.max(AGE_FLOOR, Math.round(age + offsetAt(sex, age, level)));
}

/** Map a stored gender string onto the model's Sex, defaulting to Male. */
export function toSex(gender: string | null | undefined): Sex {
  return (gender ?? '').trim().toLowerCase().startsWith('f') ? 'Female' : 'Male';
}

/** Whole years from a 'YYYY-MM-DD' date of birth to `today`. */
export function ageFromDob(dob: string, today = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  let age = today.getFullYear() - year;
  const month1 = today.getMonth() + 1;
  const hadBirthday = month1 > month || (month1 === month && today.getDate() >= day);
  if (!hadBirthday) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}
