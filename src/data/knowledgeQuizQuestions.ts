// Design: kale-mobile-design — lum-07 KaleQuizQuestionLumen (screens/KaleLumenOnboarding.jsx)

export type QuizOption = {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctIndex: number;
  explanationCorrect: string;
  explanationWrong: {
    highlight: string;
    text: string;
  };
};

export const KNOWLEDGE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'mortality-metric',
    prompt: 'Which single metric is the strongest predictor of long-term mortality risk?',
    options: [
      { letter: 'A', text: 'Resting heart rate' },
      { letter: 'B', text: 'VO₂max' },
      { letter: 'C', text: 'Body weight' },
      { letter: 'D', text: 'Step count' },
    ],
    correctIndex: 1,
    explanationCorrect:
      'VO₂max is the single strongest predictor of all-cause mortality across decades of longitudinal studies.',
    explanationWrong: {
      highlight: 'VO₂max',
      text: ' — the strongest predictor of all-cause mortality across decades of studies.',
    },
  },
];
