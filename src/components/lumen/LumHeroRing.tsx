import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { lumen, sora } from '../../theme';
import { RingCenterValue } from './RingCenterValue';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type LumHeroRingProps = {
  value: number | string;
  suffix?: string;
  /** Small label under the value — e.g. "LEVEL" */
  caption?: string;
  pct?: number;
  size?: number;
  stroke?: number;
  accentColor?: string;
};

export function LumHeroRing({
  value,
  suffix,
  caption,
  pct = 100,
  size = 104,
  stroke = 8,
  accentColor = lumen.lime,
}: LumHeroRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const targetPct = Math.max(0, Math.min(100, pct));
  const fontSize = Math.round(size * 0.4);
  const suffixSize = Math.round(size * 0.12);
  const captionSize = Math.max(9, Math.round(size * 0.1));

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(targetPct / 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, targetPct]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={cx} cy={cx} r={radius} stroke={lumen.track} strokeWidth={stroke} fill="none" />
        <G rotation={-90} origin={`${cx}, ${cx}`}>
          <AnimatedCircle
            cx={cx}
            cy={cx}
            r={radius}
            stroke={accentColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>

      <View style={[styles.center, { width: size, height: size }]}>
        {caption ? (
          <View style={styles.stack}>
            <RingCenterValue fontSize={fontSize} color={lumen.lime}>
              {value}
            </RingCenterValue>
            <Text
              allowFontScaling={false}
              style={[styles.caption, { fontSize: captionSize, lineHeight: captionSize + 2, marginTop: 3 }]}
            >
              {caption}
            </Text>
          </View>
        ) : suffix ? (
          <View style={styles.suffixRow}>
            <RingCenterValue fontSize={fontSize} color={lumen.lime}>
              {value}
            </RingCenterValue>
            <View style={[styles.suffixWrap, { marginBottom: Math.round(size * 0.1) }]}>
              <RingCenterValue fontSize={suffixSize} color={lumen.fgMuted} letterSpacing={0}>
                {suffix}
              </RingCenterValue>
            </View>
          </View>
        ) : (
          <RingCenterValue fontSize={fontSize} color={lumen.lime}>
            {value}
          </RingCenterValue>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flexShrink: 0,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  suffixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suffixWrap: {
    marginLeft: 1,
  },
  caption: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});
