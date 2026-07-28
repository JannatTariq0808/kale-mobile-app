/** Firestore collection: `runningYearsGoals` — preset goal chips */
export type RunningYearsSport = 'running' | 'cycling';

export type RunningYearsGoalPreset = {
  id: string;
  label: string;
  sortOrder: number;
  sport: RunningYearsSport;
  active?: boolean;
};
