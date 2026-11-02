/**
 * Duyarlı ızgara. Kolon sayısı kırılım noktalarına göre verilebilir veya
 * `minItemWidth` ile kendiliğinden sığdırılır.
 *
 * @example
 * <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="lg">...</Grid>
 * <Grid minItemWidth="16rem">...</Grid>   // ürün kartları
 */
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/utils';

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
type Responsive = Cols | { base?: Cols; sm?: Cols; md?: Cols; lg?: Cols; xl?: Cols };

const COLS: Record<string, Record<Cols, string>> = {
  base: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6', 12: 'grid-cols-12' },
  sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6', 12: 'sm:grid-cols-12' },
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6', 12: 'md:grid-cols-12' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6', 12: 'lg:grid-cols-12' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6', 12: 'xl:grid-cols-12' },
};

export const GAP = { none: 'gap-0', xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' } as const;

type GridProps = ComponentProps<'div'> & {
  cols?: Responsive;
  gap?: keyof typeof GAP;
  /** Kolon sayısı yerine: her öğe en az bu kadar genişlikte, sığdığı kadar kolon. */
  minItemWidth?: string;
};

export function Grid({ cols = 1, gap = 'md', minItemWidth, className, style, ...props }: GridProps) {
  const responsive = typeof cols === 'number' ? { base: cols } : cols;
  const colClasses = minItemWidth
    ? 'grid-cols-[repeat(auto-fill,minmax(min(var(--grid-min),100%),1fr))]'
    : Object.entries(responsive).map(([bp, n]) => COLS[bp][n as Cols]);
  return (
    <div
      data-slot="grid"
      className={cn('grid', colClasses, GAP[gap], className)}
      style={minItemWidth ? ({ '--grid-min': minItemWidth, ...style } as CSSProperties) : style}
      {...props}
    />
  );
}

const SPAN: Record<number, string> = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4', 5: 'col-span-5', 6: 'col-span-6',
  7: 'col-span-7', 8: 'col-span-8', 9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
};

export function GridItem({ span, className, ...props }: ComponentProps<'div'> & { span?: number | 'full' }) {
  return <div data-slot="grid-item" className={cn(span === 'full' ? 'col-span-full' : span && SPAN[span], className)} {...props} />;
}
