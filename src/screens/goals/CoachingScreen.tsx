// Design: Lumen for IP — 1 to 1 coaching · request (screens/LumenIP.jsx KaleIPCoaching)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { IPFlowShell } from '../../components/ip/IPFlowShell';
import { IPKicker } from '../../components/ip/IPKicker';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import { IP_COACH_EMAIL, IP_COACH_NAME } from '../../config/incomeProtection';
import { useAuthSession } from '../../hooks/useAuthSession';
import { refreshGoals, useGoals } from '../../hooks/useGoals';
import { useHomeLongevityData } from '../../hooks/useHomeLongevityData';
import { useIncomeProtection } from '../../hooks/useIncomeProtection';
import type { GoalsStackParamList } from '../../navigation/GoalsStackNavigator';
import { markCoachingRequested } from '../../services/ip/goals';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<GoalsStackParamList, 'Coaching'>;

const COACH_PHOTO = require('../../../assets/coach-alex.jpg');

const BENEFITS = [
  {
    color: lumen.green,
    title: 'A longevity plan built around you',
    body: 'Cardio and strength, the two biggest drivers of a longer life, in sessions that fit your week.',
  },
  {
    color: lumen.yellow,
    title: 'Health screening strategy',
    body: 'Which checks make sense for your age and history, and when to get them.',
  },
  {
    color: lumen.coral,
    title: 'Long term goals',
    body: `Set together around your Longevity Level and Fitness Age, with ${IP_COACH_NAME}’s notes on how to get there.`,
  },
  {
    color: lumen.lime,
    title: 'Support when life gets in the way',
    body: 'Injury, a busy month or coming back after a break.',
  },
];

function buildMailto(params: {
  name: string;
  policy: string;
  level: number;
  email: string | null;
}): string {
  const subject = `Longevity coaching request: ${params.name}, ${params.policy}`;
  const body = [
    `${params.name} would like longevity coaching.`,
    '',
    `Policy: ${params.policy}`,
    `Longevity Level: ${params.level}`,
    params.email ? `Email: ${params.email}` : null,
  ]
    .filter((line): line is string => line != null)
    .join('\n');
  return `mailto:${IP_COACH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function CoachingScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const { record } = useIncomeProtection();
  const { goals } = useGoals();
  const { firstName, level } = useHomeLongevityData();
  const [sentNow, setSentNow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sent = sentNow || goals.coachingRequestedAt != null;

  const request = async () => {
    setError(null);
    const url = buildMailto({
      name: firstName && firstName !== 'Member' ? firstName : (user?.email ?? 'A Kale customer'),
      policy: record?.policyNumber ?? record?.policyId ?? 'policy pending',
      level,
      email: user?.email ?? null,
    });
    try {
      await Linking.openURL(url);
    } catch {
      setError(`We couldn’t open your email app. Email ${IP_COACH_EMAIL} and we’ll book your first call.`);
      return;
    }
    setSentNow(true);
    if (user?.uid) {
      try {
        await markCoachingRequested(user.uid);
        await refreshGoals(user.uid);
      } catch (err) {
        if (__DEV__) console.warn('[goals] markCoachingRequested failed', err);
      }
    }
  };

  return (
    <IPFlowShell
      onBack={() => navigation.goBack()}
      footer={
        sent ? (
          <LumenCard padding={16} style={styles.sentCard}>
            <Text style={styles.sentTitle}>Request sent</Text>
            <Text style={styles.sentBody}>We’ll email you to book your first call.</Text>
          </LumenCard>
        ) : (
          <>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <LumenButton onPress={() => void request()} style={styles.cta}>
              Yes, I’d like longevity coaching
            </LumenButton>
            <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.notNow}>Not now</Text>
            </Pressable>
          </>
        )
      }
    >
      <IPKicker>Longevity coaching</IPKicker>
      <Text style={styles.headline}>
        Coaching for a <Text style={styles.headlineAccent}>longer, healthier life</Text>
      </Text>

      <View style={styles.coachRow}>
        <Image source={COACH_PHOTO} style={styles.coachPhoto} accessibilityIgnoresInvertColors />
        <View>
          <Text style={styles.coachName}>{IP_COACH_NAME}</Text>
          <Text style={styles.coachRole}>Your longevity coach</Text>
        </View>
      </View>

      <Text style={styles.body}>
        {IP_COACH_NAME} looks at your Longevity Level and Fitness Age and builds a plan to add healthy years.
      </Text>

      <View style={styles.benefits}>
        {BENEFITS.map((benefit, index) => (
          <View
            key={benefit.title}
            style={[styles.benefit, index < BENEFITS.length - 1 && styles.benefitDivider]}
          >
            <View
              style={[
                styles.benefitDot,
                { backgroundColor: benefit.color, shadowColor: benefit.color },
              ]}
            />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitBody}>{benefit.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </IPFlowShell>
  );
}

const styles = StyleSheet.create({
  headline: {
    ...sora('extrabold'),
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -1.1,
    color: lumen.fg,
    marginTop: 12,
  },
  headlineAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  coachPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(204,250,125,0.5)',
  },
  coachName: {
    ...sora('extrabold'),
    fontSize: 17,
    lineHeight: 22,
    color: lumen.fg,
  },
  coachRole: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 18,
    color: lumen.fgMuted,
    marginTop: 2,
  },
  body: {
    ...sora('semibold'),
    fontSize: 15,
    lineHeight: 22,
    color: lumen.fgMuted,
    marginTop: 14,
  },
  benefits: {
    marginTop: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 13,
  },
  benefitDivider: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  benefitDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginTop: 6,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    ...sora('extrabold'),
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: -0.15,
    color: lumen.fg,
  },
  benefitBody: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fgMuted,
    marginTop: 3,
  },
  cta: {
    alignSelf: 'stretch',
  },
  notNow: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 19,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
  error: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 18,
    color: lumen.coral,
    textAlign: 'center',
  },
  sentCard: {
    backgroundColor: 'rgba(0,200,150,0.10)',
    borderColor: 'rgba(0,200,150,0.4)',
  },
  sentTitle: {
    ...sora('extrabold'),
    fontSize: 16,
    lineHeight: 21,
    color: lumen.fg,
  },
  sentBody: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fgMuted,
    marginTop: 4,
  },
});
