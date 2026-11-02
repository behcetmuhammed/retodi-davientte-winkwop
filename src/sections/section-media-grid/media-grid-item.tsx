import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import {
  getColumnSpan,
  getMediaGridItemStyle,
  getRowSpan,
  MEDIA_GRID_CONTENT_CLASSNAME,
  MEDIA_GRID_SUBTITLE_CLASSNAME,
  MEDIA_GRID_TITLE_CLASSNAME,
  MEDIA_HOVER_CLASSNAME,
} from './media-grid-layout';
import {
  getButtonAlignClass,
  getDefaultMediaGridSubTitleColor,
  getDefaultMediaGridTitleColor,
  getOutsidePositionClasses,
  getPositionClasses,
  isOutsideBottomPosition,
  isOutsidePosition,
} from './media-grid-position';
import type { MediaGridItem as MediaGridItemData } from './types';

type MediaGridItemProps = {
  item: MediaGridItemData;
  isMobile: boolean;
  enableMediaHoverZoom?: boolean;
};

function pickImage(item: MediaGridItemData, isMobile: boolean): string {
  if (isMobile) return item.imageMobile || item.image;
  return item.image || item.imageMobile;
}

function pickVideo(item: MediaGridItemData, isMobile: boolean): string {
  if (isMobile) return item.videoUrlMobile || item.videoUrl;
  return item.videoUrl || item.videoUrlMobile;
}

export function MediaGridItem({ item, isMobile, enableMediaHoverZoom = true }: MediaGridItemProps) {
  const columnSpan = getColumnSpan(item.columnSpan);
  const rowSpan = getRowSpan(item.rowSpan);
  const itemStyle = getMediaGridItemStyle(isMobile, columnSpan, rowSpan);

  const href = item.buttonUrl;
  const hasButtonTitle = !!item.buttonLabel;
  const shouldWrapCard = !!href && !hasButtonTitle;
  const openInNewTab = item.openLinkInNewTab;
  const isVideo = item.mediaType === 'video';

  const position = item.position;
  const isOutside = isOutsidePosition(position);
  const overlayPosition = getPositionClasses(position);
  const outsidePosition = getOutsidePositionClasses(position);
  const buttonAlignClass = getButtonAlignClass(position);

  const imageSrc = pickImage(item, isMobile);
  const videoSrc = pickVideo(item, isMobile);
  const hasVideo = !!videoSrc;
  const hasImage = !!imageSrc;
  const hasMedia = isVideo ? hasVideo || hasImage : hasImage || hasVideo;

  const hasOverlay = !!(item.title || item.subTitle || item.content || hasButtonTitle);

  const overlayClassName = item.showImageOverlay ? 'bg-black/40' : 'bg-transparent';
  const mediaHoverClass = enableMediaHoverZoom ? MEDIA_HOVER_CLASSNAME : '';

  const mediaNode =
    isVideo && hasVideo ? (
      <video
        className={cn('absolute inset-0 size-full object-cover', mediaHoverClass)}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
    ) : hasImage ? (
      <picture>
        {item.imageMobile ? <source media="(max-width: 767px)" srcSet={item.imageMobile || imageSrc} /> : null}
        <img
          src={imageSrc}
          alt={item.title || ''}
          loading="lazy"
          decoding="async"
          className={cn('absolute inset-0 size-full object-cover', mediaHoverClass)}
        />
      </picture>
    ) : null;

  const lightSurfaceButtons = isOutsideBottomPosition(position);

  const renderOverlayContent = (contentOnImage: boolean) => {
    const bodyClass = contentOnImage
      ? MEDIA_GRID_CONTENT_CLASSNAME
      : 'text-sm md:text-base mb-4 max-w-xl text-muted-foreground [&_p]:m-0';

    const subTitleColor =
      item.subTitleColor || getDefaultMediaGridSubTitleColor(contentOnImage);
    const titleColor = item.titleColor || getDefaultMediaGridTitleColor(contentOnImage);

    const titleClass = cn(
      MEDIA_GRID_TITLE_CLASSNAME,
      !contentOnImage && !item.titleColor && 'text-foreground drop-shadow-none',
    );
    const subTitleClass = cn(
      MEDIA_GRID_SUBTITLE_CLASSNAME,
      !contentOnImage && !item.subTitleColor && 'text-muted-foreground',
    );

    return (
      <>
        {item.subTitle ? (
          <p className={subTitleClass} style={subTitleColor ? { color: subTitleColor } : undefined}>
            {item.subTitle}
          </p>
        ) : null}
        {item.title ? (
          <h3
            className={titleClass}
            style={titleColor ? { color: titleColor } : undefined}
          >
            {item.title}
          </h3>
        ) : null}
        {item.content ? (
          <div className={bodyClass} dangerouslySetInnerHTML={{ __html: item.content }} />
        ) : null}
        {hasButtonTitle && href ? (
          <div className={cn('flex flex-wrap gap-3', buttonAlignClass)}>
            <Button
              asChild
              variant={lightSurfaceButtons ? 'default' : 'secondary'}
              size="sm"
              className={cn(!lightSurfaceButtons && 'border-background/40 bg-background/10 text-background hover:bg-background/20')}
            >
              <a
                href={href}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {item.buttonLabel}
              </a>
            </Button>
          </div>
        ) : null}
      </>
    );
  };

  const mediaBlock = (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-muted',
        enableMediaHoverZoom && 'group',
        isOutside ? 'min-h-0 flex-1' : 'h-full',
      )}
    >
      {hasMedia ? mediaNode : null}
      {hasOverlay && !isOutside ? (
        <div
          className={cn(
            'absolute inset-0 z-10 flex flex-col p-6 md:p-10',
            overlayClassName,
            overlayPosition,
          )}
        >
          {renderOverlayContent(true)}
        </div>
      ) : null}
    </div>
  );

  const content = isOutside ? (
    <div className="flex h-full w-full flex-col">
      {mediaBlock}
      {hasOverlay ? (
        <div className={cn('flex flex-col pt-4', outsidePosition)}>{renderOverlayContent(false)}</div>
      ) : null}
    </div>
  ) : (
    mediaBlock
  );

  if (shouldWrapCard && href) {
    return (
      <a
        href={href}
        className="block h-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={itemStyle}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="h-full" style={itemStyle}>
      {content}
    </div>
  );
}
