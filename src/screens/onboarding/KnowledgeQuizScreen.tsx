// Design: kale-mobile-design — lum-07 KaleQuizQuestionLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuizAdvanceBar } from '../../components/lumen/QuizAdvanceBar';
import { QuizQuestionTimer } from '../../components/lumen/QuizQuestionTimer';
import { KNOWLEDGE_SECONDS_PER_QUESTION } from '../../config/knowledgeAssessment';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import { resetToKnowledgeAnalysing } from '../../navigation/knowledgeFlow';
import {
  appendKnowledgeResponse,
  ensureKnowledgeAssessment,
  fetchKnowledgeAssessmentById,
} from '../../services/knowledge/knowledgeAssessmentSession';
import type { KnowledgeResponse } from '../../types/knowledgeAssessment';
import type { QuestionSetQuestion } from '../../types/questionSet';
import { lumen, lumenPillar, sora } from '../../theme';
import {
  getExplanationCorrect,
  getExplanationWrong,
  toQuizOptions,
} from '../../utils/questionSetQuiz';

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeQuiz'>;

type Phase = 'answering' | 'revealed';

function optionPalette(highlight: 'correct' | 'wrong' | null) {
  if (highlight === 'correct') {
    return { bg: lumen.quizCorrectBg, accent: lumen.lime };
  }
  if (highlight === 'wrong') {
    return { bg: lumen.quizWrongBg, accent: lumen.coral };
  }
  return null;
}

type OptionTileProps = {
  letter: string;
  text: string;
  highlight: 'correct' | 'wrong' | null;
  disabled: boolean;
  onPress: () => void;
};

function OptionTile({ letter, text, highlight, disabled, onPress }: OptionTileProps) {
  const palette = optionPalette(highlight);
  const showIcon = highlight !== null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View
        style={[
          styles.option,
          palette
            ? {
                backgroundColor: palette.bg,
                borderColor: palette.accent,
                borderWidth: 1.5,
              }
            : styles.optionIdle,
        ]}
      >
        <View
          style={[
            styles.optionLetter,
            palette
              ? { backgroundColor: palette.accent }
              : { backgroundColor: 'rgba(234,243,228,0.08)' },
          ]}
        >
          <Text style={[styles.optionLetterText, palette ? styles.optionLetterTextOn : null]}>
            {letter}
          </Text>
        </View>
        <Text style={styles.optionText}>{text}</Text>
        {showIcon ? (
          <Ionicons
            name={highlight === 'correct' ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={palette?.accent ?? lumen.fgMuted}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function revealSelection(
  question: QuestionSetQuestion,
  index: number,
): { selectedIndex: number; wasCorrect: boolean } {
  return {
    selectedIndex: index,
    wasCorrect: index === question.correct,
  };
}

export function KnowledgeQuizScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { questions, assessmentId: initialAssessmentId, setId, meta, startIndex = 0 } = route.params;
  const total = questions.length;

  const [activeAssessmentId, setActiveAssessmentId] = useState(initialAssessmentId);
  const [responses, setResponses] = useState<KnowledgeResponse[]>([]);
  const responsesRef = useRef<KnowledgeResponse[]>([]);
  const [questionIndex, setQuestionIndex] = useState(startIndex);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const savingRef = useRef(false);
  const assessmentIdRef = useRef(initialAssessmentId);

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  useEffect(() => {
    assessmentIdRef.current = activeAssessmentId;
  }, [activeAssessmentId]);

  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;

    void (async () => {
      const ensuredId = await ensureKnowledgeAssessment(
        user.uid,
        setId,
        assessmentIdRef.current,
      );
      if (cancelled || !ensuredId) return;

      setActiveAssessmentId(ensuredId);
      assessmentIdRef.current = ensuredId;

      const assessment = await fetchKnowledgeAssessmentById(ensuredId);
      if (cancelled || !assessment) return;

      setResponses(assessment.responses);
      responsesRef.current = assessment.responses;
      setQuestionIndex(assessment.responses.length);

      if (assessment.is_completed && total > 0) {
        resetToKnowledgeAnalysing(navigation, {
          assessmentId: ensuredId,
          setId,
          totalQuestions: total,
          meta,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [meta, navigation, setId, total, user?.uid]);

  const question = questions[questionIndex];
  const quizOptions = toQuizOptions(question.options);
  const progressPct = ((questionIndex + (phase === 'revealed' ? 1 : 0)) / total) * 100;
  const feedbackTone: 'correct' | 'wrong' = wasCorrect ? 'correct' : 'wrong';
  const explanationAccent = wasCorrect ? lumen.green : lumen.coral;

  const advance = useCallback(() => {
    if (questionIndex >= total - 1) {
      resetToKnowledgeAnalysing(navigation, {
        assessmentId: assessmentIdRef.current,
        setId,
        totalQuestions: total,
        meta,
      });
      return;
    }
    setQuestionIndex((i) => i + 1);
    setPhase('answering');
    setSelectedIndex(null);
    setWasCorrect(false);
    setTimedOut(false);
  }, [meta, navigation, questionIndex, setId, total]);

  const revealAnswer = useCallback(
    async (index: number, fromTimeout = false) => {
      if (phase !== 'answering' || !question) return;
      if (responsesRef.current.some((item) => item.questionId === question.id)) return;
      if (savingRef.current) return;

      const selection = revealSelection(question, index);
      setSelectedIndex(selection.selectedIndex);
      setWasCorrect(selection.wasCorrect);
      setTimedOut(fromTimeout && !selection.wasCorrect);
      setPhase('revealed');

      if (!user?.uid) return;

      savingRef.current = true;
      try {
        const saved = await appendKnowledgeResponse(
          user.uid,
          setId,
          assessmentIdRef.current,
          { question, selectedIndex: selection.selectedIndex },
          total,
          responsesRef.current,
        );
        if (saved) {
          setActiveAssessmentId(saved.assessmentId);
          assessmentIdRef.current = saved.assessmentId;
          setResponses(saved.assessment.responses);
          responsesRef.current = saved.assessment.responses;
        } else if (__DEV__) {
          console.warn('[knowledge] save failed — check Firestore rules for knowledge collection');
        }
      } finally {
        savingRef.current = false;
      }
    },
    [phase, question, setId, total, user?.uid],
  );

  const handleSelect = (index: number) => {
    void revealAnswer(index);
  };

  const handleTimeout = useCallback(() => {
    if (phase !== 'answering') return;
    void revealAnswer(-1, true);
  }, [phase, revealAnswer]);

  const getOptionHighlight = (index: number): 'correct' | 'wrong' | null => {
    if (phase !== 'revealed' || selectedIndex === null) {
      if (phase === 'revealed' && timedOut) {
        const isCorrect = index === question.correct;
        return isCorrect ? 'correct' : null;
      }
      return null;
    }

    const isPicked = selectedIndex === index;
    const isCorrect = index === question.correct;

    if (isPicked && isCorrect) return 'correct';
    if (isPicked && !isCorrect) return 'wrong';
    if (!isPicked && isCorrect && !wasCorrect) return 'correct';
    return null;
  };

  if (!question) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <View style={styles.progressHeader}>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>
              QUESTION {questionIndex + 1} / {total}
            </Text>
            <QuizQuestionTimer
              key={`${question.id}-${questionIndex}`}
              seconds={KNOWLEDGE_SECONDS_PER_QUESTION}
              active={phase === 'answering'}
              questionKey={question.id}
              onExpire={handleTimeout}
            />
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, Math.max(0, progressPct))}%` },
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.prompt}>{question.text}</Text>

          <View style={styles.options}>
            {quizOptions.map((option, index) => (
              <OptionTile
                key={`${question.id}-${option.letter}`}
                letter={option.letter}
                text={option.text}
                highlight={getOptionHighlight(index)}
                disabled={phase === 'revealed'}
                onPress={() => handleSelect(index)}
              />
            ))}
          </View>

          {phase === 'revealed' ? (
            <View style={styles.explanation}>
              <View style={[styles.explanationRule, { backgroundColor: explanationAccent }]} />
              <View style={styles.explanationCopy}>
                <Text style={[styles.explanationTitle, { color: explanationAccent }]}>
                  {wasCorrect ? 'Exactly right.' : timedOut ? "Time's up." : 'Not quite.'}
                </Text>
                {wasCorrect ? (
                  <Text style={styles.explanationBody}>{getExplanationCorrect(question)}</Text>
                ) : (
                  <Text style={styles.explanationBody}>
                    The correct answer is{' '}
                    <Text style={styles.explanationHighlight}>
                      {getExplanationWrong(question).highlight}
                    </Text>
                    {getExplanationWrong(question).text}
                  </Text>
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {phase === 'revealed' ? (
          <View style={styles.footer}>
            <Text style={styles.advanceLabel}>Next question in 2s</Text>
            <QuizAdvanceBar key={questionIndex} tone={feedbackTone} onComplete={advance} />
          </View>
        ) : null}
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
  progressHeader: {
    paddingHorizontal: 26,
    paddingTop: 8,
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    ...sora('bold'),
    fontSize: 12,
    letterSpacing: 1.92,
    color: lumen.fgMuted,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(234,243,228,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: lumenPillar.knowledge,
  },
  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 16,
    flexGrow: 1,
  },
  prompt: {
    ...sora('extrabold'),
    fontSize: 27,
    lineHeight: 32.4,
    letterSpacing: -0.54,
    color: lumen.fg,
  },
  options: {
    marginTop: 26,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  optionIdle: {
    backgroundColor: 'rgba(234,243,228,0.05)',
    borderWidth: 1,
    borderColor: lumen.hairline,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    ...sora('extrabold'),
    fontSize: 12,
    color: lumen.fgMuted,
  },
  optionLetterTextOn: {
    color: lumen.bgDark,
  },
  optionText: {
    ...sora('semibold'),
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: lumen.fg,
  },
  explanation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 18,
  },
  explanationRule: {
    width: 2,
    alignSelf: 'stretch',
    borderRadius: 1,
  },
  explanationCopy: {
    flex: 1,
  },
  explanationTitle: {
    ...sora('bold'),
    fontSize: 15,
  },
  explanationBody: {
    ...sora('semibold'),
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19.5,
    color: lumen.fgMuted,
  },
  explanationHighlight: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  footer: {
    paddingHorizontal: 26,
    paddingBottom: 22,
  },
  advanceLabel: {
    ...sora('bold'),
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1.68,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 10,
  },
});
