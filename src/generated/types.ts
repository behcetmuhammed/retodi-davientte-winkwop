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
  // Bu bölüm için henüz alan tanımlanmadı
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
