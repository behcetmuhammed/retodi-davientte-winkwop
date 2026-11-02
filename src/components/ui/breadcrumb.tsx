/**
 * Sayfa konumu (ekmek kırıntısı).
 *
 * @example
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem><BreadcrumbLink href="/">Ana sayfa</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem><BreadcrumbLink href="/kategori/ofis">Ofis</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem><BreadcrumbPage>Çalışma masası</BreadcrumbPage></BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 *
 * // Kısa yol:
 * <Breadcrumbs items={[{ label: 'Ana sayfa', href: '/' }, { label: 'Ofis', href: '/ofis' }, { label: 'Masa' }]} />
 */
import { Fragment, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ChevronRightIcon, MoreHorizontalIcon } from '../icons';
import { Slot } from './slot';

export function Breadcrumb(props: ComponentProps<'nav'>) {
  return <nav aria-label="Konum" data-slot="breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn('flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2', className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

export function BreadcrumbLink({ asChild, className, ...props }: ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn('rounded-xs transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring', className)}
      {...(props as ComponentProps<'a'>)}
    />
  );
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn('font-normal text-foreground', className)} {...props} />;
}

export function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<'li'>) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden className={cn('[&>svg]:size-3.5', className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span data-slot="breadcrumb-ellipsis" className={cn('flex size-5 items-center justify-center', className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Diğer sayfalar</span>
    </span>
  );
}

type Crumb = { label: ReactNode; href?: string };

export function Breadcrumbs({ items, className, ...props }: ComponentProps<'nav'> & { items: Crumb[] }) {
  return (
    <Breadcrumb className={className} {...props}>
      <BreadcrumbList>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              <BreadcrumbItem>
                {last || !item.href ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>}
              </BreadcrumbItem>
              {!last && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
