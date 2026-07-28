import type { KnowledgeQuestion } from '../types/knowledgeQuestion';

export const KNOWLEDGE_QUESTIONS_FALLBACK: KnowledgeQuestion[] = [
  {
    id: 'knowledge-topics',
    question: 'What topics does the Knowledge section cover?',
    answer:
      'During onboarding we cycle through five topics:\n\n• General longevity\n• Nutrition\n• Exercise\n• Mental health\n• Biology and screening',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'why-knowledge-matters',
    question: 'Why does knowledge matter for longevity?',
    answer:
      "Strong science shows that improving your health knowledge leads to behaviour change and lasting health outcomes. Put simply: when you know why you're doing something, you're far more likely to stick with it.",
    sortOrder: 2,
    active: true,
  },
  {
    id: 'why-unmeasured-topics',
    question: "Why cover topics you don't directly measure?",
    answer:
      "Your Longevity Level is built on cardio and strength, but longevity is bigger than that. Sleep, nutrition and mental health all support your performance and your long term health. Knowledge is how we help you improve the parts of longevity we don't measure directly.",
    sortOrder: 3,
    active: true,
  },
];
