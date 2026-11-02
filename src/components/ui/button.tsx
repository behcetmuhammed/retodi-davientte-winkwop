/**
 * Button ve IconButton.
 *
 * @example
 * <Button>Kaydet</Button>
 * <Button variant="outline" size="sm"><PlusIcon /> Yeni ürün</Button>
 * <Button variant="destructive" loading>Siliniyor</Button>
 * <Button asChild variant="link"><a href="/iletisim">İletişim</a></Button>
 * <IconButton aria-label="Menüyü aç" variant="ghost"><MenuIcon /></IconButton>
 */
import type { ComponentProps } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';
import { Slot } from './slot';
import { Spinner } from './spinner';

export const buttonVariants = variants({
  base: [
    'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-[color,background-color,border-color,box-shadow] outline-none select-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ],
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
      outline: 'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/30',
    },
    size: {
      xs: 'h-7 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5',
      sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
      md: 'h-9 px-4 has-[>svg]:px-3',
      lg: 'h-10 px-6 has-[>svg]:px-4',
      'icon-xs': "size-7 rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
      'icon-sm': 'size-8',
      icon: 'size-9',
      'icon-lg': 'size-10',
    },
    block: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export type ButtonProps = ComponentProps<'button'> &
  Omit<VariantProps<typeof buttonVariants>, 'block'> & {
    /** Prop'ları tek çocuğa aktarır (ör. `<a>`). */
    asChild?: boolean;
    /** Spinner gösterir, butonu pasifleştirir ve `aria-busy` ekler. */
    loading?: boolean;
    /** Tam genişlik. */
    block?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  loading = false,
  disabled,
  type,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, block: block ? 'true' : 'false' }), className);

  if (asChild) {
    return (
      <Slot data-slot="button" className={classes} aria-disabled={disabled || loading || undefined} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      data-slot="button"
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" label="İşleniyor" />
        </span>
      )}
      {loading ? <span className="invisible contents">{children}</span> : children}
    </button>
  );
}

type IconButtonProps = Omit<ButtonProps, 'size'> & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Yalnızca ikon olduğu için erişilebilir isim zorunludur. */
  'aria-label': string;
};

const ICON_SIZES = { xs: 'icon-xs', sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const;

export function IconButton({ size = 'md', variant = 'ghost', ...props }: IconButtonProps) {
  return <Button size={ICON_SIZES[size]} variant={variant} {...props} />;
}
