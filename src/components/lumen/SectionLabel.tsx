import { StyleSheet, Text } from 'react-native';
import { lumen, sora } from '../../theme';

type SectionLabelProps = {
  children: string;
  variant?: 'page' | 'section';
};

export function SectionLabel({ children, variant = 'section' }: SectionLabelProps) {
  return <Text style={variant === 'page' ? styles.page : styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  page: {
    ...sora('bold'),
    fontSize: 13,
    letterSpacing: 2.3,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  section: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 10,
  },
});
