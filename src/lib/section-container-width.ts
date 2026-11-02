import { cn } from './utils';

export type SectionContainerWidth = 'default' | 'extraSmall' | 'small' | 'medium' | 'wide' | 'extraWide';

const MAX_WIDTH: Record<SectionContainerWidth, string> = {
  default: 'max-w-(--container-page)',
  extraSmall: 'max-w-[min(100%,calc(var(--container-page)*0.55))]',
  small: 'max-w-[min(100%,calc(var(--container-page)*0.68))]',
  medium: 'max-w-[min(100%,calc(var(--container-page)*0.8))]',
  wide: 'max-w-[min(100%,calc(var(--container-page)*0.92))]',
  extraWide: 'max-w-[min(100%,calc(var(--container-page)*1))]',
};

const VALID = new Set<string>(Object.keys(MAX_WIDTH));

export function normalizeSectionContainerWidth(value: string | undefined): SectionContainerWidth {
  const v = value?.trim();
  if (v && VALID.has(v)) return v as SectionContainerWidth;
  return 'default';
}

export function sectionContainerMaxWidthClass(preset: SectionContainerWidth | string | undefined): string {
  const key = normalizeSectionContainerWidth(typeof preset === 'string' ? preset : undefined);
  return MAX_WIDTH[key];
}

/** Bölüm dış sarmalayıcı max genişliği (mağaza `--container-page` ile ölçeklenir). */
export function sectionContainerWidthClass(preset: SectionContainerWidth | string | undefined): string {
  return cn('mx-auto w-full', sectionContainerMaxWidthClass(preset));
}
