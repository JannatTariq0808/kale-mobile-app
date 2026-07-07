import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { BalanceCardGlow } from '../../components/kalettes/BalanceCardGlow';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { FaqAccordion } from '../../components/lumen/FaqAccordion';
import { LumHeroRing } from '../../components/lumen/LumHeroRing';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import { kalettesDemo } from '../../data/kalettesDemo';
import { useKalettesQuestions } from '../../hooks/useKalettesQuestions';
import { useKalettesRewards } from '../../hooks/useKalettesRewards';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { KalettesStackParamList } from '../../navigation/KalettesStackNavigator';
import { openRewardsWeb } from '../../services/kalettes/openRewardsWeb';
import { fetchRewardsProducts } from '../../services/kalettes/fetchRewardsProducts';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<KalettesStackParamList, 'Balance'>;

export function KalettesBalanceScreen({ navigation }: Props) {
  const { type, scale, leading } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useKalettesQuestions();
  const rewards = useKalettesRewards();
  const heroSize = scale(56);
  const balanceSize = type(72);
  const pendingKalettes = rewards.hasQuote ? rewards.pendingKalettes : 0;
  const windowProgressPct = rewards.hasQuote
    ? rewards.windowProgressPct
    : kalettesDemo.cycleProgressPct;

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
          <Text style={[styles.balanceLabel, { fontSize: type(11) }]}>Kalettes</Text>
          {rewards.loading ? (
            <ActivityIndicator color={lumen.lime} style={styles.balanceLoader} />
          ) : !rewards.hasQuote ? (
            <Text style={[styles.noQuoteCopy, { fontSize: type(14), lineHeight: leading(type(14)) }]}>
              Rewards appear once your policy quote is active.
            </Text>
          ) : (
            <>
              <View style={styles.balanceSplit}>
                <View style={styles.balanceBlock}>
                  <Text style={[styles.balanceBlockLabel, { fontSize: type(10) }]}>
                    Ready to spend
                  </Text>
                  <View style={styles.balancePtsRow}>
                    <Text
                      style={[
                        styles.balanceValue,
                        { fontSize: balanceSize, lineHeight: leading(balanceSize, 1.08) },
                      ]}
                    >
                      {rewards.bankedBalance.toLocaleString('en-GB')}
                    </Text>
                    <Text style={[styles.balancePts, { fontSize: type(16) }]}>pts</Text>
                  </View>
                  <Text style={[styles.balanceBlockHint, { fontSize: type(12), lineHeight: leading(type(12)) }]}>
                    In the marketplace now
                  </Text>
                </View>

                <View style={styles.balanceDivider} />

                <View style={styles.balanceBlock}>
                  <Text style={[styles.balanceBlockLabel, { fontSize: type(10) }]}>
                    Waiting to bank
                  </Text>
                  <View style={styles.balancePtsRow}>
                    <Text style={[styles.balanceValuePending, { fontSize: type(36) }]}>
                      {pendingKalettes.toLocaleString('en-GB')}
                    </Text>
                    <Text style={[styles.balancePts, { fontSize: type(16) }]}>pts</Text>
                  </View>
                  <Text style={[styles.balanceBlockHint, { fontSize: type(12), lineHeight: leading(type(12)) }]}>
                    {rewards.completedAssessmentThisQuarter
                      ? 'Banks at your next quarter\'s on-time assessment'
                      : 'Banks at your next on-time assessment'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.premiumHint, { fontSize: type(12), lineHeight: leading(type(12)) }]}>
                Athlete level {rewards.level} · {rewards.level}% of £
                {rewards.monthlyPremiumGbp.toFixed(2)}/mo premium back
              </Text>
            </>
          )}
          <View style={styles.ctaBlock}>
            <LumenButton
              style={styles.spendButton}
              onPress={() => void openRewardsWeb()}
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
            <Text style={[styles.sectionLabel, { fontSize: type(11) }]}>
              {rewards.hasQuote ? rewards.cycleHeadline : 'Assessment window'}
            </Text>
            <Text style={[styles.cycleWeeks, { fontSize: type(12) }]}>
              {rewards.hasQuote ? rewards.cycleSubline : kalettesDemo.cycleWeeksLeft}
            </Text>
          </View>

          <LumenCard>
            <View style={styles.cycleRow}>
              <View style={styles.cycleCopy}>
                <Text style={[styles.cycleSubLabel, { fontSize: type(11) }]}>
                  Assessment window
                </Text>
                <Text style={[styles.cycleWindowCopy, { fontSize: type(14), lineHeight: leading(type(14)) }]}>
                  {rewards.hasQuote ? rewards.cycleSubline : '—'}
                </Text>
              </View>
              <LumHeroRing
                value=""
                pct={windowProgressPct}
                size={heroSize}
                stroke={5}
                accentColor={lumen.lime}
              />
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${windowProgressPct}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { fontSize: type(11) }]}>
                {rewards.completedAssessmentThisQuarter
                  ? 'Done this quarter'
                  : rewards.windowLive
                    ? 'Window open'
                    : 'Waiting'}
              </Text>
              <Text style={[styles.progressLabelAccent, { fontSize: type(11) }]}>Assessment</Text>
            </View>
          </LumenCard>

          <LumenCard accent={lumenPillar.strength} style={styles.bankNote}>
            <Text style={[styles.bankNoteText, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
              {rewards.completedAssessmentThisQuarter
                ? 'You can only complete one assessment per quarter. Pending Kalettes move to your spendable balance when you finish next quarter\'s assessment on time.'
                : 'Complete your assessment during the window to bank pending Kalettes into your balance. Miss the window — they expire.'}
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
  balanceCard: {
    marginTop: 14,
    padding: 24,
    borderRadius: 18,
    backgroundColor: 'rgba(234,243,228,0.05)',
    borderWidth: 1,
    borderColor: lumen.hairline,
    overflow: 'hidden',
  },
  balanceLabel: {
    ...sora('extrabold'),
    color: lumen.lime,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  balanceSplit: {
    gap: 16,
  },
  balanceBlock: {
    gap: 4,
  },
  balanceBlockLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  balanceBlockHint: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    opacity: 0.85,
    marginTop: 4,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: lumen.hairline,
  },
  balancePtsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  balanceValue: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -2.8,
    fontVariant: ['tabular-nums'],
  },
  balanceValuePending: {
    ...sora('semibold'),
    color: lumen.mint,
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
  balancePts: {
    ...sora('bold'),
    color: lumen.fgMuted,
  },
  balanceLoader: {
    marginTop: 20,
    marginBottom: 8,
  },
  noQuoteCopy: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginTop: 16,
  },
  premiumHint: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginTop: 8,
    opacity: 0.85,
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
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  sectionLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    flex: 1,
  },
  cycleWeeks: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    flexShrink: 1,
    textAlign: 'right',
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
  cycleWindowCopy: {
    ...sora('semibold'),
    color: lumen.fg,
    marginTop: 8,
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
