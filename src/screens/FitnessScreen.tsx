// Design: lum-13 KaleFitnessCardioLumen + nu-2 filter tabs (screens/KaleLumenApp.jsx, KaleApp.jsx)

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { ActivityLogFilters } from '../components/fitness/ActivityLogFilters';
import { ActivityLogList } from '../components/fitness/ActivityLogList';
import { ActivityLogSummary } from '../components/fitness/ActivityLogSummary';
import { StrengthPanel } from '../components/fitness/StrengthPanel';
import { KnowledgePanel } from '../components/fitness/KnowledgePanel';
import { Vo2MaxPanel } from '../components/fitness/Vo2MaxPanel';
import {
  FitnessShell,
  type FitnessPillar,
  type FitnessSubTab,
} from '../components/fitness/FitnessShell';
import { LumenBackground } from '../components/lumen/LumenBackground';
import { LumenHeader } from '../components/lumen/LumenHeader';
import {
  filterActivities,
  fitnessActivityLog,
  type CountFilter,
  type SportFilter,
} from '../data/fitnessDemo';
import { homeDemo } from '../data/homeDemo';
import { lumen } from '../theme';

function ActivityLogPanel() {
  const [sportFilter, setSportFilter] = useState<SportFilter>('All sports');
  const [countFilter, setCountFilter] = useState<CountFilter>('All');

  const visibleActivities = useMemo(
    () => filterActivities([...fitnessActivityLog.activities], countFilter, sportFilter),
    [countFilter, sportFilter],
  );

  return (
    <>
      <ActivityLogSummary
        countedLabel={fitnessActivityLog.summary.countedLabel}
        runCount={fitnessActivityLog.summary.runCount}
        distanceKm={fitnessActivityLog.summary.distanceKm}
      />
      <ActivityLogFilters
        sportFilter={sportFilter}
        countFilter={countFilter}
        onSportFilterChange={setSportFilter}
        onCountFilterChange={setCountFilter}
      />
      <ActivityLogList activities={visibleActivities} />
    </>
  );
}

export function FitnessScreen() {
  const [pillar, setPillar] = useState<FitnessPillar>('cardio');
  const [subTab, setSubTab] = useState<FitnessSubTab>('log');

  const level = homeDemo.pillarLevels[pillar];

  const body =
    pillar === 'strength' ? (
      <StrengthPanel />
    ) : pillar === 'knowledge' ? (
      <KnowledgePanel />
    ) : pillar === 'cardio' && subTab === 'log' ? (
      <ActivityLogPanel />
    ) : pillar === 'cardio' ? (
      <Vo2MaxPanel />
    ) : null;

  return (
    <View style={styles.screen}>
      <LumenBackground />
      <LumenHeader />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <FitnessShell
          pillar={pillar}
          subTab={subTab}
          level={level}
          onPillarChange={(next) => {
            setPillar(next);
            if (next !== 'cardio') {
              setSubTab('log');
            }
          }}
          onSubTabChange={setSubTab}
        >
          {body}
        </FitnessShell>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDark,
  },
  scrollContent: {
    paddingTop: 8,
  },
});
