import type { HeroBannerProps } from '../../generated/types';

export type HeroDisplayMode = HeroBannerProps['displayMode'];
export type HeroWidthMode = HeroBannerProps['widthMode'];
export type HeroHeightPreset = HeroBannerProps['heightPreset'];
export type HeroContentAlign = 'left' | 'center' | 'right';
export type HeroTextTone = 'light' | 'dark';

export type HeroSlide = {
  image: string;
  imageMobile: string;
  eyebrow: string;
  heading: string;
  description: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
  contentAlign: HeroContentAlign;
  textTone: HeroTextTone;
  overlayColor: string;
  overlayOpacity: number;
};

export type HeroLayoutConfig = Pick<
  HeroBannerProps,
  | 'displayMode'
  | 'widthMode'
  | 'heightPreset'
  | 'carouselLoop'
  | 'carouselAutoplay'
  | 'carouselAutoplayMs'
  | 'showCarouselArrows'
  | 'showCarouselDots'
  | 'openLinksInNewTab'
>;
