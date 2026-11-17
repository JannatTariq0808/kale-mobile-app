import { doc, getDoc } from 'firebase/firestore';
import type {
  IncomeProtectionRecord,
  IpPolicyStatus,
  IpPriceHistoryEntry,
  IpRoute,
} from '../../types/incomeProtection';
import { demoIncomeProtectionRecord, forceIpCustomer } from '../../config/incomeProtectionDev';
import { getFirebaseFirestore } from '../auth/firebaseApp';

type Raw = Record<string, unknown>;

function asRecord(value: unknown): Raw | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Raw) : null;
}

function asNumber(value: unknown): number | null {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function toDate(value: unknown): Date | null {
  if (!value) return null;
  const date =
    value instanceof Date
      ? value
      : typeof value === 'object' && 'toDate' in value
        ? (value as { toDate: () => Date }).toDate()
        : typeof value === 'string' || typeof value === 'number'
          ? new Date(value)
          : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function asRoute(value: unknown): IpRoute | null {
  return value === 'cardio' || value === 'estimate' ? value : null;
}

function asStatus(value: unknown): IpPolicyStatus {
  return value === 'paused' || value === 'payment_failed' || value === 'lapsed' ? value : 'active';
}

function parsePriceHistory(value: unknown): IpPriceHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  const entries: IpPriceHistoryEntry[] = [];
  for (const item of value) {
    const raw = asRecord(item);
    const amount = asNumber(raw?.amount);
    if (!raw || amount == null) continue;
    entries.push({
      label: asString(raw.label) ?? 'Price',
      amount,
      appliesFrom: toDate(raw.appliesFrom),
      paid: raw.paid === true,
    });
  }
  return entries;
}

/**
 * Builds the record from the users doc map and, when readable, the prospects doc.
 * Rated age and anything else that only Best should see is deliberately left out.
 */
export function buildIncomeProtectionRecord(ip: Raw, prospect: Raw | null): IncomeProtectionRecord {
  const paymentAt = toDate(prospect?.paymentAt);
  const coverStart = toDate(ip.coverStart) ?? paymentAt;
  const month1Premium = asNumber(ip.month1Premium);
  const paymentDayRaw = asNumber(ip.paymentDay);
  const paymentDay =
    paymentDayRaw != null && paymentDayRaw >= 1 && paymentDayRaw <= 31
      ? Math.round(paymentDayRaw)
      : coverStart
        ? coverStart.getDate()
        : null;
  const policyId = asString(ip.policyId) ?? asString(prospect?.policyId);
  const paymentStatus = asString(prospect?.paymentStatus);
  const paymentConfirmed =
    paymentStatus === 'success' ? true : paymentStatus === 'failed' ? false : null;

  return {
    prospectId: asString(ip.prospectId),
    route: asRoute(ip.route),
    level: asNumber(ip.level),
    estimatedLevelUncapped: asNumber(ip.estimatedLevelUncapped),
    month1Premium,
    currentPremium: asNumber(ip.currentPremium) ?? month1Premium,
    realAgePremium: asNumber(ip.standardPremium),
    coverAmount: asNumber(ip.coverAmount),
    deferredDays: asNumber(ip.deferredDays) ?? 30,
    occupationCode: asString(ip.occupationCode),
    industryCode: asString(ip.industryCode),
    status: asStatus(ip.status),
    policyId,
    policyNumber: asString(ip.policyNumber) ?? policyId,
    coverStart,
    paymentConfirmed,
    paymentAt,
    paymentDay,
    priceHistory: parsePriceHistory(ip.priceHistory),
    updatedAt: toDate(ip.updatedAt),
  };
}

/** Null when the user has no incomeProtection map, i.e. is not an IP customer. */
export async function fetchIncomeProtection(uid: string): Promise<IncomeProtectionRecord | null> {
  const db = getFirebaseFirestore();
  const userSnap = await getDoc(doc(db, 'users', uid));
  const ip = asRecord(userSnap.data()?.incomeProtection);
  if (!ip) return forceIpCustomer() ? demoIncomeProtectionRecord() : null;

  let prospect: Raw | null = null;
  const prospectId = asString(ip.prospectId);
  if (prospectId) {
    try {
      const prospectSnap = await getDoc(doc(db, 'prospects', prospectId));
      prospect = prospectSnap.exists() ? (prospectSnap.data() as Raw) : null;
    } catch (error) {
      if (__DEV__) {
        console.warn('[ip] prospects lookup failed (check Firestore rules)', error);
      }
    }
  }

  return buildIncomeProtectionRecord(ip, prospect);
}
