import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureWinkwop, winkwop } from 'winkwop-theme-sdk';
import { sections } from './generated/registry';
import manifest from './generated/manifest.json';
import projectConfig from '../winkwop.config.json';
import defaultTheme from '../default-theme.json';
import { applyWinkwopThemeSettings, type WinkwopThemeSettings } from './lib/winkwop-theme-settings';
import './styles.css';

/**
 * Local preview.
 *
 * This mirrors what the storefront does at render time: data props are *resolved*
 * before your component sees them. A product-list prop reaches you as a list with
 * paging, never as the merchant's configuration - exactly as in production.
 */

type SettingDef = { id: string; type: string; default?: any };
type SectionSchema = {
  type: string;
  name: string;
  description?: string;
  settings: SettingDef[];
};

const DATA_PROP_TYPES = ['product-list', 'product', 'category'];

const config = projectConfig as { apiUrl?: string; devStore?: string };
const devStore = config.devStore?.trim();

if (devStore) {
  configureWinkwop({
    apiBase: config.apiUrl ?? 'https://api.winkwop.com/api/v1',
    storeDomain: devStore,
  });
}

/** The page context a section receives. Local preview always plays the home page. */
const pageContext = { pageKey: 'home' as const, product: null, category: null };

/* ------------------------------------------------------------- prop resolution */

function listQuery(value: any) {
  return {
    sort: value?.sort ?? 'newest',
    limit: value?.limit ?? 12,
    ...(value?.mode === 'category' && value.categoryId ? { category: value.categoryId } : {}),
  };
}

/** Turns a product-list configuration into the object a section expects. */
function useResolvedProductList(value: any) {
  const [state, setState] = React.useState({
    data: [] as any[],
    total: 0,
    page: 1,
    limit: value?.limit ?? 12,
    hasNext: false,
    loading: true,
  });

  const key = JSON.stringify(value ?? {});

  React.useEffect(() => {
    if (!devStore) return setState((s) => ({ ...s, loading: false }));
    let cancelled = false;

    (async () => {
      try {
        if (value?.mode === 'static') {
          const data = await winkwop.products.list({ ids: value.ids ?? [] });
          if (!cancelled) setState({ data, total: data.length, page: 1, limit: data.length, hasNext: false, loading: false });
          return;
        }
        // `context` has no subject locally, so it behaves like the default feed.
        const result = await winkwop.products.page(listQuery(value));
        if (!cancelled) {
          setState({
            data: result.products,
            total: result.total,
            page: result.page,
            limit: result.limit,
            hasNext: result.has_next,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    })();

    return () => { cancelled = true; };
  }, [key]);

  const loadMore = React.useCallback(async () => {
    if (!devStore || state.loading || !state.hasNext) return;
    setState((s) => ({ ...s, loading: true }));
    const next = await winkwop.products.page({ ...listQuery(value), page: state.page + 1 });
    setState((s) => ({
      ...s,
      data: [...s.data, ...next.products],
      page: next.page,
      hasNext: next.has_next,
      loading: false,
    }));
  }, [key, state.loading, state.hasNext, state.page]);

  return { ...state, loadMore };
}

function useResolvedSingle(type: 'product' | 'category', value: any) {
  const [item, setItem] = React.useState<any>(null);
  const key = `${type}:${JSON.stringify(value ?? {})}`;

  React.useEffect(() => {
    if (!devStore) return;
    let cancelled = false;

    (async () => {
      try {
        const id = type === 'product' ? value?.productId : value?.categoryId;
        if (value?.mode === 'static' && id) {
          const found = type === 'product'
            ? await winkwop.products.get(id)
            : await winkwop.categories.get(id);
          if (!cancelled) setItem(found);
          return;
        }
        // `context` locally: show the first available one so you have something real.
        const list = type === 'product'
          ? await winkwop.products.list({ limit: 1 })
          : await winkwop.categories.list();
        if (!cancelled) setItem(list[0] ?? null);
      } catch {
        if (!cancelled) setItem(null);
      }
    })();

    return () => { cancelled = true; };
  }, [key]);

  return item;
}

/* -------------------------------------------------------------------- rendering */

function SectionFrame({ schema }: { schema: SectionSchema }) {
  const Component = sections[schema.type];
  const settings = schema.settings ?? [];

  // Hooks cannot run in a loop, so the preview resolves the first data prop of each
  // kind - enough for any real section, and it never breaks the rules of hooks.
  const listDef = settings.find((s) => s.type === 'product-list');
  const productDef = settings.find((s) => s.type === 'product');
  const categoryDef = settings.find((s) => s.type === 'category');

  const list = useResolvedProductList(listDef?.default);
  const product = useResolvedSingle('product', productDef?.default);
  const category = useResolvedSingle('category', categoryDef?.default);

  const props: Record<string, unknown> = {};
  for (const setting of settings) {
    if (!DATA_PROP_TYPES.includes(setting.type)) {
      props[setting.id] = setting.default;
    } else if (setting.id === listDef?.id) {
      props[setting.id] = list;
    } else if (setting.id === productDef?.id) {
      props[setting.id] = product;
    } else if (setting.id === categoryDef?.id) {
      props[setting.id] = category;
    } else {
      props[setting.id] = setting.type === 'product-list'
        ? { data: [], total: 0, page: 1, limit: 0, hasNext: false, loading: false, loadMore: async () => {} }
        : null;
    }
  }

  return (
    <div className="wk-dev-frame">
      <div className="wk-dev-label">
        <strong>{schema.name}</strong>
        <code>{schema.type}</code>
        {listDef && <span className="wk-dev-tag">{list.loading ? 'yükleniyor…' : `${list.data.length} gerçek ürün`}</span>}
      </div>
      <div className="wk-dev-body">
        {Component ? (
          <ErrorBoundary sectionType={schema.type}>
            <Component {...props} page={pageContext} />
          </ErrorBoundary>
        ) : (
          <p className="wk-dev-missing">
            <code>src/sections/{schema.type}.tsx</code> bulunamadı. `npx create-winkwop-theme pull` çalıştırın.
          </p>
        )}
      </div>
    </div>
  );
}

/** One broken section should not blank the whole preview. */
class ErrorBoundary extends React.Component<
  { sectionType: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="wk-dev-missing">
        <strong>{this.props.sectionType} çizilirken hata:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>{this.state.error.message}</pre>
      </div>
    );
  }
}

/**
 * `winkwop.config.json` düz bir dosya; `link` allow-list'ten seçtirse de
 * `devStore` elle bir müşteri mağazasının slug'ıyla değiştirilebilir. O halde
 * buradaki sepet/sipariş/kayıt denemeleri gerçek veri oluşturur - `link`
 * bunu görünce uyarıyor ama dosyayı elle düzenleyen o uyarıyı hiç görmez.
 * Açılışta API'ye sorup gerçekse üstte kalıcı bir kırmızı bant gösteriyoruz.
 */
function useRealStoreWarning() {
  const [isRealStore, setIsRealStore] = React.useState(false);

  React.useEffect(() => {
    if (!devStore) return;
    const apiBase = config.apiUrl ?? 'https://api.winkwop.com/api/v1';
    let cancelled = false;

    fetch(`${apiBase}/public/store`, { headers: { 'x-store-domain': devStore } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && data.is_development === false) setIsRealStore(true);
      })
      // Bağlantı sorununda sessiz kal: bugüne kadar bu kontrol hiç yoktu,
      // ağ hatasında alarm basmak sahte pozitiften başka bir şey üretmez.
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  return isRealStore;
}

function App() {
  const schemas: SectionSchema[] = (manifest as any)?.sections ?? [];
  const isRealStore = useRealStoreWarning();

  React.useEffect(() => {
    applyWinkwopThemeSettings(defaultTheme.settings as WinkwopThemeSettings);
  }, []);

  return (
    <div className="wk-dev">
      {isRealStore && (
        <div className="wk-dev-real-store">
          ⚠ GERÇEK MÜŞTERİ MAĞAZASI — <code>{devStore}</code> bir demo değil; buradaki sepete
          ekleme, sipariş ve kayıt denemeleri gerçek veri oluşturur. Geliştirme için partner
          panelinden bir "Geliştirme Mağazası" açıp <code>link</code> ile ona bağlanın.
        </div>
      )}
      <header className="wk-dev-header">
        <span className={`wk-dev-dot ${devStore ? '' : 'wk-dev-dot--off'}`} />
        <strong>WINKWOP TEMA ÖNİZLEME</strong>
        <span className="wk-dev-store">{devStore ? `mağaza: ${devStore}` : 'mağaza bağlı değil'}</span>
        <span className="wk-dev-count">{schemas.length} bölüm</span>
      </header>

      {!devStore && (
        <div className="wk-dev-warning">
          <strong>Gerçek veri için bir geliştirme mağazası bağlayın.</strong>
          <p>
            <code>npx create-winkwop-theme link &lt;magaza-slug&gt;</code> çalıştırın. Bağlanana kadar
            ürün ve sepet çağrıları boş döner.
          </p>
        </div>
      )}

      {schemas.length === 0 ? (
        <div className="wk-dev-empty">
          <h2>Henüz bölüm tanımlamamışsınız</h2>
          <p>
            Partner panelindeki geliştirme editöründen bölümlerinizi ve prop'larınızı tanımlayın,
            sonra <code>npx create-winkwop-theme pull</code> çalıştırın.
          </p>
        </div>
      ) : (
        schemas.map((schema) => <SectionFrame key={schema.type} schema={schema} />)
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
