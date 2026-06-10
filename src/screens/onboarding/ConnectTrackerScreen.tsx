// Inspired by kale-mobile-design — ForestConnect / settings connection rows

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConnectionBrandIcon, type ConnectionBrand } from '../../components/lumen/ConnectionBrandIcon';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, sora } from '../../theme';

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
  /*if (Platform.OS === 'ios') {
    return [...BASE_TRACKERS, APPLE_HEALTH];
  }
  return BASE_TRACKERS;*/
  return [...BASE_TRACKERS, APPLE_HEALTH];
}

export function ConnectTrackerScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const trackers = getTrackerOptions();

  const handleConnect = (_brand: ConnectionBrand) => {
    // OAuth / HealthKit wiring comes later — continue onboarding for now.
    navigation.replace('CardioAnalysing');
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
          <LumEyebrow pillar="cardio" label="Cardio" step="Test 1 of 3" />

          <Text style={styles.headline}>
            Connect your <Text style={styles.headlineAccent}>apps</Text>.
          </Text>
          <Text style={styles.subhead}>
            We read runs and rides from the last 12 weeks to estimate your cardio fitness. We never
            read your private messages or contacts.
          </Text>

          <View style={styles.options}>
            {trackers.map((tracker) => (
              <Pressable
                key={tracker.id}
                onPress={() => handleConnect(tracker.id)}
                style={styles.optionRow}
                accessibilityRole="button"
                accessibilityLabel={`Connect ${tracker.name}`}
              >
                <ConnectionBrandIcon brand={tracker.id} />
                <View style={styles.optionCopy}>
                  <Text style={styles.optionName}>{tracker.name}</Text>
                  <Text style={styles.optionSubtitle}>{tracker.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={lumen.fgMuted} />
              </Pressable>
            ))}
          </View>

        </ScrollView>
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
  skipLink: {
    alignSelf: 'flex-start',
    marginTop: 18,
    paddingVertical: 4,
  },
  skipText: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
    textDecorationLine: 'underline',
  },
});
