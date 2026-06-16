// Design: kale-mobile-design — AuthPassword + in-app Firebase reset handler

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isFirebaseConfigured } from '../../config/firebase';
import { LumenAuthScrollView } from '../../components/lumen/LumenAuthScrollView';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenField } from '../../components/lumen/LumenField';
import { LumenGlyph } from '../../components/lumen/LumenGlyph';
import type { RootStackParamList } from '../../navigation/types';
import {
  completePasswordReset,
  mapFirebaseAuthError,
} from '../../services/auth/passwordReset';
import { lumen, sora, typography } from '../../theme';
import { headlineTextStyle } from '../../theme/textMetrics';

type Props = NativeStackScreenProps<RootStackParamList, 'NewPassword'>;

function isValidPassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function NewPasswordScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const confirmRef = useRef<TextInput>(null);
  const { oobCode } = route.params;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (busy) return;
    setError(null);

    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to your .env file.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Use at least 8 characters with a letter and a number.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      await completePasswordReset(oobCode, password);
      navigation.replace('SignIn');
    } catch (err) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <LumenAuthScrollView
          contentContainerStyle={styles.scrollContent}
          bottomInset={insets.bottom}
        >
          <View style={styles.glyphMark}>
            <LumenGlyph color={lumen.green} height={26} />
          </View>

          <Text style={styles.headline}>
            Create a new <Text style={styles.headlineAccent}>password</Text>.
          </Text>
          <Text style={styles.subhead}>
            Choose a secure password for your Kale account.
          </Text>

          <View style={styles.form}>
            <LumenField
              label="New password"
              value={password}
              onChangeText={setPassword}
              canReveal
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmRef.current?.focus()}
              validate={isValidPassword}
            />
            <LumenField
              ref={confirmRef}
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              canReveal
              returnKeyType="done"
              validate={(value) => value.length > 0 && value === password}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <LumenButton style={styles.submit} onPress={handleSave}>
            {busy ? 'Saving…' : 'Save password'}
          </LumenButton>

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
  content: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 4,
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
    ...headlineTextStyle(typography.hero, lumen.fg),
    letterSpacing: -1.3,
    overflow: 'visible',
  },
  headlineAccent: {
    color: lumen.lime,
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
  error: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.coral,
  },
  submit: {
    marginTop: 24,
  },
  loader: {
    marginTop: 16,
  },
});
