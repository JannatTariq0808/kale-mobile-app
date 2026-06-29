/** Firestore collection: `questionSets` */
export type QuestionSetCategory = {
  label?: string;
  month?: number;
  type?: string;
};

export type QuestionSetQuestion = {
  id: string;
  text: string;
  options: string[];
  /** Zero-based index into `options`. */
  correct: number;
  order: number;
  set: string;
  status: string;
  explanation: string;
  category?: QuestionSetCategory;
};

export type KnowledgeAssessmentMeta = {
  setId: string;
  eyebrow: string;
  title: string;
  body: string;
  isOnboarding: boolean;
  quarterLabel?: string;
  topicType?: string;
};
