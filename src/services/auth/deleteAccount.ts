import { cloudFunctionUrl } from '../../config/cloudFunctions';
import { isFirebaseConfigured } from '../../config/firebase';
import { clearOnboardingComplete } from '../onboarding/onboardingState';
import { getFirebaseAuth, loadAuthModule } from './firebaseApp';

export type DeleteAccountResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'not_signed_in' | 'requires_recent_login' | 'wrong_password' | 'failed';
      message: string;
    };

function authErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code?: string }).code ?? '');
  }
  return '';
}

/**
 * Production wipe via Cloud Function `deleteAccount` (Admin SDK).
 * Deletes assessments, strength, knowledge, cardios, rewards, Garmin, user, Auth.
 */
async function deleteAccountViaCloudFunction(
  idToken: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const url = cloudFunctionUrl('deleteAccount');
  if (!url) {
    return {
      ok: false,
      message: 'Account deletion is not configured for this build.',
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirmed: true }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      if (__DEV__) {
        console.warn('[auth] deleteAccount CF failed', res.status, text);
      }
      return {
        ok: false,
        message:
          res.status === 401
            ? 'Session expired. Sign in again and retry.'
            : 'Could not delete your account on the server. Please try again or contact support.',
      };
    }

    return { ok: true };
  } catch (error) {
    if (__DEV__) {
      console.warn('[auth] deleteAccount CF request failed', error);
    }
    return {
      ok: false,
      message: 'Could not reach account services. Check your connection and try again.',
    };
  }
}

/**
 * App Store 5.1.1(v): full account deletion from within the app.
 * Requires Cloud Function wipe to succeed, then clears the local session.
 */
export async function deleteCurrentUserAccount(options?: {
  password?: string;
}): Promise<DeleteAccountResult> {
  if (!isFirebaseConfigured()) {
    return { ok: false, reason: 'failed', message: 'Account services are unavailable.' };
  }

  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    return { ok: false, reason: 'not_signed_in', message: 'You need to be signed in.' };
  }

  const { EmailAuthProvider, reauthenticateWithCredential, signOut } = loadAuthModule();

  try {
    if (options?.password && user.email) {
      const credential = EmailAuthProvider.credential(user.email, options.password);
      await reauthenticateWithCredential(user, credential);
    }

    let idToken: string;
    try {
      idToken = await user.getIdToken(true);
    } catch {
      return {
        ok: false,
        reason: 'failed',
        message: 'Could not verify your session. Sign in again and retry.',
      };
    }

    const server = await deleteAccountViaCloudFunction(idToken);
    if (!server.ok) {
      return { ok: false, reason: 'failed', message: server.message };
    }

    try {
      await signOut(auth);
    } catch {
      /* Auth already deleted by Cloud Function */
    }
    await clearOnboardingComplete();

    return { ok: true };
  } catch (error) {
    const code = authErrorCode(error);
    if (code === 'auth/requires-recent-login') {
      return {
        ok: false,
        reason: 'requires_recent_login',
        message: 'For security, enter your password to delete your account.',
      };
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return {
        ok: false,
        reason: 'wrong_password',
        message: 'Incorrect password. Try again.',
      };
    }
    if (__DEV__) {
      console.warn('[auth] deleteCurrentUserAccount failed', error);
    }
    return {
      ok: false,
      reason: 'failed',
      message: 'Could not delete your account. Please try again or contact support.',
    };
  }
}
