import type { HeaderProps, WinkwopLink, WinkwopPageContext } from '../../generated/types';

export type HeaderLayout = HeaderProps['headerLayout'];

export type UtilityBarProps = Pick<
  HeaderProps,
  | 'link1LabelName'
  | 'link1'
  | 'link1Icon'
  | 'link1Position'
  | 'link2LabelName'
  | 'link2'
  | 'link2Icon'
  | 'link2Position'
  | 'openLinksInNewTab'
  | 'facebookLink'
  | 'instagramLink'
  | 'whatsappLink'
  | 'linkedinLink'
  | 'openSocialLinksInNewTab'
  | 'text1'
  | 'text2'
  | 'text3'
  | 'backgroundColor'
  | 'textAndIconColor'
>;

export type MainRowProps = {
  layout: HeaderLayout;
  logo: string;
  logoWidthWeb: number;
  logoWidthMobile: number;
  invertLogoColors: boolean;
  categories: WinkwopLink[];
  page: WinkwopPageContext;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
};

export type NavLinksProps = {
  categories: WinkwopLink[];
  page: WinkwopPageContext;
  className?: string;
  /** Mobil menüde dikey liste. */
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
};
