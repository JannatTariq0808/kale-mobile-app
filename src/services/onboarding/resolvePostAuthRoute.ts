import { doc, getDoc } from 'firebase/firestore';
import type { RootStackParamList } from '../../navigation/types';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { clearOnboardingComplete, isOnboardingCompleteForUser } from './onboardingState';

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

/** Where an authenticated user should land after login or cold start. */
export async function resolvePostAuthRoute(uid: string): Promise<PostAuthRoute> {
  const cardioStatus = await fetchCardioAssessmentStatus(uid);

  // Cardio not finished — always start at connect (ignore stale local onboarding flag).
  if (cardioStatus !== 'level_assigned') {
    if (await isOnboardingCompleteForUser(uid)) {
      await clearOnboardingComplete();
      if (__DEV__) {
        console.log('[auth] cleared stale onboarding flag — cardio not complete');
      }
    }
    return 'ConnectTracker';
  }

  if (await isOnboardingCompleteForUser(uid)) {
    return 'Main';
  }

  return 'CardioResult';
}
