import { useEffect, type RefObject } from 'react';

const TABBABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
  ].join(',');

/** İç içe tuzaklarda yalnızca en son açılan Tab'ı yönetir. */
const traps: HTMLElement[] = [];

export function getTabbable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => !el.hasAttribute('inert') && el.getClientRects().length > 0,
  );
}

type Options = {
  /** Açılışta odaklanacak öğe; verilmezse `[data-autofocus]`, sonra ilk odaklanabilir öğe. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Kapanınca odağı tetikleyiciye geri verir. Varsayılan: true */
  restoreFocus?: boolean;
};

/**
 * Tab tuşunu verilen kapsayıcının içinde döndürür (dialog, sheet, drawer).
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  { initialFocus, restoreFocus = true }: Options = {},
): void {
  useEffect(() => {
    const container = ref.current;
    if (!enabled || !container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const frame = requestAnimationFrame(() => {
      if (container.contains(document.activeElement)) return;
      const target =
        initialFocus?.current ??
        container.querySelector<HTMLElement>('[data-autofocus]') ??
        getTabbable(container)[0] ??
        container;
      target.focus({ preventScroll: true });
    });

    traps.push(container);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || traps[traps.length - 1] !== container) return;
      const items = getTabbable(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      traps.splice(traps.indexOf(container), 1);
      if (restoreFocus && previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [enabled, ref, initialFocus, restoreFocus]);
}
