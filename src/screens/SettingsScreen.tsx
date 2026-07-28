import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { DeleteAccountModal } from '../components/lumen/DeleteAccountModal';
import { LumenCard } from '../components/lumen/LumenCard';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { ProfileAvatar } from '../components/lumen/ProfileAvatar';
import { SectionLabel } from '../components/lumen/SectionLabel';
import { SettingsRow } from '../components/lumen/SettingsRow';
import { SettingsToggle } from '../components/lumen/SettingsToggle';
import { useAuthSession } from '../hooks/useAuthSession';
import { patchNotificationPreferences, useSettingsData } from '../hooks/useSettingsData';
import type { SettingsStackParamList } from '../navigation/SettingsStackNavigator';
import { deleteCurrentUserAccount } from '../services/auth/deleteAccount';
import { logoutAndReturnToWelcome } from '../services/auth/session';
import {
  saveAssessmentAndCycleUpdatesPreference,
  saveMarketingPreference,
} from '../services/settings/notificationPreferences';
import { lumen, sora, typography } from '../theme';

const PRIVACY_URL = 'https://www.kale.insure/privacy';
const CONTACT_URL = 'https://www.kale.insure/contact';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Main'>;

export function SettingsScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const settings = useSettingsData();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingMarketing, setSavingMarketing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRequirePassword, setDeleteRequirePassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const prefs = settings.notificationPreferences;

  const handleProductUpdates = useCallback(
    async (next: boolean) => {
      if (!user?.uid || savingProduct) return;
      const previous = prefs.assessmentAndCycleUpdates;
      patchNotificationPreferences(user.uid, { assessmentAndCycleUpdates: next });
      setSavingProduct(true);
      try {
        await saveAssessmentAndCycleUpdatesPreference(user.uid, next);
      } catch (error) {
        patchNotificationPreferences(user.uid, { assessmentAndCycleUpdates: previous });
        if (__DEV__) {
          console.warn('[settings] save assessment & cycle updates failed', error);
        }
      } finally {
        setSavingProduct(false);
      }
    },
    [prefs.assessmentAndCycleUpdates, savingProduct, user?.uid],
  );

  const handleMarketing = useCallback(
    async (next: boolean) => {
      if (!user?.uid || savingMarketing) return;
      const previous = prefs.marketing;
      patchNotificationPreferences(user.uid, { marketing: next });
      setSavingMarketing(true);
      try {
        await saveMarketingPreference(user.uid, next);
      } catch (error) {
        patchNotificationPreferences(user.uid, { marketing: previous });
        if (__DEV__) {
          console.warn('[settings] save marketing failed', error);
        }
      } finally {
        setSavingMarketing(false);
      }
    },
    [prefs.marketing, savingMarketing, user?.uid],
  );

  const handleLogout = () => {
    logoutAndReturnToWelcome(navigation);
  };

  const openDeleteAccount = () => {
    setDeleteError(null);
    setDeleteRequirePassword(false);
    setAccountDeleted(false);
    setDeleteModalVisible(true);
  };

  const closeDeleteAccount = () => {
    if (deletingAccount) return;
    setDeleteModalVisible(false);
    setDeleteRequirePassword(false);
    setAccountDeleted(false);
    setDeleteError(null);
  };

  const finishDeleteAccount = () => {
    setDeleteModalVisible(false);
    setAccountDeleted(false);
    setDeleteRequirePassword(false);
    setDeleteError(null);
    logoutAndReturnToWelcome(navigation);
  };

  const runDeleteAccount = async (password?: string) => {
    setDeletingAccount(true);
    setDeleteError(null);
    try {
      const result = await deleteCurrentUserAccount({ password });
      if (result.ok) {
        setAccountDeleted(true);
        return;
      }

      if (result.reason === 'requires_recent_login') {
        setDeleteRequirePassword(true);
        setDeleteError(result.message);
        return;
      }

      setDeleteError(result.message);
    } finally {
      setDeletingAccount(false);
    }
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
              label="Assessment & cycle updates"
              sub="Reminders before assessments and weekly progress"
              value={prefs.assessmentAndCycleUpdates}
              saving={savingProduct}
              onChange={(next) => void handleProductUpdates(next)}
            />
            <SettingsToggle
              label="Marketing"
              sub="Occasional offers from Kale"
              value={prefs.marketing}
              saving={savingMarketing}
              last
              onChange={(next) => void handleMarketing(next)}
            />
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
              onPress={handleLogout}
            />
            <SettingsRow
              label="Delete account"
              labelColor={lumen.coral}
              chevron={false}
              last
              onPress={openDeleteAccount}
            />
          </LumenCard>

          <Text style={styles.footer}>Kale Insurance · v{appVersion}</Text>
        </ScreenScroll>
      </View>

      <DeleteAccountModal
        visible={deleteModalVisible}
        requirePassword={deleteRequirePassword}
        deleting={deletingAccount}
        deleted={accountDeleted}
        errorMessage={deleteError}
        onCancel={closeDeleteAccount}
        onConfirm={(password) => void runDeleteAccount(password)}
        onDone={finishDeleteAccount}
      />
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
