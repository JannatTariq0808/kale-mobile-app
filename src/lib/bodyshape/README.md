# Body shape from strength-test frames

Turns the plank (later wall sit and sit-to-stand) frames into body measurements and a provisional fat-free mass, **on the phone**. Spec: "Body shape from exercise videos: capture spec" (Claude Docs).

Pure TypeScript, no dependencies, no network or file access: copy `lib/bodyshape/` into the app as is.

## What the app supplies per frame

1. **Pose landmarks** from an on-device model (ML Kit Pose Detection, MediaPipe Pose Landmarker or Apple Vision). For each of `nose`, `left/right_shoulder`, `left/right_hip`, `left/right_knee`, `left/right_ankle` and `left/right_heel`, pass `{x, y, visibility}`, with x and y **normalised 0–1** to the frame. ML Kit gives pixels, so divide by the frame size; it calls visibility `inFrameLikelihood`.
2. **Person mask** from an on-device segmentation model (Apple Vision person segmentation, ML Kit Subject Segmentation or MediaPipe Image Segmenter): `{width, height, data}`, row-major, covering the whole frame with the **same aspect ratio**.
   - 0–1 confidences work as they are. For 0–255 bytes, pass `maskThreshold: 128`.
   - A mask around 400–600 px on its long side is plenty. Depths are accurate to about one mask pixel, roughly 0.4 cm at that size.

## Calls

```ts
import { measureFrame, combineCapture, estimateFatFreeMass } from "./bodyshape";

const results = frames.map((f) =>
  measureFrame({ landmarks: f.landmarks, mask: f.mask, frameWidth: f.w, frameHeight: f.h },
               { source: "plank", heightCm: quoteHeightCm /* quote answers' height_in_cm, or null */ }));

const out = combineCapture(results, {
  source: "plank", frameWidth, frameHeight, heightCm, weightKg,
  poseModel: "mlkit-pose-accurate-<version>", segmentationModel: "<name>-<version>",
  appVersion, platform, deviceModel, consentVersion: "body-shape-v1",
  assessmentId, strengthId,
});

if (out.ok) {
  // write out.capture to bodyShape/{uid}/captures/{id} with capturedAt: serverTimestamp()
  // and update users/{uid}.body_shape (latestCaptureId, latestCapturedAt, latestSource, captureCount, measurements)
} else {
  // log out.rejectCounts (why frames were dropped) for the rollout metrics; write nothing
}

// For analysis only, not shown to members:
const ffm = estimateFatFreeMass({ weightKg, heightCm, sex: "male", measurements: out.ok ? out.capture.measurements : null });
```

- `measureFrame` never throws on bad input. An unusable frame returns `ok: false` with its reasons: `landmarks_low_confidence`, `not_side_on`, `wrong_pose`, `touches_frame_edge`, `extra_person_or_noise`, `no_outline_at_torso`, `landmarks_missing` or `mask_aspect_mismatch`.
- `combineCapture` needs at least 5 good frames.
- `estimateFatFreeMass` uses the Janmahasatian 2005 formula (weight, height, sex) until we send a DXA-calibrated equation file. Pass that file as the second argument; nothing else changes.

## Notes

- **Height: don't ask members for it.** Use the height they gave in the Kale quote (`height_in_cm` in the quote answers). Without one, pass `heightCm: null`: every measurement still comes back as a share of body length (`*Rel`), and only the cm values and `estimateFatFreeMass` are skipped (it returns null without a height).
- Run it only when `users/{uid}.body_shape_consent` is true, after the strength result is saved, and never let an error here affect the strength test.
- Frames used here must not be uploaded. The plank form check's separate 480 px uploads stay as they are.
- Sit-to-stand: if the protocol has arms crossed over the chest, chest depth will include the arms. Belly and hip depth are unaffected.
- Test: `npx tsx lib/bodyshape/selfcheck.ts` (synthetic silhouettes of known size).
