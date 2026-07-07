import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';

export type QuoteRecord = {
  status: string;
  answers: Record<string, unknown>;
};

export async function fetchQuoteRecord(uid: string): Promise<QuoteRecord | null> {
  const db = getFirebaseFirestore();

  try {
    const directSnap = await getDoc(doc(db, 'quotes', uid));
    if (directSnap.exists()) {
      const data = directSnap.data() as Record<string, unknown>;
      const answers =
        data.answers && typeof data.answers === 'object'
          ? (data.answers as Record<string, unknown>)
          : {};
      return {
        status: typeof data.status === 'string' ? data.status : '',
        answers,
      };
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] fetchQuoteRecord getDoc failed', error);
    }
  }

  try {
    const snap = await getDocs(query(collection(db, 'quotes'), where('uid', '==', uid)));
    const records = snap.docs.map((item) => {
      const data = item.data() as Record<string, unknown>;
      const answers =
        data.answers && typeof data.answers === 'object'
          ? (data.answers as Record<string, unknown>)
          : {};
      return {
        status: typeof data.status === 'string' ? data.status : '',
        answers,
      };
    });

    const active = records.find((item) => item.status === 'active');
    return active ?? records[0] ?? null;
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] fetchQuoteRecord query failed', error);
    }
    return null;
  }
}

export function readPolicyTermYears(answers: Record<string, unknown>): number | null {
  const raw = answers.policy_term_in_year;
  const parsed =
    typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
}

export function readCoverType(answers: Record<string, unknown>): string | null {
  if (typeof answers.cover_type !== 'string') return null;
  const trimmed = answers.cover_type.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function hasActivePolicy(answers: Record<string, unknown>, quoteStatus: string): boolean {
  const policyId = answers.policy_id;
  const policyStatus = answers.policy_status;
  if (typeof policyId === 'string' && policyId.length > 0 && policyStatus === 'active') {
    return true;
  }
  return quoteStatus === 'active';
}
