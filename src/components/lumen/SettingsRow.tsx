import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { lumen, sora, typography } from '../../theme';

type ConnectionIcon = 'strava' | 'garmin' | 'apple';

type SettingsRowProps = {
  icon?: ConnectionIcon;
  label: string;
  value?: string;
  valueColor?: string;
  labelColor?: string;
  chevron?: boolean;
  last?: boolean;
  onPress?: () => void;
};

/** K3SettingsRow — kale-mobile-design/screens/KaleApp2.jsx */
export function SettingsRow({
  icon,
  label,
  value,
  valueColor,
  labelColor,
  chevron = true,
  last = false,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, !last && styles.rowBorder]}
      accessibilityRole="button"
    >
      {icon ? <ConnectionIconView type={icon} /> : null}
      <Text style={[styles.label, labelColor ? { color: labelColor } : null]}>{label}</Text>
      {value ? (
        <Text style={[styles.value, { color: valueColor ?? lumen.fgMuted }]}>{value}</Text>
      ) : null}
      {chevron ? <Ionicons name="chevron-forward" size={14} color={lumen.fgMuted} /> : null}
    </Pressable>
  );
}

function ConnectionIconView({ type }: { type: ConnectionIcon }) {
  if (type === 'strava') {
    return (
      <View style={styles.stravaIcon}>
        <Text style={styles.stravaLetter}>S</Text>
      </View>
    );
  }

  if (type === 'garmin') {
    return (
      <Image
        source={require('../../../assets/garmin_device_logo.png')}
        style={styles.garminIcon}
        accessibilityLabel="Garmin"
      />
    );
  }

  return (
    <View style={styles.appleIcon}>
      <Ionicons name="logo-apple" size={16} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  label: {
    ...sora('semibold'),
    flex: 1,
    fontSize: typography.small,
    color: lumen.fg,
  },
  value: {
    ...sora('semibold'),
    fontSize: 13,
  },
  stravaIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FC4C02',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stravaLetter: {
    ...sora('extrabold'),
    color: '#fff',
    fontSize: 13,
  },
  garminIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  appleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#A2AAAD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
