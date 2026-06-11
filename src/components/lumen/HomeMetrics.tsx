import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, sora } from '../../theme';

type LegendDotProps = {
  color: string;
  name: string;
  value: string;
};

export function LegendDot({ color, name, value }: LegendDotProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label} numberOfLines={1}>
        {name}{' '}
        <Text style={styles.labelValue}>{value}</Text>
      </Text>
    </View>
  );
}

function PillarRingMini({
  level,
  color,
  size = 26,
  maxLevel = 10,
}: {
  level: number;
  color: string;
  size?: number;
  maxLevel?: number;
}) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = (level / maxLevel) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cx} r={radius} stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} fill="none" />
      <G rotation={-90} origin={`${cx}, ${cx}`}>
        <Circle
          cx={cx}
          cy={cx}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        />
      </G>
    </Svg>
  );
}

type QuickStatProps = {
  pillar: string;
  level: number;
  color: string;
};

/** KAQuickStat — kale-mobile-design/screens/KaleApp.jsx */
export function QuickStatPillar({ pillar, level, color }: QuickStatProps) {
  const { scale, type, isCompact } = useResponsiveLayout();
  const ringSize = scale(isCompact ? 22 : 26);
  const levelSize = type(isCompact ? 24 : 30);
  const pillarSize = type(isCompact ? 9 : 10);

  return (
    <View style={[styles.stat, isCompact && styles.statNarrow]}>
      <View style={styles.statPillarWrap}>
        <Text
          style={[styles.statPillar, { fontSize: pillarSize, letterSpacing: isCompact ? 0.2 : 0.5 }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {pillar}
        </Text>
      </View>
      <View style={styles.statRow}>
        <Text style={[styles.statLevel, { fontSize: levelSize, lineHeight: levelSize }]}>{level}</Text>
        <View style={styles.statRing}>
          <PillarRingMini level={level} color={color} size={ringSize} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    ...sora('semibold'),
    fontSize: 12,
    color: lumen.fg,
    flexShrink: 0,
  },
  labelValue: {
    ...sora('semibold'),
    fontSize: 12,
    color: lumen.fg,
  },
  stat: {
    flex: 1,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(234,243,228,0.05)',
    borderWidth: 1,
    borderColor: lumen.hairline,
    minHeight: 88,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  statNarrow: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 82,
  },
  statPillarWrap: {
    minHeight: 14,
    width: '100%',
    justifyContent: 'center',
  },
  statPillar: {
    ...sora('bold'),
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 2,
    minHeight: 30,
    width: '100%',
  },
  statLevel: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -0.9,
    flexShrink: 1,
    minWidth: 0,
  },
  statRing: {
    flexShrink: 0,
  },
});
