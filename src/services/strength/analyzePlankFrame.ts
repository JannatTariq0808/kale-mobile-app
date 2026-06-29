import { getAuth } from 'firebase/auth';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { getKaleApiBase, kaleApiUrl } from '../../config/kaleApi';
import type { PlankFrameAnalysisError, PlankPoseFrameResult } from './plankPoseSession';

export type PoseLandmark = {
  name: string;
  x: number;
  y: number;
  visibility?: number;
};

export function isPlankPoseFromLandmarks(landmarks: PoseLandmark[]): boolean {
  if (landmarks.length < 4) return false;

  const byName = Object.fromEntries(landmarks.map((item) => [item.name, item]));
  const shoulder = byName.left_shoulder ?? byName.right_shoulder;
  const elbow = byName.left_elbow ?? byName.right_elbow;
  const hip = byName.left_hip ?? byName.right_hip;

  if (!shoulder || !elbow || !hip) return false;

  const shoulderElbowDelta = Math.abs(shoulder.y - elbow.y);
  const bodyLineDelta = Math.abs(shoulder.y - hip.y);
  const elbowUnderShoulder = elbow.y >= shoulder.y - 0.08;
  const straightBody = bodyLineDelta < 0.35;

  return elbowUnderShoulder && straightBody && shoulderElbowDelta < 0.2;
}

type AnalyzePlankFrameResponse = {
  valid?: boolean;
  confidence?: number;
  error?: string;
};

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes('network request failed') || message.includes('failed to fetch');
}

/** Shrink frames before vision API — large images exhaust Gemini output tokens. */
async function encodeFrameForVision(uri: string): Promise<string | null> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: 480 } }],
    { compress: 0.45, format: SaveFormat.JPEG, base64: true },
  );
  return result.base64 ?? null;
}

/** Calls kale-website vision API to detect a plank in a still frame. */
export async function analyzePlankFrameUri(uri: string): Promise<PlankPoseFrameResult> {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      return { valid: false, confidence: 0, error: 'auth' };
    }

    const idToken = await user.getIdToken();
    const imageBase64 = await encodeFrameForVision(uri);
    if (!imageBase64) {
      return { valid: false, confidence: 0, error: 'service' };
    }

    if (__DEV__ && imageBase64.length > 120_000) {
      console.warn('[strength] frame still large after resize', imageBase64.length);
    }

    const url = kaleApiUrl('/api/strength/analyze-plank-frame');
    if (__DEV__) {
      console.log('[strength] analyze-plank-frame →', url, `(api base: ${getKaleApiBase()})`);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        imageBase64,
        mimeType: 'image/jpeg',
      }),
    });

    if (res.status === 503) {
      const errorBody = (await res.json().catch(() => null)) as { error?: string } | null;
      if (errorBody?.error === 'quota_exceeded') {
        return { valid: false, confidence: 0, error: 'quota' };
      }
      return { valid: false, confidence: 0, error: 'service' };
    }

    if (!res.ok) {
      if (__DEV__) {
        const errorBody = (await res.json().catch(() => null)) as
          | { hint?: string; error?: string }
          | null;
        console.warn(
          '[strength] analyze-plank-frame HTTP',
          res.status,
          errorBody?.hint ?? errorBody?.error ?? '',
        );
      }
      return { valid: false, confidence: 0, error: 'service' };
    }

    const data = (await res.json()) as AnalyzePlankFrameResponse;
    return {
      valid: data.valid === true,
      confidence:
        typeof data.confidence === 'number'
          ? Math.max(0, Math.min(1, data.confidence))
          : 0,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[strength] analyzePlankFrameUri failed', error);
    }
    if (isNetworkError(error)) {
      return { valid: false, confidence: 0, error: 'network' };
    }
    return { valid: false, confidence: 0, error: 'service' };
  }
}

export function frameErrorType(
  error?: PlankFrameAnalysisError,
): PlankFrameAnalysisError | null {
  return error ?? null;
}
