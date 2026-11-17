import { PLANK_STRENGTH_TYPE } from '../../types/strengthAssessment';
import {
  calculateAge,
  formatCardioPace,
  getCyclingVo2BracketsForUser,
  getRunLevelsForUser,
} from '../../utils/cardioPerformance';
import { formatPlankDuration } from '../../utils/formatPlankDuration';
import { calculateKnowledgeLevel, correctAnswersForLevel } from '../../utils/knowledgeLevel';
import { strengthRequiredHoldSec } from '../../utils/strengthPerformance';
import { fetchCardioSummaryForUser, type CardioSummary } from '../cardio/fetchCardioSummary';
import { fetchKnowledgeAssessmentsForUser } from '../knowledge/knowledgeAssessmentSession';
import { fetchStrengthAssessmentsForUser } from '../strength/strengthAssessmentSession';
import { fetchDemographicsForAssess } from '../user/fetchHealthProfile';

/** One progress row on the Goals card: where they are now and what the next level needs. */
export type GoalTarget = {
  /** e.g. "5k in 24:40" or "plank 2:04" */
  now: string;
  /** Next level's threshold, e.g. "23:37"; null at level 10 */
  target: string | null;
  /**
   * 0–1 bar fill. Strength and knowledge: score ÷ next-level target.
   * Cardio: progress through the current level band (a time ratio would always read ~90%+).
   */
  progress: number;
  level: number;
  /** What to do for the next level, worked out from the result and the target; null at L10. */
  step: GoalStep | null;
};

export type GoalStep = {
  /** e.g. "Run 5k in 23:12 for cardio L6" */
  title: string;
  /** e.g. "Your last run works out to a 5k in 24:51. That's 1:39 faster: 4:38/km instead of 4:58/km." */
  note: string;
};

export type GoalTargets = {
  cardio: GoalTarget | null;
  strength: GoalTarget | null;
  knowledge: GoalTarget | null;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** Minutes → "M:SS" (reuses the cardio pace formatter, which works on any minute value). */
const formatMinutes = (minutes: number) => formatCardioPace(minutes);

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/** Same 5k projection as calculatePerformanceCardioNew (Riegel, exponent 1.07). */
function projectedFiveKMinutes(summary: CardioSummary): number | null {
  const pace = summary.paceMinPerKm ?? summary.averagePace;
  const distance = summary.distanceKm ?? summary.averageDistance;
  if (!pace || pace <= 0) return null;
  if (!distance || distance <= 0) return pace * 5;
  return pace * distance * Math.pow(5 / distance, 1.07);
}

/**
 * Cardio row from the run or cycling level tables (cardioPerformance.ts) —
 * the same thresholds getCardioLevelUpMessage uses for "Hit X to reach Level N".
 */
function cardioTarget(
  summary: CardioSummary,
  dob: Date,
  gender: string,
  weightKg: number | null,
): GoalTarget | null {
  const level = Math.max(1, Math.min(10, Math.round(summary.level || 1)));
  const age = calculateAge(dob);

  if (summary.levelSource === 'Cycling') {
    if (!weightKg) return null;
    const ftpPerKg =
      summary.ftpPerKg ??
      (summary.headlinePowerWatts ? summary.headlinePowerWatts / weightKg : null);
    if (!ftpPerKg) return null;
    const levels = getCyclingVo2BracketsForUser(gender, age);
    const nowWatts = Math.round(ftpPerKg * weightKg);
    if (level >= 10) {
      return { now: `FTP ${nowWatts} W`, target: null, progress: 1, level, step: null };
    }
    const currentLow = levels[level - 1][0];
    const nextLow = levels[level][0];
    const targetWatts = Math.round(nextLow * weightKg);
    const moreWatts = targetWatts - nowWatts;
    return {
      now: `FTP ${nowWatts} W`,
      target: `${targetWatts} W`,
      progress: nextLow > currentLow ? clamp01((ftpPerKg - currentLow) / (nextLow - currentLow)) : 1,
      level,
      step: {
        title: `Raise your FTP to ${targetWatts} W for cardio L${level + 1}`,
        note:
          moreWatts > 0
            ? `Your last ride works out at ${nowWatts} W, so ${moreWatts} W more.`
            : `Your last ride is already at ${nowWatts} W. It counts at your next assessment.`,
      },
    };
  }

  const fiveK = projectedFiveKMinutes(summary);
  if (!fiveK) return null;
  const levels = getRunLevelsForUser(gender, age);
  if (level >= 10) {
    return { now: `5k in ${formatMinutes(fiveK)}`, target: null, progress: 1, level, step: null };
  }
  // Run rows are [slowest, fastest] 5k minutes; the next level starts at its slowest time.
  const currentSlow = levels[level - 1][0];
  const nextSlow = levels[level][0];
  const faster = fiveK - nextSlow;
  return {
    now: `5k in ${formatMinutes(fiveK)}`,
    target: formatMinutes(nextSlow),
    progress: currentSlow > nextSlow ? clamp01((currentSlow - fiveK) / (currentSlow - nextSlow)) : 1,
    level,
    step: {
      title: `Run 5k in ${formatMinutes(nextSlow)} for cardio L${level + 1}`,
      note:
        faster > 0
          ? `Your last run works out to a 5k in ${formatMinutes(fiveK)}. That's ${formatMinutes(faster)} faster: ${formatMinutes(nextSlow / 5)}/km instead of ${formatMinutes(fiveK / 5)}/km.`
          : `Your last run already works out to a 5k in ${formatMinutes(fiveK)}. It counts at your next assessment.`,
    },
  };
}

/** Loads the latest cardio and plank results and works out each pillar's next-level target. */
export async function fetchGoalTargets(uid: string): Promise<GoalTargets> {
  const [summary, profile, strengthDocs, knowledgeDocs] = await Promise.all([
    fetchCardioSummaryForUser(uid).catch(() => null),
    fetchDemographicsForAssess().catch(() => null),
    fetchStrengthAssessmentsForUser(uid).catch(() => []),
    fetchKnowledgeAssessmentsForUser(uid).catch(() => []),
  ]);

  const dob = profile?.date_of_birth ? new Date(`${profile.date_of_birth}T00:00:00`) : null;
  const validDob = dob && !Number.isNaN(dob.getTime()) ? dob : null;
  const gender = profile?.gender ?? null;

  const cardio =
    summary && summary.level > 0 && validDob && gender
      ? cardioTarget(summary, validDob, gender, profile?.weight_kg ?? null)
      : null;

  const latestPlank = strengthDocs
    .filter((item) => item.is_completed)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];

  let strength: GoalTarget | null = null;
  if (latestPlank && validDob && gender) {
    const holdSec = latestPlank.elapsed_time;
    const type = latestPlank.type || PLANK_STRENGTH_TYPE;
    const level = Math.max(1, Math.min(10, latestPlank.level ?? 1));
    const nextSec = level >= 10 ? 0 : strengthRequiredHoldSec(level + 1, validDob, gender, type);
    // Hold so far ÷ hold needed for the next level (the design's 2:04 of 2:27 = 84%).
    const progress = level >= 10 || nextSec <= 0 ? 1 : clamp01(holdSec / nextSec);
    const addSec = nextSec - holdSec;
    strength = {
      now: `plank ${formatPlankDuration(holdSec)}`,
      target: level >= 10 ? null : formatPlankDuration(nextSec),
      progress,
      level,
      step:
        level >= 10 || nextSec <= 0
          ? null
          : {
              title: `Hold a plank for ${formatPlankDuration(nextSec)} for strength L${level + 1}`,
              note:
                addSec > 0
                  ? `Your last hold was ${formatPlankDuration(holdSec)}, so add ${formatPlankDuration(addSec)}.`
                  : `Your last hold was already ${formatPlankDuration(holdSec)}. It counts at your next assessment.`,
            },
    };
  }

  // Knowledge: same scoring as the Fitness tab (level = floor(correct / total × 10)).
  const latestQuiz = knowledgeDocs
    .filter((item) => item.is_completed)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];

  let knowledge: GoalTarget | null = null;
  if (latestQuiz) {
    const total = Math.max(latestQuiz.responses.length, latestQuiz.correct_responses, 1);
    const correct = latestQuiz.correct_responses;
    const level = Math.max(
      1,
      Math.min(10, latestQuiz.level || calculateKnowledgeLevel(correct, total)),
    );
    const needed = correctAnswersForLevel(level + 1, total);
    const more = needed - correct;
    knowledge = {
      now: `quiz ${correct}/${total}`,
      target: level >= 10 ? null : `${needed}/${total}`,
      // Correct so far ÷ correct needed for the next level (18 of 21 = 86%).
      progress: level >= 10 ? 1 : clamp01(correct / needed),
      level,
      step:
        level >= 10
          ? null
          : {
              title: `Score ${needed}/${total} on the quiz for knowledge L${level + 1}`,
              note:
                more > 0
                  ? `You scored ${correct}/${total}, so ${plural(more, 'more correct answer')}.`
                  : `You already scored ${correct}/${total}. It counts at your next assessment.`,
            },
    };
  }

  return { cardio, strength, knowledge };
}
