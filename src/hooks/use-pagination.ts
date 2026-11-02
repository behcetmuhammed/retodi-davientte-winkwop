import { useMemo } from 'react';

export type PaginationRangeItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Sayfa numaraları dizisini üretir: `[1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 20]`.
 *
 * @param siblings Aktif sayfanın iki yanında gösterilecek sayfa sayısı.
 * @param boundaries Baştan ve sondan her zaman gösterilecek sayfa sayısı.
 */
export function getPaginationRange(page: number, totalPages: number, siblings = 1, boundaries = 1): PaginationRangeItem[] {
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  const slots = siblings * 2 + 3 + boundaries * 2;
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);

  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const start = Math.max(Math.min(current - siblings, total - boundaries - siblings * 2 - 1), boundaries + 2);
  const end = Math.min(Math.max(current + siblings, boundaries + siblings * 2 + 2), total - boundaries - 1);

  return [
    ...range(1, boundaries),
    start > boundaries + 2 ? 'ellipsis-start' : boundaries + 1,
    ...range(start, end),
    end < total - boundaries - 1 ? 'ellipsis-end' : total - boundaries,
    ...range(total - boundaries + 1, total),
  ];
}

type Options = {
  page: number;
  /** Toplam sayfa sayısı ya da `total` + `pageSize`. */
  totalPages?: number;
  total?: number;
  pageSize?: number;
  siblings?: number;
  boundaries?: number;
};

/**
 * Sayfalama hesapları.
 *
 * @example
 * const [page, setPage] = useState(1);
 * const p = usePagination({ page, total: 248, pageSize: 20 });
 * items.slice(p.startIndex, p.endIndex)
 * <Pagination page={page} totalPages={p.totalPages} onPageChange={setPage} />
 */
export function usePagination({ page, totalPages, total = 0, pageSize = 10, siblings = 1, boundaries = 1 }: Options) {
  return useMemo(() => {
    const pages = Math.max(1, totalPages ?? Math.ceil(total / pageSize));
    const current = Math.min(Math.max(1, page), pages);
    const startIndex = (current - 1) * pageSize;
    return {
      page: current,
      totalPages: pages,
      range: getPaginationRange(current, pages, siblings, boundaries),
      hasPrevious: current > 1,
      hasNext: current < pages,
      startIndex,
      endIndex: Math.min(startIndex + pageSize, total || startIndex + pageSize),
    };
  }, [page, totalPages, total, pageSize, siblings, boundaries]);
}
