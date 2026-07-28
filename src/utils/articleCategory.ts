import { lumen, lumenPillar } from '../theme';

export type ArticleCategoryStyle = {
  label: string;
  color: string;
  pillBg: string;
  pillFg: string;
};

function normalizeKey(category: string): string {
  return category.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
}

export function resolveArticleCategoryStyle(category: string): ArticleCategoryStyle {
  const key = normalizeKey(category);

  if (key.includes('longevity')) {
    return {
      label: 'LONGEVITY',
      color: lumen.lime,
      pillBg: lumen.lime,
      pillFg: lumen.bgDark,
    };
  }
  if (key.includes('cardio') || key.includes('running') || key.includes('fitness')) {
    return {
      label: 'CARDIO',
      color: lumenPillar.cardio,
      pillBg: 'rgba(0,200,150,0.18)',
      pillFg: lumenPillar.cardio,
    };
  }
  if (key.includes('nutrition') || key.includes('diet') || key.includes('protein')) {
    return {
      label: 'NUTRITION',
      color: lumenPillar.knowledge,
      pillBg: 'rgba(245,233,78,0.18)',
      pillFg: lumenPillar.knowledge,
    };
  }
  if (key.includes('recovery') || key.includes('sleep') || key.includes('rest')) {
    return {
      label: 'RECOVERY',
      color: lumenPillar.strength,
      pillBg: 'rgba(232,130,110,0.18)',
      pillFg: lumenPillar.strength,
    };
  }
  if (key.includes('strength')) {
    return {
      label: 'STRENGTH',
      color: lumenPillar.strength,
      pillBg: 'rgba(232,130,110,0.18)',
      pillFg: lumenPillar.strength,
    };
  }
  if (key.includes('knowledge')) {
    return {
      label: 'KNOWLEDGE',
      color: lumenPillar.knowledge,
      pillBg: 'rgba(245,233,78,0.18)',
      pillFg: lumenPillar.knowledge,
    };
  }

  const short = category.trim().split(/\s+/).slice(0, 2).join(' ').toUpperCase() || 'ARTICLE';
  return {
    label: short,
    color: lumen.mint,
    pillBg: 'rgba(0,200,150,0.18)',
    pillFg: lumen.mint,
  };
}
