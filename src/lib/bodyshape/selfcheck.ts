/**
 * Self-check for lib/bodyshape on synthetic silhouettes of known size (no real images).
 *
 *   npx tsx lib/bodyshape/selfcheck.ts
 *
 * The standing figure is 180 cm drawn at 5 px/cm in a 600 × 1000 mask:
 *   torso 24 cm deep (belly band 30 cm), thigh 16 cm, calf 12 cm.
 * The plank is the same figure lying horizontally (mask transposed).
 */
import assert from "node:assert";
import {
  combineCapture,
  estimateFatFreeMass,
  measureFrame,
  type FrameInput,
  type FrameResult,
  type Landmarks,
  type PersonMask,
} from "./index";

type Rect = [x0: number, y0: number, x1: number, y1: number];

function drawStanding(extra: Rect[] = []): PersonMask {
  const W = 600;
  const H = 1000;
  const data = new Float32Array(W * H);
  const rects: Rect[] = [
    [285, 160, 315, 205], // neck
    [240, 200, 360, 500], // torso, 120 px = 24 cm
    [225, 360, 375, 420], // belly band, 150 px = 30 cm
    [260, 500, 340, 700], // thigh, 80 px = 16 cm
    [270, 700, 330, 920], // calf, 60 px = 12 cm
    [280, 920, 380, 951], // foot
    ...extra,
  ];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const inHead = (x - 300) ** 2 + (y - 110) ** 2 <= 60 ** 2; // crown at y = 50
      const inRect = rects.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1);
      if (inHead || inRect) data[y * W + x] = 1;
    }
  }
  return { width: W, height: H, data };
}

const pts = { shoulder: [300, 230], hip: [300, 470], knee: [300, 700], ankle: [300, 920], heel: [300, 950] } as const;

function standingLandmarks(W = 600, H = 1000, vis = 0.95, hipY: number = pts.hip[1]): Landmarks {
  const l = (x: number, y: number) => ({ x: x / W, y: y / H, visibility: vis });
  const out: Landmarks = {};
  for (const side of ["left", "right"] as const) {
    out[`${side}_shoulder`] = l(...pts.shoulder);
    out[`${side}_hip`] = l(pts.hip[0], hipY);
    out[`${side}_knee`] = l(...pts.knee);
    out[`${side}_ankle`] = l(...pts.ankle);
    out[`${side}_heel`] = l(...pts.heel);
  }
  return out;
}

/** Same figure lying down: (x, y) → (y, x). */
function transposeMask(m: PersonMask): PersonMask {
  const data = new Float32Array(m.width * m.height);
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) data[x * m.height + y] = m.data[y * m.width + x];
  return { width: m.height, height: m.width, data };
}
function transposeLandmarks(l: Landmarks): Landmarks {
  const out: Landmarks = {};
  for (const [k, v] of Object.entries(l)) if (v) out[k as keyof Landmarks] = { x: v.y, y: v.x, visibility: v.visibility };
  return out;
}

const near = (got: number | undefined, want: number, tol: number, what: string) =>
  assert.ok(got !== undefined && Math.abs(got - want) <= tol, `${what}: got ${got}, want ${want} ± ${tol}`);

let checks = 0;
function check(name: string, fn: () => void) {
  fn();
  checks++;
  console.log(`  ✓ ${name}`);
}

const standMask = drawStanding();
const standing: FrameInput = { landmarks: standingLandmarks(), mask: standMask, frameWidth: 1080, frameHeight: 1800 };
const plank: FrameInput = {
  landmarks: transposeLandmarks(standingLandmarks()),
  mask: transposeMask(standMask),
  frameWidth: 1800,
  frameHeight: 1080,
};

console.log("bodyshape self-check:");

check("standing: scale from head-top to heel = 5 px/cm", () => {
  const r = measureFrame(standing, { source: "sit_to_stand", heightCm: 180 });
  assert.ok(r.ok, `reasons ${r.reasons}`);
  near(r.bodyLengthPx ?? undefined, 900, 2, "body length px");
  near(r.pxPerCm ?? undefined, 5, 0.02, "px per cm");
});

check("standing: depths match the drawn figure", () => {
  const m = measureFrame(standing, { source: "sit_to_stand", heightCm: 180 }).measurements;
  near(m.chestDepthCm, 24, 0.4, "chest");
  near(m.bellyDepthCm, 30, 0.4, "belly");
  near(m.hipDepthCm, 24, 0.4, "hip");
  near(m.thighDepthCm, 16, 0.4, "thigh");
  near(m.calfDepthCm, 12, 0.4, "calf");
  near(m.bellyDepthRel, 30 / 180, 0.003, "belly relative to body length");
  assert.ok(m.torsoAreaNorm > 0 && m.bodyAreaNorm > 0, "areas present");
  assert.equal(m.bellySagCm, undefined, "belly sag is plank-only");
});

check("no height: relative measures only", () => {
  const r = measureFrame(standing, { source: "sit_to_stand" });
  assert.ok(r.ok);
  assert.equal(r.measurements.bellyDepthCm, undefined);
  near(r.measurements.bellyDepthRel, 30 / 180, 0.003, "belly rel");
});

check("plank: same depths lying down, belly sag 15 cm", () => {
  const r = measureFrame(plank, { source: "plank", heightCm: 180 });
  assert.ok(r.ok, `reasons ${r.reasons}`);
  near(r.measurements.bellyDepthCm, 30, 0.4, "plank belly");
  near(r.measurements.hipDepthCm, 24, 0.4, "plank hip");
  near(r.measurements.bellySagCm, 15, 0.4, "belly sag");
  near(r.quality.poseAngleDeg, 0, 0.5, "straight plank");
});

check("wall sit: scale from body segments", () => {
  const r = measureFrame(standing, { source: "wall_sit", heightCm: 180 });
  assert.equal(r.scaleMethod, "segments");
  near(r.bodyLengthPx ?? undefined, 690 / 0.779, 1, "segment-based length");
  assert.equal(r.measurements.calfDepthCm, undefined, "no calf in a wall sit");
});

check("rejects: low landmark confidence", () => {
  const r = measureFrame({ ...standing, landmarks: standingLandmarks(600, 1000, 0.5) }, { source: "sit_to_stand", heightCm: 180 });
  assert.ok(!r.ok && r.reasons.includes("landmarks_low_confidence"));
});

check("rejects: bent plank", () => {
  const bent = { ...plank, landmarks: transposeLandmarks(standingLandmarks(600, 1000, 0.95, 470)) };
  const hipUp = bent.landmarks.left_hip;
  if (hipUp) hipUp.y -= 80 / 600; // hips piked up by 80 px
  if (bent.landmarks.right_hip) bent.landmarks.right_hip.y -= 80 / 600;
  const r = measureFrame(bent, { source: "plank", heightCm: 180 });
  assert.ok(!r.ok && r.reasons.includes("wrong_pose"), `reasons ${r.reasons}`);
});

check("rejects: body touching the frame edge", () => {
  const wide: FrameInput = { ...standing, mask: drawStanding([[0, 300, 600, 330]]) };
  const r = measureFrame(wide, { source: "sit_to_stand", heightCm: 180 });
  assert.ok(!r.ok && r.reasons.includes("touches_frame_edge"), `reasons ${r.reasons}`);
});

check("rejects: second person or large noise", () => {
  const two: FrameInput = { ...standing, mask: drawStanding([[480, 600, 560, 700]]) };
  const r = measureFrame(two, { source: "sit_to_stand", heightCm: 180 });
  assert.ok(!r.ok && r.reasons.includes("extra_person_or_noise"), `reasons ${r.reasons}`);
});

check("rejects: mask aspect differs from frame", () => {
  const r = measureFrame({ ...standing, frameWidth: 1000, frameHeight: 1000 }, { source: "sit_to_stand", heightCm: 180 });
  assert.deepEqual(r.reasons, ["mask_aspect_mismatch"]);
});

const meta = {
  source: "plank" as const,
  frameWidth: 1800,
  frameHeight: 1080,
  heightCm: 180,
  weightKg: 78,
  poseModel: "test",
  segmentationModel: "test",
  appVersion: "test",
  platform: "test",
  deviceModel: "test",
  consentVersion: "body-shape-v1",
};

check("capture: medians across good frames, bad frames dropped", () => {
  const good = measureFrame(plank, { source: "plank", heightCm: 180 });
  const bad: FrameResult = { ...good, ok: false, reasons: ["wrong_pose"], measurements: { bellyDepthCm: 99 } };
  const out = combineCapture([good, good, good, good, good, bad], meta);
  assert.ok(out.ok);
  if (out.ok) {
    assert.equal(out.capture.framesAnalysed, 6);
    assert.equal(out.capture.framesUsed, 5);
    near(out.capture.measurements.bellyDepthCm, 30, 0.4, "capture belly");
    assert.equal(out.capture.spread.bellyDepthCm, 0);
    assert.equal(out.capture.extractorVersion, "bodyshape-1.0.0");
  }
});

check("capture: fewer than 5 good frames is not saved", () => {
  const good = measureFrame(plank, { source: "plank", heightCm: 180 });
  const bad: FrameResult = { ...good, ok: false, reasons: ["touches_frame_edge"] };
  const out = combineCapture([good, good, good, good, bad, bad], meta);
  assert.ok(!out.ok);
  if (!out.ok) assert.equal(out.rejectCounts.touches_frame_edge, 2);
});

check("fat-free mass: provisional Janmahasatian formula", () => {
  const e = estimateFatFreeMass({ weightKg: 75, heightCm: 178, sex: "male" });
  assert.ok(e && e.provisional && e.method === "janmahasatian-2005");
  near(e?.fatFreeMassKg, (9270 * 75) / (6680 + 216 * (75 / 1.78 ** 2)), 1e-9, "men formula");
  const f = estimateFatFreeMass({ weightKg: 62, heightCm: 165, sex: "female" });
  near(f?.fatFreeMassKg, (9270 * 62) / (8780 + 244 * (62 / 1.65 ** 2)), 1e-9, "women formula");
});

check("fat-free mass: calibrated equation used only when complete", () => {
  const eq = { version: "ffm-dxa-test", intercept: 10, terms: { weightKg: 0.6, bellyDepthRel: -20 } };
  const withShape = estimateFatFreeMass({ weightKg: 75, heightCm: 178, sex: "male", measurements: { bellyDepthRel: 0.15 } }, eq);
  near(withShape?.fatFreeMassKg, 10 + 0.6 * 75 - 20 * 0.15, 1e-9, "equation");
  assert.equal(withShape?.provisional, false);
  const without = estimateFatFreeMass({ weightKg: 75, heightCm: 178, sex: "male" }, eq);
  assert.equal(without?.method, "janmahasatian-2005");
});

console.log(`bodyshape self-check: ok (${checks} checks)`);
