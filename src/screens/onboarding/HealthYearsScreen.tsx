// Design: kale-mobile-design — lum-10 KaleHealthYearsLumen (screens/KaleLumenOnboarding2.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenRuleCaption } from '../../components/lumen/LumenRuleCaption';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthYears'>;

export function HealthYearsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <View style={styles.levelBadgeRow}>
          <Text style={styles.levelBadge}>LEVEL 6</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LumEyebrow pillar="cardio" label="What this means" />

          <Text style={styles.headline}>
            You've added <Text style={styles.headlineAccent}>healthy years</Text>.
          </Text>
          <Text style={styles.subhead}>
            At Level 6, here's your trajectory versus an inactive life.
          </Text>

          <View style={styles.heroBlock}>
            <Text style={styles.heroLabel}>Healthy years added</Text>
            <View style={styles.heroValueRow}>
              <Text style={styles.heroValue}>+6.8</Text>
              <Text style={styles.heroUnit}>years</Text>
            </View>
          </View>

          <View style={styles.breakdown}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Lifespan</Text>
              <View style={styles.breakdownValueRow}>
                <Text style={styles.breakdownValue}>+4.2</Text>
                <Text style={styles.breakdownUnit}>yrs</Text>
              </View>
              <Text style={styles.breakdownNote}>Projected additional years of life.</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={[styles.breakdownCol, styles.breakdownColRight]}>
              <Text style={styles.breakdownLabel}>Healthspan</Text>
              <View style={styles.breakdownValueRow}>
                <Text style={styles.breakdownValue}>+6.8</Text>
                <Text style={styles.breakdownUnit}>yrs</Text>
              </View>
              <Text style={styles.breakdownNote}>Projected healthy, active years.</Text>
            </View>
          </View>

          <View style={styles.captionWrap}>
            <LumenRuleCaption align="left" color={lumen.green} maxWidth={330} size={16}>
              Healthspan — the years you spend healthy and independent — is what really matters.
            </LumenRuleCaption>
          </View>

          <View style={styles.levelCallout}>
            <Text style={styles.levelCalloutValue}>+0.9</Text>
            <View style={styles.levelCalloutCopy}>
              <Text style={styles.levelCalloutTitle}>extra healthspan years at Level 7.</Text>
              <Text style={styles.levelCalloutSub}>That's a lot for one level.</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={() => navigation.replace('FirstCycleRewards')}>
            See your first cycle rewards
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
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  levelBadgeRow: {
    paddingHorizontal: 26,
    alignItems: 'flex-end',
  },
  levelBadge: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 1.92,
    color: lumen.fgMuted,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 26,
    paddingBottom: 16,
    flexGrow: 1,
  },
  headline: {
    ...sora('extrabold'),
    marginTop: 14,
    fontSize: 38,
    lineHeight: 41.8,
    letterSpacing: -0.95,
    color: lumen.fg,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 21.75,
    color: lumen.fgMuted,
    maxWidth: 320,
  },
  heroBlock: {
    marginTop: 26,
  },
  heroLabel: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 4,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroValue: {
    ...sora('semibold'),
    fontSize: 92,
    lineHeight: 75,
    letterSpacing: -4.14,
    color: lumen.lime,
  },
  heroUnit: {
    ...sora('semibold'),
    fontSize: 16,
    color: lumen.fgMuted,
  },
  breakdown: {
    flexDirection: 'row',
    marginTop: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: lumen.hairline,
  },
  breakdownCol: {
    flex: 1,
    paddingVertical: 18,
  },
  breakdownColRight: {
    paddingLeft: 22,
  },
  breakdownDivider: {
    width: 1,
    backgroundColor: lumen.hairline,
  },
  breakdownLabel: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  breakdownValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 8,
  },
  breakdownValue: {
    ...sora('semibold'),
    fontSize: 34,
    lineHeight: 30.6,
    letterSpacing: -1.02,
    color: lumen.fg,
  },
  breakdownUnit: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fgMuted,
  },
  breakdownNote: {
    ...sora('regular'),
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17.4,
    color: lumen.fgMuted,
    maxWidth: 130,
  },
  captionWrap: {
    marginTop: 22,
  },
  levelCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: lumen.hairline,
  },
  levelCalloutValue: {
    ...sora('semibold'),
    fontSize: 40,
    lineHeight: 36,
    letterSpacing: -1.6,
    color: lumen.lime,
  },
  levelCalloutCopy: {
    flex: 1,
  },
  levelCalloutTitle: {
    ...sora('bold'),
    fontSize: 13.5,
    lineHeight: 18.2,
    color: lumen.fg,
  },
  levelCalloutSub: {
    ...sora('regular'),
    marginTop: 2,
    fontSize: 12,
    color: lumen.fgMuted,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
});
