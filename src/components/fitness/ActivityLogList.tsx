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
  const { type } = useResponsiveLayout();
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
        <Text style={[styles.typeEyebrow, { fontSize: type(9), color: accent }]}>
          {isRide ? 'Ride' : 'Run'}
        </Text>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { fontSize: type(14) }]} numberOfLines={2}>
            {activity.name}
          </Text>
          <Text style={[styles.dist, { fontSize: type(14) }]}>{activity.dist}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { fontSize: type(11) }]} numberOfLines={2}>
            {activity.date}
            {!activity.counted && activity.reason ? (
              <Text style={styles.reason}> · {activity.reason}</Text>
            ) : null}
          </Text>
          <Text style={[styles.metrics, { fontSize: type(10) }]}>
            {activity.metric} {activity.metricUnit} · {activity.hr} bpm
          </Text>
        </View>
        {activity.device ? <GarminDeviceTag device={activity.device} /> : null}
      </View>
    </View>
  );
}

export function ActivityLogList({ activities, onLearnMorePress }: ActivityLogListProps) {
  const { type } = useResponsiveLayout();

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
        <Text style={[styles.learnMoreText, { fontSize: type(13) }]}>
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
    alignItems: 'flex-start',
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
    marginTop: 2,
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
    lineHeight: 10,
    color: lumenPillar.strength,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  typeEyebrow: {
    ...sora('extrabold'),
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  name: {
    ...sora('bold'),
    color: lumen.fg,
    flex: 1,
    lineHeight: 18,
  },
  dist: {
    ...sora('extrabold'),
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
    flexShrink: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  meta: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    flex: 1,
  },
  reason: {
    color: lumen.coral,
  },
  metrics: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    flexShrink: 0,
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
