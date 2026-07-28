export type RunningYearsSport = 'running' | 'cycling';

export type RunningYearsGoalPreset = {
  id: string;
  label: string;
  sport: RunningYearsSport;
};

export const RUNNING_YEARS_GOAL_PRESETS: RunningYearsGoalPreset[] = [
  { id: '10k-grandkids', label: 'Run a 10k with my grandkids', sport: 'running' },
  { id: 'run-marathon', label: 'Run a marathon', sport: 'running' },
  { id: 'cycle-30k-grandkids', label: 'Cycle 30km with my grandkids', sport: 'cycling' },
  { id: 'ride-sportive', label: 'Ride a sportive', sport: 'cycling' },
];

export const RUNNING_YEARS_GOAL_AGE_MIN = 55;
export const RUNNING_YEARS_GOAL_AGE_MAX = 85;
export const RUNNING_YEARS_GOAL_AGE_DEFAULT = 70;

export function goalLabelForId(goalId: string): string {
  return (
    RUNNING_YEARS_GOAL_PRESETS.find((item) => item.id === goalId)?.label ??
    'Keep doing what you love'
  );
}

export function sportForGoalId(goalId: string | null | undefined): RunningYearsSport {
  if (!goalId) return 'running';
  const preset = RUNNING_YEARS_GOAL_PRESETS.find((item) => item.id === goalId);
  if (preset) return preset.sport;
  if (/cycle|cycling|sportive|ride/i.test(goalId)) return 'cycling';
  return 'running';
}

/** Product name — "Running Years" / "Cycling Years". */
export function yearsProductTitle(sport: RunningYearsSport): string {
  return sport === 'cycling' ? 'Cycling Years' : 'Running Years';
}

export function yearsProductTitleLower(sport: RunningYearsSport): string {
  return sport === 'cycling' ? 'cycling years' : 'running years';
}

/** Gerund used in body copy — "running" / "cycling". */
export function activityGerund(sport: RunningYearsSport): string {
  return sport === 'cycling' ? 'cycling' : 'running';
}

/** Chart / threshold label — "Still running" / "Still cycling". */
export function stillActiveLabel(sport: RunningYearsSport): string {
  return sport === 'cycling' ? 'Still cycling' : 'Still running';
}
