import Constants from 'expo-constants';

export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

/** Native FCM/APNs requires a dev build — not supported in Expo Go (SDK 53+). */
export function supportsNativePush(): boolean {
  return !isExpoGo();
}
