import { allowMultipleAssessmentsPerQuarter } from '../config/assessmentDev';
import { KNOWLEDGE_QUARTERS, type KnowledgeQuarter } from '../config/knowledgeAssessment';

/** Assessment window is open during the first month of each quarter (Jan, Apr, Jul, Oct). */
const LIVE_WINDOW_MONTHS = [0, 3, 6, 9] as const;
/** Quarterly assessment boundaries — 1 Jan, 1 Apr, 1 Jul, 1 Oct. */
const QUARTER_MONTHS = LIVE_WINDOW_MONTHS;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export type AssessmentCycle = {
  weeksToAssessment: number;
  daysToAssessment: number;
  totalDaysToAssessment: number;
  cycleProgressPct: number;
  nextAssessmentDate: Date;
  cycleStartDate: Date;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function quarterStartsForYear(year: number): Date[] {
  return QUARTER_MONTHS.map((month) => new Date(year, month, 1));
}

function buildQuarterBoundaries(anchorYear: number): Date[] {
  const dates: Date[] = [];
  for (let year = anchorYear - 1; year <= anchorYear + 1; year += 1) {
    dates.push(...quarterStartsForYear(year));
  }
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Next assessment + progress through the current quarterly cycle. */
export function getAssessmentCycle(now = new Date()): AssessmentCycle {
  const today = startOfDay(now);
  const boundaries = buildQuarterBoundaries(today.getFullYear());

  let nextAssessmentDate = boundaries[boundaries.length - 1];
  let cycleStartDate = boundaries[0];

  for (let i = 0; i < boundaries.length; i += 1) {
    const boundary = boundaries[i];
    if (boundary > today) {
      nextAssessmentDate = boundary;
      cycleStartDate = boundaries[i - 1] ?? boundary;
      break;
    }
  }

  const totalDaysToAssessment = Math.max(
    0,
    Math.round((nextAssessmentDate.getTime() - today.getTime()) / MS_PER_DAY),
  );
  const weeksToAssessment = Math.floor(totalDaysToAssessment / 7);
  const daysToAssessment = totalDaysToAssessment % 7;

  const cycleMs = nextAssessmentDate.getTime() - cycleStartDate.getTime();
  const elapsedMs = today.getTime() - cycleStartDate.getTime();
  const cycleProgressPct =
    cycleMs <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((elapsedMs / cycleMs) * 100)));

  return {
    weeksToAssessment,
    daysToAssessment,
    totalDaysToAssessment,
    cycleProgressPct,
    nextAssessmentDate,
    cycleStartDate,
  };
}

function previousQuarterStart(date: Date): Date {
  const month = date.getMonth();
  const year = date.getFullYear();
  const idx = QUARTER_MONTHS.indexOf(month as (typeof QUARTER_MONTHS)[number]);
  if (idx > 0) {
    return new Date(year, QUARTER_MONTHS[idx - 1], 1);
  }
  return new Date(year - 1, QUARTER_MONTHS[QUARTER_MONTHS.length - 1], 1);
}

export function formatAssessmentDate(date: Date): string {
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

/** Chronological assessment dates for chart x-axis (last slot is always filled with "Now" by caller). */
export function getAssessmentDatesForChart(count: number, now = new Date()): Date[] {
  const today = startOfDay(now);
  const boundaries = buildQuarterBoundaries(today.getFullYear());
  const passed = boundaries.filter((b) => b <= today);

  const needed = Math.max(0, count - 1);
  const dates: Date[] = [];

  for (const boundary of passed) {
    if (dates.length >= needed) break;
    dates.push(boundary);
  }

  while (dates.length < needed) {
    const first = dates[0] ?? today;
    dates.unshift(previousQuarterStart(first));
  }

  return dates;
}

export function buildAssessmentChartLabels(count: number, now = new Date()): string[] {
  const dates = getAssessmentDatesForChart(count, now);
  return [...dates.map(formatAssessmentDate), 'Now'];
}

/** 0–3 index for Q1–Q4 based on which quarterly cycle `now` falls in. */
export function getCurrentQuarterIndex(now = new Date()): number {
  const month = now.getMonth();
  if (month < 3) return 0;
  if (month < 6) return 1;
  if (month < 9) return 2;
  return 3;
}

export type AssessmentWindowLive = {
  live: true;
  cycleNumber: number;
  windowStart: Date;
  windowEnd: Date;
  windowProgressPct: number;
  daysUntilClose: number;
  hoursUntilClose: number;
  minutesUntilClose: number;
  secondsUntilClose: number;
  daysSinceOpen: number;
  openLabel: string;
  closeLabel: string;
};

export type AssessmentWindowIncoming = {
  live: false;
  cycleNumber: number;
};

export type AssessmentWindow = AssessmentWindowLive | AssessmentWindowIncoming;

export function isAssessmentWindowLive(now = new Date()): boolean {
  return LIVE_WINDOW_MONTHS.includes(now.getMonth() as (typeof LIVE_WINDOW_MONTHS)[number]);
}

function getCycleNumber(now: Date): number {
  const year = now.getFullYear();
  const quarterIndex = getCurrentQuarterIndex(now);
  return (year - 2022) * 4 + quarterIndex + 1;
}

/** Human quarter label aligned with cloud functions (`Q1`…`Q4`). */
export function getCurrentKnowledgeQuarter(now = new Date()): KnowledgeQuarter {
  const month = now.getMonth() + 1;
  return (
    KNOWLEDGE_QUARTERS.find((quarter) => month >= quarter.startMonth && month <= quarter.month) ??
    KNOWLEDGE_QUARTERS[KNOWLEDGE_QUARTERS.length - 1]
  );
}

/** Prefer this in UI instead of the internal cycle counter (e.g. "Q3 2026"). */
export function getAssessmentQuarterDisplay(now = new Date()): string {
  const quarter = getCurrentKnowledgeQuarter(now);
  return `${quarter.label} ${now.getFullYear()}`;
}

/**
 * Internal counter since 2022 Q1 — e.g. July 2026 → cycle 19.
 * Shown in UI only as a fallback; prefer {@link getAssessmentQuarterDisplay}.
 */
export function getAssessmentCycleNumber(now = new Date()): number {
  return getCycleNumber(now);
}

function formatCloseLabel(windowEnd: Date): string {
  const day = windowEnd.getDate();
  const month = MONTH_SHORT[windowEnd.getMonth()].toUpperCase();
  return `CLOSES ${day} ${month} 12 AM`;
}

/**
 * Live during Jan / Apr / Jul / Oct — first month of each assessment quarter.
 * Window opens at local midnight on the 1st and closes at local midnight on the 1st of the next month.
 * All boundaries use the device timezone (e.g. Lahore PKT, London GMT/BST).
 */
/** First day of the next assessment window (Jan / Apr / Jul / Oct) strictly after `now`. */
export function getNextAssessmentWindowStart(now = new Date()): Date {
  const today = startOfDay(now);
  const boundaries = buildQuarterBoundaries(today.getFullYear());
  const upcoming = boundaries.find((boundary) => boundary > today);
  if (upcoming) return upcoming;
  return new Date(today.getFullYear() + 1, QUARTER_MONTHS[0], 1);
}

export type AssessmentWindowCycleLabel = {
  headline: string;
  subline: string;
  windowProgressPct: number;
  windowLive: boolean;
};

export type AssessmentWindowLabelOptions = {
  /** User already finished their one assessment this quarter (onboarding counts). */
  completedThisQuarter?: boolean;
};

function isDateInAssessmentCycle(
  value: Date | undefined,
  cycleStartDate: Date,
  nextAssessmentDate: Date,
): boolean {
  if (!value || Number.isNaN(value.getTime())) return false;
  return value >= cycleStartDate && value < nextAssessmentDate;
}

function assessmentBelongsToCurrentQuarter(
  assessment: {
    year?: number;
    quarter?: { month?: number; startMonth?: number };
    updated_at?: Date;
    created_at?: Date;
  },
  year: number,
  currentQuarter: { month: number; startMonth: number },
  cycleStartDate: Date,
  nextAssessmentDate: Date,
): boolean {
  if (assessment.year === year) {
    if (assessment.quarter?.month === currentQuarter.month) return true;
    if (assessment.quarter?.startMonth === currentQuarter.startMonth) return true;
  }

  return (
    isDateInAssessmentCycle(assessment.updated_at, cycleStartDate, nextAssessmentDate) ||
    isDateInAssessmentCycle(assessment.created_at, cycleStartDate, nextAssessmentDate)
  );
}

/**
 * True when the user has already used their one assessment slot this quarter.
 * When `EXPO_PUBLIC_ALLOW_MULTIPLE_ASSESSMENTS_PER_QUARTER=true` (dev only), always false
 * so the home "Assessment live" card stays available for retesting.
 *
 * Slot is used when a parent assessment in this quarter is `is_completed`, or has all
 * three pillar refs (finished attempt waiting on reveal / finalize).
 */
export function hasCompletedAssessmentThisQuarter(
  assessments: {
    is_completed: boolean;
    updated_at: Date;
    created_at: Date;
    year?: number;
    quarter?: { month?: number; startMonth?: number };
    cardio_id?: string | null;
    strength_id?: string | null;
    knowledge_id?: string | null;
  }[],
  now = new Date(),
): boolean {
  if (allowMultipleAssessmentsPerQuarter()) {
    if (__DEV__) {
      console.log(
        '[assessment-cycle] multiple-per-quarter enabled — treating slot as open (Assessment live stays)',
      );
    }
    return false;
  }

  const currentQuarter = getCurrentKnowledgeQuarter(now);
  const year = now.getFullYear();
  const { cycleStartDate, nextAssessmentDate } = getAssessmentCycle(now);

  const used = assessments.some((assessment) => {
    if (
      !assessmentBelongsToCurrentQuarter(
        assessment,
        year,
        currentQuarter,
        cycleStartDate,
        nextAssessmentDate,
      )
    ) {
      return false;
    }

    if (assessment.is_completed) return true;

    // Finished all pillars this cycle but parent not marked completed yet.
    return Boolean(assessment.cardio_id && assessment.strength_id && assessment.knowledge_id);
  });

  if (__DEV__) {
    console.log('[assessment-cycle] slot this quarter', {
      used,
      year,
      quarterMonth: currentQuarter.month,
      quarterStartMonth: currentQuarter.startMonth,
      cycleStart: cycleStartDate.toISOString(),
      nextCycle: nextAssessmentDate.toISOString(),
      candidates: assessments.map((item) => ({
        is_completed: item.is_completed,
        year: item.year,
        quarterMonth: item.quarter?.month,
        startMonth: item.quarter?.startMonth,
        created_at: item.created_at?.toISOString?.(),
        updated_at: item.updated_at?.toISOString?.(),
        hasAllPillars: Boolean(item.cardio_id && item.strength_id && item.knowledge_id),
      })),
    });
  }

  return used;
}

/** Copy for Kalettes / rewards — assessment window, not “weeks until quarter boundary”. */
export function formatAssessmentWindowCycleLabel(
  now = new Date(),
  options: AssessmentWindowLabelOptions = {},
): AssessmentWindowCycleLabel {
  const completedThisQuarter = options.completedThisQuarter === true;
  const window = getAssessmentWindow(now);

  if (window.live) {
    if (completedThisQuarter) {
      const nextOpen = getNextAssessmentWindowStart(now);
      const openLabel = formatAssessmentDate(nextOpen);
      return {
        headline: 'Assessment done this quarter',
        subline: `One per quarter · next window opens ${openLabel}`,
        windowProgressPct: window.windowProgressPct,
        windowLive: true,
      };
    }

    const days = window.daysUntilClose;
    const subline =
      days === 0
        ? 'Closes at midnight tonight'
        : `${days} day${days === 1 ? '' : 's'} left to complete assessment`;

    return {
      headline: 'Assessment window open',
      subline,
      windowProgressPct: window.windowProgressPct,
      windowLive: true,
    };
  }

  const nextOpen = getNextAssessmentWindowStart(now);
  const daysUntilOpen = Math.max(
    0,
    Math.round((startOfDay(nextOpen).getTime() - startOfDay(now).getTime()) / MS_PER_DAY),
  );
  const openLabel = formatAssessmentDate(nextOpen);
  const subline = completedThisQuarter
    ? `One per quarter · next window opens ${openLabel}`
    : daysUntilOpen === 0
      ? `Opens ${openLabel}`
      : `Opens ${openLabel} · in ${daysUntilOpen} day${daysUntilOpen === 1 ? '' : 's'}`;

  return {
    headline: completedThisQuarter ? 'Assessment done this quarter' : 'Bank at your next assessment',
    subline,
    windowProgressPct: 0,
    windowLive: false,
  };
}

export function getAssessmentWindow(now = new Date()): AssessmentWindow {
  const cycleNumber = getCycleNumber(now);

  if (!isAssessmentWindowLive(now)) {
    return { live: false, cycleNumber };
  }

  const month = now.getMonth();
  const year = now.getFullYear();
  const windowStart = new Date(year, month, 1, 0, 0, 0, 0);
  const windowEnd = new Date(year, month + 1, 1, 0, 0, 0, 0);

  const totalMs = windowEnd.getTime() - windowStart.getTime();
  const elapsedMs = now.getTime() - windowStart.getTime();
  const remainingMs = Math.max(0, windowEnd.getTime() - now.getTime());
  const windowProgressPct =
    totalMs <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));

  const totalSecs = Math.floor(remainingMs / 1000);
  const daysUntilClose = Math.floor(totalSecs / 86400);
  const hoursUntilClose = Math.floor((totalSecs % 86400) / 3600);
  const minutesUntilClose = Math.floor((totalSecs % 3600) / 60);
  const secondsUntilClose = totalSecs % 60;

  const daysSinceOpen = Math.max(
    0,
    Math.floor((startOfDay(now).getTime() - windowStart.getTime()) / MS_PER_DAY),
  );
  const openLabel =
    daysSinceOpen === 0
      ? 'WINDOW OPENED TODAY'
      : `WINDOW OPENED ${daysSinceOpen} DAY${daysSinceOpen === 1 ? '' : 'S'} AGO`;

  return {
    live: true,
    cycleNumber,
    windowStart,
    windowEnd,
    windowProgressPct,
    daysUntilClose,
    hoursUntilClose,
    minutesUntilClose,
    secondsUntilClose,
    daysSinceOpen,
    openLabel,
    closeLabel: formatCloseLabel(windowEnd),
  };
}
