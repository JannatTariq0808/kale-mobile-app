import { fetchQuoteKalettes } from './fetchQuoteKalettes';

/** Spendable Kalettes on the user's active quote (`kalettesBalance`). */
export async function fetchPointsBalance(uid: string): Promise<number> {
  const kalettes = await fetchQuoteKalettes(uid);
  return kalettes.balance;
}
