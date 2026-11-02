import type { SectionFeaturedCollectionProps } from '../../generated/types';
import type { CollectionItem } from './types';

function readItem(props: SectionFeaturedCollectionProps, index: 1 | 2 | 3 | 4): CollectionItem {
  const p = `item${index}` as const;
  return {
    image: (props[`${p}Image` as keyof SectionFeaturedCollectionProps] as string).trim(),
    imageMobile: (props[`${p}ImageMobile` as keyof SectionFeaturedCollectionProps] as string).trim(),
    linkUrl: (props[`${p}LinkUrl` as keyof SectionFeaturedCollectionProps] as string).trim(),
    showCaptionCard: props[`${p}ShowCaptionCard` as keyof SectionFeaturedCollectionProps] as boolean,
    captionEyebrow: (props[`${p}CaptionEyebrow` as keyof SectionFeaturedCollectionProps] as string).trim(),
    captionTitle: (props[`${p}CaptionTitle` as keyof SectionFeaturedCollectionProps] as string).trim(),
    buttonLabel: (props[`${p}ButtonLabel` as keyof SectionFeaturedCollectionProps] as string).trim(),
    buttonUrl: (props[`${p}ButtonUrl` as keyof SectionFeaturedCollectionProps] as string).trim(),
  };
}

export function hasCollectionItemContent(item: CollectionItem): boolean {
  const hasImage = !!(item.image || item.imageMobile);
  const hasCaption = !!(item.showCaptionCard && (item.captionEyebrow || item.captionTitle));
  const hasButton = !!(item.buttonLabel && item.buttonUrl);
  return hasImage || hasCaption || hasButton;
}

export function normalizeCollectionItems(
  props: SectionFeaturedCollectionProps,
  limit: number,
): CollectionItem[] {
  return ([1, 2, 3, 4] as const)
    .slice(0, limit)
    .map((i) => readItem(props, i))
    .filter(hasCollectionItemContent);
}
