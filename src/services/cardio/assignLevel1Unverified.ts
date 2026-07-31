import { rememberAssessmentId } from '../assessment/onboardingAssessmentCache';
import {
  getActiveAssessmentFlow,
  setActiveAssessmentFlow,
} from '../assessment/assessmentFlowSession';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { kaleApiFetch } from '../tracker/kaleApiClient';

export type AssignLevel1Result =
  | { ok: true; cardioDocId: string; assessmentId: string | null }
  | { ok: false; message: string };

/**
 * Same as website "Continue as Longevity Level 1":
 * POST /api/cardio/assign-level-1 → creates/updates cardios + onboarding assessment.
 * Reuses any cardio/assessment ids already reserved during ConnectTracker.
 */
export async function assignLevel1Unverified(): Promise<AssignLevel1Result> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    return { ok: false, message: 'You must be signed in.' };
  }

  let idToken: string;
  try {
    idToken = await user.getIdToken();
  } catch {
    return { ok: false, message: 'Could not verify your session. Sign in again.' };
  }

  const flow = getActiveAssessmentFlow();
  const body: Record<string, string> = {};
  if (flow?.cardioDocId) body.cardio_doc_id = flow.cardioDocId;
  if (flow?.assessmentId) body.assessment_id = flow.assessmentId;

  const res = await kaleApiFetch('/api/cardio/assign-level-1', idToken, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    cardioDocId?: string;
    assessmentId?: string | null;
  };

  if (!res.ok || data.ok === false) {
    return {
      ok: false,
      message:
        typeof data.error === 'string' && data.error.trim()
          ? data.error
          : `Could not assign Level 1 (${res.status})`,
    };
  }

  const cardioDocId =
    typeof data.cardioDocId === 'string' && data.cardioDocId.trim()
      ? data.cardioDocId.trim()
      : flow?.cardioDocId ?? user.uid;
  const assessmentId =
    typeof data.assessmentId === 'string' && data.assessmentId.trim()
      ? data.assessmentId.trim()
      : flow?.assessmentId ?? null;

  if (assessmentId) {
    await rememberAssessmentId(user.uid, assessmentId);
  }

  setActiveAssessmentFlow({
    mode: flow?.mode ?? 'onboarding',
    assessmentId: assessmentId ?? '',
    cardioDocId,
    activitiesSince: flow?.activitiesSince,
  });

  if (__DEV__) {
    console.log('[cardio] assign-level-1 ok', { cardioDocId, assessmentId, reused: body });
  }

  return { ok: true, cardioDocId, assessmentId };
}
