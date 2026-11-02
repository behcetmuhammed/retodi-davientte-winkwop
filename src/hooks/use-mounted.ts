import { useEffect, useState } from 'react';

/**
 * Bileşen tarayıcıda mount olduktan sonra `true` döner. Sunucuda ve ilk
 * hydration render'ında `false`'tur; `window`/`document` gerektiren içerik
 * bu sayede hydration uyuşmazlığı yaratmaz.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
