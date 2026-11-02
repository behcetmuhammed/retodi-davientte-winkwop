import fs from 'node:fs';

const sectionContainerWidthSelect = {
  id: 'sectionContainerWidth',
  label: 'Genel genişlik',
  type: 'select',
  default: 'default',
  options: [
    { label: 'Varsayılan', value: 'default' },
    { label: 'Çok Küçük', value: 'extraSmall' },
    { label: 'Küçük', value: 'small' },
    { label: 'Orta', value: 'medium' },
    { label: 'Geniş', value: 'wide' },
    { label: 'Çok Geniş', value: 'extraWide' },
  ],
};

const settings = [
  sectionContainerWidthSelect,
  { id: 'group1Title', label: 'Bilgi 1 — başlık', type: 'text', default: '' },
  { id: 'group1Body', label: 'Bilgi 1 — metin', type: 'textarea', default: '' },
  { id: 'group2Title', label: 'Bilgi 2 — başlık', type: 'text', default: '' },
  { id: 'group2Body', label: 'Bilgi 2 — metin', type: 'textarea', default: '' },
  { id: 'group3Title', label: 'Bilgi 3 — başlık', type: 'text', default: '' },
  { id: 'group3Body', label: 'Bilgi 3 — metin', type: 'textarea', default: '' },
  { id: 'namePlaceholder', label: 'Ad alanı placeholder', type: 'text', default: 'Adınız Soyadınız' },
  { id: 'emailPlaceholder', label: 'E-posta placeholder', type: 'text', default: 'E-Posta Adresiniz' },
  { id: 'messagePlaceholder', label: 'Mesaj placeholder', type: 'text', default: 'Mesajınız...' },
  { id: 'submitButtonLabel', label: 'Gönder düğmesi', type: 'text', default: 'GÖNDER' },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const footerIdx = manifest.sections.findIndex((s) => s.type === 'Footer');
const existing = manifest.sections.findIndex((s) => s.type === 'SectionContact');
const entry = {
  type: 'SectionContact',
  name: 'İletişim bölümü',
  description: 'Adres ve telefon bilgileri ile iletişim formu.',
  settings,
};

if (existing >= 0) manifest.sections[existing] = entry;
else if (footerIdx >= 0) manifest.sections.splice(footerIdx, 0, entry);
else manifest.sections.push(entry);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const widthUnion = '"default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide"';

const propsType = `export type SectionContactProps = {
  sectionContainerWidth: ${widthUnion};
  group1Title: string;
  group1Body: string;
  group2Title: string;
  group2Body: string;
  group3Title: string;
  group3Body: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitButtonLabel: string;
  sectionBgColor: string;
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
types = types.replace(/export type SectionContactProps = \{[\s\S]*?\};\n\n?/g, '');
types = types.replace(/export type FooterProps = \{/, `${propsType}\n\nexport type FooterProps = {`);
fs.writeFileSync('src/generated/types.ts', types);

console.log('SectionContact manifest + types', settings.length);
