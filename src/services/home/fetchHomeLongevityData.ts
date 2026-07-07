import { getLifeSpan } from '../../utils/getLifeSpan';
import { hasCompletedAssessmentThisQuarter } from '../../utils/assessmentCycle';
import { fetchAssessmentsForUser } from '../assessment/assessmentSession';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';
import { fetchFitnessPillarLevels, type FitnessPillarLevels } from '../fitness/fetchFitnessPillarData';
import { fetchAthleteLevel } from '../user/athleteLevel';
import {
  fetchQuoteRecord,
  readCoverType,
  readPolicyTermYears,
} from '../quotes/fetchQuoteRecord';
import { doc, getDoc } from 'firebase/firestore';
import type { KaleAssessment } from '../../types/assessment';

export type HomeChartSeries = {
  count: number;
  labels: string[];
  levels: number[];
  lifespan: number[];
  healthspan: number[];
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
  policyTermYears: number | null;
  policyCoverType: string | null;
  pillarLevels: FitnessPillarLevels;
  chartSeries: HomeChartSeries | null;
  completedAssessmentThisQuarter: boolean;
};

function parseFirstName(raw: string | null | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return 'Member';
  return trimmed.split(/\s+/)[0] ?? 'Member';
}

async function fetchUserFirstName(uid: string): Promise<string> {
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

function assessmentCycleLabel(assessment: KaleAssessment): string {
  if (assessment.isOnboarding) return 'Onb';
  const label = assessment.quarter?.label;
  if (typeof label === 'string' && label.trim()) return label.trim();
  if (typeof label === 'number' && label > 0) return `Q${label}`;
  const type = assessment.quarter?.type;
  if (typeof type === 'string' && type.trim()) return type.trim();
  return 'Cycle';
}

function sortAssessmentsChronological(assessments: KaleAssessment[]): KaleAssessment[] {
  return [...assessments].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
}

function buildChartSeries(completed: KaleAssessment[]): HomeChartSeries | null {
  if (completed.length < 2) return null;

  const labels = completed.map(assessmentCycleLabel);
  const levels = completed.map((item) => item.level ?? 1);
  const lifespan = levels.map((level) => getLifeSpan(level).lifeSpan);
  const healthspan = levels.map((level) => getLifeSpan(level).healthSpan);

  return {
    count: completed.length,
    labels,
    levels,
    lifespan,
    healthspan,
  };
}

function readRunningYearsFromCardio(data: Record<string, unknown>): number | null {
  const raw = data.running_years ?? data.runningYears ?? data.running_years_ahead;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.round(raw);
  }
  if (typeof raw === 'string' && raw.trim()) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }
  return null;
}

async function fetchRunningYearsAhead(uid: string): Promise<number | null> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
    if (snap.exists()) {
      return readRunningYearsFromCardio(snap.data() as Record<string, unknown>);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[home] fetchRunningYearsAhead failed', error);
    }
  }
  return null;
}

/** Fallback when cardios doc has no running_years field yet. */
function estimateRunningYearsAhead(level: number, healthSpanYears: number): number {
  if (healthSpanYears > 0) {
    return Math.max(1, Math.round(healthSpanYears * 9 + 5));
  }
  return Math.max(1, Math.round(level * 4 + 7));
}

export async function fetchHomeLongevityData(uid: string): Promise<HomeLongevityData> {
  const [{ assessments }, firstName, pillarLevels, runningYearsAhead, quoteRecord] =
    await Promise.all([
      fetchAssessmentsForUser(uid),
      fetchUserFirstName(uid),
      fetchFitnessPillarLevels(uid),
      fetchRunningYearsAhead(uid),
      fetchQuoteRecord(uid),
    ]);

  const completed = sortAssessmentsChronological(
    assessments.filter((item) => item.is_completed && item.level != null),
  );

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

  const resolvedRunningYearsAhead =
    policyTermYears ??
    runningYearsAhead ??
    estimateRunningYearsAhead(level, healthSpan);

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
    policyTermYears,
    policyCoverType,
    pillarLevels,
    chartSeries: buildChartSeries(completed),
    completedAssessmentThisQuarter: hasCompletedAssessmentThisQuarter(completed, new Date()),
  };
}
