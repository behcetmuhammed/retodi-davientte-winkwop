import type { CSSProperties } from 'react';
import { ThemeSectionLinkButton, type ThemeButtonStyle } from '../../components/shared/theme-section-button';
import { Eyebrow } from '../../components/ui/typography';
import { cn } from '../../lib/utils';
import type { CollectionItem as CollectionItemData } from './types';

type CaptionDisplay = 'always' | 'hover';

type CollectionItemProps = {
  item: CollectionItemData;
  isMobile: boolean;
  itemButtonStyle: ThemeButtonStyle | string;
  openLinksInNewTab: boolean;
  captionDisplay: CaptionDisplay;
  style?: CSSProperties;
};

function pickImage(item: CollectionItemData, isMobile: boolean): string {
  if (isMobile) return item.imageMobile || item.image;
  return item.image || item.imageMobile;
}

export function CollectionItem({
  item,
  isMobile,
  itemButtonStyle,
  openLinksInNewTab,
  captionDisplay,
  style,
}: CollectionItemProps) {
  const imageSrc = pickImage(item, isMobile);
  const cardHref = item.linkUrl;
  const hasButton = !!(item.buttonLabel && item.buttonUrl);
  const wrapCard = !!cardHref && !hasButton;

  const media = imageSrc ? (
    <picture>
      {item.imageMobile ? <source media="(max-width: 767px)" srcSet={item.imageMobile || imageSrc} /> : null}
      <img
        src={imageSrc}
        alt={item.captionTitle || item.captionEyebrow || ''}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </picture>
  ) : (
    <div className="absolute inset-0 bg-muted" aria-hidden />
  );

  const captionHoverClasses =
    captionDisplay === 'hover'
      ? 'max-md:opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100 md:group-focus-within:opacity-100'
      : undefined;

  const caption =
    item.showCaptionCard && (item.captionEyebrow || item.captionTitle || hasButton) ? (
      <div className={cn('absolute inset-x-4 bottom-4 z-10 md:inset-x-6 md:bottom-6', captionHoverClasses)}>
        <div className="border border-border bg-background p-4 text-center md:p-6">
          {item.captionEyebrow ? (
            <Eyebrow className="mb-2 text-muted-foreground">{item.captionEyebrow}</Eyebrow>
          ) : null}
          {item.captionTitle ? (
            <p className="font-heading text-xs font-semibold leading-snug tracking-[0.12em] uppercase md:text-sm">
              {item.captionTitle}
            </p>
          ) : null}
          {hasButton ? (
            <div className="mt-4 flex justify-center">
              <ThemeSectionLinkButton
                style={itemButtonStyle}
                href={item.buttonUrl}
                label={item.buttonLabel}
                openInNewTab={openLinksInNewTab}
                size="sm"
              />
            </div>
          ) : null}
        </div>
      </div>
    ) : null;

  const inner = (
    <div className="group relative h-full min-h-0 w-full overflow-hidden bg-muted">
      {media}
      {caption}
    </div>
  );

  if (wrapCard) {
    return (
      <a
        href={cardHref}
        className="block h-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={style}
        target={openLinksInNewTab ? '_blank' : undefined}
        rel={openLinksInNewTab ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="h-full" style={style}>
      {inner}
    </div>
  );
}
