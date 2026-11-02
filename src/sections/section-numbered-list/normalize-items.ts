import type { SectionNumberedListProps } from '../../generated/types';

export type NumberedListItem = {
  title: string;
  description: string;
};

export function normalizeNumberedListItems(props: SectionNumberedListProps): NumberedListItem[] {
  const items: NumberedListItem[] = [];
  for (let n = 1; n <= 6; n++) {
    const title = (props[`item${n}Title` as keyof SectionNumberedListProps] as string)?.trim() ?? '';
    const description =
      (props[`item${n}Description` as keyof SectionNumberedListProps] as string)?.trim() ?? '';
    if (!title && !description) continue;
    items.push({ title, description });
  }
  return items;
}
