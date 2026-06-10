// Design: kale-mobile-design — lum-06 KaleKnowledgeIntroLumen (screens/KaleLumenOnboarding.jsx)

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { LumenButton } from '../../components/lumen/LumenButton';
import type { RootStackParamList } from '../../navigation/types';
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

  const handleStartQuiz = () => {
    navigation.navigate('KnowledgeQuiz');
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={lumen.fg} style={styles.backIcon} />
        </Pressable>

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
            One topic per quarter. Today we cover the basics — and build from there.
          </Text>

          <View style={styles.topicSection}>
            <Text style={styles.topicEyebrow}>Onboarding</Text>
            <Text style={styles.topicTitle}>General longevity</Text>
            <Text style={styles.topicBody}>
              Lifespan vs healthspan, the science of VO₂max, and why training fights ageing.
            </Text>
            <View style={styles.metaRow}>
              <TopicMeta label="20 questions" />
              <TopicMeta label="~5 min" />
            </View>
          </View>

          <Text style={styles.futureTitle}>Coming in future quarters</Text>
          <View style={styles.futureTags}>
            {FUTURE_TOPICS.map((topic) => (
              <View key={topic} style={styles.futureTag}>
                <Text style={styles.futureTagText}>{topic}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <LumenButton onPress={handleStartQuiz}>Start quiz</LumenButton>
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
  },
});
