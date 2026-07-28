import { calculateAge } from '../../utils/cardioPerformance';
import {
  goalLabelForId,
  RUNNING_YEARS_GOAL_AGE_DEFAULT,
} from '../../config/runningYearsGoals';
import type { RunningYearsGoal, RunningYearsProjection } from '../../types/runningYears';
import {
  buildTrajectory,
  computeGapYears,
  computeOnTrack,
  computeRunningYears,
  estimatedBand,
  estimateVo2Percentile,
} from '../../utils/runningYearsProjection';
import { fetchCardioSummary } from '../cardio/fetchCardioSummary';
import { fetchDemographicsForAssess } from '../user/fetchHealthProfile';
import {
  readLastRunningYearsSnapshot,
  readManualRestingHr,
  readRunningYearsGoal,
  saveRunningYearsSnapshot,
} from './runningYearsStorage';

function currentQuarterKey(now = new Date()): string {
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `${now.getFullYear()}-Q${quarter}`;
}

function resolveAge(profile: Awaited<ReturnType<typeof fetchDemographicsForAssess>>): number {
  if (profile?.date_of_birth) {
    const dob = new Date(`${profile.date_of_birth}T00:00:00`);
    return calculateAge(dob);
  }
  return 45;
}

function resolveRestingHr(
  summary: Awaited<ReturnType<typeof fetchCardioSummary>>,
  manualHr: number | null,
): number | null {
  if (manualHr != null && manualHr > 0) return manualHr;
  if (summary?.restingHr != null && summary.restingHr > 0) return summary.restingHr;
  return null;
}

function resolveVo2(
  summary: Awaited<ReturnType<typeof fetchCardioSummary>>,
  restingHr: number | null,
  age: number,
): number | null {
  if (summary?.vo2max != null && summary.vo2max > 0) return summary.vo2max;
  if (summary?.garminVo2max != null && summary.garminVo2max > 0) return summary.garminVo2max;
  if (restingHr != null && restingHr > 0) {
    const hrMax = 220 - age;
    return Math.round(((15 * hrMax) / restingHr) * 10) / 10;
  }
  return null;
}

function isDeclining(
  uid: string,
  runningYears: number,
  quarterKey: string,
  snapshot: Awaited<ReturnType<typeof readLastRunningYearsSnapshot>>,
): boolean {
  if (!snapshot || snapshot.quarterKey === quarterKey) return false;
  const delta = runningYears - snapshot.runningYears;
  return delta <= -3;
}

export async function fetchRunningYearsProjection(
  uid: string,
  goalOverride?: RunningYearsGoal | null,
): Promise<RunningYearsProjection> {
  const [summary, profile, storedGoal, manualRestingHr, snapshot] = await Promise.all([
    fetchCardioSummary(uid),
    fetchDemographicsForAssess(),
    readRunningYearsGoal(uid),
    readManualRestingHr(uid),
    readLastRunningYearsSnapshot(uid),
  ]);

  const goal = goalOverride ?? storedGoal;
  const goalAge = goal?.targetAge ?? RUNNING_YEARS_GOAL_AGE_DEFAULT;
  const goalLabel = goal ? goalLabelForId(goal.goalId) : 'Run a 10k with my grandkids';
  const age = resolveAge(profile);
  const platform = summary?.platform ?? null;
  const restingHr = resolveRestingHr(summary, manualRestingHr);
  const hasDevice = platform != null || restingHr != null;

  if (!hasDevice) {
    const emptyTrajectory = buildTrajectory(40, age, goalAge);
    return {
      screenState: 'empty',
      runningYears: 0,
      runningYearsLow: null,
      runningYearsHigh: null,
      gapYears: 0,
      vo2max: null,
      percentile: null,
      age,
      goalAge,
      goalId: goal?.goalId ?? null,
      goalLabel,
      onTrack: 'stretch',
      yearsToSpare: 0,
      confidence: 'estimated',
      platform: null,
      hasDevice: false,
      trajectory: emptyTrajectory,
      activeUntilAge: null,
    };
  }

  const vo2 = resolveVo2(summary, restingHr, age) ?? 42;
  const isGarminRich =
    platform === 'garmin' &&
    ((summary?.garminVo2max != null && summary.garminVo2max > 0) ||
      (summary?.vo2max != null && summary.vo2max > 0));
  const confidence: 'high' | 'estimated' = isGarminRich ? 'high' : 'estimated';

  const quarterKey = currentQuarterKey();
  const provisional = computeRunningYears(vo2, age);
  const declining = isDeclining(uid, provisional.runningYears, quarterKey, snapshot);

  if (!snapshot || snapshot.quarterKey !== quarterKey) {
    void saveRunningYearsSnapshot(uid, provisional.runningYears, quarterKey);
  }

  const { runningYears, activeUntilAge } = computeRunningYears(vo2, age, declining);
  const gapYears = computeGapYears(vo2, age, declining);
  const { onTrack, yearsToSpare } = computeOnTrack(goalAge, vo2, age, activeUntilAge, declining);
  const band = estimatedBand(runningYears, confidence);
  const trajectory = buildTrajectory(vo2, age, goalAge, declining);

  let screenState: RunningYearsProjection['screenState'] = 'main';
  if (confidence === 'estimated') screenState = 'estimated';
  if (declining) screenState = 'declining';

  return {
    screenState,
    runningYears,
    runningYearsLow: confidence === 'estimated' ? band.low : null,
    runningYearsHigh: confidence === 'estimated' ? band.high : null,
    gapYears,
    vo2max: vo2,
    percentile: estimateVo2Percentile(vo2, age),
    age,
    goalAge,
    goalId: goal?.goalId ?? null,
    goalLabel,
    onTrack,
    yearsToSpare,
    confidence,
    platform,
    hasDevice: true,
    trajectory,
    activeUntilAge,
  };
}
