import type { FaqItem } from './normalize-faq-items';
import { FaqOpenRow } from './faq-open-row';

type FaqOpenListProps = {
  items: FaqItem[];
  titleColor?: string;
};

export function FaqOpenList({ items, titleColor }: FaqOpenListProps) {
  return (
    <ul className="list-none border-y border-border p-0">
      {items.map((item, i) => (
        <FaqOpenRow
          key={item.id}
          index={i + 1}
          question={item.question}
          answer={item.answer}
          titleColor={titleColor}
        />
      ))}
    </ul>
  );
}
