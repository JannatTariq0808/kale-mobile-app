// Design: kale-mobile-design — live plank capture (extends lum-03 strength flow)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MAX_PLANK_RECORDING_SEC,
} from '../../config/strengthRecording';
import { PlankRecordingReviewModal } from '../../components/strength/PlankRecordingReviewModal';
import type { RootStackParamList } from '../../navigation/types';
import { reviewPlankVideo } from '../../services/strength/reviewPlankVideo';
import type { PlankPoseSessionStats } from '../../services/strength/plankPoseSession';
import type { PlankValidationResult } from '../../services/strength/validatePlankRecording';
import { lumen, lumenPillar, sora } from '../../theme';
import { formatPlankDuration } from '../../utils/formatPlankDuration';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthRecord'>;

type Facing = 'front' | 'back';

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
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const recordPromiseRef = useRef<Promise<RecordingResult> | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<Facing>('back');
  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const recordingRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTick(), [clearTick]);

  const permissionsReady =
    cameraPermission?.granted === true && microphonePermission?.granted === true;

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
    if (!cameraRef.current || recording || finishing || !cameraReady) return;

    const granted = await requestMediaPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions needed',
        'Kale needs camera and microphone access to record your plank. Android requires microphone permission even when audio is not saved.',
      );
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
      clearTick();
      recordingRef.current = false;
      setRecording(false);
      startedAtRef.current = null;
      recordPromiseRef.current = null;
      if (__DEV__) {
        console.warn('[strength] record start failed', error);
      }
      Alert.alert('Recording failed', 'Could not start recording. Please try again.');
    }
  }, [cameraReady, clearTick, finishing, recording, requestMediaPermissions]);

  const resetRecordingUi = useCallback(() => {
    setFinishing(false);
    recordingRef.current = false;
    setRecording(false);
    setElapsedSec(0);
    startedAtRef.current = null;
    recordPromiseRef.current = null;
  }, []);

  const handleRecordAgain = useCallback(() => {
    setPendingReview(null);
    resetRecordingUi();
  }, [resetRecordingUi]);

  const handleSubmitReview = useCallback(() => {
    if (!pendingReview?.validation.ok) return;

    navigation.replace('StrengthAnalysing', {
      videoUri: pendingReview.videoUri,
      recordedDurationSec: pendingReview.durationSec,
      poseStats: pendingReview.poseStats,
    });
    setPendingReview(null);
  }, [navigation, pendingReview]);

  const handleStopRecording = useCallback(async () => {
    if (!recording || finishing || !recordPromiseRef.current) return;

    setFinishing(true);
    cameraRef.current?.stopRecording();

    try {
      const video = await recordPromiseRef.current;
      clearTick();

      const durationSec = startedAtRef.current
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : 0;

      startedAtRef.current = null;
      recordPromiseRef.current = null;
      recordingRef.current = false;
      setRecording(false);

      if (video?.uri) {
        const review = await reviewPlankVideo(video.uri, durationSec);

        setPendingReview(review);
        setFinishing(false);
      } else {
        resetRecordingUi();
        Alert.alert('Recording failed', 'Could not save your video. Please try again.');
      }
    } catch (error) {
      clearTick();
      resetRecordingUi();
      if (__DEV__) {
        console.warn('[strength] record failed', error);
      }
      Alert.alert('Recording failed', 'Could not save your video. Please try again.');
    }
  }, [clearTick, finishing, recording, resetRecordingUi]);

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
          Kale records your plank in-app. Android requires microphone permission to capture video,
          but we do not save audio.
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
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="video"
        onCameraReady={() => setCameraReady(true)}
      />

      <View
        style={[
          styles.overlay,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            disabled={recording || finishing}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="close" size={22} color={lumen.fg} />
          </Pressable>

          <View style={styles.timerPill}>
            <View style={[styles.recDot, recording ? styles.recDotActive : null]} />
            <Text style={styles.timerText}>{formatPlankDuration(elapsedSec)}</Text>
          </View>

          <Pressable
            onPress={() => setFacing((value) => (value === 'back' ? 'front' : 'back'))}
            style={styles.iconButton}
            disabled={recording || finishing}
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
          >
            <Ionicons name="camera-reverse-outline" size={22} color={lumen.fg} />
          </Pressable>
        </View>

        <View style={styles.hintCard}>
          <Text style={styles.hintEyebrow}>Plank recording</Text>
          <Text style={styles.hintText}>
            Prop your phone to the side so shoulders, hips, and legs are visible. Hold a straight
            plank, then stop — we check your form after you finish.
          </Text>
        </View>

        <View style={styles.controls}>
          {finishing ? (
            <ActivityIndicator color={lumen.lime} size="large" />
          ) : recording ? (
            <Pressable
              onPress={() => void handleStopRecording()}
              style={styles.stopButton}
              accessibilityRole="button"
              accessibilityLabel="Stop recording"
            >
              <View style={styles.stopInner} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => void handleStartRecording()}
              style={[styles.recordButton, !cameraReady && styles.recordButtonDisabled]}
              disabled={!cameraReady}
              accessibilityRole="button"
              accessibilityLabel="Start recording"
            >
              <View style={styles.recordInner} />
            </Pressable>
          )}
          <Text style={styles.controlLabel}>
            {finishing
              ? 'Checking form…'
              : recording
                ? 'Tap to stop'
                : cameraReady
                  ? 'Tap to record'
                  : 'Starting camera…'}
          </Text>
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
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lumen.fgMuted,
  },
  recDotActive: {
    backgroundColor: lumen.coral,
  },
  timerText: {
    ...sora('bold'),
    fontSize: 18,
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
  },
  hintCard: {
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  hintEyebrow: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: lumenPillar.strength,
  },
  hintText: {
    ...sora('semibold'),
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fg,
  },
  controls: {
    alignItems: 'center',
    gap: 12,
  },
  recordButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: lumen.fg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  recordButtonDisabled: {
    opacity: 0.45,
  },
  recordInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: lumen.coral,
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
