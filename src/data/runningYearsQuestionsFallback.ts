import type { RunningYearsQuestion } from '../../types/runningYearsQuestion';

export const RUNNING_YEARS_QUESTIONS_FALLBACK: RunningYearsQuestion[] = [
  {
    id: 'how-calculated',
    question: 'How is the Running Years number calculated?',
    answer:
      'We start from your VO₂max and age, then project two curves forward: one if you keep training, one if you do nothing. The big number is how many years until the keep-training curve crosses the still-running threshold (VO₂ 35). The +years gap is the extra time training buys you versus doing nothing.',
    sortOrder: 0,
    active: true,
  },
  {
    id: 'vo2-decline',
    question: 'Does VO₂max always fall with age?',
    answer:
      "Yes — for everyone, VO₂max declines as we get older. Training doesn't stop the decline, but it changes how fast you lose capacity. That's the gap this chart shows.",
    sortOrder: 1,
    active: true,
  },
  {
    id: 'not-promise',
    question: 'Is this a medical prediction?',
    answer:
      "No. It's a fitness projection built from your activity data — a band, not a promise. Your training moves it.",
    sortOrder: 2,
    active: true,
  },
];
