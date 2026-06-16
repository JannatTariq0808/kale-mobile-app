// Design: kale-mobile-design — AuthSignUp + AuthAboutYou + AuthPassword (screens/Auth.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextInput,
} from 'react-native';
import type { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isFirebaseConfigured } from '../../config/firebase';
import { LumenAuthScrollView } from '../../components/lumen/LumenAuthScrollView';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenField } from '../../components/lumen/LumenField';
import { LumenGlyph } from '../../components/lumen/LumenGlyph';
import { LumenSelect } from '../../components/lumen/LumenSelect';
import type { RootStackParamList } from '../../navigation/types';
import { mapFirebaseAuthError } from '../../services/auth/passwordReset';
import { signUpWithProfile, type UserGender, type WeightUnit } from '../../services/auth/signUp';
import { lumen, sora, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const GENDER_OPTIONS = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
] as const;

const TOTAL_STEPS = 3;

function isValidEmail(value: string) {
  const trimmed = value.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
}

function isValidPassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

function isValidName(value: string) {
  return value.trim().length >= 2;
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

function isValidDob(day: string, month: string, year: string) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return false;
  if (d < 1 || d > 31 || m < 1 || m > 12) return false;
  const currentYear = new Date().getFullYear();
  if (y < 1900 || y > currentYear) return false;

  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return false;

  const ageCutoff = new Date(currentYear - 18, new Date().getMonth(), new Date().getDate());
  return date <= ageCutoff;
}

function dobToDate(day: string, month: string, year: string): Date | null {
  if (!isValidDob(day, month, year)) return null;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function isValidWeight(value: string, unit: WeightUnit) {
  const amount = parsePositiveNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return false;
  if (unit === 'kg') return amount >= 30 && amount <= 300;
  return amount >= 66 && amount <= 660;
}

function SignUpStepProgress({ step }: { step: number }) {
  return (
    <View style={progressStyles.row}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View
          key={index}
          style={[
            progressStyles.segment,
            index < step ? progressStyles.segmentActive : progressStyles.segmentIdle,
          ]}
        />
      ))}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 26,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: lumen.mint,
  },
  segmentIdle: {
    backgroundColor: lumen.track,
  },
});

export function SignUpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const nameRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<UserGender | null>(null);
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const revealValidationErrors = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      scrollRef.current?.scrollToEnd(true);
    }, 120);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }
    navigation.goBack();
  };

  const validateStep0 = () => {
    let valid = true;
    setEmailError(null);
    setNameError(null);

    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }
    if (!isValidName(name)) {
      setNameError('Enter your name.');
      valid = false;
    }
    if (!valid) revealValidationErrors();
    return valid;
  };

  const validateStep1 = () => {
    let valid = true;
    setGenderError(null);
    setDobError(null);
    setWeightError(null);

    if (!gender) {
      setGenderError('Select your gender.');
      valid = false;
    }
    if (!isValidDob(dobDay, dobMonth, dobYear)) {
      setDobError('Enter a valid date of birth (18+).');
      valid = false;
    }
    if (!isValidWeight(weight, weightUnit)) {
      setWeightError(
        weightUnit === 'kg'
          ? 'Enter a weight between 30 and 300 kg.'
          : 'Enter a weight between 66 and 660 lbs.',
      );
      valid = false;
    }
    if (!valid) revealValidationErrors();
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    setPasswordError(null);
    setConfirmError(null);
    setAuthError(null);

    if (!isValidPassword(password)) {
      setPasswordError('Use at least 8 characters with a letter and a number.');
      valid = false;
    }
    if (!confirm.trim()) {
      setConfirmError('Confirm your password.');
      valid = false;
    } else if (password !== confirm) {
      setConfirmError('Passwords do not match.');
      valid = false;
    }
    if (!valid) revealValidationErrors();
    return valid;
  };

  const handleNext = async () => {
    if (busy) return;

    if (step === 0) {
      if (!validateStep0()) return;
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    if (!validateStep2()) return;

    if (!isFirebaseConfigured()) {
      setAuthError(
        'Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to .env.local, then run npx expo start --clear.',
      );
      return;
    }

    const dateOfBirth = dobToDate(dobDay, dobMonth, dobYear);
    if (!gender || !dateOfBirth) return;

    setBusy(true);
    try {
      await signUpWithProfile({
        email,
        password,
        name,
        gender,
        dateOfBirth,
        weight: parsePositiveNumber(weight),
        weightUnit,
      });
      // Post-sign-up routing is handled by useInitialAuthRoute + useAuthNavigationSync.
    } catch (err) {
      Keyboard.dismiss();
      revealValidationErrors();
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const stepHeadline =
    step === 0 ? (
      <>
        Sign <Text style={styles.headlineAccent}>up</Text>.
      </>
    ) : step === 1 ? (
      <>
        Tell us about <Text style={styles.headlineAccent}>you</Text>.
      </>
    ) : (
      <>
        Create <Text style={styles.headlineAccent}>password</Text>.
      </>
    );

  const stepSubhead =
    step === 0
      ? 'Sign up and sync your data to find out your Longevity Level.'
      : step === 1
        ? 'We use this to personalise your experience and your Longevity Level.'
        : 'Create a secure password to protect your account and keep your data safe.';

  const primaryLabel = step < 2 ? 'Next' : busy ? 'Creating account…' : 'Create account';

  return (
    <View style={styles.screen}>
      <View style={[styles.content, styles.flex, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
        </Pressable>

          <LumenAuthScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            bottomInset={insets.bottom}
          >
          <SignUpStepProgress step={step + 1} />

          {step === 0 ? (
            <View style={styles.glyphMark}>
              <LumenGlyph color={lumen.green} height={26} />
            </View>
          ) : null}

          <Text style={styles.headline}>{stepHeadline}</Text>
          <Text style={styles.subhead}>{stepSubhead}</Text>

          {step === 0 ? (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <LumenField
                  label="Email"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (emailError) setEmailError(null);
                  }}
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => nameRef.current?.focus()}
                  validate={isValidEmail}
                />
                {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
              </View>
              <View style={styles.fieldGroup}>
                <LumenField
                  ref={nameRef}
                  label="Name"
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (nameError) setNameError(null);
                  }}
                  autoCapitalize="words"
                  returnKeyType="done"
                  validate={isValidName}
                />
                {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <LumenSelect
                  label="Gender"
                  value={gender}
                  options={[...GENDER_OPTIONS]}
                  placeholder="Select here"
                  onChange={(value) => {
                    setGender(value as UserGender);
                    if (genderError) setGenderError(null);
                  }}
                />
                {genderError ? <Text style={styles.fieldError}>{genderError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.sectionLabel}>Date of birth</Text>
                <View style={styles.dobRow}>
                  <View style={styles.dobField}>
                    <LumenField
                      label="Day"
                      value={dobDay}
                      onChangeText={(value) => {
                        setDobDay(value.replace(/\D/g, '').slice(0, 2));
                        if (dobError) setDobError(null);
                      }}
                      keyboardType="number-pad"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => monthRef.current?.focus()}
                      validate={(value) => value.length > 0}
                    />
                  </View>
                  <View style={styles.dobField}>
                    <LumenField
                      ref={monthRef}
                      label="Month"
                      value={dobMonth}
                      onChangeText={(value) => {
                        setDobMonth(value.replace(/\D/g, '').slice(0, 2));
                        if (dobError) setDobError(null);
                      }}
                      keyboardType="number-pad"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => yearRef.current?.focus()}
                      validate={(value) => value.length > 0}
                    />
                  </View>
                  <View style={styles.dobFieldWide}>
                    <LumenField
                      ref={yearRef}
                      label="Year"
                      value={dobYear}
                      onChangeText={(value) => {
                        setDobYear(value.replace(/\D/g, '').slice(0, 4));
                        if (dobError) setDobError(null);
                      }}
                      keyboardType="number-pad"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => weightRef.current?.focus()}
                      validate={(value) => value.length === 4}
                    />
                  </View>
                </View>
                {dobError ? <Text style={styles.fieldError}>{dobError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.weightRow}>
                  <View style={styles.weightInput}>
                    <LumenField
                      ref={weightRef}
                      label="Weight"
                      placeholder="Enter weight"
                      value={weight}
                      onChangeText={(value) => {
                        setWeight(value.replace(/[^\d.]/g, ''));
                        if (weightError) setWeightError(null);
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      validate={(value) => isValidWeight(value, weightUnit)}
                    />
                  </View>
                  <View style={styles.unitToggle}>
                    {(['kg', 'lbs'] as WeightUnit[]).map((unit) => {
                      const selected = weightUnit === unit;
                      return (
                        <Pressable
                          key={unit}
                          onPress={() => {
                            setWeightUnit(unit);
                            if (weightError) setWeightError(null);
                          }}
                          style={[styles.unitOption, selected && styles.unitOptionSelected]}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                        >
                          <Text style={[styles.unitOptionText, selected && styles.unitOptionTextSelected]}>
                            {unit}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                {weightError ? <Text style={styles.fieldError}>{weightError}</Text> : null}
              </View>
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <LumenField
                  ref={passwordRef}
                  label="Create a password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    if (passwordError) setPasswordError(null);
                    if (authError) setAuthError(null);
                    if (confirm.length > 0) {
                      setConfirmError(
                        value === confirm ? null : 'Passwords do not match.',
                      );
                    }
                  }}
                  canReveal
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  validate={isValidPassword}
                />
                {passwordError ? (
                  <Text style={styles.fieldError}>{passwordError}</Text>
                ) : (
                  <Text style={styles.hint}>At least 8 characters with a letter and a number.</Text>
                )}
              </View>
              <View style={styles.fieldGroup}>
                <LumenField
                  ref={confirmRef}
                  label="Confirm password"
                  value={confirm}
                  onChangeText={(value) => {
                    setConfirm(value);
                    if (authError) setAuthError(null);
                    if (!value.trim()) {
                      setConfirmError(null);
                      return;
                    }
                    setConfirmError(
                      value === password ? null : 'Passwords do not match.',
                    );
                  }}
                  canReveal
                  returnKeyType="done"
                  validate={(value) => value.length > 0 && value === password}
                />
                {confirmError ? <Text style={styles.fieldError}>{confirmError}</Text> : null}
                {authError ? <Text style={styles.fieldError}>{authError}</Text> : null}
              </View>
            </View>
          ) : null}

          {step !== 2 && authError ? <Text style={styles.fieldError}>{authError}</Text> : null}

          <LumenButton style={styles.submit} onPress={handleNext}>
            {primaryLabel}
          </LumenButton>

          {step === 0 ? (
            <Pressable
              style={styles.switchLink}
              onPress={() => navigation.navigate('SignIn')}
              accessibilityRole="button"
            >
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.switchAccent}>Log in</Text>
              </Text>
            </Pressable>
          ) : null}

          {busy ? <ActivityIndicator color={lumen.lime} style={styles.loader} /> : null}
          </LumenAuthScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 22,
    marginLeft: -6,
  },
  backIcon: {
    opacity: 0.85,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 6,
  },
  glyphMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EAF3E40F',
    borderWidth: 1,
    borderColor: lumen.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  headline: {
    ...sora('extrabold'),
    fontSize: typography.hero,
    lineHeight: 46,
    letterSpacing: -1.3,
    color: lumen.fg,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  headlineAccent: {
    color: lumen.lime,
    lineHeight: 46,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: lumen.fgMuted,
    maxWidth: 320,
  },
  form: {
    marginTop: 30,
    gap: 18,
  },
  fieldGroup: {
    gap: 6,
  },
  sectionLabel: {
    ...sora('bold'),
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 2,
  },
  dobRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dobField: {
    flex: 1,
  },
  dobFieldWide: {
    flex: 1.2,
  },
  fieldError: {
    ...sora('semibold'),
    fontSize: 12,
    lineHeight: 16,
    color: lumen.coral,
    paddingLeft: 2,
  },
  hint: {
    ...sora('semibold'),
    fontSize: 12,
    lineHeight: 16,
    color: lumen.fgMuted,
    paddingLeft: 2,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  weightInput: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    overflow: 'hidden',
    marginBottom: 0,
  },
  unitOption: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitOptionSelected: {
    backgroundColor: lumen.mint,
  },
  unitOptionText: {
    ...sora('bold'),
    fontSize: 14,
    color: lumen.fgMuted,
    textTransform: 'uppercase',
  },
  unitOptionTextSelected: {
    color: lumen.bgDark,
  },
  submit: {
    marginTop: 22,
  },
  switchLink: {
    alignSelf: 'center',
    marginTop: 18,
    padding: 4,
  },
  switchText: {
    ...sora('semibold'),
    fontSize: 13.5,
    color: lumen.fgMuted,
  },
  switchAccent: {
    ...sora('bold'),
    color: lumen.green,
  },
  loader: {
    marginTop: 16,
  },
});
