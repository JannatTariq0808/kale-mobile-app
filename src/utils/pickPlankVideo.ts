import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export type PlankVideoPick = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  duration?: number | null;
};

/** Opens the device video library — AI analysis wired later */
export async function pickPlankVideo(): Promise<PlankVideoPick | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Video access needed',
      'Allow access to your video library so you can upload your plank recording.',
      permission.canAskAgain
        ? [{ text: 'OK' }]
        : [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => void Linking.openSettings() },
          ],
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['videos'],
    allowsEditing: false,
    quality: 1,
    videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
    duration: asset.duration,
  };
}
