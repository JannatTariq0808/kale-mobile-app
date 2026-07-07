import * as Linking from 'expo-linking';

export type TrackerProvider = 'strava' | 'garmin';

export type TrackerConnectLink = {
  provider: TrackerProvider;
  status: 'connected' | 'error';
  pendingToken?: string;
  reason?: string;
};

export type ConnectTrackerRouteParams = {
  flow?: 'onboarding' | 'quarterly';
  activitiesSince?: string;
  syncPeriodLabel?: string;
  garminCapped?: boolean;
  errorMessage?: string;
  errorReason?: string;
  errorProvider?: TrackerProvider;
  /** Set when OAuth succeeded via deep link — finish claim + sync in-app. */
  pendingToken?: string;
  oauthProvider?: TrackerProvider;
  oauthStatus?: 'connected' | 'error';
};

function queryParam(
  params: Linking.QueryParams | null | undefined,
  key: string,
): string | undefined {
  const value = params?.[key];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

function providerFromPath(path: string | null, url: string): TrackerProvider | null {
  if (path?.includes('connect/strava') || url.includes('connect/strava')) return 'strava';
  if (path?.includes('connect/garmin') || url.includes('connect/garmin')) return 'garmin';
  return null;
}

/** Parse OAuth return URLs from kale.insure https or kale:// open-app connect paths. */
export function parseTrackerConnectLink(url: string): TrackerConnectLink | null {
  const { path, queryParams } = Linking.parse(url);
  const provider = providerFromPath(path, url);
  if (!provider) return null;

  const statusRaw = queryParam(queryParams, provider);
  const status = statusRaw === 'connected' ? 'connected' : statusRaw === 'error' ? 'error' : null;
  if (!status) return null;

  return {
    provider,
    status,
    pendingToken: queryParam(queryParams, 'pending'),
    reason: queryParam(queryParams, 'reason'),
  };
}

export function connectLinkToRouteParams(link: TrackerConnectLink): ConnectTrackerRouteParams {
  if (link.status === 'error') {
    return {
      errorProvider: link.provider,
      errorReason: link.reason,
      errorMessage: link.reason ?? 'Connection was declined or failed.',
      oauthProvider: link.provider,
      oauthStatus: 'error',
    };
  }

  return {
    oauthProvider: link.provider,
    oauthStatus: 'connected',
    pendingToken: link.pendingToken,
  };
}

export function routeParamsToConnectIssue(params: ConnectTrackerRouteParams) {
  if (!params.errorMessage && !params.errorReason) return null;
  const message =
    params.errorMessage ??
    params.errorReason ??
    'Could not connect. Please try again.';
  return { message, provider: params.errorProvider, reason: params.errorReason };
}

/** True when redirectUrl matches the OAuth result (kale:// or https open-app paths). */
export function oauthReturnMatches(resultUrl: string, returnUrl: string): boolean {
  if (resultUrl.startsWith(returnUrl)) return true;

  const parsedResult = Linking.parse(resultUrl);
  const parsedExpected = Linking.parse(returnUrl);
  const resultPath = parsedResult.path?.replace(/^\//, '') ?? '';
  const expectedPath = parsedExpected.path?.replace(/^\//, '') ?? '';

  const pathsMatch =
    resultPath.length > 0 &&
    expectedPath.length > 0 &&
    (resultPath === expectedPath ||
      resultPath.endsWith(expectedPath) ||
      expectedPath.endsWith(resultPath));

  if (pathsMatch) {
    const resultProvider = providerFromPath(resultPath, resultUrl);
    const expectedProvider = providerFromPath(expectedPath, returnUrl);
    if (!resultProvider || !expectedProvider || resultProvider === expectedProvider) {
      return true;
    }
  }

  try {
    const result = new URL(resultUrl);
    const expected = new URL(returnUrl);
    if (result.pathname === expected.pathname) {
      return true;
    }
    if (result.hostname === `www.${expected.hostname}`) {
      return resultUrl.startsWith(
        `${result.protocol}//www.${expected.hostname}${expected.pathname}`,
      );
    }
    if (`www.${result.hostname}` === expected.hostname) {
      return resultUrl.startsWith(
        `${result.protocol}//${expected.hostname.replace(/^www\./, '')}${expected.pathname}`,
      );
    }
  } catch {
    return false;
  }

  return false;
}

export function parseTrackerConnectLinkFromAuthResult(
  resultUrl: string,
  provider: TrackerProvider,
  returnUrl: string,
): TrackerConnectLink | null {
  if (!oauthReturnMatches(resultUrl, returnUrl)) {
    return null;
  }
  const link = parseTrackerConnectLink(resultUrl);
  if (!link || link.provider !== provider) return null;
  return link;
}
