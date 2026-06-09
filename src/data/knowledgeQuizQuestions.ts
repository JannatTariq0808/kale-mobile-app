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
  {
    id: 'healthspan',
    prompt: 'Healthspan refers to the years you live…',
    options: [
      { letter: 'A', text: 'With chronic disease managed by medication' },
      { letter: 'B', text: 'Healthy, active, and largely free of disability' },
      { letter: 'C', text: 'Without ever visiting a doctor' },
      { letter: 'D', text: 'At your maximum possible lifespan' },
    ],
    correctIndex: 1,
    explanationCorrect:
      'Healthspan is the period of life spent in good health — not just how long you live, but how well.',
    explanationWrong: {
      highlight: 'healthy, active, and largely free of disability',
      text: ' — healthspan is about quality of life years, not lifespan alone.',
    },
  },
  {
    id: 'zone-2',
    prompt: 'Zone-2 cardio training is best described as…',
    options: [
      { letter: 'A', text: 'All-out intervals with long rests' },
      { letter: 'B', text: 'Easy effort where you can still hold a conversation' },
      { letter: 'C', text: 'Maximum heart rate for 20+ minutes' },
      { letter: 'D', text: 'Strength work with short rest periods' },
    ],
    correctIndex: 1,
    explanationCorrect:
      'Zone 2 builds mitochondrial density and aerobic base — sustainable, conversational pace is the hallmark.',
    explanationWrong: {
      highlight: 'easy effort where you can still hold a conversation',
      text: ' — that conversational pace is the signature of true Zone-2 work.',
    },
  },
  {
    id: 'sleep',
    prompt: 'For recovery and longevity, consistent sleep timing matters because it…',
    options: [
      { letter: 'A', text: 'Eliminates the need for exercise' },
      { letter: 'B', text: 'Anchors your circadian rhythm and hormone cycles' },
      { letter: 'C', text: 'Replaces nutrition as the main health lever' },
      { letter: 'D', text: 'Only affects mental health, not physical' },
    ],
    correctIndex: 1,
    explanationCorrect:
      'Regular sleep-wake timing strengthens circadian alignment — a foundation for recovery, mood, and metabolic health.',
    explanationWrong: {
      highlight: 'anchors your circadian rhythm and hormone cycles',
      text: ' — regular timing is one of the most underrated longevity habits.',
    },
  },
  {
    id: 'strength-ageing',
    prompt: 'Maintaining muscle mass as you age is important primarily because it…',
    options: [
      { letter: 'A', text: 'Guarantees you will not get injured' },
      { letter: 'B', text: 'Supports mobility, metabolic health, and independence' },
      { letter: 'C', text: 'Replaces the need for cardio entirely' },
      { letter: 'D', text: 'Only matters for athletes under 30' },
    ],
    correctIndex: 1,
    explanationCorrect:
      'Muscle is a longevity organ — it preserves function, glucose disposal, and resilience as you age.',
    explanationWrong: {
      highlight: 'supports mobility, metabolic health, and independence',
      text: ' — muscle mass is one of the strongest buffers against frailty.',
    },
  },
];
