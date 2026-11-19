// Body shape consent (spec: one-time opt-in, off by default, before the first
// strength test after release). Research data: never shown to members.

import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LumenButton } from '../lumen/LumenButton';
import { BODY_SHAPE_CONSENT_TEXT } from '../../services/bodyshape/settings';
import { lumen, sora, typography } from '../../theme';

type Props = {
  visible: boolean;
  /** Save the answer; the modal closes when this resolves. */
  onAnswer: (consent: boolean) => Promise<void>;
};

export function BodyShapeConsentModal({ visible, onAnswer }: Props) {
  const [saving, setSaving] = useState<boolean | null>(null);

  const answer = async (consent: boolean) => {
    if (saving != null) return;
    setSaving(consent);
    try {
      await onAnswer(consent);
    } finally {
      setSaving(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => void answer(false)}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Help improve your fitness score</Text>
          <Text style={styles.body}>{BODY_SHAPE_CONSENT_TEXT}</Text>
          <Text style={styles.small}>
            The measurements are only used to improve how Kale estimates fitness. They are not
            shown in the app and don&apos;t affect your level or price.
          </Text>
          <View style={styles.actions}>
            <LumenButton onPress={() => void answer(true)}>
              {saving === true ? 'Saving…' : 'Yes, measure my body shape'}
            </LumenButton>
            <Pressable
              onPress={() => void answer(false)}
              accessibilityRole="button"
              style={styles.noThanks}
              hitSlop={8}
            >
              {saving === false ? (
                <ActivityIndicator color={lumen.fgMuted} />
              ) : (
                <Text style={styles.noThanksText}>No thanks</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
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
  },
  small: {
    ...sora('regular'),
    fontSize: 12.5,
    color: lumen.fgMuted,
    lineHeight: 18,
    marginTop: 10,
  },
  actions: {
    marginTop: 18,
    gap: 10,
    alignItems: 'stretch',
  },
  noThanks: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  noThanksText: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
