import type { CardioSummary } from '../services/cardio/fetchCardioSummary';
import type { GarminVo2Metric } from '../services/cardio/fetchGarminVo2max';
import type { Vo2SourceRow } from '../types/vo2max';

const FORMULA_LABEL = 'HRR formula';
const PACE_HR_LABEL = 'Kale pace + HR';
const ASSESSMENT_LABEL = 'Kale assessment';
const SUBMAXIMAL_LABEL = 'Kale submaximal';
const GARMIN_LABEL = 'Garmin device';

/** Garmin's native device VO₂max reading. */
export const GARMIN_ACCURACY = 4;
/** Any Kale-calculated estimate (submaximal, pace+HR, HRR). */
export const KALE_FORMULA_ACCURACY = 2;

export function formatVo2Estimate(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1);
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function valuesClose(a: number, b: number, tolerance = 0.05): boolean {
  return Math.abs(a - b) < tolerance;
}

/**
 * Garmin native VO₂max — only from explicit Garmin fields, never the assessment `vo2max`.
 */
export function resolveGarminDeviceVo2(
  summary: CardioSummary,
  garminMetric: GarminVo2Metric | null,
): number | null {
  if (summary.garminVo2max != null && summary.garminVo2max > 0) {
    return summary.garminVo2max;
  }
  if (garminMetric?.value != null && garminMetric.value > 0) {
    return garminMetric.value;
  }
  if (summary.vo2max == null || summary.vo2max <= 0) return null;

  const source = summary.vo2maxSource?.toLowerCase() ?? '';
  if (source.includes('garmin') || source === 'device' || source === 'watch') {
    return summary.vo2max;
  }

  return null;
}

function resolveKaleFormulaVo2(
  summary: CardioSummary,
  garminDeviceVo2: number | null,
  submaximalValue: number | null,
): number | null {
  if (summary.vo2max == null || summary.vo2max <= 0) return null;

  if (garminDeviceVo2 != null && valuesClose(summary.vo2max, garminDeviceVo2)) {
    return null;
  }
  if (submaximalValue != null && valuesClose(summary.vo2max, submaximalValue)) {
    return null;
  }

  return summary.vo2max;
}

function resolveFormulaLabel(summary: CardioSummary): string {
  if (summary.levelSource === 'Cycling') return ASSESSMENT_LABEL;
  if (summary.assessmentStatus === 'level_assigned' || summary.level > 0) {
    return ASSESSMENT_LABEL;
  }
  const hasPace = summary.paceMinPerKm != null && summary.paceMinPerKm > 0;
  const hasHr = summary.headlineAvgHeartrate != null && summary.headlineAvgHeartrate > 0;
  if (summary.levelSource === 'Running' && hasPace && hasHr) return PACE_HR_LABEL;
  if (summary.levelSource === 'Running' && hasPace) return PACE_HR_LABEL;
  return FORMULA_LABEL;
}

function sourcesAgree(values: number[]): boolean {
  if (values.length < 2) return true;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return max > 0 && (max - min) / max <= 0.1;
}

function averageEstimates(values: number[]): number | null {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 10) / 10;
}

function pushUniqueSource(sources: Vo2SourceRow[], row: Vo2SourceRow, existingValues: number[]): void {
  const numeric = Number(row.estimate);
  if (!Number.isFinite(numeric) || numeric <= 0) return;
  if (existingValues.some((value) => valuesClose(value, numeric))) return;
  sources.push(row);
  existingValues.push(numeric);
}

/**
 * Build VO₂ source rows for the fitness tab.
 * Garmin device = 4 stars; Kale submaximal / pace / HRR = 2 stars.
 */
export function buildVo2Sources(
  summary: CardioSummary | null,
  garminMetric: GarminVo2Metric | null,
): Vo2SourceRow[] {
  if (!summary) return [];

  const sources: Vo2SourceRow[] = [];
  const seenValues: number[] = [];

  const garminValue = resolveGarminDeviceVo2(summary, garminMetric);
  const submaximalValue =
    summary.vo2maxSubmaximal != null && summary.vo2maxSubmaximal > 0
      ? summary.vo2maxSubmaximal
      : null;
  const formulaValue = resolveKaleFormulaVo2(summary, garminValue, submaximalValue);

  if (garminValue != null) {
    pushUniqueSource(
      sources,
      {
        source: GARMIN_LABEL,
        estimate: formatVo2Estimate(garminValue),
        accuracy: GARMIN_ACCURACY,
        date: garminMetric?.updatedAt
          ? formatMonthYear(garminMetric.updatedAt)
          : summary.assessedAt
            ? formatMonthYear(summary.assessedAt)
            : '—',
      },
      seenValues,
    );
  }

  if (submaximalValue != null) {
    const computedAt = summary.vo2maxSubmaximalMeta?.computedAt;
    pushUniqueSource(
      sources,
      {
        source: SUBMAXIMAL_LABEL,
        estimate: formatVo2Estimate(submaximalValue),
        accuracy: KALE_FORMULA_ACCURACY,
        date: computedAt ? formatMonthYear(computedAt) : 'Live',
        live: !computedAt,
      },
      seenValues,
    );
  }

  if (formulaValue != null) {
    pushUniqueSource(
      sources,
      {
        source: resolveFormulaLabel(summary),
        estimate: formatVo2Estimate(formulaValue),
        accuracy: KALE_FORMULA_ACCURACY,
        date: summary.assessedAt ? formatMonthYear(summary.assessedAt) : 'Live',
        live: !summary.assessedAt,
      },
      seenValues,
    );
  }

  if (sources.length === 0 && summary.vo2max != null && summary.vo2max > 0) {
    pushUniqueSource(
      sources,
      {
        source: resolveFormulaLabel(summary),
        estimate: formatVo2Estimate(summary.vo2max),
        accuracy: KALE_FORMULA_ACCURACY,
        date: summary.assessedAt ? formatMonthYear(summary.assessedAt) : 'Live',
        live: !summary.assessedAt,
      },
      seenValues,
    );
  }

  return sources;
}

export function resolveBestVo2Estimate(sources: Vo2SourceRow[]): number | null {
  const garmin = sources.find((row) => row.accuracy === GARMIN_ACCURACY);
  if (garmin) return Number(garmin.estimate);

  const values = sources
    .map((row) => Number(row.estimate))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (values.length === 0) return null;
  if (values.length === 1) return values[0];

  if (sourcesAgree(values)) {
    return averageEstimates(values);
  }

  const assessment = sources.find(
    (row) => row.source === ASSESSMENT_LABEL || row.source === PACE_HR_LABEL || row.source === FORMULA_LABEL,
  );
  if (assessment) return Number(assessment.estimate);

  const submaximal = sources.find((row) => row.source === SUBMAXIMAL_LABEL);
  if (submaximal) return Number(submaximal.estimate);

  return values[0];
}

export function resolveVo2Summary(sources: Vo2SourceRow[]): string {
  if (sources.length === 0) {
    return 'Complete your cardio assessment to see your estimate.';
  }

  const garmin = sources.find((row) => row.accuracy === GARMIN_ACCURACY);
  const assessment = sources.find((row) => row.source === ASSESSMENT_LABEL);
  const submaximal = sources.find((row) => row.source === SUBMAXIMAL_LABEL);
  const numericValues = sources
    .map((row) => Number(row.estimate))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (garmin && sources.length === 1) {
    return 'From your Garmin watch — still an estimate, not a lab test.';
  }

  if (assessment && submaximal && !sourcesAgree(numericValues)) {
    return `Headline uses your assessment (${assessment.estimate}). Kale submaximal (${submaximal.estimate}) is separate below — not averaged.`;
  }

  if (sources.length === 1) {
    if (sources[0].accuracy === GARMIN_ACCURACY) {
      return 'From your Garmin watch — still an estimate, not a lab test.';
    }
    return 'A Kale estimate from your activity data — not a lab test.';
  }

  if (sourcesAgree(numericValues)) {
    return 'Average of agreeing sources below. All values are estimates — not lab tests.';
  }

  return 'Each row is a separate estimate — not averaged. ★★★★ = Garmin device, ★★ = Kale.';
}

export function resolveVo2FormulaCopy(
  summary: CardioSummary | null,
  sources: Vo2SourceRow[],
): { formula: string; formulaNote: string } {
  const hasSubmaximal = sources.some((row) => row.source === SUBMAXIMAL_LABEL);
  const hasGarmin = sources.some((row) => row.accuracy === GARMIN_ACCURACY);

  if (hasGarmin && hasSubmaximal) {
    const sport = summary?.vo2maxSubmaximalMeta?.source ?? 'activity';
    return {
      formula: 'Two ways to read your fitness',
      formulaNote: `Garmin device (★★★★) is your watch's VO₂max. Kale submaximal (★★) is calibrated from heart rate during your ${sport} sessions — a separate estimate.`,
    };
  }

  if (hasSubmaximal) {
    const sport = summary?.vo2maxSubmaximalMeta?.source ?? 'activity';
    return {
      formula: 'Kale submaximal model',
      formulaNote: `Calibrated from heart rate during your Garmin ${sport} sessions. ★★ = Kale estimate; ★★★★ = Garmin device reading.`,
    };
  }

  if (hasGarmin) {
    return {
      formula: 'Garmin device VO₂max',
      formulaNote:
        'Read from your Garmin watch (★★★★). Kale pace and HR estimates use ★★ when shown.',
    };
  }

  return {
    formula: 'VO₂max ≈ 15 × (HRmax / HRrest)',
    formulaNote:
      'The Heart Rate Reserve method. Two data points, no effort required — useful for tracking trends.',
  };
}
