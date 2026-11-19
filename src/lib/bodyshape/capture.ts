/**
 * Combine per-frame results into one capture, and estimate fat-free mass.
 */

import { EXTRACTOR_VERSION } from "./measure";
import type { BodyShapeCapture, BodyShapeSource, FrameRejectReason, FrameResult, Measurements } from "./types";

export const MIN_GOOD_FRAMES = 5;

export interface CaptureMeta {
  source: BodyShapeSource;
  frameWidth: number;
  frameHeight: number;
  heightCm?: number | null;
  weightKg?: number | null;
  poseModel: string;
  segmentationModel: string;
  appVersion: string;
  platform: string;
  deviceModel: string;
  consentVersion: string;
  assessmentId?: string;
  strengthId?: string;
}

export type CaptureOutcome =
  | { ok: true; capture: BodyShapeCapture }
  | { ok: false; reason: "too_few_good_frames"; framesUsed: number; rejectCounts: Partial<Record<FrameRejectReason, number>> };

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function cv(xs: number[]): number {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  if (xs.length < 2 || mean === 0) return 0;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1));
  return sd / Math.abs(mean);
}

/**
 * Median of each measurement across the good frames, plus its spread
 * (coefficient of variation). Returns ok=false, with the reasons frames were
 * dropped, when fewer than MIN_GOOD_FRAMES frames pass. Set `capturedAt`
 * (server timestamp) when writing the document.
 */
export function combineCapture(frames: FrameResult[], meta: CaptureMeta): CaptureOutcome {
  const good = frames.filter((f) => f.ok);
  if (good.length < MIN_GOOD_FRAMES) {
    const rejectCounts: Partial<Record<FrameRejectReason, number>> = {};
    for (const f of frames) for (const r of f.reasons) rejectCounts[r] = (rejectCounts[r] ?? 0) + 1;
    return { ok: false, reason: "too_few_good_frames", framesUsed: good.length, rejectCounts };
  }
  const keys = new Set(good.flatMap((f) => Object.keys(f.measurements)));
  const measurements: Measurements = {};
  const spread: Measurements = {};
  for (const k of keys) {
    const vals = good.map((f) => f.measurements[k]).filter((v): v is number => Number.isFinite(v));
    if (vals.length * 2 < good.length) continue; // measured in under half the good frames: leave out
    measurements[k] = median(vals);
    spread[k] = cv(vals);
  }
  const pxs = good.map((f) => f.pxPerCm).filter((v): v is number => v != null);
  const capture: BodyShapeCapture = {
    source: meta.source,
    ...(meta.assessmentId ? { assessmentId: meta.assessmentId } : {}),
    ...(meta.strengthId ? { strengthId: meta.strengthId } : {}),
    extractorVersion: EXTRACTOR_VERSION,
    poseModel: meta.poseModel,
    segmentationModel: meta.segmentationModel,
    appVersion: meta.appVersion,
    platform: meta.platform,
    deviceModel: meta.deviceModel,
    frameWidth: meta.frameWidth,
    frameHeight: meta.frameHeight,
    framesAnalysed: frames.length,
    framesUsed: good.length,
    heightCm: meta.heightCm ?? null,
    weightKg: meta.weightKg ?? null,
    pxPerCm: pxs.length ? median(pxs) : null,
    scaleMethod: good[0].scaleMethod,
    measurements,
    spread,
    quality: {
      landmarkConfidence: median(good.map((f) => f.quality.landmarkConfidence)),
      sideOnScore: median(good.map((f) => f.quality.sideOnScore)),
      poseAngleDeg: median(good.map((f) => f.quality.poseAngleDeg)),
    },
    consentVersion: meta.consentVersion,
  };
  return { ok: true, capture };
}

export interface CompositionInput {
  weightKg: number;
  heightCm: number;
  sex: "male" | "female";
  ageYears?: number | null;
  /** Latest capture's measurements, used once a calibrated equation is supplied. */
  measurements?: Measurements | null;
}

/**
 * A calibrated linear equation for fat-free mass (kg), fitted later against DXA:
 * ffm = intercept + Σ terms[name] · value, over weightKg, heightCm, male (1/0),
 * ageYears and any measurement key (e.g. bellyDepthRel). Delivered as a JSON file.
 */
export interface FfmEquation {
  version: string;
  intercept: number;
  terms: Record<string, number>;
}

export interface CompositionEstimate {
  fatFreeMassKg: number;
  fatMassKg: number;
  bodyFatPct: number;
  method: string;
  provisional: boolean;
}

/**
 * Fat-free mass estimate.
 *
 * Default (provisional): Janmahasatian et al. 2005 lean-body-weight formula,
 * which uses weight, height and sex only (it cannot see body shape):
 *   men   9270 × W / (6680 + 216 × BMI)
 *   women 9270 × W / (8780 + 244 × BMI)
 * With a calibrated `equation` and every input it needs, that equation is used
 * instead. Results are kept between 50% and 98% of body weight.
 */
export function estimateFatFreeMass(input: CompositionInput, equation?: FfmEquation | null): CompositionEstimate | null {
  const { weightKg: w, heightCm: h, sex } = input;
  if (!(w > 0) || !(h > 0)) return null;
  const clamp = (ffm: number) => Math.min(0.98 * w, Math.max(0.5 * w, ffm));
  const done = (ffm: number, method: string, provisional: boolean): CompositionEstimate => {
    const f = clamp(ffm);
    return { fatFreeMassKg: f, fatMassKg: w - f, bodyFatPct: ((w - f) / w) * 100, method, provisional };
  };

  if (equation) {
    const values: Record<string, number | null | undefined> = {
      weightKg: w,
      heightCm: h,
      male: sex === "male" ? 1 : 0,
      ageYears: input.ageYears,
      ...(input.measurements ?? {}),
    };
    let ffm = equation.intercept;
    let complete = true;
    for (const [name, coef] of Object.entries(equation.terms)) {
      const v = values[name];
      if (v == null || !Number.isFinite(v)) {
        complete = false;
        break;
      }
      ffm += coef * v;
    }
    if (complete) return done(ffm, equation.version, false);
  }

  const bmi = w / (h / 100) ** 2;
  const ffm = sex === "male" ? (9270 * w) / (6680 + 216 * bmi) : (9270 * w) / (8780 + 244 * bmi);
  return done(ffm, "janmahasatian-2005", true);
}
