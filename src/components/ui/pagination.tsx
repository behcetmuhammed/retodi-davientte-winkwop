/**
 * Sayfalama. Hazır kullanım için `Pagination`; özel düzen için parçalar.
 *
 * @example
 * // Hazır: state ile
 * <Pagination page={page} totalPages={12} onPageChange={setPage} />
 *
 * // Hazır: bağlantılarla (SEO dostu, sayfa yenilenir)
 * <Pagination page={3} totalPages={12} getHref={(p) => `?sayfa=${p}`} />
 *
 * // Parçalar
 * <PaginationRoot>
 *   <PaginationContent>
 *     <PaginationItem><PaginationPrevious href="?sayfa=1" /></PaginationItem>
 *     <PaginationItem><PaginationLink href="?sayfa=2" isActive>2</PaginationLink></PaginationItem>
 *     <PaginationItem><PaginationEllipsis /></PaginationItem>
 *     <PaginationItem><PaginationNext href="?sayfa=3" /></PaginationItem>
 *   </PaginationContent>
 * </PaginationRoot>
 */
import type { ComponentProps } from 'react';
import { getPaginationRange } from '../../hooks/use-pagination';
import { cn } from '../../lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from '../icons';
import { buttonVariants } from './button';
import { Slot } from './slot';

export function PaginationRoot({ className, ...props }: ComponentProps<'nav'>) {
  return <nav aria-label="Sayfalama" data-slot="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />;
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

export function PaginationItem(props: ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = ComponentProps<'a'> & {
  isActive?: boolean;
  disabled?: boolean;
  size?: 'icon-sm' | 'icon' | 'sm' | 'md';
  asChild?: boolean;
};

export function PaginationLink({ isActive, disabled, size = 'icon', asChild, className, ...props }: PaginationLinkProps) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      data-active={isActive || undefined}
      data-slot="pagination-link"
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }),
        'tabular-nums',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...(props as ComponentProps<'a'>)}
    />
  );
}

export function PaginationPrevious({ className, children = 'Önceki', ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Önceki sayfa" size="md" className={cn('gap-1 px-2.5 sm:pl-2', className)} {...props}>
      <ChevronLeftIcon />
      <span className="hidden sm:block">{children}</span>
    </PaginationLink>
  );
}

export function PaginationNext({ className, children = 'Sonraki', ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Sonraki sayfa" size="md" className={cn('gap-1 px-2.5 sm:pr-2', className)} {...props}>
      <span className="hidden sm:block">{children}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn('flex size-9 items-center justify-center text-muted-foreground', className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
    </span>
  );
}

type PaginationProps = Omit<ComponentProps<'nav'>, 'onChange'> & {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  /** Verilirse sayfalar gerçek bağlantı olur. */
  getHref?: (page: number) => string;
  siblings?: number;
  /** Önceki/Sonraki yazılarını gizler, yalnızca ok gösterir. */
  compact?: boolean;
};

export function Pagination({ page, totalPages, onPageChange, getHref, siblings = 1, compact, className, ...props }: PaginationProps) {
  if (totalPages <= 1) return null;
  const range = getPaginationRange(page, totalPages, siblings);

  const linkProps = (target: number, disabled = false) => {
    const href = disabled ? undefined : getHref ? getHref(target) : '#';
    return {
      href,
      role: getHref ? undefined : 'button',
      disabled,
      tabIndex: disabled ? -1 : undefined,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) return event.preventDefault();
        if (!getHref) event.preventDefault();
        onPageChange?.(target);
      },
    };
  };

  return (
    <PaginationRoot className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious {...linkProps(page - 1, page <= 1)} className={compact ? 'size-9 px-0 sm:pl-0' : undefined}>
            {compact ? '' : undefined}
          </PaginationPrevious>
        </PaginationItem>
        {range.map((item) =>
          typeof item === 'number' ? (
            <PaginationItem key={item}>
              <PaginationLink isActive={item === page} aria-label={`Sayfa ${item}`} {...linkProps(item)}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext {...linkProps(page + 1, page >= totalPages)} className={compact ? 'size-9 px-0 sm:pr-0' : undefined}>
            {compact ? '' : undefined}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
