import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TikTokIcon,
  WhatsAppIcon,
  XBrandIcon,
  YouTubeIcon,
} from '../icons';
import { cn } from '../../lib/utils';

export type BrandSocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'linkedin'
  | 'x'
  | 'youtube'
  | 'tiktok'
  | 'pinterest';

export type BrandSocialIconImages = Partial<Record<BrandSocialPlatform, string>>;

export type BrandSocialLinksProps = {
  facebookLink?: string;
  instagramLink?: string;
  whatsappLink?: string;
  linkedinLink?: string;
  xLink?: string;
  youtubeLink?: string;
  tiktokLink?: string;
  pinterestLink?: string;
  openInNewTab?: boolean;
  iconClassName?: string;
  className?: string;
  /** Doluysa ilgili platformda SVG yerine yüklenen görsel kullanılır. */
  iconImages?: BrandSocialIconImages;
};

function isActive(href: string | undefined) {
  const u = href?.trim();
  return !!u && u !== '#';
}

export function BrandSocialLinks({
  facebookLink,
  instagramLink,
  whatsappLink,
  linkedinLink,
  xLink,
  youtubeLink,
  tiktokLink,
  pinterestLink,
  openInNewTab = true,
  iconClassName = 'size-3.5',
  className,
  iconImages,
}: BrandSocialLinksProps) {
  const items = (
    [
      { key: 'facebook' as const, href: facebookLink, label: 'Facebook', Icon: FacebookIcon },
      { key: 'instagram' as const, href: instagramLink, label: 'Instagram', Icon: InstagramIcon },
      { key: 'whatsapp' as const, href: whatsappLink, label: 'WhatsApp', Icon: WhatsAppIcon },
      { key: 'linkedin' as const, href: linkedinLink, label: 'LinkedIn', Icon: LinkedInIcon },
      { key: 'x' as const, href: xLink, label: 'X', Icon: XBrandIcon },
      { key: 'youtube' as const, href: youtubeLink, label: 'YouTube', Icon: YouTubeIcon },
      { key: 'tiktok' as const, href: tiktokLink, label: 'TikTok', Icon: TikTokIcon },
      { key: 'pinterest' as const, href: pinterestLink, label: 'Pinterest', Icon: PinterestIcon },
    ] as const
  ).filter((item) => isActive(item.href));

  if (items.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {items.map(({ key, href, label, Icon }) => {
        const customSrc = iconImages?.[key]?.trim();
        return (
          <a
            key={label}
            href={href!.trim()}
            aria-label={label}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className="transition-opacity hover:opacity-80"
          >
            {customSrc ? (
              <img src={customSrc} alt="" className={cn(iconClassName, 'object-contain')} />
            ) : (
              <Icon className={iconClassName} />
            )}
          </a>
        );
      })}
    </div>
  );
}

export function hasAnyBrandSocialLink(props: BrandSocialLinksProps): boolean {
  return [
    props.facebookLink,
    props.instagramLink,
    props.whatsappLink,
    props.linkedinLink,
    props.xLink,
    props.youtubeLink,
    props.tiktokLink,
    props.pinterestLink,
  ].some(isActive);
}

/** Header mobil üst şerit ikon alanlarından `iconImages` haritası. */
export function headerMobileSocialIconImages(props: {
  facebookIconMobile?: string;
  instagramIconMobile?: string;
  whatsappIconMobile?: string;
  linkedinIconMobile?: string;
  xIconMobile?: string;
  youtubeIconMobile?: string;
  tiktokIconMobile?: string;
  pinterestIconMobile?: string;
}): BrandSocialIconImages {
  return {
    facebook: props.facebookIconMobile?.trim() || undefined,
    instagram: props.instagramIconMobile?.trim() || undefined,
    whatsapp: props.whatsappIconMobile?.trim() || undefined,
    linkedin: props.linkedinIconMobile?.trim() || undefined,
    x: props.xIconMobile?.trim() || undefined,
    youtube: props.youtubeIconMobile?.trim() || undefined,
    tiktok: props.tiktokIconMobile?.trim() || undefined,
    pinterest: props.pinterestIconMobile?.trim() || undefined,
  };
}
