import { useCallback, useRef, type KeyboardEvent, type RefObject } from 'react';

export const ITEM_SELECTOR = '[data-dv-item]:not([data-disabled])';

type Options = {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Sondan başa döner. Varsayılan: true */
  loop?: boolean;
  /** Harf yazınca eşleşen öğeye atlar. Varsayılan: true */
  typeahead?: boolean;
  selector?: string;
};

export function getItems(container: HTMLElement | null, selector = ITEM_SELECTOR): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

function textOf(el: HTMLElement) {
  return (el.dataset.textValue ?? el.textContent ?? '').trim().toLocaleLowerCase('tr');
}

/**
 * Bir listede gerçek odak hareketi (roving focus): ok tuşları, Home/End ve
 * typeahead. Öğeler `data-dv-item` ile işaretlenir; pasifler `data-disabled`.
 *
 * @example
 * const onKeyDown = useRovingFocus(listRef);
 * <div ref={listRef} role="menu" onKeyDown={onKeyDown}>...</div>
 */
export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  { orientation = 'vertical', loop = true, typeahead = true, selector = ITEM_SELECTOR }: Options = {},
) {
  const search = useRef({ value: '', timer: 0 });

  return useCallback(
    (event: KeyboardEvent) => {
      const items = getItems(containerRef.current, selector);
      if (items.length === 0) return;
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = (delta: number) => {
        if (index === -1) return delta > 0 ? 0 : items.length - 1;
        const target = index + delta;
        if (loop) return (target + items.length) % items.length;
        return Math.max(0, Math.min(items.length - 1, target));
      };

      const prevKeys = orientation === 'horizontal' ? ['ArrowLeft'] : orientation === 'vertical' ? ['ArrowUp'] : ['ArrowUp', 'ArrowLeft'];
      const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] : orientation === 'vertical' ? ['ArrowDown'] : ['ArrowDown', 'ArrowRight'];

      let target: number | null = null;
      if (nextKeys.includes(event.key)) target = next(1);
      else if (prevKeys.includes(event.key)) target = next(-1);
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = items.length - 1;
      else if (typeahead && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
        const state = search.current;
        window.clearTimeout(state.timer);
        state.value += event.key.toLocaleLowerCase('tr');
        state.timer = window.setTimeout(() => (state.value = ''), 600);
        const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
        const repeated = state.value.split('').every((ch) => ch === state.value[0]);
        const query = repeated ? state.value[0] : state.value;
        const match = ordered.find((el) => textOf(el).startsWith(query));
        if (match) target = items.indexOf(match);
      }

      if (target !== null) {
        event.preventDefault();
        items[target]?.focus();
      }
    },
    [containerRef, orientation, loop, typeahead, selector],
  );
}

/** Listede seçili ya da ilk öğeye odaklanır. */
export function focusFirst(container: HTMLElement | null, preferSelector?: string) {
  if (!container) return;
  const preferred = preferSelector ? container.querySelector<HTMLElement>(`${preferSelector}:not([data-disabled])`) : null;
  (preferred ?? getItems(container)[0] ?? container).focus({ preventScroll: false });
}
