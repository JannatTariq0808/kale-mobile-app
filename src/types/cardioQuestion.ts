/** Firestore collection: `cardioQuestions` */
export type CardioQuestion = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active?: boolean;
};
