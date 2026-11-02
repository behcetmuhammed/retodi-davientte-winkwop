/**
 * İlerleme göstergeleri: yatay çubuk ve dairesel.
 * `value` verilmezse belirsiz (indeterminate) yükleme animasyonu gösterir.
 *
 * @example
 * <Progress value={64} aria-label="Yükleme" />
 * <Progress value={3} max={5} variant="success" size="sm" />
 * <Progress />   // belirsiz
 * <CircularProgress value={72} showValue />
 */
import type { ComponentProps } from 'react';
import { clamp, cn } from '../../lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'destructive';

const BAR: Record<Variant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
};

const STROKE: Record<Variant, string> = {
  default: 'stroke-primary',
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
};

type ProgressProps = Omit<ComponentProps<'div'>, 'children'> & {
  value?: number | null;
  max?: number;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
};

export function Progress({ value, max = 100, variant = 'default', size = 'md', className, ...props }: ProgressProps) {
  const indeterminate = value == null;
  const percent = indeterminate ? 0 : clamp((value / max) * 100, 0, 100);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      data-slot="progress"
      data-state={indeterminate ? 'indeterminate' : percent === 100 ? 'complete' : 'loading'}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-primary/12',
        size === 'sm' && 'h-1',
        size === 'md' && 'h-2',
        size === 'lg' && 'h-3',
        className,
      )}
      {...props}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-300 ease-out', BAR[variant], indeterminate && 'w-full origin-left animate-dv-indeterminate')}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
}

type CircularProps = Omit<ComponentProps<'div'>, 'children'> & {
  value?: number | null;
  max?: number;
  size?: number;
  thickness?: number;
  variant?: Variant;
  /** Ortada yüzde değerini gösterir. */
  showValue?: boolean;
};

export function CircularProgress({ value, max = 100, size = 48, thickness = 4, variant = 'default', showValue, className, ...props }: CircularProps) {
  const indeterminate = value == null;
  const percent = indeterminate ? 25 : clamp((value / max) * 100, 0, 100);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      data-slot="circular-progress"
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn('-rotate-90', indeterminate && 'animate-spin')}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} className="stroke-primary/12" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          className={cn('transition-[stroke-dashoffset] duration-300 ease-out', STROKE[variant])}
        />
      </svg>
      {showValue && !indeterminate && (
        <span className="absolute text-xs font-medium tabular-nums" style={{ fontSize: Math.max(10, size / 4.5) }}>
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
