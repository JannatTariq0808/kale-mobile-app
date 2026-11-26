import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { lumen, sora, typography } from '../../theme';
import type { HealthFieldsInput, MissingHealthField } from '../../services/user/fetchHealthProfile';
import { LumenDateField } from './LumenDateField';
import { LumenField } from './LumenField';

type HealthDetailsModalProps = {
  visible: boolean;
  missing: MissingHealthField[];
  saving: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onSave: (input: HealthFieldsInput) => void;
};

const MIN_WEIGHT_KG = 30;
const MAX_WEIGHT_KG = 250;

function parseWeight(value: string): number | null {
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) && n >= MIN_WEIGHT_KG && n <= MAX_WEIGHT_KG ? n : null;
}

function yearsAgo(years: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d;
}

/**
 * Asks for what the cardio assessment needs (weight, gender, date of birth) before
 * a tracker is connected, so a missing field never falls back to Level 1.
 */
export function HealthDetailsModal({
  visible,
  missing,
  saving,
  errorMessage,
  onCancel,
  onSave,
}: HealthDetailsModalProps) {
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | null>(null);
  const [dob, setDob] = useState<Date | null>(null);

  useEffect(() => {
    if (!visible) {
      setWeight('');
      setGender(null);
      setDob(null);
    }
  }, [visible]);

  const needsWeight = missing.includes('weight');
  const needsGender = missing.includes('gender');
  const needsDob = missing.includes('dateOfBirth');
  const weightKg = parseWeight(weight);
  const ready =
    (!needsWeight || weightKg != null) && (!needsGender || gender != null) && (!needsDob || dob != null);

  const save = () => {
    if (!ready || saving) return;
    onSave({
      ...(needsWeight && weightKg != null ? { weightKg } : {}),
      ...(needsGender && gender ? { gender } : {}),
      ...(needsDob && dob ? { dateOfBirth: dob } : {}),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={saving ? undefined : onCancel}>
          <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.title}>A few details first</Text>
            <Text style={styles.body}>
              We use these with your activities to work out your cardio level accurately.
            </Text>

            {needsWeight ? (
              <LumenField
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g. 70"
                keyboardType="decimal-pad"
                validate={(value) => parseWeight(value) != null}
                returnKeyType="done"
                style={styles.field}
              />
            ) : null}

            {needsGender ? (
              <View style={styles.field}>
                <Text style={styles.label}>Sex</Text>
                <View style={styles.pills}>
                  {(['Female', 'Male'] as const).map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setGender(option)}
                      style={[styles.pill, gender === option && styles.pillActive]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: gender === option }}
                    >
                      <Text style={[styles.pillLabel, gender === option && styles.pillLabelActive]}>
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {needsDob ? (
              <LumenDateField
                label="Date of birth"
                value={dob}
                onChange={setDob}
                minimumDate={yearsAgo(100)}
                maximumDate={yearsAgo(18)}
                style={styles.field}
              />
            ) : null}

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <Pressable
              style={[styles.saveBtn, (!ready || saving) && styles.disabled]}
              onPress={save}
              disabled={!ready || saving}
              accessibilityRole="button"
              accessibilityLabel="Save and connect"
            >
              {saving ? (
                <ActivityIndicator color={lumen.bgDeep} />
              ) : (
                <Text style={styles.saveLabel}>Save and connect</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={onCancel}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: lumen.bgSurface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  title: {
    ...sora('extrabold'),
    fontSize: typography.headline,
    color: lumen.fg,
    marginBottom: 8,
  },
  body: {
    ...sora('regular'),
    fontSize: typography.small,
    color: lumen.fgMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    ...sora('semibold'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
    marginBottom: 8,
  },
  pills: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  pillActive: {
    borderColor: lumen.lime,
    backgroundColor: 'rgba(204,250,125,0.12)',
  },
  pillLabel: {
    ...sora('semibold'),
    fontSize: typography.small,
    color: lumen.fg,
  },
  pillLabelActive: {
    color: lumen.lime,
  },
  error: {
    ...sora('regular'),
    fontSize: typography.caption,
    color: lumen.coral,
    marginBottom: 10,
  },
  saveBtn: {
    marginTop: 4,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: lumen.mint,
  },
  saveLabel: {
    ...sora('bold'),
    fontSize: typography.small,
    color: lumen.bgDeep,
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelLabel: {
    ...sora('semibold'),
    fontSize: typography.small,
    color: lumen.fgMuted,
  },
  disabled: {
    opacity: 0.5,
  },
});
