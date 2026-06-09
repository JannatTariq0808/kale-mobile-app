import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { lumen, sora, typography } from '../../theme';

type SettingsToggleProps = {
  label: string;
  sub?: string;
  defaultOn?: boolean;
  last?: boolean;
};

/** K3SettingsToggle — kale-mobile-design/screens/KaleApp2.jsx */
export function SettingsToggle({ label, sub, defaultOn = false, last = false }: SettingsToggleProps) {
  const [on, setOn] = useState(defaultOn);

  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      <Pressable
        onPress={() => setOn((prev) => !prev)}
        style={[styles.track, on && styles.trackOn]}
        accessibilityRole="switch"
        accessibilityState={{ checked: on }}
      >
        <View style={[styles.thumb, on && styles.thumbOn]} />
      </Pressable>
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
  copy: {
    flex: 1,
  },
  label: {
    ...sora('semibold'),
    fontSize: typography.small,
    color: lumen.fg,
  },
  sub: {
    ...sora('regular'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
    marginTop: 2,
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: {
    backgroundColor: lumen.mint,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  thumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: lumen.bgDark,
  },
});
