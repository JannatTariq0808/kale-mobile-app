/**
 * Types for body-shape measurement from strength-test frames.
 * Spec: "Body shape from exercise videos: capture spec" (Claude Docs).
 */

export type BodyShapeSource = "plank" | "wall_sit" | "sit_to_stand";

export type LandmarkName =
  | "nose"
  | "left_shoulder"
  | "right_shoulder"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle"
  | "right_ankle"
  | "left_heel"
  | "right_heel";

/**
 * One pose landmark, as ML Kit / MediaPipe / Apple Vision report it.
 * x and y are NORMALISED to the frame: 0 = left/top edge, 1 = right/bottom edge.
 * visibility (or "inFrameLikelihood" / confidence) is 0–1.
 */
export interface Landmark {
  x: number;
  y: number;
  visibility: number;
}

export type Landmarks = Partial<Record<LandmarkName, Landmark>>;

/**
 * Person segmentation mask covering the WHOLE frame (same aspect ratio as the
 * frame, any resolution). Row-major: data[y * width + x]. Values above
 * `maskThreshold` (default 0.5) count as the person, so pass 0–1 confidences
 * as they are, or set maskThreshold to 128 for 0–255 bytes.
 */
export interface PersonMask {
  width: number;
  height: number;
  data: ArrayLike<number>;
}

export interface FrameInput {
  landmarks: Landmarks;
  mask: PersonMask;
  /** Frame size in pixels (used to check the mask's aspect ratio). */
  frameWidth: number;
  frameHeight: number;
}

export interface MeasureOptions {
  source: BodyShapeSource;
  /** Height from the member's Kale quote (height_in_cm); never ask for it. Without it only the scale-free *_Rel measurements are produced. */
  heightCm?: number | null;
  maskThreshold?: number;
}

/** Depth measurements: each in cm (needs height) and relative to body length. */
export const DEPTH_KEYS = ["chestDepth", "bellyDepth", "hipDepth", "thighDepth", "calfDepth", "bellySag"] as const;
export type DepthKey = (typeof DEPTH_KEYS)[number];

/**
 * Flat map of measurements. Keys: `<depth>Cm`, `<depth>Rel` for each DEPTH_KEYS
 * entry, plus `torsoAreaNorm` and (sit-to-stand only) `bodyAreaNorm`.
 * A measurement that couldn't be taken is simply absent.
 */
export type Measurements = Record<string, number>;

export type ScaleMethod = "head_to_heel" | "segments";

export type FrameRejectReason =
  | "mask_aspect_mismatch"
  | "landmarks_missing"
  | "landmarks_low_confidence"
  | "not_side_on"
  | "wrong_pose"
  | "touches_frame_edge"
  | "extra_person_or_noise"
  | "no_outline_at_torso";

export interface FrameQuality {
  /** Lowest visibility among the shoulder, hip, knee and ankle used. */
  landmarkConfidence: number;
  /** Gap between the two shoulders ÷ shoulder-to-hip length (0 = perfectly side-on). */
  sideOnScore: number;
  /** Degrees away from the target pose (0 = perfect). */
  poseAngleDeg: number;
}

export interface FrameResult {
  ok: boolean;
  reasons: FrameRejectReason[];
  side: "left" | "right";
  measurements: Measurements;
  quality: FrameQuality;
  /** Body length in mask pixels: head-top to heel, or estimated from segments (wall sit). */
  bodyLengthPx: number | null;
  scaleMethod: ScaleMethod;
  /** Mask pixels per cm, when height is known. */
  pxPerCm: number | null;
}

/** Firestore document for bodyShape/{uid}/captures/{captureId} (set capturedAt server-side). */
export interface BodyShapeCapture {
  source: BodyShapeSource;
  assessmentId?: string;
  strengthId?: string;
  extractorVersion: string;
  poseModel: string;
  segmentationModel: string;
  appVersion: string;
  platform: string;
  deviceModel: string;
  frameWidth: number;
  frameHeight: number;
  framesAnalysed: number;
  framesUsed: number;
  heightCm: number | null;
  weightKg: number | null;
  pxPerCm: number | null;
  scaleMethod: ScaleMethod;
  measurements: Measurements;
  spread: Measurements;
  quality: FrameQuality;
  consentVersion: string;
}
