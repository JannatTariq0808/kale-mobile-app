import { useEffect } from 'react';
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumenBackground } from '../components/lumen/LumenBackground';
import { LumTabIcon, LumTabIconName } from '../components/lumen/LumTabIcon';
import { prefetchArticles } from '../hooks/useArticles';
import { prefetchFitnessPillarData } from '../hooks/useFitnessPillarData';
import { prefetchHomeLongevityData } from '../hooks/useHomeLongevityData';
import { prefetchIncomeProtection, useIncomeProtection } from '../hooks/useIncomeProtection';
import { prefetchKalettesRewards } from '../hooks/useKalettesRewards';
import { prefetchSettingsData } from '../hooks/useSettingsData';
import { useAuthSession } from '../hooks/useAuthSession';
import { lumen, sora } from '../theme';
import { FitnessScreen } from '../screens/FitnessScreen';
import { KalettesStackNavigator } from './KalettesStackNavigator';
import { LongevityStackNavigator } from './LongevityStackNavigator';
import { shouldHideTabBarForLongevityRoute } from './longevityTabBar';
import { framed } from './framedScreen';
import { GoalsStackNavigator, shouldHideTabBarForGoalsRoute } from './GoalsStackNavigator';
import { PolicyStackNavigator, shouldHideTabBarForPolicyRoute } from './PolicyStackNavigator';
import { SettingsStackNavigator } from './SettingsStackNavigator';

export type TabParamList = {
  Longevity: undefined;
  Fitness: undefined;
  /** Life customers */
  Kalettes: undefined;
  Settings: undefined;
  /** Income Protection customers — Lumen for IP tab bar: Home, Fitness, Goals, Store, Policy */
  Goals: undefined;
  Store: undefined;
  Policy: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabIcons: Record<keyof TabParamList, LumTabIconName> = {
  Longevity: 'home',
  Fitness: 'pulse',
  Kalettes: 'gift',
  Settings: 'gear',
  Goals: 'target',
  Store: 'bag',
  Policy: 'shield',
};

const TAB_BAR_BG = '#00343499';
const TAB_ICON_SIZE = 22;
const TAB_LABEL_SIZE = 11;
const TAB_ICON_LABEL_GAP = 0;
const TAB_LABEL_LINE_HEIGHT = 20;
const TAB_VERTICAL_PADDING = 12;
const TAB_BAR_CONTENT_HEIGHT =
  TAB_ICON_SIZE + TAB_ICON_LABEL_GAP + TAB_LABEL_LINE_HEIGHT;
const TAB_ACTIVE_COLOR = lumen.lime;
const TAB_INACTIVE_COLOR = lumen.fgMuted;

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
  },
  scene: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: TAB_BAR_BG,
  },
  iconWrap: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
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

const HIDDEN_TAB_BAR = { display: 'none', height: 0, minHeight: 0, overflow: 'hidden' } as const;

function getTabBarLayout(bottomInset: number) {
  const paddingTop = TAB_VERTICAL_PADDING;
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

function FitnessDataPrefetch() {
  const { user } = useAuthSession();

  useEffect(() => {
    prefetchFitnessPillarData(user?.uid);
    prefetchHomeLongevityData(user?.uid);
    prefetchArticles();
    prefetchSettingsData(user?.uid);
    prefetchIncomeProtection(user?.uid);
    prefetchKalettesRewards(user?.uid);
    void import('../services/kalettes/fetchRewardsProducts').then(({ fetchRewardsProducts }) =>
      fetchRewardsProducts(),
    );
  }, [user?.uid]);

  return null;
}

function tabItemColor(focused: boolean) {
  return focused ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR;
}

/** IP customers open the Store on the marketplace; the Kalettes balance is not part of IP. */
function StoreStackNavigator() {
  return <KalettesStackNavigator initialRouteName="Marketplace" />;
}

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { isIpCustomer } = useIncomeProtection();
  const bottomInset = Math.max(insets.bottom, 0);
  const tabBarLayout = getTabBarLayout(bottomInset);
  const defaultTabBarStyle = {
    backgroundColor: TAB_BAR_BG,
    borderTopColor: lumen.hairline,
    borderTopWidth: 1,
    height: tabBarLayout.height,
    paddingTop: tabBarLayout.paddingTop,
    paddingBottom: tabBarLayout.paddingBottom,
    paddingHorizontal: 12,
    elevation: 0,
    shadowOpacity: 0,
  } as const;

  return (
    <View style={styles.shell}>
      <LumenBackground />
      <FitnessDataPrefetch />
      <Tab.Navigator
        initialRouteName="Longevity"
        screenOptions={({ route }) => ({
          headerShown: false,
          animation: 'none',
          sceneStyle: styles.scene,
          tabBarActiveTintColor: TAB_ACTIVE_COLOR,
          tabBarInactiveTintColor: TAB_INACTIVE_COLOR,
          tabBarBackground: () => <View style={styles.tabBarBackground} />,
          tabBarButton: (props) => <TabBarButton {...props} />,
          tabBarItemStyle: {
            paddingVertical: 0,
            marginVertical: 0,
          },
          tabBarStyle: defaultTabBarStyle,
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <LumTabIcon name={tabIcons[route.name]} color={tabItemColor(focused)} />
            </View>
          ),
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
        <Tab.Screen
          name="Longevity"
          component={LongevityStackNavigator}
          options={({ route }) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'Home';
            const hideTabBar = shouldHideTabBarForLongevityRoute(focusedRoute);
            return {
              title: isIpCustomer ? 'Home' : 'Longevity',
              tabBarStyle: hideTabBar ? HIDDEN_TAB_BAR : defaultTabBarStyle,
            };
          }}
        />
        <Tab.Screen name="Fitness" component={framed(FitnessScreen)} />
        {isIpCustomer ? (
          <>
            <Tab.Screen
              name="Goals"
              component={GoalsStackNavigator}
              options={({ route }) => {
                const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'GoalsHome';
                return {
                  tabBarStyle: shouldHideTabBarForGoalsRoute(focusedRoute)
                    ? HIDDEN_TAB_BAR
                    : defaultTabBarStyle,
                };
              }}
            />
            <Tab.Screen name="Store" component={StoreStackNavigator} />
            <Tab.Screen
              name="Policy"
              component={PolicyStackNavigator}
              options={({ route }) => {
                const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'Policy';
                const hideTabBar = shouldHideTabBarForPolicyRoute(focusedRoute);
                return {
                  tabBarStyle: hideTabBar ? HIDDEN_TAB_BAR : defaultTabBarStyle,
                };
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen name="Kalettes" component={KalettesStackNavigator} />
            <Tab.Screen name="Settings" component={SettingsStackNavigator} />
          </>
        )}
      </Tab.Navigator>
    </View>
  );
}
