import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';
import { useMounted } from '../../hooks/use-mounted';
import { cn } from '../../lib/utils';
import { SlideView } from './slide-view';
import type { HeroLayoutConfig, HeroSlide } from './types';

type CarouselHeroProps = HeroLayoutConfig & {
  slides: HeroSlide[];
  adaptImageSrc: string;
};

export function CarouselHero(props: CarouselHeroProps) {
  const {
    slides,
    widthMode,
    heightPreset,
    openLinksInNewTab,
    carouselLoop,
    carouselAutoplay,
    carouselAutoplayMs,
    showCarouselArrows,
    showCarouselDots,
    adaptImageSrc,
    primaryButtonStyle,
    secondaryButtonStyle,
  } = props;

  const mounted = useMounted();
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [mounted]);

  const autoplay = carouselAutoplay && !reduceMotion ? carouselAutoplayMs : undefined;

  return (
    <Carousel loop={carouselLoop} autoplay={autoplay} className="w-full">
      <CarouselContent className={cn('ml-0 gap-0', widthMode === 'contained' && 'px-0')} viewportClassName="w-full">
        {slides.map((slide, index) => (
          <CarouselItem key={`${slide.image}-${index}`} className="basis-full pl-0">
            <SlideView
              slide={slide}
              widthMode={widthMode}
              heightPreset={heightPreset}
              adaptImageSrc={adaptImageSrc}
              openLinksInNewTab={openLinksInNewTab}
              primaryButtonStyle={primaryButtonStyle}
              secondaryButtonStyle={secondaryButtonStyle}
              priority={index === 0}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {showCarouselArrows && slides.length > 1 ? (
        <>
          <CarouselPrevious className="z-20 size-7 md:size-8 [&_svg]:size-3.5 md:[&_svg]:size-4" />
          <CarouselNext className="z-20 size-7 md:size-8 [&_svg]:size-3.5 md:[&_svg]:size-4" />
        </>
      ) : null}
      {showCarouselDots && slides.length > 1 ? (
        <CarouselDots className="absolute bottom-4 left-0 z-20 w-full md:bottom-6" />
      ) : null}
    </Carousel>
  );
}
