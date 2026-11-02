import type { SectionFaqProps } from '../generated/types';
import { panelBackgroundColor } from '../components/shared/panel-color-style';
import { Container } from '../components/ui/container';
import { cn } from '../lib/utils';
import { SectionTitle } from './section-featured-collection/section-title';
import { FaqAccordionList } from './section-faq/faq-accordion-list';
import { FaqOpenList } from './section-faq/faq-open-list';
import { normalizeFaqItems } from './section-faq/normalize-faq-items';

const SPACING = {
  small: 'py-10 md:py-12',
  medium: 'py-12 md:py-16',
  large: 'py-16 md:py-20',
  extraLarge: 'py-20 md:py-24',
} as const;

/**
 * Sıkça sorulan sorular: açılır liste veya numaralı açık satırlar.
 */
export default function SectionFaq(props: SectionFaqProps) {
  const items = normalizeFaqItems(props);
  if (items.length === 0) return null;

  const sectionStyle = panelBackgroundColor(props.sectionBgColor);
  const layout = props.layoutPreset === 'openNumbered' ? 'openNumbered' : 'accordion';

  return (
    <section
      data-slot="section-faq"
      className={cn('bg-background text-foreground', SPACING[props.spacingPreset] ?? SPACING.medium)}
      style={sectionStyle}
    >
      <Container widthPreset={props.sectionContainerWidth}>
        <SectionTitle
          title={props.sectionTitle}
          align={props.titleAlign}
          headingStyle={props.headingStyle}
          titleColor={props.titleColor}
        />
        {layout === 'openNumbered' ? (
          <FaqOpenList items={items} titleColor={props.titleColor} />
        ) : (
          <FaqAccordionList items={items} />
        )}
      </Container>
    </section>
  );
}
