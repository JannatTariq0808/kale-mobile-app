import type { KalettesQuestion } from '../types/kalettesQuestion';

/** Used when Firestore is empty or unavailable — lum-16 KaleRewardsBalanceLumen */
export const KALETTES_QUESTIONS_FALLBACK: KalettesQuestion[] = [
  {
    id: 'how-to-earn',
    question: 'How do I earn Kalettes?',
    answer:
      'Every quarterly assessment you complete pays out a points cycle, calculated from your Longevity Level. Level 6 earns 6% of your annual premium each quarter, paid as points.',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'why-assessment-to-bank',
    question: 'Why must I complete an assessment to bank?',
    answer:
      "Banking only on assessment makes the link between training and reward concrete. Skip one and your accrued points reset — but your fitness doesn't, so the next cycle pays even more.",
    sortOrder: 2,
    active: true,
  },
  {
    id: 'when-expire',
    question: 'When do points expire?',
    answer:
      "Banked points last 24 months from the date they were awarded. We'll nudge you well before any expire.",
    sortOrder: 3,
    active: true,
  },
  {
    id: 'gift-points',
    question: 'Can I gift my points?',
    answer:
      "Not yet — but it's coming. For now, points can only be redeemed at kale.co/rewards by the policyholder.",
    sortOrder: 4,
    active: true,
  },
];
