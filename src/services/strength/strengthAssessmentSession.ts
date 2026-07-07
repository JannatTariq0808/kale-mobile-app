import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  type DocumentReference,
  type Timestamp,
} from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import {
  PLANK_STRENGTH_TYPE,
  type SaveStrengthAssessmentInput,
  type StrengthAssessment,
} from '../../types/strengthAssessment';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { linkStrengthToOnboardingAssessment } from '../assessment/assessmentSession';
import { finalizeActiveAssessmentIfReady } from '../assessment/assessmentSession';

const STRENGTH_COLLECTION = 'strength';
const USERS_COLLECTION = 'users';

function userRef(uid: string): DocumentReference {
  return doc(getFirebaseFirestore(), USERS_COLLECTION, uid);
}

function strengthDocRef(assessmentId: string) {
  return doc(getFirebaseFirestore(), STRENGTH_COLLECTION, assessmentId);
}

function toDate(value: Timestamp | undefined): Date | undefined {
  return value?.toDate?.();
}

function parseStrengthAssessment(
  id: string,
  data: Record<string, unknown>,
): StrengthAssessment | null {
  const userRefValue = data.user_id as DocumentReference | undefined;
  if (!userRefValue?.id) return null;

  return {
    id,
    created_at: toDate(data.created_at as Timestamp | undefined) ?? new Date(),
    elapsed_time: typeof data.elapsed_time === 'number' ? data.elapsed_time : 0,
    is_completed: data.is_completed === true,
    level: typeof data.level === 'number' ? data.level : 1,
    type: typeof data.type === 'string' ? data.type : PLANK_STRENGTH_TYPE,
  };
}

function logStrengthError(label: string, error: unknown) {
  console.warn(`[strength] ${label}`, error);
}

function sortByCreatedAtDesc(a: StrengthAssessment, b: StrengthAssessment) {
  return b.created_at.getTime() - a.created_at.getTime();
}

export async function fetchStrengthAssessmentsForUser(
  uid: string,
): Promise<StrengthAssessment[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const snap = await getDocs(
      query(
        collection(getFirebaseFirestore(), STRENGTH_COLLECTION),
        where('user_id', '==', userRef(uid)),
      ),
    );

    return snap.docs
      .map((item) => parseStrengthAssessment(item.id, item.data() as Record<string, unknown>))
      .filter((item): item is StrengthAssessment => item !== null)
      .sort(sortByCreatedAtDesc);
  } catch (error) {
    logStrengthError('fetchStrengthAssessmentsForUser failed', error);
    return [];
  }
}

export async function fetchPreviousCompletedStrengthLevel(
  uid: string,
  excludeAssessmentId?: string,
): Promise<number | null> {
  const assessments = await fetchStrengthAssessmentsForUser(uid);
  const completed = assessments.filter(
    (item) =>
      item.is_completed &&
      item.type === PLANK_STRENGTH_TYPE &&
      (!excludeAssessmentId || item.id !== excludeAssessmentId),
  );

  if (excludeAssessmentId) {
    return completed[0]?.level ?? null;
  }

  return completed.length >= 2 ? (completed[1]?.level ?? null) : null;
}

export async function fetchLatestCompletedPlankAssessment(
  uid: string,
): Promise<StrengthAssessment | null> {
  const assessments = await fetchStrengthAssessmentsForUser(uid);
  return (
    assessments.find(
      (item) => item.is_completed && item.type === PLANK_STRENGTH_TYPE,
    ) ?? null
  );
}

export async function fetchStrengthAssessmentById(
  assessmentId: string,
): Promise<StrengthAssessment | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const snap = await getDoc(strengthDocRef(assessmentId));
    if (!snap.exists()) return null;
    return parseStrengthAssessment(snap.id, snap.data() as Record<string, unknown>);
  } catch (error) {
    logStrengthError('fetchStrengthAssessmentById failed', error);
    return null;
  }
}

/** Persists a completed strength test to `strength/{id}`. */
export async function saveStrengthAssessment(
  uid: string,
  input: SaveStrengthAssessmentInput,
): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const payload = {
    created_at: serverTimestamp(),
    elapsed_time: Math.max(0, Math.floor(input.elapsed_time)),
    is_completed: input.is_completed ?? true,
    level: Math.max(1, Math.min(10, Math.floor(input.level))),
    type: input.type ?? PLANK_STRENGTH_TYPE,
    user_id: userRef(uid),
  };

  try {
    const created = await addDoc(
      collection(getFirebaseFirestore(), STRENGTH_COLLECTION),
      payload,
    );
    if (__DEV__) {
      console.log('[strength] saved assessment', created.id, payload);
    }
    await linkStrengthToOnboardingAssessment(uid, created.id);
    await finalizeActiveAssessmentIfReady(uid);
    return created.id;
  } catch (error) {
    logStrengthError('saveStrengthAssessment failed', error);
    return null;
  }
}
