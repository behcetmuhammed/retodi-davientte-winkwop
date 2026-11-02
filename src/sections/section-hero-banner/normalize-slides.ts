import type { HeroBannerProps } from '../../generated/types';
import { clamp } from '../../lib/utils';
import type { HeroSlide } from './types';

function readSlide(props: HeroBannerProps, index: 1 | 2 | 3 | 4): HeroSlide | null {
  const p = `slide${index}` as const;
  const image = (props[`${p}Image` as keyof HeroBannerProps] as string).trim();
  if (!image) return null;

  return {
    image,
    imageMobile: (props[`${p}ImageMobile` as keyof HeroBannerProps] as string).trim(),
    eyebrow: (props[`${p}Eyebrow` as keyof HeroBannerProps] as string).trim(),
    heading: (props[`${p}Heading` as keyof HeroBannerProps] as string).trim(),
    description: (props[`${p}Description` as keyof HeroBannerProps] as string).trim(),
    primaryLabel: (props[`${p}PrimaryLabel` as keyof HeroBannerProps] as string).trim(),
    primaryUrl: (props[`${p}PrimaryUrl` as keyof HeroBannerProps] as string).trim(),
    secondaryLabel: (props[`${p}SecondaryLabel` as keyof HeroBannerProps] as string).trim(),
    secondaryUrl: (props[`${p}SecondaryUrl` as keyof HeroBannerProps] as string).trim(),
    contentAlign: props[`${p}ContentAlign` as keyof HeroBannerProps] as HeroSlide['contentAlign'],
    textTone: props[`${p}TextTone` as keyof HeroBannerProps] as HeroSlide['textTone'],
    overlayColor: (props[`${p}OverlayColor` as keyof HeroBannerProps] as string).trim(),
    overlayOpacity: clamp(Number(props[`${p}OverlayOpacity` as keyof HeroBannerProps]) || 40, 0, 90),
  };
}

export function normalizeSlides(props: HeroBannerProps): HeroSlide[] {
  return ([1, 2, 3, 4] as const).map((i) => readSlide(props, i)).filter((s): s is HeroSlide => s !== null);
}

export function pickLayoutConfig(props: HeroBannerProps) {
  return {
    displayMode: props.displayMode,
    widthMode: props.widthMode,
    heightPreset: props.heightPreset,
    carouselLoop: props.carouselLoop,
    carouselAutoplay: props.carouselAutoplay,
    carouselAutoplayMs: props.carouselAutoplayMs,
    showCarouselArrows: props.showCarouselArrows,
    showCarouselDots: props.showCarouselDots,
    openLinksInNewTab: props.openLinksInNewTab,
    primaryButtonStyle: props.primaryButtonStyle,
    secondaryButtonStyle: props.secondaryButtonStyle,
  };
}
