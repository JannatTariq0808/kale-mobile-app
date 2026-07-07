import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { MarketplaceProductCard } from '../../components/kalettes/MarketplaceProductCard';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import { kalettesDemo } from '../../data/kalettesDemo';
import { useKalettesRewards } from '../../hooks/useKalettesRewards';
import { useRewardsProducts } from '../../hooks/useRewardsProducts';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { KalettesStackParamList } from '../../navigation/KalettesStackNavigator';
import { openRewardsWeb } from '../../services/kalettes/openRewardsWeb';
import type { MarketplaceFilter } from '../../types/rewardsProduct';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<KalettesStackParamList, 'Marketplace'>;

const GRID_GAP = 10;

export function KalettesMarketplaceScreen({ navigation }: Props) {
  const { type, contentWidth, leading } = useResponsiveLayout();
  const { items: products, meta, loading } = useRewardsProducts();
  const rewards = useKalettesRewards();
  const [category, setCategory] = useState<MarketplaceFilter>('All');

  const cellWidth = Math.floor((contentWidth - GRID_GAP) / 2);

  const visibleItems = useMemo(
    () =>
      category === 'All' ? products : products.filter((item) => item.category === category),
    [category, products],
  );

  const rows = useMemo(() => {
    const pairs: (typeof visibleItems)[] = [];
    for (let i = 0; i < visibleItems.length; i += 2) {
      pairs.push(visibleItems.slice(i, i + 2));
    }
    return pairs;
  }, [visibleItems]);

  const debugLine = useMemo(() => {
    if (!__DEV__) return null;

    const visibleCount = visibleItems.length;
    const totalCount = products.length;
    const countLabel =
      category === 'All'
        ? `Showing ${visibleCount} product${visibleCount === 1 ? '' : 's'}`
        : `Showing ${visibleCount} in ${category} · ${totalCount} total`;

    if (meta.source === 'fallback') {
      return `${countLabel} · demo fallback (Firebase not configured)`;
    }

    if (meta.source === 'error') {
      return `${countLabel} · Firestore error${meta.projectId ? ` · ${meta.projectId}` : ''}`;
    }

    const docLabel =
      meta.mappedCount === meta.firestoreDocCount
        ? `${meta.firestoreDocCount} Firestore doc${meta.firestoreDocCount === 1 ? '' : 's'}`
        : `${meta.mappedCount} mapped / ${meta.firestoreDocCount} Firestore docs`;

    return `${countLabel} · ${docLabel}${meta.projectId ? ` · ${meta.projectId}` : ''}`;
  }, [category, meta, products.length, visibleItems.length]);

  return (
    <View style={styles.screen}>
      <LumenHeader />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Pressable
          onPress={() => navigation.navigate('Balance')}
          style={styles.backRow}
          accessibilityRole="button"
          accessibilityLabel="Back to Rewards"
        >
          <Ionicons name="chevron-back" size={type(16)} color={lumen.fgMuted} />
          <Text style={[styles.backText, { fontSize: type(13), lineHeight: leading(type(13)) }]}>Rewards</Text>
        </Pressable>

        <View style={styles.titleRow}>
          <Text style={[styles.pageTitle, { fontSize: type(32), lineHeight: leading(type(32), 1.15) }]}>
            Longevity Marketplace
          </Text>
          <Text style={[styles.ptsBadge, { fontSize: type(12) }]}>
            {rewards.hasQuote || rewards.bankedBalance > 0
              ? `${rewards.bankedBalance.toLocaleString('en-GB')} to spend`
              : '— to spend'}
          </Text>
        </View>

        <Text style={[styles.subcopy, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
          A taste of what you can spend on. Browse and buy at kale.insure/rewards.
        </Text>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryRow}
        >
          {kalettesDemo.categories.map((cat) => {
            const active = cat === category;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    { fontSize: type(13), lineHeight: leading(type(13)) },
                    active && styles.categoryLabelActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {!loading && debugLine ? (
          <Text style={[styles.debugLine, { fontSize: type(11), lineHeight: leading(type(11)) }]}>{debugLine}</Text>
        ) : null}

        {loading ? (
          <ActivityIndicator color={lumen.lime} style={styles.loader} />
        ) : visibleItems.length === 0 ? (
          <Text style={[styles.empty, { fontSize: type(14) }]}>No products in this category yet.</Text>
        ) : (
          <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={[styles.gridRow, { gap: GRID_GAP }]}>
                {row.map((item) => (
                  <View key={item.id} style={{ width: cellWidth }}>
                    <MarketplaceProductCard
                      item={item}
                      onPress={() => void openRewardsWeb({ slug: item.slug })}
                    />
                  </View>
                ))}
                {row.length === 1 ? <View style={{ width: cellWidth }} /> : null}
              </View>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => void openRewardsWeb()}
          style={({ pressed }) => [styles.webCta, pressed && styles.webCtaPressed]}
          accessibilityRole="link"
        >
          <Text style={[styles.webCtaText, { fontSize: type(13), lineHeight: leading(type(13)) }]}>
            See everything at kale.insure
          </Text>
        </Pressable>
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
    paddingTop: 4,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  backText: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    includeFontPadding: false,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  pageTitle: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -0.8,
    flex: 1,
  },
  ptsBadge: {
    ...sora('bold'),
    color: lumen.lime,
    fontVariant: ['tabular-nums'],
  },
  subcopy: {
    ...sora('regular'),
    color: lumen.fgMuted,
    marginTop: 8,
    maxWidth: 320,
  },
  categoryScroll: {
    marginTop: 16,
    marginBottom: 8,
    flexGrow: 0,
  },
  categoryRow: {
    gap: 8,
    paddingRight: 8,
  },
  debugLine: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginBottom: 8,
    opacity: 0.85,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  categoryPillActive: {
    backgroundColor: lumen.lime,
    borderColor: lumen.lime,
  },
  categoryLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
  },
  categoryLabelActive: {
    color: lumen.bgDark,
  },
  loader: {
    marginVertical: 32,
  },
  empty: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    textAlign: 'center',
    marginVertical: 24,
  },
  grid: {
    gap: GRID_GAP,
    marginTop: 8,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  webCta: {
    marginTop: 14,
    marginBottom: 8,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.04)',
    alignItems: 'center',
  },
  webCtaPressed: {
    opacity: 0.88,
  },
  webCtaText: {
    ...sora('semibold'),
    color: lumen.fg,
    textAlign: 'center',
  },
});
