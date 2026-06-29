import type { KnowledgeAssessmentMeta } from '../types/questionSet';
import type { LumenResultConfig } from '../components/lumen/LumenResultView';

export const KNOWLEDGE_LEVEL_MIN = 1;
export const KNOWLEDGE_LEVEL_MAX = 10;

/** Relative performance ratio: correctResponses / totalQuestions (0–1). */
export function calculateKnowledgeRelativePerformance(
  correctCount: number,
  totalQuestions: number,
): number {
  if (totalQuestions <= 0) return 0;
  return correctCount / totalQuestions;
}

/** Relative performance as a whole-number percentage (0–100). */
export function knowledgeRelativePerformancePercent(
  correctCount: number,
  totalQuestions: number,
): number {
  return Math.round(calculateKnowledgeRelativePerformance(correctCount, totalQuestions) * 100);
}

/** Level from relative performance — floor(rp × 10), clamped to 1–10. */
export function calculateKnowledgeLevel(
  correctCount: number,
  totalQuestions: number,
): number {
  const relativePerformance = calculateKnowledgeRelativePerformance(correctCount, totalQuestions);
  const raw = Math.floor(relativePerformance * KNOWLEDGE_LEVEL_MAX);
  return Math.max(
    KNOWLEDGE_LEVEL_MIN,
    Math.min(KNOWLEDGE_LEVEL_MAX, raw),
  );
}

export function knowledgeAccuracyPercent(
  correctCount: number,
  totalQuestions: number,
): number {
  return knowledgeRelativePerformancePercent(correctCount, totalQuestions);
}

/** Minimum correct answers needed to reach a given level. */
export function correctAnswersForLevel(level: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return Math.ceil((level * totalQuestions) / KNOWLEDGE_LEVEL_MAX);
}

type BuildKnowledgeResultInput = {
  correctCount: number;
  totalQuestions: number;
  meta: KnowledgeAssessmentMeta;
  previousLevel?: number | null;
};

export function buildKnowledgeResultConfig({
  correctCount,
  totalQuestions,
  meta,
  previousLevel,
}: BuildKnowledgeResultInput): LumenResultConfig {
  const level = calculateKnowledgeLevel(correctCount, totalQuestions);
  const relativePerformancePercent = knowledgeRelativePerformancePercent(
    correctCount,
    totalQuestions,
  );
  const nextLevel = Math.min(KNOWLEDGE_LEVEL_MAX, level + 1);
  const topicLabel = meta.isOnboarding ? 'General longevity' : meta.title;

  let trend: LumenResultConfig['trend'] = 'none';
  let trendDelta: number | undefined;
  let levelNote = 'Your first knowledge score.';

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

  const neededForNext =
    level < KNOWLEDGE_LEVEL_MAX
      ? correctAnswersForLevel(nextLevel, totalQuestions)
      : totalQuestions;

  const nextActions =
    level >= KNOWLEDGE_LEVEL_MAX
      ? ['Keep reading the weekly longevity briefs', 'Share what you learned with your crew']
      : [
          `Score ${neededForNext}/${totalQuestions} next quarter`,
          `Brush up on ${topicLabel.toLowerCase()} basics`,
          'Read the weekly longevity briefs',
        ];

  return {
    pillar: 'knowledge',
    pillarLabel: 'Knowledge',
    level,
    trend,
    trendDelta,
    levelNote,
    percentile: relativePerformancePercent,
    rpText: `Ahead of ${relativePerformancePercent}% of Kale members.`,
    resultHero: `${correctCount}/${totalQuestions}`,
    resultLabel: `Quiz score — ${topicLabel}.`,
    tiles: [
      { label: 'Accuracy', value: String(relativePerformancePercent), unit: '%' },
      { label: 'Topic', value: meta.eyebrow },
      { label: 'Level', value: String(level), unit: '/10' },
    ],
    nextLevel,
    nextActions,
    nextBtn: 'See your Longevity Level',
  };
}

export function knowledgeAnalysingSubhead(meta: KnowledgeAssessmentMeta): string {
  if (meta.isOnboarding) {
    return 'Scoring your quiz on general longevity.';
  }
  return `Scoring your quiz on ${meta.title.toLowerCase()}.`;
}
