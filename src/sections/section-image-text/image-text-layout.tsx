import type { CSSProperties } from 'react';
import { ThemeSectionLinkButton, type ThemeButtonStyle } from '../../components/shared/theme-section-button';
import { panelBackgroundColor, panelTextColor } from '../../components/shared/panel-color-style';
import { Container } from '../../components/ui/container';
import { Grid } from '../../components/ui/grid';
import { Heading, Text } from '../../components/ui/typography';
import { useIsMobile } from '../../hooks/use-media-query';
import { cn } from '../../lib/utils';

type ImageTextLayoutProps = {
  image: string;
  imageMobile: string;
  imageMinHeight: number;
  reverseLayout: boolean;
  heading: string;
  description: string;
  headingStyle: 'default' | 'editorial';
  primaryLabel: string;
  primaryUrl: string;
  primaryButtonStyle: ThemeButtonStyle | string;
  openLinksInNewTab: boolean;
  showBottomBorder: boolean;
  sectionBgColor: string;
  headingColor: string;
  bodyColor: string;
  spacingPreset: 'small' | 'medium' | 'large' | 'extraLarge';
  sectionContainerWidth: string;
};

const SPACING = {
  small: 'py-10 md:py-12',
  medium: 'py-12 md:py-16',
  large: 'py-16 md:py-20',
  extraLarge: 'py-20 md:py-24',
} as const;

export function ImageTextLayout(props: ImageTextLayoutProps) {
  const isMobile = useIsMobile();
  const imageSrc = isMobile ? props.imageMobile || props.image : props.image || props.imageMobile;
  const minH = props.imageMinHeight > 0 ? props.imageMinHeight : 280;
  const sectionStyle = panelBackgroundColor(props.sectionBgColor);

  const headingClass =
    props.headingStyle === 'editorial'
      ? 'font-heading text-2xl font-semibold tracking-[0.12em] uppercase md:text-3xl'
      : 'font-heading text-3xl font-normal tracking-tight md:text-4xl';

  const bodyStyle = panelTextColor(props.bodyColor);
  const showCta = props.primaryLabel.trim() && props.primaryUrl.trim();

  const media = (
    <div
      className={cn('relative w-full overflow-hidden bg-muted', props.reverseLayout ? 'md:order-2' : 'md:order-1')}
      style={{ minHeight: `${minH}px` } as CSSProperties}
    >
      {imageSrc ? (
        <picture>
          {props.imageMobile ? <source media="(max-width: 767px)" srcSet={props.imageMobile || imageSrc} /> : null}
          <img src={imageSrc} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        </picture>
      ) : (
        <div className="absolute inset-0 bg-muted" aria-hidden />
      )}
    </div>
  );

  const copy = (
    <div
      className={cn(
        'flex flex-col justify-center gap-4 md:gap-6',
        props.reverseLayout ? 'md:order-1' : 'md:order-2',
      )}
    >
      {props.heading.trim() ? (
        <Heading level={2} className={headingClass} style={panelTextColor(props.headingColor)}>
          {props.heading}
        </Heading>
      ) : null}
      {props.description.trim() ? (
        <Text size="md" tone={bodyStyle ? 'default' : 'muted'} leading="relaxed" className="text-pretty" style={bodyStyle}>
          {props.description}
        </Text>
      ) : null}
      {showCta ? (
        <ThemeSectionLinkButton
          style={props.primaryButtonStyle}
          href={props.primaryUrl.trim()}
          label={props.primaryLabel.trim()}
          openInNewTab={props.openLinksInNewTab}
        />
      ) : null}
    </div>
  );

  return (
    <section
      data-slot="image-text-section"
      className={cn(
        'bg-background text-foreground',
        SPACING[props.spacingPreset] ?? SPACING.medium,
        props.showBottomBorder && 'border-b border-border',
      )}
      style={sectionStyle}
    >
      <Container widthPreset={props.sectionContainerWidth}>
        <Grid cols={{ base: 1, md: 2 }} gap="xl" className="items-center">
          {media}
          {copy}
        </Grid>
      </Container>
    </section>
  );
}
