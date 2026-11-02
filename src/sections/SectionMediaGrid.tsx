import type { CSSProperties } from 'react';
import type { SectionMediaGridProps } from '../generated/types';
import { Container } from '../components/ui/container';
import { useIsMobile } from '../hooks/use-media-query';
import { cn } from '../lib/utils';
import { MediaGridItem } from './section-media-grid/media-grid-item';
import {
  getFullWidthInsetClass,
  getMediaGridGap,
  getMediaGridRowHeight,
  getMediaGridStyle,
  isContainerFullWidth,
  MEDIA_GRID_CLASSNAME,
} from './section-media-grid/media-grid-layout';
import { normalizeMediaGridItems } from './section-media-grid/normalize-items';
import { SectionHeader } from './section-media-grid/section-header';
import { useSectionMediaGridVisible } from './section-media-grid/use-section-visibility';

/**
 * 12 sütunlu medya ızgarası: görseller/video, overlay metin ve CTA.
 */
export default function SectionMediaGrid(props: SectionMediaGridProps) {
  const visible = useSectionMediaGridVisible(props.hideOnDesktop, props.hideOnMobile);
  const isMobile = useIsMobile();
  const items = normalizeMediaGridItems(props);

  if (!visible || items.length === 0) return null;

  const gridStyle = getMediaGridStyle(
    getMediaGridRowHeight(isMobile, props.desktopRowHeight, props.mobileRowHeight),
    getMediaGridGap(props.columnSpacing),
  );

  const fullWidth = isContainerFullWidth(isMobile, props.useFullWidth, props.useFullWidthMobile);
  const insetClass = getFullWidthInsetClass(isMobile, props.useFullWidth, props.useFullWidthMobile);
  const enableZoom = props.enableMediaHoverZoom !== false;

  const marginTop = isMobile ? props.marginTopMobile : props.marginTop;
  const marginBottom = isMobile ? props.marginBottomMobile : props.marginBottom;
  const marginStyle: CSSProperties = {
    marginTop: marginTop ? `${marginTop}px` : undefined,
    marginBottom: marginBottom ? `${marginBottom}px` : undefined,
  };

  const bgColor = props.bgColor?.trim();
  const sectionStyle: CSSProperties | undefined = bgColor
    ? { ...marginStyle, backgroundColor: bgColor }
    : marginStyle;

  const hasHeaderContent =
    !!props.headerEyebrow?.trim() ||
    !!props.headerTitle?.trim() ||
    !!props.headerSubTitle?.trim();

  const headerWrapClass = cn(
    insetClass,
    bgColor ? 'pt-4 pb-6 md:pt-6 md:pb-8' : 'mb-8 md:mb-10',
  );

  const content = (
    <>
      {hasHeaderContent ? (
        <SectionHeader
          className={headerWrapClass}
          eyebrow={props.headerEyebrow.trim()}
          eyebrowColor={props.headerEyebrowColor.trim()}
          title={props.headerTitle.trim()}
          titleColor={props.headerTitleColor.trim()}
          description={props.headerSubTitle.trim()}
          descriptionColor={props.headerSubTitleColor.trim()}
        />
      ) : null}
      <div className={cn(MEDIA_GRID_CLASSNAME, insetClass)} style={gridStyle}>
        {items.map((item, index) => (
          <MediaGridItem
            key={`${item.title || item.image || 'mg'}-${index}`}
            item={item}
            isMobile={isMobile}
            enableMediaHoverZoom={enableZoom}
            itemButtonStyle={props.itemButtonStyle}
          />
        ))}
      </div>
    </>
  );

  const containerPadding = fullWidth ? 'none' : 'default';

  if (bgColor) {
    return (
      <section data-slot="section-media-grid" className="w-full" style={sectionStyle}>
        <Container size="page" padding={containerPadding} widthPreset={props.sectionContainerWidth}>
          {content}
        </Container>
      </section>
    );
  }

  return (
    <section data-slot="section-media-grid">
      <Container
        size="page"
        padding={containerPadding}
        widthPreset={props.sectionContainerWidth}
        style={sectionStyle}
      >
        {content}
      </Container>
    </section>
  );
}
