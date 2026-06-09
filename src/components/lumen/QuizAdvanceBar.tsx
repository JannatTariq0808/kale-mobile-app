import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { lumen } from '../../theme';

const ADVANCE_MS = 2000;

type QuizAdvanceBarProps = {
  /** Green when correct, coral when wrong — matches lum-07 feedback loader */
  tone: 'correct' | 'wrong';
  onComplete: () => void;
};

export function QuizAdvanceBar({ tone, onComplete }: QuizAdvanceBarProps) {
  const progress = useSharedValue(1);
  const fillColor = tone === 'correct' ? lumen.lime : lumen.coral;

  useEffect(() => {
    progress.value = 1;
    progress.value = withTiming(0, {
      duration: ADVANCE_MS,
      easing: Easing.linear,
    });
    const timer = setTimeout(onComplete, ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [onComplete, progress, tone]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: fillColor }, fillStyle]} />
    </View>
  );
}

export const QUIZ_ADVANCE_MS = ADVANCE_MS;

const styles = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(234,243,228,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
