/**
 * Açılır katmanlar için konumlandırma (popover, tooltip, menü, select).
 * `position: fixed` koordinatı üretir; sığmazsa karşı tarafa döner (flip),
 * ekrandan taşarsa kenara yaslanır (shift).
 */

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export type Rect = { x: number; y: number; width: number; height: number };

export type PositionOptions = {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
};

export type Position = { x: number; y: number; side: Side; align: Align; maxHeight: number; maxWidth: number };

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function place(reference: Rect, floating: { width: number; height: number }, side: Side, align: Align, sideOffset: number, alignOffset: number) {
  const vertical = side === 'top' || side === 'bottom';
  let x = 0;
  let y = 0;

  if (side === 'bottom') y = reference.y + reference.height + sideOffset;
  if (side === 'top') y = reference.y - floating.height - sideOffset;
  if (side === 'right') x = reference.x + reference.width + sideOffset;
  if (side === 'left') x = reference.x - floating.width - sideOffset;

  if (vertical) {
    if (align === 'start') x = reference.x + alignOffset;
    if (align === 'center') x = reference.x + reference.width / 2 - floating.width / 2;
    if (align === 'end') x = reference.x + reference.width - floating.width - alignOffset;
  } else {
    if (align === 'start') y = reference.y + alignOffset;
    if (align === 'center') y = reference.y + reference.height / 2 - floating.height / 2;
    if (align === 'end') y = reference.y + reference.height - floating.height - alignOffset;
  }
  return { x, y };
}

function spaceOn(side: Side, reference: Rect, viewport: { width: number; height: number }, padding: number) {
  if (side === 'bottom') return viewport.height - (reference.y + reference.height) - padding;
  if (side === 'top') return reference.y - padding;
  if (side === 'right') return viewport.width - (reference.x + reference.width) - padding;
  return reference.x - padding;
}

export function computePosition(
  reference: Rect,
  floating: { width: number; height: number },
  { side = 'bottom', align = 'center', sideOffset = 6, alignOffset = 0, collisionPadding = 8 }: PositionOptions = {},
): Position {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const vertical = side === 'top' || side === 'bottom';
  const needed = (vertical ? floating.height : floating.width) + sideOffset;

  let finalSide = side;
  if (spaceOn(side, reference, viewport, collisionPadding) < needed) {
    const opposite = OPPOSITE[side];
    if (spaceOn(opposite, reference, viewport, collisionPadding) > spaceOn(side, reference, viewport, collisionPadding)) {
      finalSide = opposite;
    }
  }

  let { x, y } = place(reference, floating, finalSide, align, sideOffset, alignOffset);

  const minX = collisionPadding;
  const minY = collisionPadding;
  const maxX = viewport.width - floating.width - collisionPadding;
  const maxY = viewport.height - floating.height - collisionPadding;
  if (vertical) x = Math.max(minX, Math.min(x, Math.max(minX, maxX)));
  else y = Math.max(minY, Math.min(y, Math.max(minY, maxY)));

  const available = spaceOn(finalSide, reference, viewport, collisionPadding) - sideOffset;
  const maxHeight = vertical ? available : viewport.height - collisionPadding * 2;
  const maxWidth = vertical ? viewport.width - collisionPadding * 2 : available;

  return { x: Math.round(x), y: Math.round(y), side: finalSide, align, maxHeight, maxWidth };
}

/** Bir öğenin veya sanal bir noktanın (sağ tık konumu) dikdörtgeni. */
export function getRect(target: Element | { x: number; y: number }): Rect {
  if ('getBoundingClientRect' in target) {
    const r = target.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }
  return { x: target.x, y: target.y, width: 0, height: 0 };
}
