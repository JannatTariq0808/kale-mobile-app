// Design: lum-13 activity rows + nu-2 not-counted badge

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIcon } from './ActivityIcon';
import { GarminDeviceTag } from './GarminDeviceTag';
import type { FitnessActivity } from '../../data/fitnessDemo';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, lumenPillar, sora } from '../../theme';

type ActivityLogListProps = {
  activities: FitnessActivity[];
  onLearnMorePress?: () => void;
};

function ActivityRow({ activity }: { activity: FitnessActivity }) {
  const { type, leading } = useResponsiveLayout();
  const isRide = activity.type === 'ride';
  const accent = isRide ? lumenPillar.knowledge : lumenPillar.cardio;
  const iconBg = activity.counted
    ? isRide
      ? 'rgba(245,233,78,0.15)'
      : 'rgba(0,200,150,0.15)'
    : 'rgba(234,243,228,0.04)';
  const iconBorder = activity.counted
    ? isRide
      ? 'rgba(245,233,78,0.4)'
      : 'rgba(0,200,150,0.4)'
    : lumen.hairline;
  const iconColor = activity.counted ? accent : lumen.fgMuted;
  const eyebrowSize = type(9);
  const nameSize = type(14);
  const metaSize = type(11);
  const sideSize = type(14);
  const metricsSize = type(10);

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg, borderColor: iconBorder }]}>
        <ActivityIcon type={activity.type} size={16} color={iconColor} />
        {!activity.counted ? (
          <View style={styles.warnBadge}>
            <Text style={styles.warnMark}>!</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text
          style={[
            styles.typeEyebrow,
            { fontSize: eyebrowSize, lineHeight: leading(eyebrowSize, 1.3), color: accent },
          ]}
        >
          {isRide ? 'Ride' : 'Run'}
        </Text>
        <Text
          style={[styles.name, { fontSize: nameSize, lineHeight: leading(nameSize) }]}
          numberOfLines={2}
        >
          {activity.name}
        </Text>
        <Text style={[styles.meta, { fontSize: metaSize, lineHeight: leading(metaSize) }]}>
          {activity.date}
          {!activity.counted && activity.reason ? (
            <Text style={styles.reason}> · {activity.reason}</Text>
          ) : null}
        </Text>
        {activity.device ? <GarminDeviceTag device={activity.device} /> : null}
      </View>

      <View style={styles.side}>
        <Text style={[styles.dist, { fontSize: sideSize, lineHeight: leading(sideSize, 1.1) }]}>
          {activity.dist}
        </Text>
        <Text style={[styles.metrics, { fontSize: metricsSize, lineHeight: leading(metricsSize, 1.3) }]}>
          {activity.metric} {activity.metricUnit} · {activity.hr} bpm
        </Text>
      </View>
    </View>
  );
}

export function ActivityLogList({ activities, onLearnMorePress }: ActivityLogListProps) {
  const { type, leading } = useResponsiveLayout();

  return (
    <View>
      <View style={styles.list}>
        {activities.map((activity, index) => (
          <View
            key={`${activity.name}-${activity.date}`}
            style={index < activities.length - 1 ? styles.rowBorder : undefined}
          >
            <ActivityRow activity={activity} />
          </View>
        ))}
      </View>

      <Pressable onPress={onLearnMorePress} style={styles.learnMore}>
        <Text style={[styles.learnMoreText, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
          How do we decide which activities count?{' '}
          <Text style={styles.learnMoreArrow}>→</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    overflow: 'hidden',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  warnBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: lumen.bgDark,
    borderWidth: 1.5,
    borderColor: lumen.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnMark: {
    ...sora('extrabold'),
    fontSize: 9,
    lineHeight: 11,
    color: lumenPillar.strength,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  side: {
    alignItems: 'flex-end',
    flexShrink: 0,
    maxWidth: '36%',
  },
  typeEyebrow: {
    ...sora('extrabold'),
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  name: {
    ...sora('bold'),
    color: lumen.fg,
    marginTop: 4,
  },
  meta: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginTop: 2,
  },
  reason: {
    color: lumen.coral,
  },
  dist: {
    ...sora('extrabold'),
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  metrics: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    marginTop: 2,
  },
  learnMore: {
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    ...sora('bold'),
    color: lumenPillar.cardio,
  },
  learnMoreArrow: {
    ...sora('extrabold'),
  },
});
