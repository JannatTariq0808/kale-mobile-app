// Design: kale-mobile-design — lum-01 KaleWelcomeLumen (screens/KaleLumen.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { InteractionManager, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { LumenButton } from '../../components/lumen/LumenButton';
import { StepGlowDot } from '../../components/lumen/StepGlowDot';
import { LumenGlyph } from '../../components/lumen/LumenGlyph';
import { WelcomeHeroLoader } from '../../components/lumen/WelcomeHeroLoader';
import type { RootStackParamList } from '../../navigation/types';
import {
  markWelcomeSurfaceReady,
  welcomeSurfaceReady,
} from '../../navigation/welcomeSurface';
import { lumen, lumenPillar, sora, typography } from '../../theme';
import { headlineLineHeight } from '../../theme/textMetrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const HERO_SIZE = 152;
const HEADLINE_SIZE = typography.hero;
const kaleLogotype = require('../../../assets/kale-logotype-lime.png');

/** Shrink headline on narrow screens so "Welcome to Kale" stays on one row. */
function getWelcomeHeadlineMetrics(
  contentWidth: number,
  type: (size: number) => number,
) {
  let fontSize = type(HEADLINE_SIZE);
  const minSize = 28;

  while (fontSize >= minSize) {
    const logotypeHeight = fontSize * 0.72;
    const logotypeWidth = (91 / 37) * logotypeHeight;
    const textWidth = fontSize * 5.65;
    if (textWidth + logotypeWidth <= contentWidth) {
      return { fontSize, logotypeHeight, logotypeWidth };
    }
    fontSize -= 1;
  }

  const logotypeHeight = minSize * 0.72;
  return {
    fontSize: minSize,
    logotypeHeight,
    logotypeWidth: (91 / 37) * logotypeHeight,
  };
}

const STEPS = [
  {
    color: lumen.green,
    title: 'Assess your longevity',
    subtitle: 'Three short tests — cardio, strength & knowledge.',
  },
  {
    color: lumenPillar.strength,
    title: 'Know your level',
    subtitle: "See the healthy years you've added — and how to add more.",
  },
  {
    color: lumenPillar.knowledge,
    title: 'Earn Kalettes',
    subtitle: 'Rewards every quarter you complete an assessment.',
  },
] as const;

function WelcomeHeroPlaceholder({ size }: { size: number }) {
  return (
    <View style={[styles.heroPlaceholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <LumenGlyph color={lumen.green} height={size * 0.44} />
    </View>
  );
}

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { pad, usableWidth, type } = useResponsiveLayout();
  const widePad = pad(30);
  const headline = getWelcomeHeadlineMetrics(usableWidth - widePad * 2, type);
  const [heroReady, setHeroReady] = useState(welcomeSurfaceReady);

  useEffect(() => {
    if (welcomeSurfaceReady) {
      setHeroReady(true);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      markWelcomeSurfaceReady();
      setHeroReady(true);
    });

    return () => task.cancel();
  }, []);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 12 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.hero, { paddingHorizontal: widePad }]}>
          {heroReady ? (
            <WelcomeHeroLoader size={HERO_SIZE} glyphColor={lumen.green} />
          ) : (
            <WelcomeHeroPlaceholder size={HERO_SIZE} />
          )}

          <View
            style={styles.headlineRow}
            accessible
            accessibilityRole="header"
            accessibilityLabel="Welcome to Kale"
          >
            <Text
              style={[
                styles.headline,
                {
                  fontSize: headline.fontSize,
                  lineHeight: headlineLineHeight(headline.fontSize),
                },
              ]}
            >
              Welcome to{' '}
            </Text>
            <View
              style={[
                styles.logotypeWrap,
                { height: headlineLineHeight(headline.fontSize) },
              ]}
            >
              <Image
                source={kaleLogotype}
                style={{
                  width: headline.logotypeWidth,
                  height: headline.logotypeHeight,
                  marginTop: Platform.OS === 'ios' ? headline.fontSize * 0.06 : 0,
                }}
                resizeMode="contain"
                accessible={false}
                importantForAccessibility="no"
              />
            </View>
          </View>
          <Text style={styles.subhead}>The longevity programme inside your Kale policy.</Text>
        </View>

        <View style={[styles.steps, { paddingHorizontal: widePad }]}>
          {STEPS.map((step, index) => (
            <View
              key={step.title}
              style={[styles.stepRow, index < STEPS.length - 1 && styles.stepRowBorder]}
            >
              <StepGlowDot color={step.color} />
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.cta, { paddingHorizontal: widePad }]}>
          <LumenButton onPress={() => navigation.navigate('SignIn')}>Log in to Kale</LumenButton>
          <Pressable
            style={styles.resetLink}
            onPress={() => navigation.navigate('ResetPassword')}
            accessibilityRole="button"
          >
            <Text style={styles.resetText}>Reset password</Text>
          </Pressable>
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  safe: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  hero: {
    paddingTop: 20,
    alignItems: 'center',
  },
  heroPlaceholder: {
    borderWidth: 8,
    borderColor: 'rgba(234,243,228,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 26,
    overflow: 'visible',
  },
  logotypeWrap: {
    justifyContent: 'center',
  },
  headline: {
    ...sora('extrabold'),
    letterSpacing: -1.3,
    color: lumen.fg,
    includeFontPadding: false,
    flexShrink: 0,
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(234,243,228,0.55)',
    textAlign: 'center',
    maxWidth: 300,
  },
  steps: {
    marginTop: 8,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234,243,228,0.14)',
  },
  stepCopy: {
    flex: 1,
  },
  stepTitle: {
    ...sora('extrabold'),
    fontSize: 17,
    letterSpacing: -0.2,
    color: lumen.fg,
  },
  stepSubtitle: {
    ...sora('semibold'),
    marginTop: 3,
    fontSize: 13.5,
    lineHeight: 19,
    color: 'rgba(234,243,228,0.55)',
  },
  cta: {
    paddingTop: 8,
    paddingBottom: 14,
    gap: 14,
  },
  resetLink: {
    alignSelf: 'center',
    padding: 4,
  },
  resetText: {
    ...sora('semibold'),
    fontSize: 13.5,
    color: 'rgba(234,243,228,0.55)',
    textDecorationLine: 'underline',
  },
});
