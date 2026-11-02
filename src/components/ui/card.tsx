/**
 * İçeriği bağımsız bir kart içinde gösterir.
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Teslimat adresi</CardTitle>
 *     <CardDescription>Siparişleriniz bu adrese gönderilir.</CardDescription>
 *     <CardAction><Button variant="ghost" size="sm">Düzenle</Button></CardAction>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter className="justify-end"><Button>Kaydet</Button></CardFooter>
 * </Card>
 */
import type { ComponentProps } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';

const cardVariants = variants({
  base: 'flex flex-col rounded-lg border bg-card text-card-foreground',
  variants: {
    variant: {
      default: 'border-border',
      muted: 'border-transparent bg-muted',
      ghost: 'border-transparent bg-transparent',
    },
    size: {
      sm: 'gap-4 py-4 [--card-px:--spacing(4)]',
      md: 'gap-6 py-6 [--card-px:--spacing(6)]',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>;

export function Card({ className, variant, size, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant, size }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-(--card-px)',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 data-slot="card-title" className={cn('font-heading text-base leading-snug font-semibold', className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-(--card-px)', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center gap-2 px-(--card-px) [.border-t]:pt-6', className)} {...props} />
  );
}
