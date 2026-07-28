import { collection, getDocs, query, where } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import type { Article } from '../../types/article';
import { getFirebaseFirestore } from '../auth/firebaseApp';

function pickString(data: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
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

function pickImageUrl(data: Record<string, unknown>): string | undefined {
  const raw = pickString(data, 'heroImage', 'hero_image', 'image', 'imageUrl', 'thumbnail');
  if (!raw) return undefined;
  const normalized = raw.startsWith('//') ? `https:${raw}` : raw;
  if (!/^https?:\/\//i.test(normalized)) return undefined;
  return normalized;
}

function isPublished(data: Record<string, unknown>): boolean {
  const status = pickString(data, 'status').toLowerCase();
  if (status) return status === 'published';
  return data.published === true || data.isPublished === true;
}

function mapArticleDoc(id: string, data: Record<string, unknown>): Article | null {
  if (!isPublished(data)) return null;

  const slug = pickString(data, 'slug');
  const title = pickString(data, 'title');
  if (!slug || !title) return null;

  const publishedAtMs =
    parseTimestampMs(data.publishedAt) ??
    parseTimestampMs(data.published_at) ??
    parseTimestampMs(data.createdAt) ??
    parseTimestampMs(data.created_at) ??
    0;

  const readTime = pickString(data, 'readTime', 'read_time') || '5 min read';
  const author = pickString(data, 'author') || 'Kale Editorial';

  return {
    id,
    slug,
    title,
    excerpt: pickString(data, 'excerpt', 'summary'),
    author,
    category: pickString(data, 'category') || 'Longevity Science',
    readTime,
    heroImage: pickImageUrl(data),
    publishedAtMs,
  };
}

export async function fetchArticles(): Promise<Article[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const snap = await getDocs(
      query(
        collection(getFirebaseFirestore(), 'articles'),
        where('status', '==', 'Published'),
      ),
    );
    const articles = snap.docs
      .map((docSnap) => mapArticleDoc(docSnap.id, docSnap.data() as Record<string, unknown>))
      .filter((item): item is Article => item != null)
      .sort((a, b) => b.publishedAtMs - a.publishedAtMs);

    return articles;
  } catch (error) {
    if (__DEV__) {
      console.warn('[articles] fetchArticles failed', error);
    }
    return [];
  }
}
