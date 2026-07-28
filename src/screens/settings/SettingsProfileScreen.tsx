import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type TextInput,
  View,
} from 'react-native';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenField } from '../../components/lumen/LumenField';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import { ProfileAvatar } from '../../components/lumen/ProfileAvatar';
import { useAuthSession } from '../../hooks/useAuthSession';
import { refreshSettingsData, useSettingsData } from '../../hooks/useSettingsData';
import type { SettingsStackParamList } from '../../navigation/SettingsStackNavigator';
import { updateUserProfile } from '../../services/user/updateUserProfile';
import { pickProfileImage } from '../../utils/pickProfileImage';
import type { WeightUnit } from '../../utils/weightValidation';
import { formatWeightKg, isValidWeight, parsePositiveNumber } from '../../utils/weightValidation';
import { lumen, sora, typography } from '../../theme';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Profile'>;

export function SettingsProfileScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const settings = useSettingsData();
  const weightRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings.loading) return;
    setName(settings.displayName === 'Member' ? '' : settings.displayName);
    setWeight(formatWeightKg(settings.weightKg, weightUnit));
  }, [settings.displayName, settings.loading, settings.weightKg, weightUnit]);

  const previewPhotoUrl = removePhoto ? null : localPhotoUri ?? settings.photoUrl;

  const handlePickPhoto = async () => {
    const picked = await pickProfileImage();
    if (!picked) return;
    setLocalPhotoUri(picked.uri);
    setRemovePhoto(false);
    if (error) setError(null);
  };

  const handleRemovePhoto = () => {
    setLocalPhotoUri(null);
    setRemovePhoto(true);
    if (error) setError(null);
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Enter your name.');
      return;
    }

    if (!isValidWeight(weight, weightUnit)) {
      setError(
        weightUnit === 'kg'
          ? 'Enter a weight between 30 and 300 kg.'
          : 'Enter a weight between 66 and 660 lbs.',
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateUserProfile(user.uid, {
        name: trimmedName,
        weight: parsePositiveNumber(weight),
        weightUnit,
        localPhotoUri,
        removePhoto,
      });
      await refreshSettingsData(user.uid);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  const showRemovePhoto =
    !removePhoto && (Boolean(localPhotoUri) || Boolean(settings.photoUrl));

  return (
    <View style={styles.screen}>
      <LumenHeader />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backRow}
            accessibilityRole="button"
            accessibilityLabel="Back to Settings"
          >
            <Ionicons name="chevron-back" size={16} color={lumen.fgMuted} />
            <Text style={styles.backText}>Settings</Text>
          </Pressable>

          <Text style={styles.title}>Your profile</Text>
          <Text style={styles.subcopy}>
            Update your photo, name, and weight used across your assessments.
          </Text>

          <View style={styles.avatarSection}>
            <ProfileAvatar
              name={name || settings.displayName}
              photoUrl={previewPhotoUrl}
              size={88}
              onPress={() => void handlePickPhoto()}
              showEditBadge
            />
            <Pressable
              onPress={() => void handlePickPhoto()}
              style={styles.changePhotoButton}
              accessibilityRole="button"
            >
              <Text style={styles.changePhotoText}>Change photo</Text>
            </Pressable>
            {showRemovePhoto ? (
              <Pressable onPress={handleRemovePhoto} accessibilityRole="button">
                <Text style={styles.removePhotoText}>Remove photo</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.form}>
            <LumenField
              label="Name"
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (error) setError(null);
              }}
              placeholder="Your name"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => weightRef.current?.focus()}
            />

            <View style={styles.weightSection}>
              <LumenField
                label="Weight"
                ref={weightRef}
                value={weight}
                onChangeText={(value) => {
                  setWeight(value);
                  if (error) setError(null);
                }}
                placeholder={weightUnit === 'kg' ? '72' : '160'}
                keyboardType="decimal-pad"
                validate={(value) => isValidWeight(value, weightUnit)}
              />
              <View style={styles.unitRow}>
                {(['kg', 'lbs'] as const).map((unit) => {
                  const selected = weightUnit === unit;
                  return (
                    <Pressable
                      key={unit}
                      onPress={() => {
                        setWeightUnit(unit);
                        if (settings.weightKg) {
                          setWeight(formatWeightKg(settings.weightKg, unit));
                        }
                        if (error) setError(null);
                      }}
                      style={[styles.unitPill, selected && styles.unitPillActive]}
                    >
                      <Text style={[styles.unitLabel, selected && styles.unitLabelActive]}>{unit}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <LumenButton
            onPress={
              saving || settings.loading
                ? undefined
                : () => {
                    void handleSave();
                  }
            }
            style={[
              styles.saveButton,
              saving || settings.loading ? styles.saveDisabled : undefined,
            ]}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </LumenButton>

          {settings.loading ? (
            <ActivityIndicator color={lumen.mint} style={styles.loader} />
          ) : null}
        </ScreenScroll>
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingTop: 8,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingVertical: 4,
  },
  backText: {
    ...sora('semibold'),
    fontSize: typography.small,
    color: lumen.fgMuted,
  },
  title: {
    ...sora('extrabold'),
    fontSize: 28,
    color: lumen.fg,
    letterSpacing: -0.5,
  },
  subcopy: {
    ...sora('regular'),
    fontSize: typography.small,
    color: lumen.fgMuted,
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  changePhotoButton: {
    paddingVertical: 4,
  },
  changePhotoText: {
    ...sora('semibold'),
    fontSize: typography.small,
    color: lumen.mint,
  },
  removePhotoText: {
    ...sora('semibold'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
  },
  form: {
    gap: 18,
  },
  weightSection: {
    gap: 12,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 14,
  },
  unitPill: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  unitPillActive: {
    backgroundColor: lumen.lime,
    borderColor: lumen.lime,
  },
  unitLabel: {
    ...sora('bold'),
    fontSize: typography.small,
    color: lumen.fgMuted,
    textTransform: 'uppercase',
  },
  unitLabelActive: {
    color: lumen.bgDark,
  },
  error: {
    ...sora('semibold'),
    color: lumen.coral,
    fontSize: typography.small,
    marginBottom: 12,
  },
  loader: {
    marginTop: 16,
  },
  saveButton: {
    marginTop: 22,
  },
  saveDisabled: {
    opacity: 0.55,
  },
});
