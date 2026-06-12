// Design: kale-mobile-design — lum-10 KaleHealthYearsLumen (screens/KaleLumenOnboarding2.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenRuleCaption } from '../../components/lumen/LumenRuleCaption';
import type { RootStackParamList } from '../../navigation/types';
import {
  bodyTextStyle,
  displayTextStyle,
  headlineTextStyle,
} from '../../theme/textMetrics';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthYears'>;

export function HealthYearsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const headlineSize = 38;
  const subheadSize = 14.5;
  const heroValueSize = 92;
  const breakdownValueSize = 34;
  const calloutValueSize = 40;

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

          <Text style={[styles.headline, headlineTextStyle(headlineSize, lumen.fg)]}>
            You've added <Text style={styles.headlineAccent}>healthy years</Text>.
          </Text>
          <Text style={[styles.subhead, bodyTextStyle(subheadSize, lumen.fgMuted)]}>
            At Level 6, here's your trajectory versus an inactive life.
          </Text>

          <View style={styles.heroBlock}>
            <Text style={styles.heroLabel}>Healthy years added</Text>
            <View style={styles.heroValueRow}>
              <Text style={displayTextStyle(heroValueSize, lumen.lime)}>+6.8</Text>
              <Text style={styles.heroUnit}>years</Text>
            </View>
          </View>

          <View style={styles.breakdown}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Lifespan</Text>
              <View style={styles.breakdownValueRow}>
                <Text style={displayTextStyle(breakdownValueSize, lumen.fg)}>+4.2</Text>
                <Text style={styles.breakdownUnit}>yrs</Text>
              </View>
              <Text style={[styles.breakdownNote, bodyTextStyle(12, lumen.fgMuted)]}>
                Projected additional years of life.
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={[styles.breakdownCol, styles.breakdownColRight]}>
              <Text style={styles.breakdownLabel}>Healthspan</Text>
              <View style={styles.breakdownValueRow}>
                <Text style={displayTextStyle(breakdownValueSize, lumen.fg)}>+6.8</Text>
                <Text style={styles.breakdownUnit}>yrs</Text>
              </View>
              <Text style={[styles.breakdownNote, bodyTextStyle(12, lumen.fgMuted)]}>
                Projected healthy, active years.
              </Text>
            </View>
          </View>

          <View style={styles.captionWrap}>
            <LumenRuleCaption align="left" color={lumen.green} maxWidth={330} size={16}>
              Healthspan — the years you spend healthy and independent — is what really matters.
            </LumenRuleCaption>
          </View>

          <View style={styles.levelCallout}>
            <Text style={displayTextStyle(calloutValueSize, lumen.lime)}>+0.9</Text>
            <View style={styles.levelCalloutCopy}>
              <Text style={[styles.levelCalloutTitle, bodyTextStyle(13.5, lumen.fg)]}>
                extra healthspan years at Level 7.
              </Text>
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
    overflow: 'visible',
  },
  flex: {
    flex: 1,
    overflow: 'visible',
  },
  content: {
    flex: 1,
    zIndex: 2,
    overflow: 'visible',
  },
  levelBadgeRow: {
    paddingHorizontal: 26,
    alignItems: 'flex-end',
  },
  levelBadge: {
    ...sora('bold'),
    fontSize: 12,
    lineHeight: 16,
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
    marginTop: 14,
    letterSpacing: -0.95,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  subhead: {
    marginTop: 12,
    maxWidth: 320,
  },
  heroBlock: {
    marginTop: 26,
    overflow: 'visible',
  },
  heroLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 4,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    overflow: 'visible',
  },
  heroUnit: {
    ...sora('semibold'),
    fontSize: 16,
    lineHeight: 22,
    color: lumen.fgMuted,
    paddingBottom: 10,
  },
  breakdown: {
    flexDirection: 'row',
    marginTop: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: lumen.hairline,
    overflow: 'visible',
  },
  breakdownCol: {
    flex: 1,
    paddingVertical: 18,
    overflow: 'visible',
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
    lineHeight: 15,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  breakdownValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 8,
    overflow: 'visible',
  },
  breakdownUnit: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 17,
    color: lumen.fgMuted,
    paddingBottom: 4,
  },
  breakdownNote: {
    ...sora('regular'),
    marginTop: 8,
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
    overflow: 'visible',
  },
  levelCalloutCopy: {
    flex: 1,
  },
  levelCalloutTitle: {
    ...sora('bold'),
  },
  levelCalloutSub: {
    ...sora('regular'),
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: lumen.fgMuted,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
});
