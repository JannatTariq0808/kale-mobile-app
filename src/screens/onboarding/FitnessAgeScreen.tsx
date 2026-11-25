// Fitness Age + indicative price, shown at the end of the assessment.
// Price is a placeholder until Best's reassessment (MTA) price API is wired up.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import { fetchAthleteLevel } from '../../services/user/athleteLevel';
import { fetchDemographicsForAssess } from '../../services/user/fetchHealthProfile';
import { ageFromDob, fitnessAge, toSex } from '../../services/fitness/fitnessAge';
import { bodyTextStyle, displayTextStyle, headlineTextStyle } from '../../theme/textMetrics';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FitnessAge'>;

/**
 * Placeholder monthly premium until the Best reassessment (MTA) price API is
 * available. Swap this one value for the live price when the endpoint lands.
 */
const PLACEHOLDER_MONTHLY_PRICE_GBP = '9.90';

type FitnessAgeData = {
  level: number;
  realAge: number | null;
  fitnessAge: number | null;
};

async function loadFitnessAgeData(uid: string): Promise<FitnessAgeData> {
  const [level, demographics] = await Promise.all([
    fetchAthleteLevel(uid),
    fetchDemographicsForAssess(),
  ]);
  const realAge = demographics ? ageFromDob(demographics.date_of_birth) : null;
  const computed =
    realAge != null ? fitnessAge(level, realAge, toSex(demographics?.gender)) : null;
  return { level, realAge, fitnessAge: computed };
}

export function FitnessAgeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
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

  const { realAge, fitnessAge: computedFitnessAge } = data;
  const showAges = realAge != null && computedFitnessAge != null;
  const younger = showAges && computedFitnessAge < realAge;

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LumEyebrow pillar="cardio" label="Your estimate" />

          <Text style={styles.priceLabel}>Your estimated price</Text>
          <View style={styles.priceRow}>
            <Text style={displayTextStyle(72, lumen.fg)}>£{PLACEHOLDER_MONTHLY_PRICE_GBP}</Text>
            <Text style={styles.priceUnit}>a month</Text>
          </View>

          {showAges ? (
            <View style={styles.ageRow}>
              <View style={styles.ageCard}>
                <Text style={styles.ageLabel}>YOUR AGE</Text>
                <Text style={displayTextStyle(44, lumen.fg)}>{realAge}</Text>
              </View>
              <View style={[styles.ageCard, styles.ageCardAccent]}>
                <Text style={[styles.ageLabel, styles.ageLabelAccent]}>FITNESS AGE</Text>
                <Text style={displayTextStyle(44, lumen.bgDeep)}>{computedFitnessAge}</Text>
              </View>
            </View>
          ) : null}

          <Text style={[styles.headline, headlineTextStyle(30, lumen.fg)]}>
            Estimated from your <Text style={styles.headlineAccent}>fitness and strength</Text>.
          </Text>

          <Text style={[styles.body, bodyTextStyle(14.5, lumen.fgMuted)]}>
            {younger
              ? 'Your fitness makes your body younger than your years — and that shapes your price.'
              : 'This is your starting point. As your fitness improves, your Fitness Age and price can come down.'}
          </Text>

          <Text style={[styles.disclaimer, bodyTextStyle(12.5, lumen.fgFaint)]}>
            This price is indicative and may change. We&apos;ll confirm it when your cover is set up.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={() => navigation.replace('FirstCycleRewards')}>
            Continue
          </LumenButton>
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  priceLabel: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    marginTop: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 2,
  },
  priceUnit: {
    ...sora('semibold'),
    fontSize: 15,
    color: lumen.fgMuted,
    paddingBottom: 14,
  },
  ageRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  ageCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  ageCardAccent: {
    borderColor: lumen.mint,
    backgroundColor: lumen.mint,
  },
  ageLabel: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.4,
    color: lumen.fgMuted,
    marginBottom: 6,
  },
  ageLabelAccent: {
    color: lumen.bgDeep,
    opacity: 0.7,
  },
  headline: {
    marginTop: 28,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  body: {
    marginTop: 12,
  },
  disclaimer: {
    marginTop: 16,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
});
