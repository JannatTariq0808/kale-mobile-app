/**
 * Measure body shape from ONE frame: pose landmarks + person mask → depths.
 *
 * Pure TypeScript, no dependencies, no I/O: safe to run on the phone. The
 * caller supplies landmarks and the mask from an on-device model (ML Kit,
 * MediaPipe or Apple Vision); this file only does geometry.
 *
 * Method: at fixed points along the body (fractions of shoulder→hip, hip→knee,
 * knee→ankle) a line is drawn square to that segment and the mask's thickness
 * along it is measured. Thickness is converted to cm with the member's height
 * (head-top to heel in pixels = height), and also kept relative to body length
 * so it is usable without a height.
 */

import type {
  BodyShapeSource,
  FrameInput,
  FrameQuality,
  FrameRejectReason,
  FrameResult,
  Landmark,
  LandmarkName,
  Measurements,
  MeasureOptions,
  PersonMask,
  ScaleMethod,
} from "./types";

export const EXTRACTOR_VERSION = "bodyshape-1.0.0";

/** Where each depth is measured (fraction along the segment, from its first joint). */
export const MEASURE_POINTS = {
  chest: 0.25, // shoulder → hip
  belly: 0.65, // shoulder → hip
  thigh: 0.5, // hip → knee
  calf: 0.5, // knee → ankle
} as const;

const MIN_LANDMARK_VISIBILITY = 0.7;
const MAX_SIDE_ON_SCORE = 0.15;
const PLANK_MAX_BEND_DEG = 15;
const WALL_SIT_MAX_TORSO_TILT_DEG = 15;
const STAND_MIN_JOINT_DEG = 160;
const MAX_EXTRA_COMPONENT_SHARE = 0.05;
const RAY_STEP_PX = 0.5;
/**
 * Shoulder→hip + hip→knee + knee→ankle as a share of standing height
 * (Drillis & Contini segment proportions, as tabulated in Winter, Biomechanics
 * and Motor Control of Human Movement): 0.288 + 0.245 + 0.246.
 */
const SEGMENTS_SHARE_OF_HEIGHT = 0.779;

type P = { x: number; y: number };

const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
const len = (a: P) => Math.hypot(a.x, a.y);
const unit = (a: P): P => {
  const l = len(a);
  return l > 0 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 0 };
};
const lerp = (a: P, b: P, t: number): P => add(a, mul(sub(b, a), t));
const dist = (a: P, b: P) => len(sub(a, b));

/** Angle at b between a-b and c-b, in degrees (180 = straight). */
function jointAngle(a: P, b: P, c: P): number {
  const u = unit(sub(a, b));
  const v = unit(sub(c, b));
  const dot = Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y));
  return (Math.acos(dot) * 180) / Math.PI;
}

class MaskView {
  constructor(
    private readonly m: PersonMask,
    private readonly thr: number,
  ) {}
  get width() {
    return this.m.width;
  }
  get height() {
    return this.m.height;
  }
  /** true = person, false = background, null = outside the image. */
  at(x: number, y: number): boolean | null {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix < 0 || iy < 0 || ix >= this.m.width || iy >= this.m.height) return null;
    return this.m.data[iy * this.m.width + ix] > this.thr;
  }
}

interface Ray {
  distPx: number;
  hitEdge: boolean;
}

/** Walk from p along dir while inside the person; distance to the outline. */
function ray(mask: MaskView, p: P, dir: P, maxPx: number): Ray {
  let d = 0;
  for (;;) {
    const next = d + RAY_STEP_PX;
    if (next > maxPx) return { distPx: d, hitEdge: false };
    const q = add(p, mul(dir, next));
    const v = mask.at(q.x, q.y);
    if (v === null) return { distPx: d, hitEdge: true };
    if (!v) return { distPx: d + RAY_STEP_PX / 2, hitEdge: false };
    d = next;
  }
}

interface Thickness {
  px: number;
  /** Distance from p to the outline on the +normal side. */
  plusPx: number;
  hitEdge: boolean;
}

/** Mask thickness through p, square to `axis`. null when p isn't on the body. */
function thicknessAt(mask: MaskView, p: P, axis: P, maxPx: number): Thickness | null {
  if (!mask.at(p.x, p.y)) return null;
  const n = { x: -axis.y, y: axis.x };
  const a = ray(mask, p, n, maxPx);
  const b = ray(mask, p, mul(n, -1), maxPx);
  return { px: a.distPx + b.distPx, plusPx: a.distPx, hitEdge: a.hitEdge || b.hitEdge };
}

/** Sizes of the person's connected regions, largest first (4-connectivity). */
function componentSizes(mask: MaskView): number[] {
  const w = mask.width;
  const h = mask.height;
  const seen = new Uint8Array(w * h);
  const sizes: number[] = [];
  const stack: number[] = [];
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || !mask.at(start % w, Math.floor(start / w))) continue;
    let size = 0;
    seen[start] = 1;
    stack.push(start);
    while (stack.length) {
      const i = stack.pop() as number;
      size++;
      const x = i % w;
      const y = (i - x) / w;
      const nbrs = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1];
      for (const j of nbrs) {
        if (j >= 0 && !seen[j] && mask.at(j % w, Math.floor(j / w))) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
    sizes.push(size);
  }
  return sizes.sort((a, b) => b - a);
}

const NEEDED = ["shoulder", "hip", "knee", "ankle"] as const;

function pick(lm: FrameInput["landmarks"], side: "left" | "right", part: string): Landmark | undefined {
  return lm[`${side}_${part}` as LandmarkName];
}

function chooseSide(lm: FrameInput["landmarks"]): "left" | "right" {
  const score = (s: "left" | "right") => NEEDED.reduce((acc, p) => acc + (pick(lm, s, p)?.visibility ?? 0), 0);
  return score("right") > score("left") ? "right" : "left";
}

function emptyResult(side: "left" | "right", reasons: FrameRejectReason[], scaleMethod: ScaleMethod): FrameResult {
  return {
    ok: false,
    reasons,
    side,
    measurements: {},
    quality: { landmarkConfidence: 0, sideOnScore: 1, poseAngleDeg: 180 },
    bodyLengthPx: null,
    scaleMethod,
    pxPerCm: null,
  };
}

function poseDeviation(source: BodyShapeSource, s: P, h: P, k: P, a: P): number {
  if (source === "plank") return 180 - jointAngle(s, h, a);
  if (source === "wall_sit") {
    const up = unit(sub(s, h));
    // Image y runs down, so "upright" is (0, -1).
    return (Math.acos(Math.max(-1, Math.min(1, -up.y))) * 180) / Math.PI;
  }
  return 180 - Math.min(jointAngle(s, h, k), jointAngle(h, k, a));
}

function poseLimit(source: BodyShapeSource): number {
  if (source === "plank") return PLANK_MAX_BEND_DEG;
  if (source === "wall_sit") return WALL_SIT_MAX_TORSO_TILT_DEG;
  return 180 - STAND_MIN_JOINT_DEG;
}

/**
 * Measure one frame. Never throws for bad input: a frame that can't be used
 * comes back with ok=false and the reasons, so the caller can count and log them.
 */
export function measureFrame(frame: FrameInput, opts: MeasureOptions): FrameResult {
  const { source } = opts;
  const scaleMethod: ScaleMethod = source === "wall_sit" ? "segments" : "head_to_heel";
  const lm = frame.landmarks;
  const side = chooseSide(lm);
  const { mask: rawMask } = frame;

  const frameAspect = frame.frameWidth / frame.frameHeight;
  const maskAspect = rawMask.width / rawMask.height;
  if (!(Math.abs(maskAspect / frameAspect - 1) < 0.02)) return emptyResult(side, ["mask_aspect_mismatch"], scaleMethod);

  const parts = NEEDED.map((p) => pick(lm, side, p));
  if (parts.some((p) => !p)) return emptyResult(side, ["landmarks_missing"], scaleMethod);
  const [sL, hL, kL, aL] = parts as Landmark[];

  const mask = new MaskView(rawMask, opts.maskThreshold ?? 0.5);
  const toPx = (l: Landmark): P => ({ x: l.x * rawMask.width, y: l.y * rawMask.height });
  const S = toPx(sL);
  const H = toPx(hL);
  const K = toPx(kL);
  const A = toPx(aL);
  const heelL = pick(lm, side, "heel");
  const heel = heelL && heelL.visibility >= 0.5 ? toPx(heelL) : A;

  const reasons: FrameRejectReason[] = [];
  const landmarkConfidence = Math.min(sL.visibility, hL.visibility, kL.visibility, aL.visibility);
  if (landmarkConfidence < MIN_LANDMARK_VISIBILITY) reasons.push("landmarks_low_confidence");

  const torsoLen = dist(S, H);
  const otherS = pick(lm, side === "left" ? "right" : "left", "shoulder");
  const sideOnScore =
    otherS && otherS.visibility >= 0.5 && sL.visibility >= 0.5 && torsoLen > 0 ? dist(S, toPx(otherS)) / torsoLen : 0;
  if (sideOnScore >= MAX_SIDE_ON_SCORE) reasons.push("not_side_on");

  const poseAngleDeg = poseDeviation(source, S, H, K, A);
  if (poseAngleDeg > poseLimit(source)) reasons.push("wrong_pose");

  const sizes = componentSizes(mask);
  if (sizes.length > 1 && sizes[1] > MAX_EXTRA_COMPONENT_SHARE * sizes[0]) reasons.push("extra_person_or_noise");

  // Body length in mask pixels.
  const torsoAxis = unit(sub(H, S)); // shoulder → hip
  const maxRay = Math.max(mask.width, mask.height);
  let bodyLengthPx: number | null = null;
  let edge = false;
  if (scaleMethod === "segments") {
    bodyLengthPx = (torsoLen + dist(H, K) + dist(K, A)) / SEGMENTS_SHARE_OF_HEIGHT;
  } else {
    // Head-top: walk from the shoulder up the torso axis, through neck and head, to the outline.
    const up = mul(torsoAxis, -1);
    const r = ray(mask, S, up, maxRay);
    if (r.hitEdge) edge = true;
    const headTop = add(S, mul(up, r.distPx));
    bodyLengthPx = dist(headTop, heel);
    const nearEdge = (p: P) => p.x < 1 || p.y < 1 || p.x > mask.width - 2 || p.y > mask.height - 2;
    if (nearEdge(headTop) || nearEdge(heel)) edge = true;
  }

  const m: Measurements = {};
  const maxThick = (bodyLengthPx ?? maxRay) * 0.5;
  const depthPx: Record<string, number | null> = {};
  const measureDepth = (key: string, p: P, axis: P) => {
    const t = thicknessAt(mask, p, axis, maxThick);
    if (t?.hitEdge) edge = true;
    depthPx[key] = t ? t.px : null;
    return t;
  };

  measureDepth("chestDepth", lerp(S, H, MEASURE_POINTS.chest), torsoAxis);
  measureDepth("bellyDepth", lerp(S, H, MEASURE_POINTS.belly), torsoAxis);
  measureDepth("hipDepth", H, torsoAxis);
  measureDepth("thighDepth", lerp(H, K, MEASURE_POINTS.thigh), unit(sub(K, H)));
  if (source !== "wall_sit") measureDepth("calfDepth", lerp(K, A, MEASURE_POINTS.calf), unit(sub(A, K)));

  // Torso side area: thickness integrated along shoulder → hip (21 samples).
  const samples: number[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = thicknessAt(mask, lerp(S, H, i / 20), torsoAxis, maxThick);
    if (t?.hitEdge) edge = true;
    if (t) samples.push(t.px);
  }
  const torsoAreaPx = samples.length >= 15 ? (samples.reduce((a, b) => a + b, 0) / samples.length) * torsoLen : null;

  // Plank only: how far the underside of the trunk falls below the shoulder→ankle line.
  if (source === "plank") {
    const lineDir = unit(sub(A, S));
    let down = { x: -lineDir.y, y: lineDir.x };
    if (down.y < 0) down = mul(down, -1); // gravity side (image y runs down)
    let best: number | null = null;
    for (let i = 8; i <= 20; i++) {
      const p = lerp(S, H, i / 20);
      if (!mask.at(p.x, p.y)) continue;
      const r = ray(mask, p, down, maxThick);
      if (r.hitEdge) edge = true;
      const b = add(p, mul(down, r.distPx));
      const offset = (b.x - S.x) * down.x + (b.y - S.y) * down.y; // signed distance from the line
      best = best === null ? offset : Math.max(best, offset);
    }
    depthPx.bellySag = best;
  }

  if (edge) reasons.push("touches_frame_edge");
  if (depthPx.bellyDepth == null || depthPx.hipDepth == null) reasons.push("no_outline_at_torso");

  const pxPerCm = opts.heightCm && opts.heightCm > 0 && bodyLengthPx ? bodyLengthPx / opts.heightCm : null;
  if (bodyLengthPx && bodyLengthPx > 0) {
    for (const [key, px] of Object.entries(depthPx)) {
      if (px == null) continue;
      m[`${key}Rel`] = px / bodyLengthPx;
      if (pxPerCm) m[`${key}Cm`] = px / pxPerCm;
    }
    if (torsoAreaPx != null) m.torsoAreaNorm = torsoAreaPx / bodyLengthPx ** 2;
    if (source === "sit_to_stand" && sizes.length) m.bodyAreaNorm = sizes[0] / bodyLengthPx ** 2;
  }

  const quality: FrameQuality = { landmarkConfidence, sideOnScore, poseAngleDeg };
  return { ok: reasons.length === 0, reasons, side, measurements: m, quality, bodyLengthPx, scaleMethod, pxPerCm };
}
