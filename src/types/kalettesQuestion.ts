/** Firestore collection: `kalettesQuestions` */
export type KalettesQuestion = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active?: boolean;
};

export type KalettesQuestionDoc = Omit<KalettesQuestion, 'id'>;
