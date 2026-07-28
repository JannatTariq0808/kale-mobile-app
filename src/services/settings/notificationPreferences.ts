import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';

/**
 * Preference flags live as top-level fields on `users/{uid}`:
 * - assessmentAndCycleUpdates — one flag for assessment reminders + cycle emails
 * - marketing
 *
 * Cloud functions / lifecycle jobs should read these flags.
 */
export type NotificationPreferences = {
  assessmentAndCycleUpdates: boolean;
  marketing: boolean;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  assessmentAndCycleUpdates: true,
  marketing: true,
};

function readBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  return fallback;
}

/**
 * Reads prefs from top-level user fields.
 * Falls back to legacy `assessmentReminders` / `cycleUpdates` / nested map if present.
 */
export function parseNotificationPreferences(
  data: Record<string, unknown> | undefined,
): NotificationPreferences {
  if (!data) {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  const nested =
    data.notificationPreferences && typeof data.notificationPreferences === 'object'
      ? (data.notificationPreferences as Record<string, unknown>)
      : null;

  const assessmentAndCycleUpdates = readBool(
    data.assessmentAndCycleUpdates ??
      nested?.assessmentAndCycleUpdates ??
      data.assessmentReminders ??
      data.cycleUpdates ??
      nested?.assessmentReminders ??
      nested?.cycleUpdates,
    DEFAULT_NOTIFICATION_PREFERENCES.assessmentAndCycleUpdates,
  );

  const marketing = readBool(
    data.marketing ?? nested?.marketing,
    DEFAULT_NOTIFICATION_PREFERENCES.marketing,
  );

  return { assessmentAndCycleUpdates, marketing };
}

export async function fetchNotificationPreferences(
  uid: string,
): Promise<NotificationPreferences> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    return parseNotificationPreferences(
      snap.exists() ? (snap.data() as Record<string, unknown>) : undefined,
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[settings] fetchNotificationPreferences failed', error);
    }
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }
}

async function writePreferenceFields(
  uid: string,
  fields: Partial<NotificationPreferences>,
): Promise<void> {
  const ref = doc(getFirebaseFirestore(), 'users', uid);
  const payload = {
    ...fields,
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(ref, payload);
  } catch {
    await setDoc(ref, payload, { merge: true });
  }
}

/** Writes only the assessment/cycle flag — no extra read round-trip. */
export async function saveAssessmentAndCycleUpdatesPreference(
  uid: string,
  enabled: boolean,
): Promise<void> {
  await writePreferenceFields(uid, { assessmentAndCycleUpdates: enabled });
}

/** Writes only the marketing flag — no extra read round-trip. */
export async function saveMarketingPreference(
  uid: string,
  enabled: boolean,
): Promise<void> {
  await writePreferenceFields(uid, { marketing: enabled });
}

/** Top-level fields to stamp on new `users/{uid}` docs (sign-up). */
export function defaultNotificationPreferencesField(): NotificationPreferences {
  return { ...DEFAULT_NOTIFICATION_PREFERENCES };
}
