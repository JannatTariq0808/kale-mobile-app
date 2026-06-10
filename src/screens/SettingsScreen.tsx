// Design: kale-mobile-design — lum-20 KaleSettingsLumen (screens/KaleLumenApp2.jsx)

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { resetToWelcome, signOutUser } from '../services/auth/session';
import { LumenBackground } from '../components/lumen/LumenBackground';
import { LumenCard } from '../components/lumen/LumenCard';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { SectionLabel } from '../components/lumen/SectionLabel';
import { SettingsRow } from '../components/lumen/SettingsRow';
import { SettingsToggle } from '../components/lumen/SettingsToggle';
import { lumen, lumenPillar, sora, typography } from '../theme';

export function SettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOutUser();
    } finally {
      resetToWelcome(navigation);
    }
  };

  return (
    <View style={styles.screen}>
      <LumenBackground />
      <View style={styles.content}>
        <LumenHeader />
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <SectionLabel variant="page">Settings</SectionLabel>

          <LumenCard style={styles.profileCard}>
            <Pressable style={styles.profileRow} accessibilityRole="button">
              <Image source={require('../../assets/iris.jpg')} style={styles.profileAvatar} />
              <View style={styles.profileCopy}>
                <Text style={styles.profileName}>Alex Pendragon</Text>
                <Text style={styles.profileMeta}>alex@pendragon.io · Member since Nov 2025</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={lumen.fgMuted} />
            </Pressable>
          </LumenCard>

          <SectionLabel>Your policy</SectionLabel>
          <LumenCard padding={0} style={styles.sectionCard}>
            <View style={styles.policyHeader}>
              <View>
                <Text style={styles.policyAmount}>£250k</Text>
                <Text style={styles.policyTerm}>Level term · 25 years</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
            <SettingsRow label="Monthly premium" value="£27.00" last />
          </LumenCard>

          <SectionLabel>Connections</SectionLabel>
          <LumenCard padding={0} style={styles.sectionCard}>
            <SettingsRow icon="strava" label="Strava" value="Connected" valueColor={lumen.mint} />
            <SettingsRow icon="garmin" label="Garmin" value="Connected" valueColor={lumen.mint} />
            <SettingsRow
              icon="apple"
              label="Apple Health"
              value="Add"
              valueColor={lumenPillar.cardio}
              last
            />
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
            <SettingsRow label="Privacy & data" />
            <SettingsRow label="Help & support" />
            <SettingsRow
              label="Log out"
              labelColor={lumen.coral}
              chevron={false}
              last
              onPress={handleLogout}
            />
          </LumenCard>

          <Text style={styles.footer}>Kale Insurance · v2.4.1</Text>
          </ScreenScroll>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDark,
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
  profileCard: {
    marginTop: 14,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: lumen.hairline,
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
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  policyAmount: {
    ...sora('extrabold'),
    fontSize: 22,
    color: lumen.fg,
    letterSpacing: -0.4,
  },
  policyTerm: {
    ...sora('regular'),
    fontSize: typography.caption,
    color: lumen.fgMuted,
    marginTop: 2,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  activeBadgeText: {
    ...sora('extrabold'),
    fontSize: typography.micro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: lumen.mint,
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
