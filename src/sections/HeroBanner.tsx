import type { HeroBannerProps } from '../generated/types';
import { CarouselHero } from './section-hero-banner/carousel-hero';
import { normalizeSlides, pickLayoutConfig } from './section-hero-banner/normalize-slides';
import { SingleHero } from './section-hero-banner/single-hero';

/**
 * Ana sayfa kahraman alanı: panelden gelen slaytlar; tek görünüm veya karusel.
 */
export default function HeroBanner(props: HeroBannerProps) {
  const slides = normalizeSlides(props);
  if (slides.length === 0) return null;

  const layout = pickLayoutConfig(props);
  const useCarousel = layout.displayMode === 'carousel' && slides.length > 1;
  const adaptImageSrc = slides[0]!.image;

  return (
    <section data-slot="hero-banner" aria-label="Öne çıkan banner">
      {useCarousel ? (
        <CarouselHero {...layout} slides={slides} adaptImageSrc={adaptImageSrc} />
      ) : (
        <SingleHero {...layout} slide={slides[0]!} adaptImageSrc={adaptImageSrc} />
      )}
    </section>
  );
}
