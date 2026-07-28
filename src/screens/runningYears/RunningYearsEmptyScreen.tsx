import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import type { LongevityStackParamList } from '../../navigation/LongevityStackNavigator';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<LongevityStackParamList, 'RunningYearsEmpty'>;

function openConnectTracker(navigation: Props['navigation']) {
  const root = navigation.getParent()?.getParent();
  if (root) {
    root.navigate('ConnectTracker' as keyof RootStackParamList);
  }
}

export function RunningYearsEmptyScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <LumenHeader />
      </View>

      <Pressable onPress={() => navigation.navigate('Home')} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color={lumen.fg} />
      </Pressable>

      <ScreenScroll contentContainerStyle={styles.content}>
        <View style={styles.dashedRing} />
        <Text style={styles.title}>Your Running Years</Text>
        <Text style={styles.copy}>
          Connect a tracker or enter resting heart rate to see how many strong running years you have
          ahead — and how training keeps them.
        </Text>
        <LumenButton onPress={() => openConnectTracker(navigation)}>Connect Garmin or Strava</LumenButton>
        <Pressable onPress={() => navigation.navigate('RunningYearsGoal')} style={styles.secondary}>
          <Text style={styles.secondaryText}>Set your goal first</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  back: { paddingHorizontal: 20, marginBottom: 8 },
  content: { alignItems: 'center', gap: 16, paddingTop: 24 },
  dashedRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(204,250,125,0.35)',
    borderStyle: 'dashed',
  },
  title: { ...sora('bold'), color: lumen.fg, fontSize: 24, textAlign: 'center' },
  copy: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  secondary: { alignItems: 'center', paddingVertical: 10 },
  secondaryText: { ...sora('regular'), color: lumen.lime, fontSize: 14 },
});
