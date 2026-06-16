// Design: kale-mobile-design — reset flow (KaleLumen.jsx + Auth.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
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
  mapFirebaseAuthError,
  requestPasswordResetEmail,
} from '../../services/auth/passwordReset';
import { lumen, sora, typography } from '../../theme';
import { headlineTextStyle } from '../../theme/textMetrics';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

function isValidEmail(value: string) {
  const trimmed = value.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
}

export function ResetPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (busy) return;
    setError(null);

    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to your .env file.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setBusy(true);
    try {
      await requestPasswordResetEmail(email);
      setSent(true);
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
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
        </Pressable>

        <LumenAuthScrollView
          contentContainerStyle={styles.scrollContent}
          bottomInset={insets.bottom}
        >
          <View style={styles.glyphMark}>
            <LumenGlyph color={lumen.green} height={26} />
          </View>

          <Text style={styles.headline}>
            Reset your <Text style={styles.headlineAccent}>password</Text>.
          </Text>
          <Text style={styles.subhead}>
            {sent
              ? 'Check your inbox for a link to set a new password. The link opens in Kale.'
              : "Enter the email on your Kale policy. We'll send a reset link."}
          </Text>

          {sent ? (
            <View style={styles.sentBox}>
              <Ionicons name="mail-outline" size={22} color={lumen.lime} />
              <Text style={styles.sentText}>Email sent to {email.trim()}</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <LumenField
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                validate={isValidEmail}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
          )}

          <LumenButton
            style={styles.submit}
            onPress={sent ? () => navigation.navigate('SignIn') : handleSend}
          >
            {busy ? 'Sending…' : sent ? 'Back to log in' : 'Send reset link'}
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
    gap: 12,
  },
  error: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.coral,
  },
  sentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#CCFA7D14',
    borderWidth: 1,
    borderColor: '#CCFA7D38',
  },
  sentText: {
    ...sora('semibold'),
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: lumen.fg,
  },
  submit: {
    marginTop: 24,
  },
  loader: {
    marginTop: 16,
  },
});
