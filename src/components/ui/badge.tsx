/**
 * Durum, kategori veya kısa bilgi etiketi.
 *
 * @example
 * <Badge>Yeni</Badge>
 * <Badge variant="success">Aktif</Badge>
 * <Badge variant="outline" size="sm"><span className="size-1.5 rounded-full bg-warning" /> Beklemede</Badge>
 * <Badge asChild><a href="/kategori/ofis">Ofis</a></Badge>
 */
import type { ComponentProps } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';
import { Slot } from './slot';

export const badgeVariants = variants({
  base: [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border font-medium whitespace-nowrap',
    'transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
    "[&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  ],
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/70',
      outline: 'border-border text-foreground [a&]:hover:bg-accent',
      destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
      success: 'border-success/20 bg-success/10 text-success',
      warning: 'border-warning/25 bg-warning/10 text-warning',
      info: 'border-info/20 bg-info/10 text-info',
    },
    size: {
      sm: 'h-5 px-1.5 text-[0.6875rem]',
      md: 'h-6 px-2 text-xs',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean };

export function Badge({ className, variant, size, asChild, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span';
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
