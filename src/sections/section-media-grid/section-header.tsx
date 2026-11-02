import { panelTextColor } from '../../components/shared/panel-color-style';
import { Grid } from '../../components/ui/grid';
import { Eyebrow, Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';

type SectionHeaderProps = {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  eyebrowColor,
  title,
  titleColor,
  description,
  descriptionColor,
  className,
}: SectionHeaderProps) {
  const hasEyebrow = !!eyebrow.trim();
  const hasTitle = !!title.trim();
  const hasDescription = !!description.trim();

  if (!hasEyebrow && !hasTitle && !hasDescription) return null;

  return (
    <Grid
      cols={{ base: 1, md: 12 }}
      gap="lg"
      className={cn('items-start gap-8 lg:gap-12', className)}
    >
      <div className="flex flex-col gap-3 md:col-span-7 lg:col-span-8">
        {hasEyebrow ? (
          <Eyebrow
            className={cn('font-sans text-xs tracking-[0.2em] uppercase', !eyebrowColor && 'text-muted-foreground')}
            style={panelTextColor(eyebrowColor)}
          >
            {eyebrow}
          </Eyebrow>
        ) : null}
        {hasTitle ? (
          <Heading
            level={2}
            className="font-heading text-2xl font-normal leading-tight tracking-tight text-pretty md:text-4xl lg:text-5xl"
            style={panelTextColor(titleColor)}
          >
            {title}
          </Heading>
        ) : null}
        {hasDescription ? (
          <Text
            size="sm"
            leading="relaxed"
            className="whitespace-pre-line text-pretty md:hidden"
            style={panelTextColor(descriptionColor)}
          >
            {description}
          </Text>
        ) : null}
      </div>
      {hasDescription ? (
        <Text
          size="sm"
          leading="relaxed"
          className="hidden max-w-md whitespace-pre-line text-pretty md:col-span-5 md:block md:justify-self-end lg:col-span-4"
          style={panelTextColor(descriptionColor)}
        >
          {description}
        </Text>
      ) : null}
    </Grid>
  );
}
