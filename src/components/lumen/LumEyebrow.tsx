import { StyleSheet, Text, View } from 'react-native';
import { StepGlowDot } from './StepGlowDot';
import { lumen, lumenPillar, sora } from '../../theme';

type PillarKey = keyof typeof lumenPillar;

type LumEyebrowProps = {
  pillar?: PillarKey;
  label: string;
  step?: string;
};

/** KaleLumenOnboarding.jsx LumEyebrow — 7px pillar dot + glow */
export function LumEyebrow({ pillar = 'cardio', label, step }: LumEyebrowProps) {
  const color = lumenPillar[pillar];

  return (
    <View style={styles.row}>
      <StepGlowDot color={color} size={7} />
      <Text style={[styles.label, { color }]}>
        {label}
        {step ? <Text style={styles.step}> · {step}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  label: {
    ...sora('bold'),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  step: {
    color: lumen.fgMuted,
  },
});
