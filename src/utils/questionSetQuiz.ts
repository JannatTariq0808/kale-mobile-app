import type { QuestionSetQuestion } from '../types/questionSet';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export type QuizOptionView = {
  letter: string;
  text: string;
};

export function toQuizOptions(options: string[]): QuizOptionView[] {
  return options.map((text, index) => ({
    letter: OPTION_LETTERS[index] ?? String(index + 1),
    text,
  }));
}

/** Firestore option keys are lowercase: a, b, c, d */
export function optionKeyFromIndex(index: number): string {
  if (index < 0) return '';
  return (OPTION_LETTERS[index] ?? String(index + 1)).toLowerCase();
}

export function optionIndexFromKey(key: string): number {
  const normalized = key.trim().toLowerCase();
  const idx = OPTION_LETTERS.findIndex((letter) => letter.toLowerCase() === normalized);
  return idx >= 0 ? idx : -1;
}

export function getCorrectOptionLabel(question: QuestionSetQuestion): string {
  const options = toQuizOptions(question.options);
  return options[question.correct]?.letter ?? 'the correct answer';
}

export function getCorrectOptionText(question: QuestionSetQuestion): string {
  return question.options[question.correct] ?? '';
}

export function getExplanationCorrect(question: QuestionSetQuestion): string {
  if (question.explanation) return question.explanation;
  return 'That is the correct answer.';
}

export function getExplanationWrong(question: QuestionSetQuestion): {
  highlight: string;
  text: string;
} {
  const highlight = getCorrectOptionText(question) || getCorrectOptionLabel(question);
  if (question.explanation) {
    return { highlight, text: ` — ${question.explanation}` };
  }
  return {
    highlight,
    text: ' is the correct answer.',
  };
}
