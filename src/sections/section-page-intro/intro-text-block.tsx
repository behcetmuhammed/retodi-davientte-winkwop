import type { SectionContentAlign, SectionContentWidth, SectionHeadingStyle } from '../../components/shared/typography-section-layout';
import { panelTextColor } from '../../components/shared/panel-color-style';
import { Eyebrow, Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';

const WIDTH: Record<SectionContentWidth, string> = {
  narrow: 'max-w-xl',
  medium: 'max-w-2xl',
  wide: 'max-w-3xl',
};

export type DescriptionAlign = 'left' | 'center' | 'right' | 'justify';

type IntroTextBlockProps = {
  heading: string;
  eyebrow: string;
  description: string;
  descriptionAlign: DescriptionAlign;
  headingStyle: SectionHeadingStyle;
  contentAlign: SectionContentAlign;
  contentWidth: SectionContentWidth;
  eyebrowColor?: string;
  headingColor?: string;
  bodyColor?: string;
};

function descriptionAlignClass(align: DescriptionAlign) {
  switch (align) {
    case 'left':
      return 'w-full text-left';
    case 'right':
      return 'w-full text-right';
    case 'justify':
      return 'w-full text-justify';
    case 'center':
    default:
      return 'w-full text-center';
  }
}

function alignBlock(align: SectionContentAlign) {
  return cn(
    'flex w-full flex-col gap-4 md:gap-5',
    align === 'center' && 'mx-auto items-center text-center',
    align === 'right' && 'ml-auto items-end text-right',
    align === 'left' && 'items-start text-left',
  );
}

export function IntroTextBlock({
  heading,
  eyebrow,
  description,
  descriptionAlign,
  headingStyle,
  contentAlign,
  contentWidth,
  eyebrowColor,
  headingColor,
  bodyColor,
}: IntroTextBlockProps) {
  const hasHeading = heading.trim().length > 0;
  const hasEyebrow = eyebrow.trim().length > 0;
  const hasDescription = description.trim().length > 0;
  if (!hasHeading && !hasEyebrow && !hasDescription) return null;

  const editorial =
    headingStyle === 'editorial'
      ? 'font-heading text-2xl font-semibold tracking-[0.14em] uppercase md:text-3xl'
      : 'font-heading text-3xl font-normal tracking-tight md:text-4xl lg:text-5xl';

  const descriptionColorStyle = panelTextColor(bodyColor);

  return (
    <div className={cn(alignBlock(contentAlign), WIDTH[contentWidth])}>
      {hasHeading ? (
        <Heading level={2} className={cn(editorial, 'text-balance')} style={panelTextColor(headingColor)}>
          {heading}
        </Heading>
      ) : null}
      {hasEyebrow ? (
        <Eyebrow className="font-sans text-sm font-semibold tracking-wide normal-case" style={panelTextColor(eyebrowColor)}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      {hasDescription ? (
        <Text
          size="md"
          tone={descriptionColorStyle ? 'default' : 'muted'}
          leading="relaxed"
          className={cn('text-pretty', descriptionAlignClass(descriptionAlign))}
          style={descriptionColorStyle}
        >
          {description}
        </Text>
      ) : null}
    </div>
  );
}
