import { doc, getDoc } from 'firebase/firestore';
import type { RootStackParamList } from '../../navigation/types';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { UserProfile } from '../user/userProfile';
import { fetchUserProfile } from '../user/userProfile';
import { isOnboardingCompleteForUser } from './onboardingState';

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

/**
 * Where an authenticated policy holder should land after login or cold start.
 * ConnectTracker is only for later assessments — not the first mobile login.
 */
export async function resolvePostAuthRoute(
  uid: string,
  profile?: UserProfile,
): Promise<PostAuthRoute> {
  const userProfile = profile ?? (await fetchUserProfile(uid));

  if (userProfile.firstTimeLogin) {
    return 'CardioAnalysing';
  }

  if (await isOnboardingCompleteForUser(uid)) {
    return 'Main';
  }

  const cardioStatus = await fetchCardioAssessmentStatus(uid);

  if (cardioStatus === 'level_assigned') {
    return 'CardioResult';
  }

  return 'ConnectTracker';
}
