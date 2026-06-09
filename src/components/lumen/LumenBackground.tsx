import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { lumen } from '../../theme';

type LumenBackgroundProps = {
  /** Matches LumAppBg peak — controls upper curve zone height */
  peak?: number;
};

/** Static approximation of LumAppBg — kale-mobile-design/screens/KaleLumenApp.jsx */
export function LumenBackground({ peak = 150 }: LumenBackgroundProps) {
  const curveHeight = `${Math.round((peak + 70) / 8.44)}%` as const;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.base} />
      <LinearGradient
        colors={[lumen.bgSurface, lumen.bgDark, 'transparent']}
        locations={[0, 0.55, 1]}
        style={[styles.upper, { height: curveHeight }]}
      />
      <LinearGradient
        colors={['rgba(234,243,228,0.06)', 'transparent']}
        start={{ x: 0.18, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lumen.bgDark,
  },
  upper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
