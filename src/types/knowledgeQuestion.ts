/** Firestore collection: `knowledgeQuestions` */
export type KnowledgeQuestion = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active?: boolean;
};

export type KnowledgeQuestionDoc = Omit<KnowledgeQuestion, 'id'>;
