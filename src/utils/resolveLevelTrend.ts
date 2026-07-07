import type { LumenResultConfig } from '../components/lumen/LumenResultView';

type LevelTrend = Pick<LumenResultConfig, 'trend' | 'trendDelta' | 'levelNote'>;

/** Trend chip only when a prior completed assessment exists to compare against. */
export function resolveLevelTrend(
  level: number,
  previousLevel: number | null | undefined,
  firstScoreNote: string,
): LevelTrend {
  if (previousLevel == null || previousLevel <= 0) {
    return { trend: 'none', levelNote: firstScoreNote };
  }

  const delta = level - previousLevel;
  if (delta > 0) {
    return {
      trend: 'up',
      trendDelta: delta,
      levelNote: `Up from Level ${previousLevel} last cycle.`,
    };
  }
  if (delta < 0) {
    return {
      trend: 'down',
      trendDelta: delta,
      levelNote: `Down from Level ${previousLevel} last cycle.`,
    };
  }
  return {
    trend: 'same',
    levelNote: `Held at Level ${level} from last cycle.`,
  };
}
