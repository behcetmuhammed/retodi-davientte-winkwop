import type { SectionMediaGridProps } from '../../generated/types';
import type { MediaGridItem } from './types';

function readItem(props: SectionMediaGridProps, index: 1 | 2 | 3 | 4 | 5 | 6): MediaGridItem {
  const p = `item${index}` as const;
  const columnRaw = props[`${p}ColumnSpan` as keyof SectionMediaGridProps] as string;

  return {
    mediaType: props[`${p}MediaType` as keyof SectionMediaGridProps] as MediaGridItem['mediaType'],
    image: (props[`${p}Image` as keyof SectionMediaGridProps] as string).trim(),
    imageMobile: (props[`${p}ImageMobile` as keyof SectionMediaGridProps] as string).trim(),
    videoUrl: (props[`${p}VideoUrl` as keyof SectionMediaGridProps] as string).trim(),
    videoUrlMobile: (props[`${p}VideoUrlMobile` as keyof SectionMediaGridProps] as string).trim(),
    columnSpan: parseInt(columnRaw, 10) || 4,
    rowSpan: Number(props[`${p}RowSpan` as keyof SectionMediaGridProps]) || 1,
    position: props[`${p}Position` as keyof SectionMediaGridProps] as MediaGridItem['position'],
    subTitle: (props[`${p}SubTitle` as keyof SectionMediaGridProps] as string).trim(),
    title: (props[`${p}Title` as keyof SectionMediaGridProps] as string).trim(),
    content: (props[`${p}Content` as keyof SectionMediaGridProps] as string).trim(),
    titleColor: (props[`${p}TitleColor` as keyof SectionMediaGridProps] as string).trim(),
    subTitleColor: (props[`${p}SubTitleColor` as keyof SectionMediaGridProps] as string).trim(),
    buttonLabel: (props[`${p}ButtonLabel` as keyof SectionMediaGridProps] as string).trim(),
    buttonUrl: (props[`${p}ButtonUrl` as keyof SectionMediaGridProps] as string).trim(),
    openLinkInNewTab: props[`${p}OpenLinkInNewTab` as keyof SectionMediaGridProps] as boolean,
    showImageOverlay: props[`${p}ShowImageOverlay` as keyof SectionMediaGridProps] as boolean,
  };
}

export function hasMediaGridItemContent(item: MediaGridItem): boolean {
  const hasImage = !!(item.image || item.imageMobile);
  const hasVideo = !!(item.videoUrl || item.videoUrlMobile);
  const hasMedia = item.mediaType === 'video' ? hasVideo || hasImage : hasImage || hasVideo;

  const hasText = !!(item.title || item.subTitle || item.content || item.buttonLabel);

  return hasMedia || hasText;
}

export function normalizeMediaGridItems(props: SectionMediaGridProps): MediaGridItem[] {
  return ([1, 2, 3, 4, 5, 6] as const)
    .map((i) => readItem(props, i))
    .filter(hasMediaGridItemContent);
}
