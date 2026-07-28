// Design: kale-mobile-design — LumenResultPage (screens/KaleLumenResults.jsx)

import { Ionicons } from '@expo/vector-icons';
import { Fragment, memo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { LevelRing } from './LevelRing';
import { LumEyebrow } from './LumEyebrow';
import { LumenButton } from './LumenButton';
import { LumenHistogram } from './LumenHistogram';
import { LumenRuleCaption } from './LumenRuleCaption';
import { LumenStat } from './LumenStat';
import { GarminDeviceTag } from '../fitness/GarminDeviceTag';
import { bodyTextStyle, displayTextStyle } from '../../theme/textMetrics';
import { lumen, lumenPillar, sora } from '../../theme';

type PillarKey = keyof typeof lumenPillar;

type ResultTile = {
  label: string;
  value: string;
  unit?: string;
};

export type DeviceAttribution = {
  deviceName: string;
  garminBranded: boolean;
};

type Trend = 'up' | 'down' | 'same' | 'none';

export type LumenResultConfig = {
  pillar: PillarKey;
  pillarLabel: string;
  level: number;
  trend: Trend;
  trendDelta?: number;
  levelNote: string;
  percentile: number;
  rpText: string;
  resultHero: string;
  resultUnit?: string;
  resultLabel: string;
  tiles: ResultTile[];
  /** Device logo + name shown below the stats row (cardio / Garmin). */
  deviceAttribution?: DeviceAttribution;
  nextLevel: number;
  nextActions: string[];
  /** Single level-up callout — replaces the nextActions list when set. */
  levelUpMessage?: string;
  nextBtn: string;
};

type LumenResultViewProps = {
  config: LumenResultConfig;
  onNext: () => void;
  onBack?: () => void;
  /** Show header back control. Result screens are forward-only — default false. */
  showBackButton?: boolean;
  /** True while linking/finalizing before LevelReveal (or next pillar). */
  nextLoading?: boolean;
};

function ordinal(n: number) {
  const v = n % 100;
  return ['th', 'st', 'nd', 'rd'][(v - 20) % 10] || ['th', 'st', 'nd', 'rd'][v] || 'th';
}

function TrendChip({ trend, delta }: { trend: Trend; delta?: number }) {
  if (trend === 'up') {
    return (
      <View style={styles.trendChipUp}>
        <Ionicons name="arrow-up" size={10} color="#3FD08B" />
        <Text style={styles.trendTextUp}>+{delta ?? 1}</Text>
      </View>
    );
  }

  if (trend === 'down') {
    return (
      <View style={styles.trendChipDown}>
        <Ionicons name="arrow-down" size={10} color={lumen.coral} />
        <Text style={styles.trendTextDown}>{delta ?? -1}</Text>
      </View>
    );
  }

  if (trend === 'same') {
    return (
      <View
        style={styles.trendChipSame}
        accessibilityRole="text"
        accessibilityLabel="Level retained"
      >
        <Text style={styles.trendTextSame}>—</Text>
      </View>
    );
  }

  return null;
}

export const LumenResultView = memo(function LumenResultView({
  config,
  onBack,
  onNext,
  showBackButton = false,
  nextLoading = false,
}: LumenResultViewProps) {
  const accent = lumenPillar[config.pillar];
  const { horizontalPadding, pad } = useResponsiveLayout();
  const levelTitleSize = 40;
  const levelNoteSize = 12.5;
  const heroValueSize = 64;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.content} edges={['top', 'left', 'right', 'bottom']}>
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          {showBackButton ? (
            <Pressable
              onPress={onBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
            </Pressable>
          ) : (
            <View style={styles.headerSpacer} />
          )}
          <LumEyebrow pillar={config.pillar} label={config.pillarLabel} step="Result" />
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: pad(26) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.levelRow}>
            <LevelRing level={config.level} />
            <View style={styles.levelCopy}>
              <Text style={styles.levelEyebrow}>
                Longevity Level · {config.pillarLabel}
              </Text>
              <View style={styles.levelTitleRow}>
                <Text style={[styles.levelTitle, displayTextStyle(levelTitleSize, lumen.fg)]}>
                  Level {config.level}
                </Text>
                <TrendChip trend={config.trend} delta={config.trendDelta} />
              </View>
              <Text style={[styles.levelNote, bodyTextStyle(levelNoteSize, lumen.fgMuted)]}>
                {config.levelNote}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Relative performance</Text>
              <View style={styles.percentileRow}>
                <Text style={displayTextStyle(30, lumen.lime)}>{config.percentile}</Text>
                <Text style={styles.percentileSuffix}>{ordinal(config.percentile)}</Text>
              </View>
            </View>
            <LumenHistogram percentile={config.percentile} />
            <View style={styles.rpCaption}>
              <LumenRuleCaption align="left" color={lumen.green} maxWidth={330} size={16}>
                {config.rpText}
              </LumenRuleCaption>
            </View>
          </View>

          <View style={styles.sectionLast}>
            <Text style={styles.sectionLabel}>Your result</Text>
            <View style={styles.heroRow}>
              <Text style={[styles.heroValue, displayTextStyle(heroValueSize, lumen.lime)]}>
                {config.resultHero}
              </Text>
              {config.resultUnit ? (
                <Text style={styles.heroUnit}>{config.resultUnit}</Text>
              ) : null}
            </View>
            {config.resultLabel ? (
              <Text style={[styles.resultLabel, bodyTextStyle(13, lumen.fgMuted)]}>
                {config.resultLabel}
              </Text>
            ) : null}
            {config.tiles.length > 0 ? (
              <View style={styles.tiles}>
                {config.tiles.map((tile, index) => (
                  <Fragment key={tile.label}>
                    {index > 0 ? <View style={styles.tileDivider} /> : null}
                    <View style={styles.tileCell}>
                      <LumenStat label={tile.label} value={tile.value} unit={tile.unit} />
                    </View>
                  </Fragment>
                ))}
              </View>
            ) : null}
            {config.deviceAttribution ? (
              <View style={styles.deviceAttribution}>
                {config.deviceAttribution.garminBranded ? (
                  <GarminDeviceTag device={config.deviceAttribution.deviceName} compact />
                ) : (
                  <Text style={[styles.devicePlain, bodyTextStyle(13, lumen.fgMuted)]}>
                    {config.deviceAttribution.deviceName}
                  </Text>
                )}
              </View>
            ) : null}
          </View>

          {config.levelUpMessage !== undefined ? (
            config.levelUpMessage ? (
              <View style={styles.nextSection}>
                <View style={styles.nextHeader}>
                  <Text style={[styles.nextTitle, { color: accent }]}>
                    Reach Level {config.nextLevel}
                  </Text>
                  <View style={styles.nextRule} />
                </View>
                <View style={styles.nextMessageRow}>
                  <View style={[styles.nextIcon, { borderColor: accent }]}>
                    <Ionicons name="arrow-forward" size={11} color={accent} />
                  </View>
                  <Text style={[styles.nextMessage, bodyTextStyle(15, lumen.fg)]}>
                    {config.levelUpMessage}
                  </Text>
                </View>
              </View>
            ) : null
          ) : (
            <View style={styles.nextSection}>
              <View style={styles.nextHeader}>
                <Text style={[styles.nextTitle, { color: accent }]}>
                  Reach Level {config.nextLevel}
                </Text>
                <View style={styles.nextRule} />
              </View>
              {config.nextActions.map((action, index, arr) => (
                <View
                  key={action}
                  style={[styles.nextRow, index < arr.length - 1 && styles.nextRowBorder]}
                >
                  <View style={[styles.nextIcon, { borderColor: accent }]}>
                    <Ionicons name="arrow-forward" size={11} color={accent} />
                  </View>
                  <Text style={[styles.nextAction, bodyTextStyle(14.5, lumen.fg)]}>{action}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingHorizontal: pad(26) }]}>
          {nextLoading ? (
            <View style={styles.nextLoading}>
              <ActivityIndicator color={lumen.mint} />
              <Text style={styles.nextLoadingLabel}>Opening your level…</Text>
            </View>
          ) : (
            <LumenButton onPress={onNext}>{config.nextBtn}</LumenButton>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
});

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
    paddingTop: 10,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
    width: 32,
  },
  backIcon: {
    opacity: 0.85,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    minHeight: 100,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
    overflow: 'visible',
  },
  levelCopy: {
    flex: 1,
    minWidth: 0,
  },
  levelEyebrow: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 6,
  },
  levelTitle: {
    letterSpacing: -1.2,
    flexShrink: 0,
  },
  trendChipUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
    flexShrink: 0,
  },
  trendTextUp: {
    ...sora('extrabold'),
    fontSize: 11,
    color: '#3FD08B',
  },
  trendChipDown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(232,130,110,0.16)',
    flexShrink: 0,
  },
  trendTextDown: {
    ...sora('extrabold'),
    fontSize: 11,
    color: lumen.coral,
  },
  trendChipSame: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(234,243,228,0.08)',
    flexShrink: 0,
  },
  trendTextSame: {
    ...sora('extrabold'),
    fontSize: 11,
    lineHeight: 13,
    color: lumen.fgMuted,
  },
  levelNote: {
    marginTop: 6,
  },
  section: {
    paddingTop: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  sectionLast: {
    paddingTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionLabel: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  percentileRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  percentileSuffix: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    marginLeft: 1,
  },
  rpCaption: {
    marginTop: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 10,
    overflow: 'visible',
  },
  heroValue: {
    letterSpacing: -2.56,
  },
  heroUnit: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 18,
    color: lumen.fgMuted,
    paddingBottom: 8,
  },
  resultLabel: {
    marginTop: 8,
  },
  tiles: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 18,
    borderTopWidth: 1,
    borderColor: lumen.hairline,
  },
  deviceAttribution: {
    marginTop: 14,
    paddingBottom: 4,
  },
  devicePlain: {
    ...sora('semibold'),
  },
  tileCell: {
    flex: 1,
    minWidth: 0,
  },
  tileDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: lumen.hairline,
  },
  nextSection: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  nextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  nextTitle: {
    ...sora('extrabold'),
    fontSize: 12,
    letterSpacing: 1.44,
    textTransform: 'uppercase',
  },
  nextRule: {
    flex: 1,
    height: 1,
    backgroundColor: lumen.hairline,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  nextRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  nextIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextAction: {
    flex: 1,
  },
  nextMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingTop: 2,
    paddingBottom: 4,
  },
  nextMessage: {
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    paddingTop: 18,
    paddingBottom: 8,
  },
  nextLoading: {
    minHeight: 58,
    borderRadius: 9999,
    backgroundColor: 'rgba(0,200,150,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  nextLoadingLabel: {
    ...sora('bold'),
    color: lumen.mint,
    fontSize: 15,
  },
});
