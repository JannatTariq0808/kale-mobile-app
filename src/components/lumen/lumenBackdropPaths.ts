/** KaleLumen.jsx LumenBackdrop — 13s curve drift keyframes */
export const LUMEN_CURVE_CYCLE_MS = 13000;

/** [V232, C1x, C1y, C2x, C2y, yEnd] for upper fill path */
export const UPPER_CURVE_KEYFRAMES = [
  [232, 268, 322, 140, 506, 432],
  [244, 258, 338, 152, 478, 420],
  [226, 276, 312, 132, 520, 440],
] as const;

/** [yStart, C1x, C1y, C2x, C2y, yEnd] for glass-edge stroke */
export const GLASS_CURVE_KEYFRAMES = [
  [432, 140, 506, 268, 322, 232],
  [420, 152, 478, 258, 338, 244],
  [440, 132, 520, 276, 312, 226],
] as const;

/** SMIL keyTimes 0;0.34;0.7;1 — segment boundaries on 0–1 timeline */
const SEGMENTS = [
  { start: 0, end: 0.34, from: 0, to: 1 },
  { start: 0.34, end: 0.7, from: 1, to: 2 },
  { start: 0.7, end: 1, from: 2, to: 0 },
] as const;

function lerp(a: number, b: number, t: number) {
  'worklet';
  return a + (b - a) * t;
}

/** Approximate SMIL keySplines .45 0 .55 1 */
function easeSegment(t: number) {
  'worklet';
  const u = 1 - t;
  return 1 - u * u * u;
}

function interpolateKeyframeSet(keyframes: readonly (readonly number[])[], progress: number) {
  'worklet';
  const t = progress >= 1 ? 0.999999 : progress < 0 ? 0 : progress;

  for (const seg of SEGMENTS) {
    if (t >= seg.start && t <= seg.end) {
      const local = (t - seg.start) / (seg.end - seg.start);
      const eased = easeSegment(local);
      const from = keyframes[seg.from];
      const to = keyframes[seg.to];
      return from.map((v, i) => lerp(v, to[i], eased));
    }
  }

  return [...keyframes[0]];
}

export function upperPathAt(progress: number) {
  'worklet';
  const [v1, c1x, c1y, c2x, c2y, y2] = interpolateKeyframeSet(UPPER_CURVE_KEYFRAMES, progress);
  return `M0,0 H390 V${v1} C ${c1x},${c1y} ${c2x},${c2y} 0,${y2} Z`;
}

export function glassCurvePathAt(progress: number) {
  'worklet';
  const [y0, c1x, c1y, c2x, c2y, y1] = interpolateKeyframeSet(GLASS_CURVE_KEYFRAMES, progress);
  return `M0,${y0} C ${c1x},${c1y} ${c2x},${c2y} 390,${y1}`;
}
