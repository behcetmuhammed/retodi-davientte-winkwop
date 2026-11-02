/**
 * Birden fazla butonu bitişik bir grup olarak gösterir.
 *
 * @example
 * <ButtonGroup aria-label="Görünüm">
 *   <Button variant="outline">Liste</Button>
 *   <Button variant="outline">Izgara</Button>
 *   <ButtonGroupSeparator />
 *   <IconButton variant="outline" aria-label="Diğer"><MoreHorizontalIcon /></IconButton>
 * </ButtonGroup>
 *
 * <ButtonGroup>
 *   <ButtonGroupText>https://</ButtonGroupText>
 *   <Input placeholder="alanadi.com" />
 * </ButtonGroup>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

type ButtonGroupProps = ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' };

export function ButtonGroup({ orientation = 'horizontal', className, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        'flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10',
        "[&>[data-slot=input]]:flex-1 [&>[data-slot=select-trigger]]:w-fit",
        orientation === 'horizontal'
          ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none'
          : 'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
        className,
      )}
      {...props}
    />
  );
}

/** Grup içindeki parçalar arasına ince ayraç koyar (dolu butonlarda belirgin olur). */
export function ButtonGroupSeparator({
  orientation = 'vertical',
  className,
  ...props
}: ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="button-group-separator"
      className={cn(
        'relative !m-0 shrink-0 self-stretch bg-border',
        orientation === 'vertical' ? 'w-px' : 'h-px',
        className,
      )}
      {...props}
    />
  );
}

/** Grup içinde etkileşimsiz metin parçası (ön ek, birim...). */
export function ButtonGroupText({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        'flex items-center gap-2 rounded-md border bg-muted px-3 text-sm font-medium text-muted-foreground shadow-xs',
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}
