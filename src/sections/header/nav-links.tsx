import type { WinkwopLink, WinkwopPageContext } from '../../generated/types';
import { cn } from '../../lib/utils';
import type { NavLinksProps } from './types';

function isNavActive(link: WinkwopLink, page: WinkwopPageContext) {
  const url = link.url.trim();
  if (!url || url === '#') return false;
  if (page.pageKey === 'home' && (url === '/' || url === '/home')) return true;
  const slug = page.category?.slug ?? page.product?.slug;
  if (slug && (url.includes(slug) || url.endsWith(`/${slug}`))) return true;
  return false;
}

export function NavLinks({ categories, page, className, orientation = 'horizontal', onNavigate }: NavLinksProps) {
  if (categories.length === 0) return null;

  const vertical = orientation === 'vertical';

  const inline = !vertical && className?.includes('w-max');

  return (
    <nav
      aria-label="Ana menü"
      className={cn(
        vertical && 'flex flex-col gap-1',
        !vertical && !inline && 'hidden items-center justify-center gap-6 md:flex lg:gap-8',
        !vertical && inline && 'flex items-center gap-4 lg:gap-6',
        className,
      )}
    >
      {categories.map((item) => {
        const active = isNavActive(item, page);
        return (
          <a
            key={`${item.url}-${item.label}`}
            href={item.url}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'text-xs font-medium tracking-widest uppercase transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring',
              vertical ? 'rounded-md px-2 py-3 text-sm tracking-wide' : 'whitespace-nowrap',
              active ? 'text-foreground' : 'text-foreground/80',
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
