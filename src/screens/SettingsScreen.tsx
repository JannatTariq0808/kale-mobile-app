// Design: kale-mobile-design — lum-20 KaleSettingsLumen (screens/KaleLumenApp2.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { logoutAndReturnToWelcome } from '../services/auth/session';
import { LumenCard } from '../components/lumen/LumenCard';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { ProfileAvatar } from '../components/lumen/ProfileAvatar';
import { SectionLabel } from '../components/lumen/SectionLabel';
import { SettingsRow } from '../components/lumen/SettingsRow';
import { SettingsToggle } from '../components/lumen/SettingsToggle';
import { useSettingsData } from '../hooks/useSettingsData';
import type { SettingsStackParamList } from '../navigation/SettingsStackNavigator';
import { lumen, sora, typography } from '../theme';

const PRIVACY_URL = 'https://www.kale.insure/privacy';
const CONTACT_URL = 'https://www.kale.insure/contact';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Main'>;

export function SettingsScreen({ navigation }: Props) {
  const settings = useSettingsData();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleLogout = () => {
    logoutAndReturnToWelcome(navigation);
  };

  const openUrl = (url: string) => {
    void Linking.openURL(url);
  };

  const weightLabel =
    settings.weightKg != null ? `${settings.weightKg} kg` : null;

  const memberMeta = [
    settings.email,
    weightLabel,
    settings.memberSince ? `Member since ${settings.memberSince}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <LumenHeader />
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <SectionLabel variant="page">Settings</SectionLabel>

          {settings.loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color={lumen.mint} />
            </View>
          ) : null}

          <LumenCard style={styles.profileCard}>
            <Pressable
              style={styles.profileRow}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => navigation.navigate('Profile')}
            >
              <ProfileAvatar
                name={settings.displayName}
                photoUrl={settings.photoUrl}
                size={56}
              />
              <View style={styles.profileCopy}>
                <Text style={styles.profileName}>{settings.displayName}</Text>
                {memberMeta ? <Text style={styles.profileMeta}>{memberMeta}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={16} color={lumen.fgMuted} />
            </Pressable>
          </LumenCard>

          <SectionLabel>Preferences</SectionLabel>
          <LumenCard padding={0} style={styles.sectionCard}>
            <SettingsToggle
              label="Assessment reminders"
              sub="3, 1 week and 1 day before"
              defaultOn
            />
            <SettingsToggle label="Cycle updates" sub="Weekly progress emails" defaultOn />
            <SettingsToggle label="Marketing" sub="Occasional offers from Kale" last />
          </LumenCard>

          <LumenCard padding={0} style={styles.sectionCard}>
            <SettingsRow
              label="Privacy & data"
              onPress={() => openUrl(PRIVACY_URL)}
            />
            <SettingsRow
              label="Help & support"
              onPress={() => openUrl(CONTACT_URL)}
            />
            <SettingsRow
              label="Log out"
              labelColor={lumen.coral}
              chevron={false}
              last
              onPress={handleLogout}
            />
          </LumenCard>

          <Text style={styles.footer}>Kale Insurance · v{appVersion}</Text>
        </ScreenScroll>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: '100%',
  },
  content: {
    flex: 1,
    zIndex: 2,
    width: '100%',
  },
  scrollContent: {
    paddingTop: 18,
  },
  loaderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  profileCard: {
    marginTop: 14,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    ...sora('extrabold'),
    fontSize: typography.headline,
    color: lumen.fg,
    letterSpacing: -0.3,
  },
  profileMeta: {
    ...sora('regular'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: 16,
  },
  footer: {
    ...sora('regular'),
    textAlign: 'center',
    color: lumen.fgMuted,
    fontSize: 11,
    paddingTop: 6,
    paddingBottom: 14,
  },
});
