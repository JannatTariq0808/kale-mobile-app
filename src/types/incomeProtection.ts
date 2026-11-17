/** Income Protection customer record — users/{uid}.incomeProtection plus prospects/{prospectId}. */

export type IpRoute = 'cardio' | 'estimate';

/**
 * Policy state as the app shows it. Best is the source of truth: the backend writes
 * this field from Best's webhooks (payment failed, lapse, claim) and from approved pauses.
 */
export type IpPolicyStatus = 'active' | 'paused' | 'payment_failed' | 'lapsed';

export type IpPriceHistoryEntry = {
  /** e.g. "October assessment" or "month 1 price, quick estimate" */
  label: string;
  amount: number;
  /** First payment the price applied to */
  appliesFrom: Date | null;
  paid: boolean;
};

export type IncomeProtectionRecord = {
  prospectId: string | null;
  route: IpRoute | null;
  /** Level the first payment was priced at (1 to 10) */
  level: number | null;
  estimatedLevelUncapped: number | null;
  /** First monthly price, £ */
  month1Premium: number | null;
  /** Latest monthly price Best returned, £. Falls back to month1Premium. */
  currentPremium: number | null;
  /**
   * Price at the customer's real age, £. Shown only as "priced on your real age";
   * the words "standard price" are never used in the app.
   */
  realAgePremium: number | null;
  /** Monthly payout, £ */
  coverAmount: number | null;
  /** Wait before payments start, days (always 30 for now) */
  deferredDays: number;
  occupationCode: string | null;
  industryCode: string | null;
  status: IpPolicyStatus;
  /** Best's policy ID from the payment webhook */
  policyId: string | null;
  /** Human policy number, if the backend has stored one; else policyId */
  policyNumber: string | null;
  coverStart: Date | null;
  /**
   * Best's payment webhook outcome for month 1, from prospects/{prospectId}:
   * true = paid, false = failed, null = not confirmed yet (or not readable).
   */
  paymentConfirmed: boolean | null;
  /** When Best confirmed payment */
  paymentAt: Date | null;
  /** Day of the month Best takes payment (1 to 31) */
  paymentDay: number | null;
  priceHistory: IpPriceHistoryEntry[];
  updatedAt: Date | null;
};
