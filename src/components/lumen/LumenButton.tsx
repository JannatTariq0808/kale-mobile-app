// Design: kale-mobile-design — LumenButton (screens/KaleLumen.jsx, --lumen-btn #00C896)

import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { lumen, sora } from '../../theme';

type LumenButtonProps = {
  children: string;
  onPress?: () => void;
  style?: ViewStyle;
  /** `lime` matches Running Years CTAs (#CCFA7D). Default is mint. */
  tone?: 'mint' | 'lime';
};

export function LumenButton({ children, onPress, style, tone = 'mint' }: LumenButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'lime' ? styles.buttonLime : styles.buttonMint,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.inner}>
        <Text
          style={styles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.88}
        >
          {children}
        </Text>
        <Ionicons name="arrow-forward" size={18} color={lumen.bgDark} style={styles.icon} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 58,
    paddingHorizontal: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMint: {
    backgroundColor: lumen.mint,
  },
  buttonLime: {
    backgroundColor: lumen.lime,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    maxWidth: '100%',
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    ...sora('bold'),
    flexShrink: 1,
    color: lumen.bgDark,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.3,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  icon: {
    flexShrink: 0,
  },
});
