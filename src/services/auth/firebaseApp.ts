import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig, isFirebaseConfigured } from '../../config/firebase';

function getReactNativePersistence(storage: typeof ReactNativeAsyncStorage): Persistence {
  const { getReactNativePersistence: getPersistence } = require('firebase/auth') as {
    getReactNativePersistence: (value: typeof ReactNativeAsyncStorage) => Persistence;
  };
  return getPersistence(storage);
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
  return initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = getFirebaseApp();
    try {
      auth = createFirebaseAuth(app);
    } catch {
      auth = getAuth(app);
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
