import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen } from '../../theme';
import { RingCenterValue } from './RingCenterValue';

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
  const valueSize = Math.round(size * 0.42);

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={cx} cy={cx} r={radius} stroke={lumen.track} strokeWidth={stroke} fill="none" />
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
      <View style={[styles.center, { width: size, height: size }]}>
        {suffix ? (
          <View style={styles.suffixRow}>
            <RingCenterValue fontSize={valueSize} color={numColor ?? lumen.lime}>
              {value}
            </RingCenterValue>
            <View style={[styles.suffixWrap, { marginBottom: Math.round(size * 0.06) }]}>
              <RingCenterValue
                fontSize={Math.round(size * 0.13)}
                color={lumen.fgMuted}
                letterSpacing={0}
              >
                {suffix}
              </RingCenterValue>
            </View>
          </View>
        ) : (
          <RingCenterValue fontSize={valueSize} color={numColor ?? lumen.lime}>
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
    overflow: 'visible',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  suffixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suffixWrap: {
    marginLeft: 1,
  },
});
