import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoalChipPicker, TargetAgeSlider } from '../../components/runningYears/GoalChipPicker';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import {
  RUNNING_YEARS_GOAL_AGE_DEFAULT,
  sportForGoalId,
  yearsProductTitle,
  yearsProductTitleLower,
} from '../../config/runningYearsGoals';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useRunningYearsGoalPresets } from '../../hooks/useRunningYearsGoalPresets';
import type { LongevityStackParamList } from '../../navigation/LongevityStackNavigator';
import { saveRunningYearsGoal } from '../../services/runningYears/runningYearsStorage';
import { fetchDemographicsForAssess } from '../../services/user/fetchHealthProfile';
import { calculateAge } from '../../utils/cardioPerformance';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<LongevityStackParamList, 'RunningYearsGoal'>;

export function RunningYearsGoalScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const presetsState = useRunningYearsGoalPresets();
  const [goalId, setGoalId] = useState('');
  const [targetAge, setTargetAge] = useState(RUNNING_YEARS_GOAL_AGE_DEFAULT);
  const [userAge, setUserAge] = useState(44);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (presetsState.items[0] && !goalId) {
      setGoalId(presetsState.items[0].id);
    }
  }, [goalId, presetsState.items]);

  useEffect(() => {
    void (async () => {
      const profile = await fetchDemographicsForAssess();
      if (profile?.date_of_birth) {
        const dob = new Date(`${profile.date_of_birth}T00:00:00`);
        setUserAge(calculateAge(dob));
      }
    })();
  }, []);

  const yearsFromNow = Math.max(0, targetAge - userAge);
  const sport = sportForGoalId(goalId);
  const productTitle = yearsProductTitle(sport);
  const productTitleLower = yearsProductTitleLower(sport);

  const handleContinue = async () => {
    if (!user?.uid || saving || !goalId) return;
    setSaving(true);
    try {
      await saveRunningYearsGoal(user.uid, { goalId, targetAge });
      navigation.replace('RunningYearsMain');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={() => navigation.replace('RunningYearsIntro')} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={lumen.fg} />
        </Pressable>
        <Text style={styles.step}>Step 1 of 2</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 26 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>YOUR {productTitle.toUpperCase()}</Text>
        <Text style={styles.headline}>
          Picture the <Text style={styles.headlineAccent}>moment</Text>.
        </Text>
        <Text style={styles.subtitle}>
          Choose what you&apos;re training to still be doing — and when. We&apos;ll map it onto your{' '}
          {productTitleLower}.
        </Text>

        {presetsState.loading ? (
          <ActivityIndicator color={lumen.lime} style={styles.loader} />
        ) : (
          <GoalChipPicker presets={presetsState.items} selectedId={goalId} onSelect={setGoalId} />
        )}

        <LumenCard style={[styles.sliderCard, styles.sliderCardOverflow]} padding={18}>
          <TargetAgeSlider value={targetAge} yearsFromNow={yearsFromNow} onChange={setTargetAge} />
        </LumenCard>

        <LumenButton tone="lime" onPress={() => void handleContinue()} style={styles.cta}>
          {saving ? 'Saving…' : `See my ${productTitle}`}
        </LumenButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  topBar: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 6, marginLeft: -6 },
  step: { ...sora('bold'), color: lumen.fgMuted, fontSize: 12, letterSpacing: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 26,
    paddingTop: 14,
    flexGrow: 1,
  },
  loader: { marginVertical: 24 },
  eyebrow: {
    ...sora('bold'),
    color: lumen.lime,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  headline: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 34,
    letterSpacing: -1,
    lineHeight: 36,
    marginTop: 12,
  },
  headlineAccent: { color: lumen.lime },
  subtitle: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: 320,
  },
  sliderCard: {
    marginTop: 22,
  },
  sliderCardOverflow: {
    overflow: 'visible',
  },
  cta: { marginTop: 22 },
});
