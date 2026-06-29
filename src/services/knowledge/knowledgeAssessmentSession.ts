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
  clearCachedKnowledgeAssessmentId,
  getCachedKnowledgeAssessmentId,
  setCachedKnowledgeAssessmentId,
} from './knowledgeAssessmentLocal';

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

function parseResponse(raw: unknown): KnowledgeResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const isCorrect = data.isCorrect === true;
  const questionRefValue = data.question_ref as DocumentReference | undefined;
  const questionId = questionRefValue?.id ?? '';
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

/** Single-field query only — no composite Firestore index required. */
export async function fetchKnowledgeAssessmentsForUser(
  uid: string,
): Promise<KnowledgeAssessment[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const snap = await getDocs(
      query(
        collection(getFirebaseFirestore(), KNOWLEDGE_COLLECTION),
        where('user_id', '==', userRef(uid)),
      ),
    );

    return snap.docs
      .map((item) => parseAssessment(item.id, item.data() as Record<string, unknown>))
      .filter((item): item is KnowledgeAssessment => item !== null)
      .sort(sortByCreatedAtDesc);
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
    await setCachedKnowledgeAssessmentId(uid, normalizedSetId, created.id);
    if (__DEV__) {
      console.log('[knowledge] created assessment', created.id);
    }
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
    await setCachedKnowledgeAssessmentId(uid, normalizedSetId, assessment.id);
    return assessment.id;
  };

  if (preferredId) {
    const reused = await reuseIfInProgress(preferredId);
    if (reused) return reused;
  }

  const cachedId = await getCachedKnowledgeAssessmentId(uid, normalizedSetId);
  if (cachedId) {
    const reused = await reuseIfInProgress(cachedId);
    if (reused) return reused;
  }

  const inProgress = await fetchInProgressKnowledgeAssessment(uid, normalizedSetId);
  if (inProgress) {
    await setCachedKnowledgeAssessmentId(uid, normalizedSetId, inProgress.id);
    return inProgress.id;
  }

  const latestForSet = await fetchKnowledgeAssessmentForSet(uid, normalizedSetId);
  if (latestForSet?.is_completed) {
    return null;
  }

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

    await setCachedKnowledgeAssessmentId(uid, normalizedSetId, activeAssessmentId);
    if (parsed.is_completed) {
      await clearCachedKnowledgeAssessmentId(uid, normalizedSetId);
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
