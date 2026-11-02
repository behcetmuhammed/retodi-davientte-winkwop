/**
 * Takvim. Tekli, aralık ve çoklu seçim; Türkçe, hafta Pazartesi başlar.
 * Klavye: oklar (gün/hafta), PageUp/PageDown (ay), Shift+PageUp/PageDown (yıl),
 * Home/End (hafta başı/sonu), Enter/Space (seç).
 *
 * @example
 * const [date, setDate] = useState<Date | null>(null);
 * <Calendar mode="single" selected={date} onSelect={setDate} minDate={new Date()} />
 *
 * const [range, setRange] = useState<DateRange>({ from: null, to: null });
 * <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
 *
 * <Calendar mode="multiple" selected={dates} onSelect={setDates} disabled={isWeekend} />
 */
import { useEffect, useId, useMemo, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react';
import {
  addDays,
  addMonths,
  addYears,
  DEFAULT_LOCALE,
  getCalendarDays,
  getMonthNames,
  getWeekdayNames,
  isAfter,
  isBefore,
  isBetween,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from '../../lib/date';
import { cn } from '../../lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { buttonVariants } from './button';

export type DateRange = { from: Date | null; to: Date | null };

type SingleProps = { mode?: 'single'; selected?: Date | null; onSelect?: (date: Date | null) => void; required?: boolean };
type RangeProps = { mode: 'range'; selected?: DateRange; onSelect?: (range: DateRange) => void; required?: boolean };
type MultipleProps = { mode: 'multiple'; selected?: Date[]; onSelect?: (dates: Date[]) => void; required?: boolean; max?: number };

export type CalendarProps = Omit<ComponentProps<'div'>, 'onSelect' | 'defaultValue'> &
  (SingleProps | RangeProps | MultipleProps) & {
    /** Gösterilen ay (kontrollü). */
    month?: Date;
    defaultMonth?: Date;
    onMonthChange?: (month: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    /** true dönen günler seçilemez. */
    disabled?: (date: Date) => boolean;
    numberOfMonths?: 1 | 2;
    weekStartsOn?: 0 | 1;
    locale?: string;
    showOutsideDays?: boolean;
    /** Ay/yıl seçimini açılır listeyle yapar (doğum tarihi gibi). */
    captionLayout?: 'label' | 'dropdown';
    /** Dropdown yıl aralığı. */
    fromYear?: number;
    toYear?: number;
    /** Açılışta odaklanır (popover içinde). */
    autoFocus?: boolean;
  };

export function Calendar(props: CalendarProps) {
  const {
    mode = 'single',
    selected,
    onSelect,
    required,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    disabled,
    numberOfMonths = 1,
    weekStartsOn = 1,
    locale = DEFAULT_LOCALE,
    showOutsideDays = true,
    captionLayout = 'label',
    fromYear,
    toYear,
    autoFocus,
    className,
    ...rest
  } = props;
  delete (rest as Record<string, unknown>).max;

  const initialMonth = useMemo(() => {
    if (defaultMonth) return startOfMonth(defaultMonth);
    const s = selected as Date | DateRange | Date[] | null | undefined;
    const first = s instanceof Date ? s : Array.isArray(s) ? s[0] : s?.from;
    return startOfMonth(first ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [internalMonth, setInternalMonth] = useState(initialMonth);
  const month = monthProp ? startOfMonth(monthProp) : internalMonth;
  const setMonth = (m: Date) => {
    const next = startOfMonth(m);
    if (!monthProp) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const [focused, setFocused] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);
  const id = useId();

  const isDisabled = (date: Date) => (minDate && isBefore(date, minDate)) || (maxDate && isAfter(date, maxDate)) || !!disabled?.(date);

  const isSelected = (date: Date) => {
    if (mode === 'single') return isSameDay(selected as Date | null, date);
    if (mode === 'multiple') return ((selected as Date[] | undefined) ?? []).some((d) => isSameDay(d, date));
    const r = selected as DateRange | undefined;
    return isSameDay(r?.from, date) || isSameDay(r?.to, date);
  };

  const rangeInfo = (date: Date) => {
    if (mode !== 'range') return {};
    const r = (selected as DateRange | undefined) ?? { from: null, to: null };
    const from = r.from;
    const to = r.to ?? (from && hovered && !isBefore(hovered, from) ? hovered : null);
    if (!from || !to) return { start: isSameDay(from, date), end: false, middle: false };
    return {
      start: isSameDay(from, date),
      end: isSameDay(to, date),
      middle: isBetween(date, from, to) && !isSameDay(from, date) && !isSameDay(to, date),
      preview: !r.to,
    };
  };

  const select = (date: Date) => {
    if (isDisabled(date)) return;
    if (mode === 'single') {
      const same = isSameDay(selected as Date | null, date);
      (onSelect as SingleProps['onSelect'])?.(same && !required ? null : date);
    } else if (mode === 'multiple') {
      const list = (selected as Date[] | undefined) ?? [];
      const exists = list.some((d) => isSameDay(d, date));
      const max = (props as MultipleProps).max;
      if (exists) {
        if (required && list.length === 1) return;
        (onSelect as MultipleProps['onSelect'])?.(list.filter((d) => !isSameDay(d, date)));
      } else if (!max || list.length < max) {
        (onSelect as MultipleProps['onSelect'])?.([...list, date]);
      }
    } else {
      const r = (selected as DateRange | undefined) ?? { from: null, to: null };
      let next: DateRange;
      if (!r.from || r.to) next = { from: date, to: null };
      else if (isBefore(date, r.from)) next = { from: date, to: r.from };
      else next = { from: r.from, to: date };
      (onSelect as RangeProps['onSelect'])?.(next);
    }
  };

  const defaultFocus = () => {
    const s = selected as Date | DateRange | Date[] | null | undefined;
    const candidate = s instanceof Date ? s : Array.isArray(s) ? s[0] : s?.from;
    if (candidate && isSameMonth(candidate, month)) return candidate;
    const today = new Date();
    return isSameMonth(today, month) ? today : month;
  };
  const focusDate = focused && (isSameMonth(focused, month) || (numberOfMonths === 2 && isSameMonth(focused, addMonths(month, 1)))) ? focused : defaultFocus();

  const moveFocus = (date: Date) => {
    let target = startOfDay(date);
    if (minDate && isBefore(target, minDate)) target = startOfDay(minDate);
    if (maxDate && isAfter(target, maxDate)) target = startOfDay(maxDate);
    shouldFocus.current = true;
    setFocused(target);
    const lastVisible = addMonths(month, numberOfMonths - 1);
    if (isBefore(target, month)) setMonth(target);
    else if (isAfter(target, addDays(addMonths(lastVisible, 1), -1))) setMonth(addMonths(target, -(numberOfMonths - 1)));
  };

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>('[data-focus-target="true"]')?.focus();
  });

  useEffect(() => {
    if (autoFocus) gridRef.current?.querySelector<HTMLElement>('[data-focus-target="true"]')?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const base = focusDate;
    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft': next = addDays(base, -1); break;
      case 'ArrowRight': next = addDays(base, 1); break;
      case 'ArrowUp': next = addDays(base, -7); break;
      case 'ArrowDown': next = addDays(base, 7); break;
      case 'PageUp': next = event.shiftKey ? addYears(base, -1) : addMonths(base, -1); break;
      case 'PageDown': next = event.shiftKey ? addYears(base, 1) : addMonths(base, 1); break;
      case 'Home': next = startOfWeek(base, weekStartsOn); break;
      case 'End': next = addDays(startOfWeek(base, weekStartsOn), 6); break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(base);
        return;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  };

  const weekdays = getWeekdayNames(locale, weekStartsOn, 'short');
  const weekdaysLong = getWeekdayNames(locale, weekStartsOn, 'long');
  const monthNames = getMonthNames(locale);
  const titleFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const dayLabel = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const canPrev = !minDate || isBefore(startOfMonth(minDate), month);
  const lastMonth = addMonths(month, numberOfMonths - 1);
  const canNext = !maxDate || isBefore(lastMonth, startOfMonth(maxDate));

  const yearStart = fromYear ?? minDate?.getFullYear() ?? new Date().getFullYear() - 100;
  const yearEnd = toYear ?? maxDate?.getFullYear() ?? new Date().getFullYear() + 10;

  const navButton = cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'size-7');

  return (
    <div ref={gridRef} data-slot="calendar" className={cn('w-fit p-3 select-none', className)} {...rest}>
      <div className={cn('flex gap-4', numberOfMonths === 2 && 'flex-col sm:flex-row')}>
        {Array.from({ length: numberOfMonths }, (_, mi) => {
          const current = addMonths(month, mi);
          const days = getCalendarDays(current, weekStartsOn);
          const captionId = `${id}-caption-${mi}`;
          return (
            <div key={mi} className="flex flex-col gap-3">
              <div className="relative flex h-7 items-center justify-center">
                {mi === 0 && (
                  <button type="button" aria-label="Önceki ay" disabled={!canPrev} onClick={() => setMonth(addMonths(month, -1))} className={cn(navButton, 'absolute left-0')}>
                    <ChevronLeftIcon />
                  </button>
                )}
                {captionLayout === 'dropdown' && mi === 0 ? (
                  <div className="flex items-center gap-1" id={captionId}>
                    <select
                      aria-label="Ay"
                      value={current.getMonth()}
                      onChange={(e) => setMonth(new Date(current.getFullYear(), Number(e.target.value), 1))}
                      className="h-7 rounded-md border bg-background px-1.5 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                    >
                      {monthNames.map((name, i) => (
                        <option key={i} value={i}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Yıl"
                      value={current.getFullYear()}
                      onChange={(e) => setMonth(new Date(Number(e.target.value), current.getMonth(), 1))}
                      className="h-7 rounded-md border bg-background px-1.5 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                    >
                      {Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearEnd - i).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div id={captionId} aria-live="polite" className="text-sm font-medium first-letter:uppercase">
                    {titleFormat.format(current)}
                  </div>
                )}
                {mi === numberOfMonths - 1 && (
                  <button type="button" aria-label="Sonraki ay" disabled={!canNext} onClick={() => setMonth(addMonths(month, 1))} className={cn(navButton, 'absolute right-0')}>
                    <ChevronRightIcon />
                  </button>
                )}
              </div>

              <div role="grid" aria-labelledby={captionId} onKeyDown={onKeyDown} onPointerLeave={() => setHovered(null)}>
                <div role="row" className="flex">
                  {weekdays.map((d, i) => (
                    <div key={i} role="columnheader" aria-label={weekdaysLong[i]} className="w-9 text-center text-[0.75rem] font-normal text-muted-foreground">
                      {d}
                    </div>
                  ))}
                </div>
                {Array.from({ length: 6 }, (_, w) => (
                  <div key={w} role="row" className="mt-1 flex">
                    {days.slice(w * 7, w * 7 + 7).map((date) => {
                      const outside = !isSameMonth(date, current);
                      if (outside && (!showOutsideDays || numberOfMonths > 1)) {
                        return <div key={date.toISOString()} role="gridcell" className="size-9" />;
                      }
                      const dis = isDisabled(date);
                      const sel = isSelected(date);
                      const range = rangeInfo(date);
                      const isFocusTarget = !outside && isSameDay(date, focusDate);
                      return (
                        <div
                          key={date.toISOString()}
                          role="gridcell"
                          aria-selected={sel || range.middle || undefined}
                          className={cn(
                            'relative size-9 p-0 text-center text-sm',
                            range.middle && 'bg-accent',
                            range.start && range.end === false && (selected as DateRange)?.to && 'rounded-l-md bg-accent',
                            range.start && hovered && range.preview && 'rounded-l-md bg-accent',
                            range.end && 'rounded-r-md bg-accent',
                            range.middle && date.getDay() === weekStartsOn && 'rounded-l-md',
                            range.middle && date.getDay() === (weekStartsOn + 6) % 7 && 'rounded-r-md',
                          )}
                        >
                          <button
                            type="button"
                            tabIndex={isFocusTarget ? 0 : -1}
                            data-focus-target={isFocusTarget || undefined}
                            disabled={dis}
                            aria-label={dayLabel.format(date)}
                            aria-current={isToday(date) ? 'date' : undefined}
                            aria-pressed={sel}
                            data-selected={sel || undefined}
                            data-outside={outside || undefined}
                            onClick={() => {
                              setFocused(date);
                              select(date);
                            }}
                            onPointerEnter={() => mode === 'range' && setHovered(date)}
                            onFocus={() => setFocused(date)}
                            className={cn(
                              'inline-flex size-9 items-center justify-center rounded-md text-sm font-normal tabular-nums outline-none',
                              'transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring',
                              isToday(date) && !sel && 'font-semibold text-primary',
                              outside && 'text-muted-foreground/60',
                              sel && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                              range.middle && 'rounded-none hover:bg-accent',
                              dis && 'pointer-events-none text-muted-foreground/40 line-through',
                            )}
                          >
                            {date.getDate()}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
