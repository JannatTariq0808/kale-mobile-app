import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumTabIcon, LumTabIconName } from '../components/lumen/LumTabIcon';
import { lumen, sora } from '../theme';
import { FitnessScreen } from '../screens/FitnessScreen';
import { KalettesScreen } from '../screens/KalettesScreen';
import { LongevityScreen } from '../screens/LongevityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type TabParamList = {
  Longevity: undefined;
  Fitness: undefined;
  Kalettes: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabIcons: Record<keyof TabParamList, LumTabIconName> = {
  Longevity: 'home',
  Fitness: 'pulse',
  Kalettes: 'gift',
  Settings: 'gear',
};

/** LumTabBar — kale-mobile-design/screens/KaleLumenApp.jsx */
const TAB_BAR_BG = 'rgba(8, 43, 37, 0.98)';
const TAB_BAR_CONTENT_HEIGHT = 64;
const TAB_BAR_MIN_BOTTOM = 6;
/** Active tab — white/cream foreground on dark bar */
const TAB_ACTIVE_COLOR = lumen.fg;
const TAB_INACTIVE_COLOR = lumen.fgMuted;

const styles = StyleSheet.create({
  scene: {
    backgroundColor: lumen.bgDark,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TAB_BAR_BG,
  },
  iconWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function getTabBarLayout(bottomInset: number) {
  const paddingBottom = Math.max(bottomInset, TAB_BAR_MIN_BOTTOM);

  return {
    height: TAB_BAR_CONTENT_HEIGHT + paddingBottom,
    paddingBottom,
  };
}

function tabItemColor(focused: boolean) {
  return focused ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR;
}

function TabBarIconForRoute({ routeName }: { routeName: keyof TabParamList }) {
  const isFocused = useNavigationState((state) => state.routes[state.index]?.name === routeName);

  return (
    <View style={styles.iconWrap}>
      <LumTabIcon name={tabIcons[routeName]} color={tabItemColor(isFocused)} />
    </View>
  );
}

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 0);
  const tabBarLayout = getTabBarLayout(bottomInset);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: styles.scene,
        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: TAB_INACTIVE_COLOR,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopColor: lumen.hairline,
          borderTopWidth: 1,
          height: tabBarLayout.height,
          paddingBottom: tabBarLayout.paddingBottom,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: () => <TabBarIconForRoute routeName={route.name} />,
        tabBarLabel: ({ focused, children }) => (
          <Text
            style={{
              marginTop: 4,
              fontSize: 11,
              ...(focused ? sora('bold') : sora('semibold')),
              color: tabItemColor(focused),
            }}
          >
            {children}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Longevity" component={LongevityScreen} />
      <Tab.Screen name="Fitness" component={FitnessScreen} />
      <Tab.Screen name="Kalettes" component={KalettesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
