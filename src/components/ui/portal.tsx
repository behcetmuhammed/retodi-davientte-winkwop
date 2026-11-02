import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useMounted } from '../../hooks/use-mounted';

type PortalProps = {
  children: ReactNode;
  /** Varsayılan: `document.body` */
  container?: HTMLElement | null;
};

/**
 * İçeriği DOM ağacının dışına (varsayılan olarak `body` sonuna) taşır.
 * Sunucuda ve hydration sırasında hiçbir şey çizmez, böylece SSR uyumludur.
 *
 * @example <Portal><div className="fixed inset-0" /></Portal>
 */
export function Portal({ children, container }: PortalProps) {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}
