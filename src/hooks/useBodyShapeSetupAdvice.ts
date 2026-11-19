/**
 * Body-shape set-up advice for the plank screen (spec: phone level, fitted clothing).
 * Advice only: it never blocks or changes the strength test, and it only runs for
 * members who opted in to body shape.
 */
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { getBodyShapeConsent, isBodyShapeEnabled } from '../services/bodyshape/settings';
import { useAuthSession } from './useAuthSession';

/** Spec: phone tilt under 10 degrees. */
export const MAX_PHONE_TILT_DEG = 10;
const CLOTHING_TIP = 'Fitted clothing gives the most accurate reading.';

/**
 * Tilt of the phone's edges from level, in degrees, from gravity in the screen
 * plane: 0 when an edge is horizontal (portrait or landscape), 45 at worst.
 */
export function phoneTiltDeg(x: number, y: number): number {
  const angle = Math.abs((Math.atan2(x, y) * 180) / Math.PI) % 90;
  return Math.min(angle, 90 - angle);
}

export function useBodyShapeSetupAdvice(active: boolean): string | null {
  const { user } = useAuthSession();
  const [optedIn, setOptedIn] = useState(false);
  const [tilt, setTilt] = useState<number | null>(null);

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    let cancelled = false;
    void (async () => {
      const [enabled, consent] = await Promise.all([isBodyShapeEnabled(), getBodyShapeConsent(uid)]);
      if (!cancelled) setOptedIn(enabled && consent === true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!optedIn || !active) return;
    Accelerometer.setUpdateInterval(500);
    const sub = Accelerometer.addListener(({ x, y }) => setTilt(phoneTiltDeg(x, y)));
    return () => sub.remove();
  }, [active, optedIn]);

  if (!optedIn || !active) return null;
  if (tilt != null && tilt > MAX_PHONE_TILT_DEG) {
    return `Level your phone: it's tilted ${Math.round(tilt)}°.`;
  }
  return CLOTHING_TIP;
}
