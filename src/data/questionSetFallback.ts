import type { QuestionSetQuestion } from '../types/questionSet';

/** Minimal quiz copy when Firestore is empty or unreachable. */
export const QUESTION_SET_FALLBACK: Record<string, QuestionSetQuestion[]> = {
  onboarding: [
    {
      id: 'fallback-onboarding-1',
      text: 'Which single metric is the strongest predictor of long-term mortality risk?',
      options: ['Resting heart rate', 'VO₂max', 'Body weight', 'Step count'],
      correct: 1,
      order: 1,
      set: 'onboarding',
      status: 'Active',
      explanation:
        'VO₂max is the single strongest predictor of all-cause mortality across decades of longitudinal studies.',
      category: { label: 'Onboarding', type: 'General longevity' },
    },
  ],
  q2: [
    {
      id: 'fallback-q2-1',
      text: 'A large-scale study tracking 400,000 adults over 20 years found that regular multivitamin use was:',
      options: [
        'Strongly linked to a lower risk of death',
        'Beneficial mainly for adults over 65',
        'Not associated with a lower risk of death — and slightly higher in some analyses',
        'Equivalent in effect to eating two extra servings of vegetables daily',
      ],
      correct: 2,
      order: 1,
      set: 'q2',
      status: 'Active',
      explanation: '',
      category: { label: 'Q2', month: 6, type: 'Nutrition' },
    },
  ],
};

export function getQuestionSetFallback(setId: string): QuestionSetQuestion[] {
  return QUESTION_SET_FALLBACK[setId.toLowerCase()] ?? QUESTION_SET_FALLBACK.onboarding;
}
