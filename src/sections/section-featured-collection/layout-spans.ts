import type { CSSProperties } from 'react';
import type { CollectionLayoutPreset } from './types';

const THREE_COL_GRID =
  'grid grid-cols-1 gap-[var(--fc-gap)] md:grid-cols-12 auto-rows-[var(--fc-row-height)]';
const FOUR_EQUAL_GRID =
  'grid grid-cols-2 gap-[var(--fc-gap)] md:grid-cols-4 auto-rows-[var(--fc-row-height)]';

const SPANS: Record<CollectionLayoutPreset, readonly number[] | null> = {
  fourEqual: null,
  threeNarrowWideNarrow: [3, 6, 3],
  threeWideNarrowWide: [5, 2, 5],
};

function isThreeColumnPreset(preset: CollectionLayoutPreset): boolean {
  return preset === 'threeNarrowWideNarrow' || preset === 'threeWideNarrowWide';
}

export function getCollectionGridClass(preset: CollectionLayoutPreset): string {
  return isThreeColumnPreset(preset) ? THREE_COL_GRID : FOUR_EQUAL_GRID;
}

export function getCollectionItemStyle(
  index: number,
  preset: CollectionLayoutPreset,
  isMobile: boolean,
): CSSProperties | undefined {
  if (isMobile || !isThreeColumnPreset(preset)) return undefined;
  const spans = SPANS[preset];
  const span = spans?.[index];
  if (!span) return undefined;
  return { gridColumn: `span ${span}` };
}

export function maxItemsForPreset(preset: CollectionLayoutPreset): number {
  return isThreeColumnPreset(preset) ? 3 : 4;
}
