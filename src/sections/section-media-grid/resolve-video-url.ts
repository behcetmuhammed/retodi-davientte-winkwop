/** Panel `video` ayarı: yükleme sonrası CDN adresi veya geçiş dönemi nesne. */
export type VideoSettingValue = string | { url?: string; src?: string } | null | undefined;

/** `video` panel alanından `<video src>` adresini çıkarır. */
export function resolveVideoUrl(value: VideoSettingValue): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    const url = value.url ?? value.src;
    return typeof url === 'string' ? url.trim() : '';
  }
  return '';
}
