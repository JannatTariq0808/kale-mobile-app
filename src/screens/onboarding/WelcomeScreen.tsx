// Design: kale-mobile-design — lum-01 KaleWelcomeLumen (screens/KaleLumen.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumenButton } from '../../components/lumen/LumenButton';
import { StepGlowDot } from '../../components/lumen/StepGlowDot';
import { LumenLogotype } from '../../components/lumen/LumenLogotype';
import { LumenWelcomeBackground } from '../../components/lumen/LumenWelcomeBackground';
import { WelcomeHeroLoader } from '../../components/lumen/WelcomeHeroLoader';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, lumenPillar, sora, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const HERO_SIZE = 152;
const HEADLINE_SIZE = typography.hero;
/** Design: LumenLogotype height 0.72em, verticalAlign -0.03em (KaleLumen.jsx) */
const LOGOTYPE_HEIGHT = HEADLINE_SIZE * 0.72;
const LOGOTYPE_BASELINE_NUDGE = HEADLINE_SIZE * 0.03;

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

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <LumenWelcomeBackground />
      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.hero}>
          <WelcomeHeroLoader size={HERO_SIZE} glyphColor={lumen.green} />

          <View style={styles.headlineRow}>
            <Text style={styles.headline}>Welcome to </Text>
            <View style={styles.logotypeWrap}>
              <LumenLogotype color={lumen.lime} height={LOGOTYPE_HEIGHT} />
            </View>
          </View>
          <Text style={styles.subhead}>The longevity programme inside your Kale policy.</Text>
        </View>

        <View style={styles.steps}>
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

        <View style={styles.cta}>
          <LumenButton onPress={() => navigation.navigate('SignIn')}>Log in to Kale</LumenButton>
          <Pressable style={styles.resetLink} accessibilityRole="button">
            <Text style={styles.resetText}>Reset password</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  hero: {
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 26,
  },
  headline: {
    ...sora('extrabold'),
    fontSize: HEADLINE_SIZE,
    lineHeight: HEADLINE_SIZE,
    letterSpacing: -1.3,
    color: lumen.fg,
    textAlign: 'center',
    includeFontPadding: false,
  },
  logotypeWrap: {
    height: LOGOTYPE_HEIGHT,
    marginTop: LOGOTYPE_BASELINE_NUDGE,
    justifyContent: 'center',
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
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
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
    paddingHorizontal: 30,
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
