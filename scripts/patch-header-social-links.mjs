import fs from 'node:fs';

const EXTRA_FIELDS = [
  { id: 'xLink', label: 'X (Twitter) bağlantısı', type: 'url', default: '' },
  { id: 'youtubeLink', label: 'YouTube bağlantısı', type: 'url', default: '' },
  { id: 'tiktokLink', label: 'TikTok bağlantısı', type: 'url', default: '' },
  { id: 'pinterestLink', label: 'Pinterest bağlantısı', type: 'url', default: '' },
];

const PROP_LINES = `  /** X (Twitter) bağlantısı */
  xLink: string;
  /** YouTube bağlantısı */
  youtubeLink: string;
  /** TikTok bağlantısı */
  tiktokLink: string;
  /** Pinterest bağlantısı */
  pinterestLink: string;
`;

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const header = manifest.sections.find((s) => s.type === 'Header');
if (!header) throw new Error('Header section not found');

if (!header.settings.some((s) => s.id === 'xLink')) {
  const idx = header.settings.findIndex((s) => s.id === 'linkedinLink');
  const at = idx === -1 ? header.settings.length : idx + 1;
  header.settings.splice(at, 0, ...EXTRA_FIELDS);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
if (!/export type HeaderProps = \{[\s\S]*?xLink: string/.test(types)) {
  types = types.replace(
    /  \/\*\* Linkedin Bağlantısı \*\/\n  linkedinLink: string;\n/,
    `  /** Linkedin Bağlantısı */\n  linkedinLink: string;\n${PROP_LINES}`,
  );
}
fs.writeFileSync('src/generated/types.ts', types);

console.log('Header extra social links patched');
