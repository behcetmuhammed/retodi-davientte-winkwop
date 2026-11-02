import fs from 'node:fs';

const FIELDS = [
  { id: 'facebookIconMobile', label: 'Facebook ikonu (mobil)', type: 'image', default: '' },
  { id: 'instagramIconMobile', label: 'Instagram ikonu (mobil)', type: 'image', default: '' },
  { id: 'whatsappIconMobile', label: 'WhatsApp ikonu (mobil)', type: 'image', default: '' },
  { id: 'linkedinIconMobile', label: 'LinkedIn ikonu (mobil)', type: 'image', default: '' },
  { id: 'xIconMobile', label: 'X ikonu (mobil)', type: 'image', default: '' },
  { id: 'youtubeIconMobile', label: 'YouTube ikonu (mobil)', type: 'image', default: '' },
  { id: 'tiktokIconMobile', label: 'TikTok ikonu (mobil)', type: 'image', default: '' },
  { id: 'pinterestIconMobile', label: 'Pinterest ikonu (mobil)', type: 'image', default: '' },
];

const PROP_LINES = FIELDS.map(
  (f) => `  /** ${f.label} */\n  ${f.id}: string;`,
).join('\n');

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const header = manifest.sections.find((s) => s.type === 'Header');
if (!header) throw new Error('Header section not found');

if (!header.settings.some((s) => s.id === 'facebookIconMobile')) {
  const idx = header.settings.findIndex((s) => s.id === 'openSocialLinksInNewTab');
  const at = idx === -1 ? header.settings.length : idx + 1;
  header.settings.splice(at, 0, ...FIELDS);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
if (!types.includes('facebookIconMobile:')) {
  types = types.replace(
    /  \/\*\* Sosyal Medya Bağlantılarını Yeni Sekmede Aç \*\/\n  openSocialLinksInNewTab: boolean;\n/,
    `  /** Sosyal Medya Bağlantılarını Yeni Sekmede Aç */\n  openSocialLinksInNewTab: boolean;\n${PROP_LINES}\n`,
  );
}
fs.writeFileSync('src/generated/types.ts', types);

console.log('Header mobile social icon fields patched');
