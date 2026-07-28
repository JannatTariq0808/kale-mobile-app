export type Vo2SourceRow = {
  source: string;
  estimate: string;
  /** Filled stars out of 5 — Garmin 4, Kale formula 2, lab 5 when available. */
  accuracy: number;
  date: string;
  live?: boolean;
};

export type Vo2MaxViewData = {
  bestEstimate: number | null;
  unit: string;
  ratingLabel: string | null;
  cohortLabel: string | null;
  summary: string;
  levelSource: string | null;
  deviceName: string | null;
  sources: Vo2SourceRow[];
  formula: string;
  formulaNote: string;
};
