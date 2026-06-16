// Design: kale-website ConnectIssueView + KaleLumenApp3 activity/sync error states

import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { LumenButton } from './LumenButton';
import { lumen, sora } from '../../theme';

const CONTACT_URL = 'https://www.kale.insure/contact';
const LOOKBACK_PHRASE = 'the last 12 weeks';

export type ConnectIssuePanelProps = {
  headline: string;
  message: string;
  showActivityRequirements?: boolean;
  onTryAgain: () => void;
  onContinueLevel1: () => void;
};

export function ConnectIssuePanel({
  headline,
  message,
  showActivityRequirements = false,
  onTryAgain,
  onContinueLevel1,
}: ConnectIssuePanelProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing} accessibilityElementsHidden>
        <Ionicons name="alert-circle-outline" size={36} color={lumen.coral} />
      </View>

      <Text style={styles.eyebrow}>Connection issue</Text>
      <Text style={styles.headline}>{headline}</Text>

      <View style={styles.body}>
        <Text style={styles.message}>{message}</Text>

        {showActivityRequirements ? (
          <View style={styles.requirements}>
            <Text style={styles.requirementsLead}>A valid activity must be:</Text>
            <Text style={styles.bullet}>
              • A <Text style={styles.strong}>run of 3 km or more</Text>, outside
            </Text>
            <Text style={styles.bullet}>
              • A <Text style={styles.strong}>ride of 5 km or more</Text> with power meter and
              heart rate data
            </Text>
            <Text style={styles.requirementsFoot}>
              Both must be within <Text style={styles.strong}>{LOOKBACK_PHRASE}</Text>.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <LumenButton onPress={onTryAgain}>Try connecting again</LumenButton>

        <Pressable
          onPress={onContinueLevel1}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryLabel}>Continue as Longevity Level 1</Text>
        </Pressable>

        <Pressable
          onPress={() => void Linking.openURL(CONTACT_URL)}
          style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
          accessibilityRole="link"
        >
          <Text style={styles.linkLabel}>Get in touch for help</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 8,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,130,110,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(232,130,110,0.4)',
    marginBottom: 20,
  },
  eyebrow: {
    ...sora('bold'),
    alignSelf: 'center',
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: lumen.coral,
    marginBottom: 10,
  },
  headline: {
    ...sora('extrabold'),
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.8,
    color: lumen.fg,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
    alignSelf: 'center',
  },
  body: {
    marginBottom: 24,
  },
  message: {
    ...sora('semibold'),
    fontSize: 15,
    lineHeight: 22,
    color: lumen.fgMuted,
    textAlign: 'center',
    maxWidth: 320,
    alignSelf: 'center',
  },
  requirements: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    gap: 8,
  },
  requirementsLead: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
  },
  bullet: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 20,
    color: lumen.fgMuted,
    paddingLeft: 4,
  },
  requirementsFoot: {
    ...sora('semibold'),
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: lumen.fgMuted,
  },
  strong: {
    color: lumen.fg,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 8,
  },
  secondaryBtn: {
    minHeight: 52,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: lumen.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  secondaryLabel: {
    ...sora('bold'),
    fontSize: 15,
    color: lumen.fg,
    textAlign: 'center',
  },
  linkBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkLabel: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.88,
  },
});
