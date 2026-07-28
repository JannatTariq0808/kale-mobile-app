/** Max plank clip length (seconds) — generous cap for elite holds. */
export const MAX_PLANK_RECORDING_SEC = 600;

/** Minimum recording length before we accept a submission. */
export const MIN_PLANK_RECORDING_SEC = 3;

/** How often we sample a camera frame for pose checks while recording. */
export const PLANK_FRAME_SAMPLE_INTERVAL_MS = 1000;

/** Setup gate: delay between automatic position scans (picture mode only). */
export const PLANK_SETUP_SAMPLE_INTERVAL_MS = 2800;

/** Consecutive valid preview frames required before recording can start. */
export const PLANK_SETUP_CONSECUTIVE_VALID_FRAMES = 1;

/** At least this many valid frames from post-recording stills. */
export const MIN_VALID_PLANK_FRAMES_ABSOLUTE = 1;

/** Max stills pulled from the saved video for pose checks. */
export const MAX_POST_RECORDING_FRAME_SAMPLES = 8;

/** Target spacing between post-recording stills (seconds). */
export const POST_RECORDING_FRAME_INTERVAL_SEC = 2;
