import type { SectionFeaturedCollectionProps } from '../../generated/types';

export type CollectionLayoutPreset = SectionFeaturedCollectionProps['layoutPreset'];

export type CollectionItem = {
  image: string;
  imageMobile: string;
  linkUrl: string;
  showCaptionCard: boolean;
  captionEyebrow: string;
  captionTitle: string;
  buttonLabel: string;
  buttonUrl: string;
};
