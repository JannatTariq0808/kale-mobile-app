import { StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { isGarminDeviceName } from '../../utils/cardioDevice';
import { lumen, sora } from '../../theme';
import { GarminDeviceTag } from './GarminDeviceTag';

type ActivityDeviceTagProps = {
  device: string;
};

export function ActivityDeviceTag({ device }: ActivityDeviceTagProps) {
  const { type } = useResponsiveLayout();

  if (isGarminDeviceName(device)) {
    return <GarminDeviceTag device={device} />;
  }

  return (
    <View style={styles.plainTag}>
      <Text style={[styles.plainDevice, { fontSize: type(12), lineHeight: type(16) }]} numberOfLines={1}>
        {device.trim()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plainTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: 'rgba(234,243,228,0.06)',
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  plainDevice: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    flexShrink: 1,
    letterSpacing: -0.1,
  },
});
