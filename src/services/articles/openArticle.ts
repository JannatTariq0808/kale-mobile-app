import * as Linking from 'expo-linking';
import { articleBlogUrl } from '../../utils/articleUrls';

export async function openArticle(slug: string): Promise<void> {
  const url = articleBlogUrl(slug);
  await Linking.openURL(url);
}
