import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { lumenPillar, sora } from '../../theme';

type QuizQuestionTimerProps = {
  seconds: number;
  active: boolean;
  questionKey: string;
  onExpire: () => void;
};

export function QuizQuestionTimer({
  seconds,
  active,
  questionKey,
  onExpire,
}: QuizQuestionTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    expiredRef.current = false;
    setRemaining(seconds);
    if (!active) return;

    const timer = setInterval(() => {
      setRemaining((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [active, questionKey, seconds]);

  useEffect(() => {
    if (!active || remaining > 0 || expiredRef.current) return;
    expiredRef.current = true;
    onExpireRef.current();
  }, [active, remaining]);

  if (!active) return null;

  return <Text style={styles.timer}>{remaining}s</Text>;
}

const styles = StyleSheet.create({
  timer: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 1.2,
    color: lumenPillar.knowledge,
  },
});
