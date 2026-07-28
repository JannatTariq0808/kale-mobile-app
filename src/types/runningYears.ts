export type RunningYearsScreenState = 'empty' | 'estimated' | 'main' | 'declining';

export type RunningYearsGoal = {
  goalId: string;
  targetAge: number;
};

export type OnTrackStatus = 'on_track' | 'stretch';

export type RunningYearsTrajectory = {
  ages: number[];
  keep: number[];
  none: number[];
  nowAge: number;
  goalAge: number;
  thresholds: {
    stillRunning: number;
    active: number;
    independence: number;
  };
};

export type RunningYearsProjection = {
  screenState: RunningYearsScreenState;
  runningYears: number;
  runningYearsLow: number | null;
  runningYearsHigh: number | null;
  gapYears: number;
  vo2max: number | null;
  percentile: number | null;
  age: number;
  goalAge: number;
  goalId: string | null;
  goalLabel: string;
  onTrack: OnTrackStatus;
  yearsToSpare: number;
  confidence: 'high' | 'estimated';
  platform: 'strava' | 'garmin' | 'appleHealth' | null;
  hasDevice: boolean;
  trajectory: RunningYearsTrajectory;
  activeUntilAge: number | null;
};
