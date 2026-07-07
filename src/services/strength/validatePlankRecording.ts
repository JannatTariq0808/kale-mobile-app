import { getKaleApiBase } from '../../config/kaleApi';
import {
  MIN_PLANK_RECORDING_SEC,
  MIN_VALID_PLANK_FRAMES_ABSOLUTE,
  PLANK_FRAME_SAMPLE_INTERVAL_MS,
} from '../../config/strengthRecording';
import type { PlankPoseSessionStats } from './plankPoseSession';

export type PlankValidationReason =
  | 'too_short'
  | 'no_samples'
  | 'analysis_unavailable'
  | 'no_plank_detected';

export type PlankValidationResult = {
  ok: boolean;
  reason?: PlankValidationReason;
  message: string;
  minValidFrames: number;
};

function connectivityHint(): string {
  const base = getKaleApiBase();
  if (base.includes('localhost') || base.includes('127.0.0.1')) {
    return ' On a physical phone, set EXPO_PUBLIC_KALE_API_BASE to your computer\'s LAN IP (e.g. http://192.168.x.x:3000), not localhost.';
  }
  return ' Make sure kale-website is running and GEMINI_API_KEY is set.';
}

export function validatePlankRecording(
  durationSec: number,
  poseStats: PlankPoseSessionStats,
): PlankValidationResult {
  const minValidFrames = MIN_VALID_PLANK_FRAMES_ABSOLUTE;

  if (durationSec < MIN_PLANK_RECORDING_SEC) {
    return {
      ok: false,
      reason: 'too_short',
      minValidFrames,
      message: `Hold the plank for at least ${MIN_PLANK_RECORDING_SEC} seconds, then stop.`,
    };
  }

  if (poseStats.sampledFrames < 1) {
    return {
      ok: false,
      reason: 'no_samples',
      minValidFrames,
      message:
        'We could not read frames from your video. Film from the side with good lighting and try again.',
    };
  }

  if (poseStats.networkErrors > 0 && poseStats.validFrames === 0) {
    return {
      ok: false,
      reason: 'analysis_unavailable',
      minValidFrames,
      message: `Could not reach Kale to check your form.${connectivityHint()}`,
    };
  }

  if (poseStats.quotaErrors > 0) {
    return {
      ok: false,
      reason: 'analysis_unavailable',
      minValidFrames,
      message:
        'Vision API quota exceeded. Wait a few minutes and try again, or check billing for your AI provider.',
    };
  }

  if (poseStats.serviceErrors === poseStats.sampledFrames && poseStats.validFrames === 0) {
    return {
      ok: false,
      reason: 'analysis_unavailable',
      minValidFrames,
      message: `Plank checking is temporarily unavailable. Set ANTHROPIC_API_KEY (or GEMINI_API_KEY) in kale-website .env.local and restart npm run dev.`,
    };
  }

  if (poseStats.validFrames < minValidFrames) {
    return {
      ok: false,
      reason: 'no_plank_detected',
      minValidFrames,
      message:
        'No plank detected. Prop your phone to the side, keep shoulders–hips–legs visible, hold a straight plank, then record again.',
    };
  }

  const validHoldSec = Math.min(durationSec, Math.floor(poseStats.estimatedValidHoldSec));
  if (validHoldSec < MIN_PLANK_RECORDING_SEC) {
    return {
      ok: false,
      reason: 'too_short',
      minValidFrames,
      message: `Only about ${validHoldSec}s of valid plank detected. Hold a straight plank for at least ${MIN_PLANK_RECORDING_SEC} seconds, then stop.`,
    };
  }

  return {
    ok: true,
    minValidFrames,
    message: `About ${validHoldSec}s of valid plank detected (${durationSec}s recorded). Submit?`,
  };
}

export function emptyPoseStats(): PlankPoseSessionStats {
  return {
    sampledFrames: 0,
    validFrames: 0,
    estimatedValidHoldSec: 0,
    sampleIntervalSec: PLANK_FRAME_SAMPLE_INTERVAL_MS / 1000,
    networkErrors: 0,
    serviceErrors: 0,
    quotaErrors: 0,
  };
}
