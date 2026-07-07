import type {
  PlankAnalysisResult,
  PlankRecordingPayload,
} from '../../types/plankRecording';

const ANALYSIS_DELAY_MS = 1200;

function resolveHoldDuration(input: PlankRecordingPayload): {
  holdDurationSec: number;
  confidence: number;
  source: PlankAnalysisResult['source'];
  formNotes: string[];
} {
  const recorded = Math.max(0, Math.floor(input.recordedDurationSec));
  const pose = input.poseStats;

  if (pose && pose.sampledFrames > 0 && pose.validFrames > 0) {
    const estimated = Math.max(1, Math.floor(pose.estimatedValidHoldSec));
    const holdDurationSec = Math.min(recorded, estimated);

    return {
      holdDurationSec,
      confidence: pose.validFrames / pose.sampledFrames,
      source: 'pose_detection',
      formNotes: [
        `Plank detected in ${pose.validFrames}/${pose.sampledFrames} samples.`,
        `Hold time: ${holdDurationSec}s of ${recorded}s recorded.`,
      ],
    };
  }

  if (pose && pose.sampledFrames > 0) {
    return {
      holdDurationSec: 0,
      confidence: 0,
      source: 'pose_detection',
      formNotes: [
        'No valid plank detected in your recording.',
        'Only time spent in a correct plank counts toward your hold.',
      ],
    };
  }

  return {
    holdDurationSec: recorded,
    confidence: 0.55,
    source: 'recording_timer',
    formNotes: [
      'Hold time matches your recording.',
      'Frame sampling did not run — check camera permissions and try again.',
    ],
  };
}

export async function analyzePlankRecording(
  input: PlankRecordingPayload,
): Promise<PlankAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, ANALYSIS_DELAY_MS));

  const resolved = resolveHoldDuration(input);

  return {
    holdDurationSec: resolved.holdDurationSec,
    confidence: resolved.confidence,
    source: resolved.source,
    formNotes: resolved.formNotes,
  };
}

export { isPlankPoseFromLandmarks } from './analyzePlankFrame';
