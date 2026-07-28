// Design: kale-mobile-design — lum-06 KaleKnowledgeIntroLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import { OnboardingLogoutLink } from '../../components/onboarding/OnboardingLogoutLink';
import {
  buildKnowledgeAssessmentMeta,
  formatKnowledgeQuestionCount,
  formatKnowledgeQuizDuration,
  KNOWLEDGE_SECONDS_PER_QUESTION,
  getQuarterForMonth,
  resolveKnowledgeSetId,
} from '../../config/knowledgeAssessment';
import { isQuarterlyAssessmentFlow } from '../../services/assessment/assessmentFlowSession';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useOnboardingPillarStatus } from '../../hooks/useOnboardingPillarStatus';
import { useKnowledgeSession } from '../../hooks/useKnowledgeSession';
import { useQuestionSet } from '../../hooks/useQuestionSet';
import type { RootStackParamList } from '../../navigation/types';
import { resetToKnowledgeResult } from '../../navigation/knowledgeFlow';
import { onboardingSkipTarget } from '../../services/onboarding/resolveOnboardingNavigation';
import { ensureKnowledgeAssessment, fetchKnowledgeAssessmentById } from '../../services/knowledge/knowledgeAssessmentSession';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeIntro'>;

const FUTURE_TOPICS = [
  'Exercise science',
  'Nutrition',
  'Sleep & recovery',
  'Mental health',
  'Biology & genetics',
] as const;

function TopicMeta({ label }: { label: string }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaDot} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

export function KnowledgeIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { canSkipKnowledge, status: pillarStatus, loading: pillarLoading } =
    useOnboardingPillarStatus(user?.uid);
  const onboardingActive = pillarStatus != null;
  const [starting, setStarting] = useState(false);
  const isQuarterly = isQuarterlyAssessmentFlow();
  const setId = useMemo(
    () => (isQuarterly ? getQuarterForMonth(new Date().getMonth() + 1).setId : resolveKnowledgeSetId()),
    [isQuarterly],
  );
  const meta = useMemo(() => buildKnowledgeAssessmentMeta(setId), [setId]);
  const hideBackButton = meta.isOnboarding || pillarLoading || (onboardingActive && !isQuarterly);
  const { questions, loading, error } = useQuestionSet(setId);
  const { assessment, loading: sessionLoading } = useKnowledgeSession(user?.uid, setId);

  const questionCountLabel = formatKnowledgeQuestionCount(questions.length);
  const durationLabel = formatKnowledgeQuizDuration(
    questions.length,
    KNOWLEDGE_SECONDS_PER_QUESTION,
  );

  const answeredCount = assessment?.responses.length ?? 0;
  const canResume =
    assessment != null &&
    !assessment.is_completed &&
    answeredCount > 0 &&
    answeredCount < questions.length;
  const isCompleted = assessment?.is_completed === true;
  const showOnboardingSkip = onboardingActive && meta.isOnboarding && canSkipKnowledge;
  const showQuarterlySkip = !meta.isOnboarding;

  const handleSkip = useCallback(() => {
    if (showOnboardingSkip) {
      navigation.replace(onboardingSkipTarget('knowledge'));
      return;
    }
    if (showQuarterlySkip) {
      navigation.replace('Main');
    }
  }, [navigation, showOnboardingSkip, showQuarterlySkip]);

  const openCompletedFlow = useCallback(() => {
    if (!assessment || questions.length === 0) return;
    resetToKnowledgeResult(navigation, {
      assessmentId: assessment.id,
      setId,
      totalQuestions: questions.length,
      meta,
    });
  }, [assessment, meta, navigation, questions.length, setId]);

  useFocusEffect(
    useCallback(() => {
      if (loading || sessionLoading || !isCompleted) return;
      openCompletedFlow();
    }, [isCompleted, loading, openCompletedFlow, sessionLoading]),
  );

  const openQuiz = async () => {
    if (questions.length === 0 || starting) return;

    if (!user?.uid) {
      return;
    }

    setStarting(true);
    try {
      const assessmentId = await ensureKnowledgeAssessment(user.uid, setId, assessment?.id);

      if (!assessmentId) {
        if (__DEV__) {
          console.warn('[knowledge] could not create assessment — check Firestore rules');
        }
        return;
      }

      const latest = await fetchKnowledgeAssessmentById(assessmentId);

      navigation.navigate('KnowledgeQuiz', {
        setId,
        questions,
        meta,
        assessmentId,
        startIndex: latest && !latest.is_completed ? latest.responses.length : 0,
      });
    } finally {
      setStarting(false);
    }
  };

  const handlePrimaryPress = () => {
    if (isCompleted) {
      openCompletedFlow();
      return;
    }
    void openQuiz();
  };

  const primaryLabel = (() => {
    if (starting) return 'Opening…';
    if (isCompleted) return 'View results';
    if (canResume) return `Resume quiz (${answeredCount}/${questions.length})`;
    return questions.length === 0 ? 'No questions yet' : user?.uid ? 'Start quiz' : 'Log in to start quiz';
  })();

  if (isCompleted && assessment && questions.length > 0 && !loading && !sessionLoading) {
    return (
      <View style={[styles.screen, styles.redirecting]}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        {hideBackButton ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
          </Pressable>
        )}

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LumEyebrow pillar="knowledge" label="Knowledge" step="Test 3 of 3" />

          <Text style={styles.headline}>
            Quick <Text style={styles.headlineAccent}>knowledge</Text> check.
          </Text>
          <Text style={styles.subhead}>
            {meta.isOnboarding
              ? 'One topic per quarter. Today we cover the basics — and build from there.'
              : `This quarter covers ${meta.title.toLowerCase()} — answer every question within ${KNOWLEDGE_SECONDS_PER_QUESTION} seconds.`}
          </Text>

          <View style={styles.topicSection}>
            <Text style={styles.topicEyebrow}>{meta.eyebrow}</Text>
            <Text style={styles.topicTitle}>{meta.title}</Text>
            <Text style={styles.topicBody}>{meta.body}</Text>
            <View style={styles.metaRow}>
              <TopicMeta label={loading ? 'Loading…' : questionCountLabel} />
              <TopicMeta label={loading ? '…' : durationLabel} />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {canResume ? (
              <Text style={styles.resumeNote}>Your progress is saved — pick up where you left off.</Text>
            ) : null}
            {isCompleted ? (
              <Text style={styles.resumeNote}>
                Quiz complete — {assessment?.correct_responses ?? 0} correct.
              </Text>
            ) : null}
          </View>

          {meta.isOnboarding ? (
            <>
              <Text style={styles.futureTitle}>Coming in future quarters</Text>
              <View style={styles.futureTags}>
                {FUTURE_TOPICS.map((topic) => (
                  <View key={topic} style={styles.futureTag}>
                    <Text style={styles.futureTagText}>{topic}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {loading || sessionLoading ? (
            <ActivityIndicator color={lumen.lime} />
          ) : (
            <>
              <LumenButton onPress={handlePrimaryPress}>
                {primaryLabel}
              </LumenButton>
              {showOnboardingSkip || showQuarterlySkip ? (
                <Pressable
                  onPress={handleSkip}
                  style={styles.skipLink}
                  accessibilityRole="button"
                  accessibilityLabel="Skip for now"
                >
                  <Text style={styles.skipLinkText}>Skip for now</Text>
                </Pressable>
              ) : null}
              <OnboardingLogoutLink navigation={navigation} />
            </>
          )}
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
  redirecting: {
    alignItems: 'center',
    justifyContent: 'center',
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
  headerSpacer: {
    height: 32,
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 16,
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
  topicSection: {
    marginTop: 26,
    paddingTop: 22,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: lumen.hairline,
  },
  topicEyebrow: {
    ...sora('extrabold'),
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: lumenPillar.knowledge,
  },
  topicTitle: {
    ...sora('extrabold'),
    marginTop: 10,
    fontSize: 30,
    lineHeight: 31.5,
    letterSpacing: -0.9,
    color: lumen.fg,
  },
  topicBody: {
    ...sora('semibold'),
    marginTop: 10,
    fontSize: 13.5,
    lineHeight: 20.25,
    color: lumen.fgMuted,
    maxWidth: 300,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metaDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: lumenPillar.knowledge,
  },
  metaText: {
    ...sora('semibold'),
    fontSize: 12.5,
    color: lumen.fg,
  },
  errorText: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 12.5,
    lineHeight: 18,
    color: lumen.coral,
  },
  resumeNote: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 12.5,
    lineHeight: 18,
    color: lumenPillar.knowledge,
  },
  futureTitle: {
    ...sora('bold'),
    marginTop: 22,
    marginBottom: 12,
    fontSize: 11,
    letterSpacing: 1.98,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  futureTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  futureTag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: lumen.hairline,
  },
  futureTagText: {
    ...sora('semibold'),
    fontSize: 12.5,
    color: lumen.fgMuted,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 24,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  skipLink: {
    padding: 4,
  },
  skipLinkText: {
    ...sora('semibold'),
    fontSize: 13,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
