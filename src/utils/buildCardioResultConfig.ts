import type { LumenResultConfig } from '../components/lumen/LumenResultView';
import type { CardioSummary } from '../services/cardio/fetchCardioSummary';
import type { HealthProfileForAssess } from '../services/user/fetchHealthProfile';
import {
  calculatePerformanceCardioNew,
  cardioRelativePerformancePercent,
  formatAgeBracketLabel,
  formatGenderCohort,
  resolveAgeGroup,
  calculateAge,
} from './cardioPerformance';

function formatPaceMinPerKm(pace: number): string {
  if (!pace || !Number.isFinite(pace)) return '—';
  const totalSec = Math.round(pace * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDistanceKm(distanceKm: number): string {
  if (!distanceKm || !Number.isFinite(distanceKm)) return '—';
  return `${distanceKm.toFixed(1)}km`;
}

function formatVo2max(vo2max: number | null): string {
  if (vo2max == null || !Number.isFinite(vo2max) || vo2max <= 0) return '—';
  return String(Math.round(vo2max * 10) / 10);
}

type BuildCardioResultInput = {
  summary: CardioSummary;
  profile: HealthProfileForAssess;
  previousLevel?: number | null;
};

function resolvePerformanceInput(
  summary: CardioSummary,
  profile: HealthProfileForAssess,
): { userValue: number; levelSource: NonNullable<CardioSummary['levelSource']> } | null {
  const levelSource = summary.levelSource ?? 'Running';

  if (levelSource === 'Cycling') {
    if (summary.ftpPerKg && summary.ftpPerKg > 0) {
      return { userValue: summary.ftpPerKg, levelSource: 'Cycling' };
    }
    return null;
  }

  const pace = summary.paceMinPerKm;
  const distance = summary.distanceKm;
  if (pace && pace > 0 && distance && distance > 0) {
    return { userValue: pace, levelSource: 'Running' };
  }

  if (summary.timeMin && summary.timeMin > 0 && distance && distance > 0) {
    return { userValue: summary.timeMin / distance, levelSource: 'Running' };
  }

  return null;
}

export function buildCardioResultConfig({
  summary,
  profile,
  previousLevel,
}: BuildCardioResultInput): LumenResultConfig {
  const dob = new Date(`${profile.date_of_birth}T00:00:00`);
  const age = calculateAge(dob);
  const ageBracket = formatAgeBracketLabel(resolveAgeGroup(age));
  const genderCohort = formatGenderCohort(profile.gender);

  const level = Math.max(1, Math.min(10, summary.level || 1));
  const nextLevel = Math.min(10, level + 1);

  const performanceInput = resolvePerformanceInput(summary, profile);
  let relativePerformance = 0;

  if (performanceInput) {
    relativePerformance = calculatePerformanceCardioNew({
      dob,
      gender: profile.gender,
      userValue: performanceInput.userValue,
      levelSource: performanceInput.levelSource,
      distanceKm: summary.distanceKm,
      weightKg: profile.weight_kg,
      durationMin: summary.timeMin,
      ftpPerKg: summary.ftpPerKg,
    });
  }

  const percentile = cardioRelativePerformancePercent(relativePerformance);

  let trend: LumenResultConfig['trend'] = 'none';
  let trendDelta: number | undefined;
  let levelNote = 'Your first cardio score.';

  if (previousLevel != null && previousLevel > 0) {
    const delta = level - previousLevel;
    if (delta > 0) {
      trend = 'up';
      trendDelta = delta;
      levelNote = `Up from Level ${previousLevel} last cycle.`;
    } else if (delta < 0) {
      trend = 'down';
      trendDelta = delta;
      levelNote = `Down from Level ${previousLevel} last cycle.`;
    } else {
      trend = 'same';
      levelNote = `Held at Level ${level} from last cycle.`;
    }
  }

  const bestPace =
    summary.levelSource === 'Running'
      ? summary.paceMinPerKm
      : summary.averagePace;
  const bestDistance = summary.distanceKm ?? summary.averageDistance;
  const headlineLabel =
    summary.levelSource === 'Cycling'
      ? 'Estimated VO₂max from your best ride.'
      : 'Estimated VO₂max — your strongest longevity signal.';

  return {
    pillar: 'cardio',
    pillarLabel: 'Cardio',
    level,
    trend,
    trendDelta,
    levelNote,
    percentile,
    rpText: `Fitter than ${percentile}% of ${genderCohort} aged ${ageBracket}.`,
    resultHero: formatVo2max(summary.vo2max),
    resultUnit: 'ml/kg·min',
    resultLabel: headlineLabel,
    tiles: [
      {
        label: summary.levelSource === 'Cycling' ? 'Best ride' : 'Best pace',
        value:
          summary.levelSource === 'Cycling'
            ? formatDistanceKm(bestDistance ?? 0)
            : formatPaceMinPerKm(bestPace ?? 0),
        unit: summary.levelSource === 'Cycling' ? '' : '/km',
      },
      {
        label: summary.levelSource === 'Cycling' ? 'FTP/kg' : 'Best run',
        value:
          summary.levelSource === 'Cycling'
            ? summary.ftpPerKg != null
              ? summary.ftpPerKg.toFixed(2)
              : '—'
            : formatDistanceKm(bestDistance ?? 0),
        unit: summary.levelSource === 'Cycling' ? 'W/kg' : '',
      },
      {
        label: 'Device',
        value: summary.deviceName?.trim() || 'Tracker',
      },
    ],
    nextLevel,
    nextActions:
      summary.levelSource === 'Cycling'
        ? [
            'Add one Zone-2 ride each week',
            `Push FTP/kg toward Level ${nextLevel}`,
            'Keep rides over 30 minutes for scoring',
          ]
        : [
            'Add one Zone-2 long run each week',
            `Nudge your VO₂max past ${formatVo2max((summary.vo2max ?? 0) + 2)}`,
            'Keep the 80/20 easy-to-hard split',
          ],
    nextBtn: 'Next — Strength',
  };
}
