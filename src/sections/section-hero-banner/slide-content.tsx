import { Button } from '../../components/ui/button';
import { Eyebrow, Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';
import type { HeroSlide } from './types';

type SlideContentProps = {
  slide: HeroSlide;
  openLinksInNewTab: boolean;
};

export function SlideContent({ slide, openLinksInNewTab }: SlideContentProps) {
  const light = slide.textTone === 'light';
  const align = slide.contentAlign;

  const primary =
    slide.primaryLabel && slide.primaryUrl ? (
      <Button asChild variant={light ? 'secondary' : 'default'} size="md">
        <a
          href={slide.primaryUrl}
          target={openLinksInNewTab ? '_blank' : undefined}
          rel={openLinksInNewTab ? 'noopener noreferrer' : undefined}
        >
          {slide.primaryLabel}
        </a>
      </Button>
    ) : null;

  const secondary =
    slide.secondaryLabel && slide.secondaryUrl ? (
      <Button
        asChild
        variant="outline"
        size="md"
        className={cn(light && 'border-background/40 bg-background/10 text-background hover:bg-background/20')}
      >
        <a
          href={slide.secondaryUrl}
          target={openLinksInNewTab ? '_blank' : undefined}
          rel={openLinksInNewTab ? 'noopener noreferrer' : undefined}
        >
          {slide.secondaryLabel}
        </a>
      </Button>
    ) : null;

  const hasActions = primary || secondary;
  const hasText = slide.eyebrow || slide.heading || slide.description || hasActions;
  if (!hasText) return null;

  return (
    <div
      data-slot="hero-slide-content"
      className={cn(
        'relative z-10 flex w-full max-w-xl flex-col gap-4 py-10 md:max-w-2xl md:py-14 lg:py-16',
        align === 'center' && 'mx-auto items-center text-center',
        align === 'right' && 'ml-auto items-end text-right',
        align === 'left' && 'items-start text-left',
      )}
    >
      {slide.eyebrow ? (
        <Eyebrow className={cn(light ? 'text-background/80' : 'text-muted-foreground')}>{slide.eyebrow}</Eyebrow>
      ) : null}
      {slide.heading ? (
        <Heading level={1} className={cn(light && 'text-background')}>
          {slide.heading}
        </Heading>
      ) : null}
      {slide.description ? (
        <Text size="lg" className={cn('text-pretty', light ? 'text-background/90' : 'text-muted-foreground')}>
          {slide.description}
        </Text>
      ) : null}
      {hasActions ? (
        <div className={cn('flex flex-wrap gap-3', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
          {primary}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}
