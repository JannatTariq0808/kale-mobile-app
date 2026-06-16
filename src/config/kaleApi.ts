import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

const DEFAULT_PRODUCTION_BASE = 'https://www.kale.insure';

function normalizeBaseUrl(raw: string): string {
  let url = raw.trim().replace(/\/$/, '');
  if (url === 'https://kale.insure' || url === 'http://kale.insure') {
    return 'https://www.kale.insure';
  }
  return url;
}

/** kale-website origin for OAuth + claim/assess APIs (staging localhost or production). */
export function getKaleApiBase(): string {
  const fromEnv =
    process.env.EXPO_PUBLIC_KALE_API_BASE ??
    process.env.EXPO_PUBLIC_KALE_API_BASE_URL;
  if (fromEnv?.trim()) {
    return normalizeBaseUrl(fromEnv.trim());
  }

  const fromConfig = Constants.expoConfig?.extra?.kaleApiBase as string | undefined;
  if (fromConfig?.trim()) {
    return normalizeBaseUrl(fromConfig.trim());
  }

  return DEFAULT_PRODUCTION_BASE;
}

export function kaleApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getKaleApiBase()}${normalizedPath}`;
}

export const TRACKER_CONNECT_PATHS = {
  strava: '/open-app/connect/strava',
  garmin: '/open-app/connect/garmin',
} as const;

export function trackerOAuthStartUrl(provider: 'strava' | 'garmin'): string {
  const next = TRACKER_CONNECT_PATHS[provider];
  return kaleApiUrl(`/api/oauth/${provider}/start?next=${encodeURIComponent(next)}`);
}

/**
 * OAuth return URL for expo-web-browser `openAuthSessionAsync`.
 * Always use the https /open-app bridge page so the auth session receives a
 * full URL with ?strava=connected&pending=… before any kale:// handoff.
 * (Android Custom Tabs used to close with `dismiss` on direct kale:// redirects;
 * iOS had the same flash-and-skip problem when Strava already had a session.)
 */
export function trackerOAuthReturnUrl(provider: 'strava' | 'garmin'): string {
  return kaleApiUrl(TRACKER_CONNECT_PATHS[provider]);
}
