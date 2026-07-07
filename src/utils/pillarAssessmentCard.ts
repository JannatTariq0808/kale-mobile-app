import {
  correctAnswersForLevel,
  getKnowledgeLevelUpMessage,
  knowledgeRelativePerformancePercent,
} from './knowledgeLevel';
import { strengthRequiredHoldSec } from './strengthPerformance';

export function formatAssessmentCardDate(date: Date): string {
  return `${date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}.`;
}

export function knowledgeLevelProgress(
  correctCount: number,
  totalQuestions: number,
  level: number,
): number {
  if (level >= 10 || totalQuestions <= 0) return 1;

  const minCurrent =
    level <= 1 ? 0 : correctAnswersForLevel(level, totalQuestions);
  const minNext = correctAnswersForLevel(level + 1, totalQuestions);
  if (minNext <= minCurrent) return 1;

  return Math.max(0, Math.min(1, (correctCount - minCurrent) / (minNext - minCurrent)));
}

export function strengthLevelProgress(
  holdSec: number,
  level: number,
  dob: Date,
  gender: string,
  type: string,
): number {
  if (level >= 10) return 1;

  const minCurrent = strengthRequiredHoldSec(level, dob, gender, type);
  const minNext = strengthRequiredHoldSec(level + 1, dob, gender, type);
  if (minNext <= minCurrent) return 1;

  return Math.max(0, Math.min(1, (holdSec - minCurrent) / (minNext - minCurrent)));
}

export function performanceNoteFromAccuracy(accuracyPct: number): string {
  if (accuracyPct >= 70) return "You're performing above average";
  if (accuracyPct >= 50) return "You're on track for your cohort";
  return 'Room to improve this cycle';
}

export function formatAverageScoreLabel(
  totalScore: number,
  count: number,
  maxScore: number,
): string {
  if (count <= 0) return '—';
  const avg = Math.round(totalScore / count);
  return `Avg: ${avg}/${maxScore}`;
}

export function buildKnowledgeCardFields(
  correctCount: number,
  totalQuestions: number,
  level: number,
) {
  const accuracyPct = knowledgeRelativePerformancePercent(correctCount, totalQuestions);
  return {
    scoreLabel: `${correctCount}/${totalQuestions}`,
    accuracyPct,
    levelProgress: knowledgeLevelProgress(correctCount, totalQuestions, level),
    performanceNote: performanceNoteFromAccuracy(accuracyPct),
    levelUpMessage: getKnowledgeLevelUpMessage(correctCount, totalQuestions),
  };
}
