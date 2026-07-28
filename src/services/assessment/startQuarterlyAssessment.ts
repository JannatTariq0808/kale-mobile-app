import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Alert } from 'react-native';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { fetchLastCardioDocMeta } from '../cardio/fetchLastCardioDoc';
import { resolveCardioSyncWindow } from '../../utils/cardioSyncWindow';
import {
  fetchAssessmentsForUser,
  findInProgressQuarterlyAssessment,
  resolveQuarterlyPillarStep,
} from './assessmentSession';
import { onboardingPillarStepToRoute } from '../onboarding/resolveOnboardingNavigation';
import { setActiveAssessmentFlow } from './assessmentFlowSession';
import { seedDevQuarterlyAssessment } from './seedDevQuarterlyAssessment';
import { devSeedQuarterlyAssessmentEnabled } from '../../config/assessmentDev';
import { isAssessmentWindowLive } from '../../utils/assessmentCycle';
import type { RootStackParamList } from '../../navigation/types';

function rootNavigator(navigation: NavigationProp<ParamListBase>) {
  return navigation.getParent()?.getParent() ?? navigation.getParent() ?? navigation;
}

/** Start or resume a quarterly assessment from the home tab. */
export async function startQuarterlyAssessmentFromHome(
  navigation: NavigationProp<ParamListBase>,
): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return;

  let { assessments } = await fetchAssessmentsForUser(uid);
  let assessment = findInProgressQuarterlyAssessment(assessments);

  // New attempts (and dev seed) only during Jan / Apr / Jul / Oct.
  // Resume of an already-open attempt is allowed so users can finish after the window closes.
  if (!assessment && !isAssessmentWindowLive()) {
    Alert.alert(
      'Assessment window closed',
      'Quarterly assessments are only available during January, April, July, and October.',
    );
    return;
  }

  if (!assessment && isAssessmentWindowLive() && devSeedQuarterlyAssessmentEnabled()) {
    const seeded = await seedDevQuarterlyAssessment();
    if (seeded.ok) {
      ({ assessments } = await fetchAssessmentsForUser(uid));
      assessment = findInProgressQuarterlyAssessment(assessments);
    } else {
      Alert.alert('Could not create test assessment', seeded.message);
      return;
    }
  }

  if (!assessment) {
    Alert.alert(
      'Assessment not ready',
      isAssessmentWindowLive()
        ? 'Your quarterly assessment is not ready yet. It is created at the start of each assessment window.'
        : 'Quarterly assessments are only available during January, April, July, and October.',
    );
    return;
  }

  const [step, cardioMeta] = await Promise.all([
    resolveQuarterlyPillarStep(assessment),
    fetchLastCardioDocMeta(uid, assessments, assessment.id),
  ]);
  const route = onboardingPillarStepToRoute(step);

  if (route === 'Main') {
    Alert.alert('Assessment complete', 'You have already finished this quarter’s assessment.');
    return;
  }
  const syncWindow = resolveCardioSyncWindow(
    cardioMeta.createdAt,
    new Date(),
    cardioMeta.platform,
  );

  if (__DEV__) {
    console.log('[cardio-sync] quarterly start', {
      inProgressAssessmentId: assessment.id,
      anchorAssessmentId: cardioMeta.anchorAssessmentId ?? null,
      anchorIsOnboarding: cardioMeta.anchorIsOnboarding ?? null,
      anchorCardioDocId: cardioMeta.anchorCardioDocId ?? null,
      anchorCreatedAt: cardioMeta.createdAt?.toISOString() ?? null,
      platform: cardioMeta.platform,
      activitiesSince: syncWindow.since.toISOString(),
      periodLabel: syncWindow.periodLabel,
      garminCapped: syncWindow.cappedForGarmin,
      windowLive: isAssessmentWindowLive(),
    });
  }

  setActiveAssessmentFlow({
    mode: 'quarterly',
    assessmentId: assessment.id,
    activitiesSince: syncWindow.since.toISOString(),
  });

  const root = rootNavigator(navigation);

  if (route === 'ConnectTracker') {
    root.navigate('ConnectTracker' as keyof RootStackParamList, {
      flow: 'quarterly',
      assessmentId: assessment.id,
      activitiesSince: syncWindow.since.toISOString(),
      syncPeriodLabel: syncWindow.periodLabel,
      garminCapped: syncWindow.cappedForGarmin,
    });
    return;
  }

  root.navigate(route as keyof RootStackParamList);
}
