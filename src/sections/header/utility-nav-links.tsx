import { cn } from '../../lib/utils';

type LinkFields = {
  link1LabelName: string;
  link1: string;
  link1Icon: string;
  link1IconMobile: string;
  link1Position: 'left' | 'right';
  link2LabelName: string;
  link2: string;
  link2Icon: string;
  link2IconMobile: string;
  link2Position: 'left' | 'right';
  openLinksInNewTab: boolean;
};

function resolveLinkIcon(mobile: string, desktop: string): string {
  return mobile.trim() || desktop.trim();
}

function UtilityNavItem({
  label,
  href,
  icon,
  newTab,
  variant,
}: {
  label: string;
  href: string;
  icon: string;
  newTab: boolean;
  variant: 'bar' | 'menu';
}) {
  if (!label.trim() || !href.trim()) return null;

  if (variant === 'menu') {
    return (
      <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
      >
        {icon ? <img src={icon} alt="" className="size-4 shrink-0 object-contain" /> : null}
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className="inline-flex max-w-40 items-center gap-1.5 truncate text-xs leading-snug transition-opacity hover:opacity-80 md:max-w-none"
    >
      {icon ? <img src={icon} alt="" className="size-3.5 shrink-0 object-contain" /> : null}
      <span className="truncate">{label}</span>
    </a>
  );
}

/** Masaüstü üst şerit: link konumuna göre sol veya sağ sütun. */
export function UtilityBarSideLinks({
  side,
  link1LabelName,
  link1,
  link1Icon,
  link1Position,
  link2LabelName,
  link2,
  link2Icon,
  link2Position,
  openLinksInNewTab,
  className,
}: LinkFields & { side: 'left' | 'right'; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 md:gap-6', className)}>
      {link1Position === side ? (
        <UtilityNavItem label={link1LabelName} href={link1} icon={link1Icon} newTab={openLinksInNewTab} variant="bar" />
      ) : null}
      {link2Position === side ? (
        <UtilityNavItem label={link2LabelName} href={link2} icon={link2Icon} newTab={openLinksInNewTab} variant="bar" />
      ) : null}
    </div>
  );
}

/** Mobil yan menü: her iki link alt bölümde dikey. */
export function UtilityMenuLinks(props: LinkFields & { className?: string }) {
  const {
    link1LabelName,
    link1,
    link1Icon,
    link1IconMobile,
    link2LabelName,
    link2,
    link2Icon,
    link2IconMobile,
    openLinksInNewTab,
    className,
  } = props;

  const has1 = link1LabelName.trim() && link1.trim();
  const has2 = link2LabelName.trim() && link2.trim();
  if (!has1 && !has2) return null;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {has1 ? (
        <UtilityNavItem
          label={link1LabelName}
          href={link1}
          icon={resolveLinkIcon(link1IconMobile, link1Icon)}
          newTab={openLinksInNewTab}
          variant="menu"
        />
      ) : null}
      {has2 ? (
        <UtilityNavItem
          label={link2LabelName}
          href={link2}
          icon={resolveLinkIcon(link2IconMobile, link2Icon)}
          newTab={openLinksInNewTab}
          variant="menu"
        />
      ) : null}
    </div>
  );
}

export function hasAnyUtilityMenuLink(props: Pick<LinkFields, 'link1' | 'link2' | 'link1LabelName' | 'link2LabelName'>) {
  return (
    (props.link1LabelName.trim() && props.link1.trim()) ||
    (props.link2LabelName.trim() && props.link2.trim())
  );
}
