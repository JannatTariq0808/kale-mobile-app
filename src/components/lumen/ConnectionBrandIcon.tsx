import { Image, StyleSheet, View } from 'react-native';
import AppleHealthIcon from '../../../assets/appleHealth.svg';

export type ConnectionBrand = 'strava' | 'garmin' | 'apple';

type ConnectionBrandIconProps = {
  brand: ConnectionBrand;
  size?: number;
};

/** Figma brand tile — rx 10.6668 on an 80×80 asset. */
const DESIGN_TILE_SIZE = 80;
const DESIGN_CORNER_RADIUS = 10.6668;

const BRAND_PNG = {
  strava: require('../../../assets/strava.png'),
  garmin: require('../../../assets/garmin_connect.png'),
} as const;

function brandCornerRadius(size: number) {
  return (DESIGN_CORNER_RADIUS / DESIGN_TILE_SIZE) * size;
}

export function ConnectionBrandIcon({ brand, size = 44 }: ConnectionBrandIconProps) {
  const borderRadius = brandCornerRadius(size);
  const tileStyle = { width: size, height: size, borderRadius };

  if (brand === 'apple') {
    return (
      <View style={[styles.tile, tileStyle]}>
        <AppleHealthIcon width={size} height={size} style={tileStyle} />
      </View>
    );
  }

  return (
    <Image
      source={BRAND_PNG[brand]}
      style={[styles.tile, tileStyle]}
      resizeMode="cover"
      accessibilityLabel={brand === 'strava' ? 'Strava' : 'Garmin Connect'}
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
  },
});
