import { Button } from '../../components/ui/button';
import { themeButtonVariant, type ThemeButtonStyle } from '../../components/shared/theme-section-button';
import { Eyebrow, Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';
import { heroLinkButtonClass, heroPrimaryVariant } from './hero-button-classes';
import type { HeroSlide } from './types';

type SlideContentProps = {
  slide: HeroSlide;
  openLinksInNewTab: boolean;
  primaryButtonStyle: ThemeButtonStyle | string;
  secondaryButtonStyle: ThemeButtonStyle | string;
};

export function SlideContent({
  slide,
  openLinksInNewTab,
  primaryButtonStyle,
  secondaryButtonStyle,
}: SlideContentProps) {
  const light = slide.textTone === 'light';
  const align = slide.contentAlign;
  const buttonSizeClass = 'h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm';

  const primary =
    slide.primaryLabel && slide.primaryUrl ? (
      <Button
        asChild
        variant={heroPrimaryVariant(light, primaryButtonStyle)}
        size="sm"
        className={cn(buttonSizeClass, heroLinkButtonClass(light, primaryButtonStyle, 'primary'))}
      >
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
        variant={themeButtonVariant(secondaryButtonStyle)}
        size="sm"
        className={cn(buttonSizeClass, heroLinkButtonClass(light, secondaryButtonStyle, 'secondary'))}
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
        'relative z-10 flex w-full max-w-xl flex-col gap-3 py-6 md:max-w-2xl md:gap-4 md:py-14 lg:py-16',
        align === 'center' && 'mx-auto items-center text-center',
        align === 'right' && 'ml-auto items-end text-right',
        align === 'left' && 'items-start text-left',
      )}
    >
      {slide.eyebrow ? (
        <Eyebrow className={cn(light ? 'text-background/80' : 'text-muted-foreground')}>{slide.eyebrow}</Eyebrow>
      ) : null}
      {slide.heading ? (
        <Heading
          level={1}
          className={cn(
            'text-2xl md:text-3xl lg:text-4xl',
            light && 'text-background',
          )}
        >
          {slide.heading}
        </Heading>
      ) : null}
      {slide.description ? (
        <Text
          size="sm"
          className={cn(
            'text-pretty md:text-lg',
            light ? 'text-background/90' : 'text-muted-foreground',
          )}
        >
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
