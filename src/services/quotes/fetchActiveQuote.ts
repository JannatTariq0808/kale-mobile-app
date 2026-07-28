import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { parseMonthlyPremium } from '../../utils/kalettes';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';
import { readQuoteKalettes } from './readQuoteKalettes';

export type PolicyQuote = {
  id: string;
  uid: string;
  email: string | null;
  monthlyPremiumGbp: number;
  longevityLevel: number | null;
  policyId: string | null;
  status: string;
  kalettesBalance: number;
  kalettesPending: number;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readLevel(value: unknown): number | null {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
}

function parseQuote(
  id: string,
  data: Record<string, unknown>,
  fallbackUid: string,
): PolicyQuote | null {
  const answers =
    data.answers && typeof data.answers === 'object'
      ? (data.answers as Record<string, unknown>)
      : {};

  const monthlyPremiumGbp =
    parseMonthlyPremium(
      answers.final_premium ?? answers.kale_premium ?? data.final_premium,
    ) ?? 0;

  const kalettes = readQuoteKalettes(data);
  const status = typeof data.status === 'string' ? data.status : '';
  // Keep quotes that have premium, points, or an active policy — don't drop for premium-only parse fails.
  if (
    monthlyPremiumGbp <= 0 &&
    kalettes.balance <= 0 &&
    kalettes.pending <= 0 &&
    status !== 'active'
  ) {
    return null;
  }

  const longevityLevel =
    readLevel(answers.longevity_level) ?? readLevel(data.longevity_level) ?? null;

  const uid =
    typeof data.uid === 'string' && data.uid.trim() ? data.uid.trim() : fallbackUid;
  const email =
    typeof data.email === 'string' && data.email.trim()
      ? normalizeEmail(data.email)
      : null;

  return {
    id,
    uid,
    email,
    monthlyPremiumGbp,
    longevityLevel,
    policyId: typeof data.policyId === 'string' ? data.policyId : null,
    status,
    kalettesBalance: kalettes.balance,
    kalettesPending: kalettes.pending,
  };
}

function pickBestQuote(quotes: PolicyQuote[]): PolicyQuote | null {
  if (quotes.length === 0) return null;
  const active = quotes.filter((item) => item.status === 'active');
  if (active.length > 0) return active[0] ?? null;
  return quotes[0] ?? null;
}

async function resolveAuthEmail(uid: string): Promise<string | null> {
  const authEmail = getFirebaseAuth().currentUser?.email;
  if (authEmail?.trim()) return normalizeEmail(authEmail);

  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    const fromDoc = snap.data()?.email;
    if (typeof fromDoc === 'string' && fromDoc.trim()) {
      return normalizeEmail(fromDoc);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] resolveAuthEmail users lookup failed', error);
    }
  }
  return null;
}

/**
 * Active policy quote for Kalettes / premium.
 * Firestore rules only allow quote reads when `quotes.email == auth.token.email`.
 * Do not fall back to `quotes/{uid}` or `where('uid'==…)` — those are denied by rules
 * (and getDoc of a missing uid doc also denies because `resource.data` is null).
 */
export async function fetchActiveQuote(uid: string): Promise<PolicyQuote | null> {
  if (!isFirebaseConfigured()) return null;

  const db = getFirebaseFirestore();
  const email = await resolveAuthEmail(uid);

  if (!email) {
    if (__DEV__) {
      console.warn('[quotes] fetchActiveQuote: no auth/user email — cannot read quotes');
    }
    return null;
  }

  try {
    const snap = await getDocs(query(collection(db, 'quotes'), where('email', '==', email)));
    const parsed = snap.docs.map((item) => ({
      id: item.id,
      data: item.data() as Record<string, unknown>,
      quote: parseQuote(item.id, item.data() as Record<string, unknown>, uid),
    }));

    const quotes = parsed
      .map((item) => item.quote)
      .filter((item): item is PolicyQuote => item !== null);

    const chosen = pickBestQuote(quotes);
    if (chosen) {
      if (__DEV__) {
        console.log('[quotes] fetchActiveQuote by email', {
          email,
          quoteId: chosen.id,
          kalettesBalance: chosen.kalettesBalance,
          kalettesPending: chosen.kalettesPending,
        });
      }
      return chosen;
    }

    if (__DEV__ && snap.docs.length > 0) {
      console.warn('[quotes] fetchActiveQuote: docs found but none parsed (check premium fields)', {
        email,
        docIds: snap.docs.map((d) => d.id),
        premiums: parsed.map((item) => ({
          id: item.id,
          final_premium: (item.data.answers as Record<string, unknown> | undefined)?.final_premium,
          kale_premium: (item.data.answers as Record<string, unknown> | undefined)?.kale_premium,
          status: item.data.status,
          kalettesPending: item.data.kalettesPending,
          kalettesBalance: item.data.kalettesBalance,
        })),
      });
    } else if (__DEV__) {
      console.log('[quotes] fetchActiveQuote: no quotes for email', email);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] fetchActiveQuote email query failed', error);
    }
  }

  return null;
}
