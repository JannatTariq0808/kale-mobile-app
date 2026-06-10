// Design: kale-mobile-design — LumenBackdrop (screens/KaleLumen.jsx)

import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { lumen } from '../../theme';
import {
  glassCurvePathAt,
  LUMEN_CURVE_CYCLE_MS,
  STATIC_GLASS_PATH,
  STATIC_UPPER_PATH,
  upperPathAt,
} from './lumenBackdropPaths';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const W = 390;
const H = 844;

type LumenWelcomeBackgroundProps = {
  /** When false, renders the same look without morphing paths (much cheaper). */
  animated?: boolean;
};

function BackdropDefs() {
  return (
    <Defs>
      <LinearGradient id="lumUpperGrad" x1="0" y1="0" x2="0.7" y2="1">
        <Stop offset="0" stopColor={lumen.bgSurface} />
        <Stop offset="1" stopColor={lumen.bgLight} />
      </LinearGradient>
      <RadialGradient id="lumGloss" cx="0.18" cy="0.1" rx="0.85" ry="0.85">
        <Stop offset="0" stopColor="#EAF3E4" stopOpacity="0.055" />
        <Stop offset="0.55" stopColor="#EAF3E4" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="lumVignette" cx="0.12" cy="0.96" rx="0.7" ry="0.7">
        <Stop offset="0" stopColor="#002F30" stopOpacity="0.45" />
        <Stop offset="1" stopColor="#002F30" stopOpacity="0" />
      </RadialGradient>
    </Defs>
  );
}

function StaticBackdrop() {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <BackdropDefs />
      <Rect x={0} y={0} width={W} height={H} fill={lumen.bgDeep} />
      <Path d={STATIC_UPPER_PATH} fill="url(#lumUpperGrad)" />
      <Rect x={0} y={0} width={W} height={H} fill="url(#lumVignette)" />
      <Rect x={0} y={0} width={W} height={H} fill="url(#lumGloss)" />
      <Path
        d={STATIC_GLASS_PATH}
        fill="none"
        stroke="#EAF3E4"
        strokeOpacity={0.13}
        strokeWidth={1.4}
      />
    </Svg>
  );
}

function AnimatedBackdrop() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: LUMEN_CURVE_CYCLE_MS, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [progress]);

  const upperProps = useAnimatedProps(() => ({
    d: upperPathAt(progress.value),
  }));

  const curveProps = useAnimatedProps(() => ({
    d: glassCurvePathAt(progress.value),
  }));

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <BackdropDefs />
      <Rect x={0} y={0} width={W} height={H} fill={lumen.bgDeep} />
      <AnimatedPath animatedProps={upperProps} fill="url(#lumUpperGrad)" />
      <Rect x={0} y={0} width={W} height={H} fill="url(#lumVignette)" />
      <Rect x={0} y={0} width={W} height={H} fill="url(#lumGloss)" />
      <AnimatedPath
        animatedProps={curveProps}
        fill="none"
        stroke="#EAF3E4"
        strokeOpacity={0.13}
        strokeWidth={1.4}
      />
    </Svg>
  );
}

/** Curved glass-edge backdrop — SVG path animation on Welcome, static elsewhere. */
export const LumenWelcomeBackground = memo(function LumenWelcomeBackground({
  animated = false,
}: LumenWelcomeBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {animated ? <AnimatedBackdrop /> : <StaticBackdrop />}
    </View>
  );
});
