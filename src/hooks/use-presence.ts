import { useEffect, useState } from 'react';

/**
 * Kapanış animasyonu bitene kadar içeriği DOM'da tutar.
 *
 * `present` true olduğu sürece içerik çizilir; `open` false'a döndükten
 * `exitMs` sonra `present` da false olur. Bileşen bu arada
 * `data-state="closed"` ile çıkış animasyonunu oynatır.
 */
export function usePresence(open: boolean, exitMs = 150): boolean {
  const [present, setPresent] = useState(open);

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setPresent(false), reduce ? 0 : exitMs);
    return () => window.clearTimeout(timer);
  }, [open, exitMs]);

  return open || present;
}
