import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { FaqAccordion } from '../lumen/FaqAccordion';
import { lumen, sora } from '../../theme';

type FitnessFaqSectionProps = {
  items: { id: string; question: string; answer: string }[];
  loading: boolean;
  accentColor: string;
};

export function FitnessFaqSection({ items, loading, accentColor }: FitnessFaqSectionProps) {
  const { type } = useResponsiveLayout();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.faqLabel, { fontSize: type(11) }]}>Common questions</Text>
      {loading ? (
        <ActivityIndicator color={accentColor} style={styles.faqLoader} />
      ) : (
        <FaqAccordion items={items} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: 8,
  },
  faqLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  faqLoader: {
    marginVertical: 20,
  },
});
