import { Container } from '../../components/ui/container';
import { cn } from '../../lib/utils';
import { HeroHeightShell } from './hero-height-shell';
import { SlideContent } from './slide-content';
import { SlideMedia } from './slide-media';
import type { HeroHeightPreset, HeroSlide, HeroWidthMode } from './types';

type SlideViewProps = {
  slide: HeroSlide;
  widthMode: HeroWidthMode;
  heightPreset: HeroHeightPreset;
  adaptImageSrc?: string;
  openLinksInNewTab: boolean;
  priority?: boolean;
  className?: string;
};

function SlideInner({
  slide,
  openLinksInNewTab,
  priority,
  contained,
}: {
  slide: HeroSlide;
  openLinksInNewTab: boolean;
  priority?: boolean;
  contained?: boolean;
}) {
  if (contained) {
    return (
      <>
        <SlideMedia slide={slide} priority={priority} />
        <div className="relative flex size-full items-center px-4 sm:px-6 lg:px-8">
          <SlideContent slide={slide} openLinksInNewTab={openLinksInNewTab} />
        </div>
      </>
    );
  }

  return (
    <>
      <SlideMedia slide={slide} priority={priority} />
      <Container className="relative flex w-full justify-start">
        <SlideContent slide={slide} openLinksInNewTab={openLinksInNewTab} />
      </Container>
    </>
  );
}

export function SlideView({
  slide,
  widthMode,
  heightPreset,
  adaptImageSrc,
  openLinksInNewTab,
  priority,
  className,
}: SlideViewProps) {
  const shell = (contained: boolean) => (
    <HeroHeightShell
      preset={heightPreset}
      adaptImageSrc={adaptImageSrc ?? slide.image}
      className={cn('flex items-center', contained && 'size-full')}
    >
      <SlideInner slide={slide} openLinksInNewTab={openLinksInNewTab} priority={priority} contained={contained} />
    </HeroHeightShell>
  );

  if (widthMode === 'contained') {
    return (
      <div data-slot="hero-slide" className={cn('w-full', className)}>
        <Container padding="default" className="py-4 md:py-6">
          <div className="relative overflow-hidden rounded-lg border border-border bg-muted">{shell(true)}</div>
        </Container>
      </div>
    );
  }

  return (
    <div data-slot="hero-slide" className={cn('relative w-full overflow-hidden', className)}>
      {shell(false)}
    </div>
  );
}
