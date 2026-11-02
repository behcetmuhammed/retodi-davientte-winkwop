/**
 * İçerik yüklenirken yer tutucu.
 *
 * @example
 * <div className="flex items-center gap-3">
 *   <Skeleton className="size-10 rounded-full" />
 *   <SkeletonText lines={2} className="w-48" />
 * </div>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="skeleton" aria-hidden className={cn('animate-pulse rounded-md bg-muted-foreground/12', className)} {...props} />;
}

/** Birden fazla metin satırı; son satır daha kısa. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div data-slot="skeleton-text" aria-hidden className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  );
}
