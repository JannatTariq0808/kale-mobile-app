// Design: kale-mobile-design — KAGarminDeviceTag (screens/KaleApp.jsx)

import { Image, StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, sora } from '../../theme';

const GARMIN_DEVICE_LOGO = require('../../../assets/garmin_device_logo.png');
const LOGO_SOURCE = Image.resolveAssetSource(GARMIN_DEVICE_LOGO);
const LOGO_ASPECT = LOGO_SOURCE.width / LOGO_SOURCE.height;
const LOGO_HEIGHT = 12;

type GarminDeviceTagProps = {
  device: string;
};

export function GarminDeviceTag({ device }: GarminDeviceTagProps) {
  const { type } = useResponsiveLayout();

  return (
    <View style={styles.tag}>
      <Image
        source={GARMIN_DEVICE_LOGO}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Garmin"
      />
      <Text style={[styles.device, { fontSize: type(10), lineHeight: type(13) }]} numberOfLines={1}>
        {device}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 8,
    paddingVertical: 5,
    paddingRight: 8,
    paddingLeft: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,200,150,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.35)',
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_HEIGHT * LOGO_ASPECT,
    flexShrink: 0,
    borderRadius: 4,
  },
  device: {
    ...sora('semibold'),
    color: lumen.fg,
    flexShrink: 1,
    letterSpacing: -0.1,
  },
});
