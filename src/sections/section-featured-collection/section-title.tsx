import { Heading } from '../../components/ui/typography';
import { cn } from '../../lib/utils';
import { panelTextColor } from '../../components/shared/panel-color-style';

type SectionTitleProps = {
  title: string;
  align: 'left' | 'center';
  headingStyle: 'editorial' | 'default';
  titleColor?: string;
  className?: string;
};

export function SectionTitle({ title, align, headingStyle, titleColor, className }: SectionTitleProps) {
  if (!title.trim()) return null;

  const editorial =
    headingStyle === 'editorial'
      ? 'font-heading text-xl font-semibold tracking-[0.14em] uppercase md:text-2xl lg:text-3xl'
      : undefined;

  return (
    <Heading
      level={2}
      className={cn(
        'mb-6 md:mb-8',
        editorial,
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
      )}
      style={panelTextColor(titleColor)}
    >
      {title}
    </Heading>
  );
}
