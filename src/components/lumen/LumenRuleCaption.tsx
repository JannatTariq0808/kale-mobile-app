import { StyleSheet, Text, View } from 'react-native';
import { lumen, sora } from '../../theme';

type LumenRuleCaptionProps = {
  children: string;
  align?: 'left' | 'right';
  color?: string;
  maxWidth?: number;
  size?: number;
};

export function LumenRuleCaption({
  children,
  align = 'right',
  color = lumen.green,
  maxWidth = 330,
  size = 22,
}: LumenRuleCaptionProps) {
  return (
    <View style={[styles.row, align === 'right' ? styles.alignRight : styles.alignLeft]}>
      <View style={[styles.inner, { maxWidth }]}>
        <View style={[styles.rule, { backgroundColor: color }]} />
        <Text style={[styles.text, { color, fontSize: size, lineHeight: size * 1.375 }]}>
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  rule: {
    width: 2,
    opacity: 0.85,
    alignSelf: 'stretch',
  },
  text: {
    ...sora('bold'),
    flex: 1,
    letterSpacing: -0.16,
  },
});
