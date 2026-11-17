// Design: Lumen for IP — 25 · Request a pause (screens/LumenIP.jsx KaleIPPause)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { IPFlowShell } from '../../components/ip/IPFlowShell';
import { IPKicker } from '../../components/ip/IPKicker';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import { LumenDateField } from '../../components/lumen/LumenDateField';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useIncomeProtection } from '../../hooks/useIncomeProtection';
import type { PolicyStackParamList } from '../../navigation/PolicyStackNavigator';
import { PAUSE_REASONS, submitPauseRequest, type PauseReason } from '../../services/ip/pauseRequests';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<PolicyStackParamList, 'Pause'>;

const MAX_PAUSE_MONTHS = 12;

export function PauseRequestScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const { record } = useIncomeProtection();
  const [reason, setReason] = useState<PauseReason>('maternity_paternity');
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { minimumDate, maximumDate } = useMemo(() => {
    const min = new Date();
    min.setDate(min.getDate() + 1);
    const max = new Date();
    max.setMonth(max.getMonth() + MAX_PAUSE_MONTHS);
    return { minimumDate: min, maximumDate: max };
  }, []);

  const canSend = Boolean(user?.uid) && returnDate != null && !sending;

  const send = async () => {
    if (!user?.uid || !returnDate || sending) return;
    setSending(true);
    setError(null);
    try {
      await submitPauseRequest({
        uid: user.uid,
        reason,
        expectedReturnDate: returnDate,
        prospectId: record?.prospectId ?? null,
        policyId: record?.policyId ?? null,
      });
      setSent(true);
    } catch (err) {
      if (__DEV__) {
        console.warn('[ip] pause request failed', err);
      }
      setError('We couldn’t send your request. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <IPFlowShell
        onBack={() => navigation.goBack()}
        footer={<LumenButton onPress={() => navigation.navigate('Policy')}>Back to my policy</LumenButton>}
      >
        <IPKicker>Pause</IPKicker>
        <Text style={styles.headline}>
          Request <Text style={styles.headlineAccent}>sent</Text>
        </Text>
        <LumenCard style={styles.sentCard}>
          <Text style={styles.sentTitle}>We’ll reply within five working days.</Text>
          <Text style={styles.sentBody}>
            If it’s approved, your level and price freeze from the approval date until{' '}
            {returnDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            , or earlier if you end the pause.
          </Text>
        </LumenCard>
      </IPFlowShell>
    );
  }

  return (
    <IPFlowShell
      onBack={() => navigation.goBack()}
      footer={
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.sendWrap}>
            <LumenButton onPress={() => void send()} style={!canSend ? styles.sendDisabled : undefined}>
              {sending ? 'Sending…' : 'Send request'}
            </LumenButton>
            {sending ? (
              <View style={styles.sendSpinner} pointerEvents="none">
                <ActivityIndicator color={lumen.bgDark} />
              </View>
            ) : null}
          </View>
          <Text style={styles.footerNote}>We’ll reply within five working days.</Text>
        </>
      }
    >
      <IPKicker>Pause</IPKicker>
      <Text style={styles.headline}>
        Request a <Text style={styles.headlineAccent}>pause</Text>
      </Text>
      <Text style={styles.subhead}>
        Freeze your level and price for up to 12 months. No medical evidence needed.
      </Text>

      <View style={styles.options}>
        {PAUSE_REASONS.map((option) => {
          const on = option.value === reason;
          return (
            <Pressable
              key={option.value}
              onPress={() => setReason(option.value)}
              style={[styles.option, on && styles.optionOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <View style={[styles.radio, on && styles.radioOn]}>
                {on ? <View style={styles.radioDot} /> : null}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <LumenDateField
        label="Expected return date"
        value={returnDate}
        onChange={setReturnDate}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        style={styles.dateField}
      />
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
  options: {
    marginTop: 22,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.055)',
  },
  optionOn: {
    borderColor: lumen.lime,
    backgroundColor: 'rgba(204,250,125,0.10)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: lumen.fgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: lumen.lime,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: lumen.lime,
  },
  optionLabel: {
    ...sora('bold'),
    flex: 1,
    fontSize: 15.5,
    lineHeight: 21,
    color: lumen.fg,
  },
  dateField: {
    marginTop: 18,
  },
  sendWrap: {
    width: '100%',
  },
  sendDisabled: {
    opacity: 0.55,
  },
  sendSpinner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 24,
  },
  footerNote: {
    ...sora('semibold'),
    fontSize: 12.5,
    lineHeight: 17,
    color: lumen.fgMuted,
    textAlign: 'center',
  },
  error: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 18,
    color: lumen.coral,
    textAlign: 'center',
  },
  sentCard: {
    marginTop: 22,
  },
  sentTitle: {
    ...sora('extrabold'),
    fontSize: 16,
    lineHeight: 22,
    color: lumen.fg,
  },
  sentBody: {
    ...sora('semibold'),
    fontSize: 13.5,
    lineHeight: 20,
    color: lumen.fgMuted,
    marginTop: 6,
  },
});
