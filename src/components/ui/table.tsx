/**
 * Tablo parçaları. Dar ekranda yatay kaydırılır.
 *
 * @example
 * <Table>
 *   <TableCaption>Son siparişler</TableCaption>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead sortDirection={sort} onSort={toggleSort}>Tarih</TableHead>
 *       <TableHead align="right">Tutar</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow data-state={selected ? 'selected' : undefined}>
 *       <TableCell>12.04.2026</TableCell>
 *       <TableCell align="right">₺1.250,00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '../icons';

type TableProps = ComponentProps<'table'> & {
  containerClassName?: string;
  /** Kenarlıklı kutu içinde gösterir. */
  bordered?: boolean;
  /** Satırları daha sık gösterir. */
  dense?: boolean;
};

export function Table({ containerClassName, bordered, dense, className, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      data-dense={dense || undefined}
      className={cn('group/table relative w-full overflow-x-auto dv-scrollbar', bordered && 'rounded-lg border', containerClassName)}
    >
      <table data-slot="table" className={cn('w-full caption-bottom border-collapse text-sm', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return <tfoot data-slot="table-footer" className={cn('border-t bg-muted/60 font-medium [&>tr]:last:border-b-0', className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  );
}

type Align = 'left' | 'center' | 'right';
const ALIGN: Record<Align, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

type TableHeadProps = Omit<ComponentProps<'th'>, 'align'> & {
  align?: Align;
  /** Sıralanabilir sütun: mevcut yön. `false` = sıralanmamış. */
  sortDirection?: 'asc' | 'desc' | false;
  onSort?: () => void;
};

export function TableHead({ align = 'left', sortDirection, onSort, className, children, ...props }: TableHeadProps) {
  const sortable = !!onSort;
  const SortIcon = sortDirection === 'asc' ? ArrowUpIcon : sortDirection === 'desc' ? ArrowDownIcon : ArrowUpDownIcon;
  return (
    <th
      data-slot="table-head"
      scope="col"
      aria-sort={sortable ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : undefined}
      className={cn(
        'h-10 px-3 align-middle font-medium whitespace-nowrap text-muted-foreground group-data-dense/table:h-8',
        ALIGN[align],
        '[&:has([role=checkbox])]:w-px [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            '-mx-1.5 inline-flex items-center gap-1.5 rounded-sm px-1.5 py-1 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring',
            sortDirection && 'text-foreground',
            align === 'right' && 'flex-row-reverse',
          )}
        >
          {children}
          <SortIcon className={cn('size-3.5', !sortDirection && 'opacity-50')} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

type TableCellProps = Omit<ComponentProps<'td'>, 'align'> & { align?: Align };

export function TableCell({ align = 'left', className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-3 align-middle group-data-dense/table:py-2',
        ALIGN[align],
        align === 'right' && 'tabular-nums',
        '[&:has([role=checkbox])]:w-px [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return <caption data-slot="table-caption" className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />;
}
