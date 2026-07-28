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
import {
  fetchAssessmentsForUser,
  finalizeActiveAssessmentIfReady,
  linkStrengthToOnboardingAssessment,
} from '../assessment/assessmentSession';

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

function readUserId(data: Record<string, unknown>): string | null {
  const raw = data.user_id;
  if (raw && typeof raw === 'object' && 'id' in raw && typeof (raw as DocumentReference).id === 'string') {
    return (raw as DocumentReference).id;
  }
  if (typeof raw === 'string' && raw.trim()) {
    const segments = raw.trim().split('/').filter(Boolean);
    return segments[segments.length - 1] ?? raw.trim();
  }
  return null;
}

function parseStrengthAssessment(
  id: string,
  data: Record<string, unknown>,
  expectedUid?: string,
): StrengthAssessment | null {
  const ownerId = readUserId(data);
  if (!ownerId) return null;
  if (expectedUid && ownerId !== expectedUid) return null;

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

function mergeStrengthDocs(docs: Array<StrengthAssessment | null>): StrengthAssessment[] {
  const byId = new Map<string, StrengthAssessment>();
  for (const item of docs) {
    if (item) byId.set(item.id, item);
  }
  return [...byId.values()].sort(sortByCreatedAtDesc);
}

/** Prefer getDoc by assessment strength_id — avoids fragile collection-query decoding. */
async function fetchStrengthByAssessmentRefs(uid: string): Promise<StrengthAssessment[]> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  const ids = [
    ...new Set(
      assessments
        .map((item) => item.strength_id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0),
    ),
  ];

  const docs = await Promise.all(ids.map((id) => fetchStrengthAssessmentById(id)));
  return mergeStrengthDocs(docs);
}

async function fetchStrengthByUserQuery(uid: string): Promise<StrengthAssessment[]> {
  const snap = await getDocs(
    query(
      collection(getFirebaseFirestore(), STRENGTH_COLLECTION),
      where('user_id', '==', userRef(uid)),
    ),
  );

  const parsed: StrengthAssessment[] = [];
  for (const item of snap.docs) {
    try {
      const row = parseStrengthAssessment(
        item.id,
        item.data() as Record<string, unknown>,
        uid,
      );
      if (row) parsed.push(row);
    } catch (error) {
      if (__DEV__) {
        logStrengthError(`skip bad strength doc ${item.id}`, error);
      }
    }
  }
  return parsed;
}

export async function fetchStrengthAssessmentsForUser(
  uid: string,
): Promise<StrengthAssessment[]> {
  if (!isFirebaseConfigured() || typeof uid !== 'string' || !uid) return [];

  // getDoc-by-id is reliable on this app; collection queries have thrown
  // `path.split is not a function (it is undefined)` on some devices/docs.
  const fromRefs = await fetchStrengthByAssessmentRefs(uid).catch((error) => {
    if (__DEV__) {
      logStrengthError('assessment-ref fetch failed', error);
    }
    return [] as StrengthAssessment[];
  });

  if (fromRefs.length > 0) return fromRefs;

  try {
    return await fetchStrengthByUserQuery(uid);
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
  if (!isFirebaseConfigured() || typeof assessmentId !== 'string' || !assessmentId) {
    return null;
  }

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
