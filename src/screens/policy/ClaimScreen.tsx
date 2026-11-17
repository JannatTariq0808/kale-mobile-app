// Design: Lumen for IP — 24 · Make or update a claim (screens/LumenIP.jsx KaleIPClaim)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { IPFlowShell } from '../../components/ip/IPFlowShell';
import { IPKicker } from '../../components/ip/IPKicker';
import { LumenButton } from '../../components/lumen/LumenButton';
import { StepGlowDot } from '../../components/lumen/StepGlowDot';
import { BEST_CLAIMS_URL } from '../../config/incomeProtection';
import type { PolicyStackParamList } from '../../navigation/PolicyStackNavigator';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<PolicyStackParamList, 'Claim'>;

const POINTS = [
  {
    title: 'While you claim',
    body: 'Your level and price are frozen. No assessments and no reminders until your claim ends.',
    color: lumen.green,
  },
  {
    title: 'When it ends',
    body: 'Your first assessment back is optional and can only improve your level.',
    color: lumen.yellow,
  },
  {
    title: 'Your fitness data stays with Kale',
    body: 'We don’t pass your fitness or assessment data to Best’s claims team.',
    color: lumen.coral,
  },
] as const;

export function ClaimScreen({ navigation }: Props) {
  const continueToBest = () => {
    void Linking.openURL(BEST_CLAIMS_URL);
  };

  return (
    <IPFlowShell
      onBack={() => navigation.goBack()}
      footer={<LumenButton onPress={continueToBest}>Continue to Best</LumenButton>}
    >
      <IPKicker>Claims</IPKicker>
      <Text style={styles.headline}>
        Make or update a <Text style={styles.headlineAccent}>claim</Text>
      </Text>
      <Text style={styles.subhead}>
        Claims are handled by Best Insurance. We’ll take you to Best to start or update yours.
      </Text>

      <View style={styles.points}>
        {POINTS.map((point, index) => (
          <View
            key={point.title}
            style={[styles.pointRow, index < POINTS.length - 1 && styles.pointRowBorder]}
          >
            <StepGlowDot color={point.color} size={9} style={styles.pointDot} />
            <View style={styles.pointCopy}>
              <Text style={styles.pointTitle}>{point.title}</Text>
              <Text style={styles.pointBody}>{point.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </IPFlowShell>
  );
}

const styles = StyleSheet.create({
  headline: {
    ...sora('extrabold'),
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1.3,
    color: lumen.fg,
    marginTop: 12,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 10,
    fontSize: 14.5,
    lineHeight: 22,
    color: lumen.fgMuted,
  },
  points: {
    marginTop: 26,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 16,
  },
  pointRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  pointDot: {
    marginTop: 6,
  },
  pointCopy: {
    flex: 1,
    minWidth: 0,
  },
  pointTitle: {
    ...sora('extrabold'),
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.16,
    color: lumen.fg,
  },
  pointBody: {
    ...sora('semibold'),
    fontSize: 13.5,
    lineHeight: 19.5,
    color: lumen.fgMuted,
    marginTop: 4,
  },
});
