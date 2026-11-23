/** Goals tab — users/{uid}.ipGoal, users/{uid}.coachingGoals (admin), users/{uid}.coachingRequestedAt */

/** "Go up one level" or "Maintain my level" for the next assessment window. */
export type QuarterGoalType = 'up' | 'hold';

export type QuarterGoal = {
  type: QuarterGoalType;
  /** Optional free text: how they plan to do it */
  how: string;
  /** Level when the goal was set (target is level + 1 for "up") */
  levelAtSet: number | null;
  /** Assessment window the goal is for, e.g. "January" */
  window: string | null;
  setAt: Date | null;
};

export type CoachGoalPillar = 'cardio' | 'strength' | 'knowledge' | 'health';

export type CoachGoal = {
  /** Null for goals from the admin coaching tab, which has no pillar */
  pillar: CoachGoalPillar | null;
  title: string;
  /** Coach's commentary on how to get there */
  note: string;
};

/** Long term goals set with a coach. Written in the website admin, read-only in the app. */
export type CoachGoals = {
  coachName: string | null;
  setAt: Date | null;
  goals: CoachGoal[];
};

export type GoalsRecord = {
  quarterGoal: QuarterGoal | null;
  coachGoals: CoachGoals | null;
  coachingRequestedAt: Date | null;
};
