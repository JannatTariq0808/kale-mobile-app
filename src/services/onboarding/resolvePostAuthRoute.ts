import { doc, getDoc } from 'firebase/firestore';
import type { RootStackParamList } from '../../navigation/types';
import type { KaleAssessment } from '../../types/assessment';
import {
  fetchAssessmentsForUser,
  fetchAssessmentById,
  resolveOnboardingPillarStep,
} from '../assessment/assessmentSession';
import { getCachedAssessmentIds, rememberAssessmentId } from '../assessment/onboardingAssessmentCache';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { UserProfile } from '../user/userProfile';
import { fetchUserProfile } from '../user/userProfile';
import {
  clearOnboardingComplete,
  hasSeenCardioResult,
  isOnboardingCompleteForUser,
} from './onboardingState';
import { onboardingPillarStepToRoute } from './resolveOnboardingNavigation';

type PostAuthRoute = keyof RootStackParamList;

type CardioDocMeta = {
  status: string | null;
  level: number;
  completed: boolean;
};

function isCardioReadyStatus(status: string | null): boolean {
  return status === 'level_assigned' || status === 'no_eligible' || status === 'no_activities';
}

async function fetchCardioDocMeta(cardioDocId: string): Promise<CardioDocMeta | null> {
  try {
    const cardioSnap = await getDoc(doc(getFirebaseFirestore(), 'cardios', cardioDocId));
    if (!cardioSnap.exists()) return null;
    const data = cardioSnap.data();
    const status = typeof data?.assessmentStatus === 'string' ? data.assessmentStatus : null;
    const level =
      typeof data?.level === 'number' && Number.isFinite(data.level) ? data.level : 0;
    return {
      status,
      level,
      completed: data?.is_completed === true || isCardioReadyStatus(status) || level > 0,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[auth] resolvePostAuthRoute: cardios lookup failed', error);
    }
    return null;
  }
}

async function fetchLiveCardioAssessmentStatus(uid: string): Promise<string | null> {
  const meta = await fetchCardioDocMeta(uid);
  return meta?.status ?? null;
}

/** True when any cardio doc exists for this user (live uid doc or assessment-linked). */
async function hasAnyCardioDoc(
  uid: string,
  assessments: KaleAssessment[],
): Promise<boolean> {
  try {
    const liveSnap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
    if (liveSnap.exists()) return true;
  } catch (error) {
    if (__DEV__) {
      console.warn('[auth] resolvePostAuthRoute: live cardios lookup failed', error);
    }
  }

  for (const assessment of assessments) {
    const cardioId = assessment.cardio_id;
    if (!cardioId || cardioId === uid) continue;
    try {
      const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', cardioId));
      if (snap.exists()) return true;
    } catch {
      /* continue */
    }
  }
  return false;
}

/** Website Level 1 / Unverified or any finished cardio assess — ready for CardioResult. */
async function isCardioAssessmentAssigned(
  uid: string,
  assessments: KaleAssessment[],
): Promise<boolean> {
  const live = await fetchCardioDocMeta(uid);
  if (live && (isCardioReadyStatus(live.status) || live.level > 0 || live.completed)) {
    return true;
  }

  for (const assessment of assessments) {
    const cardioId = assessment.cardio_id;
    if (!cardioId) continue;
    const meta = await fetchCardioDocMeta(cardioId);
    if (meta && (isCardioReadyStatus(meta.status) || meta.level > 0 || meta.completed)) {
      return true;
    }
  }
  return false;
}

/**
 * Show CardioResult once for website Level 1 / finished assess before Strength.
 * Skipped after the user has already viewed the reveal on this device.
 */
async function routeCardioResultIfNeeded(
  uid: string,
  assessments: KaleAssessment[],
): Promise<PostAuthRoute | null> {
  if (await hasSeenCardioResult(uid)) return null;
  if (!(await isCardioAssessmentAssigned(uid, assessments))) return null;
  if (__DEV__) {
    console.log('[auth] cardio assigned, reveal not seen → CardioResult');
  }
  return 'CardioResult';
}

function pillarStepToRoute(
  step: Awaited<ReturnType<typeof resolveOnboardingPillarStep>>,
): PostAuthRoute {
  return onboardingPillarStepToRoute(step);
}

/**
 * No open onboarding assessment — use live cardio if website already assessed,
 * otherwise start tracker connect in-app.
 */
async function routeFromCardioStatus(
  uid: string,
  assessments: KaleAssessment[],
): Promise<PostAuthRoute> {
  const reveal = await routeCardioResultIfNeeded(uid, assessments);
  if (reveal) return reveal;

  const cardioStatus = await fetchLiveCardioAssessmentStatus(uid);
  if (cardioStatus === 'level_assigned') {
    return 'StrengthIntro';
  }
  return 'ConnectTracker';
}

/**
 * First-login / post-delete: analysing only while assess is in flight.
 * Finished Level 1 / level_assigned → CardioResult (once), else ConnectTracker.
 */
async function routeForMissingOrFirstCardio(
  uid: string,
  assessments: KaleAssessment[],
): Promise<PostAuthRoute> {
  if (!(await hasAnyCardioDoc(uid, assessments))) {
    if (__DEV__) {
      console.log('[auth] no cardio/assessment → ConnectTracker');
    }
    return 'ConnectTracker';
  }

  const reveal = await routeCardioResultIfNeeded(uid, assessments);
  if (reveal) return reveal;

  if (__DEV__) {
    console.log('[auth] cardio doc present → CardioAnalysing');
  }
  return 'CardioAnalysing';
}

/**
 * First-time onboarding resume only (user has never entered Main via enterMainApp).
 * Once they hit home, later logins always go Main — even if an assessment is open.
 */
async function routeFromOnboardingAssessment(
  uid: string,
  assessment: KaleAssessment,
  assessments: KaleAssessment[],
): Promise<PostAuthRoute> {
  await rememberAssessmentId(uid, assessment.id);

  const reveal = await routeCardioResultIfNeeded(uid, assessments);
  if (reveal) return reveal;

  const step = await resolveOnboardingPillarStep(assessment);

  if (step === 'reveal' || step === 'done') {
    // Still in the reveal ceremony for this session — show LevelReveal once.
    // After enterMainApp, isOnboardingCompleteForUser short-circuits login to Main.
    if (__DEV__) {
      console.log('[auth] first-session onboarding → LevelReveal', {
        assessmentId: assessment.id,
        step,
      });
    }
    return 'LevelReveal';
  }

  const route = pillarStepToRoute(step);
  if (__DEV__) {
    console.log('[auth] first-session onboarding resume', {
      assessmentId: assessment.id,
      step,
      route,
    });
  }
  return route;
}

/**
 * Where an authenticated policy holder should land after login or cold start.
 *
 * After the user has entered Main once (`markOnboardingComplete`), always home —
 * unless server assessment/cardio data was wiped (e.g. account delete + re-signup
 * with the same Auth uid). In that case restart onboarding at ConnectTracker.
 */
export async function resolvePostAuthRoute(
  uid: string,
  profile?: UserProfile,
): Promise<PostAuthRoute> {
  const userProfile = profile ?? (await fetchUserProfile(uid));
  const { assessments, permissionDenied } = await fetchAssessmentsForUser(uid);

  const onboardingAssessment = assessments.find(
    (item) => item.isOnboarding && !item.is_completed,
  );
  const onboardingWithAllRefs = assessments.find(
    (item) =>
      item.isOnboarding &&
      item.cardio_id &&
      item.strength_id &&
      item.knowledge_id,
  );
  const hasServerOnboardingTrail =
    assessments.some((item) => item.isOnboarding) ||
    (await hasAnyCardioDoc(uid, assessments));

  // Local "entered home" flag can survive Auth-delete failure + same uid re-entry
  // after CF wiped assessments/cardios. Don't trust it without server data.
  if (await isOnboardingCompleteForUser(uid)) {
    if (hasServerOnboardingTrail) {
      if (__DEV__) {
        console.log('[auth] post-auth → Main (already entered home)');
      }
      return 'Main';
    }
    await clearOnboardingComplete();
    if (__DEV__) {
      console.log(
        '[auth] local onboarding complete but no assessment/cardio — restart ConnectTracker',
      );
    }
    return 'ConnectTracker';
  }

  if (onboardingAssessment) {
    return routeFromOnboardingAssessment(uid, onboardingAssessment, assessments);
  }

  if (onboardingWithAllRefs) {
    return routeFromOnboardingAssessment(uid, onboardingWithAllRefs, assessments);
  }

  if (permissionDenied) {
    const cachedIds = await getCachedAssessmentIds(uid);
    for (const assessmentId of cachedIds) {
      const cached = await fetchAssessmentById(assessmentId, uid);
      if (!cached?.isOnboarding) continue;

      if (
        !cached.is_completed ||
        (cached.cardio_id && cached.strength_id && cached.knowledge_id)
      ) {
        return routeFromOnboardingAssessment(uid, cached, assessments);
      }
    }

    if (__DEV__) {
      console.warn(
        '[auth] assessments read denied — check Firestore rules for owner read on assessments',
      );
    }
  }

  // Website sets first_time_login after signup / re-signup with a quote.
  // Only analyse when cardio already exists; otherwise connect in-app.
  if (userProfile.firstTimeLogin) {
    return routeForMissingOrFirstCardio(uid, assessments);
  }

  return routeFromCardioStatus(uid, assessments);
}
