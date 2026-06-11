import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen, sora } from '../../theme';

type LumHeroRingProps = {
  value: number | string;
  suffix?: string;
  /** Small label under the value — e.g. "LEVEL" (nu-8 K3KnowledgeRing) */
  caption?: string;
  pct?: number;
  size?: number;
  stroke?: number;
  accentColor?: string;
};

export function LumHeroRing({
  value,
  suffix,
  pct = 100,
  size = 104,
  stroke = 8,
  accentColor = lumen.lime,
}: LumHeroRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const arc = (pct / 100) * circumference;
  const fontSize = Math.round(size * 0.4);
  const suffixSize = Math.round(size * 0.12);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={radius} stroke={lumen.track} strokeWidth={stroke} fill="none" />
        <G rotation={-90} origin={`${cx},${cx}`}>
          <Circle
            cx={cx}
            cy={cx}
            r={radius}
            stroke={accentColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
          />
        </G>
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { fontSize, lineHeight: fontSize }]}>{value}</Text>
            {suffix ? (
              <Text
                style={[
                  styles.suffix,
                  { fontSize: suffixSize, lineHeight: suffixSize, marginBottom: size * 0.14 },
                ]}
              >
                {suffix}
              </Text>
            ) : null}
          </View>
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  captionCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  value: {
    ...sora('semibold'),
    color: lumen.lime,
    textAlign: 'center',
    includeFontPadding: false,
    fontVariant: ['tabular-nums'],
  },
  suffix: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    includeFontPadding: false,
    marginLeft: 1,
  },
});
