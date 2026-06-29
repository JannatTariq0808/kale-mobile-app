import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';

export type UserProfile = {
  policyHolder: boolean;
  firstTimeLogin: boolean;
};

export const POLICY_HOLDER_REQUIRED_MESSAGE =
  'Kale is available to policy holders. Connect Strava or Garmin on kale.insure first, then sign in with the email on your policy.';

function readFirstTimeLogin(data: Record<string, unknown> | undefined): boolean {
  if (!data) return false;
  const value = data.first_time_login;
  if (value === true) return true;
  if (value === 'yes') return true;
  return false;
}

export async function fetchUserProfile(uid: string): Promise<UserProfile> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    const data = snap.data();
    return {
      policyHolder: data?.policyHolder === true,
      firstTimeLogin: readFirstTimeLogin(data),
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[user] fetchUserProfile failed', error);
    }
    return { policyHolder: false, firstTimeLogin: false };
  }
}

/** Cleared after the first CardioAnalysing → CardioResult handoff. */
export async function clearFirstTimeLogin(uid: string): Promise<void> {
  try {
    await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
      first_time_login: false,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[user] clearFirstTimeLogin failed', error);
    }
  }
}
