import { StyleSheet, Text, View } from 'react-native';
import { lumen, typography } from '../theme';

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lumen.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    color: lumen.fgMuted,
    fontSize: typography.headline,
    fontWeight: typography.weightSemibold,
  },
});
