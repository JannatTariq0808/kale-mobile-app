// Design: kale-mobile-design — lum-03 KaleStrengthIntroLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import { OnboardingLogoutLink } from '../../components/onboarding/OnboardingLogoutLink';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useOnboardingPillarStatus } from '../../hooks/useOnboardingPillarStatus';
import type { RootStackParamList } from '../../navigation/types';
import {
  getActiveAssessmentFlowAsync,
  isQuarterlyAssessmentFlow,
} from '../../services/assessment/assessmentFlowSession';
import { onboardingSkipTarget } from '../../services/onboarding/resolveOnboardingNavigation';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthIntro'>;

const STEPS = [
  'Find a clear space and prop your phone where you are fully visible.',
  'Elbows under shoulders, body in one straight line.',
  'Tap record, hold as long as you can, then stop.',
  'We log your hold time from the recording.',
] as const;

export function StrengthIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { canSkipStrength, status: pillarStatus, loading: pillarLoading } =
    useOnboardingPillarStatus(user?.uid);
  const [quarterlyFlow, setQuarterlyFlow] = useState(isQuarterlyAssessmentFlow());
  const hideBackButton = pillarLoading || pillarStatus != null || quarterlyFlow;

  // Match Knowledge intro: onboarding can swap pillars; quarterly can leave to home.
  const showOnboardingSkip = pillarStatus != null && canSkipStrength;
  const showQuarterlySkip = quarterlyFlow;
  const showSkip = showOnboardingSkip || showQuarterlySkip;

  useEffect(() => {
    let cancelled = false;
    void getActiveAssessmentFlowAsync().then((flow) => {
      if (!cancelled) setQuarterlyFlow(flow?.mode === 'quarterly');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRecord = () => {
    navigation.navigate('StrengthRecord');
  };

  const handleSkip = useCallback(() => {
    if (showOnboardingSkip) {
      navigation.replace(onboardingSkipTarget('strength'));
      return;
    }
    if (showQuarterlySkip) {
      navigation.replace('Main');
    }
  }, [navigation, showOnboardingSkip, showQuarterlySkip]);

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        {hideBackButton ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
          </Pressable>
        )}

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
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={handleRecord}>Record plank</LumenButton>
          {showSkip ? (
            <Pressable
              onPress={handleSkip}
              style={styles.link}
              accessibilityRole="button"
              accessibilityLabel="Skip for now"
            >
              <Text style={styles.linkText}>Skip for now</Text>
            </Pressable>
          ) : null}
          <OnboardingLogoutLink navigation={navigation} />
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
  headerSpacer: {
    height: 32,
    marginLeft: 16,
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
  footer: {
    flexShrink: 0,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
    alignItems: 'center',
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
});
