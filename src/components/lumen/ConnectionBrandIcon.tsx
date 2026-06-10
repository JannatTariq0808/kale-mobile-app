import { Image, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

export type ConnectionBrand = 'strava' | 'garmin' | 'apple';

type ConnectionBrandIconProps = {
  brand: ConnectionBrand;
  size?: number;
};

/** Figma brand tile — rx 10.6668 on an 80×80 asset. */
const DESIGN_TILE_SIZE = 80;
const DESIGN_CORNER_RADIUS = 10.6668;

const BRAND_ASSETS: Record<ConnectionBrand, number> = {
  strava: require('../../../assets/strava.svg'),
  garmin: require('../../../assets/garmin.svg'),
  apple: require('../../../assets/appleHealth.svg'),
};

function brandCornerRadius(size: number) {
  return (DESIGN_CORNER_RADIUS / DESIGN_TILE_SIZE) * size;
}

export function ConnectionBrandIcon({ brand, size = 44 }: ConnectionBrandIconProps) {
  const borderRadius = brandCornerRadius(size);
  const uri = Image.resolveAssetSource(BRAND_ASSETS[brand]).uri;

  if (!uri) {
    return <View style={{ width: size, height: size, borderRadius }} />;
  }

  return (
    <View style={[styles.clip, { width: size, height: size, borderRadius }]}>
      <SvgUri uri={uri} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
