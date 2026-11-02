import { MenuIcon, SearchIcon, FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from '../../components/icons';
import { IconButton } from '../../components/ui/button';
import { Container } from '../../components/ui/container';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { useBreakpoint } from '../../hooks/use-media-query';
import { clamp, cn } from '../../lib/utils';
import { NavLinks } from './nav-links';
import type { MainRowProps } from './types';

const LOGO_WIDTH_WEB = { min: 25, max: 149 } as const;
const LOGO_WIDTH_MOBILE = { min: 25, max: 100 } as const;

function resolveLogoWidthPx(value: number, bounds: { min: number; max: number }) {
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return clamp(Math.round(value), bounds.min, bounds.max);
}

type SocialProps = {
  facebookLink: string;
  instagramLink: string;
  whatsappLink: string;
  linkedinLink: string;
  openSocialLinksInNewTab: boolean;
};

function HeaderLogo({
  logo,
  logoWidthWeb,
  logoWidthMobile,
  invertLogoColors,
  className,
}: {
  logo: string;
  logoWidthWeb: number;
  logoWidthMobile: number;
  invertLogoColors: boolean;
  className?: string;
}) {
  const isMd = useBreakpoint('md');
  const widthPx = isMd
    ? resolveLogoWidthPx(logoWidthWeb, LOGO_WIDTH_WEB)
    : resolveLogoWidthPx(logoWidthMobile, LOGO_WIDTH_MOBILE);

  if (!logo) {
    return <span className={cn('font-heading text-lg font-semibold tracking-tight', className)}>Mağaza</span>;
  }
  return (
    <a href="/" className={cn('inline-flex shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring', className)}>
      <img
        src={logo}
        alt="Mağaza"
        className={cn('h-auto max-w-full object-contain', invertLogoColors && 'invert')}
        style={widthPx ? { width: `${widthPx}px` } : undefined}
      />
    </a>
  );
}

function SearchButton() {
  return (
    <IconButton variant="ghost" size="sm" aria-label="Ara" asChild>
      <a href="/search">
        <SearchIcon />
      </a>
    </IconButton>
  );
}

function MobileControls(props: MainRowProps & { social: SocialProps }) {
  const { categories, page, menuOpen, onMenuOpenChange, social } = props;
  const close = () => onMenuOpenChange(false);
  const socialItems = [
    { href: social.facebookLink, label: 'Facebook', Icon: FacebookIcon },
    { href: social.instagramLink, label: 'Instagram', Icon: InstagramIcon },
    { href: social.whatsappLink, label: 'WhatsApp', Icon: WhatsAppIcon },
    { href: social.linkedinLink, label: 'LinkedIn', Icon: LinkedInIcon },
  ].filter((s) => s.href.trim());

  return (
    <div className="flex items-center gap-1">
      <SearchButton />
      <Sheet open={menuOpen} onOpenChange={onMenuOpenChange}>
        <SheetTrigger asChild>
          <IconButton variant="ghost" size="sm" aria-label="Menüyü aç">
            <MenuIcon />
          </IconButton>
        </SheetTrigger>
        <SheetContent side="right" size="sm" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Menü</SheetTitle>
          </SheetHeader>
          <SheetBody className="flex flex-1 flex-col gap-6">
            <NavLinks categories={categories} page={page} orientation="vertical" onNavigate={close} />
            {socialItems.length > 0 && (
              <div className="mt-auto flex gap-4 border-t pt-4">
                {socialItems.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={social.openSocialLinksInNewTab ? '_blank' : undefined}
                    rel={social.openSocialLinksInNewTab ? 'noopener noreferrer' : undefined}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MobileMainBar(props: MainRowProps & { social: SocialProps }) {
  const logoProps = {
    logo: props.logo,
    logoWidthWeb: props.logoWidthWeb,
    logoWidthMobile: props.logoWidthMobile,
    invertLogoColors: props.invertLogoColors,
  };
  return (
    <div className="flex items-center justify-between gap-3 py-3 md:hidden">
      <HeaderLogo {...logoProps} className="min-w-0 max-w-[70%]" />
      <MobileControls {...props} social={props.social} />
    </div>
  );
}

type BottomNavRowProps = Pick<MainRowProps, 'categories' | 'page'> & {
  /** false: yalnızca ortalanmış menü (arama üst satırda). */
  showSearch?: boolean;
};

/** Alt satır: menü ortada; isteğe bağlı arama sağ sütunda. */
function BottomNavRow({ categories, page, showSearch = true }: BottomNavRowProps) {
  if (!showSearch) {
    return (
      <div className="hidden border-t border-border md:flex md:justify-center md:py-3 lg:py-4">
        <NavLinks categories={categories} page={page} />
      </div>
    );
  }

  return (
    <div className="hidden border-t border-border md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:py-3 lg:py-4">
      <div aria-hidden />
      <NavLinks categories={categories} page={page} className="justify-self-center" />
      <div className="justify-self-end">
        <SearchButton />
      </div>
    </div>
  );
}

export function MainRow(props: MainRowProps & { social: SocialProps }) {
  const { layout, logo, logoWidthWeb, logoWidthMobile, invertLogoColors, categories, page } = props;
  const logoProps = { logo, logoWidthWeb, logoWidthMobile, invertLogoColors };

  if (layout === 'logoLeftMenuCenter') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container className="py-3 md:py-4">
          <MobileMainBar {...props} social={props.social} />
          <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-4 md:grid">
            <HeaderLogo {...logoProps} />
            <NavLinks categories={categories} page={page} className="justify-self-center" />
            <SearchButton />
          </div>
        </Container>
      </div>
    );
  }

  if (layout === 'logoLeftMenuLeft') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container className="flex items-center gap-3 py-3 md:py-4">
          <HeaderLogo {...logoProps} />
          <ScrollArea orientation="horizontal" hideScrollbar className="hidden min-w-0 flex-1 md:block">
            <NavLinks categories={categories} page={page} className="w-max gap-4 lg:gap-6" />
          </ScrollArea>
          <div className="hidden md:block">
            <SearchButton />
          </div>
          <div className="ml-auto md:hidden">
            <MobileControls {...props} social={props.social} />
          </div>
        </Container>
      </div>
    );
  }

  if (layout === 'logoCenterMenuLeft') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container className="py-3 md:py-4">
          <MobileMainBar {...props} social={props.social} />
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
            <NavLinks categories={categories} page={page} className="justify-self-start" />
            <HeaderLogo {...logoProps} className="justify-self-center" />
            <div className="justify-self-end">
              <SearchButton />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (layout === 'logoCenterMenuBelow') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container>
          <MobileMainBar {...props} social={props.social} />
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:py-4 lg:py-6">
            <div aria-hidden />
            <HeaderLogo {...logoProps} className="justify-self-center" />
            <div className="justify-self-end">
              <SearchButton />
            </div>
          </div>
          <BottomNavRow categories={categories} page={page} showSearch={false} />
        </Container>
      </div>
    );
  }

  if (layout === 'logoLeftMenuBelow') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container>
          <MobileMainBar {...props} social={props.social} />
          <div className="hidden items-center justify-between gap-4 py-6 md:flex md:py-8">
            <HeaderLogo {...logoProps} />
            <SearchButton />
          </div>
          <BottomNavRow categories={categories} page={page} showSearch={false} />
        </Container>
      </div>
    );
  }

  return null;
}
