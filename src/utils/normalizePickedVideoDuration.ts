/** ImagePicker duration is usually ms, but some Android picks report seconds or omit it. */
export function normalizePickedVideoDurationSec(duration: number | null | undefined): number {
  if (duration == null || !Number.isFinite(duration) || duration <= 0) {
    return 10;
  }
  if (duration > 100) {
    return Math.max(1, Math.round(duration / 1000));
  }
  return Math.max(1, Math.round(duration));
}
