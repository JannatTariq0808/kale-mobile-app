// Design: kale-mobile-design — lum-09 KaleLevelRevealLumen (screens/KaleLumenOnboarding2.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useAuthSession } from '../../hooks/useAuthSession';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LumRing } from '../../components/lumen/LumRing';
import { LumenButton } from '../../components/lumen/LumenButton';
import type { RootStackParamList } from '../../navigation/types';
import {
  loadLevelRevealData,
  type LevelRevealData,
} from '../../services/onboarding/onboardingPillarStatus';
import { notifyLevelRevealed } from '../../services/notifications/levelRevealLocalNotification';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelReveal'>;

type PillarRing = {
  level: number;
  color: string;
  contribution: string;
  mergeOffset: number;
};

const RING_ROW_WIDTH = 320;
const SMALL_RING = 86;
const BIG_RING = 176;
const GLOW_SIZE = 340;

type RevealStage = 0 | 1 | 2 | 3;

function buildPillars(data: LevelRevealData): PillarRing[] {
  return [
    {
      level: data.cardioLevel,
      color: lumenPillar.cardio,
      contribution: '70%',
      mergeOffset: 84,
    },
    {
      level: data.strengthLevel,
      color: lumenPillar.strength,
      contribution: '20%',
      mergeOffset: 0,
    },
    {
      level: data.knowledgeLevel,
      color: lumenPillar.knowledge,
      contribution: '10%',
      mergeOffset: -84,
    },
  ];
}

export function LevelRevealScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { leading } = useResponsiveLayout();
  const [stage, setStage] = useState<RevealStage>(0);
  const [revealData, setRevealData] = useState<LevelRevealData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const headlineSize = 26;

  const retryLoad = () => {
    setLoadError(false);
    setRevealData(null);
    setStage(0);
    setRetryKey((value) => value + 1);
  };

  const glowOpacity = useSharedValue(0);
  const bigRingScale = useSharedValue(0.6);
  const bigRingOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const copyOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;
    void loadLevelRevealData(user.uid).then((data) => {
      if (cancelled) return;
      if (data) {
        setRevealData(data);
        setLoadError(false);
      } else {
        setLoadError(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, retryKey]);

  useEffect(() => {
    if (!revealData) return;

    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1900),
      setTimeout(() => {
        setStage(3);
        glowOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) });
        bigRingOpacity.value = withTiming(1, { duration: 620, easing: Easing.out(Easing.back(1.2)) });
        bigRingScale.value = withTiming(1, { duration: 620, easing: Easing.out(Easing.back(1.2)) });
        copyOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
        footerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.04, { duration: 1700, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        );
        void notifyLevelRevealed({
          assessmentId: revealData.assessmentId,
          level: revealData.longevityLevel,
        });
      }, 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [bigRingOpacity, bigRingScale, copyOpacity, footerOpacity, glowOpacity, pulseScale, revealData]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const bigRingWrapStyle = useAnimatedStyle(() => ({
    opacity: bigRingOpacity.value,
    transform: [{ scale: bigRingScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const copyStyle = useAnimatedStyle(() => ({
    opacity: copyOpacity.value,
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  if (loadError) {
    return (
      <View style={[styles.screen, styles.loading]}>
        <Text style={styles.errorTitle}>Couldn&apos;t load your level reveal</Text>
        <Text style={styles.errorCopy}>
          Your onboarding assessment needs all three pillars linked and completed: cardio, strength,
          and knowledge. Each pillar doc needs is_completed: true (and a level for strength and
          knowledge).
        </Text>
        <LumenButton onPress={retryLoad} style={styles.errorButton}>
          Try again
        </LumenButton>
      </View>
    );
  }

  if (!revealData) {
    return (
      <View style={[styles.screen, styles.loading]}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  const pillars = buildPillars(revealData);
  const longevityLevel = revealData.longevityLevel;

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 26 },
        ]}
      >
        <Text style={styles.eyebrow}>Your Longevity Level</Text>

        <View style={styles.ringStage}>
          <View style={[styles.pillarRow, { width: RING_ROW_WIDTH, height: SMALL_RING + 28 }]}>
            {pillars.map((pillar, index) => (
              <PillarRingSlot
                key={pillar.color}
                pillar={pillar}
                index={index}
                stage={stage}
              />
            ))}
          </View>

          <Animated.View style={[styles.bigRingWrap, bigRingWrapStyle]}>
            <Animated.View style={[styles.ringGlowBehind, glowStyle]} pointerEvents="none">
              <Svg width={GLOW_SIZE} height={GLOW_SIZE}>
                <Defs>
                  <RadialGradient id="levelRevealGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor={lumen.lime} stopOpacity={0.2} />
                    <Stop offset="0.45" stopColor={lumen.lime} stopOpacity={0.26} />
                    <Stop offset="0.7" stopColor={lumen.lime} stopOpacity={0.12} />
                    <Stop offset="1" stopColor={lumen.lime} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#levelRevealGlow)" />
              </Svg>
            </Animated.View>
            <Animated.View style={pulseStyle}>
              <View style={styles.bigRingGlow}>
                <LumRing
                  value={longevityLevel}
                  pct={longevityLevel * 10}
                  size={BIG_RING}
                  stroke={10}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.copy, copyStyle]}>
          <Text
            style={[
              styles.headline,
              { fontSize: headlineSize, lineHeight: leading(headlineSize, 1.15) },
            ]}
          >
            <Text style={styles.headlineAccent}>Level {longevityLevel}.</Text> You're in good shape.
          </Text>

          {revealData.trend === 'up' ? (
            <View style={styles.trendChipUp}>
              <Ionicons name="arrow-up" size={11} color="#3FD08B" />
              <Text style={styles.trendTextUp}>
                +{revealData.trendDelta ?? 1} from last cycle
              </Text>
            </View>
          ) : null}
          {revealData.trend === 'down' ? (
            <View style={styles.trendChipDown}>
              <Ionicons name="arrow-down" size={11} color={lumen.coral} />
              <Text style={styles.trendTextDown}>
                {revealData.trendDelta ?? -1} from last cycle
              </Text>
            </View>
          ) : null}
          {revealData.trend === 'same' ? (
            <View style={styles.trendChipSame}>
              <Text style={styles.trendTextSame}>Held from last cycle</Text>
            </View>
          ) : null}
        </Animated.View>

        <Animated.View style={[styles.footer, footerStyle]}>
          <LumenButton onPress={() => navigation.replace('HealthYears')}>
            What this means for your health
          </LumenButton>
        </Animated.View>
      </View>
    </View>
  );
}

function PillarRingSlot({
  pillar,
  index,
  stage,
}: {
  pillar: PillarRing;
  index: number;
  stage: RevealStage;
}) {
  const slotLeft = index * 116;
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const labelOpacity = useSharedValue(0);

  useEffect(() => {
    if (stage >= 1) {
      labelOpacity.value = withDelay(
        100 + index * 200,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
      );
    } else {
      labelOpacity.value = 0;
    }

    if (stage >= 2) {
      const mergeDelay = index * 100;
      opacity.value = withDelay(
        mergeDelay,
        withTiming(0, { duration: 900, easing: Easing.bezier(0.5, 0.05, 0.3, 1) }),
      );
      translateX.value = withDelay(
        mergeDelay,
        withTiming(pillar.mergeOffset, {
          duration: 900,
          easing: Easing.bezier(0.5, 0.05, 0.3, 1),
        }),
      );
      scale.value = withDelay(
        mergeDelay,
        withTiming(0.5, { duration: 900, easing: Easing.bezier(0.5, 0.05, 0.3, 1) }),
      );
    } else {
      opacity.value = 1;
      translateX.value = 0;
      scale.value = 1;
    }
  }, [index, labelOpacity, opacity, pillar.mergeOffset, scale, stage, translateX]);

  const slotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <Animated.View style={[styles.pillarSlot, { left: slotLeft }, slotStyle]}>
      <LumRing
        value={pillar.level}
        pct={pillar.level * 10}
        size={SMALL_RING}
        stroke={5}
        accent={pillar.color}
        numColor={lumen.fg}
      />
      <Animated.Text style={[styles.contribution, { color: pillar.color }, labelStyle]}>
        {pillar.contribution}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  errorTitle: {
    ...sora('bold'),
    fontSize: 18,
    color: lumen.fg,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorCopy: {
    ...sora('regular'),
    fontSize: 14,
    lineHeight: 20,
    color: lumen.fgMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    alignSelf: 'stretch',
    maxWidth: 280,
  },
  content: {
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  eyebrow: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: lumen.green,
    marginBottom: 30,
  },
  ringStage: {
    alignItems: 'center',
    minHeight: BIG_RING + 80,
  },
  pillarRow: {
    position: 'relative',
  },
  pillarSlot: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: SMALL_RING,
  },
  contribution: {
    ...sora('bold'),
    marginTop: 8,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '100%',
  },
  bigRingWrap: {
    marginTop: 26,
    width: BIG_RING,
    height: BIG_RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGlowBehind: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    left: (BIG_RING - GLOW_SIZE) / 2,
    top: (BIG_RING - GLOW_SIZE) / 2,
    zIndex: 0,
  },
  bigRingGlow: {
    zIndex: 1,
    shadowColor: lumen.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 12,
  },
  copy: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    maxWidth: 300,
  },
  headline: {
    ...sora('extrabold'),
    letterSpacing: -0.65,
    color: lumen.fg,
    textAlign: 'center',
  },
  headlineAccent: {
    color: lumen.lime,
  },
  trendChipUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  trendTextUp: {
    ...sora('extrabold'),
    fontSize: 12,
    color: '#3FD08B',
  },
  trendChipDown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,90,90,0.12)',
  },
  trendTextDown: {
    ...sora('extrabold'),
    fontSize: 12,
    color: lumen.coral,
  },
  trendChipSame: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  trendTextSame: {
    ...sora('semibold'),
    fontSize: 12,
    color: lumen.fgMuted,
  },
  footer: {
    alignSelf: 'stretch',
  },
});
