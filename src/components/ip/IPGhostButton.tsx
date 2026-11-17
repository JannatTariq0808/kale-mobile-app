// Design: Lumen for IP — outlined secondary button (screens/LumenIP.jsx IPGhostButton)

import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { lumen, sora } from '../../theme';

type IPGhostButtonProps = {
  children: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function IPGhostButton({ children, onPress, style }: IPGhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <Text style={styles.label} numberOfLines={1}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...sora('bold'),
    fontSize: 15.5,
    lineHeight: 20,
    color: lumen.fg,
  },
});
