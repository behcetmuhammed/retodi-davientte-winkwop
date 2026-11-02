import type { SectionImageTextProps } from '../generated/types';
import { ImageTextLayout } from './section-image-text/image-text-layout';

/**
 * Yan yana görsel ve metin; `reverseLayout` ile görsel sağda.
 */
export default function SectionImageText(props: SectionImageTextProps) {
  return (
    <ImageTextLayout
      image={props.image}
      imageMobile={props.imageMobile}
      imageMinHeight={props.imageMinHeight}
      reverseLayout={props.reverseLayout}
      heading={props.heading}
      description={props.description}
      headingStyle={props.headingStyle}
      primaryLabel={props.primaryLabel}
      primaryUrl={props.primaryUrl}
      primaryButtonStyle={props.primaryButtonStyle}
      openLinksInNewTab={props.openLinksInNewTab}
      showBottomBorder={props.showBottomBorder}
      sectionBgColor={props.sectionBgColor}
      headingColor={props.headingColor}
      bodyColor={props.bodyColor}
      spacingPreset={props.spacingPreset}
      sectionContainerWidth={props.sectionContainerWidth}
    />
  );
}
