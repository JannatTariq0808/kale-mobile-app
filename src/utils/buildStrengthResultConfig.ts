import type { LumenResultConfig } from '../components/lumen/LumenResultView';
import type { PlankAnalysisResult } from '../types/plankRecording';
import { PLANK_STRENGTH_TYPE } from '../types/strengthAssessment';
import type { DemographicsForAssess } from '../services/user/fetchHealthProfile';
import { formatPlankDuration } from './formatPlankDuration';
import { resolveLevelTrend } from './resolveLevelTrend';
import {
  buildStrengthRpText,
  getStrengthLevel,
  getStrengthPct,
  strengthRequiredHoldSec,
} from './strengthPerformance';

export type StrengthPlankScore = {
  level: number;
  rpPct: number;
  percentile: number;
  usedNorms: boolean;
};

type BuildStrengthResultInput = {
  elapsed_time: number;
  analysis: PlankAnalysisResult;
  profile: DemographicsForAssess | null;
  previousLevel?: number | null;
};

function dobFromProfile(profile: DemographicsForAssess): Date {
  return new Date(`${profile.date_of_birth}T00:00:00`);
}

/** Flutter `getStrengthLvl` + `getStrengthPct` for a plank hold. */
export function scoreStrengthPlank(
  elapsed_time: number,
  profile: DemographicsForAssess | null,
): StrengthPlankScore {
  const holdSec = Math.max(0, Math.floor(elapsed_time));

  if (!profile) {
    const fallbackLevel = Math.max(1, Math.min(10, Math.floor(holdSec / 12)));
    return {
      level: fallbackLevel,
      rpPct: fallbackLevel * 10,
      percentile: Math.min(99, Math.max(1, fallbackLevel * 10)),
      usedNorms: false,
    };
  }

  const dob = dobFromProfile(profile);
  const level = getStrengthLevel(dob, profile.gender, holdSec, PLANK_STRENGTH_TYPE);
  const rpPct = getStrengthPct(dob, profile.gender, holdSec, PLANK_STRENGTH_TYPE);
  const { percentile } = buildStrengthRpText(dob, profile.gender, holdSec, PLANK_STRENGTH_TYPE);

  return {
    level: level > 0 ? level : 1,
    rpPct,
    percentile,
    usedNorms: true,
  };
}

export function buildStrengthResultConfig({
  elapsed_time,
  analysis: _analysis,
  profile,
  previousLevel,
}: BuildStrengthResultInput): LumenResultConfig {
  const scored = scoreStrengthPlank(elapsed_time, profile);
  const { level, percentile, usedNorms } = scored;
  const holdLabel = formatPlankDuration(elapsed_time);
  const nextLevel = Math.min(10, level + 1);

  const dob = profile ? dobFromProfile(profile) : null;
  const nextHoldTargetSec =
    dob && profile
      ? strengthRequiredHoldSec(nextLevel, dob, profile.gender, PLANK_STRENGTH_TYPE)
      : 0;
  const nextHoldTarget = nextHoldTargetSec > 0 ? formatPlankDuration(nextHoldTargetSec) : '—';

  const { rpText } =
    dob && profile
      ? buildStrengthRpText(dob, profile.gender, elapsed_time, PLANK_STRENGTH_TYPE)
      : {
          rpText: `Stronger than ${percentile}% of Kale members.`,
        };

  const { trend, trendDelta, levelNote } = resolveLevelTrend(
    level,
    previousLevel,
    usedNorms
      ? 'Graded against age and gender norms from your hold time.'
      : 'Your first strength score.',
  );

  const levelUpMessage =
    nextHoldTargetSec > 0 && level < 10
      ? `Hold the plank past ${nextHoldTarget} to reach Level ${nextLevel}.`
      : '';

  return {
    pillar: 'strength',
    pillarLabel: 'Strength',
    level,
    trend,
    trendDelta,
    levelNote,
    percentile,
    rpText,
    resultHero: holdLabel,
    resultLabel: '',
    tiles: [],
    nextLevel,
    nextActions: [],
    levelUpMessage,
    nextBtn: 'Next — Knowledge',
  };
}
