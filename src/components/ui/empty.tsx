/**
 * Henüz veri olmayan alanlar için boş durum.
 *
 * @example
 * <Empty>
 *   <EmptyMedia><InboxIcon /></EmptyMedia>
 *   <EmptyTitle>Henüz sipariş yok</EmptyTitle>
 *   <EmptyDescription>İlk siparişiniz geldiğinde burada görünecek.</EmptyDescription>
 *   <EmptyActions><Button>Ürün ekle</Button></EmptyActions>
 * </Empty>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export function Empty({ className, bordered = true, ...props }: ComponentProps<'div'> & { bordered?: boolean }) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-lg p-8 text-center text-balance md:p-12',
        bordered && 'border border-dashed',
        className,
      )}
      {...props}
    />
  );
}

export function EmptyMedia({ className, variant = 'icon', ...props }: ComponentProps<'div'> & { variant?: 'icon' | 'plain' }) {
  return (
    <div
      data-slot="empty-media"
      className={cn(
        'mb-2 flex shrink-0 items-center justify-center',
        variant === 'icon' && "size-11 rounded-lg border bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 data-slot="empty-title" className={cn('text-base font-medium tracking-tight', className)} {...props} />;
}

export function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="empty-description" className={cn('max-w-sm text-sm text-muted-foreground', className)} {...props} />;
}

export function EmptyActions({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="empty-actions" className={cn('mt-4 flex flex-wrap items-center justify-center gap-2', className)} {...props} />;
}
