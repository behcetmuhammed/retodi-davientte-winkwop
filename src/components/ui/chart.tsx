/**
 * Bağımlılıksız SVG grafikler: çubuk, çizgi, alan ve halka (donut).
 * Renkler tema token'larından gelir (`--dv-chart-1..5`).
 * Ekran okuyucular için veriler gizli bir tablo olarak da verilir.
 *
 * @example
 * <Chart
 *   type="bar"
 *   data={[{ ay: 'Oca', satis: 120, iade: 8 }, { ay: 'Şub', satis: 160, iade: 12 }]}
 *   xKey="ay"
 *   series={[{ key: 'satis', label: 'Satış' }, { key: 'iade', label: 'İade' }]}
 *   valueFormatter={(v) => formatCurrency(v)}
 *   height={260}
 *   title="Aylık satışlar"
 * />
 *
 * <DonutChart data={[{ label: 'Kart', value: 62 }, { label: 'Havale', value: 38 }]} centerLabel="Ödeme" />
 */
import { useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { cn } from '../../lib/utils';

const PALETTE = ['var(--dv-chart-1)', 'var(--dv-chart-2)', 'var(--dv-chart-3)', 'var(--dv-chart-4)', 'var(--dv-chart-5)'];

type Row = Record<string, string | number | null | undefined>;

export type ChartSeries = { key: string; label?: string; color?: string };

type Formatter = (value: number) => string;
const defaultFormatter: Formatter = (v) => v.toLocaleString('tr-TR');

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** 0'dan başlayan, "yuvarlak" eksen değerleri. */
function niceTicks(min: number, max: number, count = 5) {
  if (min === max) max = min + 1;
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const norm = step0 / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

function compact(v: number) {
  return new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
}

type ChartProps = {
  type?: 'bar' | 'line' | 'area';
  data: Row[];
  xKey: string;
  series: ChartSeries[];
  height?: number;
  /** Çubukları üst üste dizer (bar/area). */
  stacked?: boolean;
  valueFormatter?: Formatter;
  /** Y ekseni etiketleri; varsayılan kısaltılmış sayı (1,2 B). */
  axisFormatter?: Formatter;
  showGrid?: boolean;
  showLegend?: boolean;
  showYAxis?: boolean;
  /** Çizgi grafiklerde eğri. Varsayılan: true */
  curved?: boolean;
  title?: string;
  className?: string;
  emptyState?: ReactNode;
};

export function Chart({
  type = 'bar',
  data,
  xKey,
  series,
  height = 240,
  stacked = false,
  valueFormatter = defaultFormatter,
  axisFormatter = compact,
  showGrid = true,
  showLegend = series.length > 1,
  showYAxis = true,
  curved = true,
  title,
  className,
  emptyState = 'Gösterilecek veri yok',
}: ChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const colors = series.map((s, i) => s.color ?? PALETTE[i % PALETTE.length]);
  const num = (row: Row, key: string) => Number(row[key] ?? 0) || 0;

  const values = data.flatMap((row) =>
    stacked ? [series.reduce((sum, s) => sum + num(row, s.key), 0)] : series.map((s) => num(row, s.key)),
  );
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const pad = { top: 8, right: 8, bottom: 24, left: showYAxis ? 44 : 8 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const y = (v: number) => pad.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const band = data.length ? innerW / data.length : 0;
  const xCenter = (i: number) => pad.left + band * i + band / 2;
  const xPoint = (i: number) => (data.length <= 1 ? pad.left + innerW / 2 : pad.left + (innerW / (data.length - 1)) * i);
  const xOf = type === 'bar' ? xCenter : xPoint;

  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(innerW / 56))));

  const path = (points: [number, number][]) => {
    if (points.length === 0) return '';
    if (!curved || points.length < 3) return points.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join(' ');
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i - 1] ?? points[i];
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const [x3, y3] = points[i + 2] ?? points[i + 1];
      const t = 1 / 6;
      d += ` C${x1 + (x2 - x0) * t},${y1 + (y2 - y0) * t} ${x2 - (x3 - x1) * t},${y2 - (y3 - y1) * t} ${x2},${y2}`;
    }
    return d;
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!data.length || innerW <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left - pad.left;
    const index = type === 'bar' ? Math.floor(px / band) : Math.round(px / (innerW / Math.max(1, data.length - 1)));
    setActive(index >= 0 && index < data.length ? index : null);
  };

  const tooltip =
    active !== null && data[active] ? (
      <div
        className="pointer-events-none absolute top-0 z-10 min-w-32 rounded-md border bg-background px-3 py-2 text-xs shadow-md"
        style={{
          left: Math.min(Math.max(xOf(active), 70), width - 70),
          transform: 'translateX(-50%)',
        }}
      >
        <div className="mb-1 font-medium">{String(data[active][xKey] ?? '')}</div>
        {series.map((s, i) => (
          <div key={s.key} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-xs" style={{ background: colors[i] }} />
              {s.label ?? s.key}
            </span>
            <span className="font-medium tabular-nums">{valueFormatter(num(data[active], s.key))}</span>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <figure data-slot="chart" className={cn('flex w-full flex-col gap-3', className)}>
      <div ref={ref} className="relative w-full" style={{ height }}>
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{emptyState}</div>
        ) : width > 0 ? (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={title ?? 'Grafik'}
            className="overflow-visible text-[0.6875rem]"
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                {showGrid && <line x1={pad.left} x2={pad.left + innerW} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray={t === 0 ? undefined : '3 3'} />}
                {showYAxis && (
                  <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground">
                    {axisFormatter(t)}
                  </text>
                )}
              </g>
            ))}

            {data.map((row, i) =>
              i % labelEvery === 0 ? (
                <text key={i} x={xOf(i)} y={height - 6} textAnchor="middle" className="fill-muted-foreground">
                  {String(row[xKey] ?? '')}
                </text>
              ) : null,
            )}

            {active !== null && type !== 'bar' && <line x1={xOf(active)} x2={xOf(active)} y1={pad.top} y2={pad.top + innerH} className="stroke-border" />}
            {active !== null && type === 'bar' && <rect x={pad.left + band * active} y={pad.top} width={band} height={innerH} className="fill-muted" />}

            {type === 'bar' &&
              data.map((row, i) => {
                const groupW = band * 0.7;
                const barW = stacked ? groupW : groupW / series.length;
                let acc = 0;
                return series.map((s, si) => {
                  const v = num(row, s.key);
                  const base = stacked ? acc : 0;
                  acc += v;
                  const top = y(Math.max(base, base + v));
                  const h = Math.abs(y(base) - y(base + v));
                  const x = pad.left + band * i + (band - groupW) / 2 + (stacked ? 0 : barW * si);
                  return <rect key={s.key} x={x} y={top} width={Math.max(1, barW - (stacked ? 0 : 2))} height={h} rx={stacked ? 0 : 2} fill={colors[si]} />;
                });
              })}

            {type !== 'bar' &&
              (() => {
                const baseline = new Array(data.length).fill(0);
                return series.map((s, si) => {
                  const lower = [...baseline];
                  const points = data.map((row, i) => {
                    const v = num(row, s.key) + (stacked ? baseline[i] : 0);
                    if (stacked) baseline[i] = v;
                    return [xPoint(i), y(v)] as [number, number];
                  });
                  const line = path(points);
                  const floor = stacked ? lower.map((v, i) => [xPoint(i), y(v)] as [number, number]).reverse() : null;
                  const area =
                    type === 'area'
                      ? floor
                        ? `${line} L${floor.map(([px, py]) => `${px},${py}`).join(' L')} Z`
                        : `${line} L${xPoint(data.length - 1)},${y(Math.max(0, yMin))} L${xPoint(0)},${y(Math.max(0, yMin))} Z`
                      : null;
                  return (
                    <g key={s.key}>
                      {area && <path d={area} fill={colors[si]} fillOpacity={stacked ? 0.35 : 0.12} />}
                      <path d={line} fill="none" stroke={colors[si]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                      {active !== null && <circle cx={points[active][0]} cy={points[active][1]} r={3.5} fill={colors[si]} className="stroke-background" strokeWidth={2} />}
                    </g>
                  );
                });
              })()}
          </svg>
        ) : null}
        {tooltip}
      </div>

      {showLegend && <ChartLegend items={series.map((s, i) => ({ label: s.label ?? s.key, color: colors[i] }))} />}

      <table className="sr-only">
        {title && <caption>{title}</caption>}
        <thead>
          <tr>
            <th scope="col">{xKey}</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label ?? s.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <th scope="row">{String(row[xKey] ?? '')}</th>
              {series.map((s) => (
                <td key={s.key}>{valueFormatter(num(row, s.key))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function ChartLegend({ items, className }: { items: { label: ReactNode; color: string }[]; className?: string }) {
  return (
    <ul data-slot="chart-legend" className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-xs" style={{ background: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

type DonutDatum = { label: string; value: number; color?: string };

type DonutProps = {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: ReactNode;
  /** Ortadaki değer; varsayılan toplam. */
  centerValue?: ReactNode;
  valueFormatter?: Formatter;
  showLegend?: boolean;
  title?: string;
  className?: string;
};

export function DonutChart({
  data,
  size = 180,
  thickness = 22,
  centerLabel,
  centerValue,
  valueFormatter = defaultFormatter,
  showLegend = true,
  title,
  className,
}: DonutProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = data.length > 1 ? 2 : 0;
  let offset = 0;

  return (
    <figure data-slot="donut-chart" className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title ?? 'Dağılım grafiği'} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-muted" />
          {total > 0 &&
            data.map((d, i) => {
              const len = (Math.max(0, d.value) / total) * c;
              const seg = (
                <circle
                  key={d.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={d.color ?? PALETTE[i % PALETTE.length]}
                  strokeWidth={active === i ? thickness + 4 : thickness}
                  strokeDasharray={`${Math.max(0, len - gap)} ${c}`}
                  strokeDashoffset={-offset}
                  className="transition-[stroke-width] duration-150"
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                />
              );
              offset += len;
              return seg;
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {active !== null ? (
            <>
              <span className="text-xs text-muted-foreground">{data[active].label}</span>
              <span className="text-lg font-semibold tabular-nums">{valueFormatter(data[active].value)}</span>
              <span className="text-xs text-muted-foreground tabular-nums">%{total ? Math.round((data[active].value / total) * 100) : 0}</span>
            </>
          ) : (
            <>
              {centerLabel && <span className="text-xs text-muted-foreground">{centerLabel}</span>}
              <span className="text-lg font-semibold tabular-nums">{centerValue ?? valueFormatter(total)}</span>
            </>
          )}
        </div>
      </div>
      {showLegend && <ChartLegend items={data.map((d, i) => ({ label: d.label, color: d.color ?? PALETTE[i % PALETTE.length] }))} />}
      <table className="sr-only">
        {title && <caption>{title}</caption>}
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{valueFormatter(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
