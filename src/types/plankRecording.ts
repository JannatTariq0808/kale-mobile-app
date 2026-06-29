import type { PlankPoseSessionStats } from '../services/strength/plankPoseSession';

/** How plank hold time was derived from a recording. */
export type PlankAnalysisSource =
  | 'recording_timer'
  | 'pose_detection'
  | 'cloud_vision';

export type PlankAnalysisResult = {
  holdDurationSec: number;
  /** 0–1 confidence in the hold duration estimate. */
  confidence: number;
  source: PlankAnalysisSource;
  formNotes: string[];
};

export type { PlankPoseSessionStats };

export type PlankRecordingPayload = {
  videoUri: string;
  /** Wall-clock seconds while record button was active. */
  recordedDurationSec: number;
  poseStats?: PlankPoseSessionStats;
};
