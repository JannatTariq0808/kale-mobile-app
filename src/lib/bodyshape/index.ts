/**
 * Body shape from strength-test frames (plank now; wall sit and sit-to-stand next).
 *
 * On the phone, per strength test, after the test has been scored:
 *   1. pick ~10 full-resolution frames from the local video (see the spec);
 *   2. for each, run the on-device pose model and person segmentation, then
 *      `measureFrame({landmarks, mask, frameWidth, frameHeight}, {source, heightCm})`;
 *   3. `combineCapture(results, meta)` → write `capture` to
 *      bodyShape/{uid}/captures/{id} with a server `capturedAt`, and the summary to
 *      users/{uid}.body_shape. Discard the frames.
 * `estimateFatFreeMass` gives a provisional fat-free mass for analysis; it is
 * not shown to members.
 *
 * Only runs for members who have opted in (users/{uid}.body_shape_consent).
 */

export { EXTRACTOR_VERSION, MEASURE_POINTS, measureFrame } from "./measure";
export { MIN_GOOD_FRAMES, combineCapture, estimateFatFreeMass } from "./capture";
export type { CaptureMeta, CaptureOutcome, CompositionEstimate, CompositionInput, FfmEquation } from "./capture";
export * from "./types";
