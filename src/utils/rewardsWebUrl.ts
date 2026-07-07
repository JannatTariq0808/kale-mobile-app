import { getKaleApiBase } from '../config/kaleApi';

/** Canonical Kale Store URL on kale.insure. */
export function rewardsStoreUrl(): string {
  return `${getKaleApiBase()}/rewards`;
}

/** Product detail page — works without sign-in; slug identifies the reward. */
export function rewardsProductUrl(slug: string): string {
  const trimmed = slug.trim();
  if (!trimmed) return rewardsStoreUrl();
  return `${getKaleApiBase()}/rewards/product/${encodeURIComponent(trimmed)}`;
}

export function slugFromRewardsProductUrl(productUrl: string): string | null {
  try {
    const url = new URL(productUrl);
    const match = url.pathname.match(/\/rewards\/product\/([^/]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    const match = productUrl.match(/\/rewards\/product\/([^/?#]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}
