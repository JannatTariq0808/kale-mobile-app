import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { CardioPlatform } from './fetchCardioSummary';

function readTimestamp(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as Timestamp).toDate === 'function'
  ) {
    return (value as Timestamp).toDate();
  }
  return null;
}

function readPlatform(value: unknown): CardioPlatform | null {
  if (value === 'strava' || value === 'garmin' || value === 'appleHealth') return value;
  return null;
}

export type LastCardioDocMeta = {
  createdAt: Date | null;
  platform: CardioPlatform | null;
};

/** Latest cardio summary doc for the user (`cardios/{uid}`). */
export async function fetchLastCardioDocMeta(uid: string): Promise<LastCardioDocMeta> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
    if (!snap.exists()) {
      return { createdAt: null, platform: null };
    }
    const data = snap.data();
    return {
      createdAt: readTimestamp(data.created_at),
      platform: readPlatform(data.platform),
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio] fetchLastCardioDocMeta failed', error);
    }
    return { createdAt: null, platform: null };
  }
}
