// Bu dosya Winkwop CLI tarafından üretilir - elle düzenlemeyin.
// Geliştirme editöründe yaptığınız değişiklikleri almak için: npx create-winkwop-theme pull

export type WinkwopLink = { label: string; url: string };

export type WinkwopProduct = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  images?: string[] | null;
  category_ids?: string[] | null;
  brand_id?: string | null;
  in_stock?: boolean;
  /** Arama motoru etiketleri; boşsa ad/açıklamaya düşülür. */
  seo_title?: string | null;
  seo_description?: string | null;
  /** Seçenekli ürün mü (beden/renk). Detayda seçici gösterilir. */
  has_variants?: boolean;
  /**
   * B2B: fiyat gizlendi. Mağaza "giriş yapmayana fiyat gösterme" derse API
   * fiyatı hiç göndermiyor; `price` sıfır gelir ve bu alan `true` olur.
   * Tema rakam yerine "fiyat için giriş yapın" göstermeli.
   */
  prices_hidden?: boolean;
};

export type WinkwopCategory = {
  id: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  product_count?: number;
};

/** Ürün listesi prop'u: geçerli sayfa + sayfalama davranışı. */
export type WinkwopProductList = {
  data: WinkwopProduct[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  loading: boolean;
  loadMore: () => Promise<void>;
};

export type WinkwopPageContext = {
  pageKey: string;
  product?: WinkwopProduct | null;
  category?: WinkwopCategory | null;
  searchQuery?: string;
};

export type HeaderProps = {
  /** Üst Menü Yerleşim Düzeni */
  headerLayout: "logoLeftMenuCenter" | "logoCenterMenuLeft" | "logoCenterMenuBelow" | "logoLeftMenuBelow" | "logoLeftMenuLeft";
  /** Logo */
  logo: string;
  /** Logo Genişliği (Masaüstü) */
  logoWidthWeb: number;
  /** Logo Genişliği (Mobil) */
  logoWidthMobile: number;
  /** Logo Renklerini Ters Çevir — Siyah logoyu beyaza, beyaz logoyu siyaha dönüştürür. */
  invertLogoColors: boolean;
  /** Menüler */
  categories: WinkwopLink[];
  /** Bağlantı 1 Adı */
  link1LabelName: string;
  /** Bağlantı 1 Yönlendirme Adresi — Test */
  link1: string;
  /** Bağlantı 1 İkonu */
  link1Icon: string;
  /** Bağlantı 1 Konumu */
  link1Position: "right" | "left";
  /** Bağlantı 2 Adı */
  link2LabelName: string;
  /** Bağlantı 2 Yönlendirme Adresi */
  link2: string;
  /** Bağlantı 2 İkonu */
  link2Icon: string;
  /** Bağlantı 2 Konumu */
  link2Position: "right" | "left";
  /** Bağlantıları Yeni Sekmede Aç */
  openLinksInNewTab: boolean;
  /** Facebook Bağlantısı */
  facebookLink: string;
  /** Instagram Bağlantısı */
  instagramLink: string;
  /** Whatsapp Bağlantısı */
  whatsappLink: string;
  /** Linkedin Bağlantısı */
  linkedinLink: string;
  /** Sosyal Medya Bağlantılarını Yeni Sekmede Aç */
  openSocialLinksInNewTab: boolean;
  /** Metin 1 */
  text1: string;
  /** Metin 2 */
  text2: string;
  /** Metin 3 */
  text3: string;
  /** Arka Plan Rengi */
  backgroundColor: string;
  /** Metin ve İkon Rengi */
  textAndIconColor: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type HeroBannerProps = {
  // Bu bölüm için henüz alan tanımlanmadı
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type FooterProps = {
  // Bu bölüm için henüz alan tanımlanmadı
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type TextProps = {
  // Bu bölüm için henüz alan tanımlanmadı
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type RichTextProps = {
  // Bu bölüm için henüz alan tanımlanmadı
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};
