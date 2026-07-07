/** Port of Flutter cardio relative-performance tables and scoring. */

export type CardioType = 'Running' | 'Cycling';

export type AgeBracket = '18-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70+';

type LevelRange = [number, number];

const LEVEL_LOW = [35, 40, 45, 50, 55, 60, 65, 75, 85, 95] as const;
const LEVEL_HIGH = [40, 45, 50, 55, 60, 65, 75, 85, 95, 100] as const;

const FTP_MULTIPLIERS: Record<number, number> = {
  10: 1.12,
  20: 1.053,
  30: 1.02,
  40: 1.01,
  50: 1.005,
  60: 1.0,
  70: 0.983,
  80: 0.967,
  90: 0.95,
  100: 0.933,
  110: 0.917,
  120: 0.9,
};

const FTP_DURATION_KEYS = Object.keys(FTP_MULTIPLIERS).map(Number);

const MALE_CYCLING_THRESHOLDS: Record<AgeBracket, LevelRange[]> = {
  '18-29': [
    [2.1, 2.4],
    [2.5, 2.7],
    [2.8, 3.1],
    [3.2, 3.4],
    [3.5, 3.7],
    [3.8, 4.0],
    [4.1, 4.7],
    [4.8, 5.3],
    [5.4, 6.0],
    [6.1, 6.4],
  ],
  '30-39': [
    [2.1, 2.4],
    [2.5, 2.6],
    [2.7, 3.0],
    [3.1, 3.3],
    [3.4, 3.6],
    [3.7, 3.9],
    [4.0, 4.6],
    [4.7, 5.2],
    [5.3, 5.9],
    [6.0, 6.3],
  ],
  '40-49': [
    [1.9, 2.2],
    [2.3, 2.5],
    [2.6, 2.9],
    [2.9, 3.1],
    [3.2, 3.4],
    [3.5, 3.7],
    [3.8, 4.3],
    [4.4, 4.9],
    [5.0, 5.5],
    [5.6, 5.9],
  ],
  '50-59': [
    [1.8, 2.1],
    [2.2, 2.3],
    [2.4, 2.7],
    [2.8, 3.0],
    [3.0, 3.2],
    [3.3, 3.5],
    [3.6, 4.1],
    [4.2, 4.6],
    [4.7, 5.2],
    [5.3, 5.6],
  ],
  '60-69': [
    [1.7, 3.0],
    [2.0, 3.4],
    [2.2, 3.9],
    [2.6, 4.3],
    [2.8, 4.6],
    [3.0, 5.0],
    [3.3, 5.9],
    [3.8, 6.6],
    [4.3, 7.5],
    [4.9, 5.1],
  ],
  '70+': [
    [1.4, 1.7],
    [1.7, 1.9],
    [1.9, 2.1],
    [2.2, 2.3],
    [2.4, 2.6],
    [2.6, 2.8],
    [2.8, 3.2],
    [3.3, 3.7],
    [3.7, 4.1],
    [4.2, 4.4],
  ],
};

const FEMALE_CYCLING_THRESHOLDS: Record<AgeBracket, LevelRange[]> = {
  '18-29': [
    [1.8, 2.0],
    [2.1, 2.3],
    [2.4, 2.6],
    [2.7, 2.9],
    [3.0, 3.2],
    [3.3, 3.5],
    [3.6, 4.0],
    [4.1, 4.6],
    [4.7, 5.2],
    [5.3, 5.5],
  ],
  '30-39': [
    [1.8, 2.0],
    [2.1, 2.3],
    [2.4, 2.5],
    [2.6, 2.8],
    [2.9, 3.1],
    [3.2, 3.4],
    [3.5, 3.9],
    [4.0, 4.5],
    [4.6, 5.1],
    [5.2, 5.4],
  ],
  '40-49': [
    [1.7, 1.8],
    [1.9, 2.1],
    [2.2, 2.4],
    [2.5, 2.7],
    [2.8, 2.9],
    [3.0, 3.2],
    [3.3, 3.7],
    [3.8, 4.2],
    [4.3, 4.8],
    [4.9, 5.1],
  ],
  '50-59': [
    [1.5, 1.6],
    [1.7, 1.9],
    [1.9, 2.1],
    [2.2, 2.3],
    [2.4, 2.6],
    [2.7, 2.8],
    [2.9, 3.2],
    [3.3, 3.7],
    [3.8, 4.2],
    [4.3, 4.5],
  ],
  '60-69': [
    [1.3, 1.4],
    [1.5, 1.6],
    [1.7, 1.8],
    [1.9, 2.0],
    [2.1, 2.2],
    [2.3, 2.5],
    [2.5, 2.8],
    [2.9, 3.2],
    [3.3, 3.6],
    [3.7, 3.9],
  ],
  '70+': [
    [1.1, 1.2],
    [1.3, 1.4],
    [1.4, 1.6],
    [1.6, 1.7],
    [1.8, 1.9],
    [2.0, 2.1],
    [2.2, 2.4],
    [2.5, 2.8],
    [2.8, 3.1],
    [3.2, 3.3],
  ],
};

const FEMALE_RUN_THRESHOLDS: Record<AgeBracket, LevelRange[]> = {
  '18-29': [
    [40.0, 35.0],
    [34.9, 31.1],
    [31.0, 28.0],
    [27.9, 25.5],
    [25.4, 23.3],
    [23.2, 21.5],
    [21.4, 18.7],
    [18.6, 16.5],
    [16.4, 14.7],
    [14.6, 14.0],
  ],
  '30-39': [
    [40.8, 35.7],
    [35.6, 31.7],
    [31.6, 28.6],
    [28.5, 26.0],
    [25.9, 23.8],
    [23.7, 22.0],
    [21.8, 19.0],
    [19.0, 16.8],
    [16.7, 15.0],
    [14.9, 14.3],
  ],
  '40-49': [
    [43.5, 38.0],
    [37.9, 33.8],
    [33.7, 30.4],
    [30.3, 27.7],
    [27.6, 25.4],
    [25.2, 23.4],
    [23.3, 20.3],
    [20.2, 17.9],
    [17.8, 16.0],
    [15.9, 15.2],
  ],
  '50-59': [
    [49.4, 43.2],
    [43.1, 38.4],
    [38.3, 34.6],
    [34.4, 31.4],
    [31.4, 28.8],
    [28.6, 26.6],
    [26.4, 23.0],
    [23.0, 20.3],
    [20.2, 18.2],
    [18.0, 17.3],
  ],
  '60-69': [
    [57.1, 50.0],
    [49.9, 44.4],
    [44.3, 40.0],
    [39.9, 36.4],
    [36.3, 33.3],
    [33.1, 30.8],
    [30.6, 26.7],
    [26.6, 23.5],
    [23.4, 21.1],
    [20.9, 20.0],
  ],
  '70+': [
    [66.7, 58.3],
    [58.2, 51.9],
    [51.7, 46.7],
    [46.5, 42.4],
    [42.3, 38.9],
    [38.7, 35.9],
    [35.7, 31.1],
    [31.0, 27.5],
    [27.3, 24.6],
    [24.3, 23.3],
  ],
};

const MALE_RUN_THRESHOLDS: Record<AgeBracket, LevelRange[]> = {
  '18-29': [
    [37.1, 32.5],
    [32.4, 28.9],
    [28.8, 26.0],
    [25.9, 23.6],
    [23.5, 21.7],
    [21.6, 20.0],
    [19.9, 17.3],
    [17.2, 15.3],
    [15.2, 13.7],
    [13.6, 13.0],
  ],
  '30-39': [
    [37.9, 33.2],
    [33.1, 29.5],
    [29.4, 26.5],
    [26.4, 24.1],
    [24.0, 22.1],
    [22.0, 20.4],
    [20.3, 17.7],
    [17.6, 15.6],
    [15.5, 14.0],
    [13.9, 13.3],
  ],
  '40-49': [
    [40.4, 35.3],
    [35.2, 31.4],
    [31.3, 28.3],
    [28.2, 25.7],
    [25.5, 23.6],
    [23.5, 21.7],
    [21.6, 18.8],
    [18.7, 16.6],
    [16.5, 14.9],
    [14.8, 14.1],
  ],
  '50-59': [
    [42.7, 37.4],
    [37.2, 33.2],
    [33.1, 29.9],
    [29.8, 27.2],
    [27.0, 24.9],
    [24.8, 23.0],
    [22.9, 19.9],
    [19.8, 17.6],
    [17.5, 15.7],
    [15.6, 14.9],
  ],
  '60-69': [
    [46.4, 40.6],
    [40.5, 36.1],
    [36.0, 32.5],
    [32.4, 29.5],
    [29.4, 27.1],
    [27.0, 25.0],
    [24.9, 21.7],
    [21.5, 19.1],
    [19.0, 17.1],
    [17.0, 16.3],
  ],
  '70+': [
    [51.6, 45.1],
    [45.0, 40.1],
    [40.0, 36.1],
    [36.0, 32.8],
    [32.6, 30.1],
    [30.0, 27.8],
    [27.6, 24.1],
    [23.9, 21.2],
    [21.1, 19.0],
    [18.9, 18.1],
  ],
};

export function calculateAge(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const monthDelta = now.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/** Cycling brackets — Flutter `getCyclingVo2BracketsForUser`. */
function resolveCyclingAgeGroup(age: number): AgeBracket {
  if (age >= 18 && age <= 29) return '18-29';
  if (age <= 39) return '30-39';
  if (age <= 49) return '40-49';
  if (age <= 59) return '50-59';
  if (age <= 69) return '60-69';
  return '70+';
}

/** Run brackets — Flutter `getRunLevelsForUser`. */
function resolveRunAgeGroup(age: number): AgeBracket {
  if (age <= 29) return '18-29';
  if (age <= 39) return '30-39';
  if (age <= 49) return '40-49';
  if (age <= 59) return '50-59';
  if (age <= 69) return '60-69';
  return '70+';
}

export function resolveAgeGroup(age: number): AgeBracket {
  return resolveCyclingAgeGroup(age);
}

export function formatAgeBracketLabel(bracket: AgeBracket): string {
  return bracket.replace('-', '–');
}

export function formatGenderCohort(gender: string): string {
  const normalized = gender.trim().toLowerCase();
  if (normalized === 'male' || normalized === 'm') return 'men';
  if (normalized === 'female' || normalized === 'f') return 'women';
  return gender;
}

function closestDurationKey(durationMin: number): number {
  return FTP_DURATION_KEYS.reduce((a, b) =>
    Math.abs(durationMin - a) < Math.abs(durationMin - b) ? a : b,
  );
}

/** Port of Flutter `calculateFtp` — returns FTP per kg. */
export function calculateFtp(
  powerWatts: number,
  weightKg: number,
  durationMin: number,
): number {
  const closestDuration = closestDurationKey(durationMin);
  const multiplier = FTP_MULTIPLIERS[closestDuration]!;
  const ftp = powerWatts / multiplier;
  return ftp / weightKg;
}

export function getCyclingVo2BracketsForUser(
  gender: string,
  age: number,
): LevelRange[] {
  const bracket = resolveCyclingAgeGroup(age);
  const table =
    gender.toLowerCase() === 'male' ? MALE_CYCLING_THRESHOLDS : FEMALE_CYCLING_THRESHOLDS;
  return table[bracket];
}

export function getRunLevelsForUser(gender: string, age: number): LevelRange[] {
  const bracket = resolveRunAgeGroup(age);
  const table = gender.toLowerCase() === 'male' ? MALE_RUN_THRESHOLDS : FEMALE_RUN_THRESHOLDS;
  return table[bracket];
}

function scoreCyclingFtpPerKg(resolvedFtpPerKg: number, levels: LevelRange[]): number {
  if (resolvedFtpPerKg < levels[0][0]) return LEVEL_LOW[0];
  if (resolvedFtpPerKg >= levels[9][1]) return LEVEL_HIGH[9];

  for (let i = 0; i < levels.length; i++) {
    const [low, high] = levels[i];
    if (resolvedFtpPerKg >= low && resolvedFtpPerKg <= high) {
      const t = (resolvedFtpPerKg - low) / (high - low);
      return LEVEL_LOW[i] + t * (LEVEL_HIGH[i] - LEVEL_LOW[i]);
    }
  }

  for (let i = 0; i < levels.length - 1; i++) {
    if (resolvedFtpPerKg > levels[i][1] && resolvedFtpPerKg < levels[i + 1][0]) {
      return LEVEL_HIGH[i];
    }
  }

  return LEVEL_LOW[0];
}

function scoreRunningFiveKTime(fiveKTime: number, levels: LevelRange[]): number {
  if (fiveKTime >= levels[0][0]) return LEVEL_LOW[0];
  if (fiveKTime <= levels[9][1]) return LEVEL_HIGH[9];

  for (let i = 0; i < levels.length; i++) {
    const [slow, fast] = levels[i];
    if (fiveKTime <= slow && fiveKTime >= fast) {
      const t = (slow - fiveKTime) / (slow - fast);
      return LEVEL_LOW[i] + t * (LEVEL_HIGH[i] - LEVEL_LOW[i]);
    }
  }

  for (let i = 0; i < levels.length - 1; i++) {
    if (fiveKTime < levels[i][1] && fiveKTime > levels[i + 1][0]) {
      return LEVEL_HIGH[i];
    }
  }

  return LEVEL_LOW[0];
}

export type CalculatePerformanceCardioInput = {
  dob: Date;
  gender: string;
  userValue: number;
  levelSource: CardioType;
  distanceKm?: number | null;
  weightKg?: number | null;
  durationMin?: number | null;
  ftpPerKg?: number | null;
};

/** Port of Flutter `calculatePerformanceCardioNew` — returns RP score 35–100. */
export function calculatePerformanceCardioNew({
  dob,
  gender,
  userValue,
  levelSource,
  distanceKm,
  weightKg,
  durationMin,
  ftpPerKg,
}: CalculatePerformanceCardioInput): number {
  if (userValue <= 0) return 0;

  const age = calculateAge(dob);

  if (levelSource === 'Cycling') {
    const resolvedFtpPerKg =
      ftpPerKg ??
      calculateFtp(userValue, weightKg!, durationMin!);

    const levels = getCyclingVo2BracketsForUser(gender, age);
    return scoreCyclingFtpPerKg(resolvedFtpPerKg, levels);
  }

  const distance = distanceKm!;
  const actualTime = userValue * distance;
  const fiveKTime = actualTime * Math.pow(5 / distance, 1.07);
  const levels = getRunLevelsForUser(gender, age);

  return scoreRunningFiveKTime(fiveKTime, levels);
}

export function cardioRelativePerformancePercent(rp: number): number {
  const clamped = Math.max(35, Math.min(100, rp));
  // Avoid 99 when bracket math lands at 99.5–99.9 (elite scores should read 100).
  if (clamped >= 99.5) return 100;
  return Math.round(clamped);
}

/** Progress within the current cardio level band (0–1) from the RP score. */
export function cardioLevelProgress(rp: number, level: number): number {
  const idx = Math.max(0, Math.min(9, Math.floor(level) - 1));
  const low = LEVEL_LOW[idx];
  const high = LEVEL_HIGH[idx];
  if (high <= low) return 1;
  return Math.max(0, Math.min(1, (rp - low) / (high - low)));
}

/** Pace in min/km → M:SS (floor seconds = faster pace). */
export function formatCardioPace(pace: number): string {
  const totalSeconds = Math.floor(pace * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Trim trailing zeros from a fixed-decimal number string. */
export function formatCardioNumber(value: number): string {
  return value
    .toFixed(2)
    .replace(/\.?0+$/, '');
}

export type CardioLevelUpMessageInput = {
  cardioType: string;
  gender: string;
  dob: Date;
  currentLevel: number;
  userValue: number;
  weightKg?: number | null;
};

/** Port of Flutter `getCardioLevelUpMessage`. */
export function getCardioLevelUpMessage({
  cardioType,
  gender,
  dob,
  currentLevel,
  userValue,
  weightKg,
}: CardioLevelUpMessageInput): string {
  if (currentLevel >= 10) return '';

  const nextLevel = currentLevel + 1;
  const age = calculateAge(dob);
  const type = cardioType.toLowerCase();

  if (type === 'run' || type === 'running') {
    const levels = getRunLevelsForUser(gender, age);
    const nextRow = levels[nextLevel - 1];
    const next5kTime = nextRow[0];
    const nextPace = next5kTime / 5;

    let targetPace = nextPace;
    if (Math.floor(targetPace * 60) >= Math.floor(userValue * 60)) {
      targetPace = userValue - 0.01;
    }

    return `Keep going! Hit ${formatCardioPace(targetPace)} min/km to reach Level ${nextLevel}`;
  }

  const levels = getCyclingVo2BracketsForUser(gender, age);
  const nextRow = levels[nextLevel - 1];
  const nextLow = nextRow[0];
  const requiredFtpWatts = nextLow * weightKg!;

  return `Keep going! Hit ${formatCardioNumber(requiredFtpWatts)} W FTP to reach Level ${nextLevel}`;
}
