/**
 * On-device pose landmarks + person mask for body-shape capture (MediaPipe Tasks,
 * iOS and Android). Runs on still images that never leave the phone.
 *
 * The native side is optional: in Expo Go (or a build without this module) the
 * module is missing and `isBodyShapeVisionAvailable()` is false, so callers skip
 * body shape instead of crashing.
 */
import { requireOptionalNativeModule } from 'expo';

export type NativeLandmark = { x: number; y: number; visibility: number };

export type NativeFrameDetection = {
  /** Source image size in pixels. */
  width: number;
  height: number;
  /** Keyed by MediaPipe names mapped to bodyshape names (left_shoulder, ...); x/y normalised 0-1. */
  landmarks: Record<string, NativeLandmark>;
  /** Person mask, downscaled to at most `maskMaxSide`, same aspect ratio; 0-255 bytes, base64. */
  mask: { width: number; height: number; base64: string };
  /** People detected by the pose model (more than one fails the capture check). */
  poseCount: number;
  poseModel: string;
  segmentationModel: string;
};

type NativeModule = {
  detect(imageUri: string, maskMaxSide: number): Promise<NativeFrameDetection | null>;
};

const native = requireOptionalNativeModule<NativeModule>('BodyShapeVision');

export function isBodyShapeVisionAvailable(): boolean {
  return native != null;
}

/** Pose + person mask for one image file. Null when nothing usable was found. */
export async function detectBodyShapeFrame(
  imageUri: string,
  maskMaxSide = 512,
): Promise<NativeFrameDetection | null> {
  if (!native) return null;
  return native.detect(imageUri, maskMaxSide);
}
