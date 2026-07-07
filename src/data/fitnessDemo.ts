// Design: kale-mobile-design — lum-13 / nu-2 activity log demo data

import { sortActivitiesByPace } from '../utils/sortActivitiesByPace';

export type ActivityType = 'run' | 'ride';

export type FitnessActivity = {
  type: ActivityType;
  name: string;
  date: string;
  dist: string;
  metric: string;
  metricUnit: string;
  hr: string;
  counted: boolean;
  reason?: string;
  device?: string;
};

export const fitnessActivityLog = {
  summary: {
    countedLabel: 'Counted · 12 wks',
    runCount: 34,
    distanceKm: 312,
  },
  activities: [
    {
      type: 'run',
      device: 'Garmin Forerunner 965',
      name: 'Morning long run',
      date: '14 Feb · 7:42am',
      dist: '12.4km',
      metric: '4:48',
      metricUnit: '/km',
      hr: '148',
      counted: true,
    },
    {
      type: 'ride',
      device: 'Garmin Edge 840',
      name: 'Commute home',
      date: '13 Feb · 5:55pm',
      dist: '14.8km',
      metric: '28.4',
      metricUnit: 'km/h',
      hr: '136',
      counted: true,
    },
    {
      type: 'run',
      name: 'Threshold session',
      date: '11 Feb · 6:30pm',
      dist: '8.0km',
      metric: '4:12',
      metricUnit: '/km',
      hr: '162',
      counted: true,
    },
    {
      type: 'ride',
      name: 'Sunday hills',
      date: '10 Feb · 9:15am',
      dist: '42.1km',
      metric: '26.1',
      metricUnit: 'km/h',
      hr: '158',
      counted: true,
    },
    {
      type: 'run',
      name: 'Easy recovery jog',
      date: '09 Feb · 7:10am',
      dist: '5.2km',
      metric: '5:34',
      metricUnit: '/km',
      hr: '132',
      counted: true,
    },
    {
      type: 'run',
      name: 'Treadmill 5k',
      date: '07 Feb · 1:15pm',
      dist: '5.0km',
      metric: '4:55',
      metricUnit: '/km',
      hr: '—',
      counted: false,
      reason: 'Incomplete HR data',
    },
    {
      type: 'run',
      name: 'Sunday long run',
      date: '04 Feb · 8:00am',
      dist: '15.0km',
      metric: '5:02',
      metricUnit: '/km',
      hr: '146',
      counted: true,
    },
    {
      type: 'ride',
      name: 'Lunchtime spin',
      date: '01 Feb · 12:40pm',
      dist: '8.2km',
      metric: '22.0',
      metricUnit: 'km/h',
      hr: '118',
      counted: false,
      reason: 'Too short',
    },
  ] satisfies FitnessActivity[],
} as const;

export type CountFilter = 'All' | 'Counted' | 'Not counted';
export type SportFilter = 'All sports' | 'Runs' | 'Rides';

export function filterActivities(
  activities: FitnessActivity[],
  countFilter: CountFilter,
  sportFilter: SportFilter,
): FitnessActivity[] {
  const filtered = activities.filter((activity) => {
    if (countFilter === 'Counted' && !activity.counted) return false;
    if (countFilter === 'Not counted' && activity.counted) return false;
    if (sportFilter === 'Runs' && activity.type !== 'run') return false;
    if (sportFilter === 'Rides' && activity.type !== 'ride') return false;
    return true;
  });

  return sortActivitiesByPace(filtered);
}

export type Vo2SourceRow = {
  source: string;
  estimate: string;
  accuracy: number;
  date: string;
  live?: boolean;
};

/** Design: lum-14 KaleFitnessVO2Lumen */
export const fitnessVo2Max = {
  bestEstimate: 52.6,
  unit: 'ml/kg/min',
  ratingLabel: 'Excellent',
  summary: 'Average of validated sources.',
  sources: [
    { source: 'Garmin device', estimate: '52.3', accuracy: 3, date: 'Jan 2026', live: false },
    { source: 'Kale pace + HR', estimate: '50.8', accuracy: 4, date: 'Feb 2026', live: false },
    { source: 'Validated lab', estimate: '54.1', accuracy: 5, date: 'Nov 2025', live: false },
    { source: 'HRR formula', estimate: '51.6', accuracy: 3, date: 'Live', live: true },
  ] satisfies Vo2SourceRow[],
  formula: 'VO₂max ≈ 15 × (HRmax / HRrest)',
  formulaNote:
    'The Heart Rate Reserve method. Two data points, no effort required, reliable for tracking trends.',
} as const;

/** Design: lum-18 KaleFitnessStrengthLumen */
export const fitnessStrength = {
  level: 6,
  levelPct: 60,
  trendDelta: 1,
  percentileTop: 22,
  percentileCohort: 'women aged 35–40',
  levelTrend: {
    labels: ['Onb', 'Apr', 'Jul', 'Oct', 'Jan', 'Apr', 'Jul', 'Now'],
    levels: [3, 4, 4, 5, 5, 5, 5, 6],
    chips: '8 quarters',
  },
  currentTest: {
    name: 'Wall sit · cycle 3',
    today: '1:48',
    previousCycle: '1:22',
    improvement: '26s',
    relativePerformance: 78,
    cohortGender: 'women',
    cohortAgeRange: '35–40',
  },
} as const;

/** Design: nu-8 KaleFitnessKnowledge + lum-19 KaleFitnessKnowledgeLumen */
export const fitnessKnowledge = {
  level: 7,
  levelPct: 70,
  latestScore: 16,
  maxScore: 20,
  scorePct: 80,
  trendLabel: '1 question vs. cycle 3',
  scoreHistory: {
    scores: [12, 14, 15, 16],
    labels: ['Onb', 'C2', 'C3', 'Now'],
    chip: '4 CYCLES',
  },
  topics: [
    { label: 'General longevity', score: 5, max: 5 },
    { label: 'Exercise science', score: 4, max: 5 },
    { label: 'Nutrition', score: 3, max: 5 },
    { label: 'Sleep & recovery', score: 2, max: 3 },
    { label: 'Mental health', score: 1, max: 2 },
  ],
  upNext: {
    focusTopic: 'nutrition',
  },
} as const;
