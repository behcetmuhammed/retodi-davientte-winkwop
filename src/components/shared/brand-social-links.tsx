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
}: BrandSocialLinksProps) {
  const items = [
    { href: facebookLink, label: 'Facebook', Icon: FacebookIcon },
    { href: instagramLink, label: 'Instagram', Icon: InstagramIcon },
    { href: whatsappLink, label: 'WhatsApp', Icon: WhatsAppIcon },
    { href: linkedinLink, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: xLink, label: 'X', Icon: XBrandIcon },
    { href: youtubeLink, label: 'YouTube', Icon: YouTubeIcon },
    { href: tiktokLink, label: 'TikTok', Icon: TikTokIcon },
    { href: pinterestLink, label: 'Pinterest', Icon: PinterestIcon },
  ].filter((item) => isActive(item.href));

  if (items.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href!.trim()}
          aria-label={label}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className="transition-opacity hover:opacity-80"
        >
          <Icon className={iconClassName} />
        </a>
      ))}
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
