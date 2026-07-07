import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Alert } from 'react-native';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { fetchLastCardioDocMeta } from '../cardio/fetchLastCardioDoc';
import { resolveCardioSyncWindow } from '../../utils/cardioSyncWindow';
import {
  fetchInProgressQuarterlyAssessment,
  resolveQuarterlyPillarStep,
} from './assessmentSession';
import { onboardingPillarStepToRoute } from '../onboarding/resolveOnboardingNavigation';
import { setActiveAssessmentFlow } from './assessmentFlowSession';
import { seedDevQuarterlyAssessment } from './seedDevQuarterlyAssessment';
import { devSeedQuarterlyAssessmentEnabled } from '../../config/assessmentDev';
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

  let assessment = await fetchInProgressQuarterlyAssessment(uid);

  if (!assessment && devSeedQuarterlyAssessmentEnabled()) {
    const seeded = await seedDevQuarterlyAssessment();
    if (seeded.ok) {
      assessment = await fetchInProgressQuarterlyAssessment(uid);
    } else {
      Alert.alert('Could not create test assessment', seeded.message);
      return;
    }
  }

  if (!assessment) {
    Alert.alert(
      'Assessment not ready',
      devSeedQuarterlyAssessmentEnabled()
        ? 'No quarterly assessment doc found. Deploy devSeedQuarterlyAssessment with ALLOW_DEV_SEED_QUARTERLY=true, or wait until the 1st of Jan / Apr / Jul / Oct.'
        : 'Quarterly assessments are created on the 1st of January, April, July, and October. For local testing set EXPO_PUBLIC_DEV_SEED_QUARTERLY_ASSESSMENT=true in .env.local.',
    );
    return;
  }

  const step = await resolveQuarterlyPillarStep(assessment);
  const route = onboardingPillarStepToRoute(step);

  if (route === 'Main') {
    Alert.alert('Assessment complete', 'You have already finished this quarter’s assessment.');
    return;
  }

  const cardioMeta = await fetchLastCardioDocMeta(uid);
  const syncWindow = resolveCardioSyncWindow(
    cardioMeta.createdAt,
    new Date(),
    cardioMeta.platform,
  );

  setActiveAssessmentFlow({
    mode: 'quarterly',
    assessmentId: assessment.id,
    activitiesSince: syncWindow.since.toISOString(),
  });

  const root = rootNavigator(navigation);

  if (route === 'ConnectTracker') {
    root.navigate('ConnectTracker' as keyof RootStackParamList, {
      flow: 'quarterly',
      activitiesSince: syncWindow.since.toISOString(),
      syncPeriodLabel: syncWindow.periodLabel,
      garminCapped: syncWindow.cappedForGarmin,
    });
    return;
  }

  root.navigate(route as keyof RootStackParamList);
}
