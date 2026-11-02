/**
 * Sayfa içi bilgilendirme, başarı, uyarı veya hata mesajı.
 *
 * @example
 * <Alert variant="warning">
 *   <AlertTitle>Stok azaldı</AlertTitle>
 *   <AlertDescription>Bu üründen yalnızca 2 adet kaldı.</AlertDescription>
 * </Alert>
 *
 * <Alert variant="destructive" onDismiss={() => setError(null)}>...</Alert>
 */
import type { ComponentProps, ReactNode } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from '../icons';

const alertVariants = variants({
  base: 'relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-0.5 rounded-lg border px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4',
  variants: {
    variant: {
      default: 'border-border bg-background text-foreground [&>svg]:text-foreground',
      info: 'border-info/25 bg-info/[0.06] text-foreground [&>svg]:text-info',
      success: 'border-success/25 bg-success/[0.06] text-foreground [&>svg]:text-success',
      warning: 'border-warning/30 bg-warning/[0.07] text-foreground [&>svg]:text-warning',
      destructive: 'border-destructive/25 bg-destructive/[0.06] text-foreground [&>svg]:text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

const ICONS = {
  default: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: CircleAlertIcon,
};

type AlertProps = ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    /** Varsayılan ikonu değiştirir; `null` ikonsuz gösterir. */
    icon?: ReactNode | null;
    /** Verilirse sağ üstte kapatma düğmesi çıkar. */
    onDismiss?: () => void;
  };

export function Alert({ className, variant, icon, onDismiss, children, ...props }: AlertProps) {
  const Icon = ICONS[variant ?? 'default'];
  const urgent = variant === 'destructive' || variant === 'warning';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      data-slot="alert"
      className={cn(alertVariants({ variant }), icon === null && 'grid-cols-1', onDismiss && 'pr-10', className)}
      {...props}
    >
      {icon === undefined ? <Icon /> : icon}
      {children}
      {onDismiss && (
        <button
          type="button"
          aria-label="Kapat"
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-title" className={cn('col-start-2 leading-snug font-medium [[data-slot=alert]>&:first-child]:col-start-1', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 text-muted-foreground [&_p]:leading-relaxed [[data-slot=alert]>&:first-child]:col-start-1', className)}
      {...props}
    />
  );
}

export function AlertActions({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-actions" className={cn('col-start-2 mt-2 flex gap-2', className)} {...props} />;
}
