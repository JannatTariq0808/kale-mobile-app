import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { lumen, sora } from '../../theme';

type LumenHeaderProps = {
  onAvatarPress?: () => void;
};

/** LumHeader — kale-mobile-design/screens/KaleLumenApp.jsx */
export function LumenHeader({ onAvatarPress }: LumenHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.wordmark}>Kale</Text>
      <Pressable onPress={onAvatarPress} accessibilityRole="button" accessibilityLabel="Profile">
        <Image source={require('../../../assets/iris.jpg')} style={styles.avatar} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 22,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    ...sora('extrabold'),
    color: lumen.fg,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
  },
});
