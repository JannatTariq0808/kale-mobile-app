import * as VideoThumbnails from 'expo-video-thumbnails';
import {
  MAX_POST_RECORDING_FRAME_SAMPLES,
  POST_RECORDING_FRAME_INTERVAL_SEC,
} from '../../config/strengthRecording';
import { ensureLocalVideoUri } from '../../utils/ensureLocalVideoUri';
import { estimateValidPlankHoldSec } from '../../utils/estimateValidPlankHoldSec';
import { analyzePlankFrameUri } from './analyzePlankFrame';
import type { PlankPoseSessionStats } from './plankPoseSession';

const FRAME_ANALYSIS_GAP_MS = 350;

function pickThumbnailTimesMs(durationSec: number): number[] {
  const durationMs = Math.max(1000, Math.floor(durationSec * 1000));
  const intervalMs = POST_RECORDING_FRAME_INTERVAL_SEC * 1000;
  const count = Math.min(
    MAX_POST_RECORDING_FRAME_SAMPLES,
    Math.max(3, Math.ceil(durationMs / intervalMs) + 1),
  );

  if (count <= 1) {
    return [0];
  }

  const times = Array.from({ length: count }, (_, index) => {
    const fraction = index / (count - 1);
    return Math.min(durationMs - 1, Math.floor(durationMs * fraction));
  });

  return [...new Set(times)].sort((a, b) => a - b);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Extract stills from the saved video and run plank pose checks (after recording only). */
export async function analyzePlankVideoFrames(
  videoUri: string,
  durationSec: number,
): Promise<PlankPoseSessionStats> {
  const sampleIntervalSec = POST_RECORDING_FRAME_INTERVAL_SEC;
  let sampledFrames = 0;
  let validFrames = 0;
  let networkErrors = 0;
  let serviceErrors = 0;
  let quotaErrors = 0;
  const frameSamples: { timeMs: number; valid: boolean }[] = [];

  const localVideoUri = await ensureLocalVideoUri(videoUri);
  const timestampsMs = pickThumbnailTimesMs(durationSec);

  if (__DEV__) {
    console.log('[strength] sampling video frames', {
      durationSec,
      timestampsMs,
      videoUri: localVideoUri.slice(0, 48),
    });
  }

  for (const [index, time] of timestampsMs.entries()) {
    if (index > 0) {
      await sleep(FRAME_ANALYSIS_GAP_MS);
    }

    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(localVideoUri, {
        time,
        quality: 0.25,
      });
      if (!uri) {
        sampledFrames += 1;
        serviceErrors += 1;
        frameSamples.push({ timeMs: time, valid: false });
        if (__DEV__) {
          console.warn('[strength] thumbnail empty at', time, 'ms');
        }
        continue;
      }

      const result = await analyzePlankFrameUri(uri);
      sampledFrames += 1;
      frameSamples.push({ timeMs: time, valid: result.valid });

      if (__DEV__) {
        console.log('[strength] frame result', {
          timeMs: time,
          valid: result.valid,
          confidence: result.confidence,
          error: result.error,
        });
      }

      if (result.error === 'network') networkErrors += 1;
      else if (result.error === 'quota') {
        quotaErrors += 1;
        break;
      } else if (result.error === 'service' || result.error === 'auth') serviceErrors += 1;

      if (result.valid) {
        validFrames += 1;
      }
    } catch (error) {
      sampledFrames += 1;
      serviceErrors += 1;
      frameSamples.push({ timeMs: time, valid: false });
      if (__DEV__) {
        console.warn('[strength] thumbnail failed at', time, 'ms', error);
      }
    }
  }

  const estimatedValidHoldSec = estimateValidPlankHoldSec(durationSec, frameSamples);

  if (__DEV__) {
    console.log('[strength] estimated valid hold', {
      recordedSec: durationSec,
      estimatedValidHoldSec,
      validFrames,
      sampledFrames,
    });
  }

  return {
    sampledFrames,
    validFrames,
    estimatedValidHoldSec,
    sampleIntervalSec,
    networkErrors,
    serviceErrors,
    quotaErrors,
  };
}
