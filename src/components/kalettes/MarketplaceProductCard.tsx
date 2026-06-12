import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { RewardsProduct } from '../../types/rewardsProduct';
import { lumen, lumenPillar, sora } from '../../theme';

const PRODUCT_PLACEHOLDER = require('../../../assets/icon.png') as ImageSourcePropType;

const tagColors = {
  GEAR: { bg: 'rgba(0,200,150,0.15)', fg: lumenPillar.cardio },
  OFFER: { bg: 'rgba(232,130,110,0.15)', fg: lumenPillar.strength },
  ASSESSMENT: { bg: 'rgba(245,233,78,0.15)', fg: lumenPillar.knowledge },
  COACHING: { bg: 'rgba(234,243,228,0.06)', fg: lumen.fg },
} as const;

type MarketplaceProductCardProps = {
  item: RewardsProduct;
  onPress: () => void;
};

function ProductImage({ imageUrl }: { imageUrl?: string }) {
  const [remoteVisible, setRemoteVisible] = useState(Boolean(imageUrl));

  useEffect(() => {
    setRemoteVisible(Boolean(imageUrl));
  }, [imageUrl]);

  return (
    <View style={styles.imageSlot}>
      <Image source={PRODUCT_PLACEHOLDER} style={styles.placeholderImage} resizeMode="contain" />
      {imageUrl && remoteVisible ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.remoteImage}
          resizeMode="cover"
          onError={() => setRemoteVisible(false)}
        />
      ) : null}
    </View>
  );
}

export function MarketplaceProductCard({ item, onPress }: MarketplaceProductCardProps) {
  const { type, leading } = useResponsiveLayout();
  const tag = tagColors[item.tag];
  const brandSize = type(10);
  const titleSize = type(13);
  const titleLine = leading(titleSize, 1.3);
  const discountLabel = item.discount
    ? item.discount.startsWith('-')
      ? item.discount
      : `-${item.discount}`
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="link"
      accessibilityLabel={`${item.title}, ${item.pts} points${discountLabel ? `, ${discountLabel}` : ''}`}
    >
      <View style={styles.imageWrap}>
        <ProductImage imageUrl={item.imageUrl} />
        <View style={[styles.tag, { backgroundColor: tag.bg }]}>
          <Text
            style={[
              styles.tagText,
              { fontSize: type(9), lineHeight: leading(type(9), 1.25), color: tag.fg },
            ]}
          >
            {item.tag}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.brandRow}>
          <Text
            style={[styles.brand, { fontSize: brandSize, lineHeight: leading(brandSize) }]}
            numberOfLines={1}
          >
            {item.brand}
          </Text>
          {discountLabel ? (
            <View style={styles.discountPill}>
              <Text style={[styles.discountText, { fontSize: brandSize, lineHeight: leading(brandSize) }]}>
                {discountLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          style={[styles.title, { fontSize: titleSize, lineHeight: titleLine, minHeight: titleLine * 2 }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <View style={styles.ptsRow}>
          <Text style={[styles.pts, { fontSize: type(16), lineHeight: leading(type(16), 1.1) }]}>
            {item.pts}
          </Text>
          <Text style={[styles.ptsUnit, { fontSize: type(11), lineHeight: leading(type(11)) }]}>pts</Text>
        </View>
        <Text style={[styles.topup, { fontSize: type(10), lineHeight: leading(type(10)) }]}>
          {item.topup != null ? `+ £${item.topup} top-up` : '\u00A0'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.03)',
  },
  cardPressed: {
    opacity: 0.88,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  imageSlot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234,243,228,0.06)',
  },
  placeholderImage: {
    width: 52,
    height: 52,
    opacity: 0.5,
  },
  remoteImage: {
    ...StyleSheet.absoluteFillObject,
  },
  tag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  tagText: {
    ...sora('extrabold'),
    letterSpacing: 1.2,
  },
  body: {
    padding: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brand: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    flex: 1,
  },
  discountPill: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(232,130,110,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(232,130,110,0.28)',
    flexShrink: 0,
  },
  discountText: {
    ...sora('bold'),
    color: lumenPillar.strength,
    letterSpacing: -0.2,
  },
  title: {
    ...sora('bold'),
    color: lumen.fg,
    marginTop: 4,
  },
  ptsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 8,
  },
  pts: {
    ...sora('extrabold'),
    color: lumen.mint,
    fontVariant: ['tabular-nums'],
  },
  ptsUnit: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  topup: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginTop: 4,
  },
});
