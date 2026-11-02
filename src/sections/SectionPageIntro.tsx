import type { CSSProperties } from 'react';
import type { SectionPageIntroProps } from '../generated/types';
import { ImageBottomFade, resolveFadeToColor } from '../components/shared/image-bottom-fade';
import { panelBackgroundColor } from '../components/shared/panel-color-style';
import { Container } from '../components/ui/container';
import { useIsMobile } from '../hooks/use-media-query';
import { cn } from '../lib/utils';
import { IntroTextBlock } from './section-page-intro/intro-text-block';

const SPACING = {
  small: 'pb-10 pt-8 md:pb-12 md:pt-10',
  medium: 'pb-12 pt-10 md:pb-16 md:pt-12',
  large: 'pb-16 pt-12 md:pb-20 md:pt-14',
  extraLarge: 'pb-20 pt-14 md:pb-24 md:pt-16',
} as const;

/**
 * Sayfa üst görseli, alt sis geçişi ve başlık → etiket → açıklama metni.
 */
export default function SectionPageIntro(props: SectionPageIntroProps) {
  const isMobile = useIsMobile();
  const imageSrc = isMobile ? props.imageMobile || props.image : props.image || props.imageMobile;
  const heightPx = isMobile
    ? props.imageHeightMobile || 320
    : props.imageHeight || 420;
  const fadeTo = resolveFadeToColor(props.fadeToColor, props.sectionBgColor);
  const sectionStyle = panelBackgroundColor(props.sectionBgColor);

  const mediaStyle: CSSProperties = {
    minHeight: heightPx ? `${heightPx}px` : undefined,
  };

  return (
    <section data-slot="page-intro" className="bg-background text-foreground" style={sectionStyle}>
      <div className="relative w-full overflow-hidden bg-muted" style={mediaStyle}>
        {imageSrc ? (
          <picture>
            {props.imageMobile ? <source media="(max-width: 767px)" srcSet={props.imageMobile || imageSrc} /> : null}
            <img
              src={imageSrc}
              alt=""
              loading="eager"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        {props.showBottomFade ? <ImageBottomFade fadeTo={fadeTo} heightPx={props.fadeHeight} /> : null}
      </div>
      <Container className={cn(SPACING[props.spacingPreset] ?? SPACING.medium)}>
        <IntroTextBlock
          heading={props.heading}
          eyebrow={props.eyebrow}
          description={props.description}
          descriptionAlign={
            props.descriptionAlign === 'left' ||
            props.descriptionAlign === 'right' ||
            props.descriptionAlign === 'justify'
              ? props.descriptionAlign
              : 'center'
          }
          headingStyle={props.headingStyle}
          contentAlign={props.contentAlign}
          contentWidth={props.contentWidth}
          eyebrowColor={props.eyebrowColor}
          headingColor={props.headingColor}
          bodyColor={props.bodyColor}
        />
      </Container>
    </section>
  );
}
