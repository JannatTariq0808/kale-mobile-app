import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentReference,
  type Timestamp,
} from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import type { KaleAssessment } from '../../types/assessment';
import { allowMultipleAssessmentsPerQuarter } from '../../config/assessmentDev';
import { getCurrentKnowledgeQuarter } from '../../utils/assessmentCycle';
import {
  getActiveAssessmentFlow,
  setActiveAssessmentFlow,
} from './assessmentFlowSession';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { syncAthleteLevelToUser } from '../user/athleteLevel';
import { athleteLevelCalculation } from '../../utils/athleteLevel';
import { resolveCardioDocLevel } from '../../utils/resolveCardioDocLevel';
import {
  getCachedAssessmentIds,
  rememberAssessmentId,
  rememberAssessmentIds,
} from './onboardingAssessmentCache';

const ASSESSMENTS_COLLECTION = 'assessments';
const USERS_COLLECTION = 'users';
const STRENGTH_COLLECTION = 'strength';
const KNOWLEDGE_COLLECTION = 'knowledge';
const CARDIOS_COLLECTION = 'cardios';
const LEGACY_ONBOARDING_TYPE = 'onboarding';

export type AssessmentPillar = 'strength' | 'knowledge' | 'cardio';

function userRef(uid: string): DocumentReference {
  return doc(getFirebaseFirestore(), USERS_COLLECTION, uid);
}

function toDate(value: Timestamp | undefined): Date | undefined {
  return value?.toDate?.();
}

function readDocRefId(data: Record<string, unknown>, field: string): string | null {
  const ref = data[field];
  if (ref && typeof ref === 'object' && 'id' in ref && typeof (ref as DocumentReference).id === 'string') {
    return (ref as DocumentReference).id;
  }
  if (typeof ref === 'string' && ref.trim()) {
    const trimmed = ref.trim();
    const segments = trimmed.split('/').filter(Boolean);
    return segments[segments.length - 1] ?? trimmed;
  }
  return null;
}

/** Live Garmin/Strava doc is `cardios/{uid}`; per-assessment results use auto-generated ids. */
function isFrozenCardioDocId(uid: string, cardioId: string | null | undefined): boolean {
  return Boolean(cardioId && cardioId !== uid);
}

function readUserId(data: Record<string, unknown>): string | null {
  const refId = readDocRefId(data, 'user_id');
  if (refId) return refId;

  const raw = data.user_id;
  if (typeof raw !== 'string' || !raw.trim()) return null;

  const segments = raw.split('/').filter(Boolean);
  return segments[segments.length - 1] ?? raw.trim();
}

function isOnboardingAssessmentData(data: Record<string, unknown>): boolean {
  if (data.isOnboarding === true) return true;
  if (data.type === LEGACY_ONBOARDING_TYPE) return true;
  if (data.set === 'onboarding') return true;
  return false;
}

function parseAssessment(id: string, data: Record<string, unknown>): KaleAssessment | null {
  const userId = readUserId(data);
  if (!userId) return null;

  const quarterRaw = data.quarter;
  const quarter =
    quarterRaw && typeof quarterRaw === 'object'
      ? {
          label: (quarterRaw as Record<string, unknown>).label as string | number,
          month: Number((quarterRaw as Record<string, unknown>).month ?? 0),
          type: String((quarterRaw as Record<string, unknown>).type ?? ''),
          startMonth: Number((quarterRaw as Record<string, unknown>).startMonth ?? 0),
        }
      : { label: 0, month: 0, type: 'Onboarding', startMonth: 0 };

  return {
    id,
    user_id: userId,
    cardio_id: readDocRefId(data, 'cardio_id'),
    strength_id: readDocRefId(data, 'strength_id'),
    knowledge_id: readDocRefId(data, 'knowledge_id'),
    year: typeof data.year === 'number' ? data.year : new Date().getFullYear(),
    quarter,
    isOnboarding: isOnboardingAssessmentData(data),
    is_completed: data.is_completed === true,
    level: typeof data.level === 'number' ? data.level : null,
    created_at: toDate(data.created_at as Timestamp | undefined) ?? new Date(),
    updated_at: toDate(data.updated_at as Timestamp | undefined) ?? new Date(),
  };
}

function sortByCreatedAtDesc(a: KaleAssessment, b: KaleAssessment): number {
  return b.created_at.getTime() - a.created_at.getTime();
}

export type AssessmentsForUserResult = {
  assessments: KaleAssessment[];
  permissionDenied: boolean;
};

function isFirestorePermissionDenied(error: unknown): boolean {
  return (error as { code?: string })?.code === 'permission-denied';
}

function mergeAssessments(...groups: KaleAssessment[][]): KaleAssessment[] {
  const byId = new Map<string, KaleAssessment>();
  for (const group of groups) {
    for (const item of group) {
      byId.set(item.id, item);
    }
  }
  return [...byId.values()].sort(sortByCreatedAtDesc);
}

type AssessmentListQuery = 'all' | 'in_progress' | 'completed';

async function listAssessmentsForUser(
  uid: string,
  listQuery: AssessmentListQuery,
): Promise<AssessmentsForUserResult> {
  const db = getFirebaseFirestore();
  const constraints = [where('user_id', '==', userRef(uid))];
  if (listQuery === 'in_progress') {
    constraints.push(where('is_completed', '==', false));
  } else if (listQuery === 'completed') {
    constraints.push(where('is_completed', '==', true));
  }

  const snap = await getDocs(
    query(collection(db, ASSESSMENTS_COLLECTION), ...constraints),
  );

  const assessments = snap.docs
    .map((item) => parseAssessment(item.id, item.data() as Record<string, unknown>))
    .filter((item): item is KaleAssessment => item !== null && item.user_id === uid)
    .sort(sortByCreatedAtDesc);

  return { assessments, permissionDenied: false };
}

export async function fetchAssessmentById(
  assessmentId: string,
  uid?: string,
): Promise<KaleAssessment | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const snap = await getDoc(
      doc(getFirebaseFirestore(), ASSESSMENTS_COLLECTION, assessmentId),
    );
    if (!snap.exists()) return null;

    const parsed = parseAssessment(snap.id, snap.data() as Record<string, unknown>);
    if (!parsed) return null;
    if (uid && parsed.user_id !== uid) return null;

    if (uid) {
      await rememberAssessmentId(uid, parsed.id);
    }
    return parsed;
  } catch (error) {
    if (__DEV__) {
      console.warn('[assessment] fetchAssessmentById failed', assessmentId, error);
    }
    return null;
  }
}

async function fetchAssessmentsFromCache(uid: string): Promise<KaleAssessment[]> {
  const cachedIds = await getCachedAssessmentIds(uid);
  const assessments: KaleAssessment[] = [];

  for (const id of cachedIds) {
    const item = await fetchAssessmentById(id, uid);
    if (item) assessments.push(item);
  }

  return assessments.sort(sortByCreatedAtDesc);
}

async function persistAssessmentCache(uid: string, assessments: KaleAssessment[]): Promise<void> {
  if (assessments.length === 0) return;
  await rememberAssessmentIds(
    uid,
    assessments.map((item) => item.id),
  );
}

export async function fetchAssessmentsForUser(uid: string): Promise<AssessmentsForUserResult> {
  if (!isFirebaseConfigured()) {
    return { assessments: [], permissionDenied: false };
  }

  try {
    const primary = await listAssessmentsForUser(uid, 'all');
    await persistAssessmentCache(uid, primary.assessments);
    return primary;
  } catch (error) {
    if (!isFirestorePermissionDenied(error)) {
      if (__DEV__) {
        console.warn('[assessment] fetchAssessmentsForUser failed', error);
      }
      return { assessments: [], permissionDenied: false };
    }
  }

  if (__DEV__) {
    console.warn(
      '[assessment] full assessments list denied — retrying scoped queries + cached getDoc',
    );
  }

  const fallbackGroups: KaleAssessment[][] = [];

  for (const listQuery of ['in_progress', 'completed'] as const) {
    try {
      const scoped = await listAssessmentsForUser(uid, listQuery);
      fallbackGroups.push(scoped.assessments);
    } catch (scopedError) {
      if (__DEV__ && !isFirestorePermissionDenied(scopedError)) {
        console.warn(`[assessment] ${listQuery} assessments list failed`, scopedError);
      }
    }
  }

  const cached = await fetchAssessmentsFromCache(uid);
  fallbackGroups.push(cached);

  const assessments = mergeAssessments(...fallbackGroups);
  if (assessments.length > 0) {
    await persistAssessmentCache(uid, assessments);
    return { assessments, permissionDenied: false };
  }

  if (__DEV__) {
    console.warn('[assessment] fetchAssessmentsForUser failed — no fallback data');
  }
  return { assessments: [], permissionDenied: true };
}

/** Latest in-progress onboarding assessment — mirrors kale-website `findInProgressOnboardingAssessment`. */
export async function fetchInProgressOnboardingAssessment(
  uid: string,
): Promise<KaleAssessment | null> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  return (
    assessments.find((item) => item.isOnboarding && !item.is_completed) ?? null
  );
}

/** In-progress quarterly assessment for the current calendar quarter (created by cloud function). */
export function findInProgressQuarterlyAssessment(
  assessments: KaleAssessment[],
  now = new Date(),
): KaleAssessment | null {
  const quarter = getCurrentKnowledgeQuarter(now);
  const year = now.getFullYear();

  const currentQuarter = assessments.find(
    (item) =>
      !item.isOnboarding &&
      !item.is_completed &&
      item.year === year &&
      item.quarter?.month === quarter.month,
  );
  if (currentQuarter) return currentQuarter;

  if (allowMultipleAssessmentsPerQuarter()) {
    return assessments.find((item) => !item.isOnboarding && !item.is_completed) ?? null;
  }

  return null;
}

export async function fetchInProgressQuarterlyAssessment(
  uid: string,
  now = new Date(),
): Promise<KaleAssessment | null> {
  const { assessments } = await fetchAssessmentsForUser(uid);
  return findInProgressQuarterlyAssessment(assessments, now);
}

async function isAssessmentReadyForReveal(assessment: KaleAssessment): Promise<boolean> {
  const step = await resolveOnboardingPillarStep(assessment);
  return step === 'reveal' || step === 'done';
}

/**
 * Parent assessment doc to attach new pillar refs to.
 * Never returns a completed assessment or onboarding that already finished all pillars
 * (those must not be overwritten by a later quarterly attempt).
 */
async function resolveAssessmentForLinking(uid: string): Promise<KaleAssessment | null> {
  const flow = getActiveAssessmentFlow();

  if (flow?.assessmentId) {
    const byFlow = await fetchAssessmentById(flow.assessmentId, uid);
    if (byFlow && !byFlow.is_completed) return byFlow;
  }

  if (flow?.mode === 'quarterly') {
    return fetchInProgressQuarterlyAssessment(uid);
  }

  const onboarding = await fetchInProgressOnboardingAssessment(uid);
  if (onboarding && !onboarding.is_completed) {
    if (!(await isAssessmentReadyForReveal(onboarding))) {
      return onboarding;
    }
  }

  return fetchInProgressQuarterlyAssessment(uid);
}

/** Parent assessment to finalize (includes onboarding waiting on level reveal). */
async function resolveAssessmentForFinalize(uid: string): Promise<KaleAssessment | null> {
  const flow = getActiveAssessmentFlow();

  if (flow?.assessmentId) {
    const byFlow = await fetchAssessmentById(flow.assessmentId, uid);
    if (byFlow && !byFlow.is_completed) return byFlow;
  }

  if (flow?.mode === 'quarterly') {
    return fetchInProgressQuarterlyAssessment(uid);
  }

  const onboarding = await fetchInProgressOnboardingAssessment(uid);
  if (onboarding && !onboarding.is_completed) {
    return onboarding;
  }

  return fetchInProgressQuarterlyAssessment(uid);
}

/** UI helper — prefers explicit flow, then quarterly, then open onboarding. */
export async function fetchActiveInProgressAssessment(uid: string): Promise<KaleAssessment | null> {
  return resolveAssessmentForLinking(uid);
}

export async function isStrengthCompleted(strengthId: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), STRENGTH_COLLECTION, strengthId));
    return snap.exists() && snap.data()?.is_completed === true;
  } catch {
    return false;
  }
}

export async function isKnowledgeCompleted(knowledgeId: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), KNOWLEDGE_COLLECTION, knowledgeId));
    return snap.exists() && snap.data()?.is_completed === true;
  } catch {
    return false;
  }
}

function pillarRefId(assessment: KaleAssessment, pillar: AssessmentPillar): string | null {
  if (pillar === 'strength') return assessment.strength_id;
  if (pillar === 'knowledge') return assessment.knowledge_id;
  return assessment.cardio_id;
}

export async function readPillarLevelForAssessment(
  pillar: AssessmentPillar,
  refId: string,
  uid: string,
): Promise<number | null> {
  return readPillarLevel(pillar, refId, uid);
}

async function readPillarLevel(
  pillar: AssessmentPillar,
  refId: string,
  uid: string,
): Promise<number | null> {
  if (pillar === 'strength') {
    if (!(await isStrengthCompleted(refId))) return null;
    const snap = await getDoc(doc(getFirebaseFirestore(), STRENGTH_COLLECTION, refId));
    const level = snap.data()?.level;
    if (typeof level === 'number' && level > 0) return level;
    return 1;
  }

  if (pillar === 'knowledge') {
    if (!(await isKnowledgeCompleted(refId))) return null;
    const snap = await getDoc(doc(getFirebaseFirestore(), KNOWLEDGE_COLLECTION, refId));
    const level = snap.data()?.level;
    if (typeof level === 'number' && level > 0) return level;
    return 1;
  }

  // `refId` is a top-level `cardios/{id}` doc — auto id for frozen results, or `{uid}` for live.
  const cardioDocId = refId || uid;
  const snap = await getDoc(doc(getFirebaseFirestore(), CARDIOS_COLLECTION, cardioDocId));
  if (!snap.exists()) return null;
  const level = resolveCardioDocLevel(snap.data() as Record<string, unknown>);
  return level > 0 ? level : null;
}

/**
 * Level from the most recent *prior* assessment cycle that completed this pillar.
 * Ignores orphan pillar docs not linked on an `assessments` parent.
 */
export async function fetchPreviousPillarLevelFromAssessments(
  uid: string,
  pillar: AssessmentPillar,
  exclude?: { assessmentId?: string; pillarRefId?: string },
): Promise<number | null> {
  const { assessments } = await fetchAssessmentsForUser(uid);

  for (const assessment of assessments) {
    if (exclude?.assessmentId && assessment.id === exclude.assessmentId) continue;

    const refId = pillarRefId(assessment, pillar);
    if (!refId) continue;
    if (exclude?.pillarRefId && refId === exclude.pillarRefId) continue;

    const level = await readPillarLevel(pillar, refId, uid);
    if (level != null) return level;
  }

  return null;
}

export type OnboardingPillarStep = 'cardio' | 'strength' | 'knowledge' | 'reveal' | 'done';

/** Next incomplete pillar on the onboarding assessment (refs on assessment doc only). */
export async function resolveOnboardingPillarStep(
  assessment: KaleAssessment,
): Promise<OnboardingPillarStep> {
  if (!assessment.cardio_id) {
    return 'cardio';
  }

  if (!assessment.strength_id || !(await isStrengthCompleted(assessment.strength_id))) {
    return 'strength';
  }

  if (!assessment.knowledge_id || !(await isKnowledgeCompleted(assessment.knowledge_id))) {
    return 'knowledge';
  }

  return assessment.is_completed ? 'done' : 'reveal';
}

/**
 * Create (or reuse) a per-assessment `cardios/{autoId}` before tracker connect/assess.
 * Schema matches website cardio docs (`user_ref`, not `user_id`).
 *
 * Firestore rules often block client creates on `cardios` — in that case we still
 * reserve an auto-id for `/api/strava/assess` (Admin SDK) to create.
 */
export async function ensureAssessmentCardioDoc(uid: string): Promise<string | null> {
  const flow = getActiveAssessmentFlow();
  if (flow?.cardioDocId) {
    return flow.cardioDocId;
  }

  const assessment = await resolveAssessmentForLinking(uid);
  if (assessment?.is_completed) return null;

  if (assessment && isFrozenCardioDocId(uid, assessment.cardio_id)) {
    if (flow) {
      setActiveAssessmentFlow({ ...flow, cardioDocId: assessment.cardio_id! });
    }
    return assessment.cardio_id;
  }

  const db = getFirebaseFirestore();
  const cardioRef = doc(collection(db, CARDIOS_COLLECTION));

  try {
    await setDoc(cardioRef, {
      user_ref: userRef(uid),
      ...(assessment ? { assessment_id: assessment.id } : {}),
      assessmentStatus: 'pending',
      is_completed: false,
      created_at: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (!isFirestorePermissionDenied(error)) throw error;
    // Client write blocked — keep the reserved id; website assess creates the doc.
    if (__DEV__) {
      console.warn(
        '[assessment] client cannot create cardio doc (rules) — reserving id for API',
        cardioRef.id,
      );
    }
  }

  if (assessment) {
    try {
      await updateDoc(doc(db, ASSESSMENTS_COLLECTION, assessment.id), {
        cardio_id: cardioRef,
        updated_at: serverTimestamp(),
      });
      await rememberAssessmentId(uid, assessment.id);
    } catch (error) {
      if (__DEV__) {
        console.warn('[assessment] could not link cardio_id on assessment', assessment.id, error);
      }
    }
  }

  if (flow) {
    setActiveAssessmentFlow({ ...flow, cardioDocId: cardioRef.id });
  } else {
    setActiveAssessmentFlow({
      mode: 'onboarding',
      assessmentId: assessment?.id ?? '',
      cardioDocId: cardioRef.id,
    });
  }

  if (__DEV__) {
    console.log(
      '[assessment] prepared cardio doc',
      cardioRef.id,
      assessment ? `→ ${assessment.id}` : '(no assessment yet)',
    );
  }

  return cardioRef.id;
}

/** Resolve the assessment cardio doc id (auto-generated, not `cardios/{uid}`). */
export async function resolveAssessmentCardioDocId(uid: string): Promise<string | null> {
  const flow = getActiveAssessmentFlow();
  if (flow?.cardioDocId) return flow.cardioDocId;

  const assessment = await resolveAssessmentForLinking(uid);
  if (assessment && isFrozenCardioDocId(uid, assessment.cardio_id)) {
    return assessment.cardio_id;
  }

  return null;
}

/** Confirm the open assessment points at its per-attempt cardio doc after backend assess. */
export async function linkCardioToActiveAssessment(uid: string): Promise<void> {
  const assessment = await resolveAssessmentForLinking(uid);
  if (!assessment || assessment.is_completed) return;

  try {
    const cardioDocId = await resolveAssessmentCardioDocId(uid);
    if (!cardioDocId || !isFrozenCardioDocId(uid, cardioDocId)) {
      if (__DEV__) {
        console.warn('[assessment] linkCardioToActiveAssessment: no assessment cardio doc');
      }
      return;
    }
    await rememberAssessmentId(uid, assessment.id);
    if (__DEV__) {
      console.log('[assessment] cardio linked', assessment.id, '→', cardioDocId);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[assessment] linkCardioToActiveAssessment failed', error);
    }
  }
}

/** Attach a completed strength doc to the open assessment (onboarding or quarterly). */
export async function linkStrengthToOnboardingAssessment(
  uid: string,
  strengthId: string,
): Promise<void> {
  const assessment = await resolveAssessmentForLinking(uid);
  if (!assessment || assessment.is_completed) {
    if (__DEV__) {
      console.warn('[assessment] linkStrength skipped', {
        strengthId,
        hasAssessment: assessment != null,
        is_completed: assessment?.is_completed ?? null,
      });
    }
    return;
  }

  try {
    await updateDoc(doc(getFirebaseFirestore(), ASSESSMENTS_COLLECTION, assessment.id), {
      strength_id: doc(getFirebaseFirestore(), STRENGTH_COLLECTION, strengthId),
      updated_at: serverTimestamp(),
    });
    await rememberAssessmentId(uid, assessment.id);
    if (__DEV__) {
      console.log('[assessment] linked strength_id', strengthId, '→', assessment.id);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(
        '[assessment] linkStrengthToOnboardingAssessment failed — publish assessments owner update rule',
        {
          assessmentId: assessment.id,
          strengthId,
          isOnboarding: assessment.isOnboarding,
          is_completed: assessment.is_completed,
          error,
        },
      );
    }
  }
}

/** Attach a knowledge doc to the open assessment (onboarding or quarterly). */
export async function linkKnowledgeToOnboardingAssessment(
  uid: string,
  knowledgeId: string,
): Promise<void> {
  const assessment = await resolveAssessmentForLinking(uid);
  if (!assessment || assessment.is_completed) {
    if (__DEV__) {
      console.warn('[assessment] linkKnowledge skipped', {
        knowledgeId,
        hasAssessment: assessment != null,
        is_completed: assessment?.is_completed ?? null,
      });
    }
    return;
  }

  try {
    await updateDoc(doc(getFirebaseFirestore(), ASSESSMENTS_COLLECTION, assessment.id), {
      knowledge_id: doc(getFirebaseFirestore(), KNOWLEDGE_COLLECTION, knowledgeId),
      updated_at: serverTimestamp(),
    });
    await rememberAssessmentId(uid, assessment.id);
    if (__DEV__) {
      console.log('[assessment] linked knowledge_id', knowledgeId, '→', assessment.id);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[assessment] linkKnowledgeToOnboardingAssessment failed', {
        assessmentId: assessment.id,
        knowledgeId,
        isOnboarding: assessment.isOnboarding,
        is_completed: assessment.is_completed,
        error,
      });
    }
  }
}

/** When all three pillars are done, finalize the active in-progress assessment. */
export async function finalizeActiveAssessmentIfReady(
  uid: string,
): Promise<KaleAssessment | null> {
  const assessment = await resolveAssessmentForFinalize(uid);
  if (!assessment || assessment.is_completed) return null;

  // Do NOT backfill strength/knowledge from "latest" pillar docs here.
  // That incorrectly reuses onboarding (or prior-cycle) results onto a new
  // quarterly assessment when the user only opens Longevity. Pillar refs must
  // be written only when the user completes that pillar in this attempt
  // (linkStrength / linkKnowledge / linkCardio).

  // Assessment cardio must be a separate `cardios/{autoId}` doc, not `cardios/{uid}`.
  // Only use a cardio id already on this assessment (or active flow for this attempt).
  if (!assessment.cardio_id) {
    const flowCardioId = getActiveAssessmentFlow()?.cardioDocId;
    if (flowCardioId && isFrozenCardioDocId(uid, flowCardioId)) {
      assessment.cardio_id = flowCardioId;
    }
  }

  const levels = await readPillarLevelsForAssessment(uid, assessment);
  if (!levels) return null;

  const longevityLevel = athleteLevelCalculation(
    levels.cardio,
    levels.strength,
    levels.knowledge,
  );

  try {
    await updateDoc(doc(getFirebaseFirestore(), ASSESSMENTS_COLLECTION, assessment.id), {
      level: longevityLevel,
      is_completed: true,
      updated_at: serverTimestamp(),
    });
    if (__DEV__) {
      console.log('[assessment] finalized', {
        assessmentId: assessment.id,
        level: longevityLevel,
        quarterly: !assessment.isOnboarding,
      });
    }
    await cacheAssessmentForUser(uid, assessment.id);
    await syncAthleteLevelToUser(uid, longevityLevel);

    // Local level-reveal notification fires from LevelRevealScreen for both
    // onboarding and quarterly (deduped per assessment).

    return {
      ...assessment,
      level: longevityLevel,
      is_completed: true,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[assessment] finalizeActiveAssessmentIfReady failed', error);
    }
    return null;
  }
}

async function readPillarLevelsForAssessment(
  uid: string,
  assessment: KaleAssessment,
): Promise<{ cardio: number; strength: number; knowledge: number } | null> {
  if (!assessment.cardio_id || !assessment.strength_id || !assessment.knowledge_id) {
    return null;
  }

  const [cardio, strength, knowledge] = await Promise.all([
    readPillarLevel('cardio', assessment.cardio_id, uid),
    readPillarLevel('strength', assessment.strength_id, uid),
    readPillarLevel('knowledge', assessment.knowledge_id, uid),
  ]);

  if (cardio == null || strength == null || knowledge == null) return null;
  return { cardio, strength, knowledge };
}

export async function resolveQuarterlyPillarStep(
  assessment: KaleAssessment,
): Promise<OnboardingPillarStep> {
  return resolveOnboardingPillarStep(assessment);
}

export async function cacheAssessmentForUser(
  uid: string,
  assessmentId: string,
): Promise<void> {
  await rememberAssessmentId(uid, assessmentId);
}
