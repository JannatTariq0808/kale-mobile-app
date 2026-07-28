/** Firestore collection: `runningYearsQuestions` */
export type RunningYearsQuestion = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active?: boolean;
};
