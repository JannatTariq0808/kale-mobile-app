import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Pressable, StyleSheet, Text } from 'react-native';
import { logoutAndReturnToWelcome } from '../../services/auth/session';
import { lumen, sora } from '../../theme';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  compact?: boolean;
};

export function OnboardingLogoutLink({ navigation, compact }: Props) {
  return (
    <Pressable
      onPress={() => logoutAndReturnToWelcome(navigation)}
      style={[styles.link, compact && styles.linkCompact]}
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <Text style={[styles.text, compact && styles.textCompact]}>Log out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    padding: 4,
  },
  linkCompact: {
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  text: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
  textCompact: {
    fontSize: 12,
  },
});
