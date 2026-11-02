import type { CSSProperties } from 'react';
import { clamp } from '../../lib/utils';

export const MEDIA_GRID_CLASSNAME =
  'grid grid-cols-2 md:grid-cols-12 auto-rows-[var(--mg-row-height)] gap-[var(--mg-gap)] grid-flow-dense items-start';

export const DEFAULT_DESKTOP_ROW_HEIGHT = 290;
export const DEFAULT_MOBILE_ROW_HEIGHT = 180;
export const DEFAULT_COLUMN_SPACING = 24;

export const MEDIA_HOVER_CLASSNAME =
  'transition-transform duration-300 ease-out group-hover:scale-105';

export const MEDIA_GRID_TITLE_CLASSNAME =
  'text-base md:text-xl tracking-wide font-medium mb-0 md:mb-2 drop-shadow-lg';

export const MEDIA_GRID_SUBTITLE_CLASSNAME =
  'mb-1 md:mb-2 text-xs md:text-sm font-medium uppercase tracking-wider';

export const MEDIA_GRID_CONTENT_CLASSNAME =
  'text-sm md:text-base mb-4 max-w-xl drop-shadow text-background/95 [&_p]:m-0';

const DEFAULT_COLUMN_SPAN = 3;
const VALID_COLUMN_SPANS = [3, 4, 6, 8, 12];
const ROW_COUNT_MIN = 1;
const ROW_COUNT_MAX = 5;
const MOBILE_ROW_COUNT_MAX = 2;
const DEFAULT_ROW_COUNT = 1;

export type MediaGridStyle = CSSProperties & {
  '--mg-row-height': string;
  '--mg-gap': string;
};

export function getMediaGridStyle(rowHeightPx: number, gapPx: number): MediaGridStyle {
  return {
    '--mg-row-height': `${rowHeightPx}px`,
    '--mg-gap': `${gapPx}px`,
  };
}

export function getMediaGridRowHeight(
  isMobile: boolean,
  desktopRowHeight: number,
  mobileRowHeight: number,
): number {
  const raw = isMobile ? mobileRowHeight : desktopRowHeight;
  const fallback = isMobile ? DEFAULT_MOBILE_ROW_HEIGHT : DEFAULT_DESKTOP_ROW_HEIGHT;
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

export function getMediaGridGap(columnSpacing: number): number {
  return Number.isFinite(columnSpacing) && columnSpacing >= 0 ? columnSpacing : DEFAULT_COLUMN_SPACING;
}

export function getColumnSpan(columnCount: string | number | undefined): number {
  const parsed = parseInt(String(columnCount ?? DEFAULT_COLUMN_SPAN), 10);
  return VALID_COLUMN_SPANS.includes(parsed) ? parsed : DEFAULT_COLUMN_SPAN;
}

export function getRowSpan(rowCount: number | undefined): number {
  const parsed = rowCount ?? DEFAULT_ROW_COUNT;
  return clamp(Math.round(parsed), ROW_COUNT_MIN, ROW_COUNT_MAX);
}

export function getMediaGridItemStyle(
  isMobile: boolean,
  columnSpan: number,
  rowSpan: number,
): CSSProperties {
  if (isMobile) {
    return {
      gridColumn: 'span 2',
      gridRow: `span ${Math.min(MOBILE_ROW_COUNT_MAX, rowSpan)}`,
    };
  }

  return {
    gridColumn: `span ${columnSpan}`,
    gridRow: `span ${rowSpan}`,
  };
}

function needsFullWidthInset(
  isMobile: boolean,
  useFullWidth: boolean,
  useFullWidthMobile: boolean,
): boolean {
  return isMobile
    ? Boolean(useFullWidthMobile || (useFullWidth && useFullWidthMobile !== false))
    : Boolean(useFullWidth);
}

/** Tam genişlikte üst şerit ve grid kenarı için yatay iç boşluk. */
export function getFullWidthInsetClass(
  isMobile: boolean,
  useFullWidth: boolean,
  useFullWidthMobile: boolean,
): string {
  return needsFullWidthInset(isMobile, useFullWidth, useFullWidthMobile) ? 'px-2.5 md:px-4' : '';
}

export function isContainerFullWidth(
  isMobile: boolean,
  useFullWidth: boolean,
  useFullWidthMobile: boolean,
): boolean {
  return isMobile ? useFullWidthMobile : useFullWidth;
}
