// Bu dosya Winkwop CLI tarafından üretilir - elle düzenlemeyin.
// Geliştirme editöründe yaptığınız değişiklikleri almak için: npx create-winkwop-theme pull

export type WinkwopLink = { label: string; url: string };

/** Panel video alanı (CDN adresi). */
export type WinkwopVideo = string;

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
  /** Görünüm */
  displayMode: "single" | "carousel";
  /** Genişlik */
  widthMode: "fullBleed" | "contained";
  /** Yükseklik */
  heightPreset: "adapt" | "small" | "medium" | "large" | "extraLarge";
  /** Karusel döngü */
  carouselLoop: boolean;
  /** Otomatik geçiş */
  carouselAutoplay: boolean;
  /** Geçiş süresi (ms) */
  carouselAutoplayMs: number;
  /** Ok düğmeleri */
  showCarouselArrows: boolean;
  /** Nokta göstergeleri */
  showCarouselDots: boolean;
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Slayt 1 — Görsel (masaüstü) */
  slide1Image: string;
  /** Slayt 1 — Görsel (mobil) */
  slide1ImageMobile: string;
  /** Slayt 1 — Üst etiket */
  slide1Eyebrow: string;
  /** Slayt 1 — Başlık */
  slide1Heading: string;
  /** Slayt 1 — Açıklama */
  slide1Description: string;
  /** Slayt 1 — Birincil düğme metni */
  slide1PrimaryLabel: string;
  /** Slayt 1 — Birincil düğme adresi */
  slide1PrimaryUrl: string;
  /** Slayt 1 — İkincil düğme metni */
  slide1SecondaryLabel: string;
  /** Slayt 1 — İkincil düğme adresi */
  slide1SecondaryUrl: string;
  /** Slayt 1 — Metin hizası */
  slide1ContentAlign: "left" | "center" | "right";
  /** Slayt 1 — Metin tonu */
  slide1TextTone: "light" | "dark";
  /** Slayt 1 — Kaplama rengi */
  slide1OverlayColor: string;
  /** Slayt 1 — Kaplama opaklığı */
  slide1OverlayOpacity: number;
  /** Slayt 2 — Görsel (masaüstü) */
  slide2Image: string;
  /** Slayt 2 — Görsel (mobil) */
  slide2ImageMobile: string;
  /** Slayt 2 — Üst etiket */
  slide2Eyebrow: string;
  /** Slayt 2 — Başlık */
  slide2Heading: string;
  /** Slayt 2 — Açıklama */
  slide2Description: string;
  /** Slayt 2 — Birincil düğme metni */
  slide2PrimaryLabel: string;
  /** Slayt 2 — Birincil düğme adresi */
  slide2PrimaryUrl: string;
  /** Slayt 2 — İkincil düğme metni */
  slide2SecondaryLabel: string;
  /** Slayt 2 — İkincil düğme adresi */
  slide2SecondaryUrl: string;
  /** Slayt 2 — Metin hizası */
  slide2ContentAlign: "left" | "center" | "right";
  /** Slayt 2 — Metin tonu */
  slide2TextTone: "light" | "dark";
  /** Slayt 2 — Kaplama rengi */
  slide2OverlayColor: string;
  /** Slayt 2 — Kaplama opaklığı */
  slide2OverlayOpacity: number;
  /** Slayt 3 — Görsel (masaüstü) */
  slide3Image: string;
  /** Slayt 3 — Görsel (mobil) */
  slide3ImageMobile: string;
  /** Slayt 3 — Üst etiket */
  slide3Eyebrow: string;
  /** Slayt 3 — Başlık */
  slide3Heading: string;
  /** Slayt 3 — Açıklama */
  slide3Description: string;
  /** Slayt 3 — Birincil düğme metni */
  slide3PrimaryLabel: string;
  /** Slayt 3 — Birincil düğme adresi */
  slide3PrimaryUrl: string;
  /** Slayt 3 — İkincil düğme metni */
  slide3SecondaryLabel: string;
  /** Slayt 3 — İkincil düğme adresi */
  slide3SecondaryUrl: string;
  /** Slayt 3 — Metin hizası */
  slide3ContentAlign: "left" | "center" | "right";
  /** Slayt 3 — Metin tonu */
  slide3TextTone: "light" | "dark";
  /** Slayt 3 — Kaplama rengi */
  slide3OverlayColor: string;
  /** Slayt 3 — Kaplama opaklığı */
  slide3OverlayOpacity: number;
  /** Slayt 4 — Görsel (masaüstü) */
  slide4Image: string;
  /** Slayt 4 — Görsel (mobil) */
  slide4ImageMobile: string;
  /** Slayt 4 — Üst etiket */
  slide4Eyebrow: string;
  /** Slayt 4 — Başlık */
  slide4Heading: string;
  /** Slayt 4 — Açıklama */
  slide4Description: string;
  /** Slayt 4 — Birincil düğme metni */
  slide4PrimaryLabel: string;
  /** Slayt 4 — Birincil düğme adresi */
  slide4PrimaryUrl: string;
  /** Slayt 4 — İkincil düğme metni */
  slide4SecondaryLabel: string;
  /** Slayt 4 — İkincil düğme adresi */
  slide4SecondaryUrl: string;
  /** Slayt 4 — Metin hizası */
  slide4ContentAlign: "left" | "center" | "right";
  /** Slayt 4 — Metin tonu */
  slide4TextTone: "light" | "dark";
  /** Slayt 4 — Kaplama rengi */
  slide4OverlayColor: string;
  /** Slayt 4 — Kaplama opaklığı */
  slide4OverlayOpacity: number;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type TextProps = {
  /** Üst etiket */
  eyebrow: string;
  /** Başlık */
  heading: string;
  /** Açıklama */
  description: string;
  /** Başlık stili */
  headingStyle: "editorial" | "default";
  /** Birincil düğme metni */
  primaryLabel: string;
  /** Birincil düğme adresi */
  primaryUrl: string;
  /** İkincil düğme metni */
  secondaryLabel: string;
  /** İkincil düğme adresi */
  secondaryUrl: string;
  /** Metin hizası */
  contentAlign: "left" | "center" | "right";
  /** Dikey boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** İçerik genişliği */
  contentWidth: "narrow" | "medium" | "wide";
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Üst etiket rengi */
  eyebrowColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Gövde metni rengi */
  bodyColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type RichTextProps = {
  /** Üst etiket */
  eyebrow: string;
  /** Başlık */
  heading: string;
  /** Zengin metin (HTML) */
  htmlContent: string;
  /** Başlık stili */
  headingStyle: "editorial" | "default";
  /** Birincil düğme metni */
  primaryLabel: string;
  /** Birincil düğme adresi */
  primaryUrl: string;
  /** İkincil düğme metni */
  secondaryLabel: string;
  /** İkincil düğme adresi */
  secondaryUrl: string;
  /** Metin hizası */
  contentAlign: "left" | "center" | "right";
  /** Dikey boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** İçerik genişliği */
  contentWidth: "narrow" | "medium" | "wide";
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Üst etiket rengi */
  eyebrowColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Gövde metni rengi */
  bodyColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionMediaGridProps = {
  headerTitle: string;
  headerSubTitle: string;
  headerTitleColor: string;
  headerSubTitleColor: string;
  headerButtonLabel: string;
  headerButtonUrl: string;
  openHeaderLinkInNewTab: boolean;
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

  item1MediaType: "image" | "video";
  item1Image: string;
  item1ImageMobile: string;
  item1VideoUrl: WinkwopVideo;
  item1VideoUrlMobile: WinkwopVideo;
  item1ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item1RowSpan: number;
  item1Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  item1SubTitle: string;
  item1Title: string;
  item1Content: string;
  item1TitleColor: string;
  item1SubTitleColor: string;
  item1ButtonLabel: string;
  item1ButtonUrl: string;
  item1OpenLinkInNewTab: boolean;
  item1ShowImageOverlay: boolean;
  item2MediaType: "image" | "video";
  item2Image: string;
  item2ImageMobile: string;
  item2VideoUrl: WinkwopVideo;
  item2VideoUrlMobile: WinkwopVideo;
  item2ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item2RowSpan: number;
  item2Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  item2SubTitle: string;
  item2Title: string;
  item2Content: string;
  item2TitleColor: string;
  item2SubTitleColor: string;
  item2ButtonLabel: string;
  item2ButtonUrl: string;
  item2OpenLinkInNewTab: boolean;
  item2ShowImageOverlay: boolean;
  item3MediaType: "image" | "video";
  item3Image: string;
  item3ImageMobile: string;
  item3VideoUrl: WinkwopVideo;
  item3VideoUrlMobile: WinkwopVideo;
  item3ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item3RowSpan: number;
  item3Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  item3SubTitle: string;
  item3Title: string;
  item3Content: string;
  item3TitleColor: string;
  item3SubTitleColor: string;
  item3ButtonLabel: string;
  item3ButtonUrl: string;
  item3OpenLinkInNewTab: boolean;
  item3ShowImageOverlay: boolean;
  item4MediaType: "image" | "video";
  item4Image: string;
  item4ImageMobile: string;
  item4VideoUrl: WinkwopVideo;
  item4VideoUrlMobile: WinkwopVideo;
  item4ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item4RowSpan: number;
  item4Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  item4SubTitle: string;
  item4Title: string;
  item4Content: string;
  item4TitleColor: string;
  item4SubTitleColor: string;
  item4ButtonLabel: string;
  item4ButtonUrl: string;
  item4OpenLinkInNewTab: boolean;
  item4ShowImageOverlay: boolean;
  item5MediaType: "image" | "video";
  item5Image: string;
  item5ImageMobile: string;
  item5VideoUrl: WinkwopVideo;
  item5VideoUrlMobile: WinkwopVideo;
  item5ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item5RowSpan: number;
  item5Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  item5SubTitle: string;
  item5Title: string;
  item5Content: string;
  item5TitleColor: string;
  item5SubTitleColor: string;
  item5ButtonLabel: string;
  item5ButtonUrl: string;
  item5OpenLinkInNewTab: boolean;
  item5ShowImageOverlay: boolean;
  item6MediaType: "image" | "video";
  item6Image: string;
  item6ImageMobile: string;
  item6VideoUrl: WinkwopVideo;
  item6VideoUrlMobile: WinkwopVideo;
  item6ColumnSpan: "3" | "4" | "6" | "8" | "12";
  item6RowSpan: number;
  item6Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  item6SubTitle: string;
  item6Title: string;
  item6Content: string;
  item6TitleColor: string;
  item6SubTitleColor: string;
  item6ButtonLabel: string;
  item6ButtonUrl: string;
  item6OpenLinkInNewTab: boolean;
  item6ShowImageOverlay: boolean;
  page: WinkwopPageContext;
};

export type FooterProps = {
  // Bu bölüm için henüz alan tanımlanmadı
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};
