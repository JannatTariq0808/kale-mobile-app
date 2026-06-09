// Design: kale-mobile-design — lum-01b KaleSignInLumen (screens/KaleLumen.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenField } from '../../components/lumen/LumenField';
import { LumenGlyph } from '../../components/lumen/LumenGlyph';
import { LumenWelcomeBackground } from '../../components/lumen/LumenWelcomeBackground';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, sora, typography } from '../../theme';

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
  const passwordRef = useRef<TextInput>(null);

  return (
    <View style={styles.screen}>
      <LumenWelcomeBackground />
      <View
        style={[
          styles.content,
          styles.flex,
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

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
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
                <LumenField
                  label="Email"
                  value="alex@pendragon.io"
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  validate={isValidEmail}
                />
                <View>
                  <LumenField
                    ref={passwordRef}
                    label="Password"
                    value="quinoa2024"
                    canReveal
                    returnKeyType="done"
                    validate={isValidPassword}
                  />
                  <Pressable style={styles.forgotLink} accessibilityRole="button">
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </Pressable>
                </View>
              </View>

              <LumenButton style={styles.submit} onPress={() => navigation.replace('CardioAnalysing')}>
                Log in
              </LumenButton>

              <Text style={styles.footer}>
                Kale is available to policy holders. Your login arrives by email when your policy
                begins.
              </Text>
            </View>
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
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
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 6,
  },
  main: {
    flex: 1,
    minHeight: 520,
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
    lineHeight: typography.hero,
    letterSpacing: -1.3,
    color: lumen.fg,
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 2,
  },
  forgotText: {
    ...sora('bold'),
    fontSize: 13,
    color: lumen.green,
  },
  submit: {
    marginTop: 8,
  },
  footer: {
    ...sora('semibold'),
    marginTop: 'auto',
    paddingTop: 28,
    paddingBottom: 10,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19.5,
    color: lumen.fgMuted,
  },
});
