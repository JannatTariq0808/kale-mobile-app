import { doc, getDoc } from 'firebase/firestore';
import type { RootStackParamList } from '../../navigation/types';
import {
  fetchAssessmentsForUser,
  fetchAssessmentById,
  resolveOnboardingPillarStep,
} from '../assessment/assessmentSession';
import { getCachedAssessmentIds, rememberAssessmentId } from '../assessment/onboardingAssessmentCache';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { UserProfile } from '../user/userProfile';
import { fetchUserProfile } from '../user/userProfile';
import { clearOnboardingComplete, isOnboardingCompleteForUser } from './onboardingState';
import { onboardingPillarStepToRoute } from './resolveOnboardingNavigation';

type PostAuthRoute = keyof RootStackParamList;

async function fetchCardioAssessmentStatus(uid: string): Promise<string | null> {
  try {
    const cardioSnap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
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

function pillarStepToRoute(step: Awaited<ReturnType<typeof resolveOnboardingPillarStep>>): PostAuthRoute {
  return onboardingPillarStepToRoute(step);
}

async function routeFromCardioStatus(uid: string): Promise<PostAuthRoute> {
  const cardioStatus = await fetchCardioAssessmentStatus(uid);
  if (cardioStatus === 'level_assigned') {
    return 'StrengthIntro';
  }
  return 'ConnectTracker';
}

/**
 * Where an authenticated policy holder should land after login or cold start.
 *
 * Onboarding login resume uses the in-progress `assessments` doc (`isOnboarding: true`,
 * `is_completed: false`) and follows cardio_id → strength_id → knowledge_id refs.
 * Quarterly assessments are started from the dashboard later — not on login.
 */
export async function resolvePostAuthRoute(
  uid: string,
  profile?: UserProfile,
): Promise<PostAuthRoute> {
  const userProfile = profile ?? (await fetchUserProfile(uid));

  if (userProfile.firstTimeLogin) {
    return 'CardioAnalysing';
  }

  const { assessments, permissionDenied } = await fetchAssessmentsForUser(uid);

  const onboardingAssessment = assessments.find(
    (item) => item.isOnboarding && !item.is_completed,
  );
  if (onboardingAssessment) {
    // Firestore is source of truth — e.g. dev reset of is_completed in the console.
    if (await isOnboardingCompleteForUser(uid)) {
      await clearOnboardingComplete();
    }
    await rememberAssessmentId(uid, onboardingAssessment.id);
    const step = await resolveOnboardingPillarStep(onboardingAssessment);
    const route = pillarStepToRoute(step);
    if (__DEV__) {
      console.log('[auth] onboarding assessment resume', {
        assessmentId: onboardingAssessment.id,
        step,
        route,
        cardio_id: onboardingAssessment.cardio_id,
        strength_id: onboardingAssessment.strength_id,
        knowledge_id: onboardingAssessment.knowledge_id,
      });
    }
    return route;
  }

  const readyForReveal = assessments.find(
    (item) => item.cardio_id && item.strength_id && item.knowledge_id && item.is_completed,
  );
  if (readyForReveal && !(await isOnboardingCompleteForUser(uid))) {
    await rememberAssessmentId(uid, readyForReveal.id);
    return 'LevelReveal';
  }

  if (permissionDenied) {
    const cachedIds = await getCachedAssessmentIds(uid);
    for (const assessmentId of cachedIds) {
      const cached = await fetchAssessmentById(assessmentId, uid);
      if (!cached) continue;

      if (cached.isOnboarding && !cached.is_completed) {
        if (await isOnboardingCompleteForUser(uid)) {
          await clearOnboardingComplete();
        }
        const step = await resolveOnboardingPillarStep(cached);
        const route = pillarStepToRoute(step);
        if (__DEV__) {
          console.log('[auth] onboarding resume from cached assessment', {
            assessmentId: cached.id,
            step,
            route,
          });
        }
        return route;
      }

      if (
        cached.cardio_id &&
        cached.strength_id &&
        cached.knowledge_id &&
        cached.is_completed &&
        !(await isOnboardingCompleteForUser(uid))
      ) {
        return 'LevelReveal';
      }
    }

    if (__DEV__) {
      console.warn(
        '[auth] assessments read denied — check Firestore rules for owner read on assessments',
      );
    }
    if (await isOnboardingCompleteForUser(uid)) {
      return 'Main';
    }
    return routeFromCardioStatus(uid);
  }

  if (await isOnboardingCompleteForUser(uid)) {
    return 'Main';
  }

  const incompleteOnboarding = assessments.find(
    (item) => item.isOnboarding && !item.is_completed,
  );
  if (incompleteOnboarding) {
    const step = await resolveOnboardingPillarStep(incompleteOnboarding);
    return pillarStepToRoute(step);
  }

  return routeFromCardioStatus(uid);
}
