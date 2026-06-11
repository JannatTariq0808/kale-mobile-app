/** Firestore collection: `strengthQuestions` */
export type StrengthQuestion = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active?: boolean;
};

export type StrengthQuestionDoc = Omit<StrengthQuestion, 'id'>;
