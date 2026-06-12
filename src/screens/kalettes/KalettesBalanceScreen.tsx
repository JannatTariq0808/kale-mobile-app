import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { BalanceCardGlow } from '../../components/kalettes/BalanceCardGlow';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { FaqAccordion } from '../../components/lumen/FaqAccordion';
import { LumHeroRing } from '../../components/lumen/LumHeroRing';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import { kalettesDemo } from '../../data/kalettesDemo';
import { useKalettesQuestions } from '../../hooks/useKalettesQuestions';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { KalettesStackParamList } from '../../navigation/KalettesStackNavigator';
import { fetchRewardsProducts } from '../../services/kalettes/fetchRewardsProducts';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<KalettesStackParamList, 'Balance'>;

export function KalettesBalanceScreen({ navigation }: Props) {
  const { type, scale, leading } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useKalettesQuestions();
  const heroSize = scale(56);
  const balanceSize = type(72);

  useEffect(() => {
    void fetchRewardsProducts();
  }, []);

  return (
    <View style={styles.screen}>
      <LumenHeader />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionEyebrow, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
          Rewards
        </Text>

        <View style={styles.balanceCard}>
          <BalanceCardGlow />
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { fontSize: type(11) }]}>Kalettes</Text>
            <Text style={[styles.earnedBadge, { fontSize: type(10) }]}>EARNED THIS CYCLE</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceValue, { fontSize: balanceSize, lineHeight: leading(balanceSize, 1.08) }]}>
              {kalettesDemo.balance}
            </Text>
            <Text style={[styles.balanceGbp, { fontSize: type(16) }]}>{kalettesDemo.gbpEstimate}</Text>
          </View>
          <View style={styles.ctaBlock}>
            <LumenButton
              style={styles.spendButton}
              onPress={() => void Linking.openURL(kalettesDemo.rewardsUrl)}
            >
              Spend my points at kale.insure
            </LumenButton>
            <Text style={[styles.ctaSubcopy, { fontSize: type(12), lineHeight: leading(type(12)) }]}>
              Browse the Longevity Marketplace and check out on our website.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Marketplace')}
              style={styles.marketplaceLink}
              accessibilityRole="link"
            >
              <Text style={[styles.marketplaceLinkText, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
                Preview marketplace in app
              </Text>
              <Ionicons name="chevron-forward" size={14} color={lumen.mint} />
            </Pressable>
          </View>
        </View>

        <View style={styles.cycleSection}>
          <View style={styles.cycleHeader}>
            <Text style={[styles.sectionLabel, { fontSize: type(11) }]}>This quarterly cycle</Text>
            <Text style={[styles.cycleWeeks, { fontSize: type(12) }]}>{kalettesDemo.cycleWeeksLeft}</Text>
          </View>

          <LumenCard>
            <View style={styles.cycleRow}>
              <View style={styles.cycleCopy}>
                <Text style={[styles.cycleSubLabel, { fontSize: type(11) }]}>To bank at next assessment</Text>
                <View style={styles.cyclePtsRow}>
                  <Text style={[styles.cyclePts, { fontSize: type(30) }]}>{kalettesDemo.toBankPts}</Text>
                  <Text style={[styles.cyclePtsUnit, { fontSize: type(12) }]}>pts</Text>
                </View>
              </View>
              <LumHeroRing
                value=""
                pct={kalettesDemo.cycleProgressPct}
                size={heroSize}
                stroke={5}
                accentColor={lumen.lime}
              />
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${kalettesDemo.cycleProgressPct}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { fontSize: type(11) }]}>Cycle start</Text>
              <Text style={[styles.progressLabelAccent, { fontSize: type(11) }]}>Assessment</Text>
            </View>
          </LumenCard>

          <LumenCard accent={lumenPillar.strength} style={styles.bankNote}>
            <Text style={[styles.bankNoteText, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
              Complete your assessment to bank these. Miss it — they reset.
            </Text>
          </LumenCard>
        </View>

        <Text style={[styles.faqLabel, { fontSize: type(11) }]}>Common questions</Text>
        {faqLoading ? (
          <ActivityIndicator color={lumen.lime} style={styles.faqLoader} />
        ) : (
          <FaqAccordion items={faqItems} />
        )}
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
  sectionEyebrow: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
  },
  pageTitle: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -1,
    marginTop: 4,
    marginBottom: 2,
  },
  balanceCard: {
    marginTop: 14,
    padding: 24,
    borderRadius: 18,
    backgroundColor: 'rgba(234,243,228,0.05)',
    borderWidth: 1,
    borderColor: lumen.hairline,
    overflow: 'hidden',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  balanceLabel: {
    ...sora('extrabold'),
    color: lumen.lime,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  earnedBadge: {
    ...sora('extrabold'),
    color: lumen.fgMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(234,243,228,0.10)',
    overflow: 'hidden',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 14,
  },
  balanceValue: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -2.8,
    fontVariant: ['tabular-nums'],
  },
  balanceGbp: {
    ...sora('bold'),
    color: lumen.fgMuted,
  },
  ctaBlock: {
    marginTop: 22,
  },
  spendButton: {
    marginTop: 0,
  },
  ctaSubcopy: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    textAlign: 'center',
    marginTop: 14,
    opacity: 0.85,
  },
  marketplaceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 16,
  },
  marketplaceLinkText: {
    ...sora('semibold'),
    color: lumen.mint,
    textAlign: 'center',
  },
  cycleSection: {
    marginTop: 22,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cycleWeeks: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleCopy: {
    flex: 1,
  },
  cycleSubLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cyclePtsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 6,
  },
  cyclePts: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  cyclePtsUnit: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(234,243,228,0.08)',
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: lumen.lime,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  progressLabelAccent: {
    ...sora('semibold'),
    color: lumenPillar.strength,
  },
  bankNote: {
    marginTop: 12,
  },
  bankNoteText: {
    ...sora('semibold'),
    color: lumen.fg,
  },
  faqLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 28,
    marginBottom: 12,
  },
  faqLoader: {
    marginVertical: 20,
  },
});
