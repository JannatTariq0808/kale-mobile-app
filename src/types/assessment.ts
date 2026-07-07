/** Firestore collection: `assessments` — parent doc for onboarding / quarterly cycles. */

export type AssessmentQuarter = {
  label: string | number;
  month: number;
  type: string;
  startMonth: number;
};

export type KaleAssessment = {
  id: string;
  user_id: string;
  cardio_id: string | null;
  strength_id: string | null;
  knowledge_id: string | null;
  year: number;
  quarter: AssessmentQuarter;
  isOnboarding: boolean;
  is_completed: boolean;
  level: number | null;
  created_at: Date;
  updated_at: Date;
};
