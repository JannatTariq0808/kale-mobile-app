import {
  fetchAssessmentById,
  fetchAssessmentsForUser,
  fetchInProgressOnboardingAssessment,
  isKnowledgeCompleted,
  isStrengthCompleted,
  readPillarLevelForAssessment,
} from '../assessment/assessmentSession';
import type { KaleAssessment } from '../../types/assessment';
import { athleteLevelCalculation } from '../../utils/athleteLevel';
import { syncAthleteLevelToUser } from '../user/athleteLevel';
import { getActiveAssessmentFlow } from '../assessment/assessmentFlowSession';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

const ASSESSMENTS_COLLECTION = 'assessments';

export type OnboardingPillarStatus = {
  assessmentId: string;
  cardioComplete: boolean;
  strengthComplete: boolean;
  knowledgeComplete: boolean;
};

export async function fetchOnboardingPillarStatus(
  uid: string,
): Promise<OnboardingPillarStatus | null> {
  const assessment = await fetchInProgressOnboardingAssessment(uid);
  if (!assessment) return null;

  const strengthComplete =
    assessment.strength_id != null &&
    (await isStrengthCompleted(assessment.strength_id));
  const knowledgeComplete =
    assessment.knowledge_id != null &&
    (await isKnowledgeCompleted(assessment.knowledge_id));

  return {
    assessmentId: assessment.id,
    cardioComplete: assessment.cardio_id != null,
    strengthComplete,
    knowledgeComplete,
  };
}

/** Skip only while both strength and knowledge are still incomplete. */
export function canSkipOnboardingPillar(
  screen: 'strength' | 'knowledge',
  status: OnboardingPillarStatus,
): boolean {
  if (screen === 'strength') {
    return !status.strengthComplete && !status.knowledgeComplete;
  }
  return !status.knowledgeComplete && !status.strengthComplete;
}

export type LevelRevealData = {
  assessmentId: string;
  longevityLevel: number;
  cardioLevel: number;
  strengthLevel: number;
  knowledgeLevel: number;
  trend: 'up' | 'down' | 'same' | 'none';
  trendDelta?: number;
};

export async function fetchPreviousCompletedAssessmentLevel(
  uid: string,
  excludeAssessmentId: string,
): Promise<number | null> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  const previous = assessments.find(
    (item) => item.is_completed && item.level != null && item.id !== excludeAssessmentId,
  );
  return previous?.level ?? null;
}

/** Assessment ready for LevelReveal — onboarding or quarterly with all three pillar refs. */
export async function fetchAssessmentReadyForReveal(
  uid: string,
): Promise<KaleAssessment | null> {
  const flow = getActiveAssessmentFlow();
  if (flow?.assessmentId) {
    const byFlow = await fetchAssessmentById(flow.assessmentId, uid);
    if (byFlow?.cardio_id && byFlow.strength_id && byFlow.knowledge_id) {
      return byFlow;
    }
  }

  const { assessments } = await fetchAssessmentsForUser(uid);
  const withRefs = assessments.filter(
    (item) => item.cardio_id && item.strength_id && item.knowledge_id,
  );
  return (
    withRefs.find((item) => !item.is_completed) ??
    withRefs.find((item) => item.isOnboarding) ??
    withRefs[0] ??
    null
  );
}

async function readPillarLevels(
  uid: string,
  assessment: KaleAssessment,
): Promise<{ cardio: number; strength: number; knowledge: number } | null> {
  if (!assessment.cardio_id || !assessment.strength_id || !assessment.knowledge_id) {
    return null;
  }

  const [cardio, strength, knowledge] = await Promise.all([
    readPillarLevelForAssessment('cardio', assessment.cardio_id, uid),
    readPillarLevelForAssessment('strength', assessment.strength_id, uid),
    readPillarLevelForAssessment('knowledge', assessment.knowledge_id, uid),
  ]);

  if (cardio == null || strength == null || knowledge == null) return null;
  return { cardio, strength, knowledge };
}

/**
 * When all three pillars are done, writes `level` + `is_completed` on the assessment doc.
 * Safe to call after strength or knowledge completes (whichever is last).
 */
export async function finalizeOnboardingAssessmentIfReady(
  uid: string,
): Promise<KaleAssessment | null> {
  const { finalizeActiveAssessmentIfReady } = await import('../assessment/assessmentSession');
  return finalizeActiveAssessmentIfReady(uid);
}

async function logLevelRevealDiagnostics(uid: string, assessment: KaleAssessment): Promise<void> {
  const [cardio, strength, knowledge, strengthDone, knowledgeDone] = await Promise.all([
    assessment.cardio_id
      ? readPillarLevelForAssessment('cardio', assessment.cardio_id, uid)
      : Promise.resolve(null),
    assessment.strength_id
      ? readPillarLevelForAssessment('strength', assessment.strength_id, uid)
      : Promise.resolve(null),
    assessment.knowledge_id
      ? readPillarLevelForAssessment('knowledge', assessment.knowledge_id, uid)
      : Promise.resolve(null),
    assessment.strength_id ? isStrengthCompleted(assessment.strength_id) : Promise.resolve(false),
    assessment.knowledge_id ? isKnowledgeCompleted(assessment.knowledge_id) : Promise.resolve(false),
  ]);

  console.warn('[level-reveal] could not load pillar levels', {
    assessmentId: assessment.id,
    cardio_id: assessment.cardio_id,
    strength_id: assessment.strength_id,
    knowledge_id: assessment.knowledge_id,
    cardioLevel: cardio,
    strengthLevel: strength,
    strengthCompleted: strengthDone,
    knowledgeLevel: knowledge,
    knowledgeCompleted: knowledgeDone,
  });
}

export async function loadLevelRevealData(uid: string): Promise<LevelRevealData | null> {
  let assessment = await fetchAssessmentReadyForReveal(uid);
  if (!assessment) {
    if (__DEV__) {
      console.warn(
        '[level-reveal] no assessment with cardio_id, strength_id, and knowledge_id',
      );
    }
    return null;
  }

  if (!assessment.is_completed) {
    const finalized = await finalizeOnboardingAssessmentIfReady(uid);
    if (finalized) {
      assessment = finalized;
    }
  }

  const levels = await readPillarLevels(uid, assessment);
  if (!levels) {
    if (__DEV__) {
      await logLevelRevealDiagnostics(uid, assessment);
    }
    return null;
  }

  let longevityLevel =
    assessment.level ?? athleteLevelCalculation(levels.cardio, levels.strength, levels.knowledge);

  if (assessment.level == null && assessment.is_completed) {
    try {
      await updateDoc(doc(getFirebaseFirestore(), ASSESSMENTS_COLLECTION, assessment.id), {
        level: longevityLevel,
        updated_at: serverTimestamp(),
      });
      await syncAthleteLevelToUser(uid, longevityLevel);
      assessment = { ...assessment, level: longevityLevel };
    } catch (error) {
      if (__DEV__) {
        console.warn('[level-reveal] could not backfill assessment level', error);
      }
    }
  }

  const previousLevel = await fetchPreviousCompletedAssessmentLevel(uid, assessment.id);

  let trend: LevelRevealData['trend'] = 'none';
  let trendDelta: number | undefined;

  if (previousLevel != null && previousLevel > 0) {
    const delta = longevityLevel - previousLevel;
    if (delta > 0) {
      trend = 'up';
      trendDelta = delta;
    } else if (delta < 0) {
      trend = 'down';
      trendDelta = delta;
    } else {
      trend = 'same';
    }
  }

  return {
    assessmentId: assessment.id,
    longevityLevel,
    cardioLevel: levels.cardio,
    strengthLevel: levels.strength,
    knowledgeLevel: levels.knowledge,
    trend,
    trendDelta,
  };
}
