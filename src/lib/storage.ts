/**
 * Güvenli tarayıcı depolaması. Sunucuda, gizli modda veya kota dolduğunda
 * hata fırlatmaz; JSON'u otomatik çözer. Anahtarlara `davientte:` öneki eklenir.
 *
 * @example
 * storage.set('recent-searches', ['masa', 'sandalye']);
 * const list = storage.get<string[]>('recent-searches', []);
 * storage.remove('recent-searches');
 * session.set('checkout-step', 2);
 */
import { STORAGE_PREFIX } from './constants';

type Listener = (key: string) => void;
const listeners = new Set<Listener>();

function createStorage(kind: 'localStorage' | 'sessionStorage') {
  const area = (): Storage | null => {
    try {
      return typeof window === 'undefined' ? null : window[kind];
    } catch {
      return null;
    }
  };
  const full = (key: string) => STORAGE_PREFIX + key;

  return {
    get<T>(key: string, fallback: T): T {
      const raw = area()?.getItem(full(key));
      if (raw == null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    set<T>(key: string, value: T) {
      try {
        area()?.setItem(full(key), JSON.stringify(value));
        listeners.forEach((l) => l(key));
        return true;
      } catch {
        return false;
      }
    },
    remove(key: string) {
      try {
        area()?.removeItem(full(key));
        listeners.forEach((l) => l(key));
      } catch {
        /* yok say */
      }
    },
    /** Yalnızca `davientte:` önekli anahtarları siler. */
    clear() {
      const s = area();
      if (!s) return;
      for (const k of Object.keys(s)) if (k.startsWith(STORAGE_PREFIX)) s.removeItem(k);
      listeners.forEach((l) => l('*'));
    },
    /** Ham anahtar (önekli) — `storage` olayıyla karşılaştırmak için. */
    fullKey: full,
  };
}

export const storage = createStorage('localStorage');
export const session = createStorage('sessionStorage');

/** Aynı sekmedeki değişiklikleri dinler (diğer sekmeler için `storage` olayı kullanılır). */
export function onStorageChange(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
