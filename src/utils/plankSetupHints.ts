import type { PlankHintCode } from '../services/strength/plankPoseSession';

export type PlankSetupCue = {
  title: string;
  detail: string;
  arrow: 'up' | 'down' | 'back' | 'none';
};

const PLANK_SETUP_CUES: Record<PlankHintCode, PlankSetupCue> = {
  phone_side: {
    title: 'Move the phone',
    detail: 'Prop your phone to the side so shoulders, hips, and feet are visible.',
    arrow: 'back',
  },
  step_back: {
    title: 'Step back',
    detail: 'Move back until your full body fits inside the guide.',
    arrow: 'back',
  },
  lower_hips: {
    title: 'Lower your hips',
    detail: 'Bring hips down — shoulders, hips, and ankles should form a straight line.',
    arrow: 'down',
  },
  raise_hips: {
    title: 'Lift your hips',
    detail: 'Push hips up — avoid sagging toward the floor.',
    arrow: 'up',
  },
  straighten_back: {
    title: 'Straighten your back',
    detail: 'Align shoulders, hips, and ankles in one line.',
    arrow: 'none',
  },
  forearms_down: {
    title: 'Forearms on the floor',
    detail: 'Lower onto your forearms with elbows under your shoulders.',
    arrow: 'down',
  },
  person_not_visible: {
    title: 'Get in frame',
    detail: 'Make sure you are fully visible from the side.',
    arrow: 'none',
  },
  lighting: {
    title: 'Improve lighting',
    detail: 'Face a light source or move to a brighter spot.',
    arrow: 'none',
  },
};

export function resolvePlankSetupCue(hints: PlankHintCode[]): PlankSetupCue {
  const primary = hints[0];
  if (primary && PLANK_SETUP_CUES[primary]) {
    return PLANK_SETUP_CUES[primary];
  }

  return {
    title: 'Adjust your position',
    detail: 'Prop your phone to the side, get into a forearm plank, and hold still.',
    arrow: 'none',
  };
}

export function isPlankHintCode(value: string): value is PlankHintCode {
  return value in PLANK_SETUP_CUES;
}

export function parsePlankHintCodes(raw: unknown): PlankHintCode[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item): item is PlankHintCode => isPlankHintCode(item));
}
