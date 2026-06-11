// Design: nu-2 filter tabs + lum-13 Lumen palette

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIcon } from './ActivityIcon';
import type { CountFilter, SportFilter } from '../../data/fitnessDemo';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, lumenPillar, sora } from '../../theme';

const SPORT_OPTIONS: { id: SportFilter; icon?: 'run' | 'ride' }[] = [
  { id: 'All sports' },
  { id: 'Runs', icon: 'run' },
  { id: 'Rides', icon: 'ride' },
];

const COUNT_OPTIONS: CountFilter[] = ['All', 'Counted', 'Not counted'];

type ActivityLogFiltersProps = {
  sportFilter: SportFilter;
  countFilter: CountFilter;
  onSportFilterChange: (filter: SportFilter) => void;
  onCountFilterChange: (filter: CountFilter) => void;
};

export function ActivityLogFilters({
  sportFilter,
  countFilter,
  onSportFilterChange,
  onCountFilterChange,
}: ActivityLogFiltersProps) {
  const { type } = useResponsiveLayout();
  const pillSize = type(12);

  return (
    <View style={styles.wrap}>
      <View style={styles.sportRow}>
        {SPORT_OPTIONS.map((option) => {
          const active = sportFilter === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSportFilterChange(option.id)}
              style={[styles.sportPill, active && styles.sportPillActive]}
            >
              {option.icon ? (
                <ActivityIcon
                  type={option.icon}
                  size={13}
                  color={active ? lumen.bgDark : lumen.fg}
                />
              ) : null}
              <Text style={[styles.sportLabel, { fontSize: pillSize }, active && styles.sportLabelActive]}>
                {option.id}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.countRow}>
        <View style={styles.countPills}>
          {COUNT_OPTIONS.map((option) => {
            const active = countFilter === option;
            return (
              <Pressable
                key={option}
                onPress={() => onCountFilterChange(option)}
                style={[styles.countPill, active && styles.countPillActive]}
              >
                <Text style={[styles.countLabel, { fontSize: pillSize }, active && styles.countLabelActive]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.periodLabel, { fontSize: pillSize }]}>Last 12 weeks</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    marginBottom: 16,
  },
  sportRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sportPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'transparent',
  },
  sportPillActive: {
    backgroundColor: lumenPillar.cardio,
    borderColor: lumenPillar.cardio,
  },
  sportLabel: {
    ...sora('bold'),
    color: lumen.fg,
  },
  sportLabelActive: {
    color: lumen.bgDark,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  countPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  countPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'transparent',
  },
  countPillActive: {
    backgroundColor: lumen.fg,
    borderColor: lumen.fg,
  },
  countLabel: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  countLabelActive: {
    ...sora('semibold'),
    color: lumen.bgDark,
  },
  periodLabel: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginLeft: 'auto',
  },
});
