import { collection, getDocs, query } from 'firebase/firestore';
import { getFirebaseProjectId, isFirebaseConfigured } from '../../config/firebase';
import { REWARDS_PRODUCTS_FALLBACK } from '../../data/rewardsProductsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type {
  RewardsProduct,
  RewardsProductCategory,
  RewardsProductTag,
  RewardsProductsFetchResult,
  RewardsProductsMeta,
} from '../../types/rewardsProduct';

const VALID_TAGS = new Set<RewardsProductTag>(['GEAR', 'OFFER', 'ASSESSMENT', 'COACHING']);

const CATEGORY_ALIASES: Record<string, RewardsProductCategory> = {
  gear: 'Gear',
  'partner offers': 'Partner offers',
  'partner-offers': 'Partner offers',
  partner_offers: 'Partner offers',
  partner: 'Partner offers',
  offer: 'Partner offers',
  offers: 'Partner offers',
  'health assessments': 'Health assessments',
  'health-assessments': 'Health assessments',
  health_assessments: 'Health assessments',
  assessment: 'Health assessments',
  assessments: 'Health assessments',
  health: 'Health assessments',
  coaching: 'Coaching',
  coach: 'Coaching',
  training: 'Coaching',
  cycling: 'Gear',
  running: 'Gear',
  fitness: 'Gear',
};

const CATEGORY_TO_TAG: Record<RewardsProductCategory, RewardsProductTag> = {
  Gear: 'GEAR',
  'Partner offers': 'OFFER',
  'Health assessments': 'ASSESSMENT',
  Coaching: 'COACHING',
};

function pickString(data: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function pickNumber(data: Record<string, unknown>, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function pickImageUrl(data: Record<string, unknown>): string | undefined {
  const raw = pickString(data, 'image', 'imageUrl', 'imageURL', 'photo', 'thumbnail', 'thumb');
  if (!raw) return undefined;

  const normalized = raw.startsWith('//') ? `https:${raw}` : raw;
  if (!/^https?:\/\//i.test(normalized)) return undefined;

  return normalized;
}

function titleFromSlug(raw: string): string {
  return raw
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseTimestampMs(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === 'object') {
    const record = value as { toMillis?: () => number; seconds?: number; _seconds?: number };
    if (typeof record.toMillis === 'function') return record.toMillis();
    const seconds = record.seconds ?? record._seconds;
    if (typeof seconds === 'number') return seconds * 1000;
  }
  return null;
}

function parseCreatedAtMs(data: Record<string, unknown>): number {
  return (
    parseTimestampMs(data.createdAt) ??
    parseTimestampMs(data.updatedAt) ??
    parseTimestampMs(data.publishedAt) ??
    0
  );
}

function normalizeCategory(raw: string): RewardsProductCategory {
  const trimmed = raw.trim();
  if (!trimmed) return 'Partner offers';

  const alias = CATEGORY_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;

  const values = Object.values(CATEGORY_ALIASES);
  if (values.includes(trimmed as RewardsProductCategory)) {
    return trimmed as RewardsProductCategory;
  }

  return 'Partner offers';
}

function normalizeTag(raw: string, category: RewardsProductCategory): RewardsProductTag {
  const upper = raw.trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (VALID_TAGS.has(upper as RewardsProductTag)) return upper as RewardsProductTag;
  return CATEGORY_TO_TAG[category];
}

function parseTopup(data: Record<string, unknown>): number | null {
  const value = pickNumber(data, 'topup', 'topUp', 'gbpTopup');
  if (value == null || value <= 0) return null;
  return value;
}

function parseDiscount(data: Record<string, unknown>): string | undefined {
  const text = pickString(data, 'discount', 'discountLabel');
  if (text) return text;

  const pct = pickNumber(data, 'discountPct', 'discountPercent', 'discount_pct');
  if (pct != null && pct > 0) return `${pct}%`;

  return undefined;
}

function mapDoc(id: string, data: Record<string, unknown>): RewardsProduct | null {
  const slug = pickString(data, 'slug');
  const title = pickString(data, 'title', 'name') || titleFromSlug(slug) || titleFromSlug(id);
  const brand =
    pickString(data, 'brand', 'vendor', 'manufacturer') ||
    pickString(data, 'activity') ||
    title.split(' ')[0] ||
    'Kale';
  const categoryRaw = pickString(data, 'category', 'cat', 'type');
  const category = normalizeCategory(categoryRaw);
  const productUrl =
    pickString(data, 'productUrl', 'url', 'link', 'webUrl', 'href') ||
    (slug ? `https://www.kale.insure/rewards/product/${slug}` : '') ||
    `https://www.kale.insure/rewards/product/${id}`;

  const pts = pickNumber(data, 'pts', 'points', 'pricePoints') ?? 0;
  const topup = parseTopup(data);
  const sortOrder = pickNumber(data, 'sortOrder', 'order', 'sort') ?? 999;
  const createdAtMs = parseCreatedAtMs(data);
  const active = data.active !== false && data.published !== false && data.isPublished !== false;
  const tagRaw = pickString(data, 'tag', 'label');
  const discount = parseDiscount(data);
  const imageUrl = pickImageUrl(data);

  if (!title || !active) return null;

  return {
    id,
    title,
    brand,
    pts,
    topup,
    category,
    tag: normalizeTag(tagRaw, category),
    discount,
    imageUrl,
    productUrl,
    sortOrder,
    createdAtMs,
    active,
  };
}

function sortProducts(items: RewardsProduct[]): RewardsProduct[] {
  return [...items].sort((a, b) => {
    if (b.createdAtMs !== a.createdAtMs) return b.createdAtMs - a.createdAtMs;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Reads `rewardsProducts` from Firestore only (no demo merge).
 * Fallback demo cards are used only when Firebase env vars are missing.
 */
let cachedResult: RewardsProductsFetchResult | null = null;
let inflight: Promise<RewardsProductsFetchResult> | null = null;

export function getCachedRewardsProducts(): RewardsProductsFetchResult | null {
  return cachedResult;
}

async function loadRewardsProducts(): Promise<RewardsProductsFetchResult> {
  const projectId = isFirebaseConfigured() ? getFirebaseProjectId() : null;

  if (!isFirebaseConfigured()) {
    return {
      items: sortProducts(REWARDS_PRODUCTS_FALLBACK),
      meta: {
        source: 'fallback',
        projectId: null,
        firestoreDocCount: 0,
        mappedCount: REWARDS_PRODUCTS_FALLBACK.length,
      },
    };
  }

  try {
    const snap = await getDocs(query(collection(getFirebaseFirestore(), 'rewardsProducts')));

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is RewardsProduct => item !== null);

    const meta: RewardsProductsMeta = {
      source: 'firestore',
      projectId,
      firestoreDocCount: snap.docs.length,
      mappedCount: items.length,
    };

    return { items: sortProducts(items), meta };
  } catch {
    return {
      items: [],
      meta: {
        source: 'error',
        projectId,
        firestoreDocCount: 0,
        mappedCount: 0,
      },
    };
  }
}

export async function fetchRewardsProducts(): Promise<RewardsProductsFetchResult> {
  if (cachedResult) return cachedResult;
  if (inflight) return inflight;

  inflight = loadRewardsProducts().then((result) => {
    cachedResult = result;
    inflight = null;
    return result;
  });

  return inflight;
}
