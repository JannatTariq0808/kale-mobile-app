// Design: kale-mobile-design — live plank capture (extends lum-03 strength flow)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAX_PLANK_RECORDING_SEC } from '../../config/strengthRecording';
import { PlankRecordingReviewModal } from '../../components/strength/PlankRecordingReviewModal';
import { PlankSetupOverlay } from '../../components/strength/PlankSetupOverlay';
import { usePlankSetupGate } from '../../hooks/usePlankSetupGate';
import { useStrengthRecordingOrientation } from '../../hooks/useStrengthRecordingOrientation';
import type { RootStackParamList } from '../../navigation/types';
import { reviewPlankVideo } from '../../services/strength/reviewPlankVideo';
import type { PlankPoseSessionStats } from '../../services/strength/plankPoseSession';
import type { PlankValidationResult } from '../../services/strength/validatePlankRecording';
import { fetchDemographicsForAssess } from '../../services/user/fetchHealthProfile';
import { lumen, sora } from '../../theme';
import { formatPlankDuration } from '../../utils/formatPlankDuration';
import { nextPlankLevelTip } from '../../utils/plankLevelTip';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthRecord'>;

type Facing = 'front' | 'back';
type CameraMode = 'picture' | 'video';

/**
 * iOS: remount into video mode before recordAsync (in-place switch often yields no file).
 * Android: switch mode on the same CameraView — remounting blacks out the preview.
 */
const REMOUNT_FOR_VIDEO = Platform.OS === 'ios';
const VIDEO_MODE_SETTLE_MS = Platform.OS === 'ios' ? 350 : 400;
const CAMERA_READY_TIMEOUT_MS = Platform.OS === 'ios' ? 6000 : 4000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForFlag(
  isReady: () => boolean,
  timeoutMs: number,
): Promise<boolean> {
  if (isReady()) return true;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await delay(50);
    if (isReady()) return true;
  }
  return isReady();
}

type RecordingResult = {
  uri: string;
} | undefined;

type PendingReview = {
  videoUri: string;
  durationSec: number;
  poseStats: PlankPoseSessionStats;
  validation: PlankValidationResult;
};

export function StrengthRecordScreen({ navigation }: Props) {
  // Prevent Auto-Lock / dim during setup + plank hold (client devices often use 30s lock).
  useKeepAwake('strength-record');

  const {
    mode: captureOrientation,
    cameraOrientation,
    previewMounted,
    cameraSessionId,
    isLandscape,
    switching,
    toggle: toggleOrientation,
    restorePortrait,
    remountPreview,
  } = useStrengthRecordingOrientation();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const recordPromiseRef = useRef<Promise<RecordingResult> | null>(null);
  const autoStartRef = useRef(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<Facing>('back');
  const [cameraMode, setCameraMode] = useState<CameraMode>('picture');
  const [setupPaused, setSetupPaused] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [demoDob, setDemoDob] = useState<Date | null>(null);
  const [demoGender, setDemoGender] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const recordingRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraReadyRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const notifyCameraReady = useCallback(() => {
    cameraReadyRef.current = true;
    setCameraReady(true);
  }, []);

  const markCameraNotReady = useCallback(() => {
    cameraReadyRef.current = false;
    setCameraReady(false);
  }, []);

  useEffect(() => {
    markCameraNotReady();
  }, [cameraSessionId, facing, previewMounted, markCameraNotReady]);

  // iOS can mount CameraView without ever firing onCameraReady (green / frozen preview).
  // Never remount while preparing/recording — that kills recordAsync and yields no file.
  useEffect(() => {
    if (
      !previewMounted ||
      cameraReady ||
      switching ||
      setupPaused ||
      recording ||
      finishing
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (!cameraReadyRef.current) {
        if (__DEV__) {
          console.warn('[strength] camera ready timeout — remounting preview');
        }
        remountPreview();
      }
    }, Platform.OS === 'ios' ? 2200 : 3500);

    return () => clearTimeout(timer);
  }, [
    previewMounted,
    cameraReady,
    cameraSessionId,
    switching,
    setupPaused,
    recording,
    finishing,
    remountPreview,
  ]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const profile = await fetchDemographicsForAssess();
        if (cancelled || !profile) return;
        const parsed = new Date(`${profile.date_of_birth}T12:00:00`);
        if (!Number.isNaN(parsed.getTime())) {
          setDemoDob(parsed);
          setDemoGender(profile.gender);
        }
      } catch {
        // Tips fall back to a simple schedule without demographics.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTick(), [clearTick]);

  useEffect(() => {
    if (!recording) {
      pulseAnim.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.2,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, recording]);

  const permissionsReady =
    cameraPermission?.granted === true && microphonePermission?.granted === true;

  const setupGateEnabled =
    permissionsReady &&
    cameraReady &&
    previewMounted &&
    !switching &&
    cameraMode === 'picture' &&
    !setupPaused &&
    !recording &&
    !finishing &&
    pendingReview == null;

  const setupGate = usePlankSetupGate({
    cameraRef,
    cameraReady: permissionsReady && cameraReady,
    enabled: setupGateEnabled,
  });

  const requestMediaPermissions = useCallback(async () => {
    const camera = cameraPermission?.granted ? cameraPermission : await requestCameraPermission();
    const microphone = microphonePermission?.granted
      ? microphonePermission
      : await requestMicrophonePermission();
    return camera.granted && microphone.granted;
  }, [
    cameraPermission,
    microphonePermission,
    requestCameraPermission,
    requestMicrophonePermission,
  ]);

  const handleStartRecording = useCallback(async () => {
    if (!cameraRef.current || recording || finishing || !cameraReady || !setupGate.isLocked) {
      return;
    }

    const granted = await requestMediaPermissions();
    if (!granted) {
      autoStartRef.current = false;
      Alert.alert(
        'Permissions needed',
        'Kale needs camera and microphone access to record your plank. Audio is not saved.',
      );
      return;
    }

    // Pause still captures, then enter video mode for recordAsync.
    setSetupPaused(true);

    if (REMOUNT_FOR_VIDEO) {
      // iOS: remount so the session is a real video capture pipeline.
      markCameraNotReady();
      setCameraMode('video');

      const ready = await waitForFlag(
        () => cameraReadyRef.current && cameraRef.current != null,
        CAMERA_READY_TIMEOUT_MS,
      );
      if (!ready || !cameraRef.current) {
        autoStartRef.current = false;
        setSetupPaused(false);
        setCameraMode('picture');
        Alert.alert('Camera not ready', 'Could not start recording. Please try again.');
        return;
      }
    } else {
      // Android: keep the same CameraView mounted — remount flashes/blacks the preview.
      setCameraMode('video');
    }

    await delay(VIDEO_MODE_SETTLE_MS);

    if (!cameraRef.current) {
      autoStartRef.current = false;
      setSetupPaused(false);
      setCameraMode('picture');
      Alert.alert('Camera not ready', 'Could not start recording. Please try again.');
      return;
    }

    setRecording(true);
    recordingRef.current = true;
    setPendingReview(null);
    setElapsedSec(0);
    startedAtRef.current = Date.now();

    tickRef.current = setInterval(() => {
      if (!startedAtRef.current) return;
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);

    try {
      recordPromiseRef.current = cameraRef.current.recordAsync({
        maxDuration: MAX_PLANK_RECORDING_SEC,
      });
    } catch (error) {
      autoStartRef.current = false;
      clearTick();
      recordingRef.current = false;
      setRecording(false);
      setSetupPaused(false);
      setCameraMode('picture');
      startedAtRef.current = null;
      recordPromiseRef.current = null;
      if (__DEV__) {
        console.warn('[strength] record start failed', error);
      }
      Alert.alert('Recording failed', 'Could not start recording. Please try again.');
    }
  }, [
    cameraReady,
    clearTick,
    finishing,
    markCameraNotReady,
    recording,
    requestMediaPermissions,
    setupGate.isLocked,
  ]);

  // Auto-start as soon as a plank is detected / locked.
  useEffect(() => {
    if (
      !setupGate.isLocked ||
      recording ||
      finishing ||
      setupPaused ||
      pendingReview != null ||
      autoStartRef.current
    ) {
      return;
    }

    autoStartRef.current = true;
    void handleStartRecording();
  }, [
    finishing,
    handleStartRecording,
    pendingReview,
    recording,
    setupGate.isLocked,
    setupPaused,
  ]);

  const resetRecordingUi = useCallback(() => {
    autoStartRef.current = false;
    setFinishing(false);
    recordingRef.current = false;
    setRecording(false);
    setElapsedSec(0);
    setSetupPaused(false);
    setCameraMode('picture');
    startedAtRef.current = null;
    recordPromiseRef.current = null;
  }, []);

  const handleRecordAgain = useCallback(() => {
    setPendingReview(null);
    resetRecordingUi();
    setupGate.reset();
  }, [resetRecordingUi, setupGate]);

  const handleSubmitReview = useCallback(() => {
    if (!pendingReview?.validation.ok) return;

    // Navigate immediately — awaiting restorePortrait blocked the loading screen
    // (orientation lock can hang after landscape capture).
    const { videoUri, durationSec, poseStats } = pendingReview;
    setPendingReview(null);
    navigation.replace('StrengthAnalysing', {
      videoUri,
      recordedDurationSec: durationSec,
      poseStats,
    });
    void restorePortrait();
  }, [navigation, pendingReview, restorePortrait]);

  const handleStopRecording = useCallback(async () => {
    if (!recording || finishing || !recordPromiseRef.current) return;

    setFinishing(true);
    const pendingRecord = recordPromiseRef.current;
    cameraRef.current?.stopRecording();

    try {
      const video = await pendingRecord;
      clearTick();

      const durationSec = startedAtRef.current
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : 0;

      startedAtRef.current = null;
      recordPromiseRef.current = null;
      recordingRef.current = false;
      setRecording(false);

      const uri = video?.uri;
      if (!uri) {
        if (__DEV__) {
          console.warn('[strength] recordAsync returned no uri', video);
        }
        resetRecordingUi();
        void restorePortrait();
        Alert.alert('Recording failed', 'Could not save your video. Please try again.');
        return;
      }

      // Review before rotating — orientation remount must not race the saved file.
      const review = await reviewPlankVideo(uri, durationSec);
      setPendingReview(review);
      setFinishing(false);
      void restorePortrait();
    } catch (error) {
      clearTick();
      resetRecordingUi();
      void restorePortrait();
      if (__DEV__) {
        console.warn('[strength] record failed', error);
      }
      Alert.alert('Recording failed', 'Could not save your video. Please try again.');
    }
  }, [clearTick, finishing, recording, resetRecordingUi, restorePortrait]);

  const plankDetected = setupGate.isLocked || recording || setupPaused;
  const levelTip = useMemo(
    () => (recording ? nextPlankLevelTip(elapsedSec, demoDob, demoGender) : null),
    [demoDob, demoGender, elapsedSec, recording],
  );

  if (!cameraPermission || !microphonePermission) {
    return (
      <View style={[styles.centered, styles.screen]}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  if (!permissionsReady) {
    return (
      <View style={[styles.centered, styles.screen, styles.permission]}>
        <Text style={styles.permissionTitle}>Camera & mic access needed</Text>
        <Text style={styles.permissionBody}>
          Kale records your plank in-app. Microphone access is needed for video recording, but we do
          not save audio.
        </Text>
        <Pressable style={styles.permissionBtn} onPress={() => void requestMediaPermissions()}>
          <Text style={styles.permissionBtnText}>Allow access</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancelLink}>
          <Text style={styles.cancelLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {previewMounted ? (
        <CameraView
          // Include cameraMode in the key only on iOS (forces a video-session remount).
          // On Android, remounting for picture→video blacks out the live preview.
          key={
            REMOUNT_FOR_VIDEO
              ? `camera-${facing}-${cameraOrientation}-${cameraSessionId}-${cameraMode}`
              : `camera-${facing}-${cameraOrientation}-${cameraSessionId}`
          }
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mode={cameraMode}
          mute
          // Portrait only — in landscape this fights the lock and can invert/freeze iOS preview.
          responsiveOrientationWhenOrientationLocked={cameraOrientation === 'portrait'}
          onCameraReady={notifyCameraReady}
          onMountError={(error) => {
            if (__DEV__) {
              console.warn('[strength] camera mount error', error);
            }
            if (!recordingRef.current && !setupPaused) {
              remountPreview();
            }
          }}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.cameraPlaceholder]}>
          <ActivityIndicator color={lumen.lime} size="large" />
        </View>
      )}

      <View
        style={[
          styles.overlay,
          {
            paddingTop: Math.max(insets.top, isLandscape ? 4 : 0) + (isLandscape ? 4 : 8),
            paddingBottom: Math.max(insets.bottom, 0) + (isLandscape ? 4 : 12),
            paddingLeft: Math.max(insets.left, isLandscape ? 6 : 0) + (isLandscape ? 4 : 0),
            paddingRight: Math.max(insets.right, isLandscape ? 6 : 0) + (isLandscape ? 4 : 0),
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.topBar}>
          {recording || finishing ? (
            <View style={styles.iconButtonSpacer} />
          ) : (
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="close" size={22} color={lumen.fg} />
            </Pressable>
          )}

          <View style={styles.topActions}>
            {recording || finishing ? null : (
              <>
                <Pressable
                  onPress={toggleOrientation}
                  style={[styles.iconButton, switching && styles.iconButtonDisabled]}
                  disabled={switching}
                  accessibilityRole="button"
                  accessibilityLabel={
                    captureOrientation === 'portrait'
                      ? 'Switch to landscape'
                      : 'Switch to portrait'
                  }
                >
                  <Ionicons
                    name={
                      captureOrientation === 'portrait'
                        ? 'phone-landscape-outline'
                        : 'phone-portrait-outline'
                    }
                    size={20}
                    color={lumen.fg}
                  />
                </Pressable>
                <Pressable
                  onPress={() => setFacing((value) => (value === 'back' ? 'front' : 'back'))}
                  style={styles.iconButton}
                  accessibilityRole="button"
                  accessibilityLabel="Flip camera"
                >
                  <Ionicons name="camera-reverse-outline" size={22} color={lumen.fg} />
                </Pressable>
              </>
            )}
          </View>
        </View>

        <View
          style={[styles.statusBlock, isLandscape && styles.statusBlockLandscape]}
          pointerEvents="none"
        >
          <Text
            style={[
              styles.detectLine,
              plankDetected ? styles.detectLineOn : styles.detectLineOff,
            ]}
          >
            {plankDetected ? 'Plank detected' : 'Plank not detected'}
          </Text>

          {recording || finishing || setupPaused ? (
            <View style={styles.recordingRow}>
              <Animated.View
                style={[
                  styles.recDot,
                  recording ? { opacity: pulseAnim } : null,
                  finishing ? styles.recDotIdle : null,
                ]}
              />
              <Text style={styles.recordingText}>
                {finishing
                  ? 'Checking form…'
                  : recording
                    ? `Recording  ${formatPlankDuration(elapsedSec)}`
                    : 'Starting…'}
              </Text>
            </View>
          ) : null}

          {levelTip ? <Text style={styles.levelTip}>{levelTip.message}</Text> : null}

          {!plankDetected && setupGate.status === 'unavailable' ? (
            <Text style={styles.hintMuted}>{setupGate.statusMessage}</Text>
          ) : null}
        </View>

        <View style={[styles.middle, isLandscape && styles.middleLandscape]}>
          <PlankSetupOverlay
            visible={!recording && !finishing && pendingReview == null}
            status={setupGate.status}
            hints={setupGate.hints}
            consecutiveValid={setupGate.consecutiveValid}
            requiredValid={setupGate.requiredValid}
            statusMessage={setupGate.statusMessage}
            isLandscape={isLandscape}
          />
        </View>

        <View style={[styles.controls, isLandscape && styles.controlsLandscape]}>
          {finishing ? (
            <ActivityIndicator color={lumen.lime} size="large" />
          ) : recording ? (
            <>
              <Pressable
                onPress={() => void handleStopRecording()}
                style={styles.stopButton}
                accessibilityRole="button"
                accessibilityLabel="Stop recording"
              >
                <View style={styles.stopInner} />
              </Pressable>
              <Text style={styles.controlLabel}>Tap to stop</Text>
            </>
          ) : (
            <Text style={styles.controlLabel}>
              {setupPaused && !recording
                ? 'Starting recording…'
                : setupGate.status === 'unavailable'
                  ? 'Position check unavailable'
                  : cameraReady
                    ? 'Get into a forearm plank'
                    : 'Starting camera…'}
            </Text>
          )}
        </View>
      </View>

      {pendingReview ? (
        <PlankRecordingReviewModal
          visible
          durationSec={pendingReview.durationSec}
          poseStats={pendingReview.poseStats}
          validation={pendingReview.validation}
          onSubmit={handleSubmitReview}
          onRecordAgain={handleRecordAgain}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
  },
  cameraPlaceholder: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  permission: {
    paddingHorizontal: 32,
  },
  permissionTitle: {
    ...sora('extrabold'),
    fontSize: 24,
    color: lumen.fg,
    textAlign: 'center',
  },
  permissionBody: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: lumen.fgMuted,
    textAlign: 'center',
  },
  permissionBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: lumen.lime,
  },
  permissionBtnText: {
    ...sora('bold'),
    fontSize: 15,
    color: lumen.bgDark,
  },
  cancelLink: {
    marginTop: 16,
    padding: 8,
  },
  cancelLinkText: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    flexShrink: 0,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  iconButtonSpacer: {
    width: 44,
    height: 44,
  },
  iconButtonDisabled: {
    opacity: 0.45,
  },
  statusBlock: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 6,
  },
  statusBlockLandscape: {
    paddingHorizontal: 8,
    paddingTop: 2,
    paddingBottom: 0,
    gap: 2,
  },
  detectLine: {
    ...sora('bold'),
    fontSize: 18,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  detectLineOn: {
    color: lumen.green,
  },
  detectLineOff: {
    color: lumen.coral,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: lumen.coral,
  },
  recDotIdle: {
    opacity: 0.55,
  },
  recordingText: {
    ...sora('bold'),
    fontSize: 16,
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
  },
  levelTip: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fg,
    textAlign: 'center',
    opacity: 0.92,
  },
  hintMuted: {
    ...sora('semibold'),
    fontSize: 12,
    color: lumen.fgMuted,
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 12,
  },
  middle: {
    flex: 1,
    minHeight: 0,
  },
  middleLandscape: {
    marginTop: 0,
    flexGrow: 1,
  },
  controls: {
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    paddingTop: 4,
  },
  controlsLandscape: {
    paddingHorizontal: 4,
    gap: 4,
    paddingTop: 0,
    paddingBottom: 0,
  },
  stopButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: lumen.fg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  stopInner: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: lumen.coral,
  },
  controlLabel: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
});
