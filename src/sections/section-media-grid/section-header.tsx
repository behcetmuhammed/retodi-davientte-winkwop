import { ThemeSectionLinkButton, type ThemeButtonStyle } from '../../components/shared/theme-section-button';
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
  buttonStyle: ThemeButtonStyle | string;
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
  buttonStyle,
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
          <ThemeSectionLinkButton
            style={buttonStyle}
            href={buttonUrl}
            label={buttonLabel}
            openInNewTab={openInNewTab}
            size="sm"
          />
        </div>
      ) : null}
    </div>
  );
}
