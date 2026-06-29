import type { Timestamp } from 'firebase/firestore';

/** Matches Firestore `knowledge` collection — one doc per assessment attempt. */
export type KnowledgeSelectedOption = {
  key: string;
  text: string;
  isCorrect: boolean;
};

export type KnowledgeResponse = {
  isCorrect: boolean;
  questionId: string;
  selectedIndex: number;
  selectedOption: KnowledgeSelectedOption;
};

export type KnowledgeAssessment = {
  id: string;
  correct_responses: number;
  created_at: Date;
  is_completed: boolean;
  level: number;
  responses: KnowledgeResponse[];
  set: string;
};
