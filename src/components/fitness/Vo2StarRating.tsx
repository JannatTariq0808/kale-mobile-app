import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { lumen } from '../../theme';

type Vo2StarRatingProps = {
  filled: number;
  total?: number;
  size?: number;
};

export function Vo2StarRating({ filled, total = 5, size = 12 }: Vo2StarRatingProps) {
  const clamped = Math.max(0, Math.min(total, Math.round(filled)));

  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => {
        const active = index < clamped;
        return (
          <Ionicons
            key={index}
            name={active ? 'star' : 'star-outline'}
            size={size}
            color={active ? lumen.mint : 'rgba(234,243,228,0.22)'}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
