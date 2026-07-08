export type AssessmentFlowMode = 'onboarding' | 'quarterly';

type ActiveAssessmentFlow = {
  mode: AssessmentFlowMode;
  assessmentId: string;
  /** Per-assessment `cardios/{autoId}` created before tracker connect. */
  cardioDocId?: string;
  /** ISO — activities to include when re-syncing cardio for a quarterly attempt. */
  activitiesSince?: string;
};

let activeFlow: ActiveAssessmentFlow | null = null;

export function setActiveAssessmentFlow(flow: ActiveAssessmentFlow): void {
  activeFlow = flow;
}

export function clearActiveAssessmentFlow(): void {
  activeFlow = null;
}

export function getActiveAssessmentFlow(): ActiveAssessmentFlow | null {
  return activeFlow;
}

export function isQuarterlyAssessmentFlow(): boolean {
  return activeFlow?.mode === 'quarterly';
}
