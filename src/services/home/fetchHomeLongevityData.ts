import { getLifeSpan } from '../../utils/getLifeSpan';
import { athleteLevelCalculation } from '../../utils/athleteLevel';
import { hasCompletedAssessmentThisQuarter } from '../../utils/assessmentCycle';
import {
  assessmentTrendLabel,
  nextCycleLabel,
  projectHealthYearsValue,
  projectLevelValue,
} from '../../utils/longevityTrendChart';
import {
  fetchAssessmentsForUser,
  readPillarLevelForAssessment,
} from '../assessment/assessmentSession';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';
import { fetchFitnessPillarLevels, type FitnessPillarLevels } from '../fitness/fetchFitnessPillarData';
import { fetchAthleteLevel } from '../user/athleteLevel';
import { fetchDemographicsForAssess } from '../user/fetchHealthProfile';
import { ageFromDob, fitnessAge as computeFitnessAge, toSex } from '../fitness/fitnessAge';
import { fetchRunningYearsProjection } from '../runningYears/fetchRunningYearsProjection';
import { readRunningYearsGoal } from '../runningYears/runningYearsStorage';
import {
  fetchQuoteRecord,
  readCoverType,
  readPolicyTermYears,
} from '../quotes/fetchQuoteRecord';
import { doc, getDoc } from 'firebase/firestore';
import type { KaleAssessment } from '../../types/assessment';

export type HomeChartSeries = {
  count: number;
  projected: boolean;
  /** Index where dashed projection begins (Now → target). */
  projectedFromIndex: number;
  nextCycleLabel: string;
  labels: string[];
  healthLabels: string[];
  levels: number[];
  lifespan: number[];
  healthspan: number[];
};

export type FitnessAgeOutlook = {
  /** The member's real age today. */
  currentRealAge: number;
  /** Their Fitness Age today (can be lower than their real age). */
  currentFitnessAge: number;
  /** currentRealAge − currentFitnessAge; positive means younger than their years. */
  yearsYounger: number;
  /** Actual ages along the x-axis (today → +5y). */
  ages: number[];
  /** Fitness Age at each of those ages, holding the current level. */
  fitnessAges: number[];
  /** Indicative monthly premium at this Fitness Age (placeholder until price API). */
  monthlyPriceGbp: number;
  /** Indicative monthly premium at their actual age — the "older body" price. */
  actualAgePriceGbp: number;
};

export type HomeLongevityData = {
  firstName: string;
  level: number;
  levelPct: number;
  trendDelta: number | null;
  showTrend: boolean;
  assessmentCount: number;
  lifespanYears: number;
  healthspanYears: number;
  runningYearsAhead: number;
  /** `projection` = computed from age + VO₂/HR on device; `estimate` = longevity level fallback. */
  runningYearsSource: 'projection' | 'estimate';
  /** True when Garmin/Strava/resting HR can power a real projection. */
  runningYearsHasDevice: boolean;
  /** True after the user has saved a Running Years goal. */
  runningYearsGoalSet: boolean;
  /** Saved goal preset id — drives running vs cycling copy on the home promo. */
  runningYearsGoalId: string | null;
  policyTermYears: number | null;
  policyCoverType: string | null;
  pillarLevels: FitnessPillarLevels;
  chartSeries: HomeChartSeries | null;
  fitnessAgeOutlook: FitnessAgeOutlook | null;
  completedAssessmentThisQuarter: boolean;
};

/** Project Fitness Age vs actual age over the next few years at the current level. */
const FITNESS_OUTLOOK_YEARS = 5;

/**
 * Indicative monthly premiums shown on the home Fitness Age card — the lower
 * "fitter body" price vs the higher actual-age price. Placeholders until the
 * Best reassessment (MTA) price API is wired up; swap for live values then.
 */
const PLACEHOLDER_FITNESS_PRICE_GBP = 25;
const PLACEHOLDER_ACTUAL_AGE_PRICE_GBP = 30;

function buildFitnessAgeOutlook(
  level: number,
  demographics: Awaited<ReturnType<typeof fetchDemographicsForAssess>>,
): FitnessAgeOutlook | null {
  const realAge = demographics ? ageFromDob(demographics.date_of_birth) : null;
  if (realAge == null) return null;

  const sex = toSex(demographics?.gender);
  const ages: number[] = [];
  const fitnessAges: number[] = [];
  for (let i = 0; i <= FITNESS_OUTLOOK_YEARS; i += 1) {
    const age = realAge + i;
    ages.push(age);
    fitnessAges.push(computeFitnessAge(level, age, sex));
  }

  return {
    currentRealAge: realAge,
    currentFitnessAge: fitnessAges[0],
    yearsYounger: realAge - fitnessAges[0],
    ages,
    fitnessAges,
    monthlyPriceGbp: PLACEHOLDER_FITNESS_PRICE_GBP,
    actualAgePriceGbp: PLACEHOLDER_ACTUAL_AGE_PRICE_GBP,
  };
}

function parseFirstName(raw: string | null | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return 'Member';
  return trimmed.split(/\s+/)[0] ?? 'Member';
}

export async function fetchUserFirstName(uid: string): Promise<string> {
  const authName = getFirebaseAuth().currentUser?.displayName;
  if (authName?.trim()) return parseFirstName(authName);

  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      const fromDoc =
        typeof data.displayName === 'string'
          ? data.displayName
          : typeof data.name === 'string'
            ? data.name
            : null;
      if (fromDoc?.trim()) return parseFirstName(fromDoc);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[home] fetchUserFirstName failed', error);
    }
  }

  return 'Member';
}

function sortAssessmentsChronological(assessments: KaleAssessment[]): KaleAssessment[] {
  return [...assessments].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
}

/**
 * Chart points = assessments that finished all three pillars.
 * If finalize failed (is_completed/level missing), compute level from pillar docs
 * so home graphs unlock after the 2nd cycle.
 */
async function resolveChartAssessments(
  uid: string,
  assessments: KaleAssessment[],
): Promise<KaleAssessment[]> {
  const sorted = sortAssessmentsChronological(assessments);
  const resolved: KaleAssessment[] = [];

  for (const item of sorted) {
    if (item.is_completed && item.level != null) {
      resolved.push(item);
      continue;
    }

    if (!item.cardio_id || !item.strength_id || !item.knowledge_id) {
      continue;
    }

    const [cardio, strength, knowledge] = await Promise.all([
      readPillarLevelForAssessment('cardio', item.cardio_id, uid),
      readPillarLevelForAssessment('strength', item.strength_id, uid),
      readPillarLevelForAssessment('knowledge', item.knowledge_id, uid),
    ]);

    if (cardio == null || strength == null || knowledge == null) {
      continue;
    }

    const level =
      item.level ?? athleteLevelCalculation(cardio, strength, knowledge);
    resolved.push({
      ...item,
      level,
      is_completed: true,
    });
  }

  return resolved;
}

function buildProjectedChartSeries(assessment: KaleAssessment): HomeChartSeries {
  const level = assessment.level ?? 1;
  const { lifeSpan, healthSpan } = getLifeSpan(level);
  const projectedLevel = projectLevelValue(level);
  const projectedLife = projectHealthYearsValue(lifeSpan);
  const projectedHealth = projectHealthYearsValue(healthSpan);
  const targetCycle = nextCycleLabel(0);

  return {
    count: 1,
    projected: true,
    projectedFromIndex: 1,
    nextCycleLabel: targetCycle,
    labels: ['Onboarding', 'Now', targetCycle],
    healthLabels: ['Onboarding', 'Now', 'Projected →'],
    levels: [level, level, projectedLevel],
    lifespan: [lifeSpan, lifeSpan, projectedLife],
    healthspan: [healthSpan, healthSpan, projectedHealth],
  };
}

function buildChartSeries(completed: KaleAssessment[]): HomeChartSeries | null {
  if (completed.length === 0) return null;
  if (completed.length === 1) return buildProjectedChartSeries(completed[0]);

  let quarterlyIndex = 0;
  const labels = completed.map((item) => {
    if (item.isOnboarding) return assessmentTrendLabel(item, 0);
    quarterlyIndex += 1;
    return assessmentTrendLabel(item, quarterlyIndex);
  });

  const levels = completed.map((item) => item.level ?? 1);
  const lifespan = levels.map((level) => getLifeSpan(level).lifeSpan);
  const healthspan = levels.map((level) => getLifeSpan(level).healthSpan);

  return {
    count: completed.length,
    projected: false,
    projectedFromIndex: -1,
    nextCycleLabel: nextCycleLabel(quarterlyIndex),
    labels,
    healthLabels: labels,
    levels,
    lifespan,
    healthspan,
  };
}

function resolveRunningYearsForHome(
  projection: Awaited<ReturnType<typeof fetchRunningYearsProjection>> | null,
  level: number,
  healthSpanYears: number,
): { value: number; source: 'projection' | 'estimate' } {
  if (projection?.hasDevice) {
    if (
      projection.runningYearsLow != null &&
      projection.runningYearsHigh != null
    ) {
      return {
        value: Math.round((projection.runningYearsLow + projection.runningYearsHigh) / 2),
        source: 'projection',
      };
    }
    if (projection.runningYears > 0) {
      return { value: projection.runningYears, source: 'projection' };
    }
  }

  return {
    value: Math.max(1, estimateRunningYearsAhead(level, healthSpanYears)),
    source: 'estimate',
  };
}

/** Fallback when Running Years projection is unavailable. */
function estimateRunningYearsAhead(level: number, healthSpanYears: number): number {
  if (healthSpanYears > 0) {
    return Math.max(1, Math.round(healthSpanYears * 9 + 5));
  }
  return Math.max(1, Math.round(level * 4 + 7));
}

export async function fetchHomeLongevityData(uid: string): Promise<HomeLongevityData> {
  const [
    { assessments },
    firstName,
    pillarLevels,
    runningYearsProjection,
    savedGoal,
    quoteRecord,
    demographics,
  ] = await Promise.all([
    fetchAssessmentsForUser(uid),
    fetchUserFirstName(uid),
    fetchFitnessPillarLevels(uid),
    fetchRunningYearsProjection(uid).catch((error) => {
      if (__DEV__) {
        console.warn('[home] fetchRunningYearsProjection failed', error);
      }
      return null;
    }),
    readRunningYearsGoal(uid),
    fetchQuoteRecord(uid),
    fetchDemographicsForAssess().catch((error) => {
      if (__DEV__) {
        console.warn('[home] fetchDemographicsForAssess failed', error);
      }
      return null;
    }),
  ]);

  const completed = await resolveChartAssessments(uid, assessments);

  const assessmentCount = completed.length;
  const latest = completed[completed.length - 1];
  const previous = completed.length >= 2 ? completed[completed.length - 2] : null;

  let level = latest?.level ?? null;
  if (level == null) {
    level = await fetchAthleteLevel(uid);
  }

  const trendDelta =
    previous?.level != null && level != null ? level - previous.level : null;
  const showTrend = trendDelta != null && trendDelta !== 0;

  const { lifeSpan, healthSpan } = getLifeSpan(level);

  const quoteAnswers = quoteRecord?.answers ?? {};
  const policyTermYears = quoteRecord ? readPolicyTermYears(quoteAnswers) : null;
  const policyCoverType = quoteRecord ? readCoverType(quoteAnswers) : null;

  const { value: resolvedRunningYearsAhead, source: runningYearsSource } =
    resolveRunningYearsForHome(runningYearsProjection, level, healthSpan);

  return {
    firstName,
    level,
    levelPct: level * 10,
    trendDelta,
    showTrend,
    assessmentCount,
    lifespanYears: lifeSpan,
    healthspanYears: healthSpan,
    runningYearsAhead: resolvedRunningYearsAhead,
    runningYearsSource,
    runningYearsHasDevice: runningYearsProjection?.hasDevice ?? false,
    runningYearsGoalSet: savedGoal != null,
    runningYearsGoalId: savedGoal?.goalId ?? null,
    policyTermYears,
    policyCoverType,
    pillarLevels,
    chartSeries: buildChartSeries(completed),
    fitnessAgeOutlook: buildFitnessAgeOutlook(level, demographics),
    completedAssessmentThisQuarter: hasCompletedAssessmentThisQuarter(assessments, new Date()),
  };
}
