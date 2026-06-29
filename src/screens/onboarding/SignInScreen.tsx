// Design: kale-mobile-design — lum-01b KaleSignInLumen (screens/KaleLumen.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { isFirebaseConfigured } from '../../config/firebase';
import { LumenAuthScrollView } from '../../components/lumen/LumenAuthScrollView';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenField } from '../../components/lumen/LumenField';
import { LumenGlyph } from '../../components/lumen/LumenGlyph';
import type { RootStackParamList } from '../../navigation/types';
import { mapFirebaseAuthError, signInWithEmail } from '../../services/auth/passwordReset';
import { getFirebaseAuth, signOut } from '../../services/auth/index';
import {
  fetchUserProfile,
  POLICY_HOLDER_REQUIRED_MESSAGE,
} from '../../services/user/userProfile';
import { lumen, sora, typography } from '../../theme';
import { headlineTextStyle } from '../../theme/textMetrics';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function isValidEmail(value: string) {
  const trimmed = value.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
}

function isValidPassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function SignInScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsiveLayout();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setAuthError(null);
  };

  const handleSignIn = async () => {
    if (busy) return;
    clearErrors();

    if (!isFirebaseConfigured()) {
      navigation.navigate('ConnectTracker');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError('Enter your password.');
      return;
    }

    setBusy(true);
    try {
      const credential = await signInWithEmail(email, password);
      const profile = await fetchUserProfile(credential.user.uid);
      if (!profile.policyHolder) {
        await signOut(getFirebaseAuth());
        Keyboard.dismiss();
        setAuthError(POLICY_HOLDER_REQUIRED_MESSAGE);
        return;
      }
      // Post-login routing is handled by useInitialAuthRoute + useAuthNavigationSync
      // when the authenticated NavigationContainer remounts.
    } catch (err) {
      Keyboard.dismiss();
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.content, styles.flex, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { paddingHorizontal: horizontalPadding }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
        </Pressable>

          <LumenAuthScrollView
            contentContainerStyle={styles.scrollContent}
            bottomInset={0}
          >
            <View style={styles.main}>
              <View style={styles.glyphMark}>
                <LumenGlyph color={lumen.green} height={26} />
              </View>

              <Text style={styles.headline}>
                Welcome <Text style={styles.headlineAccent}>back</Text>.
              </Text>
              <Text style={styles.subhead}>
                Log in with your Kale account to pick up your longevity programme.
              </Text>

              <View style={styles.form}>
                <View style={styles.fieldGroup}>
                  <LumenField
                    label="Email"
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (emailError) setEmailError(null);
                      if (authError) setAuthError(null);
                    }}
                    keyboardType="email-address"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    validate={isValidEmail}
                  />
                  {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
                </View>
                <View style={styles.fieldGroup}>
                  <LumenField
                    ref={passwordRef}
                    label="Password"
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      if (passwordError) setPasswordError(null);
                      if (authError) setAuthError(null);
                    }}
                    canReveal
                    returnKeyType="done"
                    validate={isValidPassword}
                  />
                  {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
                  {authError ? <Text style={styles.authFieldError}>{authError}</Text> : null}
                  <Pressable
                    style={styles.forgotLink}
                    onPress={() => navigation.navigate('ResetPassword')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </Pressable>
                </View>
              </View>

              <LumenButton style={styles.submit} onPress={handleSignIn}>
                {busy ? 'Logging in…' : 'Log in'}
              </LumenButton>

              {busy ? <ActivityIndicator color={lumen.lime} style={styles.busy} /> : null}
            </View>
          </LumenAuthScrollView>

        <Text
          style={[
            styles.footer,
            { paddingHorizontal: horizontalPadding, paddingBottom: insets.bottom + 16 },
          ]}
        >
          Kale is available to policy holders. Your login arrives by email when your policy begins.
        </Text>
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
    marginLeft: -6,
  },
  backIcon: {
    opacity: 0.85,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 6,
  },
  main: {
    flexGrow: 1,
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
    maxWidth: 300,
  },
  form: {
    marginTop: 30,
    gap: 18,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldError: {
    ...sora('semibold'),
    fontSize: 12,
    lineHeight: 16,
    color: lumen.coral,
    paddingLeft: 2,
  },
  authFieldError: {
    ...sora('semibold'),
    fontSize: 12,
    lineHeight: 16,
    color: lumen.coral,
    paddingLeft: 2,
    marginTop: 2,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 4,
    padding: 2,
  },
  forgotText: {
    ...sora('bold'),
    fontSize: 13,
    color: lumen.green,
  },
  submit: {
    marginTop: 22,
  },
  busy: {
    marginTop: 16,
  },
  footer: {
    ...sora('semibold'),
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19.5,
    color: lumen.fgMuted,
  },
});
