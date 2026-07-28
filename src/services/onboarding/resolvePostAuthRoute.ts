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
  isOnboardingCompleteForUser,
} from './onboardingState';
import { onboardingPillarStepToRoute } from './resolveOnboardingNavigation';

type PostAuthRoute = keyof RootStackParamList;

async function fetchCardioDocStatus(cardioDocId: string): Promise<string | null> {
  try {
    const cardioSnap = await getDoc(doc(getFirebaseFirestore(), 'cardios', cardioDocId));
    if (!cardioSnap.exists()) return null;
    const status = cardioSnap.data()?.assessmentStatus;
    return typeof status === 'string' ? status : null;
  } catch (error) {
    if (__DEV__) {
      console.warn('[auth] resolvePostAuthRoute: cardios lookup failed', error);
    }
    return null;
  }
}

async function fetchLiveCardioAssessmentStatus(uid: string): Promise<string | null> {
  return fetchCardioDocStatus(uid);
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

function pillarStepToRoute(
  step: Awaited<ReturnType<typeof resolveOnboardingPillarStep>>,
): PostAuthRoute {
  return onboardingPillarStepToRoute(step);
}

/**
 * No open onboarding assessment — use live cardio if website already assessed,
 * otherwise start tracker connect in-app.
 */
async function routeFromCardioStatus(uid: string): Promise<PostAuthRoute> {
  const cardioStatus = await fetchLiveCardioAssessmentStatus(uid);
  if (cardioStatus === 'level_assigned') {
    return 'StrengthIntro';
  }
  return 'ConnectTracker';
}

/**
 * First-login / post-delete: only show analysing when a cardio doc already exists
 * (website sync in flight or finished). Otherwise send them to ConnectTracker.
 */
async function routeForMissingOrFirstCardio(
  uid: string,
  assessments: KaleAssessment[],
): Promise<PostAuthRoute> {
  if (await hasAnyCardioDoc(uid, assessments)) {
    if (__DEV__) {
      console.log('[auth] cardio doc present → CardioAnalysing');
    }
    return 'CardioAnalysing';
  }
  if (__DEV__) {
    console.log('[auth] no cardio/assessment → ConnectTracker');
  }
  return 'ConnectTracker';
}

/**
 * First-time onboarding resume only (user has never entered Main via enterMainApp).
 * Once they hit home, later logins always go Main — even if an assessment is open.
 */
async function routeFromOnboardingAssessment(
  uid: string,
  assessment: KaleAssessment,
): Promise<PostAuthRoute> {
  await rememberAssessmentId(uid, assessment.id);
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
    return routeFromOnboardingAssessment(uid, onboardingAssessment);
  }

  if (onboardingWithAllRefs) {
    return routeFromOnboardingAssessment(uid, onboardingWithAllRefs);
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
        return routeFromOnboardingAssessment(uid, cached);
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

  return routeFromCardioStatus(uid);
}
