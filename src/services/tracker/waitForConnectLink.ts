import * as Linking from 'expo-linking';
import type { TrackerConnectLink, TrackerProvider } from '../../navigation/trackerLinking';
import { parseTrackerConnectLink } from '../../navigation/trackerLinking';

function linkFromUrl(url: string | null, provider: TrackerProvider): TrackerConnectLink | null {
  if (!url) return null;
  const link = parseTrackerConnectLink(url);
  if (!link || link.provider !== provider) return null;
  return link;
}

/** After auth browser dismisses, the app may still receive kale:// via Linking. */
export function waitForConnectLink(
  provider: TrackerProvider,
  timeoutMs = 3000,
): Promise<TrackerConnectLink | null> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (link: TrackerConnectLink | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      subscription.remove();
      resolve(link);
    };

    const tryUrl = (url: string | null) => {
      const link = linkFromUrl(url, provider);
      if (link) finish(link);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    void Linking.getInitialURL().then(tryUrl);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      tryUrl(url);
    });
  });
}
