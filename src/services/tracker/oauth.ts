import * as WebBrowser from 'expo-web-browser';
import {
  trackerOAuthReturnUrl,
  trackerOAuthStartUrl,
} from '../../config/kaleApi';
import type { TrackerConnectLink } from '../../navigation/trackerLinking';
import { parseTrackerConnectLink, parseTrackerConnectLinkFromAuthResult } from '../../navigation/trackerLinking';
import {
  consumeLastConnectLinkUrl,
  setTrackerOAuthInProgress,
} from './connectSession';
import { waitForConnectLink } from './waitForConnectLink';

WebBrowser.maybeCompleteAuthSession();

export type TrackerOAuthResult =
  | { ok: true; link: TrackerConnectLink }
  | { ok: false; reason: 'cancelled' | 'dismissed' | 'invalid' | 'error'; message?: string };

const OAUTH_REASON_MESSAGES: Record<string, string> = {
  invalid_state: 'Connection expired. Please try again.',
  token_exchange: 'Could not verify your account. Please try again.',
  access_denied: 'Access was not granted.',
  not_configured: 'This integration is not configured on the server.',
};

export function oauthReasonToMessage(reason: string | undefined, provider: string): string {
  if (!reason) return 'Connection was declined or failed.';
  return (
    OAUTH_REASON_MESSAGES[reason] ??
    `${provider === 'garmin' ? 'Garmin' : 'Strava'} connection failed (${reason}).`
  );
}

function resolveOAuthLink(
  url: string,
  provider: 'strava' | 'garmin',
  returnUrl: string,
): TrackerOAuthResult {
  const link =
    parseTrackerConnectLinkFromAuthResult(url, provider, returnUrl) ??
    parseTrackerConnectLink(url);

  if (!link || link.provider !== provider) {
    return {
      ok: false,
      reason: 'invalid',
      message: `Unexpected return URL. Expected ${returnUrl}`,
    };
  }

  if (link.status === 'error') {
    return {
      ok: false,
      reason: 'error',
      message: oauthReasonToMessage(link.reason, provider),
    };
  }

  if (!link.pendingToken) {
    return {
      ok: false,
      reason: 'invalid',
      message:
        'Missing connection token. Deploy the latest kale-website (callback must append pending= for /open-app/connect).',
    };
  }

  return { ok: true, link };
}

async function recoverLinkAfterDismiss(
  provider: 'strava' | 'garmin',
  returnUrl: string,
): Promise<TrackerOAuthResult> {
  const cached = consumeLastConnectLinkUrl();
  if (cached) {
    const resolved = resolveOAuthLink(cached, provider, returnUrl);
    if (resolved.ok || resolved.reason === 'error') {
      return resolved;
    }
  }

  const link = await waitForConnectLink(provider);
  if (!link) {
    return {
      ok: false,
      reason: 'dismissed',
      message:
        'Connection closed before Kale received the result. Try again — if it keeps happening, confirm kale-website is deployed with the latest OAuth callbacks.',
    };
  }

  if (link.status === 'error') {
    return {
      ok: false,
      reason: 'error',
      message: oauthReasonToMessage(link.reason, provider),
    };
  }

  if (!link.pendingToken) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Missing connection token after OAuth redirect.',
    };
  }

  return { ok: true, link };
}

export async function runTrackerOAuth(
  provider: 'strava' | 'garmin',
): Promise<TrackerOAuthResult> {
  const startUrl = trackerOAuthStartUrl(provider);
  const returnUrl = trackerOAuthReturnUrl(provider);

  if (__DEV__) {
    console.log('[tracker-oauth] start', { provider, startUrl, returnUrl });
  }

  setTrackerOAuthInProgress(true);
  try {
    const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl, {
      // Strava: don't reuse Safari/Chrome cookies — otherwise an existing Strava
      // login + prior Kale authorization can complete without showing any UI.
      preferEphemeralSession: provider === 'strava',
    });

    if (__DEV__) {
      console.log('[tracker-oauth] result', {
        provider,
        type: result.type,
        url: result.type === 'success' ? result.url : undefined,
      });
    }

    if (result.type === 'cancel') {
      return { ok: false, reason: 'cancelled', message: 'Connection cancelled.' };
    }

    if (result.type === 'dismiss') {
      if (__DEV__) {
        console.log('[tracker-oauth] dismiss — waiting for deep link fallback');
      }
      return recoverLinkAfterDismiss(provider, returnUrl);
    }

    if (result.type !== 'success' || !result.url) {
      return { ok: false, reason: 'error', message: 'OAuth did not complete.' };
    }

    return resolveOAuthLink(result.url, provider, returnUrl);
  } finally {
    setTrackerOAuthInProgress(false);
  }
}
