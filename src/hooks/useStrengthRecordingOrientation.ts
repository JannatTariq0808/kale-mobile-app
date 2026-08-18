import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { defaultAppOrientationLock } from '../utils/appOrientationLock';

export type StrengthCaptureOrientation = 'portrait' | 'landscape';

function isOrientationUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /activity is no longer available|not available|has been rejected/i.test(message);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Prefer a single landscape side on iOS — locking both left+right lets the
 * preview mount mid-flip and look inverted / mirrored.
 */
function landscapeLock(): ScreenOrientation.OrientationLock {
  return Platform.OS === 'ios'
    ? ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    : ScreenOrientation.OrientationLock.LANDSCAPE;
}

function isLandscapeOrientation(orientation: ScreenOrientation.Orientation): boolean {
  return (
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
  );
}

async function waitForDeviceOrientation(
  mode: StrengthCaptureOrientation,
  timeoutMs: number,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const current = await ScreenOrientation.getOrientationAsync();
      const landscape = isLandscapeOrientation(current);
      if (mode === 'landscape' ? landscape : !landscape) return;
    } catch {
      break;
    }
    await delay(50);
  }
}

async function applyOrientationLock(mode: StrengthCaptureOrientation): Promise<void> {
  if (AppState.currentState !== 'active') return;

  // Unlock first — locking landscape then portrait without unlock can stick on iOS.
  await ScreenOrientation.unlockAsync();
  await ScreenOrientation.lockAsync(
    mode === 'landscape' ? landscapeLock() : ScreenOrientation.OrientationLock.PORTRAIT_UP,
  );

  await waitForDeviceOrientation(mode, Platform.OS === 'ios' ? 1200 : 400);
  // Extra beat so UIKit finishes layout before CameraView mounts.
  await delay(Platform.OS === 'ios' ? 200 : 80);
}

async function forcePortraitLock(): Promise<void> {
  if (AppState.currentState !== 'active') return;

  await ScreenOrientation.unlockAsync();
  await ScreenOrientation.lockAsync(defaultAppOrientationLock());
}

async function runOrientation(
  task: () => Promise<void>,
  warnLabel: string,
  opts?: { quiet?: boolean },
): Promise<void> {
  try {
    await task();
  } catch (error) {
    if (isOrientationUnavailable(error) || opts?.quiet) return;
    if (__DEV__) {
      console.warn(warnLabel, error);
    }
  }
}

/**
 * Portrait by default; user can toggle landscape.
 *
 * iOS: fully unmount CameraView before locking, then remount after settle.
 * In-place remount (key swap only) often leaves a frozen / green preview.
 */
export function useStrengthRecordingOrientation() {
  const [mode, setMode] = useState<StrengthCaptureOrientation>('portrait');
  const [cameraOrientation, setCameraOrientation] =
    useState<StrengthCaptureOrientation>('portrait');
  const [previewMounted, setPreviewMounted] = useState(true);
  const [cameraSessionId, setCameraSessionId] = useState(0);
  const [switching, setSwitching] = useState(false);
  const initialLockDoneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      // First mount: lock portrait without tearing down an already-working preview.
      if (!initialLockDoneRef.current) {
        initialLockDoneRef.current = true;
        await runOrientation(
          () => applyOrientationLock('portrait'),
          '[strength] could not lock orientation (portrait)',
        );
        return;
      }

      setSwitching(true);
      // Tear down AVCaptureSession completely before rotating — avoids iOS green/frozen preview.
      setPreviewMounted(false);
      await delay(Platform.OS === 'ios' ? 250 : 80);
      if (cancelled) return;

      await runOrientation(
        () => applyOrientationLock(mode),
        `[strength] could not lock orientation (${mode})`,
      );
      if (cancelled) return;

      setCameraOrientation(mode);
      setCameraSessionId((id) => id + 1);
      setPreviewMounted(true);
      setSwitching(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
    return () => {
      void runOrientation(() => forcePortraitLock(), '[strength] could not restore portrait orientation', {
        quiet: true,
      });
    };
  }, []);

  const toggle = useCallback(() => {
    if (switching) return;
    setMode((current) => (current === 'portrait' ? 'landscape' : 'portrait'));
  }, [switching]);

  const restorePortrait = useCallback(async () => {
    // Mode effect remounts when leaving landscape; lock runs here for portrait→portrait too.
    setMode('portrait');
    await runOrientation(
      () => forcePortraitLock(),
      '[strength] could not force portrait after capture',
    );
  }, []);

  /** Bump session if preview mounts but never becomes ready (iOS green screen). */
  const remountAttemptsRef = useRef(0);

  useEffect(() => {
    remountAttemptsRef.current = 0;
  }, [mode]);

  const remountPreview = useCallback(() => {
    if (remountAttemptsRef.current >= 2) return;
    remountAttemptsRef.current += 1;
    setPreviewMounted(false);
    void (async () => {
      await delay(Platform.OS === 'ios' ? 200 : 80);
      setCameraSessionId((id) => id + 1);
      setPreviewMounted(true);
    })();
  }, []);

  return {
    mode,
    /** Settled orientation — use for layout / responsiveOrientation prop. */
    cameraOrientation,
    /** False while orientation is changing — do not render CameraView. */
    previewMounted,
    /** Include in CameraView key so each remount is a fresh native session. */
    cameraSessionId,
    isLandscape: mode === 'landscape',
    switching,
    toggle,
    restorePortrait,
    remountPreview,
  };
}
