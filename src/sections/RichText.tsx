import { panelTextColor } from '../components/shared/panel-color-style';
import { TypographySectionLayout } from '../components/shared/typography-section-layout';
import { Prose } from '../components/ui/typography';
import { cn } from '../lib/utils';
import type { RichTextProps } from '../generated/types';

/**
 * HTML gövde + isteğe bağlı başlık ve CTA; blog, yasal metin veya CMS içeriği için.
 */
export default function RichText(props: RichTextProps) {
  const html = props.htmlContent?.trim();
  const bodyColorStyle = panelTextColor(props.bodyColor);
  const body = html ? (
    <Prose
      className={cn('mx-0 max-w-none', bodyColorStyle && '[&_a]:text-primary')}
      style={bodyColorStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null;

  return (
    <TypographySectionLayout
      data-slot="rich-text-section"
      eyebrow={props.eyebrow}
      heading={props.heading}
      headingStyle={props.headingStyle}
      body={body}
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
      sectionContainerWidth={props.sectionContainerWidth}
    />
  );
}
