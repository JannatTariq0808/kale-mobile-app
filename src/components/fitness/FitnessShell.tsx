// Design: kale-mobile-design — LumFitnessShell (screens/KaleLumenApp.jsx)

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, lumenPillar, sora } from '../../theme';

export type FitnessPillar = 'cardio' | 'strength' | 'knowledge';
export type FitnessSubTab = 'log' | 'vo2max';

const PILLARS: { id: FitnessPillar; label: string }[] = [
  { id: 'cardio', label: 'Cardio' },
  { id: 'strength', label: 'Strength' },
  { id: 'knowledge', label: 'Knowledge' },
];

const CARDIO_SUBTABS: { id: FitnessSubTab; label: string }[] = [
  { id: 'log', label: 'Activity log' },
  { id: 'vo2max', label: 'VO₂max' },
];

type FitnessShellProps = {
  pillar: FitnessPillar;
  subTab: FitnessSubTab;
  level: number;
  onPillarChange: (pillar: FitnessPillar) => void;
  onSubTabChange: (subTab: FitnessSubTab) => void;
  children: ReactNode;
};

export function FitnessShell({
  pillar,
  subTab,
  level,
  onPillarChange,
  onSubTabChange,
  children,
}: FitnessShellProps) {
  const { type } = useResponsiveLayout();
  const pillarColor = lumenPillar[pillar];
  const subTabs = pillar === 'cardio' ? CARDIO_SUBTABS : [];
  const title = pillar.charAt(0).toUpperCase() + pillar.slice(1);
  const titleSize = type(32);
  const titleLineHeight = Math.round(titleSize * 1.2);

  return (
    <View style={styles.wrap}>
      <View style={styles.pillarTrack}>
        {PILLARS.map((item) => {
          const active = pillar === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => onPillarChange(item.id)}
              style={[styles.pillarPill, active && { backgroundColor: lumenPillar[item.id] }]}
            >
              <Text
                style={[
                  styles.pillarLabel,
                  { fontSize: type(13), lineHeight: type(17) },
                  active ? styles.pillarLabelActive : styles.pillarLabelIdle,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.titleRow}>
        <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleLineHeight }]}>{title}</Text>
        <Text style={[styles.level, { fontSize: type(12), color: pillarColor }]}>LEVEL {level}</Text>
      </View>

      {subTabs.length > 0 ? (
        <View style={styles.subTabRow}>
          {subTabs.map((item) => {
            const active = subTab === item.id;
            return (
              <Pressable key={item.id} onPress={() => onSubTabChange(item.id)} style={styles.subTab}>
                <Text
                  style={[
                    styles.subTabLabel,
                    { fontSize: type(13) },
                    active ? styles.subTabLabelActive : styles.subTabLabelIdle,
                    active && { borderBottomColor: pillarColor },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  pillarTrack: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 6,
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    marginBottom: 16,
  },
  pillarPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  pillarLabel: {
    ...sora('bold'),
  },
  pillarLabelActive: {
    color: '#003A38',
  },
  pillarLabelIdle: {
    color: lumen.fgMuted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -1,
  },
  level: {
    ...sora('bold'),
    letterSpacing: 0.8,
  },
  subTabRow: {
    flexDirection: 'row',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
    marginBottom: 4,
  },
  subTab: {
    marginRight: 16,
  },
  subTabLabel: {
    ...sora('semibold'),
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabLabelActive: {
    ...sora('bold'),
    color: lumen.fg,
  },
  subTabLabelIdle: {
    color: lumen.fgMuted,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 12,
  },
});
