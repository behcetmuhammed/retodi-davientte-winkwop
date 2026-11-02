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
  /** Mobil üst menü düzeni */
  mobileHeaderLayout: "trailingActions" | "leadingIconsCenterLogo";
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
  /** Bağlantı 1 ikonu (mobil) */
  link1IconMobile: string;
  /** Bağlantı 1 Konumu */
  link1Position: "right" | "left";
  /** Bağlantı 2 Adı */
  link2LabelName: string;
  /** Bağlantı 2 Yönlendirme Adresi */
  link2: string;
  /** Bağlantı 2 İkonu */
  link2Icon: string;
  /** Bağlantı 2 ikonu (mobil) */
  link2IconMobile: string;
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
  /** X (Twitter) bağlantısı */
  xLink: string;
  /** YouTube bağlantısı */
  youtubeLink: string;
  /** TikTok bağlantısı */
  tiktokLink: string;
  /** Pinterest bağlantısı */
  pinterestLink: string;
  /** Sosyal Medya Bağlantılarını Yeni Sekmede Aç */
  openSocialLinksInNewTab: boolean;
  /** Facebook ikonu (mobil) */
  facebookIconMobile: string;
  /** Instagram ikonu (mobil) */
  instagramIconMobile: string;
  /** WhatsApp ikonu (mobil) */
  whatsappIconMobile: string;
  /** LinkedIn ikonu (mobil) */
  linkedinIconMobile: string;
  /** X ikonu (mobil) */
  xIconMobile: string;
  /** YouTube ikonu (mobil) */
  youtubeIconMobile: string;
  /** TikTok ikonu (mobil) */
  tiktokIconMobile: string;
  /** Pinterest ikonu (mobil) */
  pinterestIconMobile: string;
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
  /** Birincil düğme stili (tüm slaytlar) */
  primaryButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** İkincil düğme stili (tüm slaytlar) */
  secondaryButtonStyle: "solid" | "outline" | "label" | "secondary";
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
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Üst etiket */
  eyebrow: string;
  /** Başlık */
  heading: string;
  /** Açıklama */
  description: string;
  /** Başlık stili */
  headingStyle: "editorial" | "default";
  /** Üst etiket rengi */
  eyebrowColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Gövde metni rengi */
  bodyColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Birincil düğme metni */
  primaryLabel: string;
  /** Birincil düğme adresi */
  primaryUrl: string;
  /** İkincil düğme metni */
  secondaryLabel: string;
  /** İkincil düğme adresi */
  secondaryUrl: string;
  /** Birincil düğme stili */
  primaryButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** İkincil düğme stili */
  secondaryButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** Metin hizası */
  contentAlign: "left" | "center" | "right";
  /** Dikey boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** İçerik genişliği */
  contentWidth: "narrow" | "medium" | "wide";
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type RichTextProps = {
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Üst etiket */
  eyebrow: string;
  /** Başlık */
  heading: string;
  /** Zengin metin (HTML) */
  htmlContent: string;
  /** Başlık stili */
  headingStyle: "editorial" | "default";
  /** Üst etiket rengi */
  eyebrowColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Gövde metni rengi */
  bodyColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Birincil düğme metni */
  primaryLabel: string;
  /** Birincil düğme adresi */
  primaryUrl: string;
  /** İkincil düğme metni */
  secondaryLabel: string;
  /** İkincil düğme adresi */
  secondaryUrl: string;
  /** Birincil düğme stili */
  primaryButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** İkincil düğme stili */
  secondaryButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** Metin hizası */
  contentAlign: "left" | "center" | "right";
  /** Dikey boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** İçerik genişliği */
  contentWidth: "narrow" | "medium" | "wide";
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionMediaGridProps = {
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Etiket */
  headerEyebrow: string;
  /** Etiket rengi */
  headerEyebrowColor: string;
  /** Başlık */
  headerTitle: string;
  /** Başlık rengi */
  headerTitleColor: string;
  /** Alt başlık (sağ sütun) */
  headerSubTitle: string;
  /** Sağ metin rengi */
  headerSubTitleColor: string;
  /** Arka plan rengi */
  bgColor: string;
  /** Satır yüksekliği (masaüstü) */
  desktopRowHeight: number;
  /** Satır yüksekliği (mobil) */
  mobileRowHeight: number;
  /** Kutu aralığı */
  columnSpacing: number;
  /** Hover zoom */
  enableMediaHoverZoom: boolean;
  /** Kutu düğme stili */
  itemButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** Tam genişlik (masaüstü) */
  useFullWidth: boolean;
  /** Tam genişlik (mobil) */
  useFullWidthMobile: boolean;
  /** Masaüstünde gizle */
  hideOnDesktop: boolean;
  /** Mobilde gizle */
  hideOnMobile: boolean;
  /** Üst boşluk (masaüstü) */
  marginTop: number;
  /** Alt boşluk (masaüstü) */
  marginBottom: number;
  /** Üst boşluk (mobil) */
  marginTopMobile: number;
  /** Alt boşluk (mobil) */
  marginBottomMobile: number;
  /** Kutu 1 — Medya türü */
  item1MediaType: "image" | "video";
  /** Kutu 1 — Görsel */
  item1Image: string;
  /** Kutu 1 — Görsel (mobil) */
  item1ImageMobile: string;
  /** Kutu 1 — Video */
  item1VideoUrl: string;
  /** Kutu 1 — Video (mobil) */
  item1VideoUrlMobile: string;
  /** Kutu 1 — Sütun genişliği */
  item1ColumnSpan: "3" | "4" | "6" | "8" | "12";
  /** Kutu 1 — Satır yüksekliği (birim) */
  item1RowSpan: number;
  /** Kutu 1 — Metin konumu */
  item1Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  /** Kutu 1 — Üst etiket */
  item1SubTitle: string;
  /** Kutu 1 — Başlık */
  item1Title: string;
  /** Kutu 1 — İçerik (HTML) */
  item1Content: string;
  /** Kutu 1 — Başlık rengi */
  item1TitleColor: string;
  /** Kutu 1 — Etiket rengi */
  item1SubTitleColor: string;
  /** Kutu 1 — Düğme metni */
  item1ButtonLabel: string;
  /** Kutu 1 — Düğme / kart adresi */
  item1ButtonUrl: string;
  /** Kutu 1 — Yeni sekmede aç */
  item1OpenLinkInNewTab: boolean;
  /** Kutu 1 — Koyu kaplama */
  item1ShowImageOverlay: boolean;
  /** Kutu 2 — Medya türü */
  item2MediaType: "image" | "video";
  /** Kutu 2 — Görsel */
  item2Image: string;
  /** Kutu 2 — Görsel (mobil) */
  item2ImageMobile: string;
  /** Kutu 2 — Video */
  item2VideoUrl: string;
  /** Kutu 2 — Video (mobil) */
  item2VideoUrlMobile: string;
  /** Kutu 2 — Sütun genişliği */
  item2ColumnSpan: "3" | "4" | "6" | "8" | "12";
  /** Kutu 2 — Satır yüksekliği (birim) */
  item2RowSpan: number;
  /** Kutu 2 — Metin konumu */
  item2Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  /** Kutu 2 — Üst etiket */
  item2SubTitle: string;
  /** Kutu 2 — Başlık */
  item2Title: string;
  /** Kutu 2 — İçerik (HTML) */
  item2Content: string;
  /** Kutu 2 — Başlık rengi */
  item2TitleColor: string;
  /** Kutu 2 — Etiket rengi */
  item2SubTitleColor: string;
  /** Kutu 2 — Düğme metni */
  item2ButtonLabel: string;
  /** Kutu 2 — Düğme / kart adresi */
  item2ButtonUrl: string;
  /** Kutu 2 — Yeni sekmede aç */
  item2OpenLinkInNewTab: boolean;
  /** Kutu 2 — Koyu kaplama */
  item2ShowImageOverlay: boolean;
  /** Kutu 3 — Medya türü */
  item3MediaType: "image" | "video";
  /** Kutu 3 — Görsel */
  item3Image: string;
  /** Kutu 3 — Görsel (mobil) */
  item3ImageMobile: string;
  /** Kutu 3 — Video */
  item3VideoUrl: string;
  /** Kutu 3 — Video (mobil) */
  item3VideoUrlMobile: string;
  /** Kutu 3 — Sütun genişliği */
  item3ColumnSpan: "3" | "4" | "6" | "8" | "12";
  /** Kutu 3 — Satır yüksekliği (birim) */
  item3RowSpan: number;
  /** Kutu 3 — Metin konumu */
  item3Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  /** Kutu 3 — Üst etiket */
  item3SubTitle: string;
  /** Kutu 3 — Başlık */
  item3Title: string;
  /** Kutu 3 — İçerik (HTML) */
  item3Content: string;
  /** Kutu 3 — Başlık rengi */
  item3TitleColor: string;
  /** Kutu 3 — Etiket rengi */
  item3SubTitleColor: string;
  /** Kutu 3 — Düğme metni */
  item3ButtonLabel: string;
  /** Kutu 3 — Düğme / kart adresi */
  item3ButtonUrl: string;
  /** Kutu 3 — Yeni sekmede aç */
  item3OpenLinkInNewTab: boolean;
  /** Kutu 3 — Koyu kaplama */
  item3ShowImageOverlay: boolean;
  /** Kutu 4 — Medya türü */
  item4MediaType: "image" | "video";
  /** Kutu 4 — Görsel */
  item4Image: string;
  /** Kutu 4 — Görsel (mobil) */
  item4ImageMobile: string;
  /** Kutu 4 — Video */
  item4VideoUrl: string;
  /** Kutu 4 — Video (mobil) */
  item4VideoUrlMobile: string;
  /** Kutu 4 — Sütun genişliği */
  item4ColumnSpan: "3" | "4" | "6" | "8" | "12";
  /** Kutu 4 — Satır yüksekliği (birim) */
  item4RowSpan: number;
  /** Kutu 4 — Metin konumu */
  item4Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  /** Kutu 4 — Üst etiket */
  item4SubTitle: string;
  /** Kutu 4 — Başlık */
  item4Title: string;
  /** Kutu 4 — İçerik (HTML) */
  item4Content: string;
  /** Kutu 4 — Başlık rengi */
  item4TitleColor: string;
  /** Kutu 4 — Etiket rengi */
  item4SubTitleColor: string;
  /** Kutu 4 — Düğme metni */
  item4ButtonLabel: string;
  /** Kutu 4 — Düğme / kart adresi */
  item4ButtonUrl: string;
  /** Kutu 4 — Yeni sekmede aç */
  item4OpenLinkInNewTab: boolean;
  /** Kutu 4 — Koyu kaplama */
  item4ShowImageOverlay: boolean;
  /** Kutu 5 — Medya türü */
  item5MediaType: "image" | "video";
  /** Kutu 5 — Görsel */
  item5Image: string;
  /** Kutu 5 — Görsel (mobil) */
  item5ImageMobile: string;
  /** Kutu 5 — Video */
  item5VideoUrl: string;
  /** Kutu 5 — Video (mobil) */
  item5VideoUrlMobile: string;
  /** Kutu 5 — Sütun genişliği */
  item5ColumnSpan: "3" | "4" | "6" | "8" | "12";
  /** Kutu 5 — Satır yüksekliği (birim) */
  item5RowSpan: number;
  /** Kutu 5 — Metin konumu */
  item5Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  /** Kutu 5 — Üst etiket */
  item5SubTitle: string;
  /** Kutu 5 — Başlık */
  item5Title: string;
  /** Kutu 5 — İçerik (HTML) */
  item5Content: string;
  /** Kutu 5 — Başlık rengi */
  item5TitleColor: string;
  /** Kutu 5 — Etiket rengi */
  item5SubTitleColor: string;
  /** Kutu 5 — Düğme metni */
  item5ButtonLabel: string;
  /** Kutu 5 — Düğme / kart adresi */
  item5ButtonUrl: string;
  /** Kutu 5 — Yeni sekmede aç */
  item5OpenLinkInNewTab: boolean;
  /** Kutu 5 — Koyu kaplama */
  item5ShowImageOverlay: boolean;
  /** Kutu 6 — Medya türü */
  item6MediaType: "image" | "video";
  /** Kutu 6 — Görsel */
  item6Image: string;
  /** Kutu 6 — Görsel (mobil) */
  item6ImageMobile: string;
  /** Kutu 6 — Video */
  item6VideoUrl: string;
  /** Kutu 6 — Video (mobil) */
  item6VideoUrlMobile: string;
  /** Kutu 6 — Sütun genişliği */
  item6ColumnSpan: "3" | "4" | "6" | "8" | "12";
  /** Kutu 6 — Satır yüksekliği (birim) */
  item6RowSpan: number;
  /** Kutu 6 — Metin konumu */
  item6Position: "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "outside-bottom-left" | "outside-bottom-center" | "outside-bottom-right";
  /** Kutu 6 — Üst etiket */
  item6SubTitle: string;
  /** Kutu 6 — Başlık */
  item6Title: string;
  /** Kutu 6 — İçerik (HTML) */
  item6Content: string;
  /** Kutu 6 — Başlık rengi */
  item6TitleColor: string;
  /** Kutu 6 — Etiket rengi */
  item6SubTitleColor: string;
  /** Kutu 6 — Düğme metni */
  item6ButtonLabel: string;
  /** Kutu 6 — Düğme / kart adresi */
  item6ButtonUrl: string;
  /** Kutu 6 — Yeni sekmede aç */
  item6OpenLinkInNewTab: boolean;
  /** Kutu 6 — Koyu kaplama */
  item6ShowImageOverlay: boolean;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionFeaturedCollectionProps = {
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Kutu yazıları (caption) */
  captionDisplay: "always" | "hover";
  /** Bölüm başlığı */
  sectionTitle: string;
  /** Başlık hizası */
  titleAlign: "left" | "center";
  /** Başlık stili */
  headingStyle: "editorial" | "default";
  /** Başlık rengi */
  titleColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Düzen */
  layoutPreset: "fourEqual" | "threeNarrowWideNarrow" | "threeWideNarrowWide";
  /** Sütun aralığı */
  columnGap: number;
  /** Satır yüksekliği (masaüstü) */
  rowHeight: number;
  /** Satır yüksekliği (mobil) */
  rowHeightMobile: number;
  /** Tam genişlik (masaüstü) */
  useFullWidth: boolean;
  /** Tam genişlik (mobil) */
  useFullWidthMobile: boolean;
  /** Masaüstünde gizle */
  hideOnDesktop: boolean;
  /** Mobilde gizle */
  hideOnMobile: boolean;
  /** Üst boşluk (masaüstü) */
  marginTop: number;
  /** Alt boşluk (masaüstü) */
  marginBottom: number;
  /** Üst boşluk (mobil) */
  marginTopMobile: number;
  /** Alt boşluk (mobil) */
  marginBottomMobile: number;
  /** Kutu düğme stili */
  itemButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Kutu 1 — Görsel */
  item1Image: string;
  /** Kutu 1 — Görsel (mobil) */
  item1ImageMobile: string;
  /** Kutu 1 — Kart adresi */
  item1LinkUrl: string;
  /** Kutu 1 — Beyaz caption kartı */
  item1ShowCaptionCard: boolean;
  /** Kutu 1 — Caption üst etiket */
  item1CaptionEyebrow: string;
  /** Kutu 1 — Caption başlık */
  item1CaptionTitle: string;
  /** Kutu 1 — Düğme metni */
  item1ButtonLabel: string;
  /** Kutu 1 — Düğme adresi */
  item1ButtonUrl: string;
  /** Kutu 2 — Görsel */
  item2Image: string;
  /** Kutu 2 — Görsel (mobil) */
  item2ImageMobile: string;
  /** Kutu 2 — Kart adresi */
  item2LinkUrl: string;
  /** Kutu 2 — Beyaz caption kartı */
  item2ShowCaptionCard: boolean;
  /** Kutu 2 — Caption üst etiket */
  item2CaptionEyebrow: string;
  /** Kutu 2 — Caption başlık */
  item2CaptionTitle: string;
  /** Kutu 2 — Düğme metni */
  item2ButtonLabel: string;
  /** Kutu 2 — Düğme adresi */
  item2ButtonUrl: string;
  /** Kutu 3 — Görsel */
  item3Image: string;
  /** Kutu 3 — Görsel (mobil) */
  item3ImageMobile: string;
  /** Kutu 3 — Kart adresi */
  item3LinkUrl: string;
  /** Kutu 3 — Beyaz caption kartı */
  item3ShowCaptionCard: boolean;
  /** Kutu 3 — Caption üst etiket */
  item3CaptionEyebrow: string;
  /** Kutu 3 — Caption başlık */
  item3CaptionTitle: string;
  /** Kutu 3 — Düğme metni */
  item3ButtonLabel: string;
  /** Kutu 3 — Düğme adresi */
  item3ButtonUrl: string;
  /** Kutu 4 — Görsel */
  item4Image: string;
  /** Kutu 4 — Görsel (mobil) */
  item4ImageMobile: string;
  /** Kutu 4 — Kart adresi */
  item4LinkUrl: string;
  /** Kutu 4 — Beyaz caption kartı */
  item4ShowCaptionCard: boolean;
  /** Kutu 4 — Caption üst etiket */
  item4CaptionEyebrow: string;
  /** Kutu 4 — Caption başlık */
  item4CaptionTitle: string;
  /** Kutu 4 — Düğme metni */
  item4ButtonLabel: string;
  /** Kutu 4 — Düğme adresi */
  item4ButtonUrl: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionPageIntroProps = {
  /** Görsel */
  image: string;
  /** Görsel (mobil) */
  imageMobile: string;
  /** Görsel yüksekliği (masaüstü) */
  imageHeight: number;
  /** Görsel yüksekliği (mobil) */
  imageHeightMobile: number;
  /** Alt sis geçişi */
  showBottomFade: boolean;
  /** Sis yüksekliği */
  fadeHeight: number;
  /** Sis hedef rengi */
  fadeToColor: string;
  /** Başlık */
  heading: string;
  /** Etiket (başlık altında) */
  eyebrow: string;
  /** Açıklama */
  description: string;
  /** Açıklama hizası */
  descriptionAlign: "left" | "center" | "right" | "justify";
  /** Başlık stili */
  headingStyle: "default" | "editorial";
  /** Etiket rengi */
  eyebrowColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Açıklama rengi */
  bodyColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Başlık ve etiket hizası */
  contentAlign: "left" | "center" | "right";
  /** Metin genişliği */
  contentWidth: "narrow" | "medium" | "wide";
  /** Metin alt boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionImageTextProps = {
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Görsel */
  image: string;
  /** Görsel (mobil) */
  imageMobile: string;
  /** Görsel minimum yükseklik */
  imageMinHeight: number;
  /** Görsel sağda (ters düzen) */
  reverseLayout: boolean;
  /** Başlık */
  heading: string;
  /** Açıklama */
  description: string;
  /** Başlık stili */
  headingStyle: "default" | "editorial";
  /** Düğme metni */
  primaryLabel: string;
  /** Düğme adresi */
  primaryUrl: string;
  /** Düğme stili */
  primaryButtonStyle: "solid" | "outline" | "label" | "secondary";
  /** Bağlantıları yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Alt ayırıcı çizgi */
  showBottomBorder: boolean;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Açıklama rengi */
  bodyColor: string;
  /** Dikey boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionContactProps = {
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Bilgi 1 — başlık */
  group1Title: string;
  /** Bilgi 1 — metin */
  group1Body: string;
  /** Bilgi 2 — başlık */
  group2Title: string;
  /** Bilgi 2 — metin */
  group2Body: string;
  /** Bilgi 3 — başlık */
  group3Title: string;
  /** Bilgi 3 — metin */
  group3Body: string;
  /** Ad alanı placeholder */
  namePlaceholder: string;
  /** E-posta placeholder */
  emailPlaceholder: string;
  /** Mesaj placeholder */
  messagePlaceholder: string;
  /** Gönder düğmesi */
  submitButtonLabel: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionNumberedListProps = {
  /** Genel genişlik */
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  /** Dikey boşluk */
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
  /** Başlık rengi */
  titleColor: string;
  /** Açıklama rengi */
  bodyColor: string;
  /** Madde 1 — Başlık */
  item1Title: string;
  /** Madde 1 — Açıklama */
  item1Description: string;
  /** Madde 2 — Başlık */
  item2Title: string;
  /** Madde 2 — Açıklama */
  item2Description: string;
  /** Madde 3 — Başlık */
  item3Title: string;
  /** Madde 3 — Açıklama */
  item3Description: string;
  /** Madde 4 — Başlık */
  item4Title: string;
  /** Madde 4 — Açıklama */
  item4Description: string;
  /** Madde 5 — Başlık */
  item5Title: string;
  /** Madde 5 — Açıklama */
  item5Description: string;
  /** Madde 6 — Başlık */
  item6Title: string;
  /** Madde 6 — Açıklama */
  item6Description: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};

export type SectionFaqProps = {
  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";
  layoutPreset: "accordion" | "openNumbered";
  sectionTitle: string;
  titleAlign: "left" | "center";
  headingStyle: "default" | "editorial";
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  sectionBgColor: string;
  titleColor: string;
  faq1Question: string;
  faq1Answer: string;
  faq2Question: string;
  faq2Answer: string;
  faq3Question: string;
  faq3Answer: string;
  faq4Question: string;
  faq4Answer: string;
  faq5Question: string;
  faq5Answer: string;
  faq6Question: string;
  faq6Answer: string;
  faq7Question: string;
  faq7Answer: string;
  faq8Question: string;
  faq8Answer: string;
  faq9Question: string;
  faq9Answer: string;
  faq10Question: string;
  faq10Answer: string;
  page: WinkwopPageContext;
};

export type FooterProps = {
  /** Arka plan rengi */
  backgroundColor: string;
  /** Metin rengi */
  textColor: string;
  /** Alt şerit arka plan */
  barBackgroundColor: string;
  /** Alt şerit metin rengi */
  barTextColor: string;
  /** Müşteri hizmetleri — başlık */
  customerCareTitle: string;
  /** Müşteri hizmetleri — bağlantılar */
  customerCareLinks: WinkwopLink[];
  /** Telefon */
  contactPhone: string;
  /** E-posta */
  contactEmail: string;
  /** Kurumsal — başlık */
  corporateTitle: string;
  /** Kurumsal — bağlantılar */
  corporateLinks: WinkwopLink[];
  /** Yasal — başlık */
  legalTitle: string;
  /** Yasal — bağlantılar */
  legalLinks: WinkwopLink[];
  /** Bülten — başlık */
  newsletterTitle: string;
  /** Bülten — açıklama */
  newsletterDescription: string;
  /** Bülten — e-posta placeholder */
  emailPlaceholder: string;
  /** Bülten — abone ol metni */
  subscribeButtonLabel: string;
  /** Instagram */
  instagramLink: string;
  /** Facebook */
  facebookLink: string;
  /** X (Twitter) */
  xLink: string;
  /** Sosyal bağlantıları yeni sekmede aç */
  openSocialLinksInNewTab: boolean;
  /** Menü bağlantılarını yeni sekmede aç */
  openLinksInNewTab: boolean;
  /** Telif metni */
  copyrightText: string;
  /** Bu sayfanın neyle ilgili olduğu */
  page: WinkwopPageContext;
};
