import { cn } from '../../lib/utils';
import type { HeroSlide } from './types';

type SlideMediaProps = {
  slide: HeroSlide;
  priority?: boolean;
  className?: string;
};

export function SlideMedia({ slide, priority, className }: SlideMediaProps) {
  const desktop = slide.image;
  const mobile = slide.imageMobile || slide.image;

  return (
    <div data-slot="hero-slide-media" className={cn('absolute inset-0 overflow-hidden bg-muted', className)}>
      <picture>
        {slide.imageMobile ? <source media="(max-width: 767px)" srcSet={mobile} /> : null}
        <img
          src={desktop}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover"
        />
      </picture>
      <div
        aria-hidden
        className={cn('absolute inset-0', !slide.overlayColor && 'bg-foreground')}
        style={
          slide.overlayColor
            ? { backgroundColor: slide.overlayColor, opacity: slide.overlayOpacity / 100 }
            : { opacity: slide.overlayOpacity / 100 }
        }
      />
    </div>
  );
}
