import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type ActionCodeSettings,
} from 'firebase/auth';
import {
  getAndroidPackageName,
  getAuthContinueUrl,
  getIosBundleId,
} from '../../config/appVariant';
import { getFirebaseAuth } from './firebaseApp';

function passwordResetActionSettings(): ActionCodeSettings {
  return {
    url: getAuthContinueUrl(),
    handleCodeInApp: true,
    iOS: {
      bundleId: getIosBundleId(),
    },
    android: {
      packageName: getAndroidPackageName(),
      installApp: true,
      minimumVersion: '1',
    },
  };
}

export async function requestPasswordResetEmail(email: string): Promise<void> {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error('Enter the email on your Kale policy.');
  }

  await sendPasswordResetEmail(getFirebaseAuth(), trimmed, passwordResetActionSettings());
}

export async function completePasswordReset(oobCode: string, password: string): Promise<void> {
  if (!oobCode) {
    throw new Error('This reset link is invalid or has expired.');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
}

export async function signUpWithEmail(email: string, password: string) {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error('Enter your email address.');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  return createUserWithEmailAndPassword(getFirebaseAuth(), trimmed, password);
}

export async function signInWithEmail(email: string, password: string) {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error('Enter your email address.');
  }

  return signInWithEmailAndPassword(getFirebaseAuth(), trimmed, password);
}

function getFirebaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = String(error.code);
    if (code) return code;
  }

  if (error instanceof Error) {
    const fromMessage = error.message.match(/\((auth\/[^)]+)\)/);
    if (fromMessage?.[1]) return fromMessage[1];
  }

  return '';
}

export function mapFirebaseAuthError(error: unknown): string {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with that email.';
    case 'auth/weak-password':
      return 'Choose a stronger password (at least 8 characters).';
    case 'auth/invalid-action-code':
    case 'auth/expired-action-code':
      return 'This reset link is invalid or has expired. Request a new one.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/operation-not-allowed':
      return 'Email sign-up is disabled in Firebase. Enable Email/Password in Authentication.';
    case 'permission-denied':
      return 'Could not save your profile. Enable Firestore and allow users/{uid} writes in rules.';
    case 'unavailable':
      return 'Firebase is unavailable. Enable Firestore Database in Firebase Console.';
    default:
      return error instanceof Error ? error.message : 'Something went wrong. Try again.';
  }
}
