// Design: Lumen for IP — Goals · add a goal (screens/LumenIP.jsx IPGoalCreator)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { IPFlowShell } from '../../components/ip/IPFlowShell';
import { IPKicker } from '../../components/ip/IPKicker';
import { LumenButton } from '../../components/lumen/LumenButton';
import { useAppNow } from '../../hooks/useAppNow';
import { useAuthSession } from '../../hooks/useAuthSession';
import { refreshGoals, useGoals } from '../../hooks/useGoals';
import { useHomeLongevityData } from '../../hooks/useHomeLongevityData';
import type { GoalsStackParamList } from '../../navigation/GoalsStackNavigator';
import { saveQuarterGoal } from '../../services/ip/goals';
import { lumen, sora } from '../../theme';
import type { QuarterGoalType } from '../../types/goals';
import { buildPolicyYear } from '../../utils/ipPolicy';
import { GOAL_TITLES, goalTargetLabel, MAX_LEVEL } from './goalCopy';

type Props = NativeStackScreenProps<GoalsStackParamList, 'AddGoal'>;

const HOW_MAX_LENGTH = 280;

export function AddGoalScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const { goals } = useGoals();
  const { level } = useHomeLongevityData();
  const now = useAppNow(false);
  const nextWindow = useMemo(() => buildPolicyYear(now, null)[1]?.window ?? null, [now]);

  const atTop = level >= MAX_LEVEL;
  const options = useMemo<QuarterGoalType[]>(() => (atTop ? ['hold'] : ['up', 'hold']), [atTop]);
  const existing = goals.quarterGoal;

  const [type, setType] = useState<QuarterGoalType>(
    existing && options.includes(existing.type) ? existing.type : options[0],
  );
  const [how, setHow] = useState(existing?.how ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Goals can arrive after the first render; fill the form once, unless the user already started.
  const seeded = useRef(existing != null);
  const touched = useRef(false);
  useEffect(() => {
    if (seeded.current || !existing || touched.current) return;
    seeded.current = true;
    if (options.includes(existing.type)) setType(existing.type);
    setHow(existing.how);
  }, [existing, options]);

  const save = async () => {
    if (!user?.uid || saving) return;
    setSaving(true);
    setError(null);
    try {
      await saveQuarterGoal(user.uid, { type, how, levelAtSet: level, window: nextWindow });
      await refreshGoals(user.uid);
      navigation.goBack();
    } catch (err) {
      if (__DEV__) console.warn('[goals] save failed', err);
      setError('We couldn’t save your goal. Check your connection and try again.');
      setSaving(false);
    }
  };

  return (
    <IPFlowShell
      onBack={() => navigation.goBack()}
      footer={
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.saveWrap}>
            <LumenButton onPress={() => void save()} style={saving ? styles.saving : undefined}>
              {saving ? 'Saving…' : 'Save goal'}
            </LumenButton>
            {saving ? (
              <View style={styles.spinner} pointerEvents="none">
                <ActivityIndicator color={lumen.bgDark} />
              </View>
            ) : null}
          </View>
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </>
      }
    >
      <IPKicker>Goals</IPKicker>
      <Text style={styles.headline}>
        {existing ? 'Change your ' : 'Add a '}
        <Text style={styles.headlineAccent}>goal</Text>
      </Text>
      <Text style={styles.subhead}>
        {nextWindow ? `For your ${nextWindow} assessment.` : 'For your next assessment.'}
      </Text>

      <View style={styles.options}>
        {options.map((option) => {
          const on = option === type;
          return (
            <Pressable
              key={option}
              onPress={() => {
                touched.current = true;
                setType(option);
              }}
              style={[styles.option, on && styles.optionOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <View style={[styles.radio, on && styles.radioOn]}>
                {on ? <View style={styles.radioDot} /> : null}
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{GOAL_TITLES[option]}</Text>
                <Text style={styles.optionSub}>{goalTargetLabel(option, level)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>How will you do it? (optional)</Text>
      <TextInput
        value={how}
        onChangeText={(text) => {
          touched.current = true;
          setHow(text);
        }}
        placeholder="e.g. parkrun every Saturday and two plank sessions a week"
        placeholderTextColor={lumen.fgFaint}
        multiline
        maxLength={HOW_MAX_LENGTH}
        style={styles.input}
        textAlignVertical="top"
        accessibilityLabel="How will you do it"
      />
      <Text style={styles.note}>Your goal doesn’t change your price.</Text>
    </IPFlowShell>
  );
}

const styles = StyleSheet.create({
  headline: {
    ...sora('extrabold'),
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -1.1,
    color: lumen.fg,
    marginTop: 12,
  },
  headlineAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  subhead: {
    ...sora('semibold'),
    fontSize: 15,
    lineHeight: 22,
    color: lumen.fgMuted,
    marginTop: 10,
  },
  options: {
    marginTop: 18,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
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
    marginTop: 1,
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
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...sora('extrabold'),
    fontSize: 16,
    lineHeight: 21,
    color: lumen.fg,
  },
  optionSub: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 19,
    color: lumen.fgMuted,
    marginTop: 4,
  },
  fieldLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    ...sora('semibold'),
    minHeight: 96,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    color: lumen.fg,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 15,
    lineHeight: 21,
  },
  note: {
    ...sora('semibold'),
    fontSize: 12.5,
    lineHeight: 18,
    color: lumen.fgMuted,
    marginTop: 10,
  },
  error: {
    ...sora('semibold'),
    fontSize: 13,
    lineHeight: 18,
    color: lumen.coral,
    textAlign: 'center',
  },
  saveWrap: {
    alignSelf: 'stretch',
  },
  saving: {
    opacity: 0.7,
  },
  spinner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 22,
  },
  cancel: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 19,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
