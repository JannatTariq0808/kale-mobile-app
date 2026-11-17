// Design: Lumen for IP — IPFlowShell (screens/LumenIP.jsx): back arrow, scrolling body, fixed footer

import { Ionicons } from '../icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lumen } from '../../theme';

type IPFlowShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
};

export function IPFlowShell({ children, footer, onBack }: IPFlowShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 }]}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 22,
    marginLeft: -6,
  },
  backIcon: {
    opacity: 0.85,
  },
  headerSpacer: {
    height: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 28,
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    alignItems: 'center',
  },
});
