import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { openArticle } from '../../services/articles/openArticle';
import type { Article } from '../../types/article';
import { resolveArticleCategoryStyle } from '../../utils/articleCategory';
import { lumen, sora } from '../../theme';

const HOME_LIST_PREVIEW = 3;
const PLACEHOLDER = require('../../../assets/icon.png') as ImageSourcePropType;

type ArticlesSectionProps = {
  articles: Article[];
  loading: boolean;
};

function ArticleImage({
  uri,
  style,
  iconSize = 28,
}: {
  uri?: string;
  style: object;
  iconSize?: number;
}) {
  const [failed, setFailed] = useState(false);
  const showRemote = Boolean(uri) && !failed;

  return (
    <View style={[styles.imageSlot, style]}>
      <Image source={PLACEHOLDER} style={styles.placeholderImage} resizeMode="contain" />
      {showRemote ? (
        <Image
          source={{ uri }}
          style={styles.remoteImage}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons name="image-outline" size={iconSize} color={lumen.fgFaint} />
        </View>
      )}
    </View>
  );
}

function FeaturedArticleCard({ article }: { article: Article }) {
  const { type, leading } = useResponsiveLayout();
  const category = resolveArticleCategoryStyle(article.category);

  return (
    <Pressable
      onPress={() => void openArticle(article.slug)}
      style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}
      accessibilityRole="link"
      accessibilityLabel={`${article.title}, ${article.readTime}`}
    >
      <View style={styles.featuredImageWrap}>
        <ArticleImage uri={article.heroImage} style={styles.featuredImage} iconSize={36} />
        <View style={[styles.featuredPill, { backgroundColor: category.pillBg }]}>
          <Text
            style={[
              styles.featuredPillText,
              { fontSize: type(9), lineHeight: leading(type(9), 1.2), color: category.pillFg },
            ]}
          >
            {category.label}
          </Text>
        </View>
      </View>
      <Text style={[styles.featuredTitle, { fontSize: type(18), lineHeight: leading(type(18), 1.25) }]}>
        {article.title}
      </Text>
      <Text style={[styles.featuredMeta, { fontSize: type(12), lineHeight: leading(type(12)) }]}>
        {article.author} · {article.readTime}
      </Text>
    </Pressable>
  );
}

function ArticleListRow({ article }: { article: Article }) {
  const { type, leading } = useResponsiveLayout();
  const category = resolveArticleCategoryStyle(article.category);

  return (
    <Pressable
      onPress={() => void openArticle(article.slug)}
      style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
      accessibilityRole="link"
      accessibilityLabel={`${article.title}, ${article.readTime}`}
    >
      <View style={styles.thumbWrap}>
        <ArticleImage uri={article.heroImage} style={styles.thumbImage} iconSize={18} />
        <View style={[styles.thumbDot, { backgroundColor: category.color }]} />
      </View>
      <View style={styles.listCopy}>
        <Text
          style={[
            styles.listCategory,
            { fontSize: type(10), lineHeight: leading(type(10), 1.2), color: category.color },
          ]}
        >
          {category.label}
        </Text>
        <Text
          style={[styles.listTitle, { fontSize: type(14), lineHeight: leading(type(14), 1.3) }]}
          numberOfLines={2}
        >
          {article.title}
        </Text>
        <Text style={[styles.listMeta, { fontSize: type(11), lineHeight: leading(type(11)) }]}>
          {article.readTime}
        </Text>
      </View>
    </Pressable>
  );
}

export function ArticlesSection({ articles, loading }: ArticlesSectionProps) {
  const { type } = useResponsiveLayout();
  const [expanded, setExpanded] = useState(false);

  const featured = articles[0] ?? null;
  const listArticles = useMemo(() => {
    const rest = articles.slice(1);
    if (expanded) return rest;
    return rest.slice(0, HOME_LIST_PREVIEW);
  }, [articles, expanded]);

  const canExpand = articles.length > HOME_LIST_PREVIEW + 1;

  if (loading && articles.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: type(18) }]}>Latest</Text>
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={lumen.lime} />
        </View>
      </View>
    );
  }

  if (!featured) return null;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { fontSize: type(18) }]}>Latest</Text>
        {canExpand ? (
          <Pressable
            onPress={() => setExpanded((value) => !value)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Show fewer articles' : 'See all articles'}
          >
            <Text style={[styles.seeAll, { fontSize: type(13) }]}>
              {expanded ? 'Show less' : 'See all'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <FeaturedArticleCard article={featured} />

      {listArticles.length > 0 ? (
        <View style={styles.listWrap}>
          {listArticles.map((article) => (
            <ArticleListRow key={article.id} article={article} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -0.3,
  },
  seeAll: {
    ...sora('bold'),
    color: lumen.lime,
  },
  loaderWrap: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  featuredCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.05)',
    overflow: 'hidden',
  },
  featuredImageWrap: {
    position: 'relative',
    height: 168,
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  featuredPillText: {
    ...sora('bold'),
    letterSpacing: 0.8,
  },
  featuredTitle: {
    ...sora('bold'),
    color: lumen.fg,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  featuredMeta: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  listWrap: {
    marginTop: 12,
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  thumbWrap: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  thumbDot: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  listCategory: {
    ...sora('bold'),
    letterSpacing: 0.8,
  },
  listTitle: {
    ...sora('bold'),
    color: lumen.fg,
  },
  listMeta: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  imageSlot: {
    overflow: 'hidden',
    backgroundColor: 'rgba(234,243,228,0.04)',
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.12,
  },
  remoteImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234,243,228,0.03)',
  },
  pressed: {
    opacity: 0.88,
  },
});
