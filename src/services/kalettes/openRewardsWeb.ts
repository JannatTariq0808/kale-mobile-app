import * as Linking from 'expo-linking';
import { kaleApiUrl } from '../../config/kaleApi';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { kaleApiFetch } from '../tracker/kaleApiClient';
import { rewardsProductUrl, rewardsStoreUrl, slugFromRewardsProductUrl } from '../../utils/rewardsWebUrl';

export type OpenRewardsWebOptions = {
  /** Product slug from Firestore `rewardsProducts.slug`. */
  slug?: string | null;
  /** Full product URL — slug is extracted when `slug` is omitted. */
  productUrl?: string | null;
};

function resolveSlug(options?: OpenRewardsWebOptions): string | null {
  const fromSlug = options?.slug?.trim();
  if (fromSlug) return fromSlug;
  if (options?.productUrl) {
    return slugFromRewardsProductUrl(options.productUrl);
  }
  return null;
}

function fallbackUrl(slug: string | null): string {
  return slug ? rewardsProductUrl(slug) : rewardsStoreUrl();
}

/**
 * Opens kale.insure rewards in the device browser.
 * When signed in, creates a one-time handoff so the website session matches the app user
 * and lands on the tapped product.
 */
export async function openRewardsWeb(options?: OpenRewardsWebOptions): Promise<void> {
  const slug = resolveSlug(options);
  const plainUrl = fallbackUrl(slug);

  const user = getFirebaseAuth().currentUser;
  if (!user) {
    await Linking.openURL(plainUrl);
    return;
  }

  try {
    const idToken = await user.getIdToken();
    const res = await kaleApiFetch('/api/auth/mobile-handoff/create', idToken, {
      method: 'POST',
      body: JSON.stringify({ slug }),
    });

    if (!res.ok) {
      if (__DEV__) {
        const body = await res.text().catch(() => '');
        console.warn('[kalettes] handoff create failed', res.status, body);
      }
      await Linking.openURL(plainUrl);
      return;
    }

    const data = (await res.json()) as { handoffId?: string };
    if (!data.handoffId?.trim()) {
      await Linking.openURL(plainUrl);
      return;
    }

    const handoffUrl = kaleApiUrl(
      `/open-app/rewards?handoff=${encodeURIComponent(data.handoffId.trim())}`,
    );
    await Linking.openURL(handoffUrl);
  } catch (error) {
    if (__DEV__) {
      console.warn('[kalettes] openRewardsWeb failed', error);
    }
    await Linking.openURL(plainUrl);
  }
}
