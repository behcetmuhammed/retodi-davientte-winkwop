import fs from 'node:fs';

const defaultLinks = [{ label: 'Bağlantı', url: '/' }];

const settings = [
  { id: 'backgroundColor', label: 'Arka plan rengi', type: 'color', default: '' },
  { id: 'textColor', label: 'Metin rengi', type: 'color', default: '' },
  { id: 'barBackgroundColor', label: 'Alt şerit arka plan', type: 'color', default: '' },
  { id: 'barTextColor', label: 'Alt şerit metin rengi', type: 'color', default: '' },
  { id: 'customerCareTitle', label: 'Müşteri hizmetleri — başlık', type: 'text', default: 'CUSTOMER CARE' },
  { id: 'customerCareLinks', label: 'Müşteri hizmetleri — bağlantılar', type: 'links', default: defaultLinks },
  { id: 'contactPhone', label: 'Telefon', type: 'text', default: '' },
  { id: 'contactEmail', label: 'E-posta', type: 'text', default: '' },
  { id: 'corporateTitle', label: 'Kurumsal — başlık', type: 'text', default: 'CORPORATE' },
  { id: 'corporateLinks', label: 'Kurumsal — bağlantılar', type: 'links', default: defaultLinks },
  { id: 'legalTitle', label: 'Yasal — başlık', type: 'text', default: 'LEGAL AREA' },
  { id: 'legalLinks', label: 'Yasal — bağlantılar', type: 'links', default: defaultLinks },
  { id: 'newsletterTitle', label: 'Bülten — başlık', type: 'text', default: 'NEWSLETTER' },
  {
    id: 'newsletterDescription',
    label: 'Bülten — açıklama',
    type: 'text',
    default: 'Yeniliklerden ve özel davetlerden haberdar olun.',
  },
  { id: 'emailPlaceholder', label: 'Bülten — e-posta placeholder', type: 'text', default: 'E-Posta Adresiniz' },
  { id: 'subscribeButtonLabel', label: 'Bülten — abone ol metni', type: 'text', default: 'ABONE OL' },
  { id: 'instagramLink', label: 'Instagram', type: 'url', default: '' },
  { id: 'facebookLink', label: 'Facebook', type: 'url', default: '' },
  { id: 'xLink', label: 'X (Twitter)', type: 'url', default: '' },
  { id: 'openSocialLinksInNewTab', label: 'Sosyal bağlantıları yeni sekmede aç', type: 'boolean', default: true },
  { id: 'openLinksInNewTab', label: 'Menü bağlantılarını yeni sekmede aç', type: 'boolean', default: false },
  { id: 'copyrightText', label: 'Telif metni', type: 'text', default: '' },
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const footerIdx = manifest.sections.findIndex((s) => s.type === 'Footer');
if (footerIdx < 0) throw new Error('Footer section not found in manifest');

manifest.sections[footerIdx] = {
  ...manifest.sections[footerIdx],
  name: 'Alt bilgi (Footer)',
  description: 'Link sütunları, iletişim, bülten ve telif şeridi.',
  settings,
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const propsType = `export type FooterProps = {
  backgroundColor: string;
  textColor: string;
  barBackgroundColor: string;
  barTextColor: string;
  customerCareTitle: string;
  customerCareLinks: WinkwopLink[];
  contactPhone: string;
  contactEmail: string;
  corporateTitle: string;
  corporateLinks: WinkwopLink[];
  legalTitle: string;
  legalLinks: WinkwopLink[];
  newsletterTitle: string;
  newsletterDescription: string;
  emailPlaceholder: string;
  subscribeButtonLabel: string;
  instagramLink: string;
  facebookLink: string;
  xLink: string;
  openSocialLinksInNewTab: boolean;
  openLinksInNewTab: boolean;
  copyrightText: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
types = types.replace(/export type FooterProps = \{[\s\S]*?\};\n?/, `${propsType}\n`);
fs.writeFileSync('src/generated/types.ts', types);

console.log('Footer manifest + types', settings.length);
