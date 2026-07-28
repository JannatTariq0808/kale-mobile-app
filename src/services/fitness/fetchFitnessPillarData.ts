import type { KaleAssessment } from '../../types/assessment';
import { PLANK_STRENGTH_TYPE } from '../../types/strengthAssessment';
import { buildKnowledgeAssessmentMeta } from '../../config/knowledgeAssessment';
import type { PillarAssessmentCardData } from '../../components/fitness/PillarAssessmentCard';
import {
  calculateAge,
  calculateFtp,
  calculatePerformanceCardioNew,
  cardioLevelProgress,
  cardioRelativePerformancePercent,
  formatAgeBracketLabel,
  formatCardioPace,
  formatGenderCohort,
  getCardioLevelUpMessage,
  resolveAgeGroup,
} from '../../utils/cardioPerformance';
import { formatPlankDuration } from '../../utils/formatPlankDuration';
import { calculateKnowledgeLevel } from '../../utils/knowledgeLevel';
import {
  buildKnowledgeCardFields,
  formatAssessmentCardDate,
  formatAverageScoreLabel,
  performanceNoteFromAccuracy,
  strengthLevelProgress,
} from '../../utils/pillarAssessmentCard';
import {
  buildStrengthRpText,
  getStrengthPct,
  resolveStrengthAgeBracket,
  strengthRequiredHoldSec,
} from '../../utils/strengthPerformance';
import {
  fetchAssessmentsForUser,
  readPillarLevelForAssessment,
} from '../assessment/assessmentSession';
import { fetchCardioSummary, fetchCardioSummaryForUser, type CardioSummary } from '../cardio/fetchCardioSummary';
import { fetchGarminVo2max, shouldFetchGarminUserMetrics } from '../cardio/fetchGarminVo2max';
import { fetchCardioActivities, type CardioActivityLog } from '../cardio/fetchCardioActivities';
import { fetchDemographicsForAssess } from '../user/fetchHealthProfile';
import { fetchKnowledgeAssessmentsForUser } from '../knowledge/knowledgeAssessmentSession';
import { fetchStrengthAssessmentsForUser } from '../strength/strengthAssessmentSession';
import type { Vo2SourceRow } from '../../types/vo2max';
import {
  buildVo2Sources,
  resolveBestVo2Estimate,
  resolveVo2FormulaCopy,
  resolveVo2Summary,
} from '../../utils/buildVo2Sources';

export type PillarLevelPoint = {
  label: string;
  level: number;
};

export type FitnessStrengthData = {
  level: number;
  levelPct: number;
  trendDelta: number | null;
  showTrend: boolean;
  percentileTop: number | null;
  percentileCohort: string | null;
  levelTrend: { labels: string[]; levels: number[] } | null;
  assessmentCount: number;
  current: PillarAssessmentCardData | null;
  pastAssessments: PillarAssessmentCardData[];
  currentTest: {
    name: string;
    today: string;
    previousCycle: string | null;
    previousCycleLabel: string | null;
    improvement: string | null;
    showImprovement: boolean;
    relativePerformance: number;
    cohortGender: string;
    cohortAgeRange: string;
  } | null;
};

export type FitnessKnowledgeData = {
  level: number;
  levelPct: number;
  latestScore: number;
  maxScore: number;
  scorePct: number;
  trendLabel: string | null;
  showTrend: boolean;
  scoreHistory: { labels: string[]; scores: number[] } | null;
  levelTrend: { labels: string[]; levels: number[] } | null;
  assessmentCount: number;
  current: PillarAssessmentCardData | null;
  pastAssessments: PillarAssessmentCardData[];
};

export type FitnessCardioVo2Data = {
  level: number;
  bestEstimate: number | null;
  unit: string;
  ratingLabel: string | null;
  cohortLabel: string | null;
  summary: string;
  levelSource: string | null;
  deviceName: string | null;
  sources: Vo2SourceRow[];
  formula: string;
  formulaNote: string;
  sportLabel: string;
  current: PillarAssessmentCardData | null;
};

export type FitnessPillarLevels = {
  cardio: number;
  strength: number;
  knowledge: number;
};

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

function formatHoldImprovement(currentSec: number, previousSec: number): string | null {
  const diff = currentSec - previousSec;
  if (diff === 0) return null;
  const abs = Math.abs(diff);
  const formatted = abs >= 60 ? formatPlankDuration(abs) : `${abs}s`;
  return diff > 0 ? formatted : `-${formatted}`;
}

function labelForPillarDoc(
  assessments: KaleAssessment[],
  pillar: 'strength' | 'knowledge',
  pillarDocId: string,
  createdAt: Date,
  index: number,
): string {
  const parent = assessments.find((item) =>
    pillar === 'strength' ? item.strength_id === pillarDocId : item.knowledge_id === pillarDocId,
  );
  if (parent) return assessmentCycleLabel(parent);
  if (index === 0) return 'Onb';
  return `C${index + 1}`;
}

async function buildKnowledgeAssessmentCards(
  uid: string,
  assessments: KaleAssessment[],
): Promise<PillarAssessmentCardData[]> {
  const knowledgeDocs = (await fetchKnowledgeAssessmentsForUser(uid))
    .filter((item) => item.is_completed)
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

  const drafts: { correct: number; max: number; card: PillarAssessmentCardData }[] = [];

  knowledgeDocs.forEach((doc, index) => {
    const maxScore = Math.max(doc.responses.length, doc.correct_responses, 1);
    const correct = doc.correct_responses;
    const level = doc.level || calculateKnowledgeLevel(correct, maxScore);
    const meta = buildKnowledgeAssessmentMeta(doc.set, doc.created_at);
    const fields = buildKnowledgeCardFields(correct, maxScore, level);

    drafts.push({
      correct,
      max: maxScore,
      card: {
        dateLabel: formatAssessmentCardDate(doc.created_at),
        pillarLabel: 'Knowledge',
        level,
        topicLabel: meta.isOnboarding ? 'General longevity' : meta.title,
        scoreLabel: fields.scoreLabel,
        accuracyPct: fields.accuracyPct,
        trendDelta: null,
        performanceNote: fields.performanceNote,
        averageLabel: '',
        levelProgress: fields.levelProgress,
        levelUpMessage: fields.levelUpMessage,
      },
    });
  });

  if (drafts.length === 0) return [];

  const latestMax = drafts[drafts.length - 1].max;
  const totalCorrect = drafts.reduce((sum, item) => sum + item.correct, 0);
  const averageLabel = formatAverageScoreLabel(totalCorrect, drafts.length, latestMax);

  return drafts.map((item, index) => {
    const previous = index > 0 ? drafts[index - 1] : null;
    const trendDelta = previous != null ? item.correct - previous.correct : null;
    return {
      ...item.card,
      trendDelta,
      averageLabel,
    };
  });
}

function buildStrengthAssessmentCards(
  profile: Awaited<ReturnType<typeof fetchDemographicsForAssess>>,
  strengthDocs: Awaited<ReturnType<typeof fetchStrengthAssessmentsForUser>>,
): PillarAssessmentCardData[] {
  const drafts: { holdSec: number; card: PillarAssessmentCardData }[] = [];
  const dob = profile ? new Date(`${profile.date_of_birth}T00:00:00`) : null;

  for (const [index, doc] of strengthDocs.entries()) {
    const holdSec = doc.elapsed_time;
    const testType = doc.type || PLANK_STRENGTH_TYPE;
    const level =
      doc.level ??
      (dob && profile ? Math.max(1, Math.min(10, Math.floor(holdSec / 12))) : 1);

    const rpPct =
      dob && profile ? getStrengthPct(dob, profile.gender, holdSec, testType) : level * 10;
    const accuracyPct = Math.round(rpPct);

    const nextLevel = Math.min(10, level + 1);
    const nextHoldTargetSec =
      dob && profile
        ? strengthRequiredHoldSec(nextLevel, dob, profile.gender, testType)
        : 0;
    const levelUpMessage =
      nextHoldTargetSec > 0 && level < 10
        ? `Hold the plank past ${formatPlankDuration(nextHoldTargetSec)} to reach Level ${nextLevel}.`
        : '';

    const levelProgress =
      dob && profile
        ? strengthLevelProgress(holdSec, level, dob, profile.gender, testType)
        : Math.min(1, (level % 10) / 10);

    drafts.push({
      holdSec,
      card: {
        dateLabel: formatAssessmentCardDate(doc.created_at),
        pillarLabel: 'Strength',
        level,
        topicLabel: testType,
        scoreLabel: formatPlankDuration(holdSec),
        accuracyPct,
        trendDelta: null,
        performanceNote: performanceNoteFromAccuracy(accuracyPct),
        averageLabel: '',
        levelProgress,
        levelUpMessage,
      },
    });
  }

  if (drafts.length === 0) return [];

  const totalHold = drafts.reduce((sum, item) => sum + item.holdSec, 0);
  const averageLabel = `Avg: ${formatPlankDuration(Math.round(totalHold / drafts.length))}`;

  return drafts.map((item, index) => {
    const previous = index > 0 ? drafts[index - 1] : null;
    const trendDelta =
      previous != null ? Math.round(item.holdSec - previous.holdSec) : null;
    return {
      ...item.card,
      trendDelta: trendDelta === 0 ? null : trendDelta,
      averageLabel,
    };
  });
}

function buildStrengthLevelPoints(
  assessments: KaleAssessment[],
  strengthDocs: Awaited<ReturnType<typeof fetchStrengthAssessmentsForUser>>,
): PillarLevelPoint[] {
  return strengthDocs.map((doc, index) => ({
    label: labelForPillarDoc(assessments, 'strength', doc.id, doc.created_at, index),
    level: Math.max(1, Math.min(10, doc.level || 1)),
  }));
}

async function buildKnowledgeLevelPoints(
  uid: string,
  assessments: KaleAssessment[],
): Promise<PillarLevelPoint[]> {
  const knowledgeDocs = (await fetchKnowledgeAssessmentsForUser(uid))
    .filter((item) => item.is_completed)
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

  return knowledgeDocs.map((doc, index) => {
    const maxScore = Math.max(doc.responses.length, doc.correct_responses, 1);
    const level = doc.level || calculateKnowledgeLevel(doc.correct_responses, maxScore);
    return {
      label: labelForPillarDoc(assessments, 'knowledge', doc.id, doc.created_at, index),
      level: Math.max(1, Math.min(10, level)),
    };
  });
}

async function buildKnowledgeScorePoints(
  uid: string,
  assessments: KaleAssessment[],
): Promise<{ label: string; score: number; maxScore: number }[]> {
  const knowledgeDocs = (await fetchKnowledgeAssessmentsForUser(uid))
    .filter((item) => item.is_completed)
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

  return knowledgeDocs.map((doc, index) => {
    const maxScore = Math.max(doc.responses.length, doc.correct_responses, 1);
    return {
      label: labelForPillarDoc(assessments, 'knowledge', doc.id, doc.created_at, index),
      score: doc.correct_responses,
      maxScore,
    };
  });
}

function resolveCardioFtpPerKg(summary: CardioSummary, weightKg: number): number | null {
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

function buildCardioSummaryCard(
  summary: CardioSummary,
  profile: NonNullable<Awaited<ReturnType<typeof fetchDemographicsForAssess>>>,
): PillarAssessmentCardData | null {
  const vo2 = summary.vo2max;
  if (vo2 == null || !Number.isFinite(vo2) || vo2 <= 0) return null;

  const dob = new Date(`${profile.date_of_birth}T00:00:00`);
  const level = Math.max(1, Math.min(10, summary.level || 1));
  const levelSource = summary.levelSource ?? 'Running';
  const isCycling = levelSource === 'Cycling';
  const weightKg = profile.weight_kg;
  const ftpPerKg = weightKg ? resolveCardioFtpPerKg(summary, weightKg) : null;
  const pace =
    summary.paceMinPerKm ??
    (summary.distanceKm && summary.timeMin ? summary.timeMin / summary.distanceKm : null);

  let userValue = 0;
  if (isCycling) {
    if (!ftpPerKg || ftpPerKg <= 0 || !weightKg) return null;
    userValue = ftpPerKg;
  } else if (pace && pace > 0) {
    userValue = pace;
  } else {
    return null;
  }

  const rp = calculatePerformanceCardioNew({
    dob,
    gender: profile.gender,
    userValue,
    levelSource,
    distanceKm: summary.distanceKm,
    weightKg: weightKg ?? undefined,
    durationMin: summary.timeMin,
    ftpPerKg,
  });
  const accuracyPct = cardioRelativePerformancePercent(rp);
  const levelUpMessage = getCardioLevelUpMessage({
    cardioType: levelSource,
    gender: profile.gender,
    dob,
    currentLevel: level,
    userValue: isCycling ? userValue : pace!,
    weightKg: weightKg ?? undefined,
  });

  const averageLabel = isCycling
    ? ftpPerKg != null
      ? `FTP/kg: ${ftpPerKg.toFixed(2)}`
      : '—'
    : pace != null
      ? `Best: ${formatCardioPace(pace)}/km`
      : '—';

  return {
    pillarLabel: 'Cardio',
    level,
    topicLabel: isCycling ? 'Cycling' : 'Running',
    scoreLabel: `${Math.round(vo2 * 10) / 10} ml/kg/min`,
    accuracyPct,
    trendDelta: null,
    performanceNote: performanceNoteFromAccuracy(accuracyPct),
    averageLabel,
    levelProgress: cardioLevelProgress(rp, level),
    levelUpMessage,
  };
}

export async function fetchFitnessPillarLevels(
  uid: string,
  cardioSummary?: CardioSummary | null,
): Promise<FitnessPillarLevels> {
  const [summary, assessments] = await Promise.all([
    cardioSummary !== undefined
      ? Promise.resolve(cardioSummary)
      : fetchCardioSummaryForUser(uid),
    fetchAssessmentsForUser(uid).then((r) => r.assessments),
  ]);

  const cardioAssessment =
    assessments.find((item) => item.is_completed && item.cardio_id) ??
    assessments.find((item) => item.cardio_id);

  let cardio = summary?.level && summary.level > 0 ? summary.level : 1;
  let strength = 1;
  let knowledge = 1;

  if (cardioAssessment?.cardio_id) {
    const level = await readPillarLevelForAssessment('cardio', cardioAssessment.cardio_id, uid);
    if (level != null) cardio = level;
  }

  const latest = assessments[0];

  if (latest?.strength_id) {
    const level = await readPillarLevelForAssessment('strength', latest.strength_id, uid);
    if (level != null) strength = level;
  }

  if (latest?.knowledge_id) {
    const level = await readPillarLevelForAssessment('knowledge', latest.knowledge_id, uid);
    if (level != null) knowledge = level;
  }

  return { cardio, strength, knowledge };
}

export async function fetchFitnessStrengthData(uid: string): Promise<FitnessStrengthData> {
  const [{ assessments }, profile, strengthDocsRaw] = await Promise.all([
    fetchAssessmentsForUser(uid),
    fetchDemographicsForAssess(),
    fetchStrengthAssessmentsForUser(uid),
  ]);

  const strengthDocs = strengthDocsRaw
    .filter((item) => item.is_completed)
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

  const assessmentCards = buildStrengthAssessmentCards(profile, strengthDocs);
  const currentCard = assessmentCards.length > 0 ? assessmentCards[assessmentCards.length - 1] : null;
  const pastAssessments = assessmentCards.length > 1
    ? [...assessmentCards.slice(0, -1)].reverse()
    : [];

  const levelPoints = buildStrengthLevelPoints(assessments, strengthDocs);
  const assessmentCount = levelPoints.length;
  const latestPoint = levelPoints[levelPoints.length - 1];
  const previousPoint = levelPoints.length >= 2 ? levelPoints[levelPoints.length - 2] : null;

  const level = latestPoint?.level ?? currentCard?.level ?? 1;
  const trendDelta =
    previousPoint != null ? level - previousPoint.level : null;

  let currentTest: FitnessStrengthData['currentTest'] = null;

  const latestStrength = strengthDocs[strengthDocs.length - 1] ?? null;
  const prevStrength = strengthDocs.length >= 2 ? strengthDocs[strengthDocs.length - 2] : null;

  if (latestStrength) {
    const parent = assessments.find((item) => item.strength_id === latestStrength.id);
    const cycleLabel = parent
      ? assessmentCycleLabel(parent)
      : labelForPillarDoc(
          assessments,
          'strength',
          latestStrength.id,
          latestStrength.created_at,
          strengthDocs.length - 1,
        );
    const testType = latestStrength.type || PLANK_STRENGTH_TYPE;
    const todaySec = latestStrength.elapsed_time;

    let previousCycle: string | null = null;
    let previousCycleLabel: string | null = null;
    let improvement: string | null = null;

    if (prevStrength) {
      previousCycle = formatPlankDuration(prevStrength.elapsed_time);
      const prevParent = assessments.find((item) => item.strength_id === prevStrength.id);
      previousCycleLabel = prevParent
        ? assessmentCycleLabel(prevParent)
        : labelForPillarDoc(
            assessments,
            'strength',
            prevStrength.id,
            prevStrength.created_at,
            strengthDocs.length - 2,
          );
      improvement = formatHoldImprovement(todaySec, prevStrength.elapsed_time);
    }

    const dob = profile ? new Date(`${profile.date_of_birth}T00:00:00`) : null;
    const rpPct =
      dob && profile
        ? getStrengthPct(dob, profile.gender, todaySec, testType)
        : level * 10;
    const { percentile } =
      dob && profile
        ? buildStrengthRpText(dob, profile.gender, todaySec, testType)
        : { percentile: Math.min(99, level * 10) };

    const age = dob ? calculateAge(dob) : null;
    const bracket = age != null ? resolveStrengthAgeBracket(age) : null;
    const cohortGender = profile ? formatGenderCohort(profile.gender) : 'members';
    const cohortAgeRange = bracket ? formatAgeBracketLabel(bracket) : 'your age group';

    currentTest = {
      name: `${testType} · ${cycleLabel.toLowerCase()}`,
      today: formatPlankDuration(todaySec),
      previousCycle,
      previousCycleLabel,
      improvement,
      showImprovement: improvement != null,
      relativePerformance: rpPct,
      cohortGender,
      cohortAgeRange,
    };

    return {
      level,
      levelPct: level * 10,
      trendDelta,
      showTrend: trendDelta != null && trendDelta !== 0,
      percentileTop: percentile > 0 ? 100 - percentile : null,
      percentileCohort: profile ? `${cohortGender} aged ${cohortAgeRange}` : null,
      levelTrend:
        levelPoints.length >= 2
          ? {
              labels: levelPoints.map((p) => p.label),
              levels: levelPoints.map((p) => p.level),
            }
          : null,
      assessmentCount,
      current: currentCard ? { ...currentCard, dateLabel: undefined } : null,
      pastAssessments,
      currentTest,
    };
  }

  return {
    level,
    levelPct: level * 10,
    trendDelta,
    showTrend: trendDelta != null && trendDelta !== 0,
    percentileTop: null,
    percentileCohort: null,
    levelTrend:
      levelPoints.length >= 2
        ? {
            labels: levelPoints.map((p) => p.label),
            levels: levelPoints.map((p) => p.level),
          }
        : null,
    assessmentCount,
    current: currentCard ? { ...currentCard, dateLabel: undefined } : null,
    pastAssessments,
    currentTest,
  };
}

export async function fetchFitnessKnowledgeData(uid: string): Promise<FitnessKnowledgeData> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  const assessmentCards = await buildKnowledgeAssessmentCards(uid, assessments);
  const currentCard = assessmentCards.length > 0 ? assessmentCards[assessmentCards.length - 1] : null;
  const pastAssessments = assessmentCards.length > 1
    ? [...assessmentCards.slice(0, -1)].reverse()
    : [];

  const scorePoints = await buildKnowledgeScorePoints(uid, assessments);
  const levelPoints = await buildKnowledgeLevelPoints(uid, assessments);
  const assessmentCount = Math.max(scorePoints.length, levelPoints.length);
  const latest = scorePoints[scorePoints.length - 1];
  const previous = scorePoints.length >= 2 ? scorePoints[scorePoints.length - 2] : null;

  const latestLevelPoint = levelPoints[levelPoints.length - 1];
  const level = latestLevelPoint?.level ?? currentCard?.level ?? 1;

  const latestScore = latest?.score ?? 0;
  const maxScore = latest?.maxScore ?? 1;
  const scorePct = maxScore > 0 ? Math.round((latestScore / maxScore) * 100) : 0;

  let trendLabel: string | null = null;
  let showTrend = false;
  if (previous && latest) {
    const delta = latest.score - previous.score;
    if (delta !== 0) {
      showTrend = true;
      const prevLabel = previous.label;
      trendLabel =
        delta > 0
          ? `+${delta} vs. ${prevLabel}`
          : `${delta} vs. ${prevLabel}`;
    }
  }

  return {
    level,
    levelPct: level * 10,
    latestScore,
    maxScore,
    scorePct,
    trendLabel,
    showTrend,
    scoreHistory:
      scorePoints.length >= 2
        ? {
            labels: scorePoints.map((p) => p.label),
            scores: scorePoints.map((p) => p.score),
          }
        : null,
    levelTrend:
      levelPoints.length >= 2
        ? {
            labels: levelPoints.map((p) => p.label),
            levels: levelPoints.map((p) => p.level),
          }
        : null,
    assessmentCount,
    current: currentCard ? { ...currentCard, dateLabel: undefined } : null,
    pastAssessments,
  };
}

export function buildFitnessCardioVo2Data(
  summary: CardioSummary | null,
  profile: Awaited<ReturnType<typeof fetchDemographicsForAssess>>,
  garminVo2 = null as Awaited<ReturnType<typeof fetchGarminVo2max>>,
): FitnessCardioVo2Data {
  const level = summary?.level && summary.level > 0 ? summary.level : 1;
  const sources = buildVo2Sources(summary, garminVo2);
  const bestEstimate =
    resolveBestVo2Estimate(sources) ??
    (summary?.garminVo2max != null && summary.garminVo2max > 0
      ? Math.round(summary.garminVo2max * 10) / 10
      : summary?.vo2maxSubmaximal != null && summary.vo2maxSubmaximal > 0
        ? Math.round(summary.vo2maxSubmaximal * 10) / 10
        : summary?.vo2max != null
          ? Math.round(summary.vo2max * 10) / 10
          : null);
  const current =
    summary && profile ? buildCardioSummaryCard(summary, profile) : null;

  let cohortLabel: string | null = null;
  if (profile?.date_of_birth && profile.gender) {
    const dob = new Date(`${profile.date_of_birth}T00:00:00`);
    const bracket = formatAgeBracketLabel(resolveAgeGroup(calculateAge(dob)));
    cohortLabel = `${formatGenderCohort(profile.gender)} aged ${bracket}`;
  }

  const sportLabel = summary?.levelSource === 'Cycling' ? 'CYCLING' : 'RUNNING';
  const formulaCopy = resolveVo2FormulaCopy(summary, sources);

  return {
    level,
    bestEstimate,
    unit: 'ml/kg/min',
    ratingLabel: level >= 8 ? 'Excellent' : level >= 6 ? 'Good' : level >= 4 ? 'Fair' : null,
    cohortLabel,
    summary: resolveVo2Summary(sources),
    levelSource: summary?.levelSource ?? null,
    deviceName: summary?.deviceName ?? null,
    sources,
    formula: formulaCopy.formula,
    formulaNote: formulaCopy.formulaNote,
    current,
    sportLabel,
  };
}

export type FitnessCardioFirstPaint = {
  activityLog: CardioActivityLog;
  cardio: FitnessCardioVo2Data;
  cardioLevel: number;
  summary: CardioSummary | null;
};

/** One summary read, then parallel activity log + VO₂ (for fast cardio tab paint). */
export async function fetchFitnessCardioFirstPaint(uid: string): Promise<FitnessCardioFirstPaint> {
  const summary = await fetchCardioSummaryForUser(uid);
  const [activityLog, profile, garminVo2] = await Promise.all([
    fetchCardioActivities(uid, {
      platform: summary?.platform ?? null,
      // Runs/rides subcollections only exist on live `cardios/{uid}` (Firestore rules).
      cardioDocId: uid,
    }),
    fetchDemographicsForAssess(),
    shouldFetchGarminUserMetrics(summary) ? fetchGarminVo2max(uid) : Promise.resolve(null),
  ]);
  const cardio = buildFitnessCardioVo2Data(summary, profile, garminVo2);
  const cardioLevel = summary?.level && summary.level > 0 ? summary.level : 1;

  return { activityLog, cardio, cardioLevel, summary };
}

export async function fetchFitnessCardioVo2Data(uid: string): Promise<FitnessCardioVo2Data> {
  const [summary, profile] = await Promise.all([
    fetchCardioSummaryForUser(uid),
    fetchDemographicsForAssess(),
  ]);
  const garminVo2 = shouldFetchGarminUserMetrics(summary)
    ? await fetchGarminVo2max(uid)
    : null;
  return buildFitnessCardioVo2Data(summary, profile, garminVo2);
}
