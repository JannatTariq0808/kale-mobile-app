// Design: lum-14 KaleFitnessVO2Lumen (screens/KaleLumenApp.jsx)

import { StyleSheet, Text, View } from 'react-native';
import { LumenCard } from '../lumen/LumenCard';
import { fitnessVo2Max, type Vo2SourceRow } from '../../data/fitnessDemo';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, lumenPillar, sora } from '../../theme';

function AccuracyStars({ count }: { count: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <Text key={i} style={[styles.star, i < count ? styles.starOn : styles.starOff]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function SourceRow({ row, isLast }: { row: Vo2SourceRow; isLast: boolean }) {
  const { type } = useResponsiveLayout();

  return (
    <View style={[styles.dataRow, row.live && styles.dataRowLive, !isLast && styles.dataRowBorder]}>
      <Text style={[styles.cellSource, { fontSize: type(13) }]} numberOfLines={2}>
        {row.source}
      </Text>
      <Text
        style={[
          styles.cellEstimate,
          { fontSize: type(14) },
          row.live && styles.cellEstimateLive,
        ]}
      >
        {row.estimate}
      </Text>
      <View style={styles.cellAccuracy}>
        <AccuracyStars count={row.accuracy} />
      </View>
      <Text
        style={[
          styles.cellDate,
          { fontSize: type(11) },
          row.live && styles.cellDateLive,
        ]}
      >
        {row.date}
      </Text>
    </View>
  );
}

export function Vo2MaxPanel() {
  const { type, scale, isCompact } = useResponsiveLayout();
  const heroSize = scale(isCompact ? 56 : 72);

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Text style={[styles.heroEyebrow, { fontSize: type(11) }]}>Your best estimate</Text>
        <View style={styles.heroValueRow}>
          <Text style={[styles.heroValue, { fontSize: heroSize, lineHeight: heroSize * 0.92 }]}>
            {fitnessVo2Max.bestEstimate}
          </Text>
          <Text style={[styles.heroUnit, { fontSize: type(13) }]}>{fitnessVo2Max.unit}</Text>
        </View>
        <Text style={[styles.heroCopy, { fontSize: type(13), lineHeight: type(20) }]}>
          {fitnessVo2Max.summary}{' '}
          <Text style={styles.heroAccent}>{fitnessVo2Max.ratingLabel}</Text> for your age group.
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { fontSize: type(11) }]}>Running VO₂max — by source</Text>

      <LumenCard padding={0}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.headerSource, { fontSize: type(10) }]}>Source</Text>
          <Text style={[styles.headerCell, styles.headerEstimate, { fontSize: type(10) }]}>Estimate</Text>
          <Text style={[styles.headerCell, styles.headerAccuracy, { fontSize: type(10) }]}>Accuracy</Text>
          <Text style={[styles.headerCell, styles.headerDate, { fontSize: type(10) }]}>Date</Text>
        </View>
        {fitnessVo2Max.sources.map((row, index) => (
          <SourceRow
            key={row.source}
            row={row}
            isLast={index === fitnessVo2Max.sources.length - 1}
          />
        ))}
      </LumenCard>

      <LumenCard style={styles.formulaCard}>
        <View style={styles.formulaBadge}>
          <Text style={[styles.formulaText, { fontSize: type(17), lineHeight: type(22) }]}>
            {fitnessVo2Max.formula}
          </Text>
        </View>
        <Text style={[styles.formulaNote, { fontSize: type(13), lineHeight: type(20) }]}>
          {fitnessVo2Max.formulaNote}
        </Text>
      </LumenCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  hero: {
    paddingBottom: 18,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  heroEyebrow: {
    ...sora('bold'),
    color: lumenPillar.cardio,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroValue: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -2.8,
    fontVariant: ['tabular-nums'],
  },
  heroUnit: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  heroCopy: {
    ...sora('regular'),
    color: lumen.fg,
    marginTop: 10,
  },
  heroAccent: {
    ...sora('bold'),
    color: lumenPillar.cardio,
  },
  sectionLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  headerCell: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerSource: {
    flex: 1.4,
  },
  headerEstimate: {
    flex: 0.9,
    textAlign: 'right',
  },
  headerAccuracy: {
    flex: 1.1,
    textAlign: 'right',
  },
  headerDate: {
    flex: 0.7,
    textAlign: 'right',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dataRowLive: {
    backgroundColor: 'rgba(204,250,125,0.06)',
  },
  dataRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  cellSource: {
    ...sora('semibold'),
    color: lumen.fg,
    flex: 1.4,
    paddingRight: 6,
  },
  cellEstimate: {
    ...sora('extrabold'),
    color: lumen.fg,
    flex: 0.9,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  cellEstimateLive: {
    color: lumen.lime,
  },
  cellAccuracy: {
    flex: 1.1,
    alignItems: 'flex-end',
  },
  cellDate: {
    ...sora('bold'),
    color: lumen.fgMuted,
    flex: 0.7,
    textAlign: 'right',
  },
  cellDateLive: {
    color: lumenPillar.cardio,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    fontSize: 11,
    lineHeight: 12,
  },
  starOn: {
    color: lumenPillar.cardio,
  },
  starOff: {
    color: 'rgba(234,243,228,0.18)',
  },
  formulaCard: {
    marginTop: 16,
  },
  formulaBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(204,250,125,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(204,250,125,0.25)',
  },
  formulaText: {
    ...sora('extrabold'),
    color: lumen.fg,
  },
  formulaNote: {
    ...sora('regular'),
    color: lumen.fgMuted,
    marginTop: 12,
  },
});
