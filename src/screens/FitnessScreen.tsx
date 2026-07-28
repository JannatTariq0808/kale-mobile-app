// Design: lum-13 KaleFitnessCardioLumen + nu-2 filter tabs (screens/KaleLumenApp.jsx, KaleApp.jsx)

import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { ActivityLogFilters } from '../components/fitness/ActivityLogFilters';
import { ActivityLogList } from '../components/fitness/ActivityLogList';
import { ActivityLogSummary } from '../components/fitness/ActivityLogSummary';
import { FitnessFaqSection } from '../components/fitness/FitnessFaqSection';
import { StrengthPanel } from '../components/fitness/StrengthPanel';
import { KnowledgePanel } from '../components/fitness/KnowledgePanel';
import { Vo2MaxPanel } from '../components/fitness/Vo2MaxPanel';
import {
  FitnessShell,
  type FitnessPillar,
  type FitnessSubTab,
} from '../components/fitness/FitnessShell';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { filterActivities, type CountFilter, type SportFilter } from '../data/fitnessDemo';
import { useCardioQuestions } from '../hooks/useCardioQuestions';
import { useFitnessPillarData } from '../hooks/useFitnessPillarData';
import type { CardioActivityLog } from '../services/cardio/fetchCardioActivities';
import { lumenPillar } from '../theme';

function ActivityLogPanel({
  summary,
  activities,
}: {
  summary: CardioActivityLog['summary'];
  activities: CardioActivityLog['activities'];
}) {
  const [sportFilter, setSportFilter] = useState<SportFilter>('All sports');
  const [countFilter, setCountFilter] = useState<CountFilter>('All');
  const { items: faqItems, loading: faqLoading } = useCardioQuestions();

  const visibleActivities = useMemo(
    () => filterActivities(activities, countFilter, sportFilter),
    [activities, countFilter, sportFilter],
  );

  return (
    <>
      <ActivityLogSummary
        countedLabel={summary.countedLabel}
        runCount={summary.runCount}
        distanceKm={summary.distanceKm}
      />
      <ActivityLogFilters
        sportFilter={sportFilter}
        countFilter={countFilter}
        periodLabel={summary.periodLabel}
        onSportFilterChange={setSportFilter}
        onCountFilterChange={setCountFilter}
      />
      <ActivityLogList
        activities={visibleActivities}
        sportFilter={sportFilter}
        countFilter={countFilter}
        periodLabel={summary.periodLabel}
        hasAnyActivities={activities.length > 0}
      />
      <FitnessFaqSection items={faqItems} loading={faqLoading} accentColor={lumenPillar.cardio} />
    </>
  );
}

export function FitnessScreen() {
  const { pillarsLoading, levels, strength, knowledge, cardio, activityLog, refresh } =
    useFitnessPillarData();
  const didInitialFocus = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!didInitialFocus.current) {
        didInitialFocus.current = true;
        return;
      }
      refresh();
    }, [refresh]),
  );
  const [pillar, setPillar] = useState<FitnessPillar>('cardio');
  const [subTab, setSubTab] = useState<FitnessSubTab>('log');

  const level = levels[pillar];

  const body =
    pillar === 'strength' ? (
      <StrengthPanel data={strength} loading={pillarsLoading} />
    ) : pillar === 'knowledge' ? (
      <KnowledgePanel data={knowledge} loading={pillarsLoading} />
    ) : pillar === 'cardio' && subTab === 'log' ? (
      <ActivityLogPanel summary={activityLog.summary} activities={activityLog.activities} />
    ) : pillar === 'cardio' ? (
      <Vo2MaxPanel data={cardio} />
    ) : null;

  return (
    <View style={styles.screen}>
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 8,
  },
});
