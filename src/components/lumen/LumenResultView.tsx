// Design: kale-mobile-design — LumenResultPage (screens/KaleLumenResults.jsx)

import { Ionicons } from '@expo/vector-icons';
import { Fragment, memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LevelRing } from './LevelRing';
import { LumEyebrow } from './LumEyebrow';
import { LumenButton } from './LumenButton';
import { LumenHistogram } from './LumenHistogram';
import { LumenRuleCaption } from './LumenRuleCaption';
import { LumenStat } from './LumenStat';
import { lumen, lumenPillar, sora } from '../../theme';

type PillarKey = keyof typeof lumenPillar;

type ResultTile = {
  label: string;
  value: string;
  unit?: string;
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
  nextLevel: number;
  nextActions: string[];
  nextBtn: string;
};

type LumenResultViewProps = {
  config: LumenResultConfig;
  onBack: () => void;
  onNext: () => void;
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
}: LumenResultViewProps) {
  const accent = lumenPillar[config.pillar];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.content} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
          </Pressable>
          <LumEyebrow pillar={config.pillar} label={config.pillarLabel} step="Result" />
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.levelRow}>
            <LevelRing level={config.level} />
            <View style={styles.levelCopy}>
              <Text style={styles.levelEyebrow}>
                Longevity Level · {config.pillarLabel}
              </Text>
              <View style={styles.levelTitleRow}>
                <Text style={styles.levelTitle}>Level {config.level}</Text>
                <TrendChip trend={config.trend} delta={config.trendDelta} />
              </View>
              <Text style={styles.levelNote}>{config.levelNote}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Relative performance</Text>
              <View style={styles.percentileRow}>
                <Text style={styles.percentileValue}>{config.percentile}</Text>
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
              <Text style={styles.heroValue}>{config.resultHero}</Text>
              {config.resultUnit ? (
                <Text style={styles.heroUnit}>{config.resultUnit}</Text>
              ) : null}
            </View>
            <Text style={styles.resultLabel}>{config.resultLabel}</Text>
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
          </View>

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
                <Text style={styles.nextAction}>{action}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={onNext}>{config.nextBtn}</LumenButton>
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
    paddingHorizontal: 22,
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
    paddingHorizontal: 26,
    paddingTop: 12,
    paddingBottom: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
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
    ...sora('semibold'),
    fontSize: 40,
    lineHeight: 40,
    letterSpacing: -1.2,
    color: lumen.fg,
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
    ...sora('semibold'),
    fontSize: 12.5,
    lineHeight: 17.5,
    color: lumen.fgMuted,
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
  percentileValue: {
    ...sora('semibold'),
    fontSize: 30,
    letterSpacing: -0.9,
    color: lumen.lime,
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
    alignItems: 'baseline',
    gap: 8,
    marginTop: 10,
  },
  heroValue: {
    ...sora('semibold'),
    fontSize: 64,
    lineHeight: 58,
    letterSpacing: -2.56,
    color: lumen.lime,
  },
  heroUnit: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
  },
  resultLabel: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fgMuted,
    marginTop: 8,
  },
  tiles: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: lumen.hairline,
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
    ...sora('semibold'),
    flex: 1,
    fontSize: 14.5,
    lineHeight: 20,
    color: lumen.fg,
  },
  footer: {
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 8,
  },
});
