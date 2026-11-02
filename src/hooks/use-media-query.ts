import { useCallback, useSyncExternalStore } from 'react';

/**
 * CSS medya sorgusunu izler. Sunucuda ve ilk hydration'da `serverValue`
 * (varsayılan false) döner; böylece hydration uyuşmazlığı oluşmaz.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Tailwind varsayılan kırılımları. */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;

/** `md` ve üstü için true. */
export function useBreakpoint(bp: keyof typeof BREAKPOINTS) {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}

/** `md` altı (768px) için true. */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 0.02}px)`);
}
