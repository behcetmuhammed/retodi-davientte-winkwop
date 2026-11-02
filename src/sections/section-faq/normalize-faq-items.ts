import type { SectionFaqProps } from '../../generated/types';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function normalizeFaqItems(props: SectionFaqProps): FaqItem[] {
  const items: FaqItem[] = [];
  for (let n = 1; n <= 10; n++) {
    const question = (props[`faq${n}Question` as keyof SectionFaqProps] as string)?.trim() ?? '';
    const answer = (props[`faq${n}Answer` as keyof SectionFaqProps] as string)?.trim() ?? '';
    if (!question && !answer) continue;
    items.push({ id: `faq-${n}`, question, answer });
  }
  return items;
}
