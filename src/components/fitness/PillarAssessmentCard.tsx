import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { LumHeroRing } from '../lumen/LumHeroRing';
import { LumenCard } from '../lumen/LumenCard';
import { lumen, lumenPillar, sora } from '../../theme';

export type PillarAssessmentCardData = {
  dateLabel?: string;
  pillarLabel: string;
  level: number;
  topicLabel: string;
  scoreLabel: string;
  accuracyPct: number;
  trendDelta: number | null;
  trendDisplay?: string | null;
  performanceNote: string;
  averageLabel: string;
  levelProgress: number;
  levelUpMessage: string;
};

type PillarAssessmentCardProps = {
  pillar: 'knowledge' | 'strength' | 'cardio';
  data: PillarAssessmentCardData;
  variant?: 'summary' | 'history';
};

function TrendBadge({ delta, display }: { delta: number; display?: string | null }) {
  const isUp = delta > 0;
  const label = display ?? (isUp ? `+${delta}` : String(delta));
  return (
    <View style={[styles.trendChip, isUp ? styles.trendChipUp : styles.trendChipDown]}>
      <Ionicons
        name={isUp ? 'arrow-up' : 'arrow-down'}
        size={10}
        color={isUp ? lumen.mint : lumen.coral}
      />
      <Text style={[styles.trendText, isUp ? styles.trendTextUp : styles.trendTextDown]}>
        {label}
      </Text>
    </View>
  );
}

export function PillarAssessmentCard({
  pillar,
  data,
  variant = 'summary',
}: PillarAssessmentCardProps) {
  const { type, scale, leading, isCompact } = useResponsiveLayout();
  const accent = lumenPillar[pillar];
  const scoreSize = type(variant === 'summary' ? 34 : 28);
  const ringSize = scale(isCompact ? 68 : 76);

  return (
    <LumenCard accent={accent} style={variant === 'history' ? styles.historyCard : styles.summaryCard}>
      {data.dateLabel ? (
        <>
          <Text style={[styles.dateLabel, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
            {data.dateLabel}
          </Text>
          <View style={styles.dateRule} />
        </>
      ) : (
        <View style={styles.summaryHeader}>
          <LumHeroRing
            value={data.level}
            pct={data.level * 10}
            size={ringSize}
            stroke={6}
            accentColor={accent}
          />
          <Text style={[styles.summaryTitle, { fontSize: type(15), lineHeight: leading(type(15)) }]}>
            {data.pillarLabel}: Level {data.level}
          </Text>
        </View>
      )}

      <Text style={[styles.topicLabel, { fontSize: type(12) }]}>{data.topicLabel}</Text>

      <View style={styles.scoreRow}>
        <Text style={[styles.score, { fontSize: scoreSize, lineHeight: leading(scoreSize, 1.05) }]}>
          {data.scoreLabel}
        </Text>
        <View style={styles.scoreMeta}>
          <Text style={[styles.accuracy, { fontSize: type(14) }]}>{data.accuracyPct}%</Text>
          {data.trendDelta != null && data.trendDelta !== 0 ? (
            <TrendBadge delta={data.trendDelta} display={data.trendDisplay} />
          ) : null}
        </View>
      </View>

      <View style={styles.noteRow}>
        <Text style={[styles.performanceNote, { fontSize: type(12) }]}>{data.performanceNote}</Text>
        <Text style={[styles.averageLabel, { fontSize: type(12) }]}>{data.averageLabel}</Text>
      </View>

      {data.levelUpMessage ? (
        <Text style={[styles.levelUpMessage, { fontSize: type(13), lineHeight: leading(type(13), 1.35) }]}>
          {data.levelUpMessage}
        </Text>
      ) : null}
    </LumenCard>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    marginBottom: 14,
  },
  historyCard: {
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  summaryTitle: {
    ...sora('bold'),
    color: lumen.fg,
    flex: 1,
  },
  dateLabel: {
    ...sora('semibold'),
    color: lumen.fg,
  },
  dateRule: {
    height: 1,
    backgroundColor: lumen.hairline,
    marginTop: 10,
    marginBottom: 12,
  },
  topicLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 0.4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  score: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  scoreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  accuracy: {
    ...sora('extrabold'),
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  trendChipUp: {
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  trendChipDown: {
    backgroundColor: 'rgba(232,130,110,0.16)',
  },
  trendText: {
    ...sora('extrabold'),
    fontSize: 11,
  },
  trendTextUp: {
    color: lumen.mint,
  },
  trendTextDown: {
    color: lumen.coral,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  performanceNote: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    flex: 1,
  },
  averageLabel: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    fontVariant: ['tabular-nums'],
  },
  levelUpMessage: {
    ...sora('semibold'),
    color: lumen.fg,
    marginTop: 14,
  },
});
