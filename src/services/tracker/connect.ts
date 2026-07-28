import type { ConnectionBrand } from '../../components/lumen/ConnectionBrandIcon';
import type { TrackerProvider } from '../../navigation/trackerLinking';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { fetchHealthProfileForAssess } from '../user/fetchHealthProfile';
import { getActiveAssessmentFlowAsync } from '../assessment/assessmentFlowSession';
import { ensureAssessmentCardioDoc } from '../assessment/assessmentSession';
import { assessStravaActivities, type AssessStravaOptions } from './assess';
import { claimGarminConnection, claimStravaConnection, type GarminClaimOptions } from './claim';
import { pollGarminSyncStatus } from './garminSync';
import { oauthReasonToMessage, runTrackerOAuth } from './oauth';
import { dedupeFinishTrackerConnection } from './connectSession';

export type ConnectTrackerResult =
  | { ok: true; provider: ConnectionBrand }
  | {
      ok: false;
      message: string;
      provider?: 'strava' | 'garmin';
      oauthReason?: string | null;
      cancelled?: boolean;
    };

const STRAVA_ERROR_MESSAGES: Record<string, string> = {
  athlete_limit:
    'The Kale Strava app has reached its athlete limit. Contact support or try Garmin.',
  invalid_state: 'Connection expired. Please try again.',
  token_exchange: 'Could not verify Strava. Please try again.',
  access_denied: 'Strava access was not granted.',
};

async function getIdToken(): Promise<string> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error('You must be signed in to connect a tracker.');
  }
  return user.getIdToken();
}

function readGarminClaimOptions(
  assessOptions?: AssessStravaOptions,
): GarminClaimOptions | undefined {
  if (!assessOptions) return undefined;
  const options: GarminClaimOptions = {};
  if (assessOptions.activitiesSince) options.activitiesSince = assessOptions.activitiesSince;
  if (assessOptions.assessmentId) options.assessmentId = assessOptions.assessmentId;
  if (assessOptions.cardioDocId) options.cardioDocId = assessOptions.cardioDocId;
  return Object.keys(options).length > 0 ? options : undefined;
}

async function finishProviderConnection(
  provider: TrackerProvider,
  pendingToken: string,
  assessOptions?: AssessStravaOptions,
): Promise<ConnectTrackerResult> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    throw new Error('You must be signed in to connect a tracker.');
  }

  const idToken = await getIdToken();
  const options = (await prepareAssessOptions(uid, assessOptions)) ?? {};

  if (provider === 'strava') {
    const claim = await claimStravaConnection(idToken, pendingToken);
    if (!claim.ok) {
      return {
        ok: false,
        message: claim.message ?? 'Could not save your Strava connection.',
        provider: 'strava',
      };
    }

    const profile = await fetchHealthProfileForAssess();
    if (!profile) {
      return {
        ok: false,
        message: 'Your profile is missing age, gender, or weight. Complete sign-up first.',
        provider: 'strava',
      };
    }

    const assess = await assessStravaActivities(idToken, profile, options);
    if (__DEV__) {
      console.log('[cardio-sync] strava assess dispatched', {
        activities_since: options?.activitiesSince ?? null,
        assessment_id: options?.assessmentId ?? null,
        cardio_doc_id: options?.cardioDocId ?? null,
        ok: assess.ok,
      });
    }
    if (!assess.ok) {
      return { ok: false, message: assess.message, provider: 'strava' };
    }

    return { ok: true, provider: 'strava' };
  }

  const claim = await claimGarminConnection(
    idToken,
    pendingToken,
    readGarminClaimOptions(options),
  );
  if (__DEV__) {
    console.log('[cardio-sync] garmin claim dispatched', {
      activities_since: options?.activitiesSince ?? null,
      assessment_id: options?.assessmentId ?? null,
      cardio_doc_id: options?.cardioDocId ?? null,
      ok: claim.ok,
    });
  }
  if (!claim.ok) {
    return {
      ok: false,
      message: claim.message ?? 'Could not save your Garmin connection.',
      provider: 'garmin',
      oauthReason: claim.reason === 'backfill' ? 'duplicate_backfill' : undefined,
    };
  }

  const profile = await fetchHealthProfileForAssess();
  if (!profile) {
    return {
      ok: false,
      message: 'Your profile is missing age, gender, or weight. Complete sign-up first.',
      provider: 'garmin',
    };
  }

  const sync = await pollGarminSyncStatus(idToken, claim.batchId);
  if (sync.status !== 'success') {
    return {
      ok: false,
      message: sync.status === 'error' ? sync.errorMessage : 'Garmin sync did not complete.',
      provider: 'garmin',
    };
  }

  return { ok: true, provider: 'garmin' };
}

/** After OAuth (browser or deep link) — claim, assess, and sync. */
export async function finishTrackerConnection(
  provider: TrackerProvider,
  pendingToken: string,
  assessOptions?: AssessStravaOptions,
): Promise<ConnectTrackerResult> {
  return dedupeFinishTrackerConnection(pendingToken, () =>
    finishProviderConnection(provider, pendingToken, assessOptions),
  );
}

async function readAssessOptionsFromFlow(
  override?: AssessStravaOptions,
): Promise<AssessStravaOptions | undefined> {
  const flow = await getActiveAssessmentFlowAsync();
  const options: AssessStravaOptions = { ...(override ?? {}) };
  if (flow?.activitiesSince && !options.activitiesSince) {
    options.activitiesSince = flow.activitiesSince;
  }
  if (flow?.assessmentId && !options.assessmentId) {
    options.assessmentId = flow.assessmentId;
  }
  if (flow?.cardioDocId && !options.cardioDocId) {
    options.cardioDocId = flow.cardioDocId;
  }
  return Object.keys(options).length > 0 ? options : undefined;
}

async function prepareAssessOptions(
  uid: string,
  override?: AssessStravaOptions,
): Promise<AssessStravaOptions | undefined> {
  const cardioDocId = await ensureAssessmentCardioDoc(uid);
  const base: AssessStravaOptions = {
    ...(await readAssessOptionsFromFlow(override)),
  };
  if (cardioDocId) {
    base.cardioDocId = cardioDocId;
  }

  if (__DEV__) {
    console.log('[cardio-sync] prepareAssessOptions', {
      cardioDocId: base.cardioDocId ?? null,
      assessmentId: base.assessmentId ?? null,
      activitiesSince: base.activitiesSince ?? null,
    });
  }

  return Object.keys(base).length > 0 ? base : undefined;
}

export async function connectTracker(
  brand: ConnectionBrand,
  overrideOptions?: AssessStravaOptions,
): Promise<ConnectTrackerResult> {
  if (brand === 'apple') {
    return { ok: false, message: 'Apple Health is not available yet.' };
  }

  const provider = brand;
  const oauth = await runTrackerOAuth(provider);
  if (!oauth.ok) {
    if (oauth.reason === 'cancelled') {
      return { ok: false, message: oauth.message ?? 'Connection cancelled.', cancelled: true };
    }
    const message =
      provider === 'strava' && oauth.message && STRAVA_ERROR_MESSAGES[oauth.message]
        ? STRAVA_ERROR_MESSAGES[oauth.message]
        : oauth.message ?? oauthReasonToMessage(undefined, provider);
    return {
      ok: false,
      message,
      provider,
      oauthReason: oauth.message ?? null,
    };
  }

  const pendingToken = oauth.link.pendingToken;
  if (!pendingToken) {
    return { ok: false, message: 'Missing connection token.', provider };
  }

  const uid = getFirebaseAuth().currentUser?.uid;
  const options = uid
    ? await prepareAssessOptions(uid, overrideOptions)
    : await readAssessOptionsFromFlow(overrideOptions);
  return finishTrackerConnection(provider, pendingToken, options);
}
