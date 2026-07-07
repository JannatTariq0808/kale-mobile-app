export type PlankFrameSample = {
  timeMs: number;
  valid: boolean;
};

/**
 * Estimates seconds in a valid plank from sparse timestamped frame checks.
 * Each valid sample contributes the wall-clock span to the midpoint with its neighbours.
 */
export function estimateValidPlankHoldSec(
  durationSec: number,
  samples: PlankFrameSample[],
): number {
  if (durationSec <= 0 || samples.length === 0) return 0;

  const sorted = [...samples].sort((a, b) => a.timeMs - b.timeMs);
  const durationMs = Math.floor(durationSec * 1000);

  if (sorted.every((sample) => sample.valid)) {
    return Math.floor(durationSec);
  }
  if (sorted.every((sample) => !sample.valid)) {
    return 0;
  }

  let totalValidMs = 0;
  for (let index = 0; index < sorted.length; index += 1) {
    if (!sorted[index].valid) continue;

    const prev =
      index === 0 ? 0 : (sorted[index - 1].timeMs + sorted[index].timeMs) / 2;
    const next =
      index === sorted.length - 1
        ? durationMs
        : (sorted[index].timeMs + sorted[index + 1].timeMs) / 2;

    totalValidMs += Math.max(0, next - prev);
  }

  return Math.max(1, Math.round(totalValidMs / 1000));
}
