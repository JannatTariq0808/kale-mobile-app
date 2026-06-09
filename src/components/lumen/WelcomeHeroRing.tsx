// Design: kale-mobile-design — KaleWelcomeLumen ring (screens/KaleLumen.jsx)
// lumenRingFill keyframes: 0%→20% empty · 20%→66% fill · 66%→88% hold · 88%→100% drain

import { useLayoutEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnUI,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen } from '../../theme';
import { RING_CYCLE_MS, RING_EMPTY_FRACTION } from './welcomeLoaderTiming';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Design: lumenRingFill cubic-bezier(.4,0,.2,1) */
const RING_EASING = Easing.bezier(0.4, 0, 0.2, 1);

/** Design keyframe stops (pathLength 100) */
const KF = {
  emptyEnd: RING_EMPTY_FRACTION,
  fillEnd: 0.66,
  holdEnd: 0.88,
  cycleEnd: 1,
} as const;

type WelcomeHeroRingProps = {
  size?: number;
  onRingReset?: () => void;
};

export function WelcomeHeroRing({ size = 152, onRingReset }: WelcomeHeroRingProps) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const progress = useSharedValue(0);

  useLayoutEffect(() => {
    // Start at emptyEnd (dot at top) and fill immediately — avoids ~920ms dead time on mount
    const start = KF.emptyEnd;
    const duration = RING_CYCLE_MS * (1 - start);

    runOnUI(() => {
      'worklet';
      progress.value = start;
      progress.value = withRepeat(
        withTiming(1, { duration, easing: RING_EASING }),
        -1,
        false,
      );
    })();
  }, [progress]);

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (onRingReset && previous !== null && previous < 0.995 && current >= 0.995) {
        runOnJS(onRingReset)();
      }
    },
    [onRingReset],
  );

  const animatedProps = useAnimatedProps(() => {
    const arc = interpolate(
      progress.value,
      [0, KF.emptyEnd, KF.fillEnd, KF.holdEnd, KF.cycleEnd],
      [0, 0, circumference, circumference, 0],
    );

    return {
      strokeDasharray: `${arc} ${circumference}`,
      strokeDashoffset: 0,
    };
  });

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={cx}
        cy={cx}
        r={radius}
        stroke={lumen.track}
        strokeWidth={stroke}
        fill="none"
      />
      <G rotation={-90} origin={`${cx}, ${cx}`}>
        <AnimatedCircle
          cx={cx}
          cy={cx}
          r={radius}
          stroke={lumen.green}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </G>
    </Svg>
  );
}
