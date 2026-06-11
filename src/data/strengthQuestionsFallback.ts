import type { StrengthQuestion } from '../types/strengthQuestion';

/** Used when Firestore is empty or unavailable — lum-18 KaleFitnessStrengthLumen */
export const STRENGTH_QUESTIONS_FALLBACK: StrengthQuestion[] = [
  {
    id: 'relative-performance',
    question: 'What is Relative Performance (RP)?',
    answer:
      "RP is a percentile score graded for your age and gender. RP 78% means you're outperforming 78% of women aged 35–40 on this test.",
    sortOrder: 1,
    active: true,
  },
  {
    id: 'test-changes',
    question: 'Why does the strength test change each cycle?',
    answer:
      'Strength has many dimensions. Plank is a perfect starting point, but as you progress we add wall sit, press-ups and pull-ups to give a fuller picture.',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'older-tests',
    question: 'Do older tests still count toward my level?',
    answer: 'Yes. Your Strength Level blends all your tests so far, weighted by recency.',
    sortOrder: 3,
    active: true,
  },
];
