// Design: kale-mobile-design — lum-03 KaleStrengthIntroLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isStrengthDevSkipPoseCheck } from '../../config/strengthDev';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import { PlankRecordingReviewModal } from '../../components/strength/PlankRecordingReviewModal';
import type { RootStackParamList } from '../../navigation/types';
import { reviewPlankVideo, type PlankVideoReview } from '../../services/strength/reviewPlankVideo';
import { lumen, lumenPillar, sora } from '../../theme';
import { pickPlankVideo } from '../../utils/pickPlankVideo';
import { normalizePickedVideoDurationSec } from '../../utils/normalizePickedVideoDuration';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthIntro'>;

const STEPS = [
  'Find a clear space and prop your phone where you are fully visible.',
  'Elbows under shoulders, body in one straight line.',
  'Tap record, hold as long as you can, then stop.',
  'We log your hold time from the recording — pose check refines this soon.',
] as const;

export function StrengthIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [checkingUpload, setCheckingUpload] = useState(false);
  const [pendingReview, setPendingReview] = useState<PlankVideoReview | null>(null);

  const handleRecord = () => {
    navigation.navigate('StrengthRecord');
  };

  const handleDevUpload = useCallback(async () => {
    if (checkingUpload) return;

    const picked = await pickPlankVideo();
    if (!picked?.uri) return;

    setCheckingUpload(true);
    try {
      const durationSec = normalizePickedVideoDurationSec(picked.duration);
      if (__DEV__) {
        console.log('[strength] dev upload picked', {
          fileName: picked.fileName,
          rawDuration: picked.duration,
          durationSec,
        });
      }
      const review = await reviewPlankVideo(picked.uri, durationSec);
      setPendingReview(review);
    } catch (error) {
      if (__DEV__) {
        console.warn('[strength] dev upload review failed', error);
      }
      Alert.alert('Check failed', 'Could not analyse that video. Try another clip.');
    } finally {
      setCheckingUpload(false);
    }
  }, [checkingUpload]);

  const handleSubmitReview = useCallback(() => {
    if (!pendingReview?.validation.ok) return;

    navigation.replace('StrengthAnalysing', {
      videoUri: pendingReview.videoUri,
      recordedDurationSec: pendingReview.durationSec,
      poseStats: pendingReview.poseStats,
    });
    setPendingReview(null);
  }, [navigation, pendingReview]);

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
        </Pressable>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LumEyebrow pillar="strength" label="Strength" step="Test 2 of 3" />

          <Text style={styles.headline}>
            Time for your <Text style={styles.headlineAccent}>plank</Text>.
          </Text>
          <Text style={styles.subhead}>
            The plank is our baseline strength test — simple, proven, and a reliable snapshot of
            core endurance.
          </Text>

          <Text style={styles.stepsTitle}>How it works</Text>
          {STEPS.map((line, index) => (
            <View key={line} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{line}</Text>
            </View>
          ))}

          <Text style={styles.footnote}>
            Later assessments add a wall sit and — eventually — press-ups. Your strength test
            evolves as you progress.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={handleRecord}>Record plank</LumenButton>
          {__DEV__ ? (
            <Pressable
              style={styles.devBtn}
              onPress={() => void handleDevUpload()}
              disabled={checkingUpload}
              accessibilityRole="button"
            >
              {checkingUpload ? (
                <ActivityIndicator color={lumen.fgMuted} size="small" />
              ) : (
                <Text style={styles.devBtnText}>
                  Upload test video (dev)
                  {isStrengthDevSkipPoseCheck() ? ' · pose skip on' : ''}
                </Text>
              )}
            </Pressable>
          ) : null}
          <Pressable style={styles.link} accessibilityRole="button">
            <Text style={styles.linkText}>
              Learn correct plank form ↗
            </Text>
          </Pressable>
        </View>
      </View>

      {pendingReview ? (
        <PlankRecordingReviewModal
          visible
          durationSec={pendingReview.durationSec}
          poseStats={pendingReview.poseStats}
          validation={pendingReview.validation}
          onSubmit={handleSubmitReview}
          onRecordAgain={() => setPendingReview(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 22,
    marginLeft: -6,
  },
  backIcon: {
    opacity: 0.85,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 28,
  },
  headline: {
    ...sora('extrabold'),
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: -1.54,
    color: lumen.fg,
    marginTop: 14,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22.5,
    color: lumen.fgMuted,
    maxWidth: 310,
  },
  stepsTitle: {
    ...sora('bold'),
    marginTop: 26,
    marginBottom: 4,
    fontSize: 12,
    letterSpacing: 2.16,
    textTransform: 'uppercase',
    color: lumenPillar.strength,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  stepNumber: {
    ...sora('bold'),
    width: 16,
    fontSize: 15,
    color: lumenPillar.strength,
  },
  stepText: {
    ...sora('semibold'),
    flex: 1,
    fontSize: 14.5,
    lineHeight: 20,
    color: lumen.fg,
  },
  footnote: {
    ...sora('semibold'),
    marginTop: 18,
    fontSize: 12.5,
    lineHeight: 19.4,
    color: lumen.fgMuted,
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  link: {
    alignSelf: 'center',
    padding: 4,
  },
  devBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 36,
    justifyContent: 'center',
  },
  devBtnText: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fgMuted,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  linkText: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
