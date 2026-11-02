import type { ReactNode } from 'react';
import { Container } from '../ui/container';
import { ThemeSectionLinkButton, type ThemeButtonStyle } from './theme-section-button';
import { Eyebrow, Heading, Text } from '../ui/typography';
import { cn } from '../../lib/utils';
import { panelBackgroundColor, panelTextColor } from './panel-color-style';

export type SectionContentAlign = 'left' | 'center' | 'right';
export type SectionSpacingPreset = 'small' | 'medium' | 'large' | 'extraLarge';
export type SectionContentWidth = 'narrow' | 'medium' | 'wide';
export type SectionHeadingStyle = 'default' | 'editorial';

const SPACING: Record<SectionSpacingPreset, string> = {
  small: 'py-12 md:py-16',
  medium: 'py-16 md:py-24',
  large: 'py-24 md:py-32',
  extraLarge: 'py-32 md:py-40',
};

const WIDTH: Record<SectionContentWidth, string> = {
  narrow: 'max-w-xl',
  medium: 'max-w-2xl',
  wide: 'max-w-3xl',
};

export type TypographySectionLayoutProps = {
  eyebrow?: string;
  heading?: string;
  headingStyle?: SectionHeadingStyle;
  description?: string;
  body?: ReactNode;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  openLinksInNewTab?: boolean;
  primaryButtonStyle?: ThemeButtonStyle | string;
  secondaryButtonStyle?: ThemeButtonStyle | string;
  contentAlign?: SectionContentAlign;
  spacingPreset?: SectionSpacingPreset;
  contentWidth?: SectionContentWidth;
  eyebrowColor?: string;
  headingColor?: string;
  bodyColor?: string;
  sectionBgColor?: string;
  sectionContainerWidth?: string;
  /** Bölüm kökü için ek sınıf (ör. arka plan). */
  className?: string;
  'data-slot'?: string;
};

function alignClasses(align: SectionContentAlign) {
  return {
    block: cn(
      align === 'center' && 'mx-auto items-center text-center',
      align === 'right' && 'ml-auto items-end text-right',
      align === 'left' && 'items-start text-left',
    ),
    actions: cn(
      'flex flex-wrap gap-3',
      align === 'center' && 'justify-center',
      align === 'right' && 'justify-end',
    ),
  };
}

export function TypographySectionLayout({
  eyebrow,
  heading,
  headingStyle = 'default',
  description,
  body,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
  openLinksInNewTab = false,
  primaryButtonStyle = 'solid',
  secondaryButtonStyle = 'outline',
  contentAlign = 'center',
  spacingPreset = 'medium',
  contentWidth = 'narrow',
  eyebrowColor,
  headingColor,
  bodyColor,
  sectionBgColor,
  sectionContainerWidth,
  className,
  'data-slot': dataSlot = 'typography-section',
}: TypographySectionLayoutProps) {
  const align = contentAlign;
  const { block, actions } = alignClasses(align);

  const primary =
    primaryLabel?.trim() && primaryUrl?.trim() ? (
      <ThemeSectionLinkButton
        style={primaryButtonStyle}
        href={primaryUrl.trim()}
        label={primaryLabel.trim()}
        openInNewTab={openLinksInNewTab}
      />
    ) : null;

  const secondary =
    secondaryLabel?.trim() && secondaryUrl?.trim() ? (
      <ThemeSectionLinkButton
        style={secondaryButtonStyle}
        href={secondaryUrl.trim()}
        label={secondaryLabel.trim()}
        openInNewTab={openLinksInNewTab}
      />
    ) : null;

  const hasActions = primary || secondary;
  const hasText = eyebrow?.trim() || heading?.trim() || description?.trim() || body || hasActions;
  if (!hasText) return null;

  const editorial =
    headingStyle === 'editorial'
      ? 'font-heading text-2xl font-semibold tracking-[0.14em] uppercase md:text-3xl lg:text-4xl'
      : undefined;

  const descriptionColorStyle = panelTextColor(bodyColor);
  const sectionStyle = panelBackgroundColor(sectionBgColor);

  return (
    <section
      data-slot={dataSlot}
      className={cn('bg-background text-foreground', SPACING[spacingPreset], className)}
      style={sectionStyle}
    >
      <Container widthPreset={sectionContainerWidth}>
        <div className={cn('flex w-full flex-col gap-5 md:gap-6', WIDTH[contentWidth], block)}>
          {eyebrow?.trim() ? (
            <Eyebrow style={panelTextColor(eyebrowColor)}>{eyebrow}</Eyebrow>
          ) : null}
          {heading?.trim() ? (
            <Heading
              level={2}
              className={cn(editorial, headingStyle === 'editorial' && 'text-balance')}
              style={panelTextColor(headingColor)}
            >
              {heading}
            </Heading>
          ) : null}
          {description?.trim() ? (
            <Text
              size="md"
              tone={descriptionColorStyle ? 'default' : 'muted'}
              leading="relaxed"
              className="text-pretty"
              style={descriptionColorStyle}
            >
              {description}
            </Text>
          ) : null}
          {body}
          {hasActions ? (
            <div className={actions}>
              {primary}
              {secondary}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
