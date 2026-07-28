import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';

export type QuoteRecord = {
  id: string;
  status: string;
  answers: Record<string, unknown>;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toQuoteRecord(id: string, data: Record<string, unknown>): QuoteRecord {
  const answers =
    data.answers && typeof data.answers === 'object'
      ? (data.answers as Record<string, unknown>)
      : {};
  return {
    id,
    status: typeof data.status === 'string' ? data.status : '',
    answers,
  };
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
  } catch {
    /* fall through */
  }
  return null;
}

/**
 * Quote for home / policy display.
 * Rules only allow email-scoped reads — do not query by uid.
 */
export async function fetchQuoteRecord(uid: string): Promise<QuoteRecord | null> {
  const db = getFirebaseFirestore();
  const email = await resolveAuthEmail(uid);

  if (!email) {
    if (__DEV__) {
      console.warn('[quotes] fetchQuoteRecord: no auth/user email');
    }
    return null;
  }

  try {
    const snap = await getDocs(query(collection(db, 'quotes'), where('email', '==', email)));
    const records = snap.docs.map((item) =>
      toQuoteRecord(item.id, item.data() as Record<string, unknown>),
    );
    const active = records.find((item) => item.status === 'active');
    return active ?? records[0] ?? null;
  } catch (error) {
    if (__DEV__) {
      console.warn('[quotes] fetchQuoteRecord email query failed', error);
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
