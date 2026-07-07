import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraView } from 'expo-camera';
import {
  PLANK_SETUP_CONSECUTIVE_VALID_FRAMES,
  PLANK_SETUP_SAMPLE_INTERVAL_MS,
} from '../config/strengthRecording';
import { isStrengthDevSkipPoseCheck } from '../config/strengthDev';
import { analyzePlankFrameUri } from '../services/strength/analyzePlankFrame';
import type { PlankHintCode } from '../services/strength/plankPoseSession';

export type PlankSetupGateStatus =
  | 'idle'
  | 'checking'
  | 'adjusting'
  | 'locked'
  | 'capture_error'
  | 'unavailable';

export type UsePlankSetupGateResult = {
  status: PlankSetupGateStatus;
  hints: PlankHintCode[];
  consecutiveValid: number;
  requiredValid: number;
  isLocked: boolean;
  statusMessage: string;
  isChecking: boolean;
  reset: () => void;
  checkNow: () => void;
};

type UsePlankSetupGateInput = {
  cameraRef: RefObject<CameraView | null>;
  cameraReady: boolean;
  enabled: boolean;
};

const CAPTURE_RETRY_COUNT = 2;
const CAPTURE_RETRY_DELAY_MS = 400;
const MAX_CAPTURE_FAILURES_BEFORE_ERROR = 4;

async function capturePreviewFrame(
  camera: CameraView,
): Promise<string | null> {
  for (let attempt = 0; attempt <= CAPTURE_RETRY_COUNT; attempt += 1) {
    try {
      const photo = await camera.takePictureAsync({
        quality: 0.25,
        skipProcessing: true,
        shutterSound: false,
      });
      if (photo?.uri) return photo.uri;
    } catch (error) {
      if (__DEV__ && attempt === CAPTURE_RETRY_COUNT) {
        console.warn('[strength] setup gate capture failed', error);
      }
    }

    if (attempt < CAPTURE_RETRY_COUNT) {
      await new Promise((resolve) => setTimeout(resolve, CAPTURE_RETRY_DELAY_MS));
    }
  }

  return null;
}

export function usePlankSetupGate({
  cameraRef,
  cameraReady,
  enabled,
}: UsePlankSetupGateInput): UsePlankSetupGateResult {
  const [status, setStatus] = useState<PlankSetupGateStatus>('idle');
  const [hints, setHints] = useState<PlankHintCode[]>([]);
  const [consecutiveValid, setConsecutiveValid] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const inFlightRef = useRef(false);
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consecutiveRef = useRef(0);
  const captureFailuresRef = useRef(0);
  const enabledRef = useRef(enabled);
  const cameraReadyRef = useRef(cameraReady);
  const checkNowRef = useRef<() => void>(() => {});

  const requiredValid = PLANK_SETUP_CONSECUTIVE_VALID_FRAMES;
  const isLocked = status === 'locked' || isStrengthDevSkipPoseCheck();

  enabledRef.current = enabled;
  cameraReadyRef.current = cameraReady;

  const clearSchedule = useCallback(() => {
    if (scheduleRef.current) {
      clearTimeout(scheduleRef.current);
      scheduleRef.current = null;
    }
  }, []);

  const scheduleNextSample = useCallback(
    (delayMs: number) => {
      clearSchedule();
      scheduleRef.current = setTimeout(() => {
        checkNowRef.current();
      }, delayMs);
    },
    [clearSchedule],
  );

  const reset = useCallback(() => {
    consecutiveRef.current = 0;
    captureFailuresRef.current = 0;
    setConsecutiveValid(0);
    setHints([]);
    setIsChecking(false);
    setStatus(cameraReadyRef.current && enabledRef.current ? 'checking' : 'idle');
  }, []);

  const runSample = useCallback(async () => {
    if (
      !enabledRef.current ||
      !cameraReadyRef.current ||
      inFlightRef.current ||
      isStrengthDevSkipPoseCheck() ||
      consecutiveRef.current >= requiredValid
    ) {
      return;
    }

    const camera = cameraRef.current;
    if (!camera) {
      scheduleNextSample(PLANK_SETUP_SAMPLE_INTERVAL_MS);
      return;
    }

    inFlightRef.current = true;
    setIsChecking(true);
    setStatus((current) =>
      current === 'locked' || current === 'adjusting' ? current : 'checking',
    );

    try {
      const uri = await capturePreviewFrame(camera);
      if (!uri) {
        captureFailuresRef.current += 1;
        if (captureFailuresRef.current >= MAX_CAPTURE_FAILURES_BEFORE_ERROR) {
          setStatus('capture_error');
        }
        scheduleNextSample(PLANK_SETUP_SAMPLE_INTERVAL_MS);
        return;
      }

      captureFailuresRef.current = 0;
      const result = await analyzePlankFrameUri(uri);

      if (result.error === 'network' || result.error === 'quota' || result.error === 'service') {
        setStatus('unavailable');
        setHints([]);
        consecutiveRef.current = 0;
        setConsecutiveValid(0);
        scheduleNextSample(PLANK_SETUP_SAMPLE_INTERVAL_MS * 2);
        return;
      }

      if (result.valid) {
        consecutiveRef.current += 1;
        setConsecutiveValid(consecutiveRef.current);
        setHints([]);

        if (consecutiveRef.current >= requiredValid) {
          setStatus('locked');
          clearSchedule();
        } else {
          setStatus('checking');
          scheduleNextSample(PLANK_SETUP_SAMPLE_INTERVAL_MS);
        }
        return;
      }

      consecutiveRef.current = 0;
      setConsecutiveValid(0);
      setHints(result.hints.length > 0 ? result.hints : ['person_not_visible']);
      setStatus('adjusting');
      scheduleNextSample(PLANK_SETUP_SAMPLE_INTERVAL_MS);
    } finally {
      inFlightRef.current = false;
      setIsChecking(false);
    }
  }, [cameraRef, clearSchedule, requiredValid, scheduleNextSample]);

  const checkNow = useCallback(() => {
    void runSample();
  }, [runSample]);

  checkNowRef.current = checkNow;

  useEffect(() => {
    if (!enabled || !cameraReady) {
      clearSchedule();
      inFlightRef.current = false;
      setIsChecking(false);
      if (!enabled) {
        setStatus('idle');
      }
      return;
    }

    if (isStrengthDevSkipPoseCheck()) {
      clearSchedule();
      setStatus('locked');
      setConsecutiveValid(requiredValid);
      return;
    }

    consecutiveRef.current = 0;
    captureFailuresRef.current = 0;
    setConsecutiveValid(0);
    setHints([]);
    setStatus('checking');

    scheduleNextSample(800);

    return () => {
      clearSchedule();
      inFlightRef.current = false;
    };
  }, [cameraReady, clearSchedule, enabled, requiredValid, scheduleNextSample]);

  const statusMessage = (() => {
    if (isStrengthDevSkipPoseCheck()) {
      return 'Dev mode: position check skipped.';
    }
    if (status === 'locked') {
      return 'Position locked — tap to start recording.';
    }
    if (status === 'unavailable') {
      return 'Cannot reach Kale to check your form. Check your connection and try again.';
    }
    if (status === 'capture_error') {
      return 'Could not grab a preview frame. Hold still, then tap Check position.';
    }
    if (isChecking) {
      return 'Checking your position…';
    }
    if (status === 'adjusting') {
      return 'Adjust using the guide, then tap Check position or wait for the next scan.';
    }
    if (consecutiveValid > 0) {
      return `Hold still… ${consecutiveValid}/${requiredValid}`;
    }
    return 'Prop the phone to your side, get into a forearm plank, then tap Check position.';
  })();

  return {
    status,
    hints,
    consecutiveValid,
    requiredValid,
    isLocked,
    statusMessage,
    isChecking,
    reset,
    checkNow,
  };
};
