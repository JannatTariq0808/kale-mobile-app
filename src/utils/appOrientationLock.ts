import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

/** Phones stay portrait; iPad can rotate / split-view. */
export function defaultAppOrientationLock(): ScreenOrientation.OrientationLock {
  if (Platform.OS === 'ios' && Platform.isPad) {
    return ScreenOrientation.OrientationLock.DEFAULT;
  }
  return ScreenOrientation.OrientationLock.PORTRAIT_UP;
}
