/**
 * Body shape from the plank video (spec: "Body shape from exercise videos: capture spec").
 *
 * Runs after the strength result is saved, entirely on the phone:
 *   ~10 full-resolution frames from the valid hold -> on-device pose + person mask
 *   (MediaPipe, modules/body-shape-vision) -> measureFrame -> combineCapture ->
 *   write numbers only to Firestore -> delete the frames.
 *
 * Research data only: not shown to members, not used in pricing. Separate from the
 * plank form check (which uploads 480 px frames): nothing here is uploaded, and it
 * never reuses those frames. Any failure is silent and never affects the strength test.
 */
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system/legacy';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import {
  detectBodyShapeFrame,
  isBodyShapeVisionAvailable,
  type NativeFrameDetection,
} from '../../../modules/body-shape-vision';
import {
  combineCapture,
  measureFrame,
  type FrameResult,
  type Landmarks,
} from '../../lib/bodyshape';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { resolveAuthEmail } from '../quotes/fetchActiveQuote';
import { ensureLocalVideoUri } from '../../utils/ensureLocalVideoUri';
import {
  BODY_SHAPE_CONSENT_VERSION,
  getBodyShapeConsent,
  isBodyShapeEnabled,
} from './settings';

const FRAME_COUNT = 10;
/** Skip the first and last 3 seconds of the valid hold. */
const EDGE_SKIP_MS = 3000;
const MASK_MAX_SIDE = 512;
/** Heights outside this range are treated as missing. */
const HEIGHT_RANGE_CM: [number, number] = [120, 230];

export type PlankBodyShapeInput = {
  uid: string;
  videoUri: string;
  durationSec: number;
  validWindowMs?: { startMs: number; endMs: number } | null;
  strengthId?: string;
};

/** Evenly spread times inside the valid hold, skipping its first and last 3 s. */
export function pickBodyShapeFrameTimes(
  durationSec: number,
  validWindowMs: { startMs: number; endMs: number } | null | undefined,
  count = FRAME_COUNT,
): number[] {
  const durationMs = Math.max(0, Math.floor(durationSec * 1000));
  const start = (validWindowMs?.startMs ?? 0) + EDGE_SKIP_MS;
  const end = Math.min(validWindowMs?.endMs ?? durationMs, durationMs) - EDGE_SKIP_MS;
  if (end <= start) return [];
  return Array.from({ length: count }, (_, i) => Math.round(start + ((end - start) * i) / (count - 1)));
}

/** Height from the member's Kale quote answers (height_in_cm), or null. */
async function quoteHeightCm(uid: string): Promise<number | null> {
  const email = await resolveAuthEmail(uid);
  if (!email) return null;
  const snap = await getDocs(
    query(collection(getFirebaseFirestore(), 'quotes'), where('email', '==', email)),
  );
  for (const d of snap.docs) {
    const answers = (d.data().answers ?? {}) as Record<string, unknown>;
    const raw = answers.height_in_cm ?? answers.height_cm_input;
    const cm = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number.parseFloat(raw) : NaN;
    if (Number.isFinite(cm) && cm >= HEIGHT_RANGE_CM[0] && cm <= HEIGHT_RANGE_CM[1]) return cm;
  }
  return null;
}

async function profileWeightKg(uid: string): Promise<number | null> {
  const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  const raw = data.weightKg ?? data.weight_kg ?? data.weight_in_kg ?? data.weight;
  const value = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number.parseFloat(raw) : NaN;
  if (!Number.isFinite(value) || value <= 0) return null;
  const unit = typeof data.weight_unit === 'string' ? data.weight_unit.toLowerCase() : 'kg';
  return unit.startsWith('lb') ? value * 0.453592 : value;
}

/** Firestore rejects undefined values: drop them (nested maps included). */
function withoutUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withoutUndefined) as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, withoutUndefined(v)]),
    ) as T;
  }
  return value;
}

function base64ToBytes(base64: string): Uint8Array {
  const bin = globalThis.atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deleteQuietly(uri: string | undefined) {
  if (!uri) return;
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    /* frames are in the app cache; the OS clears them anyway */
  }
}

/** Analyse one frame and delete it straight away. */
async function analyseFrame(
  videoUri: string,
  timeMs: number,
  heightCm: number | null,
): Promise<{ result: FrameResult; detection: NativeFrameDetection } | null> {
  let frameUri: string | undefined;
  try {
    const thumb = await VideoThumbnails.getThumbnailAsync(videoUri, { time: timeMs, quality: 1 });
    frameUri = thumb.uri;
    const detection = await detectBodyShapeFrame(frameUri, MASK_MAX_SIDE);
    if (!detection) return null;
    const result = measureFrame(
      {
        landmarks: detection.landmarks as Landmarks,
        mask: {
          width: detection.mask.width,
          height: detection.mask.height,
          data: base64ToBytes(detection.mask.base64),
        },
        frameWidth: detection.width,
        frameHeight: detection.height,
      },
      { source: 'plank', heightCm, maskThreshold: 128 },
    );
    if (detection.poseCount > 1 && result.ok) {
      return { result: { ...result, ok: false, reasons: [...result.reasons, 'extra_person_or_noise'] }, detection };
    }
    return { result, detection };
  } finally {
    await deleteQuietly(frameUri);
  }
}

/**
 * Measure body shape from a saved plank video and store the capture.
 * Never throws: returns a short status for logging only.
 */
export async function capturePlankBodyShape(input: PlankBodyShapeInput): Promise<string> {
  try {
    if (!isBodyShapeVisionAvailable()) return 'skipped:no_native_module';
    if (!(await isBodyShapeEnabled())) return 'skipped:flag_off';
    if ((await getBodyShapeConsent(input.uid)) !== true) return 'skipped:no_consent';

    const times = pickBodyShapeFrameTimes(input.durationSec, input.validWindowMs);
    if (times.length === 0) return 'skipped:hold_too_short';

    const [heightCm, weightKg, localVideoUri] = await Promise.all([
      quoteHeightCm(input.uid).catch(() => null),
      profileWeightKg(input.uid).catch(() => null),
      ensureLocalVideoUri(input.videoUri),
    ]);

    const frames: FrameResult[] = [];
    let first: NativeFrameDetection | null = null;
    for (const t of times) {
      const out = await analyseFrame(localVideoUri, t, heightCm).catch(() => null);
      if (!out) continue;
      frames.push(out.result);
      first ??= out.detection;
    }
    if (!first) return 'skipped:no_frames_detected';

    const outcome = combineCapture(frames, {
      source: 'plank',
      frameWidth: first.width,
      frameHeight: first.height,
      heightCm,
      weightKg,
      poseModel: first.poseModel,
      segmentationModel: first.segmentationModel,
      appVersion: Constants.expoConfig?.version ?? 'unknown',
      platform: Platform.OS,
      deviceModel: Device.modelName ?? 'unknown',
      consentVersion: BODY_SHAPE_CONSENT_VERSION,
      strengthId: input.strengthId,
    });

    if (!outcome.ok) {
      // Rollout metric: why frames were dropped. Nothing is written.
      console.log('[bodyshape] capture not saved', {
        framesAnalysed: frames.length,
        framesUsed: outcome.framesUsed,
        rejectCounts: outcome.rejectCounts,
      });
      return 'not_saved:too_few_good_frames';
    }

    // Consent can be withdrawn while frames were processing: check again before writing.
    if ((await getBodyShapeConsent(input.uid)) !== true) return 'skipped:consent_withdrawn';

    const db = getFirebaseFirestore();
    const ref = await addDoc(collection(db, 'bodyShape', input.uid, 'captures'), {
      ...withoutUndefined(outcome.capture),
      capturedAt: serverTimestamp(),
    });
    await setDoc(
      doc(db, 'users', input.uid),
      {
        body_shape: {
          latestCaptureId: ref.id,
          latestCapturedAt: serverTimestamp(),
          latestSource: 'plank',
          captureCount: increment(1),
          measurements: withoutUndefined(outcome.capture.measurements),
        },
      },
      { merge: true },
    );
    return `saved:${ref.id}`;
  } catch (error) {
    if (__DEV__) console.warn('[bodyshape] capture failed (silent)', error);
    return 'failed';
  }
}
