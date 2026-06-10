import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen, sora } from '../../theme';

type LumRingProps = {
  value: string | number;
  suffix?: string;
  pct?: number;
  size?: number;
  stroke?: number;
  accent?: string;
  numColor?: string;
};

/** KaleLumenOnboarding.jsx LumRing — pillar / level progress ring */
export function LumRing({
  value,
  suffix,
  pct = 100,
  size = 200,
  stroke = 10,
  accent,
  numColor,
}: LumRingProps) {
  const fill = accent ?? lumen.lime;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const arc = (pct / 100) * circumference;
  const valueSize = size * 0.42;

  return (
    <View style={{ width: size, height: size }}>
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
          <Circle
            cx={cx}
            cy={cx}
            r={radius}
            stroke={fill}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
          />
        </G>
      </Svg>
      <View style={[styles.center, suffix ? styles.centerRow : null]}>
        <Text
          style={[
            styles.value,
            {
              fontSize: valueSize,
              lineHeight: valueSize,
              color: numColor ?? lumen.lime,
            },
          ]}
        >
          {value}
        </Text>
        {suffix ? (
          <Text style={[styles.suffix, { fontSize: size * 0.13, marginBottom: size * 0.06 }]}>
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  value: {
    ...sora('semibold'),
    letterSpacing: -0.5,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  suffix: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    alignSelf: 'center',
  },
});
