// "Your new price" — the final onboarding screen: Longevity Level, Fitness Age
// and indicative price, with a Set-a-goal CTA.
// Price is a placeholder until Best's reassessment (MTA) price API is wired up.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumenButton } from '../../components/lumen/LumenButton';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useAssessmentCycle } from '../../hooks/useAssessmentCycle';
import { useIncomeProtection } from '../../hooks/useIncomeProtection';
import type { RootStackParamList } from '../../navigation/types';
import { enterMainApp } from '../../services/auth/session';
import { fetchUserFirstName } from '../../services/home/fetchHomeLongevityData';
import { fetchAthleteLevel } from '../../services/user/athleteLevel';
import { fetchDemographicsForAssess } from '../../services/user/fetchHealthProfile';
import { ageFromDob, fitnessAge, toSex } from '../../services/fitness/fitnessAge';
import { displayTextStyle } from '../../theme/textMetrics';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FitnessAge'>;

/**
 * Placeholder monthly premium (and the "was" price) until the Best reassessment
 * (MTA) price API is available. Swap these for the live values when it lands.
 */
const PLACEHOLDER_MONTHLY_PRICE_GBP = 25;
const PLACEHOLDER_PREVIOUS_PRICE_GBP = 27;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

type FitnessAgeData = {
  firstName: string;
  level: number;
  fitnessAge: number | null;
};

async function loadFitnessAgeData(uid: string): Promise<FitnessAgeData> {
  const [level, demographics, firstName] = await Promise.all([
    fetchAthleteLevel(uid),
    fetchDemographicsForAssess(),
    fetchUserFirstName(uid),
  ]);
  const realAge = demographics ? ageFromDob(demographics.date_of_birth) : null;
  const computed =
    realAge != null ? fitnessAge(level, realAge, toSex(demographics?.gender)) : null;
  return { firstName, level, fitnessAge: computed };
}

export function FitnessAgeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { isIpCustomer } = useIncomeProtection();
  const cycle = useAssessmentCycle();
  const [data, setData] = useState<FitnessAgeData | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void loadFitnessAgeData(user.uid).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  if (data == null) {
    return (
      <View style={[styles.screen, styles.loading]}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  const { firstName, level, fitnessAge: computedFitnessAge } = data;
  const greeting = firstName && firstName !== 'Member' ? `${firstName}, you're` : "You're";

  const now = new Date();
  const paymentMonth = MONTH_NAMES[(now.getMonth() + 1) % 12];
  const nextAssessmentMonth = MONTH_NAMES[cycle.nextAssessmentDate.getMonth()];

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrow}>Your first assessment</Text>
          </View>

          <Text style={styles.headline}>
            {greeting}
            {'\n'}
            <Text style={styles.headlineAccent}>Longevity Level {level}</Text>
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>FITNESS AGE</Text>
              <Text style={displayTextStyle(64, lumen.lime)}>
                {computedFitnessAge ?? '—'}
              </Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>YOUR PRICE</Text>
              <View style={styles.priceRow}>
                <Text style={[displayTextStyle(40, lumen.lime), styles.priceSymbol]}>£</Text>
                <Text style={displayTextStyle(64, lumen.lime)}>
                  {PLACEHOLDER_MONTHLY_PRICE_GBP}
                </Text>
                <Text style={styles.priceUnit}>a month</Text>
              </View>
            </View>
          </View>

          <Text style={styles.paymentLine}>from your {paymentMonth} payment</Text>
          <Text style={styles.wasLine}>Was £{PLACEHOLDER_PREVIOUS_PRICE_GBP}.</Text>

          <View style={styles.nextPill}>
            <Text style={styles.nextPillText}>
              Your next assessment is in {nextAssessmentMonth}.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton
            onPress={() => enterMainApp(navigation, isIpCustomer ? 'Goals' : undefined)}
          >
            Set a goal for the next 3 months
          </LumenButton>
          <Pressable
            style={styles.skipLink}
            onPress={() => enterMainApp(navigation)}
            accessibilityRole="button"
            accessibilityLabel="Skip for now"
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: lumen.lime,
  },
  eyebrow: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: lumen.lime,
  },
  headline: {
    ...sora('extrabold'),
    marginTop: 18,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: lumen.fg,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    marginTop: 30,
  },
  statCol: {
    alignItems: 'flex-start',
  },
  statLabel: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 1.2,
    color: lumen.fgMuted,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceSymbol: {
    paddingBottom: 6,
    marginRight: 1,
  },
  priceUnit: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    paddingBottom: 12,
    marginLeft: 6,
  },
  paymentLine: {
    ...sora('bold'),
    marginTop: 18,
    fontSize: 16,
    color: lumen.fg,
  },
  wasLine: {
    ...sora('semibold'),
    marginTop: 4,
    fontSize: 14,
    color: lumen.fgMuted,
  },
  nextPill: {
    marginTop: 26,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  nextPillText: {
    ...sora('bold'),
    fontSize: 15,
    color: lumen.fg,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  skipLink: {
    alignSelf: 'center',
    marginTop: 14,
    padding: 6,
  },
  skipText: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
