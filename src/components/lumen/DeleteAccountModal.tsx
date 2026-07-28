import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { lumen, sora, typography } from '../../theme';

type DeleteAccountModalProps = {
  visible: boolean;
  requirePassword: boolean;
  deleting: boolean;
  deleted: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onConfirm: (password?: string) => void;
  onDone: () => void;
};

/** Confirm account deletion (App Store 5.1.1(v)) — optional password for recent-login. */
export function DeleteAccountModal({
  visible,
  requirePassword,
  deleting,
  deleted,
  errorMessage,
  onCancel,
  onConfirm,
  onDone,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!visible) setPassword('');
  }, [visible]);

  const handleClose = () => {
    if (deleting) return;
    if (deleted) {
      onDone();
      return;
    }
    setPassword('');
    onCancel();
  };

  const handleConfirm = () => {
    if (deleting || deleted) return;
    if (requirePassword && password.length === 0) return;
    onConfirm(requirePassword ? password : undefined);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          {deleted ? (
            <>
              <Text style={styles.title}>Account deleted</Text>
              <Text style={styles.body}>
                Your Kale account and app data have been removed. You can create a new account any
                time with a valid Kale policy.
              </Text>
              <Pressable
                style={styles.doneBtn}
                onPress={onDone}
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text style={styles.doneLabel}>Done</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>Delete account?</Text>
              <Text style={styles.body}>
                This permanently deletes your Kale account and the personal data we hold for the app.
                This cannot be undone.
              </Text>
              <Text style={styles.bodyMuted}>
                Some records may be retained where required by insurance or legal obligations. If you
                have an active policy, contact support for policy-related questions.
              </Text>

              {requirePassword ? (
                <View style={styles.passwordBlock}>
                  <Text style={styles.passwordLabel}>Confirm with your password</Text>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor={lumen.fgMuted}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!deleting}
                    returnKeyType="done"
                    onSubmitEditing={handleConfirm}
                  />
                </View>
              ) : null}

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <Pressable
                style={[
                  styles.deleteBtn,
                  (deleting || (requirePassword && password.length === 0)) && styles.disabled,
                ]}
                onPress={handleConfirm}
                disabled={deleting || (requirePassword && password.length === 0)}
                accessibilityRole="button"
                accessibilityLabel="Delete account"
              >
                {deleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.deleteLabel}>Delete account</Text>
                )}
              </Pressable>

              <Pressable
                style={[styles.cancelBtn, deleting && styles.disabled]}
                onPress={handleClose}
                disabled={deleting}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    marginBottom: 10,
  },
  body: {
    ...sora('regular'),
    fontSize: typography.small,
    color: lumen.fg,
    lineHeight: 20,
    marginBottom: 8,
  },
  bodyMuted: {
    ...sora('regular'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  passwordBlock: {
    marginBottom: 12,
  },
  passwordLabel: {
    ...sora('semibold'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
    marginBottom: 6,
  },
  passwordInput: {
    ...sora('regular'),
    borderWidth: 1,
    borderColor: lumen.hairline,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: lumen.fg,
    fontSize: typography.small,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  error: {
    ...sora('regular'),
    fontSize: typography.caption,
    color: lumen.coral,
    marginBottom: 10,
  },
  deleteBtn: {
    backgroundColor: lumen.coral,
    borderRadius: 999,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  deleteLabel: {
    ...sora('extrabold'),
    fontSize: typography.small,
    color: '#fff',
  },
  doneBtn: {
    marginTop: 12,
    backgroundColor: lumen.mint,
    borderRadius: 999,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  doneLabel: {
    ...sora('extrabold'),
    fontSize: typography.small,
    color: lumen.bgDeep,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
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
