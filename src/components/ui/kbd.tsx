/**
 * Klavye tuşu gösterimi.
 *
 * @example
 * <Kbd>Esc</Kbd>
 * <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-xs border border-b-2 bg-muted px-1 font-sans text-[0.6875rem] font-medium text-muted-foreground select-none',
        "[&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export function KbdGroup({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="kbd-group" className={cn('inline-flex items-center gap-1', className)} {...props} />;
}
