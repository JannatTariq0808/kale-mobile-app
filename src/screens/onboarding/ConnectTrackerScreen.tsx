// Inspired by kale-mobile-design — ForestConnect / settings connection rows

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ConnectionBrandIcon,
  type ConnectionBrand,
} from '../../components/lumen/ConnectionBrandIcon';
import { ConnectIssuePanel } from '../../components/lumen/ConnectIssuePanel';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { OnboardingLogoutLink } from '../../components/onboarding/OnboardingLogoutLink';
import { useConnectTrackerFlow } from '../../hooks/useConnectTrackerFlow';
import type { RootStackParamList } from '../../navigation/types';
import { connectTracker } from '../../services/tracker/connect';
import {
  buildConnectIssue,
  type ConnectIssueContent,
} from '../../services/tracker/connectIssueCopy';
import { lumen, sora } from '../../theme';
import { isQuarterlyAssessmentFlow, setActiveAssessmentFlow, getActiveAssessmentFlow } from '../../services/assessment/assessmentFlowSession';
import { assignLevel1Unverified } from '../../services/cardio/assignLevel1Unverified';
import type { AssessStravaOptions } from '../../services/tracker/assess';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectTracker'>;

type TrackerOption = {
  id: ConnectionBrand;
  name: string;
  subtitle: string;
};

const BASE_TRACKERS: TrackerOption[] = [
  { id: 'strava', name: 'Strava', subtitle: 'Most popular' },
  { id: 'garmin', name: 'Garmin Connect', subtitle: 'Best for accuracy' },
];

const APPLE_HEALTH: TrackerOption = {
  id: 'apple',
  name: 'Apple Health',
  subtitle: 'Watch + iPhone',
};

function getTrackerOptions(): TrackerOption[] {
  return [...BASE_TRACKERS];
}

function buildAssessOptionsFromRoute(
  routeParams: RootStackParamList['ConnectTracker'],
): AssessStravaOptions | undefined {
  if (!routeParams) return undefined;
  const options: AssessStravaOptions = {};
  if (routeParams.activitiesSince) options.activitiesSince = routeParams.activitiesSince;
  if (routeParams.assessmentId) options.assessmentId = routeParams.assessmentId;
  return Object.keys(options).length > 0 ? options : undefined;
}

export function ConnectTrackerScreen({ navigation }: Props) {
  const route = useRoute();
  const routeParams = (route.params ?? {}) as RootStackParamList['ConnectTracker'];
  const isQuarterly = routeParams?.flow === 'quarterly' || isQuarterlyAssessmentFlow();
  const syncPeriodLabel = routeParams?.syncPeriodLabel ?? 'the last 12 weeks';
  const trackers = getTrackerOptions();
  const [connecting, setConnecting] = useState<ConnectionBrand | null>(null);
  const [connectIssue, setConnectIssue] = useState<ConnectIssueContent | null>(null);
  const [assigningLevel1, setAssigningLevel1] = useState(false);

  useConnectTrackerFlow({
    setConnecting,
    setConnectIssue,
    onSuccess: () => navigation.replace('CardioAnalysing'),
  });

  useEffect(() => {
    if (routeParams?.flow !== 'quarterly') return;
    const flow = getActiveAssessmentFlow();
    const activitiesSince = routeParams.activitiesSince;
    const assessmentId = routeParams.assessmentId;
    if (!activitiesSince && !assessmentId) return;

    if (!flow?.activitiesSince || !flow.assessmentId) {
      setActiveAssessmentFlow({
        mode: 'quarterly',
        assessmentId: assessmentId ?? flow?.assessmentId ?? '',
        activitiesSince: activitiesSince ?? flow?.activitiesSince,
        cardioDocId: flow?.cardioDocId,
      });
      if (__DEV__) {
        console.log('[cardio-sync] restored flow from route params', {
          assessmentId: assessmentId ?? flow?.assessmentId ?? null,
          activitiesSince: activitiesSince ?? flow?.activitiesSince ?? null,
        });
      }
    }
  }, [routeParams?.activitiesSince, routeParams?.assessmentId, routeParams?.flow]);

  const clearIssue = useCallback(() => {
    setConnectIssue(null);
  }, []);

  const handleContinueLevel1 = useCallback(() => {
    if (assigningLevel1 || connecting) return;
    void (async () => {
      setAssigningLevel1(true);
      try {
        const result = await assignLevel1Unverified();
        if (!result.ok) {
          Alert.alert('Could not continue', result.message);
          return;
        }
        navigation.replace('CardioResult');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not assign Level 1. Please try again.';
        Alert.alert('Could not continue', message);
      } finally {
        setAssigningLevel1(false);
      }
    })();
  }, [assigningLevel1, connecting, navigation]);

  const insets = useSafeAreaInsets();

  const handleConnect = useCallback(
    async (brand: ConnectionBrand) => {
      if (connecting) return;

      setConnectIssue(null);
      setConnecting(brand);
      try {
        const assessOptions = buildAssessOptionsFromRoute(routeParams);
        const result = await connectTracker(brand, assessOptions);
        if (!result.ok) {
          if (result.cancelled) return;
          setConnectIssue(
            buildConnectIssue(result.message, result.provider, result.oauthReason),
          );
          return;
        }
        navigation.replace('CardioAnalysing');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        setConnectIssue(buildConnectIssue(message));
      } finally {
        setConnecting(null);
      }
    },
    [connecting, navigation, routeParams],
  );

  const showPicker = !connectIssue;

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <Pressable
          onPress={() => (connectIssue ? clearIssue() : navigation.goBack())}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={connectIssue ? 'Back to connections' : 'Go back'}
          disabled={connecting != null}
        >
          <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
        </Pressable>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            connectIssue ? styles.scrollContentIssue : null,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {connectIssue ? (
            <ConnectIssuePanel
              headline={connectIssue.headline}
              message={connectIssue.message}
              showActivityRequirements={connectIssue.showActivityRequirements}
              busy={assigningLevel1}
              onTryAgain={clearIssue}
              onContinueLevel1={handleContinueLevel1}
            />
          ) : (
            <>
              <LumEyebrow
                pillar="cardio"
                label="Cardio"
                step={isQuarterly ? 'Quarterly assessment' : 'Test 1 of 3'}
              />

              <Text style={styles.headline}>
                {isQuarterly ? (
                  <>
                    Sync your <Text style={styles.headlineAccent}>latest</Text> activities.
                  </>
                ) : (
                  <>
                    Connect your <Text style={styles.headlineAccent}>apps</Text>.
                  </>
                )}
              </Text>
              <Text style={styles.subhead}>
                {isQuarterly
                  ? `We read runs and rides from ${syncPeriodLabel}${
                      routeParams?.garminCapped
                        ? ' — Garmin cannot backfill more than one month at a time'
                        : ''
                    }.`
                  : 'We read runs and rides from the last 12 weeks to estimate your cardio fitness. We never read your private messages or contacts.'}
              </Text>

              {connecting ? (
                <View style={styles.connectingBanner}>
                  <ActivityIndicator color={lumen.lime} />
                  <Text style={styles.connectingText}>
                    {connecting === 'garmin'
                      ? 'Connecting Garmin — this can take a minute while activities sync…'
                      : `Connecting ${connecting === 'strava' ? 'Strava' : 'Apple Health'}…`}
                  </Text>
                </View>
              ) : null}

              {showPicker ? (
                <View style={styles.options}>
                  {trackers.map((tracker) => {
                    const isBusy = connecting != null;
                    const isActive = connecting === tracker.id;

                    return (
                      <Pressable
                        key={tracker.id}
                        onPress={() => handleConnect(tracker.id)}
                        style={[
                          styles.optionRow,
                          isBusy && !isActive ? styles.optionRowDisabled : null,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Connect ${tracker.name}`}
                        disabled={isBusy}
                      >
                        <ConnectionBrandIcon brand={tracker.id} />
                        <View style={styles.optionCopy}>
                          <Text style={styles.optionName}>{tracker.name}</Text>
                          <Text style={styles.optionSubtitle}>{tracker.subtitle}</Text>
                        </View>
                        {isActive ? (
                          <ActivityIndicator color={lumen.fgMuted} />
                        ) : (
                          <Ionicons name="chevron-forward" size={18} color={lumen.fgMuted} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <OnboardingLogoutLink navigation={navigation} />
        </View>
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
    paddingHorizontal: 22,
    marginLeft: -6,
  },
  backIcon: {
    opacity: 0.85,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 24,
  },
  scrollContentIssue: {
    flexGrow: 1,
    paddingTop: 24,
  },
  footer: {
    flexShrink: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headline: {
    ...sora('extrabold'),
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -1.2,
    color: lumen.fg,
    marginTop: 14,
  },
  headlineAccent: {
    color: lumen.lime,
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22.5,
    color: lumen.fgMuted,
    maxWidth: 310,
  },
  connectingBanner: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
  },
  connectingText: {
    ...sora('semibold'),
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: lumen.fgMuted,
  },
  options: {
    marginTop: 28,
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
  },
  optionRowDisabled: {
    opacity: 0.55,
  },
  optionCopy: {
    flex: 1,
  },
  optionName: {
    ...sora('bold'),
    fontSize: 16,
    color: lumen.fg,
  },
  optionSubtitle: {
    ...sora('semibold'),
    marginTop: 2,
    fontSize: 12,
    color: lumen.fgMuted,
  },
});
