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

const buttonStyleSelect = {
  type: 'select',
  default: 'solid',
  options: [
    { label: 'Dolu', value: 'solid' },
    { label: 'Çerçeveli', value: 'outline' },
    { label: 'Etiket (altı çizili)', value: 'label' },
    { label: 'İkincil', value: 'secondary' },
  ],
};

const spacingSelect = {
  type: 'select',
  default: 'medium',
  options: [
    { label: 'Küçük', value: 'small' },
    { label: 'Orta', value: 'medium' },
    { label: 'Büyük', value: 'large' },
    { label: 'Çok büyük', value: 'extraLarge' },
  ],
};

const headingStyleSelect = {
  type: 'select',
  default: 'default',
  options: [
    { label: 'Varsayılan', value: 'default' },
    { label: 'Editoryal (büyük harf)', value: 'editorial' },
  ],
};

const settings = [
  sectionContainerWidthSelect,
  { id: 'image', label: 'Görsel', type: 'image', default: '' },
  { id: 'imageMobile', label: 'Görsel (mobil)', type: 'image', default: '' },
  { id: 'imageMinHeight', label: 'Görsel minimum yükseklik', type: 'range', default: 320, min: 200, max: 560, step: 10, unit: 'px' },
  { id: 'reverseLayout', label: 'Görsel sağda (ters düzen)', type: 'boolean', default: false },
  { id: 'heading', label: 'Başlık', type: 'text', default: '' },
  { id: 'description', label: 'Açıklama', type: 'textarea', default: '' },
  { id: 'headingStyle', label: 'Başlık stili', ...headingStyleSelect },
  { id: 'primaryLabel', label: 'Düğme metni', type: 'text', default: '' },
  { id: 'primaryUrl', label: 'Düğme adresi', type: 'url', default: '' },
  { id: 'primaryButtonStyle', label: 'Düğme stili', ...buttonStyleSelect },
  { id: 'openLinksInNewTab', label: 'Bağlantıları yeni sekmede aç', type: 'boolean', default: false },
  { id: 'showBottomBorder', label: 'Alt ayırıcı çizgi', type: 'boolean', default: true },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
  { id: 'headingColor', label: 'Başlık rengi', type: 'color', default: '' },
  { id: 'bodyColor', label: 'Açıklama rengi', type: 'color', default: '' },
  { id: 'spacingPreset', label: 'Dikey boşluk', ...spacingSelect },
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const footerIdx = manifest.sections.findIndex((s) => s.type === 'Footer');
const existing = manifest.sections.findIndex((s) => s.type === 'SectionImageText');
const entry = {
  type: 'SectionImageText',
  name: 'Metin içeren görsel',
  description: 'Görsel ve metin yan yana; isteğe bağlı ters düzen (görsel sağda).',
  settings,
};

if (existing >= 0) manifest.sections[existing] = entry;
else if (footerIdx >= 0) manifest.sections.splice(footerIdx, 0, entry);
else manifest.sections.push(entry);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const styleUnion = '"solid" | "outline" | "label" | "secondary"';

const widthUnion = '"default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide"';

const propsType = `export type SectionImageTextProps = {
  sectionContainerWidth: ${widthUnion};
  image: string;
  imageMobile: string;
  imageMinHeight: number;
  reverseLayout: boolean;
  heading: string;
  description: string;
  headingStyle: "default" | "editorial";
  primaryLabel: string;
  primaryUrl: string;
  primaryButtonStyle: ${styleUnion};
  openLinksInNewTab: boolean;
  showBottomBorder: boolean;
  sectionBgColor: string;
  headingColor: string;
  bodyColor: string;
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
types = types.replace(/export type SectionImageTextProps = \{[\s\S]*?\};\n\n?/g, '');
types = types.replace(/export type FooterProps = \{/, `${propsType}\n\nexport type FooterProps = {`);
fs.writeFileSync('src/generated/types.ts', types);

console.log('SectionImageText manifest + types', settings.length);
