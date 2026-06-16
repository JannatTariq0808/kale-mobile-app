/** Copy helpers for connect errors — mirrors kale-website/lib/strava/connect-issue-copy.ts */

const NO_ELIGIBLE_PATTERNS = [
  'No activities received',
  'No eligible activities',
  'No qualifying cardio activities',
  'No cycling or running activities',
];

export function shouldShowActivityRequirements(message: string): boolean {
  const lower = message.toLowerCase();
  return NO_ELIGIBLE_PATTERNS.some(
    (pattern) => message.includes(pattern) || lower.includes(pattern.toLowerCase()),
  );
}

export function connectIssueHeadline(
  message: string,
  provider?: 'strava' | 'garmin',
  oauthReason?: string | null,
): string {
  if (shouldShowActivityRequirements(message)) {
    return 'We were unable to find any valid runs or rides';
  }
  if (oauthReason === 'access_denied') {
    return provider === 'garmin' ? 'Garmin access was declined' : 'Strava access was declined';
  }
  if (oauthReason === 'athlete_limit') {
    return 'Strava connection unavailable';
  }
  if (message.toLowerCase().includes('popup')) {
    return 'Strava window blocked';
  }
  if (message.includes('Historical Data')) {
    return 'Garmin permissions incomplete';
  }
  if (message.includes('already synced') || message.toLowerCase().includes('duplicate backfill') || oauthReason === 'duplicate_backfill') {
    return 'Garmin already synced';
  }
  if (message.toLowerCase().includes('garmin')) {
    return 'Garmin connection failed';
  }
  if (message.toLowerCase().includes('strava')) {
    return 'Strava connection failed';
  }
  return "We couldn't finish connecting";
}

export type ConnectIssueContent = {
  headline: string;
  message: string;
  showActivityRequirements: boolean;
};

export function buildConnectIssue(
  message: string,
  provider?: 'strava' | 'garmin',
  oauthReason?: string | null,
): ConnectIssueContent {
  const reasonKey =
    oauthReason ?? (OAUTH_REASON_KEYS.has(message) ? message : null);
  const displayMessage =
    reasonKey && OAUTH_REASON_MESSAGES[reasonKey] ? OAUTH_REASON_MESSAGES[reasonKey] : message;

  return {
    headline: connectIssueHeadline(displayMessage, provider, reasonKey ?? oauthReason),
    message: displayMessage,
    showActivityRequirements: shouldShowActivityRequirements(displayMessage),
  };
}

const OAUTH_REASON_KEYS = new Set([
  'invalid_state',
  'token_exchange',
  'access_denied',
  'not_configured',
]);

const OAUTH_REASON_MESSAGES: Record<string, string> = {
  invalid_state: 'Connection expired. Please try again.',
  token_exchange: 'Could not verify your account. Please try again.',
  access_denied: 'Access was not granted.',
  not_configured: 'This integration is not configured on the server.',
};
