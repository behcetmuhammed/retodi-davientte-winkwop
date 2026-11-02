import fs from 'node:fs';

const positions = [
  ['Üst sol', 'top-left'],
  ['Üst orta', 'top-center'],
  ['Üst sağ', 'top-right'],
  ['Orta sol', 'middle-left'],
  ['Orta', 'middle-center'],
  ['Orta sağ', 'middle-right'],
  ['Alt sol', 'bottom-left'],
  ['Alt orta', 'bottom-center'],
  ['Alt sağ', 'bottom-right'],
  ['Görsel altı sol', 'outside-bottom-left'],
  ['Görsel altı orta', 'outside-bottom-center'],
  ['Görsel altı sağ', 'outside-bottom-right'],
];

const positionSelect = {
  type: 'select',
  default: 'bottom-center',
  options: positions.map(([label, value]) => ({ label, value })),
};

const columnSelect = {
  type: 'select',
  default: '4',
  options: ['3', '4', '6', '8', '12'].map((v) => ({ label: `${v} sütun`, value: v })),
};

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

const section = [
  sectionContainerWidthSelect,
  { id: 'headerEyebrow', label: 'Etiket', type: 'text', default: '' },
  { id: 'headerEyebrowColor', label: 'Etiket rengi', type: 'color', default: '' },
  { id: 'headerTitle', label: 'Başlık', type: 'text', default: '' },
  { id: 'headerTitleColor', label: 'Başlık rengi', type: 'color', default: '' },
  { id: 'headerSubTitle', label: 'Alt başlık (sağ sütun)', type: 'textarea', default: '' },
  { id: 'headerSubTitleColor', label: 'Sağ metin rengi', type: 'color', default: '' },
  { id: 'bgColor', label: 'Arka plan rengi', type: 'color', default: '' },
  { id: 'desktopRowHeight', label: 'Satır yüksekliği (masaüstü)', type: 'range', default: 290, min: 120, max: 600, step: 10, unit: 'px' },
  { id: 'mobileRowHeight', label: 'Satır yüksekliği (mobil)', type: 'range', default: 180, min: 80, max: 400, step: 10, unit: 'px' },
  { id: 'columnSpacing', label: 'Kutu aralığı', type: 'range', default: 24, min: 0, max: 64, step: 2, unit: 'px' },
  { id: 'enableMediaHoverZoom', label: 'Hover zoom', type: 'boolean', default: true },
  {
    id: 'itemButtonStyle',
    label: 'Kutu düğme stili',
    type: 'select',
    default: 'solid',
    options: [
      { label: 'Dolu', value: 'solid' },
      { label: 'Çerçeveli', value: 'outline' },
      { label: 'Etiket (altı çizili)', value: 'label' },
      { label: 'İkincil', value: 'secondary' },
    ],
  },
  { id: 'useFullWidth', label: 'Tam genişlik (masaüstü)', type: 'boolean', default: true },
  { id: 'useFullWidthMobile', label: 'Tam genişlik (mobil)', type: 'boolean', default: true },
  { id: 'hideOnDesktop', label: 'Masaüstünde gizle', type: 'boolean', default: false },
  { id: 'hideOnMobile', label: 'Mobilde gizle', type: 'boolean', default: false },
  { id: 'marginTop', label: 'Üst boşluk (masaüstü)', type: 'range', default: 0, min: 0, max: 120, step: 4, unit: 'px' },
  { id: 'marginBottom', label: 'Alt boşluk (masaüstü)', type: 'range', default: 0, min: 0, max: 120, step: 4, unit: 'px' },
  { id: 'marginTopMobile', label: 'Üst boşluk (mobil)', type: 'range', default: 0, min: 0, max: 80, step: 4, unit: 'px' },
  { id: 'marginBottomMobile', label: 'Alt boşluk (mobil)', type: 'range', default: 0, min: 0, max: 80, step: 4, unit: 'px' },
];

function itemFields(n) {
  const L = `Kutu ${n} — `;
  return [
    { id: `item${n}MediaType`, label: `${L}Medya türü`, type: 'select', default: 'image', options: [{ label: 'Görsel', value: 'image' }, { label: 'Video', value: 'video' }] },
    { id: `item${n}Image`, label: `${L}Görsel`, type: 'image', default: '' },
    { id: `item${n}ImageMobile`, label: `${L}Görsel (mobil)`, type: 'image', default: '' },
    { id: `item${n}VideoUrl`, label: `${L}Video`, type: 'video', default: '' },
    { id: `item${n}VideoUrlMobile`, label: `${L}Video (mobil)`, type: 'video', default: '' },
    { id: `item${n}ColumnSpan`, label: `${L}Sütun genişliği`, ...columnSelect },
    { id: `item${n}RowSpan`, label: `${L}Satır yüksekliği (birim)`, type: 'range', default: 1, min: 1, max: 5, step: 1 },
    { id: `item${n}Position`, label: `${L}Metin konumu`, ...positionSelect },
    { id: `item${n}SubTitle`, label: `${L}Üst etiket`, type: 'text', default: '' },
    { id: `item${n}Title`, label: `${L}Başlık`, type: 'text', default: '' },
    { id: `item${n}Content`, label: `${L}İçerik (HTML)`, type: 'textarea', default: '' },
    { id: `item${n}TitleColor`, label: `${L}Başlık rengi`, type: 'color', default: '' },
    { id: `item${n}SubTitleColor`, label: `${L}Etiket rengi`, type: 'color', default: '' },
    { id: `item${n}ButtonLabel`, label: `${L}Düğme metni`, type: 'text', default: '' },
    { id: `item${n}ButtonUrl`, label: `${L}Düğme / kart adresi`, type: 'url', default: '' },
    { id: `item${n}OpenLinkInNewTab`, label: `${L}Yeni sekmede aç`, type: 'boolean', default: false },
    { id: `item${n}ShowImageOverlay`, label: `${L}Koyu kaplama`, type: 'boolean', default: false },
  ];
}

const settings = [...section, ...[1, 2, 3, 4, 5, 6].flatMap(itemFields)];

const manifest = JSON.parse(fs.readFileSync('src/generated/manifest.json', 'utf8'));
const sec = manifest.sections.find((s) => s.type === 'SectionMediaGrid');
sec.settings = settings;
sec.description = '12 sütunlu medya ızgarası; görseller, overlay metin ve CTA.';
fs.writeFileSync('src/generated/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

const posUnion = positions.map((p) => p[1]).map((v) => `"${v}"`).join(' | ');
const itemType = (n) => `
  item${n}MediaType: "image" | "video";
  item${n}Image: string;
  item${n}ImageMobile: string;
  item${n}VideoUrl: string;
  item${n}VideoUrlMobile: string;
  item${n}ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item${n}RowSpan: number;
  item${n}Position: ${posUnion};
  item${n}SubTitle: string;
  item${n}Title: string;
  item${n}Content: string;
  item${n}TitleColor: string;
  item${n}SubTitleColor: string;
  item${n}ButtonLabel: string;
  item${n}ButtonUrl: string;
  item${n}OpenLinkInNewTab: boolean;
  item${n}ShowImageOverlay: boolean;`;

const widthUnion = '"default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide"';

const propsType = `export type SectionMediaGridProps = {
  sectionContainerWidth: ${widthUnion};
  headerEyebrow: string;
  headerEyebrowColor: string;
  headerTitle: string;
  headerTitleColor: string;
  headerSubTitle: string;
  headerSubTitleColor: string;
  itemButtonStyle: "solid" | "outline" | "label" | "secondary";
  bgColor: string;
  desktopRowHeight: number;
  mobileRowHeight: number;
  columnSpacing: number;
  enableMediaHoverZoom: boolean;
  useFullWidth: boolean;
  useFullWidthMobile: boolean;
  hideOnDesktop: boolean;
  hideOnMobile: boolean;
  marginTop: number;
  marginBottom: number;
  marginTopMobile: number;
  marginBottomMobile: number;
${[1, 2, 3, 4, 5, 6].map(itemType).join('')}
  page: WinkwopPageContext;
};`;

const videoTypeAlias = `/** Panel video alanı (CDN adresi). */\nexport type WinkwopVideo = string;\n\n`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
if (!types.includes('export type WinkwopVideo')) {
  types = types.replace(
    /export type WinkwopLink = \{ label: string; url: string \};\n\n/,
    `export type WinkwopLink = { label: string; url: string };\n\n${videoTypeAlias}`,
  );
}
types = types.replace(/export type SectionMediaGridProps = \{[\s\S]*?\};/, propsType);
types = types.replace(/item(\d)VideoUrl: string;/g, 'item$1VideoUrl: WinkwopVideo;');
types = types.replace(/item(\d)VideoUrlMobile: string;/g, 'item$1VideoUrlMobile: WinkwopVideo;');
fs.writeFileSync('src/generated/types.ts', types);

console.log('settings count', settings.length);
