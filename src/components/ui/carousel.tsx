/**
 * Yerel CSS scroll-snap tabanlı karusel. Dokunmatik kaydırma tarayıcıya ait
 * olduğundan akıcıdır; JS yalnızca butonları, noktaları ve otomatik oynatmayı yönetir.
 *
 * @example
 * <Carousel loop autoplay={5000}>
 *   <CarouselContent>
 *     {slides.map((s) => (
 *       <CarouselItem key={s.id} className="basis-full sm:basis-1/2 lg:basis-1/3">...</CarouselItem>
 *     ))}
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 *   <CarouselDots />
 * </Carousel>
 */
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { cn, composeEventHandlers } from '../../lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { Button } from './button';

type CarouselContextValue = {
  viewportRef: RefObject<HTMLDivElement | null>;
  orientation: 'horizontal' | 'vertical';
  index: number;
  count: number;
  canPrev: boolean;
  canNext: boolean;
  scrollTo: (index: number) => void;
  prev: () => void;
  next: () => void;
  onScroll: () => void;
  setPaused: (paused: boolean) => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const ctx = use(CarouselContext);
  if (!ctx) throw new Error('Carousel bileşenleri <Carousel> içinde kullanılmalı.');
  return ctx;
}

type CarouselProps = ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical';
  /** Sondan başa (ve tersi) döner. */
  loop?: boolean;
  /** ms cinsinden otomatik geçiş. Üzerine gelince / odaklanınca durur. */
  autoplay?: number;
  onIndexChange?: (index: number) => void;
};

function slidesOf(viewport: HTMLElement | null) {
  return viewport ? Array.from(viewport.querySelectorAll<HTMLElement>('[data-slot="carousel-item"]')) : [];
}

export function Carousel({ orientation = 'horizontal', loop = false, autoplay, onIndexChange, className, onKeyDown, children, ...props }: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [paused, setPaused] = useState(false);
  const horizontal = orientation === 'horizontal';

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const slides = slidesOf(vp);
    setCount(slides.length);
    const pos = horizontal ? vp.scrollLeft : vp.scrollTop;
    const max = horizontal ? vp.scrollWidth - vp.clientWidth : vp.scrollHeight - vp.clientHeight;
    setEdges({ start: pos <= 2, end: pos >= max - 2 });
    const vpStart = horizontal ? vp.getBoundingClientRect().left : vp.getBoundingClientRect().top;
    let nearest = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const d = Math.abs((horizontal ? rect.left : rect.top) - vpStart);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    if (pos >= max - 2 && slides.length) {
      const lastVisible = slides.findIndex((s) => {
        const r = s.getBoundingClientRect();
        return (horizontal ? r.left : r.top) >= vpStart - 2;
      });
      nearest = Math.max(nearest, lastVisible);
    }
    setIndex((prev) => {
      if (prev !== nearest) onIndexChange?.(nearest);
      return nearest;
    });
  }, [horizontal, onIndexChange]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    const mo = new MutationObserver(measure);
    mo.observe(vp, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [measure]);

  const scrollTo = useCallback(
    (target: number) => {
      const vp = viewportRef.current;
      const slides = slidesOf(vp);
      if (!vp || slides.length === 0) return;
      const i = loop ? (target + slides.length) % slides.length : Math.max(0, Math.min(slides.length - 1, target));
      const slide = slides[i];
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const offset = horizontal
        ? slide.getBoundingClientRect().left - vp.getBoundingClientRect().left + vp.scrollLeft
        : slide.getBoundingClientRect().top - vp.getBoundingClientRect().top + vp.scrollTop;
      vp.scrollTo({ [horizontal ? 'left' : 'top']: offset, behavior: reduce ? 'auto' : 'smooth' });
    },
    [horizontal, loop],
  );

  const prev = useCallback(() => {
    if (edges.start && loop) scrollTo(count - 1);
    else scrollTo(index - 1);
  }, [edges.start, loop, count, index, scrollTo]);

  const next = useCallback(() => {
    if (edges.end && loop) scrollTo(0);
    else scrollTo(index + 1);
  }, [edges.end, loop, index, scrollTo]);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(next, autoplay);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, count, next]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    if (event.key === prevKey) {
      event.preventDefault();
      prev();
    } else if (event.key === nextKey) {
      event.preventDefault();
      next();
    }
  };

  return (
    <CarouselContext
      value={{
        viewportRef,
        orientation,
        index,
        count,
        canPrev: loop ? count > 1 : !edges.start,
        canNext: loop ? count > 1 : !edges.end,
        scrollTo,
        prev,
        next,
        onScroll: measure,
        setPaused,
      }}
    >
      <div
        role="region"
        aria-roledescription="karusel"
        data-slot="carousel"
        data-orientation={orientation}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
        }}
        className={cn('relative', className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext>
  );
}

export function CarouselContent({ className, viewportClassName, ...props }: ComponentProps<'div'> & { viewportClassName?: string }) {
  const { viewportRef, orientation, onScroll, setPaused } = useCarousel();
  const frame = useRef(0);
  return (
    <div
      ref={viewportRef}
      data-slot="carousel-viewport"
      onScroll={() => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(onScroll);
      }}
      onTouchStart={() => setPaused(true)}
      className={cn(
        'overscroll-contain dv-scrollbar-none',
        orientation === 'horizontal' ? 'snap-x snap-mandatory overflow-x-auto overflow-y-hidden' : 'h-full snap-y snap-mandatory overflow-y-auto',
        viewportClassName,
      )}
    >
      <div
        data-slot="carousel-content"
        className={cn('flex gap-4', orientation === 'vertical' && 'h-full flex-col', className)}
        {...props}
      />
    </div>
  );
}

export function CarouselItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      role="group"
      aria-roledescription="slayt"
      data-slot="carousel-item"
      className={cn('min-w-0 shrink-0 grow-0 basis-full snap-start', className)}
      {...props}
    />
  );
}

export function CarouselPrevious({ className, ...props }: ComponentProps<typeof Button>) {
  const { prev, canPrev, orientation } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant="outline"
      size="icon-sm"
      aria-label="Önceki slayt"
      disabled={!canPrev}
      onClick={prev}
      className={cn(
        'absolute rounded-full bg-background',
        orientation === 'horizontal' ? 'top-1/2 left-2 -translate-y-1/2' : 'top-2 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon />
    </Button>
  );
}

export function CarouselNext({ className, ...props }: ComponentProps<typeof Button>) {
  const { next, canNext, orientation } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant="outline"
      size="icon-sm"
      aria-label="Sonraki slayt"
      disabled={!canNext}
      onClick={next}
      className={cn(
        'absolute rounded-full bg-background',
        orientation === 'horizontal' ? 'top-1/2 right-2 -translate-y-1/2' : 'bottom-2 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      {...props}
    >
      <ChevronRightIcon />
    </Button>
  );
}

export function CarouselDots({ className, ...props }: ComponentProps<'div'>) {
  const { count, index, scrollTo } = useCarousel();
  if (count < 2) return null;
  return (
    <div data-slot="carousel-dots" className={cn('mt-3 flex items-center justify-center gap-1.5', className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}. slayta git`}
          aria-current={i === index ? 'true' : undefined}
          onClick={() => scrollTo(i)}
          className={cn(
            'h-1.5 rounded-full transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
            i === index ? 'w-5 bg-foreground' : 'w-1.5 bg-foreground/25 hover:bg-foreground/40',
          )}
        />
      ))}
    </div>
  );
}
