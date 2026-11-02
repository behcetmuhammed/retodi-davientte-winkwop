/**
 * Boyutu sürüklenerek (veya ok tuşlarıyla) değiştirilebilen paneller.
 * Boyutlar yüzde cinsindendir.
 *
 * @example
 * <ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border">
 *   <ResizablePanel defaultSize={30} minSize={20}>Menü</ResizablePanel>
 *   <ResizableHandle withHandle />
 *   <ResizablePanel>İçerik</ResizablePanel>
 * </ResizablePanelGroup>
 */
import {
  createContext,
  use,
  useCallback,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { clamp, cn } from '../../lib/utils';
import { GripVerticalIcon } from '../icons';

type PanelConfig = { defaultSize?: number; minSize: number; maxSize: number };

type GroupContextValue = {
  direction: 'horizontal' | 'vertical';
  sizes: Record<string, number>;
  register: (id: string, config: PanelConfig) => () => void;
  config: (id: string) => PanelConfig | undefined;
  resize: (prevId: string, nextId: string, prevSize: number) => void;
};

const GroupContext = createContext<GroupContextValue | null>(null);

function useGroup() {
  const ctx = use(GroupContext);
  if (!ctx) throw new Error('Resizable bileşenleri <ResizablePanelGroup> içinde kullanılmalı.');
  return ctx;
}

type GroupProps = ComponentProps<'div'> & {
  direction?: 'horizontal' | 'vertical';
  /** Boyutlar değiştikçe panellerin (DOM sırasıyla) yüzdeleri. */
  onLayout?: (sizes: number[]) => void;
};

export function ResizablePanelGroup({ direction = 'horizontal', onLayout, className, ...props }: GroupProps) {
  const configs = useRef(new Map<string, PanelConfig>());
  const groupRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [version, setVersion] = useState(0);

  const register = useCallback((id: string, config: PanelConfig) => {
    configs.current.set(id, config);
    setVersion((v) => v + 1);
    return () => {
      configs.current.delete(id);
      setSizes((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setVersion((v) => v + 1);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const ids = [...configs.current.keys()];
    const missing = ids.filter((id) => sizes[id] === undefined);
    if (missing.length === 0) return;
    const next: Record<string, number> = {};
    let used = 0;
    for (const id of ids) {
      const size = sizes[id] ?? configs.current.get(id)?.defaultSize;
      if (size !== undefined) {
        next[id] = size;
        used += size;
      }
    }
    const rest = ids.filter((id) => next[id] === undefined);
    for (const id of rest) next[id] = Math.max(0, (100 - used) / rest.length);
    setSizes(next);
  }, [version]);

  const onLayoutRef = useRef(onLayout);
  onLayoutRef.current = onLayout;

  const resize = useCallback((prevId: string, nextId: string, prevSize: number) => {
    setSizes((prev) => {
      const a = configs.current.get(prevId);
      const b = configs.current.get(nextId);
      if (!a || !b) return prev;
      const total = prev[prevId] + prev[nextId];
      let first = clamp(prevSize, a.minSize, a.maxSize);
      let second = total - first;
      second = clamp(second, b.minSize, b.maxSize);
      first = total - second;
      if (first === prev[prevId]) return prev;
      const next = { ...prev, [prevId]: first, [nextId]: second };
      const el = groupRef.current;
      if (el && onLayoutRef.current) {
        const order = Array.from(el.querySelectorAll<HTMLElement>(':scope > [data-panel-id]')).map((p) => next[p.dataset.panelId!]);
        queueMicrotask(() => onLayoutRef.current?.(order));
      }
      return next;
    });
  }, []);

  return (
    <GroupContext value={{ direction, sizes, register, config: (id) => configs.current.get(id), resize }}>
      <div
        ref={groupRef}
        data-slot="resizable-panel-group"
        data-direction={direction}
        className={cn('flex size-full', direction === 'vertical' && 'flex-col', className)}
        {...props}
      />
    </GroupContext>
  );
}

type PanelProps = ComponentProps<'div'> & { defaultSize?: number; minSize?: number; maxSize?: number };

export function ResizablePanel({ defaultSize, minSize = 0, maxSize = 100, className, style, ...props }: PanelProps) {
  const group = useGroup();
  const id = useId();

  useIsomorphicLayoutEffect(() => group.register(id, { defaultSize, minSize, maxSize }), [id, defaultSize, minSize, maxSize, group.register]);

  const size = group.sizes[id] ?? defaultSize ?? 50;
  return (
    <div
      data-slot="resizable-panel"
      data-panel-id={id}
      className={cn('min-h-0 min-w-0 overflow-auto', className)}
      style={{ flex: `${size} 1 0px`, ...style }}
      {...props}
    />
  );
}

type HandleProps = ComponentProps<'div'> & { withHandle?: boolean; disabled?: boolean };

export function ResizableHandle({ withHandle, disabled, className, ...props }: HandleProps) {
  const group = useGroup();
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ prevId: string; nextId: string; start: number; startSize: number; groupSize: number } | null>(null);
  const [neighbors, setNeighbors] = useState<{ prev?: string; next?: string }>({});
  const ref = useRef<HTMLDivElement>(null);

  const findNeighbors = () => {
    const el = ref.current;
    let prev = el?.previousElementSibling as HTMLElement | null;
    while (prev && !prev.dataset.panelId) prev = prev.previousElementSibling as HTMLElement | null;
    let next = el?.nextElementSibling as HTMLElement | null;
    while (next && !next.dataset.panelId) next = next.nextElementSibling as HTMLElement | null;
    return { prev: prev?.dataset.panelId, next: next?.dataset.panelId };
  };

  useIsomorphicLayoutEffect(() => {
    const found = findNeighbors();
    if (found.prev !== neighbors.prev || found.next !== neighbors.next) setNeighbors(found);
  });

  const horizontal = group.direction === 'horizontal';

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    const { prev, next } = findNeighbors();
    const groupEl = ref.current?.parentElement;
    if (!prev || !next || !groupEl) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = groupEl.getBoundingClientRect();
    drag.current = {
      prevId: prev,
      nextId: next,
      start: horizontal ? event.clientX : event.clientY,
      startSize: group.sizes[prev] ?? 50,
      groupSize: horizontal ? rect.width : rect.height,
    };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.groupSize === 0) return;
    const delta = ((horizontal ? event.clientX : event.clientY) - d.start) / d.groupSize;
    group.resize(d.prevId, d.nextId, d.startSize + delta * 100);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { prev, next } = neighbors;
    if (disabled || !prev || !next) return;
    const current = group.sizes[prev] ?? 50;
    const step = event.shiftKey ? 10 : 5;
    const dec = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const inc = horizontal ? 'ArrowRight' : 'ArrowDown';
    let target: number | null = null;
    if (event.key === dec) target = current - step;
    else if (event.key === inc) target = current + step;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = 100;
    if (target === null) return;
    event.preventDefault();
    group.resize(prev, next, target);
  };

  const prevConfig = neighbors.prev ? group.config(neighbors.prev) : undefined;

  return (
    <div
      ref={ref}
      role="separator"
      tabIndex={disabled ? -1 : 0}
      aria-orientation={horizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={neighbors.prev ? Math.round(group.sizes[neighbors.prev] ?? 0) : undefined}
      aria-valuemin={prevConfig?.minSize ?? 0}
      aria-valuemax={prevConfig?.maxSize ?? 100}
      aria-label="Panel boyutunu değiştir"
      aria-disabled={disabled || undefined}
      data-slot="resizable-handle"
      data-dragging={dragging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        'relative flex shrink-0 touch-none items-center justify-center bg-border outline-none select-none',
        'after:absolute focus-visible:ring-[3px] focus-visible:ring-ring data-dragging:bg-ring',
        horizontal ? 'w-px cursor-col-resize after:inset-y-0 after:-inset-x-1.5' : 'h-px cursor-row-resize after:inset-x-0 after:-inset-y-1.5',
        disabled && 'pointer-events-none',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <span className={cn('z-10 flex items-center justify-center rounded-xs border bg-border', horizontal ? 'h-4 w-3' : 'h-3 w-4 rotate-90')}>
          <GripVerticalIcon className="size-2.5" />
        </span>
      )}
    </div>
  );
}
