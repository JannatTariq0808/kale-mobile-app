import type { IncomeProtectionRecord } from '../types/incomeProtection';

/**
 * Dev only: show the Income Protection tabs for any account, with the design's
 * example customer (Sam, 45, payment day the 10th, Level 5, £25 a month).
 * Set EXPO_PUBLIC_FORCE_IP_CUSTOMER=true in .env.local and restart Metro.
 * Ignored in release builds.
 */
export function forceIpCustomer(): boolean {
  if (!__DEV__) return false;
  const raw = process.env.EXPO_PUBLIC_FORCE_IP_CUSTOMER?.trim();
  return raw === 'true' || raw === '1';
}

export function demoIncomeProtectionRecord(): IncomeProtectionRecord {
  const coverStart = new Date(2026, 9, 10);
  return {
    prospectId: 'demo-prospect',
    route: 'estimate',
    level: 5,
    estimatedLevelUncapped: 4,
    month1Premium: 27,
    currentPremium: 25,
    realAgePremium: 30,
    coverAmount: 1800,
    deferredDays: 30,
    occupationCode: null,
    industryCode: null,
    status: 'active',
    policyId: 'KL-IP-204816',
    policyNumber: 'KL-IP-204816',
    coverStart,
    paymentConfirmed: true,
    paymentAt: coverStart,
    paymentDay: 10,
    priceHistory: [
      { label: 'month 1 price, quick estimate', amount: 27, appliesFrom: coverStart, paid: true },
      { label: 'October assessment', amount: 25, appliesFrom: new Date(2026, 10, 10), paid: false },
    ],
    updatedAt: coverStart,
  };
}
