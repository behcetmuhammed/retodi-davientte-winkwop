import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { Container } from '../ui/container';
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
  contentAlign?: SectionContentAlign;
  spacingPreset?: SectionSpacingPreset;
  contentWidth?: SectionContentWidth;
  eyebrowColor?: string;
  headingColor?: string;
  bodyColor?: string;
  sectionBgColor?: string;
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
  contentAlign = 'center',
  spacingPreset = 'medium',
  contentWidth = 'narrow',
  eyebrowColor,
  headingColor,
  bodyColor,
  sectionBgColor,
  className,
  'data-slot': dataSlot = 'typography-section',
}: TypographySectionLayoutProps) {
  const align = contentAlign;
  const { block, actions } = alignClasses(align);

  const primary =
    primaryLabel?.trim() && primaryUrl?.trim() ? (
      <Button asChild variant="default" size="md">
        <a
          href={primaryUrl}
          target={openLinksInNewTab ? '_blank' : undefined}
          rel={openLinksInNewTab ? 'noopener noreferrer' : undefined}
        >
          {primaryLabel}
        </a>
      </Button>
    ) : null;

  const secondary =
    secondaryLabel?.trim() && secondaryUrl?.trim() ? (
      <Button asChild variant="outline" size="md">
        <a
          href={secondaryUrl}
          target={openLinksInNewTab ? '_blank' : undefined}
          rel={openLinksInNewTab ? 'noopener noreferrer' : undefined}
        >
          {secondaryLabel}
        </a>
      </Button>
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
      <Container>
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
