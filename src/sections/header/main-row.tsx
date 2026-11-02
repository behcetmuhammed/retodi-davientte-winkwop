import { MenuIcon, SearchIcon } from '../../components/icons';
import { IconButton } from '../../components/ui/button';
import { Container } from '../../components/ui/container';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { useBreakpoint } from '../../hooks/use-media-query';
import { clamp, cn } from '../../lib/utils';
import { NavLinks } from './nav-links';
import type { MainRowProps } from './types';
import { hasAnyUtilityMenuLink, UtilityMenuLinks } from './utility-nav-links';

const LOGO_WIDTH_WEB = { min: 25, max: 149 } as const;
const LOGO_WIDTH_MOBILE = { min: 25, max: 100 } as const;

function resolveLogoWidthPx(value: number, bounds: { min: number; max: number }) {
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return clamp(Math.round(value), bounds.min, bounds.max);
}

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

function MobileMenuSheet(props: MainRowProps) {
  const { categories, page, menuOpen, onMenuOpenChange } = props;
  const close = () => onMenuOpenChange(false);
  const utilityLinks = {
    link1LabelName: props.link1LabelName,
    link1: props.link1,
    link1Icon: props.link1Icon,
    link1IconMobile: props.link1IconMobile,
    link1Position: props.link1Position,
    link2LabelName: props.link2LabelName,
    link2: props.link2,
    link2Icon: props.link2Icon,
    link2IconMobile: props.link2IconMobile,
    link2Position: props.link2Position,
    openLinksInNewTab: props.openLinksInNewTab,
  };
  const showUtilityFooter = hasAnyUtilityMenuLink(utilityLinks);

  return (
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
          {showUtilityFooter ? (
            <div className="mt-auto border-t border-border pt-4">
              <UtilityMenuLinks {...utilityLinks} />
            </div>
          ) : null}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

function MobileLeadingIcons() {
  return (
    <div data-slot="header-mobile-leading" className="flex items-center gap-1 justify-self-start">
      <SearchButton />
    </div>
  );
}

function MobileTrailingActions(props: MainRowProps) {
  return (
    <div className="flex items-center gap-1">
      <SearchButton />
      <MobileMenuSheet {...props} />
    </div>
  );
}

function MobileHeaderBar(props: MainRowProps) {
  const logoProps = {
    logo: props.logo,
    logoWidthWeb: props.logoWidthWeb,
    logoWidthMobile: props.logoWidthMobile,
    invertLogoColors: props.invertLogoColors,
  };
  const centerLogo = props.mobileHeaderLayout === 'leadingIconsCenterLogo';

  if (centerLogo) {
    return (
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 md:hidden">
        <MobileLeadingIcons />
        <HeaderLogo {...logoProps} className="max-w-[min(100%,12rem)] justify-self-center" />
        <div className="flex justify-end justify-self-end">
          <MobileMenuSheet {...props} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 md:hidden">
      <HeaderLogo {...logoProps} className="min-w-0 max-w-[70%]" />
      <MobileTrailingActions {...props} />
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

export function MainRow(props: MainRowProps) {
  const { layout, logo, logoWidthWeb, logoWidthMobile, invertLogoColors, categories, page } = props;
  const logoProps = { logo, logoWidthWeb, logoWidthMobile, invertLogoColors };

  if (layout === 'logoLeftMenuCenter') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container className="py-3 md:py-4">
          <MobileHeaderBar {...props} />
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
        <Container className="md:py-4">
          <MobileHeaderBar {...props} />
          <div className="hidden items-center gap-3 md:flex">
            <HeaderLogo {...logoProps} />
            <ScrollArea orientation="horizontal" hideScrollbar className="min-w-0 flex-1">
              <NavLinks categories={categories} page={page} className="w-max gap-4 lg:gap-6" />
            </ScrollArea>
            <SearchButton />
          </div>
        </Container>
      </div>
    );
  }

  if (layout === 'logoCenterMenuLeft') {
    return (
      <div data-slot="header-main" className="border-b border-border bg-background text-foreground">
        <Container className="py-3 md:py-4">
          <MobileHeaderBar {...props} />
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
          <MobileHeaderBar {...props} />
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
          <MobileHeaderBar {...props} />
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
