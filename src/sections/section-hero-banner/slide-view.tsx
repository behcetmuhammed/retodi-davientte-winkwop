import { Container } from '../../components/ui/container';
import { cn } from '../../lib/utils';
import { HeroHeightShell } from './hero-height-shell';
import { SlideContent } from './slide-content';
import { SlideMedia } from './slide-media';
import type { HeroHeightPreset, HeroLayoutConfig, HeroSlide, HeroWidthMode } from './types';

type SlideViewProps = {
  slide: HeroSlide;
  widthMode: HeroWidthMode;
  heightPreset: HeroHeightPreset;
  adaptImageSrc?: string;
  openLinksInNewTab: boolean;
  primaryButtonStyle: HeroLayoutConfig['primaryButtonStyle'];
  secondaryButtonStyle: HeroLayoutConfig['secondaryButtonStyle'];
  priority?: boolean;
  className?: string;
};

function SlideInner({
  slide,
  openLinksInNewTab,
  primaryButtonStyle,
  secondaryButtonStyle,
  priority,
  contained,
}: {
  slide: HeroSlide;
  openLinksInNewTab: boolean;
  primaryButtonStyle: HeroLayoutConfig['primaryButtonStyle'];
  secondaryButtonStyle: HeroLayoutConfig['secondaryButtonStyle'];
  priority?: boolean;
  contained?: boolean;
}) {
  const content = (
    <SlideContent
      slide={slide}
      openLinksInNewTab={openLinksInNewTab}
      primaryButtonStyle={primaryButtonStyle}
      secondaryButtonStyle={secondaryButtonStyle}
    />
  );

  if (contained) {
    return (
      <>
        <SlideMedia slide={slide} priority={priority} />
        <div className="relative flex size-full items-center px-4 sm:px-6 lg:px-8">{content}</div>
      </>
    );
  }

  return (
    <>
      <SlideMedia slide={slide} priority={priority} />
      <Container className="relative flex w-full justify-start">{content}</Container>
    </>
  );
}

export function SlideView({
  slide,
  widthMode,
  heightPreset,
  adaptImageSrc,
  openLinksInNewTab,
  primaryButtonStyle,
  secondaryButtonStyle,
  priority,
  className,
}: SlideViewProps) {
  const shell = (contained: boolean) => (
    <HeroHeightShell
      preset={heightPreset}
      adaptImageSrc={adaptImageSrc ?? slide.image}
      className={cn('flex items-center', contained && 'size-full')}
    >
      <SlideInner
        slide={slide}
        openLinksInNewTab={openLinksInNewTab}
        primaryButtonStyle={primaryButtonStyle}
        secondaryButtonStyle={secondaryButtonStyle}
        priority={priority}
        contained={contained}
      />
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
