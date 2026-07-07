import { getFirebaseAuth } from '../auth/firebaseApp';
import {
  allowMultipleAssessmentsPerQuarter,
  getDevSeedQuarterlyAssessmentUrl,
} from '../../config/assessmentDev';

export type SeedDevQuarterlyAssessmentResult =
  | { ok: true; assessmentId: string; created: boolean }
  | { ok: false; message: string };

/** Creates (or reuses) the current quarter's in-progress assessment via cloud function. */
export async function seedDevQuarterlyAssessment(): Promise<SeedDevQuarterlyAssessmentResult> {
  const url = getDevSeedQuarterlyAssessmentUrl();
  if (!url) {
    return {
      ok: false,
      message: 'Set EXPO_PUBLIC_DEV_SEED_QUARTERLY_ASSESSMENT_URL or EXPO_PUBLIC_FIREBASE_PROJECT_ID.',
    };
  }

  const user = getFirebaseAuth().currentUser;
  if (!user) {
    return { ok: false, message: 'Sign in first.' };
  }

  let idToken: string;
  try {
    idToken = await user.getIdToken();
  } catch {
    return { ok: false, message: 'Could not read auth token.' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ forceNew: allowMultipleAssessmentsPerQuarter() }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      assessmentId?: string;
      created?: boolean;
    };

    if (!res.ok || data.ok === false) {
      return {
        ok: false,
        message: typeof data.error === 'string' ? data.error : `Seed failed (${res.status})`,
      };
    }

    if (typeof data.assessmentId !== 'string') {
      return { ok: false, message: 'Invalid seed response.' };
    }

    return {
      ok: true,
      assessmentId: data.assessmentId,
      created: data.created === true,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Seed request failed.',
    };
  }
}
