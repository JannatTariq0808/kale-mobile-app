import AsyncStorage from '@react-native-async-storage/async-storage';

export type AssessmentFlowMode = 'onboarding' | 'quarterly';

export type ActiveAssessmentFlow = {
  mode: AssessmentFlowMode;
  assessmentId: string;
  /** Per-assessment `cardios/{autoId}` created before tracker connect. */
  cardioDocId?: string;
  /** ISO — activities to include when re-syncing cardio for a quarterly attempt. */
  activitiesSince?: string;
};

const FLOW_STORAGE_KEY = 'kale.activeAssessmentFlow';

let activeFlow: ActiveAssessmentFlow | null = null;

async function persistFlow(flow: ActiveAssessmentFlow): Promise<void> {
  try {
    await AsyncStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio-sync] persist assessment flow failed', error);
    }
  }
}

async function loadPersistedFlow(): Promise<ActiveAssessmentFlow | null> {
  try {
    const raw = await AsyncStorage.getItem(FLOW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveAssessmentFlow;
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio-sync] load persisted assessment flow failed', error);
    }
    return null;
  }
}

export function setActiveAssessmentFlow(flow: ActiveAssessmentFlow): void {
  activeFlow = flow;
  void persistFlow(flow);
  if (__DEV__) {
    console.log('[cardio-sync] flow saved', {
      mode: flow.mode,
      assessmentId: flow.assessmentId,
      activitiesSince: flow.activitiesSince ?? null,
      cardioDocId: flow.cardioDocId ?? null,
    });
  }
}

export function clearActiveAssessmentFlow(): void {
  activeFlow = null;
  void AsyncStorage.removeItem(FLOW_STORAGE_KEY);
}

export function getActiveAssessmentFlow(): ActiveAssessmentFlow | null {
  return activeFlow;
}

/** Restores in-memory flow from AsyncStorage after OAuth reloads the JS bundle. */
export async function getActiveAssessmentFlowAsync(): Promise<ActiveAssessmentFlow | null> {
  if (activeFlow) return activeFlow;
  const persisted = await loadPersistedFlow();
  if (persisted) {
    activeFlow = persisted;
    if (__DEV__) {
      console.log('[cardio-sync] flow restored from storage', {
        mode: persisted.mode,
        assessmentId: persisted.assessmentId,
        activitiesSince: persisted.activitiesSince ?? null,
        cardioDocId: persisted.cardioDocId ?? null,
      });
    }
  }
  return activeFlow;
}

export function isQuarterlyAssessmentFlow(): boolean {
  return activeFlow?.mode === 'quarterly';
}
