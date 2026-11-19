/**
 * Body shape (research data for the VO2max model): rollout flag and member consent.
 *
 * Flag: `appConfig/bodyShape` { enabled, staffOnly, staffEmails[], staffDomains[] }.
 * Missing doc or any read error = off. Staff first: with staffOnly, only listed
 * emails / domains get it.
 *
 * Consent lives on `users/{uid}`: body_shape_consent (true/false),
 * body_shape_consent_at, body_shape_consent_version. Off by default: a member
 * who has never answered has no field and nothing runs.
 */
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';

export const BODY_SHAPE_CONSENT_VERSION = 'body-shape-v1';

export const BODY_SHAPE_CONSENT_TEXT =
  'Help us improve your fitness score. With your permission, the app measures your body shape ' +
  'from your strength test video, on your phone. The video never leaves your phone; only a few ' +
  'measurements are saved. You can turn this off at any time.';

type FlagDoc = {
  enabled?: boolean;
  staffOnly?: boolean;
  staffEmails?: string[];
  staffDomains?: string[];
};

/** Whether body shape is switched on for this signed-in member. */
export async function isBodyShapeEnabled(): Promise<boolean> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'appConfig', 'bodyShape'));
    if (!snap.exists()) return false;
    const flag = snap.data() as FlagDoc;
    if (flag.enabled !== true) return false;
    if (flag.staffOnly === false) return true;
    const email = getFirebaseAuth().currentUser?.email?.toLowerCase() ?? '';
    if (!email) return false;
    const emails = (flag.staffEmails ?? []).map((e) => e.toLowerCase());
    const domains = (flag.staffDomains ?? []).map((d) => d.toLowerCase().replace(/^@/, ''));
    return emails.includes(email) || domains.some((d) => email.endsWith(`@${d}`));
  } catch {
    return false;
  }
}

/** true / false once answered; null when never asked. */
export async function getBodyShapeConsent(uid: string): Promise<boolean | null> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    const value = snap.exists() ? snap.data().body_shape_consent : undefined;
    return typeof value === 'boolean' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Save the member's answer. Turning it off stops capture at once; the backend
 * deletes stored captures within 30 days (scheduled job keyed on
 * body_shape_consent == false).
 */
export async function setBodyShapeConsent(uid: string, consent: boolean): Promise<void> {
  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
    body_shape_consent: consent,
    body_shape_consent_at: serverTimestamp(),
    body_shape_consent_version: BODY_SHAPE_CONSENT_VERSION,
  });
}
