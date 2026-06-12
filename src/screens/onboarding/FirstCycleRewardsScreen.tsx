// Design: kale-mobile-design — lum-11 KaleEarningsPreviewLumen (screens/KaleLumenOnboarding2.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import type { RootStackParamList } from '../../navigation/types';
import { enterMainApp } from '../../services/auth/session';
import {
  bodyTextStyle,
  displayTextStyle,
  headlineTextStyle,
} from '../../theme/textMetrics';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FirstCycleRewards'>;

export function FirstCycleRewardsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const headlineSize = 32;
  const heroValueSize = 92;

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
          <LumEyebrow pillar="knowledge" label="Your first cycle" />

          <Text style={[styles.headline, headlineTextStyle(headlineSize, lumen.fg)]}>
            Here's what you'll earn.
          </Text>

          <View style={styles.heroBlock}>
            <Text style={styles.heroLabel}>Bank at your next assessment</Text>
            <View style={styles.heroValueRow}>
              <Text style={displayTextStyle(heroValueSize, lumen.lime)}>486</Text>
              <Text style={styles.heroUnit}>Kalettes</Text>
            </View>
          </View>

          <View style={styles.storeSection}>
            <Text style={[styles.storeCopy, bodyTextStyle(15, lumen.fg)]}>
              Spend Kalettes in the <Text style={styles.storeAccent}>Kale Store</Text> — on training
              gear, health screening and more.
            </Text>
          </View>

          <View style={styles.earnMoreCard}>
            <View style={styles.earnMoreIcon}>
              <Ionicons name="arrow-up" size={16} color={lumen.lime} />
            </View>
            <Text style={[styles.earnMoreCopy, bodyTextStyle(14, lumen.fg)]}>
              Reach higher levels to earn <Text style={styles.earnMoreAccent}>more back</Text> each
              cycle.
            </Text>
          </View>

          <View style={styles.timeline}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineLabel}>Next assessment</Text>
              <Text style={styles.timelineWeeks}>11 weeks</Text>
            </View>
            <View style={styles.timelineTrackWrap}>
              <View style={styles.timelineTrack} />
              <View style={styles.timelineFill} />
              <View style={styles.timelineDot} />
              <View style={styles.timelineEnd} />
            </View>
            <View style={styles.timelineFooter}>
              <Text style={styles.timelineFootLabel}>Today</Text>
              <Text style={[styles.timelineFootLabel, styles.timelineFootEnd]}>Assessment</Text>
            </View>
          </View>

          <View style={styles.importantCallout}>
            <View style={styles.importantRule} />
            <View style={styles.importantCopy}>
              <Text style={styles.importantLabel}>Important</Text>
              <Text style={[styles.importantBody, bodyTextStyle(13.5, lumen.fg)]}>
                Complete your next assessment to bank these points. Miss it and they reset — make it
                and you could level up.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={() => enterMainApp(navigation)}>
            Go to my home screen
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
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 16,
    flexGrow: 1,
  },
  headline: {
    marginTop: 14,
    letterSpacing: -0.8,
  },
  heroBlock: {
    marginTop: 26,
    overflow: 'visible',
  },
  heroLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.98,
    textTransform: 'uppercase',
    color: lumenPillar.knowledge,
    marginBottom: 8,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    overflow: 'visible',
  },
  heroUnit: {
    ...sora('bold'),
    fontSize: 18,
    lineHeight: 24,
    color: lumen.fgMuted,
    paddingBottom: 12,
  },
  storeSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: lumen.hairline,
  },
  storeCopy: {},
  storeAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  earnMoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#CCFA7D14',
    borderWidth: 1,
    borderColor: '#CCFA7D38',
  },
  earnMoreIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#CCFA7D29',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  earnMoreCopy: {
    flex: 1,
  },
  earnMoreAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  timeline: {
    marginTop: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  timelineLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  timelineWeeks: {
    ...sora('bold'),
    fontSize: 13,
    lineHeight: 17,
    color: lumen.fg,
  },
  timelineTrackWrap: {
    position: 'relative',
    height: 14,
  },
  timelineTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(234,243,228,0.08)',
  },
  timelineFill: {
    position: 'absolute',
    left: 0,
    top: 5,
    width: '6%',
    height: 5,
    borderRadius: 3,
    backgroundColor: lumen.lime,
  },
  timelineDot: {
    position: 'absolute',
    left: '4%',
    top: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: lumen.lime,
    marginLeft: -7,
  },
  timelineEnd: {
    position: 'absolute',
    right: 0,
    top: 1,
    width: 13,
    height: 13,
    borderRadius: 3,
    backgroundColor: lumenPillar.strength,
  },
  timelineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timelineFootLabel: {
    ...sora('semibold'),
    fontSize: 11,
    lineHeight: 15,
    color: lumen.fgMuted,
  },
  timelineFootEnd: {
    color: lumenPillar.strength,
  },
  importantCallout: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
  },
  importantRule: {
    width: 2,
    alignSelf: 'stretch',
    backgroundColor: lumenPillar.strength,
  },
  importantCopy: {
    flex: 1,
    maxWidth: 300,
  },
  importantLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: lumenPillar.strength,
    marginBottom: 5,
  },
  importantBody: {},
  footer: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
});
