import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
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
const TAB_BAR_BG = '#00343499';
const TAB_ICON_SIZE = 22;
const TAB_LABEL_SIZE = 11;
const TAB_ICON_LABEL_GAP = 0;
const TAB_LABEL_LINE_HEIGHT = 20;
/** Equal space above icons and below labels (safe-area inset is extra, below this). */
const TAB_VERTICAL_PADDING = 12;
const TAB_BAR_CONTENT_HEIGHT =
  TAB_ICON_SIZE + TAB_ICON_LABEL_GAP + TAB_LABEL_LINE_HEIGHT;
/** Active tab — design lime (#CCFA7D) */
const TAB_ACTIVE_COLOR = lumen.lime;
const TAB_INACTIVE_COLOR = lumen.fgMuted;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    width: '100%',
    backgroundColor: lumen.bgDark,
    overflow: 'hidden',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TAB_BAR_BG,
  },
  iconWrap: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** RN defaults to flex-start + 5px padding — leaves extra space below labels. */
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
  },
  tabLabel: {
    marginTop: TAB_ICON_LABEL_GAP,
    fontSize: TAB_LABEL_SIZE,
    lineHeight: TAB_LABEL_LINE_HEIGHT,
  },
});

function getTabBarLayout(bottomInset: number) {
  const paddingTop = TAB_VERTICAL_PADDING;
  // Visual padding below labels, then home-indicator inset below the bar content.
  const paddingBottom = TAB_VERTICAL_PADDING + bottomInset;

  return {
    height: TAB_BAR_CONTENT_HEIGHT + paddingTop + paddingBottom,
    paddingTop,
    paddingBottom,
  };
}

function TabBarButton({ style, ...rest }: BottomTabBarButtonProps) {
  return <PlatformPressable {...rest} style={[style, styles.tabBarButton]} />;
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
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarItemStyle: {
          paddingVertical: 0,
          marginVertical: 0,
        },
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopColor: lumen.hairline,
          borderTopWidth: 1,
          height: tabBarLayout.height,
          paddingTop: tabBarLayout.paddingTop,
          paddingBottom: tabBarLayout.paddingBottom,
          paddingHorizontal: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: () => <TabBarIconForRoute routeName={route.name} />,
        tabBarLabel: ({ focused, children }) => (
          <Text
            style={[
              styles.tabLabel,
              focused ? sora('bold') : sora('semibold'),
              { color: tabItemColor(focused) },
            ]}
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
