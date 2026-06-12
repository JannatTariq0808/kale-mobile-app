import { StyleSheet, View } from 'react-native';
import { LumenGlyph } from './LumenGlyph';
import { lumen } from '../../theme';

/** Branded splash — shown in Expo Go (native splash cannot be customized there). */
export function SplashView() {
  return (
    <View style={styles.screen}>
      <LumenGlyph color={lumen.green} height={72} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
