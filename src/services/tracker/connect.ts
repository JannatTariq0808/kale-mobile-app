import type { ConnectionBrand } from '../../components/lumen/ConnectionBrandIcon';
import type { TrackerProvider } from '../../navigation/trackerLinking';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { fetchHealthProfileForAssess } from '../user/fetchHealthProfile';
import { assessStravaActivities } from './assess';
import { claimGarminConnection, claimStravaConnection } from './claim';
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

async function finishProviderConnection(
  provider: TrackerProvider,
  pendingToken: string,
): Promise<ConnectTrackerResult> {
  const idToken = await getIdToken();

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

    const assess = await assessStravaActivities(idToken, profile);
    if (!assess.ok) {
      return { ok: false, message: assess.message, provider: 'strava' };
    }

    return { ok: true, provider: 'strava' };
  }

  const claim = await claimGarminConnection(idToken, pendingToken);
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
): Promise<ConnectTrackerResult> {
  return dedupeFinishTrackerConnection(pendingToken, () =>
    finishProviderConnection(provider, pendingToken),
  );
}

export async function connectTracker(brand: ConnectionBrand): Promise<ConnectTrackerResult> {
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

  return finishTrackerConnection(provider, pendingToken);
}
