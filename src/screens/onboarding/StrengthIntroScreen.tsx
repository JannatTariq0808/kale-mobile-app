// Design: kale-mobile-design — lum-03 KaleStrengthIntroLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, lumenPillar, sora } from '../../theme';
import { pickPlankVideo } from '../../utils/pickPlankVideo';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthIntro'>;

const STEPS = [
  'Find a clear space and set your phone to record.',
  'Elbows under shoulders, body in one straight line.',
  'Hold as long as you can, then stop recording.',
  'Upload the video — we review it and log your time.',
] as const;

export function StrengthIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [picking, setPicking] = useState(false);

  const handleUpload = async () => {
    if (picking) return;
    setPicking(true);
    try {
      const video = await pickPlankVideo();
      if (video) {
        navigation.navigate('StrengthAnalysing', { videoUri: video.uri });
      }
    } finally {
      setPicking(false);
    }
  };

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
          <LumenButton
            onPress={handleUpload}
            style={picking ? styles.buttonBusy : undefined}
          >
            {picking ? 'Opening library…' : 'Upload plank video'}
          </LumenButton>
          <Pressable style={styles.link} accessibilityRole="button" disabled={picking}>
            <Text style={[styles.linkText, picking && styles.linkDisabled]}>
              Learn correct plank form ↗
            </Text>
          </Pressable>
        </View>
      </View>
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
  buttonBusy: {
    opacity: 0.7,
  },
  link: {
    alignSelf: 'center',
    padding: 4,
  },
  linkText: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
  linkDisabled: {
    opacity: 0.5,
  },
});
