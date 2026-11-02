import { TypographySectionLayout } from '../components/shared/typography-section-layout';
import type { TextProps } from '../generated/types';

/**
 * Kurumsal metin bloğu: başlık, açıklama ve iki isteğe bağlı CTA.
 * Rafaello tarzı editoryal başlık için `headingStyle: editorial` kullanın.
 */
export default function Text(props: TextProps) {
  return (
    <TypographySectionLayout
      data-slot="text-section"
      eyebrow={props.eyebrow}
      heading={props.heading}
      headingStyle={props.headingStyle}
      description={props.description}
      primaryLabel={props.primaryLabel}
      primaryUrl={props.primaryUrl}
      secondaryLabel={props.secondaryLabel}
      secondaryUrl={props.secondaryUrl}
      openLinksInNewTab={props.openLinksInNewTab}
      primaryButtonStyle={props.primaryButtonStyle}
      secondaryButtonStyle={props.secondaryButtonStyle}
      contentAlign={props.contentAlign}
      spacingPreset={props.spacingPreset}
      contentWidth={props.contentWidth}
      eyebrowColor={props.eyebrowColor}
      headingColor={props.headingColor}
      bodyColor={props.bodyColor}
      sectionBgColor={props.sectionBgColor}
    />
  );
}
