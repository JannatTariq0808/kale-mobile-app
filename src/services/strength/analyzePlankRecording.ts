import type {
  PlankAnalysisResult,
  PlankPoseSessionStats,
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
    const poseHold = Math.floor(pose.estimatedValidHoldSec);
    const holdDurationSec = Math.min(recorded, Math.max(1, poseHold));
    return {
      holdDurationSec,
      confidence: 0.72,
      source: 'pose_detection',
      formNotes: [
        `Pose sampling: ${pose.validFrames}/${pose.sampledFrames} valid frames.`,
        'Hold time uses detected plank form, capped by recording length.',
      ],
    };
  }

  if (pose && pose.sampledFrames > 0) {
    return {
      holdDurationSec: recorded,
      confidence: 0.55,
      source: 'recording_timer',
      formNotes: [
        `Sampled ${pose.sampledFrames} frames — no valid plank pose detected yet.`,
        'Hold time matches recording length until pose model is fully wired.',
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
