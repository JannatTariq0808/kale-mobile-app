import { doc, getDoc } from 'firebase/firestore';
import { fetchActiveQuote } from '../quotes/fetchActiveQuote';
import { readQuoteKalettes, type QuoteKalettes } from '../quotes/readQuoteKalettes';
import { getFirebaseFirestore } from '../auth/firebaseApp';

async function fetchLegacyUserPoints(uid: string): Promise<QuoteKalettes> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'userPoints', uid));
    if (!snap.exists()) {
      return { balance: 0, pending: 0 };
    }

    const data = snap.data();
    return readQuoteKalettes({
      kalettesBalance: data.balance,
      kalettesPending: data.pending,
    });
  } catch {
    return { balance: 0, pending: 0 };
  }
}

/**
 * Spendable + pending Kalettes for the user's active quote.
 * Falls back to legacy `userPoints/{uid}` when quote fields are unset.
 */
export async function fetchQuoteKalettes(uid: string): Promise<QuoteKalettes> {
  const quote = await fetchActiveQuote(uid);
  if (!quote) {
    return fetchLegacyUserPoints(uid);
  }

  const fromQuote = {
    balance: quote.kalettesBalance,
    pending: quote.kalettesPending,
  };

  if (fromQuote.balance > 0 || fromQuote.pending > 0) {
    return fromQuote;
  }

  return fetchLegacyUserPoints(uid);
}
