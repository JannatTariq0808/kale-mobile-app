import { parseTrackerConnectLink } from '../../navigation/trackerLinking';

const inflightByPendingToken = new Map<string, Promise<unknown>>();

let trackerOAuthInProgress = false;
let lastConnectLinkUrl: string | null = null;

/** True while `openAuthSessionAsync` is in flight — deep link handler defers to connectTracker. */
export function setTrackerOAuthInProgress(inProgress: boolean): void {
  trackerOAuthInProgress = inProgress;
}

export function isTrackerOAuthInProgress(): boolean {
  return trackerOAuthInProgress;
}

/** Cache OAuth return URL from Linking before auth session resolves (dismiss race). */
export function recordConnectLinkUrl(url: string): void {
  if (parseTrackerConnectLink(url)) {
    lastConnectLinkUrl = url;
  }
}

export function consumeLastConnectLinkUrl(): string | null {
  const url = lastConnectLinkUrl;
  lastConnectLinkUrl = null;
  return url;
}

/** One claim/sync per OAuth pending token — avoids double claim from auth session + deep link. */
export function dedupeFinishTrackerConnection<T>(
  pendingToken: string,
  run: () => Promise<T>,
): Promise<T> {
  const existing = inflightByPendingToken.get(pendingToken) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = run().finally(() => {
    inflightByPendingToken.delete(pendingToken);
  });
  inflightByPendingToken.set(pendingToken, promise);
  return promise;
}

export function isPendingTokenInFlight(pendingToken: string): boolean {
  return inflightByPendingToken.has(pendingToken);
}
