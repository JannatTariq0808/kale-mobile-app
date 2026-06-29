/** Firestore collection: `strength` — one doc per strength test attempt. */
export const PLANK_STRENGTH_TYPE = 'Plank';

export type StrengthTestType = typeof PLANK_STRENGTH_TYPE | string;

export type StrengthAssessment = {
  id: string;
  created_at: Date;
  elapsed_time: number;
  is_completed: boolean;
  level: number;
  type: StrengthTestType;
};

export type SaveStrengthAssessmentInput = {
  elapsed_time: number;
  level: number;
  type?: StrengthTestType;
  is_completed?: boolean;
};
