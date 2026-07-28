import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';

export type UserProfile = {
  policyHolder: boolean;
  firstTimeLogin: boolean;
};

export class ProfileFetchError extends Error {
  readonly reason: 'offline' | 'unknown';

  constructor(reason: 'offline' | 'unknown') {
    super(reason);
    this.name = 'ProfileFetchError';
    this.reason = reason;
  }
}

export const POLICY_HOLDER_REQUIRED_MESSAGE =
  'This account is not a Kale policy holder. Sign in with the email on your policy, or get started at kale.insure.';

export const PROFILE_OFFLINE_MESSAGE =
  'Could not reach Kale. Check your internet connection and try again.';

function readFirstTimeLogin(data: Record<string, unknown> | undefined): boolean {
  if (!data) return false;
  const value = data.first_time_login;
  if (value === true) return true;
  if (value === 'yes') return true;
  return false;
}

function isFirestoreOfflineError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? String((error as { code: unknown }).code) : '';
  if (code === 'unavailable') return true;
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes('offline');
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
    if (isFirestoreOfflineError(error)) {
      throw new ProfileFetchError('offline');
    }
    if (__DEV__) {
      console.warn('[user] fetchUserProfile failed', error);
    }
    throw new ProfileFetchError('unknown');
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
