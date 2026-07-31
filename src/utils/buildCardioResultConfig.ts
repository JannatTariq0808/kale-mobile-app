import type { LumenResultConfig } from '../components/lumen/LumenResultView';
import type { CardioSummary } from '../services/cardio/fetchCardioSummary';
import type { HealthProfileForAssess } from '../services/user/fetchHealthProfile';
import type { CardioType } from './cardioPerformance';
import { isGarminDeviceName } from './cardioDevice';
import {
  calculateFtp,
  calculatePerformanceCardioNew,
  cardioRelativePerformancePercent,
  formatAgeBracketLabel,
  formatCardioPace,
  formatGenderCohort,
  getCardioLevelUpMessage,
  resolveAgeGroup,
  calculateAge,
} from './cardioPerformance';
import { resolveLevelTrend } from './resolveLevelTrend';

function formatPaceValue(pace: number): string {
  if (!pace || !Number.isFinite(pace)) return '—';
  return formatCardioPace(pace);
}

function formatDistanceValue(distanceKm: number): string {
  if (!distanceKm || !Number.isFinite(distanceKm)) return '—';
  return distanceKm.toFixed(1);
}

type BuildCardioResultInput = {
  summary: CardioSummary;
  profile: HealthProfileForAssess;
  previousLevel?: number | null;
  nextBtn?: string;
};

/** Website "Continue as Level 1" — no tracker activities / VO₂max. */
export function isBaselineCardioSummary(summary: CardioSummary): boolean {
  const noVo2 = summary.vo2max == null || summary.vo2max <= 0;
  const noDistance = summary.distanceKm == null || summary.distanceKm <= 0;
  const noPace = summary.paceMinPerKm == null || summary.paceMinPerKm <= 0;
  const noRuns =
    (summary.runLevel == null || summary.runLevel <= 0) &&
    (summary.cycleLevel == null || summary.cycleLevel <= 0);
  const unverifiedLike =
    summary.levelSource == null &&
    (summary.assessmentStatus === 'level_assigned' ||
      summary.assessmentStatus === 'no_activities' ||
      summary.assessmentStatus === 'no_eligible');

  return summary.level > 0 && noVo2 && noDistance && noPace && (unverifiedLike || noRuns);
}

export function buildBaselineCardioResultConfig(options?: {
  level?: number;
  nextBtn?: string;
}): LumenResultConfig {
  const level = Math.max(1, Math.min(10, options?.level ?? 1));
  return {
    pillar: 'cardio',
    pillarLabel: 'Cardio',
    level,
    trend: 'none',
    levelNote: 'Baseline Level 1 — no tracker connected yet.',
    percentile: null,
    rpText:
      'No cohort ranking yet. Connect Garmin or Strava later to unlock VO₂max, activity history, and a fitness-based level.',
    resultHero: '—',
    resultUnit: '',
    resultLabel: 'No synced activities',
    tiles: [
      { label: 'VO₂max', value: '—', unit: '' },
      { label: 'Activities', value: '0' },
    ],
    nextLevel: Math.min(10, level + 1),
    nextActions: [],
    levelUpMessage:
      'Connect Strava or Garmin and sync a qualifying run or ride to improve your cardio level.',
    nextBtn: options?.nextBtn ?? 'Next — Strength',
  };
}

function resolveFtpPerKg(
  summary: CardioSummary,
  weightKg: number,
): number | null {
  if (summary.ftpPerKg && summary.ftpPerKg > 0) return summary.ftpPerKg;
  if (
    summary.headlinePowerWatts &&
    summary.headlinePowerWatts > 0 &&
    summary.timeMin &&
    summary.timeMin > 0 &&
    weightKg > 0
  ) {
    return calculateFtp(summary.headlinePowerWatts, weightKg, summary.timeMin);
  }
  return null;
}

function formatDurationMinValue(timeMin: number): string {
  return String(Math.round(timeMin));
}

function buildThirdTile(
  summary: CardioSummary,
  levelSource: CardioType | null,
): { label: string; value: string; unit?: string } {
  const isCycling = levelSource === 'Cycling';

  if (summary.headlineAvgHeartrate && summary.headlineAvgHeartrate > 0) {
    return {
      label: 'Avg HR',
      value: String(Math.round(summary.headlineAvgHeartrate)),
      unit: 'bpm',
    };
  }

  if (isCycling && summary.headlinePowerWatts && summary.headlinePowerWatts > 0) {
    return {
      label: 'Avg power',
      value: String(Math.round(summary.headlinePowerWatts)),
      unit: 'W',
    };
  }

  if (summary.timeMin && summary.timeMin > 0) {
    return {
      label: isCycling ? 'Ride time' : 'Run time',
      value: formatDurationMinValue(summary.timeMin),
      unit: 'min',
    };
  }

  return { label: 'Source', value: isCycling ? 'Ride' : 'Run' };
}

function resolvePerformanceInput(
  summary: CardioSummary,
  ftpPerKg: number | null,
): { userValue: number; levelSource: NonNullable<CardioSummary['levelSource']> } | null {
  const levelSource = summary.levelSource ?? 'Running';

  if (levelSource === 'Cycling') {
    if (ftpPerKg && ftpPerKg > 0) {
      return { userValue: ftpPerKg, levelSource: 'Cycling' };
    }
    return null;
  }

  const pace = summary.paceMinPerKm;
  const distance = summary.distanceKm;
  if (pace && pace > 0 && distance && distance > 0) {
    return { userValue: pace, levelSource: 'Running' };
  }

  if (summary.timeMin && summary.timeMin > 0 && distance && distance > 0) {
    return { userValue: summary.timeMin / distance, levelSource: 'Running' };
  }

  return null;
}

export function buildCardioResultConfig({
  summary,
  profile,
  previousLevel,
  nextBtn = 'Next — Strength',
}: BuildCardioResultInput): LumenResultConfig {
  if (isBaselineCardioSummary(summary)) {
    return buildBaselineCardioResultConfig({ level: summary.level || 1, nextBtn });
  }

  const dob = new Date(`${profile.date_of_birth}T00:00:00`);
  const age = calculateAge(dob);
  const ageBracket = formatAgeBracketLabel(resolveAgeGroup(age));
  const genderCohort = formatGenderCohort(profile.gender);

  const level = Math.max(1, Math.min(10, summary.level || 1));
  const nextLevel = Math.min(10, level + 1);
  const ftpPerKg = resolveFtpPerKg(summary, profile.weight_kg);

  const performanceInput = resolvePerformanceInput(summary, ftpPerKg);
  let relativePerformance = 0;

  if (performanceInput) {
    relativePerformance = calculatePerformanceCardioNew({
      dob,
      gender: profile.gender,
      userValue: performanceInput.userValue,
      levelSource: performanceInput.levelSource,
      distanceKm: summary.distanceKm,
      weightKg: profile.weight_kg,
      durationMin: summary.timeMin,
      ftpPerKg,
    });
  }

  const percentile = cardioRelativePerformancePercent(relativePerformance);

  const { trend, trendDelta, levelNote } = resolveLevelTrend(
    level,
    previousLevel,
    'Your first cardio score.',
  );

  const bestPace =
    summary.levelSource === 'Running'
      ? summary.paceMinPerKm
      : summary.averagePace;
  const bestDistance = summary.distanceKm ?? summary.averageDistance;

  const cardioType = summary.levelSource ?? 'Running';
  const userPace =
    summary.paceMinPerKm ??
    (summary.distanceKm && summary.timeMin
      ? summary.timeMin / summary.distanceKm
      : 0);

  const levelUpMessage = getCardioLevelUpMessage({
    cardioType,
    gender: profile.gender,
    dob,
    currentLevel: level,
    userValue: cardioType === 'Running' ? userPace : (ftpPerKg ?? 0),
    weightKg: profile.weight_kg,
  });

  const deviceName = summary.deviceName?.trim() || 'Tracker';
  const garminBranded = isGarminDeviceName(deviceName);

  const isCycling = summary.levelSource === 'Cycling';

  const heroValue = formatPaceValue(bestPace ?? 0);
  const heroUnit = 'min/km';

  return {
    pillar: 'cardio',
    pillarLabel: 'Cardio',
    level,
    trend,
    trendDelta,
    levelNote,
    percentile,
    rpText: `Fitter than ${percentile}% of ${genderCohort} aged ${ageBracket}.`,
    resultHero: heroValue,
    resultUnit: heroUnit,
    resultLabel: '',
    tiles: [
      {
        label: isCycling ? 'Best ride' : 'Best run',
        value: formatDistanceValue(bestDistance ?? 0),
        unit: 'km',
      },
      {
        ...buildThirdTile(summary, summary.levelSource),
      },
    ],
    deviceAttribution:
      deviceName && deviceName !== 'Tracker'
        ? { deviceName, garminBranded }
        : undefined,
    nextLevel,
    nextActions: [],
    levelUpMessage,
    nextBtn,
  };
}
