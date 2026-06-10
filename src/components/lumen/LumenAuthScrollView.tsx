import { forwardRef, type ReactNode } from 'react';
import { Platform, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

type LumenAuthScrollViewProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
  /** Horizontal gutter — scales with screen width (default 30). */
  gutter?: number;
};

export const LumenAuthScrollView = forwardRef<KeyboardAwareScrollView, LumenAuthScrollViewProps>(
  function LumenAuthScrollView(
    { children, contentContainerStyle, bottomInset = 0, gutter = 30 },
    ref,
  ) {
    const { pad } = useResponsiveLayout();

    return (
      <KeyboardAwareScrollView
        ref={ref}
        style={styles.flex}
        contentContainerStyle={[
          { paddingHorizontal: pad(gutter), flexGrow: 1 },
          contentContainerStyle,
          { paddingBottom: bottomInset + 24 },
        ]}
        enableOnAndroid
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        extraScrollHeight={Platform.OS === 'ios' ? 32 : 56}
        extraHeight={Platform.OS === 'ios' ? 140 : 180}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  },
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
