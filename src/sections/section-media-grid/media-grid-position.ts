import type { MediaGridPosition } from './types';

const OVERLAY_POSITION_CLASSES: Partial<Record<MediaGridPosition, string>> = {
  'top-left': 'justify-start items-start text-left',
  'top-center': 'justify-start items-center text-center',
  'top-right': 'justify-start items-end text-right',
  'middle-left': 'justify-center items-start text-left',
  'middle-center': 'justify-center items-center text-center',
  'middle-right': 'justify-center items-end text-right',
  'bottom-left': 'justify-end items-start text-left',
  'bottom-center': 'justify-end items-center text-center',
  'bottom-right': 'justify-end items-end text-right',
};

const OUTSIDE_POSITION_CLASSES: Partial<Record<MediaGridPosition, string>> = {
  'outside-bottom-left': 'items-start text-left',
  'outside-bottom-center': 'items-center text-center',
  'outside-bottom-right': 'items-end text-right',
};

const DEFAULT_POSITION = 'justify-center items-center text-center';
const DEFAULT_OUTSIDE_POSITION = 'items-start text-left';

export function isOutsidePosition(position?: MediaGridPosition): boolean {
  return !!position && position.startsWith('outside-');
}

export function isOutsideBottomPosition(position?: MediaGridPosition): boolean {
  return isOutsidePosition(position);
}

export function getDefaultMediaGridTitleColor(contentOnImage: boolean): string | undefined {
  return contentOnImage ? '#ffffff' : undefined;
}

export function getDefaultMediaGridSubTitleColor(contentOnImage: boolean): string | undefined {
  return contentOnImage ? 'rgba(255,255,255,0.9)' : undefined;
}

export function getPositionClasses(position?: MediaGridPosition): string {
  if (!position || isOutsidePosition(position) || !OVERLAY_POSITION_CLASSES[position]) {
    return DEFAULT_POSITION;
  }
  return OVERLAY_POSITION_CLASSES[position]!;
}

export function getOutsidePositionClasses(position?: MediaGridPosition): string {
  if (!position || !OUTSIDE_POSITION_CLASSES[position]) {
    return DEFAULT_OUTSIDE_POSITION;
  }
  return OUTSIDE_POSITION_CLASSES[position]!;
}

export function getButtonAlignClass(position?: MediaGridPosition): string {
  if (!position) return 'justify-center';
  if (position.includes('left')) return 'justify-start';
  if (position.includes('right')) return 'justify-end';
  return 'justify-center';
}
