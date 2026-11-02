import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Text } from '../../components/ui/typography';
import type { FaqItem } from './normalize-faq-items';

type FaqAccordionListProps = {
  items: FaqItem[];
};

export function FaqAccordionList({ items }: FaqAccordionListProps) {
  return (
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
  );
}
