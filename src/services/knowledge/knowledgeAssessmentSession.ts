import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentReference,
  type Timestamp,
} from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import type { KnowledgeAssessment, KnowledgeResponse } from '../../types/knowledgeAssessment';
import type { QuestionSetQuestion } from '../../types/questionSet';
import { optionIndexFromKey, optionKeyFromIndex } from '../../utils/questionSetQuiz';
import { calculateKnowledgeLevel } from '../../utils/knowledgeLevel';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import {
  fetchAssessmentsForUser,
  fetchInProgressOnboardingAssessment,
  fetchInProgressQuarterlyAssessment,
  finalizeActiveAssessmentIfReady,
  linkKnowledgeToOnboardingAssessment,
} from '../assessment/assessmentSession';

const KNOWLEDGE_COLLECTION = 'knowledge';
const QUESTION_SETS_COLLECTION = 'questionSets';
const USERS_COLLECTION = 'users';

function userRef(uid: string): DocumentReference {
  return doc(getFirebaseFirestore(), USERS_COLLECTION, uid);
}

function questionSetRef(questionId: string): DocumentReference {
  return doc(getFirebaseFirestore(), QUESTION_SETS_COLLECTION, questionId);
}

function knowledgeDocRef(assessmentId: string) {
  return doc(getFirebaseFirestore(), KNOWLEDGE_COLLECTION, assessmentId);
}

function toDate(value: Timestamp | undefined): Date | undefined {
  return value?.toDate?.();
}

function parseSelectedOption(raw: unknown): KnowledgeResponse['selectedOption'] | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const key = typeof data.key === 'string' ? data.key : '';
  const text = typeof data.text === 'string' ? data.text : '';
  const isCorrect = data.isCorrect === true;
  return { key, text, isCorrect };
}

function readRefId(raw: unknown): string {
  if (raw && typeof raw === 'object' && 'id' in raw && typeof (raw as DocumentReference).id === 'string') {
    return (raw as DocumentReference).id;
  }
  if (typeof raw === 'string' && raw.trim()) {
    const segments = raw.trim().split('/').filter(Boolean);
    return segments[segments.length - 1] ?? raw.trim();
  }
  return '';
}

function parseResponse(raw: unknown): KnowledgeResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const isCorrect = data.isCorrect === true;
  const questionId = readRefId(data.question_ref);
  const selectedOption = parseSelectedOption(data.selectedOption);
  if (!questionId || !selectedOption) return null;

  const selectedIndex = optionIndexFromKey(selectedOption.key);
  return { isCorrect, questionId, selectedIndex, selectedOption };
}

function parseAssessment(id: string, data: Record<string, unknown>): KnowledgeAssessment | null {
  const created_at = toDate(data.created_at as Timestamp | undefined) ?? new Date();

  const responses = Array.isArray(data.responses)
    ? data.responses
        .map(parseResponse)
        .filter((item): item is KnowledgeResponse => item !== null)
    : [];

  return {
    id,
    correct_responses: typeof data.correct_responses === 'number' ? data.correct_responses : 0,
    created_at,
    is_completed: data.is_completed === true,
    level: typeof data.level === 'number' ? data.level : 1,
    responses,
    set: typeof data.set === 'string' ? data.set.toLowerCase() : '',
  };
}

function logKnowledgeError(label: string, error: unknown) {
  console.warn(`[knowledge] ${label}`, error);
}

function sortByCreatedAtDesc(a: KnowledgeAssessment, b: KnowledgeAssessment) {
  return b.created_at.getTime() - a.created_at.getTime();
}

function mergeKnowledgeDocs(docs: Array<KnowledgeAssessment | null>): KnowledgeAssessment[] {
  const byId = new Map<string, KnowledgeAssessment>();
  for (const item of docs) {
    if (item) byId.set(item.id, item);
  }
  return [...byId.values()].sort(sortByCreatedAtDesc);
}

async function fetchKnowledgeByAssessmentRefs(uid: string): Promise<KnowledgeAssessment[]> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  const ids = [
    ...new Set(
      assessments
        .map((item) => item.knowledge_id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0),
    ),
  ];

  const docs = await Promise.all(ids.map((id) => loadAssessmentById(id)));
  return mergeKnowledgeDocs(docs);
}

async function fetchKnowledgeByUserQuery(uid: string): Promise<KnowledgeAssessment[]> {
  const snap = await getDocs(
    query(
      collection(getFirebaseFirestore(), KNOWLEDGE_COLLECTION),
      where('user_id', '==', userRef(uid)),
    ),
  );

  const parsed: KnowledgeAssessment[] = [];
  for (const item of snap.docs) {
    try {
      const row = parseAssessment(item.id, item.data() as Record<string, unknown>);
      if (row) parsed.push(row);
    } catch (error) {
      if (__DEV__) {
        logKnowledgeError(`skip bad knowledge doc ${item.id}`, error);
      }
    }
  }
  return parsed;
}

/** Prefer assessment knowledge_id getDocs — avoids fragile collection-query decoding. */
export async function fetchKnowledgeAssessmentsForUser(
  uid: string,
): Promise<KnowledgeAssessment[]> {
  if (!isFirebaseConfigured() || typeof uid !== 'string' || !uid) return [];

  // getDoc-by-id is reliable; collection queries have thrown
  // `path.split is not a function (it is undefined)` on some devices/docs.
  const fromRefs = await fetchKnowledgeByAssessmentRefs(uid).catch((error) => {
    if (__DEV__) {
      logKnowledgeError('assessment-ref fetch failed', error);
    }
    return [] as KnowledgeAssessment[];
  });

  if (fromRefs.length > 0) return fromRefs;

  try {
    return await fetchKnowledgeByUserQuery(uid);
  } catch (error) {
    logKnowledgeError('fetchKnowledgeAssessmentsForUser failed', error);
    return [];
  }
}

/** Latest assessment doc for this user + question set (completed or in progress). */
export async function fetchKnowledgeAssessmentForSet(
  uid: string,
  setId: string,
): Promise<KnowledgeAssessment | null> {
  const normalizedSetId = setId.toLowerCase();
  const assessments = await fetchKnowledgeAssessmentsForUser(uid);
  return (
    assessments.filter((item) => item.set === normalizedSetId).sort(sortByCreatedAtDesc)[0] ??
    null
  );
}

/**
 * Knowledge doc for the active assessment cycle — resolved entirely from Firestore:
 * prefers the parent assessment's `knowledge_id`, then the latest doc for this question set.
 */
export async function fetchKnowledgeAssessmentForActiveCycle(
  uid: string,
  setId: string,
): Promise<KnowledgeAssessment | null> {
  const normalizedSetId = setId.toLowerCase();

  const parentAssessment =
    (await fetchInProgressOnboardingAssessment(uid)) ??
    (await fetchInProgressQuarterlyAssessment(uid));

  if (parentAssessment?.knowledge_id) {
    const linked = await loadAssessmentById(parentAssessment.knowledge_id);
    if (linked && linked.set === normalizedSetId) return linked;
  }

  return fetchKnowledgeAssessmentForSet(uid, setId);
}

export async function fetchInProgressKnowledgeAssessment(
  uid: string,
  setId: string,
): Promise<KnowledgeAssessment | null> {
  const normalizedSetId = setId.toLowerCase();
  const assessments = await fetchKnowledgeAssessmentsForUser(uid);
  return (
    assessments.find((item) => item.set === normalizedSetId && !item.is_completed) ?? null
  );
}

async function loadAssessmentById(assessmentId: string): Promise<KnowledgeAssessment | null> {
  if (typeof assessmentId !== 'string' || !assessmentId) return null;
  try {
    const snap = await getDoc(knowledgeDocRef(assessmentId));
    if (!snap.exists()) return null;
    return parseAssessment(snap.id, snap.data() as Record<string, unknown>);
  } catch (error) {
    logKnowledgeError('loadAssessmentById failed', error);
    return null;
  }
}

/** Creates a new `knowledge` assessment doc for this attempt. */
export async function createKnowledgeAssessment(
  uid: string,
  setId: string,
  level = 1,
): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const normalizedSetId = setId.toLowerCase();

  try {
    const created = await addDoc(collection(getFirebaseFirestore(), KNOWLEDGE_COLLECTION), {
      correct_responses: 0,
      created_at: serverTimestamp(),
      is_completed: false,
      level,
      responses: [],
      set: normalizedSetId,
      user_id: userRef(uid),
    });
    if (__DEV__) {
      console.log('[knowledge] created assessment', created.id);
    }
    void linkKnowledgeToOnboardingAssessment(uid, created.id);
    return created.id;
  } catch (error) {
    logKnowledgeError('createKnowledgeAssessment failed', error);
    return null;
  }
}

/**
 * Reuses an in-progress assessment for this set.
 * Creates a new doc only when there is no incomplete assessment to resume.
 */
export async function ensureKnowledgeAssessment(
  uid: string,
  setId: string,
  preferredId?: string,
): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const normalizedSetId = setId.toLowerCase();

  const reuseIfInProgress = async (assessmentId: string): Promise<string | null> => {
    const assessment = await loadAssessmentById(assessmentId);
    if (!assessment || assessment.is_completed || assessment.set !== normalizedSetId) {
      return null;
    }
    void linkKnowledgeToOnboardingAssessment(uid, assessment.id);
    return assessment.id;
  };

  if (preferredId) {
    const reused = await reuseIfInProgress(preferredId);
    if (reused) return reused;
  }

  const parentAssessment =
    (await fetchInProgressOnboardingAssessment(uid)) ??
    (await fetchInProgressQuarterlyAssessment(uid));
  if (parentAssessment?.knowledge_id) {
    const reused = await reuseIfInProgress(parentAssessment.knowledge_id);
    if (reused) return reused;
  }

  const inProgress = await fetchInProgressKnowledgeAssessment(uid, normalizedSetId);
  if (inProgress) {
    void linkKnowledgeToOnboardingAssessment(uid, inProgress.id);
    return inProgress.id;
  }

  // Prior completed attempt for this set must not block a new cycle — create fresh.
  return createKnowledgeAssessment(uid, normalizedSetId);
}

type SaveResponseInput = {
  question: QuestionSetQuestion;
  selectedIndex: number;
};

function buildSelectedOption(question: QuestionSetQuestion, selectedIndex: number) {
  if (selectedIndex < 0) {
    return { key: '', text: '', isCorrect: false };
  }

  const text = question.options[selectedIndex] ?? '';
  const isCorrect = selectedIndex === question.correct;
  return {
    key: optionKeyFromIndex(selectedIndex),
    text,
    isCorrect,
  };
}

function buildFirestoreResponses(responses: KnowledgeResponse[]) {
  return responses.map((item) => ({
    isCorrect: item.isCorrect,
    question_ref: questionSetRef(item.questionId),
    selectedOption: item.selectedOption,
  }));
}

export async function appendKnowledgeResponse(
  uid: string,
  setId: string,
  assessmentId: string,
  input: SaveResponseInput,
  totalQuestions: number,
  existingResponses: KnowledgeResponse[],
): Promise<{ assessment: KnowledgeAssessment; assessmentId: string } | null> {
  if (!isFirebaseConfigured()) return null;

  const normalizedSetId = setId.toLowerCase();
  const { question, selectedIndex } = input;
  let activeAssessmentId = assessmentId;

  const docSnap = await getDoc(knowledgeDocRef(activeAssessmentId));
  if (!docSnap.exists()) {
    const createdId = await ensureKnowledgeAssessment(uid, normalizedSetId, assessmentId);
    if (!createdId) return null;
    activeAssessmentId = createdId;
  }

  if (existingResponses.some((item) => item.questionId === question.id)) {
    const snap = await getDoc(knowledgeDocRef(activeAssessmentId));
    if (!snap.exists()) return null;
    const parsed = parseAssessment(snap.id, snap.data() as Record<string, unknown>);
    if (!parsed) return null;
    return { assessment: parsed, assessmentId: activeAssessmentId };
  }

  const selectedOption = buildSelectedOption(question, selectedIndex);
  const isCorrect = selectedIndex === question.correct;
  const nextResponses: KnowledgeResponse[] = [
    ...existingResponses,
    {
      isCorrect,
      questionId: question.id,
      selectedIndex,
      selectedOption,
    },
  ];

  const correct_responses = nextResponses.filter((item) => item.isCorrect).length;
  const is_completed = nextResponses.length >= totalQuestions;
  const level = is_completed
    ? calculateKnowledgeLevel(correct_responses, totalQuestions)
    : undefined;

  const payload = {
    correct_responses,
    is_completed,
    responses: buildFirestoreResponses(nextResponses),
    set: normalizedSetId,
    user_id: userRef(uid),
    updated_at: serverTimestamp(),
    ...(level !== undefined ? { level } : {}),
  };

  try {
    await setDoc(knowledgeDocRef(activeAssessmentId), payload, { merge: true });

    const snap = await getDoc(knowledgeDocRef(activeAssessmentId));
    if (!snap.exists()) return null;
    const parsed = parseAssessment(snap.id, snap.data() as Record<string, unknown>);
    if (!parsed) return null;

    if (parsed.is_completed) {
      await linkKnowledgeToOnboardingAssessment(uid, activeAssessmentId);
      await finalizeActiveAssessmentIfReady(uid);
    }

    if (__DEV__) {
      console.log('[knowledge] saved response', {
        assessmentId: activeAssessmentId,
        count: parsed.responses.length,
        is_completed: parsed.is_completed,
      });
    }

    return { assessment: parsed, assessmentId: activeAssessmentId };
  } catch (error) {
    logKnowledgeError('appendKnowledgeResponse failed', error);
    return null;
  }
}

export async function fetchPreviousCompletedKnowledgeLevel(
  uid: string,
  excludeAssessmentId: string,
): Promise<number | null> {
  const assessments = await fetchKnowledgeAssessmentsForUser(uid);
  const previous = assessments.find(
    (item) => item.is_completed && item.id !== excludeAssessmentId,
  );
  return previous?.level ?? null;
}

export async function fetchKnowledgeAssessmentById(
  assessmentId: string,
): Promise<KnowledgeAssessment | null> {
  return loadAssessmentById(assessmentId);
}
