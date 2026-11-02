import type { SectionFaqProps } from '../generated/types';
import { panelBackgroundColor } from '../components/shared/panel-color-style';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Container } from '../components/ui/container';
import { Text } from '../components/ui/typography';
import { cn } from '../lib/utils';
import { SectionTitle } from './section-featured-collection/section-title';
import { normalizeFaqItems } from './section-faq/normalize-faq-items';

const SPACING = {
  small: 'py-10 md:py-12',
  medium: 'py-12 md:py-16',
  large: 'py-16 md:py-20',
  extraLarge: 'py-20 md:py-24',
} as const;

/**
 * Sıkça sorulan sorular: tek seferde bir soru açık kalabilir.
 */
export default function SectionFaq(props: SectionFaqProps) {
  const items = normalizeFaqItems(props);
  if (items.length === 0) return null;

  const sectionStyle = panelBackgroundColor(props.sectionBgColor);

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
        <Accordion type="single" collapsible>
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger headingLevel={3} className="text-base md:text-lg">
                {item.question || '—'}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer ? (
                  <Text size="sm" tone="muted" leading="relaxed" className="text-pretty md:text-base">
                    {item.answer}
                  </Text>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
