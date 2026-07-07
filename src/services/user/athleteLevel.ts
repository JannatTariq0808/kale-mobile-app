import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {
  fetchAssessmentsForUser,
  readPillarLevelForAssessment,
} from '../assessment/assessmentSession';
import type { KaleAssessment } from '../../types/assessment';
import { athleteLevelCalculation } from '../../utils/athleteLevel';
import { getFirebaseFirestore } from '../auth/firebaseApp';

function readAthleteLevelField(data: Record<string, unknown> | undefined): number | null {
  const raw = data?.athleteLevel ?? data?.athlete_level;
  const parsed =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return Math.min(10, Math.max(1, Math.round(parsed)));
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

async function fetchAssessmentReadyForReveal(uid: string): Promise<KaleAssessment | null> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  return (
    assessments.find(
      (item) => item.cardio_id && item.strength_id && item.knowledge_id,
    ) ?? null
  );
}

/** Longevity / athlete level from the latest completed (or ready-to-reveal) assessment. */
export async function fetchAthleteLevel(uid: string): Promise<number> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  const completed = assessments.find((item) => item.is_completed && item.level != null);
  if (completed?.level != null) return completed.level;

  const ready = await fetchAssessmentReadyForReveal(uid);
  if (ready?.level != null) return ready.level;

  if (ready) {
    const levels = await readPillarLevels(uid, ready);
    if (levels) {
      return athleteLevelCalculation(levels.cardio, levels.strength, levels.knowledge);
    }
  }

  return 1;
}

/** Current athlete level from `users/{uid}.athleteLevel` (set when an assessment completes). */
export async function fetchUserAthleteLevel(uid: string): Promise<number> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    const fromUser = snap.exists()
      ? readAthleteLevelField(snap.data() as Record<string, unknown>)
      : null;
    if (fromUser != null) return fromUser;
  } catch (error) {
    if (__DEV__) {
      console.warn('[user] fetchUserAthleteLevel failed', error);
    }
  }

  return fetchAthleteLevel(uid);
}

/** Persist the latest athlete level on the user profile (used for Kalettes % rebate). */
export async function syncAthleteLevelToUser(uid: string, athleteLevel: number): Promise<void> {
  const level = Math.min(10, Math.max(1, Math.round(athleteLevel)));

  try {
    await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
      athleteLevel: level,
      athleteLevelUpdatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[user] syncAthleteLevelToUser failed', error);
    }
  }
}
