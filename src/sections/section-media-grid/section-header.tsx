import { Button } from '../../components/ui/button';
import { Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';

type SectionHeaderProps = {
  title: string;
  subTitle: string;
  titleColor: string;
  subTitleColor: string;
  buttonLabel: string;
  buttonUrl: string;
  openInNewTab: boolean;
  className?: string;
};

export function SectionHeader({
  title,
  subTitle,
  titleColor,
  subTitleColor,
  buttonLabel,
  buttonUrl,
  openInNewTab,
  className,
}: SectionHeaderProps) {
  const hasTitle = !!title;
  const hasSubTitle = !!subTitle;
  const hasButton = !!buttonLabel && !!buttonUrl;

  if (!hasTitle && !hasSubTitle && !hasButton) return null;

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {hasTitle || hasSubTitle ? (
        <div className="min-w-0 flex-1">
          {hasSubTitle ? (
            <Text
              size="sm"
              className="mb-1 uppercase tracking-wider"
              style={subTitleColor ? { color: subTitleColor } : undefined}
            >
              {subTitle}
            </Text>
          ) : null}
          {hasTitle ? (
            <Heading
              level={2}
              className="font-heading text-lg tracking-wide md:text-xl"
              style={titleColor ? { color: titleColor } : undefined}
            >
              {title}
            </Heading>
          ) : null}
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
      {hasButton ? (
        <div className="shrink-0">
          <Button asChild variant="outline" size="sm">
            <a
              href={buttonUrl}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
            >
              {buttonLabel}
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
