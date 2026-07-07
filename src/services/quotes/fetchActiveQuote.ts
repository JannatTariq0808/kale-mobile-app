import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { parseMonthlyPremium } from '../../utils/kalettes';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { readQuoteKalettes } from './readQuoteKalettes';

export type PolicyQuote = {
  id: string;
  uid: string;
  monthlyPremiumGbp: number;
  longevityLevel: number | null;
  policyId: string | null;
  status: string;
  kalettesBalance: number;
  kalettesPending: number;
};

function readLevel(value: unknown): number | null {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
}

function parseQuote(id: string, data: Record<string, unknown>): PolicyQuote | null {
  const uid = typeof data.uid === 'string' ? data.uid.trim() : null;
  if (!uid) return null;

  const answers =
    data.answers && typeof data.answers === 'object'
      ? (data.answers as Record<string, unknown>)
      : {};

  const monthlyPremiumGbp = parseMonthlyPremium(
    answers.final_premium ?? answers.kale_premium ?? data.final_premium,
  );
  if (!monthlyPremiumGbp) return null;

  const longevityLevel =
    readLevel(answers.longevity_level) ?? readLevel(data.longevity_level) ?? null;

  const kalettes = readQuoteKalettes(data);

  return {
    id,
    uid,
    monthlyPremiumGbp,
    longevityLevel,
    policyId: typeof data.policyId === 'string' ? data.policyId : null,
    status: typeof data.status === 'string' ? data.status : '',
    kalettesBalance: kalettes.balance,
    kalettesPending: kalettes.pending,
  };
}

/** Active policy quote for a signed-in user. No quote → not a policy holder with a premium. */
export async function fetchActiveQuote(uid: string): Promise<PolicyQuote | null> {
  if (!isFirebaseConfigured()) return null;

  const db = getFirebaseFirestore();

  // Works when quote doc id === Firebase uid (your current rules: quoteId == auth.uid).
  try {
    const directSnap = await getDoc(doc(db, 'quotes', uid));
    if (directSnap.exists()) {
      const direct = parseQuote(directSnap.id, directSnap.data() as Record<string, unknown>);
      if (direct) return direct;
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] fetchActiveQuote getDoc failed', error);
    }
  }

  // Works when quote doc id is auto-generated but `uid` field matches (needs list rule on uid).
  try {
    const snap = await getDocs(query(collection(db, 'quotes'), where('uid', '==', uid)));

    const quotes = snap.docs
      .map((item) => parseQuote(item.id, item.data() as Record<string, unknown>))
      .filter((item): item is PolicyQuote => item !== null);

    const active = quotes.filter((item) => item.status === 'active');
    return active[0] ?? quotes[0] ?? null;
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] fetchActiveQuote query failed', error);
    }
    return null;
  }
}
