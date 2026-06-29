import { isStrengthDevSkipPoseCheck } from '../../config/strengthDev';
import { MIN_PLANK_RECORDING_SEC } from '../../config/strengthRecording';
import { analyzePlankVideoFrames } from './analyzePlankVideoFrames';
import {
  emptyPoseStats,
  type PlankPoseSessionStats,
} from './plankPoseSession';
import {
  validatePlankRecording,
  type PlankValidationResult,
} from './validatePlankRecording';

export type PlankVideoReview = {
  videoUri: string;
  durationSec: number;
  poseStats: PlankPoseSessionStats;
  validation: PlankValidationResult;
};

export async function reviewPlankVideo(
  videoUri: string,
  durationSec: number,
): Promise<PlankVideoReview> {
  const safeDuration = Math.max(0, Math.floor(durationSec));

  if (isStrengthDevSkipPoseCheck()) {
    return {
      videoUri,
      durationSec: Math.max(safeDuration, MIN_PLANK_RECORDING_SEC),
      poseStats: {
        ...emptyPoseStats(),
        sampledFrames: 1,
        validFrames: 1,
        estimatedValidHoldSec: Math.max(safeDuration, MIN_PLANK_RECORDING_SEC),
      },
      validation: {
        ok: true,
        minValidFrames: 1,
        message: 'Dev mode: pose check skipped.',
      },
    };
  }

  const poseStats = await analyzePlankVideoFrames(videoUri, safeDuration);
  const validation = validatePlankRecording(safeDuration, poseStats);

  return {
    videoUri,
    durationSec: safeDuration,
    poseStats,
    validation,
  };
}
