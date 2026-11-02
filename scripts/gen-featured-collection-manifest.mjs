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
  default: 'label',
  options: [
    { label: 'Dolu', value: 'solid' },
    { label: 'Çerçeveli', value: 'outline' },
    { label: 'Etiket (altı çizili)', value: 'label' },
    { label: 'İkincil', value: 'secondary' },
  ],
};

const sectionFields = [
  sectionContainerWidthSelect,
  {
    id: 'captionDisplay',
    label: 'Kutu yazıları (caption)',
    type: 'select',
    default: 'always',
    options: [
      { label: 'Sürekli görünür', value: 'always' },
      { label: 'Yalnızca hover’da', value: 'hover' },
    ],
  },
  { id: 'sectionTitle', label: 'Bölüm başlığı', type: 'text', default: '' },
  {
    id: 'titleAlign',
    label: 'Başlık hizası',
    type: 'select',
    default: 'left',
    options: [
      { label: 'Sol', value: 'left' },
      { label: 'Orta', value: 'center' },
    ],
  },
  {
    id: 'headingStyle',
    label: 'Başlık stili',
    type: 'select',
    default: 'editorial',
    options: [
      { label: 'Editoryal (büyük harf)', value: 'editorial' },
      { label: 'Varsayılan', value: 'default' },
    ],
  },
  { id: 'titleColor', label: 'Başlık rengi', type: 'color', default: '' },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
  {
    id: 'layoutPreset',
    label: 'Düzen',
    type: 'select',
    default: 'fourEqual',
    options: [
      { label: '4 eşit sütun', value: 'fourEqual' },
      { label: '3 sütun (dar–geniş–dar)', value: 'threeNarrowWideNarrow' },
      { label: '3 sütun (geniş–dar–geniş)', value: 'threeWideNarrowWide' },
    ],
  },
  { id: 'columnGap', label: 'Sütun aralığı', type: 'range', default: 16, min: 0, max: 48, step: 2, unit: 'px' },
  { id: 'rowHeight', label: 'Satır yüksekliği (masaüstü)', type: 'range', default: 520, min: 280, max: 800, step: 10, unit: 'px' },
  { id: 'rowHeightMobile', label: 'Satır yüksekliği (mobil)', type: 'range', default: 360, min: 200, max: 600, step: 10, unit: 'px' },
  { id: 'useFullWidth', label: 'Tam genişlik (masaüstü)', type: 'boolean', default: true },
  { id: 'useFullWidthMobile', label: 'Tam genişlik (mobil)', type: 'boolean', default: true },
  { id: 'hideOnDesktop', label: 'Masaüstünde gizle', type: 'boolean', default: false },
  { id: 'hideOnMobile', label: 'Mobilde gizle', type: 'boolean', default: false },
  { id: 'marginTop', label: 'Üst boşluk (masaüstü)', type: 'range', default: 0, min: 0, max: 120, step: 4, unit: 'px' },
  { id: 'marginBottom', label: 'Alt boşluk (masaüstü)', type: 'range', default: 0, min: 0, max: 120, step: 4, unit: 'px' },
  { id: 'marginTopMobile', label: 'Üst boşluk (mobil)', type: 'range', default: 0, min: 0, max: 80, step: 4, unit: 'px' },
  { id: 'marginBottomMobile', label: 'Alt boşluk (mobil)', type: 'range', default: 0, min: 0, max: 80, step: 4, unit: 'px' },
  { id: 'itemButtonStyle', label: 'Kutu düğme stili', ...buttonStyleSelect },
  { id: 'openLinksInNewTab', label: 'Bağlantıları yeni sekmede aç', type: 'boolean', default: false },
];

function itemFields(n) {
  const L = `Kutu ${n} — `;
  return [
    { id: `item${n}Image`, label: `${L}Görsel`, type: 'image', default: '' },
    { id: `item${n}ImageMobile`, label: `${L}Görsel (mobil)`, type: 'image', default: '' },
    { id: `item${n}LinkUrl`, label: `${L}Kart adresi`, type: 'url', default: '' },
    { id: `item${n}ShowCaptionCard`, label: `${L}Beyaz caption kartı`, type: 'boolean', default: false },
    { id: `item${n}CaptionEyebrow`, label: `${L}Caption üst etiket`, type: 'text', default: '' },
    { id: `item${n}CaptionTitle`, label: `${L}Caption başlık`, type: 'text', default: '' },
    { id: `item${n}ButtonLabel`, label: `${L}Düğme metni`, type: 'text', default: '' },
    { id: `item${n}ButtonUrl`, label: `${L}Düğme adresi`, type: 'url', default: '' },
  ];
}

const settings = [...sectionFields, ...[1, 2, 3, 4].flatMap(itemFields)];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const existing = manifest.sections.findIndex((s) => s.type === 'SectionFeaturedCollection');
const entry = {
  type: 'SectionFeaturedCollection',
  name: 'Seçilmiş Koleksiyon',
  description: 'Editoryal başlık ve 3–4 görselli koleksiyon ızgarası; isteğe bağlı caption kartı.',
  settings,
};

if (existing >= 0) manifest.sections[existing] = entry;
else manifest.sections.push(entry);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const styleUnion = '"solid" | "outline" | "label" | "secondary"';
const itemType = (n) => `
  item${n}Image: string;
  item${n}ImageMobile: string;
  item${n}LinkUrl: string;
  item${n}ShowCaptionCard: boolean;
  item${n}CaptionEyebrow: string;
  item${n}CaptionTitle: string;
  item${n}ButtonLabel: string;
  item${n}ButtonUrl: string;`;

const widthUnion = '"default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide"';

const propsType = `export type SectionFeaturedCollectionProps = {
  sectionContainerWidth: ${widthUnion};
  captionDisplay: "always" | "hover";
  sectionTitle: string;
  titleAlign: "left" | "center";
  headingStyle: "editorial" | "default";
  titleColor: string;
  sectionBgColor: string;
  layoutPreset: "fourEqual" | "threeNarrowWideNarrow" | "threeWideNarrowWide";
  columnGap: number;
  rowHeight: number;
  rowHeightMobile: number;
  useFullWidth: boolean;
  useFullWidthMobile: boolean;
  hideOnDesktop: boolean;
  hideOnMobile: boolean;
  marginTop: number;
  marginBottom: number;
  marginTopMobile: number;
  marginBottomMobile: number;
  itemButtonStyle: ${styleUnion};
  openLinksInNewTab: boolean;
${[1, 2, 3, 4].map(itemType).join('')}
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
if (types.includes('SectionFeaturedCollectionProps')) {
  types = types.replace(/export type SectionFeaturedCollectionProps = \{[\s\S]*?\};\n\n/, '');
}
types = types.replace(
  /export type FooterProps = \{/,
  `${propsType}\n\nexport type FooterProps = {`,
);
fs.writeFileSync('src/generated/types.ts', types);

console.log('SectionFeaturedCollection manifest + types', settings.length);
