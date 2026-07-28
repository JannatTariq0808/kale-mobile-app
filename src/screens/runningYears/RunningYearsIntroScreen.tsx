import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KaleWordmarkWhite } from '../../components/lumen/KaleWordmarkWhite';
import { LumenButton } from '../../components/lumen/LumenButton';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { LongevityStackParamList } from '../../navigation/LongevityStackNavigator';
import { readRunningYearsGoal } from '../../services/runningYears/runningYearsStorage';
import { lumen, sora } from '../../theme';

const introImage = require('../../../assets/runner.jpg');
const { height: SCREEN_H } = Dimensions.get('window');
const PHOTO_HEIGHT = Math.round(SCREEN_H * 0.64);

type Props = NativeStackScreenProps<LongevityStackParamList, 'RunningYearsIntro'>;

export function RunningYearsIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();

  const dismiss = () => {
    navigation.navigate('Home');
  };

  const continueToGoal = () => {
    void (async () => {
      const goal = user?.uid ? await readRunningYearsGoal(user.uid) : null;
      navigation.replace(goal ? 'RunningYearsMain' : 'RunningYearsGoal');
    })();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.photo, { height: PHOTO_HEIGHT }]}>
        <ImageBackground
          source={introImage}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.photoImage}
          resizeMode="cover"
        />
      </View>

      <LinearGradient
        colors={[
          'rgba(0,60,58,0.30)',
          'rgba(0,60,58,0.05)',
          'rgba(0,55,54,0.55)',
          lumen.bgDark,
        ]}
        locations={[0, 0.26, 0.52, 0.74]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(0,40,40,0.45)', 'rgba(0,40,40,0)']}
        locations={[0, 0.22]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <KaleWordmarkWhite height={20} />
          <Pressable onPress={dismiss} hitSlop={12}>
            <Ionicons name="close" size={24} color="rgba(255,255,255,0.85)" />
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>YOUR RUNNING YEARS</Text>
          <Text style={styles.headline}>
            We don&apos;t train for the <Text style={styles.headlineAccent}>numbers</Text>.
          </Text>
          <Text style={styles.body}>
            We train for the people we want to keep showing up for. The 10k with the grandkids. The hike
            you&apos;ve always promised. The moments still ahead — and the years to reach them.
          </Text>
          <Text style={styles.callout}>
            Let&apos;s make them real.{' '}
            <Text style={styles.calloutAccent}>Start with what you&apos;re running for.</Text>
          </Text>
          <LumenButton tone="lime" onPress={continueToGoal} style={styles.cta}>
            Set your goal
          </LumenButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: lumen.bgDark },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  photoImage: {
    width: '112%',
    height: '108%',
    transform: [{ translateX: -24 }, { translateY: -28 }],
  },
  shell: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: { flex: 1 },
  copy: {
    paddingHorizontal: 28,
    paddingBottom: 26,
    gap: 0,
  },
  eyebrow: {
    ...sora('bold'),
    color: lumen.lime,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  headline: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1.2,
  },
  headlineAccent: { color: lumen.lime },
  body: {
    ...sora('regular'),
    color: 'rgba(234,243,228,0.82)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    maxWidth: 340,
  },
  callout: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 18,
    maxWidth: 340,
  },
  calloutAccent: { color: lumen.lime },
  cta: { marginTop: 24 },
});
