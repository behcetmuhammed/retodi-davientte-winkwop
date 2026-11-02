import type { CSSProperties } from 'react';
import type { SectionFeaturedCollectionProps } from '../generated/types';
import { Container } from '../components/ui/container';
import { useIsMobile } from '../hooks/use-media-query';
import { cn } from '../lib/utils';
import { panelBackgroundColor } from '../components/shared/panel-color-style';
import { CollectionItem } from './section-featured-collection/collection-item';
import {
  getCollectionGridClass,
  getCollectionItemStyle,
  maxItemsForPreset,
} from './section-featured-collection/layout-spans';
import { normalizeCollectionItems } from './section-featured-collection/normalize-items';
import { SectionTitle } from './section-featured-collection/section-title';
import { useFeaturedCollectionVisible } from './section-featured-collection/use-section-visibility';
import {
  getFullWidthInsetClass,
  isContainerFullWidth,
} from './section-media-grid/media-grid-layout';

/**
 * Seçilmiş koleksiyon: 4 eşit veya 3 sütunlu editoryal görsel ızgarası.
 */
export default function SectionFeaturedCollection(props: SectionFeaturedCollectionProps) {
  const visible = useFeaturedCollectionVisible(props.hideOnDesktop, props.hideOnMobile);
  const isMobile = useIsMobile();
  const limit = maxItemsForPreset(props.layoutPreset);
  const items = normalizeCollectionItems(props, limit);

  if (!visible || items.length === 0) return null;

  const isMobileRow = isMobile;
  const rowHeight = isMobileRow ? props.rowHeightMobile : props.rowHeight;
  const gridStyle: CSSProperties = {
    '--fc-gap': `${props.columnGap ?? 16}px`,
    '--fc-row-height': `${rowHeight || (isMobile ? 360 : 520)}px`,
  } as CSSProperties;

  const fullWidth = isContainerFullWidth(isMobile, props.useFullWidth, props.useFullWidthMobile);
  const insetClass = getFullWidthInsetClass(isMobile, props.useFullWidth, props.useFullWidthMobile);

  const marginTop = isMobile ? props.marginTopMobile : props.marginTop;
  const marginBottom = isMobile ? props.marginBottomMobile : props.marginBottom;
  const sectionStyle: CSSProperties = {
    marginTop: marginTop ? `${marginTop}px` : undefined,
    marginBottom: marginBottom ? `${marginBottom}px` : undefined,
    ...panelBackgroundColor(props.sectionBgColor),
  };

  const content = (
    <>
      <SectionTitle
        title={props.sectionTitle}
        align={props.titleAlign}
        headingStyle={props.headingStyle}
        titleColor={props.titleColor}
        className={insetClass}
      />
      <div className={cn(getCollectionGridClass(props.layoutPreset), insetClass)} style={gridStyle}>
        {items.map((item, index) => (
          <CollectionItem
            key={`${item.image || 'fc'}-${index}`}
            item={item}
            isMobile={isMobile}
            itemButtonStyle={props.itemButtonStyle}
            openLinksInNewTab={props.openLinksInNewTab}
            captionDisplay={props.captionDisplay === 'hover' ? 'hover' : 'always'}
            style={getCollectionItemStyle(index, props.layoutPreset, isMobile)}
          />
        ))}
      </div>
    </>
  );

  return (
    <section data-slot="featured-collection" className="bg-background py-10 md:py-14" style={sectionStyle}>
      <Container
        size={fullWidth ? 'full' : 'page'}
        padding={fullWidth ? 'none' : 'default'}
        widthPreset={fullWidth ? undefined : props.sectionContainerWidth}
      >
        {content}
      </Container>
    </section>
  );
}
