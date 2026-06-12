import { StyleSheet, Text, View } from 'react-native';
import { ringValueTextStyle } from '../../theme/textMetrics';

type RingCenterValueProps = {
  children: string | number;
  fontSize: number;
  color: string;
  letterSpacing?: number;
};

/** Optically centers a value inside a circular progress ring. */
export function RingCenterValue({
  children,
  fontSize,
  color,
  letterSpacing = -0.5,
}: RingCenterValueProps) {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text allowFontScaling={false} style={ringValueTextStyle(fontSize, color, letterSpacing)}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
