// Design: kale-mobile-design — LumenButton (screens/KaleLumen.jsx, --lumen-btn #00C896)

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { lumen, sora } from '../../theme';

type LumenButtonProps = {
  children: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function LumenButton({ children, onPress, style }: LumenButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      accessibilityRole="button"
    >
      <Text style={styles.label}>{children}</Text>
      <Ionicons name="arrow-forward" size={19} color={lumen.bgDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 58,
    borderRadius: 9999,
    backgroundColor: lumen.mint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    ...sora('bold'),
    color: lumen.bgDark,
    fontSize: 16.5,
    letterSpacing: -0.2,
  },
});
