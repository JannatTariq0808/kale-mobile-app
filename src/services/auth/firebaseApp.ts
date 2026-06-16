import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { Platform } from 'react-native';
import type { Auth, Persistence } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig, isFirebaseConfigured } from '../../config/firebase';

type AuthModule = typeof import('firebase/auth') & {
  getReactNativePersistence: (storage: typeof ReactNativeAsyncStorage) => Persistence;
};

/** Metro must resolve firebase/auth to the RN bundle — see metro.config.js. */
/** Used by auth/index.ts and hooks — same RN/browser bundle as getFirebaseAuth(). */
export function loadAuthModule(): AuthModule {
  if (Platform.OS === 'web') {
    return require('firebase/auth') as AuthModule;
  }

  return require('@firebase/auth/dist/rn/index.js') as AuthModule;
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* values to .env (see .env.example).',
    );
  }

  if (!app) {
    const existing = getApps()[0];
    app = existing ?? initializeApp(getFirebaseConfig());
  }

  return app;
}

function createFirebaseAuth(app: FirebaseApp): Auth {
  const authModule = loadAuthModule();
  const { initializeAuth, getReactNativePersistence } = authModule;

  if (Platform.OS === 'web') {
    return initializeAuth(app, { persistence: authModule.browserLocalPersistence });
  }

  // AsyncStorage ≈ Flutter SharedPreferences — keeps the auth session across app restarts.
  return initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    const { getAuth } = loadAuthModule();

    try {
      auth = createFirebaseAuth(firebaseApp);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('already been initialized')) {
        throw error;
      }
      auth = getAuth(firebaseApp);
    }
  }

  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }

  return firestore;
}

/** Side-effect import — call once at app startup when Firebase is configured. */
export function ensureFirebase(): void {
  if (isFirebaseConfigured()) {
    getFirebaseAuth();
  }
}
