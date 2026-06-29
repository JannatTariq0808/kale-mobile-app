import type { KnowledgeAssessmentMeta } from '../types/questionSet';

export const KNOWLEDGE_SECONDS_PER_QUESTION = 30;

export const ONBOARDING_SET_ID = 'onboarding';

export const KNOWLEDGE_QUARTERS = [
  { label: 'Q1', month: 3, type: 'Biology', startMonth: 1, setId: 'q1' },
  { label: 'Q2', month: 6, type: 'Nutrition', startMonth: 4, setId: 'q2' },
  { label: 'Q3', month: 9, type: 'Exercise', startMonth: 7, setId: 'q3' },
  { label: 'Q4', month: 12, type: 'Mental Health', startMonth: 10, setId: 'q4' },
] as const;

export type KnowledgeQuarter = (typeof KNOWLEDGE_QUARTERS)[number];

const ONBOARDING_BODY =
  'Lifespan vs healthspan, the science of VO₂max, and why training fights ageing.';

const QUARTER_BODY: Record<string, string> = {
  Biology: 'Genetics, ageing biology, and how your body changes over time.',
  Nutrition: 'Food, supplements, and the evidence behind everyday nutrition choices.',
  Exercise: 'Training principles, recovery, and what actually moves the needle.',
  'Mental Health': 'Stress, sleep, mood, and the mind–body link to longevity.',
};

function envTrim(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

/** Force a set id (`onboarding`, `q1`…`q4`) — for local quarterly testing. */
export function getKnowledgeSetOverride(): string | undefined {
  return envTrim('EXPO_PUBLIC_KNOWLEDGE_SET_OVERRIDE')?.toLowerCase();
}

/**
 * Simulate calendar month (1–12) when resolving quarterly sets.
 * Example: `EXPO_PUBLIC_KNOWLEDGE_TEST_MONTH=6` → Q2 / Nutrition.
 */
export function getKnowledgeTestMonth(): number | undefined {
  const raw = envTrim('EXPO_PUBLIC_KNOWLEDGE_TEST_MONTH');
  if (!raw) return undefined;
  const month = Number.parseInt(raw, 10);
  if (!Number.isFinite(month) || month < 1 || month > 12) return undefined;
  return month;
}

/**
 * When `false`, resolve the current quarter instead of onboarding.
 * Cloud Functions will own this later; env is for local testing.
 */
export function isFirstKnowledgeAssessment(): boolean {
  const raw = envTrim('EXPO_PUBLIC_KNOWLEDGE_IS_FIRST_ASSESSMENT');
  if (raw === 'false' || raw === '0') return false;
  return true;
}

export function getQuarterForMonth(month: number): KnowledgeQuarter {
  const normalized = ((month - 1) % 12) + 1;
  let current = KNOWLEDGE_QUARTERS[KNOWLEDGE_QUARTERS.length - 1];
  for (const quarter of KNOWLEDGE_QUARTERS) {
    if (normalized >= quarter.startMonth) {
      current = quarter;
    }
  }
  return current;
}

export function resolveKnowledgeSetId(now = new Date()): string {
  const override = getKnowledgeSetOverride();
  if (override) return override;

  if (isFirstKnowledgeAssessment()) {
    return ONBOARDING_SET_ID;
  }

  const month = getKnowledgeTestMonth() ?? now.getMonth() + 1;
  return getQuarterForMonth(month).setId;
}

export function buildKnowledgeAssessmentMeta(
  setId: string,
  now = new Date(),
): KnowledgeAssessmentMeta {
  const normalized = setId.toLowerCase();

  if (normalized === ONBOARDING_SET_ID) {
    return {
      setId: ONBOARDING_SET_ID,
      eyebrow: 'Onboarding',
      title: 'General longevity',
      body: ONBOARDING_BODY,
      isOnboarding: true,
    };
  }

  const quarter =
    KNOWLEDGE_QUARTERS.find((item) => item.setId === normalized) ??
    getQuarterForMonth(getKnowledgeTestMonth() ?? now.getMonth() + 1);

  return {
    setId: quarter.setId,
    eyebrow: quarter.label,
    title: quarter.type,
    body: QUARTER_BODY[quarter.type] ?? `This quarter covers ${quarter.type.toLowerCase()}.`,
    isOnboarding: false,
    quarterLabel: quarter.label,
    topicType: quarter.type,
  };
}

export function formatKnowledgeQuestionCount(count: number): string {
  return count === 1 ? '1 question' : `${count} questions`;
}

export function formatKnowledgeQuizDuration(
  questionCount: number,
  secondsPerQuestion = KNOWLEDGE_SECONDS_PER_QUESTION,
): string {
  if (questionCount <= 0) return '~0 min';
  const totalMinutes = Math.ceil((questionCount * secondsPerQuestion) / 60);
  return totalMinutes === 1 ? '~1 min' : `~${totalMinutes} min`;
}
