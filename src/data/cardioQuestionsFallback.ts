import type { CardioQuestion } from '../types/cardioQuestion';

export const CARDIO_QUESTIONS_FALLBACK: CardioQuestion[] = [
  {
    id: 'what-counts',
    question: 'What counts as a cardio assessment?',
    answer: 'We assess two activities: runs and cycles. Runs need to be at least 3K. Cycles need to be at least 5K.',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'cycle-hr-power',
    question: 'Why do cycles need heart rate and power meter data?',
    answer:
      "Distance and time alone don't tell us enough on a bike. Someone could roll down a big hill, clock a rapid 5K without pedalling, and land a level they haven't earned. Heart rate and power data show us the effort you actually put in, so your level reflects your real fitness. We also use these measures to help generate your VO₂ max data.",
    sortOrder: 2,
    active: true,
  },
  {
    id: 'best-longevity-level',
    question: 'How do I get the best possible Longevity Level?',
    answer:
      "Give it everything. We're looking for maximal efforts, because that's how we currently measure your overall fitness. If you're heading out for a 3K run, warm up first, then run it as fast as you can. That's what unlocks your maximum level.",
    sortOrder: 3,
    active: true,
  },
  {
    id: 'always-flat-out',
    question: 'Do I always have to go flat out?',
    answer:
      "For now, yes, maximal effort is what we measure. Over time we hope to develop a submaximal method of calculating fitness, so easier sessions count too. It's a difficult calculation and something we're actively working on.",
    sortOrder: 4,
    active: true,
  },
  {
    id: 'age-gender-fair',
    question: "Is it fair if I'm older, or comparing myself to someone of a different sex?",
    answer:
      'Yes. All cardio assessments are age and gender graded against recognised norms. Everyone is on a level playing field.',
    sortOrder: 5,
    active: true,
  },
];
