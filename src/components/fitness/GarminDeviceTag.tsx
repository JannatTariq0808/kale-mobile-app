// Design: kale-mobile-design — KAGarminDeviceTag (screens/KaleApp.jsx)

import { Image, StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, sora } from '../../theme';

const GARMIN_DEVICE_LOGO = require('../../../assets/garmin_device_logo.png');
const LOGO_SOURCE = Image.resolveAssetSource(GARMIN_DEVICE_LOGO);
const LOGO_ASPECT = LOGO_SOURCE.width / LOGO_SOURCE.height;

type GarminDeviceTagProps = {
  device: string;
  /** chip = fitness activity log; inline = compact inline row */
  variant?: 'chip' | 'inline';
  /** No top margin — for placement below result stat rows */
  compact?: boolean;
};

/** Drop leading "Garmin" — the logo already carries the brand. */
export function garminDeviceDisplayName(device: string): string {
  const trimmed = device.trim();
  const withoutBrand = trimmed.replace(/^garmin\s+/i, '').trim();
  return withoutBrand.length > 0 ? withoutBrand : trimmed;
}

export function GarminDeviceTag({
  device,
  variant = 'chip',
  compact = false,
}: GarminDeviceTagProps) {
  const { type } = useResponsiveLayout();
  const displayName = garminDeviceDisplayName(device);

  if (variant === 'inline') {
    const logoHeight = 15;
    return (
      <View style={styles.inline}>
        <View style={styles.inlineLogoWrap}>
          <Image
            source={GARMIN_DEVICE_LOGO}
            style={{ height: logoHeight, width: logoHeight * LOGO_ASPECT }}
            resizeMode="contain"
            accessibilityLabel="Garmin"
          />
        </View>
        <Text style={styles.inlineDevice} numberOfLines={2}>
          {displayName}
        </Text>
      </View>
    );
  }

  const logoHeight = 16;

  return (
    <View style={[styles.tag, compact ? styles.tagCompact : null]}>
      <Image
        source={GARMIN_DEVICE_LOGO}
        style={{ height: logoHeight, width: logoHeight * LOGO_ASPECT }}
        resizeMode="contain"
        accessibilityLabel="Garmin"
      />
      <Text style={[styles.device, { fontSize: type(12), lineHeight: type(16) }]} numberOfLines={1}>
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
    gap: 7,
    marginTop: 8,
    paddingVertical: 7,
    paddingRight: 10,
    paddingLeft: 7,
    borderRadius: 9,
    backgroundColor: 'rgba(0,200,150,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.35)',
  },
  tagCompact: {
    marginTop: 0,
  },
  device: {
    ...sora('semibold'),
    color: lumen.fg,
    flexShrink: 1,
    letterSpacing: -0.1,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    minWidth: 0,
  },
  inlineLogoWrap: {
    marginTop: 2,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(0,200,150,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.28)',
  },
  inlineDevice: {
    ...sora('bold'),
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: -0.2,
    color: lumen.fg,
  },
});
