import { SlideView } from './slide-view';
import type { HeroLayoutConfig, HeroSlide } from './types';

type SingleHeroProps = HeroLayoutConfig & {
  slide: HeroSlide;
  adaptImageSrc: string;
};

export function SingleHero(props: SingleHeroProps) {
  const { slide, widthMode, heightPreset, openLinksInNewTab, adaptImageSrc } = props;
  return (
    <SlideView
      slide={slide}
      widthMode={widthMode}
      heightPreset={heightPreset}
      adaptImageSrc={adaptImageSrc}
      openLinksInNewTab={openLinksInNewTab}
      priority
    />
  );
}
