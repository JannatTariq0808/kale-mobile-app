import { copyAsync, cacheDirectory } from 'expo-file-system/legacy';

/** Gallery URIs (content://) need copying before expo-video-thumbnails can read them on Android. */
export async function ensureLocalVideoUri(uri: string): Promise<string> {
  if (uri.startsWith('file://') || !cacheDirectory) {
    return uri;
  }

  const dest = `${cacheDirectory}plank-review-${Date.now()}.mp4`;
  await copyAsync({ from: uri, to: dest });
  return dest;
}
