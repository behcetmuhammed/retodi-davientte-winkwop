import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build, type Plugin, type ViteDevServer } from 'vite';
import {
  winkwopThemeSettingsToCssVariables,
  type WinkwopThemeSettings,
} from './src/lib/winkwop-theme-settings';

/**
 * Yerel editör köprüsü.
 *
 * `npm run dev` açıkken partner panelindeki "Yerel editör" bu sunucuya bağlanır:
 * bölüm tanımlarını (`src/generated/manifest.json`) ve varsayılan düzeni
 * (`default-theme.json`) buradan okur, kaydettiğinizde düzeni bu dosyaya yazar.
 *
 * Önizleme gerçek vitrindir. Vitrin tema kodunu yayındaki sürümden değil,
 * buradaki `/__winkwop/theme.js` adresinden yükler. Paket, platformun `push`
 * sonrasında derlediği biçimde: React ve SDK vitrinin kendisinden gelir (bkz.
 * vitrin `lib/theme-compiler.ts`). Kod değişince yeniden derlenir ve editör
 * önizlemeyi yeniler.
 *
 * `push` yalnızca `src/` klasörünü yüklediği için bu dosya platforma gitmez.
 */

const PREFIX = '/__winkwop/';
const LAYOUT_FILE = 'default-theme.json';
const MANIFEST_FILE = 'src/generated/manifest.json';
const ENTRY = 'src/generated/registry.ts';
const MAX_BODY = 20 * 1024 * 1024;

/**
 * Düzeni okuyup yazabilecek sayfalar. Başka bir panel adresi için
 * `winkwop.config.json` dosyasına `"editorOrigins": ["https://..."]` ekleyin;
 * `http://localhost` her zaman kabul edilir.
 *
 * Kontrol şart: bu sunucu bilgisayarınızda açıkken ziyaret ettiğiniz herhangi
 * bir site de `localhost:3333`e istek atabilir. Adres kontrolü olmasa
 * düzen dosyanızı o site de değiştirebilirdi.
 */
const DEFAULT_EDITOR_ORIGINS = ['https://admin.winkwop.com'];
/** Tema kodunu (`theme.js`) yükleyen yerel önizleme bu adreste açılıyor. */
const STOREFRONT_ORIGINS = ['https://winkwop.com'];
/** Vite'ın kendi varsayılanı: yalnızca bilgisayarın kendisi. */
const LOCALHOST_ORIGIN = /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;

type ProjectConfig = {
  themeId?: string;
  themeName?: string;
  devStore?: string;
  editorOrigins?: string[];
};

type BuildState = { id: string; code: string | null; error: string | null };

export function winkwopDev(): Plugin {
  return {
    name: 'winkwop-local-editor',
    // Derlemede (`vite build`) ve köprünün kendi paket derlemesinde devre dışı.
    apply: 'serve',
    /*
     * Vite kendi CORS katmanını eklentilerden **önce** kuruyor ve tarayıcının
     * ön kontrol (OPTIONS) isteklerini orada yanıtlıyor. Varsayılan izin
     * listesi yalnızca localhost olduğu için panelin kaydetme isteği (PUT)
     * köprüye hiç ulaşmıyor, "No 'Access-Control-Allow-Origin' header"
     * hatasıyla düşüyordu; ön kontrol gerektirmeyen okumalar çalışıyordu.
     * Listeye panel ve vitrin ekleniyor. Bu yalnızca tarayıcının isteği
     * göndermesine izin veriyor: kimin okuyup yazabileceğine yine köprü
     * karar veriyor (vitrin yalnızca `theme.js`i alabiliyor).
     */
    async config(config) {
      if (config.server?.cors !== undefined) return;
      const project = await readJson<ProjectConfig>(path.resolve(config.root ?? ''), 'winkwop.config.json');
      return {
        server: {
          cors: {
            origin: [LOCALHOST_ORIGIN, ...DEFAULT_EDITOR_ORIGINS, ...STOREFRONT_ORIGINS, ...(project?.editorOrigins ?? [])],
          },
        },
      };
    },
    configureServer(server) {
      setupBridge(server);
    },
  };
}

function setupBridge(server: ViteDevServer) {
  const root = server.config.root;
  const configFile = server.config.configFile;
  const logger = server.config.logger;
  const clients = new Set<ServerResponse>();

  let state: BuildState = { id: '', code: null, error: null };
  let dirty = true;
  let running: Promise<void> | null = null;
  let manifestChanged = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  /** Editörün son yazdığı düzen: kendi kaydımızı "dosya dışarıdan değişti" sanmayalım. */
  let lastWritten: string | null = null;

  const broadcast = (event: Record<string, unknown>) => {
    const line = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of clients) client.write(line);
  };

  const publicState = () => ({ id: state.id, error: state.error });

  /** Paketi güncel hâle getirir; derleme sürüyorsa onu bekler, arada değişiklik olduysa yeniden derler. */
  const ensureBuilt = async (): Promise<void> => {
    while (dirty || running) {
      if (!running) {
        dirty = false;
        running = bundle(root, configFile)
          .then(
            (code) => {
              state = { id: hash(code).slice(0, 12), code, error: null };
            },
            (error) => {
              state = { id: `error-${Date.now().toString(36)}`, code: null, error: describe(error, root) };
              logger.error(`\n[winkwop] Tema paketi derlenemedi:\n${state.error}\n`);
            },
          )
          .finally(() => {
            running = null;
          });
      }
      await running;
    }
  };

  const onFileEvent = async (file: string) => {
    const relative = path.relative(root, file).split(path.sep).join('/');

    if (relative === LAYOUT_FILE) {
      const content = await fs.readFile(file, 'utf8').catch(() => null);
      if (content !== null && content !== lastWritten) broadcast({ type: 'layout' });
      return;
    }
    if (!relative.startsWith('src/')) return;

    dirty = true;
    if (relative === MANIFEST_FILE) manifestChanged = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      await ensureBuilt();
      broadcast({ type: manifestChanged ? 'manifest' : 'bundle', build: publicState() });
      manifestChanged = false;
    }, 150);
  };

  server.watcher.on('change', onFileEvent);
  server.watcher.on('add', onFileEvent);
  server.watcher.on('unlink', onFileEvent);

  // İlk açılışta editör beklemesin diye paket hemen derleniyor.
  void ensureBuilt();
  server.httpServer?.once('listening', () => {
    setTimeout(() => {
      logger.info('\n  Yerel editör: partner panelinde temanızın kartından "Yerel editör"ü açın.\n');
    }, 50);
  });

  // Bağlantı ara sunucularda kesilmesin diye boş satır.
  const keepAlive = setInterval(() => {
    for (const client of clients) client.write(': ping\n\n');
  }, 25_000);
  server.httpServer?.once('close', () => clearInterval(keepAlive));

  server.middlewares.use(async (req, res, next) => {
    const url = req.url ?? '';
    if (!url.startsWith(PREFIX)) return next();

    const route = url.slice(PREFIX.length).split('?')[0];
    const project = await readJson<ProjectConfig>(root, 'winkwop.config.json');
    const origin = typeof req.headers.origin === 'string' ? req.headers.origin : null;
    const fromEditor = origin !== null && isEditorOrigin(origin, project?.editorOrigins);
    // Tarayıcı başka sitelerden gelen isteklere her zaman `Origin` ekler; başlıksız
    // istek terminalden ya da adres çubuğundan geliyordur.
    const readable = origin === null || fromEditor;

    // Tema kodu herkese açık bir paket; vitrin hangi alan adından açılmışsa oradan yüklenebilmeli.
    const allowOrigin = route === 'theme.js' ? '*' : fromEditor ? origin : null;
    if (allowOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowOrigin);
      res.setHeader('Vary', 'Origin');
    }
    // Chrome, internetteki bir sayfadan bilgisayarınıza giden isteklerde bu izni arıyor.
    res.setHeader('Access-Control-Allow-Private-Network', 'true');

    // Ön kontrolü normalde Vite yanıtlıyor (bkz. `config`); bu dal yalnızca
    // projede `server.cors: false` ise çalışıyor.
    if (req.method === 'OPTIONS') {
      if (!allowOrigin) return sendJson(res, 403, { error: 'Bu adresin yerel editöre erişim izni yok.' });
      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '600');
      res.statusCode = 204;
      return res.end();
    }

    try {
      if (route === 'theme.js' && req.method === 'GET') {
        await ensureBuilt();
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        // Derleme hatası vitrinde okunabilsin diye paket hatayı fırlatan bir modül olarak dönüyor.
        res.end(state.code ?? `throw new Error(${JSON.stringify(`Tema derlenemedi:\n${state.error ?? ''}`)});\n`);
        return;
      }

      if (!readable) return sendJson(res, 403, { error: 'Bu adresin yerel editöre erişim izni yok.' });

      if (route === 'session' && req.method === 'GET') {
        return sendJson(res, 200, {
          theme: { id: project?.themeId ?? null, name: project?.themeName ?? null },
          devStore: project?.devStore ?? null,
          manifest: (await readJson(root, MANIFEST_FILE)) ?? { sections: [], globalSettings: [] },
          layout: await readJson(root, LAYOUT_FILE),
          build: publicState(),
        });
      }

      if (route === 'layout' && req.method === 'PUT') {
        // Yazma için başlıksız istek de kabul edilmiyor: dosyayı yalnızca editör değiştirir.
        if (!fromEditor) return sendJson(res, 403, { error: 'Düzeni yalnızca partner panelindeki editör kaydedebilir.' });
        const body = JSON.parse(await readBody(req)) as { layout?: unknown };
        const layout = body?.layout as { pages?: unknown } | undefined;
        if (!layout || typeof layout !== 'object' || !layout.pages || typeof layout.pages !== 'object') {
          return sendJson(res, 400, { error: 'Düzen geçersiz: "pages" alanı yok.' });
        }
        const content = `${JSON.stringify(layout, null, 2)}\n`;
        lastWritten = content;
        await fs.writeFile(path.join(root, LAYOUT_FILE), content, 'utf8');
        return sendJson(res, 200, { ok: true });
      }

      if (route === 'events' && req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        });
        res.write(`data: ${JSON.stringify({ type: 'hello', build: publicState() })}\n\n`);
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
      }

      if (route === '' && req.method === 'GET') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Winkwop yerel editör köprüsü çalışıyor. Partner panelinden "Yerel editör"ü açın.\n');
        return;
      }

      sendJson(res, 404, { error: 'Bilinmeyen adres.' });
    } catch (error) {
      sendJson(res, 500, { error: (error as Error).message });
    }
  });
}

/* ------------------------------------------------------------- tema paketi */

/**
 * Temayı vitrinin yüklediği biçimde derler: tek dosya, hiç `import` yok, CSS
 * paketin içinde. Projenin kendi `vite.config.ts`'i kullanılıyor; Tailwind ve
 * diğer eklentiler önizlemedekiyle aynı çalışıyor.
 */
async function bundle(root: string, configFile: string | undefined): Promise<string> {
  const result = (await build({
    root,
    configFile: configFile ?? false,
    mode: 'production',
    logLevel: 'silent',
    clearScreen: false,
    plugins: [storefrontRuntime(root)],
    build: {
      write: false,
      minify: false,
      sourcemap: false,
      emptyOutDir: false,
      copyPublicDir: false,
      reportCompressedSize: false,
      cssCodeSplit: false,
    },
  })) as unknown;

  type OutputItem =
    | { type: 'chunk'; isEntry: boolean; code: string; fileName: string }
    | { type: 'asset'; fileName: string; source: string | Uint8Array };

  const outputs = (Array.isArray(result) ? result : [result]) as { output?: OutputItem[] }[];
  const items = outputs.flatMap((output) => output.output ?? []);
  const chunks = items.filter((item): item is Extract<OutputItem, { type: 'chunk' }> => item.type === 'chunk');
  const entry = chunks.find((chunk) => chunk.isEntry);
  if (!entry) throw new Error('Derleme çıktısında tema paketi bulunamadı.');
  if (chunks.length > 1) {
    throw new Error('Tema paketi tek dosya olmalı. Bölümlerde dinamik import (`import()`, `React.lazy`) kullanmayın.');
  }

  const css = items
    .filter((item): item is Extract<OutputItem, { type: 'asset' }> => item.type === 'asset' && item.fileName.endsWith('.css'))
    .map((asset) => (typeof asset.source === 'string' ? asset.source : Buffer.from(asset.source).toString('utf8')))
    .join('\n');

  const layout = await readJson<{ settings?: WinkwopThemeSettings }>(root, LAYOUT_FILE);
  const settingsBoot = themeSettingsInjector(layout?.settings);

  return settingsBoot + (css ? cssInjector(css) : '') + entry.code;
}

/**
 * React, ReactDOM ve SDK'yı vitrinin hazırladığı örneklere bağlar.
 *
 * Vitrin aynı işi `lib/theme-compiler.ts` içinde yapıyor: iki ayrı React aynı
 * ağaçta çizilirse hook'lar çalışmaz, SDK da o an açık mağazaya göre
 * yapılandırılmış olmalı.
 */
function storefrontRuntime(root: string): Plugin {
  const require = createRequire(path.join(root, 'package.json'));
  const modules: Record<string, string> = {
    react: hostModule('__WINKWOP_REACT__', 'React', exportNames(require, 'react')),
    'react-dom': hostModule('__WINKWOP_REACT_DOM__', 'ReactDOM', exportNames(require, 'react-dom')),
    'react/jsx-runtime': JSX_RUNTIME,
    'react/jsx-dev-runtime': JSX_DEV_RUNTIME,
    'winkwop-theme-sdk': SDK_MODULE,
    '@winkwop/theme-sdk': SDK_MODULE,
  };
  const VIRTUAL = '\0winkwop-runtime:';

  return {
    name: 'winkwop-storefront-runtime',
    enforce: 'pre',
    config(config) {
      const options = (config.build ??= {});
      options.lib = {
        ...(typeof options.lib === 'object' && options.lib ? options.lib : {}),
        entry: path.join(root, ENTRY),
        formats: ['es'],
        fileName: 'theme',
      };
      // `vite.config.ts` React'ı dışarıda bırakıyor; burada paketin içine,
      // vitrinin örneğine bağlanan küçük modüller olarak giriyor.
      for (const key of ['rollupOptions', 'rolldownOptions']) {
        const bundler = (options as Record<string, { external?: unknown } | undefined>)[key];
        if (bundler) bundler.external = [];
      }
      return { define: { 'process.env.NODE_ENV': JSON.stringify('production') } };
    },
    resolveId(id) {
      return Object.hasOwn(modules, id) ? VIRTUAL + id : null;
    },
    load(id) {
      return id.startsWith(VIRTUAL) ? modules[id.slice(VIRTUAL.length)] : null;
    },
  };
}

function exportNames(require: NodeRequire, name: string): string[] {
  return Object.keys(require(name)).filter((key) => key !== 'default' && /^[A-Za-z_$][\w$]*$/.test(key));
}

const hostModule = (global: string, label: string, names: string[]) => `
const host = globalThis.${global};
if (!host) throw new Error("Winkwop tema çalışma ortamı hazır değil (${label} yok).");
export default host;
${names.length ? `export const { ${names.join(', ')} } = host;` : ''}
`;

const JSX_RUNTIME = `
const R = globalThis.__WINKWOP_REACT__;
if (!R) throw new Error("Winkwop tema çalışma ortamı hazır değil (React yok).");
function make(type, config, maybeKey, spreadStatic) {
  const { key = maybeKey, children, ...props } = config || {};
  const base = key === undefined ? props : { ...props, key };
  if (children === undefined) return R.createElement(type, base);
  if (spreadStatic && Array.isArray(children)) return R.createElement(type, base, ...children);
  return R.createElement(type, base, children);
}
export const Fragment = R.Fragment;
export const jsx = (type, config, key) => make(type, config, key, false);
export const jsxs = (type, config, key) => make(type, config, key, true);
`;

const JSX_DEV_RUNTIME = `
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
export { Fragment };
export const jsxDEV = (type, config, key, isStaticChildren) =>
  isStaticChildren ? jsxs(type, config, key) : jsx(type, config, key);
`;

const SDK_MODULE = `
const sdk = globalThis.__WINKWOP_SDK__;
if (!sdk) throw new Error("Winkwop tema çalışma ortamı hazır değil (SDK yok).");
export const winkwop = sdk;
export default { winkwop: sdk };
`;

/** Yerel editör önizlemesi: `default-theme.json` → `settings` → `--wk-*` (panel ile aynı). */
function themeSettingsInjector(settings: WinkwopThemeSettings | undefined): string {
  const vars = winkwopThemeSettingsToCssVariables(settings);
  if (Object.keys(vars).length === 0) return '';
  return (
    `(()=>{if(typeof document>"u")return;var v=${JSON.stringify(vars)};var el=document.documentElement;` +
    `for(var k in v)if(Object.prototype.hasOwnProperty.call(v,k))el.style.setProperty(k,v[k]);})();\n`
  );
}

/** Vitrin derleyicisiyle aynı: CSS paketin başında, kendini bir kez ekleyen blok. */
function cssInjector(css: string): string {
  const id = `wk-theme-css-${hash(css).slice(0, 12)}`;
  return (
    `(()=>{if(typeof document>"u")return;var i=${JSON.stringify(id)};if(document.getElementById(i))return;` +
    `var e=document.createElement("style");e.id=i;e.textContent=${JSON.stringify(css)};document.head.appendChild(e)})();\n`
  );
}

/* ---------------------------------------------------------------- yardımcılar */

function isEditorOrigin(origin: string, extra: string[] | undefined): boolean {
  if (/^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin)) return true;
  return [...DEFAULT_EDITOR_ORIGINS, ...(extra ?? [])].some((allowed) => allowed.replace(/\/+$/, '') === origin);
}

async function readJson<T = unknown>(root: string, file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(path.join(root, file), 'utf8')) as T;
  } catch {
    return null;
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('Düzen 20 MB sınırını aşıyor.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function hash(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

/** Derleme hatasını dosya ve satırıyla birlikte okunur hâle getirir. */
function describe(error: unknown, root: string): string {
  const e = error as { message?: string; id?: string; loc?: { line?: number; column?: number }; frame?: string; plugin?: string };
  const where = e.id ? `\n${path.relative(root, e.id)}${e.loc?.line ? `:${e.loc.line}:${e.loc.column ?? 0}` : ''}` : '';
  return `${e.plugin ? `[${e.plugin}] ` : ''}${e.message ?? String(error)}${where}${e.frame ? `\n${e.frame}` : ''}`;
}
