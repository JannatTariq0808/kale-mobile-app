import type { OnTrackStatus, RunningYearsProjection, RunningYearsTrajectory } from '../types/runningYears';

export const THRESHOLD_STILL_RUNNING = 27;
export const THRESHOLD_ACTIVE_LIFE = 24;
export const THRESHOLD_INDEPENDENCE = 18;
/** VO₂max stays flat until this age, then declines. */
export const VO2_PEAK_AGE = 30;
const CHART_MAX_AGE = 86;
/** ~0.5%/year with consistent training. */
const KEEP_DECLINE_RATE = 0.005;
/** Steeper when projection dipped this quarter. */
const KEEP_DECLINE_RATE_STEEP = 0.007;
/** ~10% per decade without training. */
const NONE_DECLINE_PER_DECADE = 0.1;

/**
 * Approximate elite / lifelong-trained ceiling (men; women ~10% lower).
 * Outliers, not targets — drawn as the Max VO₂max guide on the chart.
 */
const MAX_VO2_BY_AGE: Array<{ age: number; vo2: number }> = [
  { age: 30, vo2: 88 },
  { age: 40, vo2: 79 },
  { age: 50, vo2: 71 },
  { age: 60, vo2: 64 },
  { age: 70, vo2: 55 },
  { age: 80, vo2: 48 },
  { age: 86, vo2: 45 },
];

/** Elite ceiling VO₂max at a given age — linear between decade anchors. */
export function maxVo2Ceiling(age: number): number {
  const first = MAX_VO2_BY_AGE[0];
  const last = MAX_VO2_BY_AGE[MAX_VO2_BY_AGE.length - 1];
  if (age <= first.age) return first.vo2;
  if (age >= last.age) return last.vo2;

  for (let i = 0; i < MAX_VO2_BY_AGE.length - 1; i++) {
    const a = MAX_VO2_BY_AGE[i];
    const b = MAX_VO2_BY_AGE[i + 1];
    if (age >= a.age && age <= b.age) {
      const t = (age - a.age) / (b.age - a.age);
      return a.vo2 + t * (b.vo2 - a.vo2);
    }
  }
  return first.vo2;
}

function declineYearsBetween(ageNow: number, targetAge: number): number {
  if (targetAge <= ageNow) return 0;
  const declineFrom = Math.max(ageNow, VO2_PEAK_AGE);
  return Math.max(0, targetAge - declineFrom);
}

function noneDeclineRatePerYear(): number {
  return 1 - (1 - NONE_DECLINE_PER_DECADE) ** (1 / 10);
}

export function keepVo2(
  vo2Now: number,
  yearsAhead: number,
  declining = false,
  ageNow = VO2_PEAK_AGE,
): number {
  const targetAge = ageNow + yearsAhead;
  const years = declineYearsBetween(ageNow, targetAge);
  if (years <= 0) return vo2Now;
  const rate = declining ? KEEP_DECLINE_RATE_STEEP : KEEP_DECLINE_RATE;
  return vo2Now * (1 - rate) ** years;
}

export function noneVo2(vo2Now: number, yearsAhead: number, ageNow = VO2_PEAK_AGE): number {
  const targetAge = ageNow + yearsAhead;
  const years = declineYearsBetween(ageNow, targetAge);
  if (years <= 0) return vo2Now;
  const rate = noneDeclineRatePerYear();
  return vo2Now * (1 - rate) ** years;
}

function crossAge(
  vo2At: (yearsAhead: number) => number,
  threshold: number,
  ageNow: number,
): number | null {
  for (let age = ageNow; age <= CHART_MAX_AGE; age += 0.25) {
    const yearsAhead = age - ageNow;
    if (vo2At(yearsAhead) <= threshold) return age;
  }
  return null;
}

export function buildTrajectory(
  vo2Now: number,
  ageNow: number,
  goalAge: number,
  declining = false,
): RunningYearsTrajectory {
  const ages: number[] = [];
  const keep: number[] = [];
  const none: number[] = [];

  for (let age = ageNow; age <= CHART_MAX_AGE; age++) {
    const t = age - ageNow;
    ages.push(age);
    keep.push(Math.max(0, keepVo2(vo2Now, t, declining, ageNow)));
    none.push(Math.max(0, noneVo2(vo2Now, t, ageNow)));
  }

  return {
    ages,
    keep,
    none,
    nowAge: ageNow,
    goalAge,
    thresholds: {
      stillRunning: THRESHOLD_STILL_RUNNING,
      active: THRESHOLD_ACTIVE_LIFE,
      independence: THRESHOLD_INDEPENDENCE,
    },
  };
}

export function computeRunningYears(
  vo2Now: number,
  ageNow: number,
  declining = false,
): { runningYears: number; activeUntilAge: number | null } {
  const cross = crossAge(
    (t) => keepVo2(vo2Now, t, declining, ageNow),
    THRESHOLD_STILL_RUNNING,
    ageNow,
  );
  if (cross == null) {
    return {
      runningYears: CHART_MAX_AGE - ageNow,
      activeUntilAge: CHART_MAX_AGE,
    };
  }
  return {
    runningYears: Math.max(0, Math.round(cross - ageNow)),
    activeUntilAge: Math.round(cross),
  };
}

export function computeGapYears(vo2Now: number, ageNow: number, declining = false): number {
  const keepCross = crossAge(
    (t) => keepVo2(vo2Now, t, declining, ageNow),
    THRESHOLD_STILL_RUNNING,
    ageNow,
  );
  const noneCross = crossAge((t) => noneVo2(vo2Now, t, ageNow), THRESHOLD_STILL_RUNNING, ageNow);
  const keepEnd = keepCross ?? CHART_MAX_AGE;
  const noneEnd = noneCross ?? CHART_MAX_AGE;
  return Math.max(0, Math.round(keepEnd - noneEnd));
}

export function vo2AtGoalAge(
  vo2Now: number,
  ageNow: number,
  goalAge: number,
  declining = false,
): number {
  return keepVo2(vo2Now, goalAge - ageNow, declining, ageNow);
}

export function computeOnTrack(
  goalAge: number,
  vo2Now: number,
  ageNow: number,
  activeUntilAge: number | null,
  declining = false,
): {
  onTrack: OnTrackStatus;
  yearsToSpare: number;
} {
  const vo2AtGoal = vo2AtGoalAge(vo2Now, ageNow, goalAge, declining);
  const meetsThreshold = vo2AtGoal >= THRESHOLD_STILL_RUNNING;
  const activeUntil = activeUntilAge ?? CHART_MAX_AGE;
  const spare = activeUntil - goalAge;
  return {
    onTrack: meetsThreshold && spare >= 0 ? 'on_track' : 'stretch',
    yearsToSpare: Math.abs(spare),
  };
}

/** Rough VO₂ percentile for display when backend has no cohort data. */
export function estimateVo2Percentile(vo2: number, age: number): number {
  const expected = 48 - Math.max(0, age - VO2_PEAK_AGE) * 0.35;
  const delta = vo2 - expected;
  if (delta >= 12) return 95;
  if (delta >= 8) return 90;
  if (delta >= 4) return 75;
  if (delta >= 0) return 60;
  if (delta >= -4) return 40;
  return 25;
}

export function estimatedBand(runningYears: number, confidence: 'high' | 'estimated'): {
  low: number;
  high: number;
} {
  if (confidence === 'high') {
    return { low: runningYears, high: runningYears };
  }
  const spread = Math.max(3, Math.round(runningYears * 0.12));
  return {
    low: Math.max(1, runningYears - spread),
    high: runningYears + spread,
  };
}

/** Ages at or below this get young-profile copy. */
export const YOUNG_PROFILE_MAX_AGE = 29;

export function isYoungProfile(age: number): boolean {
  return age <= YOUNG_PROFILE_MAX_AGE;
}

export function formatRunningYearsHero(
  projection: Pick<
    RunningYearsProjection,
    'screenState' | 'runningYears' | 'runningYearsLow' | 'runningYearsHigh'
  >,
): { value: string; showTilde: boolean; showEstimatedBand: boolean } {
  const showEstimatedBand =
    projection.screenState === 'estimated' &&
    projection.runningYearsLow != null &&
    projection.runningYearsHigh != null;

  if (showEstimatedBand) {
    return {
      value: `${projection.runningYearsLow}–${projection.runningYearsHigh}`,
      showTilde: false,
      showEstimatedBand: true,
    };
  }

  return {
    value: String(projection.runningYears),
    showTilde: true,
    showEstimatedBand: false,
  };
}

export function buildHeroSubcopy(
  age: number,
  activeUntilAge: number | null,
  runningYears: number,
  sport: 'running' | 'cycling' = 'running',
): string {
  const activeUntil = activeUntilAge ?? age + runningYears;
  const activeDecade = Math.floor(activeUntil / 10) * 10;
  const stillActive =
    sport === 'cycling'
      ? `still be riding in your mid-${activeDecade}s`
      : `still be lacing up in your mid-${activeDecade}s`;

  if (isYoungProfile(age)) {
    if (runningYears < 8) {
      return "You're early in your training journey — VO₂max holds steady until your 30s, then training sets the pace.";
    }
    if (activeDecade < 50) {
      return `At ${age}, you're building your baseline — keep training and this window grows into your ${activeDecade}s and beyond.`;
    }
    return `You're ${age} with a long runway — on track to ${stillActive}.`;
  }

  return `On track to ${stillActive} — old enough to still do the things you love.`;
}

export function estimatedConfidenceNote(projection: RunningYearsProjection): string | null {
  if (projection.screenState !== 'estimated') return null;
  if (isYoungProfile(projection.age)) {
    return 'Estimated from your tracker or resting HR — connect Garmin for a tighter VO₂max reading.';
  }
  return 'Estimated range — connect Garmin for a precise VO₂max reading.';
}

export function formatGapYearsCard(gapYears: number): {
  value: string | null;
  body: string;
  accent: string;
} {
  if (gapYears > 0) {
    return {
      value: `+${gapYears}`,
      body: 'extra years still running — ',
      accent: "the years you're choosing to keep.",
    };
  }

  return {
    value: null,
    body: 'Training keeps you above the still-running line — ',
    accent: "the years you're choosing to keep.",
  };
}
