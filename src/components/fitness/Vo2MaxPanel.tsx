// Design: lum-14 KaleFitnessVO2Lumen (screens/KaleLumenApp.jsx)

import { StyleSheet, Text, View } from 'react-native';
import type { FitnessCardioVo2Data } from '../../services/fitness/fetchFitnessPillarData';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useVo2Questions } from '../../hooks/useVo2Questions';
import { GARMIN_ACCURACY, KALE_FORMULA_ACCURACY } from '../../utils/buildVo2Sources';
import { LumenCard } from '../lumen/LumenCard';
import { FitnessFaqSection } from './FitnessFaqSection';
import { Vo2StarRating } from './Vo2StarRating';
import { lumen, lumenPillar, sora } from '../../theme';

export function Vo2MaxPanel({
  data,
}: {
  data: FitnessCardioVo2Data;
}) {
  const { type, leading } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useVo2Questions();
  const hasEstimate = data.sources.length > 0 && data.bestEstimate != null;
  const heroSize = type(56);
  const heroLine = leading(heroSize, 1.02);

  if (!hasEstimate) {
    return (
      <View style={styles.wrap}>
        <LumenCard style={styles.emptyCard}>
          <Text style={[styles.emptyText, { fontSize: type(14) }]}>
            Connect Garmin or complete your cardio assessment to see VO₂max estimates and how each
            source contributes.
          </Text>
        </LumenCard>
        <FitnessFaqSection items={faqItems} loading={faqLoading} accentColor={lumenPillar.cardio} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Text style={[styles.heroEyebrow, { fontSize: type(10), lineHeight: leading(type(10), 1.3) }]}>
          YOUR BEST ESTIMATE
        </Text>
        <View style={styles.heroValueRow}>
          <Text style={[styles.heroValue, { fontSize: heroSize, lineHeight: heroLine }]}>
            {data.bestEstimate?.toFixed(1)}
          </Text>
          <Text style={[styles.heroUnit, { fontSize: type(14), lineHeight: leading(type(14)) }]}>
            {data.unit}
          </Text>
        </View>
        <Text style={[styles.heroSummary, { fontSize: type(14), lineHeight: leading(type(14), 1.45) }]}>
          {data.summary}
          {data.ratingLabel && data.cohortLabel ? (
            <>
              {' '}
              <Text style={styles.heroRating}>{data.ratingLabel}</Text> for your age group.
            </>
          ) : data.ratingLabel ? (
            <>
              {' '}
              <Text style={styles.heroRating}>{data.ratingLabel}</Text>.
            </>
          ) : null}
        </Text>
      </View>

      <View style={styles.tableSection}>
        <Text style={[styles.tableTitle, { fontSize: type(10), lineHeight: leading(type(10), 1.3) }]}>
          {data.sportLabel} VO₂MAX — BY SOURCE
        </Text>

        <LumenCard padding={0} style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colSource, styles.headerCell]}>SOURCE</Text>
            <Text style={[styles.colEstimate, styles.headerCell]}>ESTIMATE</Text>
            <Text style={[styles.colAccuracy, styles.headerCell]}>ACCURACY</Text>
            <Text style={[styles.colDate, styles.headerCell]}>DATE</Text>
          </View>

          {data.sources.map((row, index) => (
            <View
              key={`${row.source}-${row.estimate}`}
              style={[
                styles.tableRow,
                row.live && styles.tableRowLive,
                index < data.sources.length - 1 && styles.tableRowBorder,
              ]}
            >
              <Text style={[styles.colSource, styles.sourceCell]}>{row.source}</Text>
              <Text style={[styles.colEstimate, styles.estimateCell, row.live && styles.estimateLive]}>
                {row.estimate}
              </Text>
              <View style={styles.colAccuracy}>
                <Vo2StarRating filled={row.accuracy} size={type(11)} />
              </View>
              <Text style={[styles.colDate, styles.dateCell, row.live && styles.dateLive]}>
                {row.date}
              </Text>
            </View>
          ))}
        </LumenCard>

        <View style={styles.starLegend}>
          <View style={styles.legendItem}>
            <Vo2StarRating filled={GARMIN_ACCURACY} size={type(10)} />
            <Text style={styles.legendText}>Garmin device</Text>
          </View>
          <View style={styles.legendItem}>
            <Vo2StarRating filled={KALE_FORMULA_ACCURACY} size={type(10)} />
            <Text style={styles.legendText}>Kale estimate</Text>
          </View>
        </View>
      </View>

      <FitnessFaqSection items={faqItems} loading={faqLoading} accentColor={lumenPillar.cardio} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 20,
  },
  emptyCard: {
    marginBottom: 14,
  },
  emptyText: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    textAlign: 'center',
  },
  hero: {
    gap: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
    marginBottom: 4,
  },
  heroEyebrow: {
    ...sora('bold'),
    letterSpacing: 1.4,
    color: lumen.mint,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  heroValue: {
    ...sora('extrabold'),
    color: lumen.lime,
    letterSpacing: -1.5,
  },
  heroUnit: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    paddingBottom: 8,
  },
  heroSummary: {
    ...sora('regular'),
    color: lumen.fgMuted,
    marginBottom: 12,
  },
  heroRating: {
    ...sora('bold'),
    color: lumen.lime,
  },
  tableSection: {
    gap: 10,
  },
  tableTitle: {
    ...sora('bold'),
    letterSpacing: 1.2,
    color: lumen.fgMuted,
  },
  tableCard: {
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
    gap: 8,
  },
  headerCell: {
    ...sora('bold'),
    fontSize: 9,
    letterSpacing: 0.8,
    color: lumen.fgFaint,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  tableRowLive: {
    backgroundColor: 'rgba(204,250,125,0.06)',
  },
  colSource: {
    flex: 1.4,
    minWidth: 0,
  },
  colEstimate: {
    flex: 0.9,
    textAlign: 'right',
  },
  colAccuracy: {
    flex: 1.1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colDate: {
    flex: 0.7,
    textAlign: 'right',
  },
  sourceCell: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fg,
  },
  estimateCell: {
    ...sora('bold'),
    fontSize: 14,
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
  },
  estimateLive: {
    color: lumen.lime,
  },
  dateCell: {
    ...sora('bold'),
    fontSize: 11,
    color: lumen.fgMuted,
  },
  dateLive: {
    color: lumenPillar.cardio,
  },
  starLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    ...sora('regular'),
    fontSize: 11,
    color: lumen.fgMuted,
  },
});
