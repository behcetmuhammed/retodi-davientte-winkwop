/**
 * İçeriği sabit en-boy oranında tutar.
 *
 * @example
 * <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
 *   <img src={banner} alt="" className="size-full object-cover" />
 * </AspectRatio>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export function AspectRatio({ ratio = 1, className, style, ...props }: ComponentProps<'div'> & { ratio?: number }) {
  return <div data-slot="aspect-ratio" className={cn('relative w-full', className)} style={{ aspectRatio: String(ratio), ...style }} {...props} />;
}
