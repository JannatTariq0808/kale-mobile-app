/** Max plank clip length (seconds) — generous cap for elite holds. */
export const MAX_PLANK_RECORDING_SEC = 600;

/** Minimum recording length before we accept a submission. */
export const MIN_PLANK_RECORDING_SEC = 3;

/** How often we sample a camera frame for pose checks while recording. */
export const PLANK_FRAME_SAMPLE_INTERVAL_MS = 1000;

/** At least this many valid frames from post-recording stills (we stop after the first hit). */
export const MIN_VALID_PLANK_FRAMES_ABSOLUTE = 1;

/** Max stills pulled from the saved video for pose checks. */
export const MAX_POST_RECORDING_FRAME_SAMPLES = 5;
