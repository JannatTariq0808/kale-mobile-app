import type { ConfigContext, ExpoConfig } from 'expo/config';

/** Staging vs production — set via APP_VARIANT (EAS profile or local shell). */
const APP_VARIANT = process.env.APP_VARIANT === 'staging' ? 'staging' : 'production';
const IS_STAGING = APP_VARIANT === 'staging';

const PACKAGE_BASE = 'insure.kale.mobile';
const PACKAGE_NAME = IS_STAGING ? `${PACKAGE_BASE}.staging` : PACKAGE_BASE;
const BUNDLE_ID = PACKAGE_NAME;
const APP_NAME = IS_STAGING ? 'Kale Staging' : 'Kale';

const AUTH_HOST = 'www.kale.insure';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: 'kale-mobile-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  backgroundColor: '#082B25',
  userInterfaceStyle: 'dark',
  scheme: 'kale',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#082B25',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    associatedDomains: [`applinks:${AUTH_HOST}`, 'applinks:kale.insure'],
  },
  android: {
    backgroundColor: '#082B25',
    softwareKeyboardLayoutMode: 'pan',
    package: PACKAGE_NAME,
    adaptiveIcon: {
      backgroundColor: '#082B25',
      foregroundImage: './assets/android-icon-foreground.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          { scheme: 'https', host: AUTH_HOST, pathPrefix: '/reset-password' },
          { scheme: 'https', host: 'kale.insure', pathPrefix: '/reset-password' },
          { scheme: 'https', host: AUTH_HOST, pathPrefix: '/__/auth' },
          { scheme: 'https', host: 'kale.insure', pathPrefix: '/__/auth' },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#082B25',
        image: './assets/splash.png',
        resizeMode: 'cover',
      },
    ],
    [
      'expo-navigation-bar',
      {
        visibility: 'hidden',
        barStyle: 'dark',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Kale to access your videos to upload your plank recording.',
      },
    ],
    'expo-font',
    '@react-native-community/datetimepicker',
    [
      'expo-build-properties',
      {
        android: {
          ndkVersion: '27.0.12077973',
        },
      },
    ],
  ],
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'ceddc77d-354b-412f-beeb-01f57d1549fa',
    },
    appVariant: APP_VARIANT,
    authContinueUrl: `https://${AUTH_HOST}/reset-password`,
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
  },
});
