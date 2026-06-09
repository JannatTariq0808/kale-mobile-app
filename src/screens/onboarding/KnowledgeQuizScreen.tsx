// Design: kale-mobile-design — lum-07 KaleQuizQuestionLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuizAdvanceBar } from '../../components/lumen/QuizAdvanceBar';
import { LumenWelcomeBackground } from '../../components/lumen/LumenWelcomeBackground';
import { KNOWLEDGE_QUIZ_QUESTIONS } from '../../data/knowledgeQuizQuestions';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, lumenPillar, sora } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeQuiz'>;

type Phase = 'answering' | 'revealed';

function toneColor(tone: 'correct' | 'wrong' | null) {
  if (tone === 'correct') return lumen.lime;
  if (tone === 'wrong') return lumen.coral;
  return null;
}

function hexWithAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type OptionTileProps = {
  letter: string;
  text: string;
  highlight: 'correct' | 'wrong' | null;
  disabled: boolean;
  onPress: () => void;
};

function OptionTile({ letter, text, highlight, disabled, onPress }: OptionTileProps) {
  const color = toneColor(highlight);
  const showIcon = highlight !== null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.option,
        color
          ? {
              backgroundColor: hexWithAlpha(color, 0.13),
              borderColor: color,
              borderWidth: 1.5,
            }
          : styles.optionIdle,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View
        style={[
          styles.optionLetter,
          color
            ? { backgroundColor: color }
            : { backgroundColor: 'rgba(234,243,228,0.08)' },
        ]}
      >
        <Text style={[styles.optionLetterText, color ? styles.optionLetterTextOn : null]}>
          {letter}
        </Text>
      </View>
      <Text style={styles.optionText}>{text}</Text>
      {showIcon ? (
        <Ionicons
          name={highlight === 'correct' ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={color ?? lumen.fgMuted}
        />
      ) : null}
    </Pressable>
  );
}

export function KnowledgeQuizScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const total = KNOWLEDGE_QUIZ_QUESTIONS.length;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);

  const question = KNOWLEDGE_QUIZ_QUESTIONS[questionIndex];
  const progressPct = ((questionIndex + (phase === 'revealed' ? 1 : 0)) / total) * 100;
  const feedbackTone: 'correct' | 'wrong' = wasCorrect ? 'correct' : 'wrong';
  const explanationAccent = wasCorrect ? lumen.green : lumen.coral;

  const advance = useCallback(() => {
    if (questionIndex >= total - 1) {
      navigation.replace('KnowledgeAnalysing');
      return;
    }
    setQuestionIndex((i) => i + 1);
    setPhase('answering');
    setSelectedIndex(null);
    setWasCorrect(false);
  }, [navigation, questionIndex, total]);

  const handleSelect = (index: number) => {
    if (phase !== 'answering') return;
    const correct = index === question.correctIndex;
    setSelectedIndex(index);
    setWasCorrect(correct);
    setPhase('revealed');
  };

  const getOptionHighlight = (index: number): 'correct' | 'wrong' | null => {
    if (phase !== 'revealed' || selectedIndex === null) return null;

    const isPicked = selectedIndex === index;
    const isCorrect = index === question.correctIndex;

    if (isPicked && isCorrect) return 'correct';
    if (isPicked && !isCorrect) return 'wrong';
    if (!isPicked && isCorrect && !wasCorrect) return 'correct';
    return null;
  };

  return (
    <View style={styles.screen}>
      <LumenWelcomeBackground />
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
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="End quiz"
            >
              <Text style={styles.endQuiz}>End quiz</Text>
            </Pressable>
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
          <Text style={styles.prompt}>{question.prompt}</Text>

          <View style={styles.options}>
            {question.options.map((option, index) => (
              <OptionTile
                key={option.letter}
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
                  {wasCorrect ? 'Exactly right.' : 'Not quite.'}
                </Text>
                {wasCorrect ? (
                  <Text style={styles.explanationBody}>{question.explanationCorrect}</Text>
                ) : (
                  <Text style={styles.explanationBody}>
                    The correct answer is{' '}
                    <Text style={styles.explanationHighlight}>
                      {question.explanationWrong.highlight}
                    </Text>
                    {question.explanationWrong.text}
                  </Text>
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {phase === 'revealed' ? (
          <View style={styles.footer}>
            <Text style={styles.advanceLabel}>Next question in 2s</Text>
            <QuizAdvanceBar
              key={questionIndex}
              tone={feedbackTone}
              onComplete={advance}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
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
  endQuiz: {
    ...sora('semibold'),
    fontSize: 13,
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
