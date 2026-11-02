import { TypographySectionLayout } from '../components/shared/typography-section-layout';
import { Prose } from '../components/ui/typography';
import type { RichTextProps } from '../generated/types';

/**
 * HTML gövde + isteğe bağlı başlık ve CTA; blog, yasal metin veya CMS içeriği için.
 */
export default function RichText(props: RichTextProps) {
  const html = props.htmlContent?.trim();
  const body = html ? <Prose className="mx-0 max-w-none" dangerouslySetInnerHTML={{ __html: html }} /> : null;

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
      contentAlign={props.contentAlign}
      spacingPreset={props.spacingPreset}
      contentWidth={props.contentWidth}
    />
  );
}
