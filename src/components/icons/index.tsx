/**
 * Kitin ikon seti.
 *
 * Derleme sunucusu `lucide-react` paketini kabul etmediği için ikonlar burada
 * SVG bileşeni olarak tutulur. Çizimler Lucide'dan alınmıştır
 * (ISC lisansı, https://lucide.dev). Marka ikonları `brands.tsx` içindedir
 * (Simple Icons, CC0).
 *
 * Yeni ikon eklemek için Lucide sayfasındaki SVG'nin alt öğelerini çevirin:
 *   <path d="…" />                  → p('…')
 *   <circle cx cy r />              → c(cx, cy, r)
 *   <rect x y width height rx ry /> → r(x, y, width, height, rx, ry)
 *   <line x1 y1 x2 y2 />            → l(x1, y1, x2, y2)
 *   <polyline points="…" />         → pl('…')
 *   <polygon points="…" />          → pg('…')
 *   <ellipse cx cy rx ry />         → e(cx, cy, rx, ry)
 *
 * @example
 * export const HeartIcon = createIcon('HeartIcon', [p('M2 9.5a5.5 5.5 0 0 1 …')]);
 * <HeartIcon className="size-4 text-muted-foreground" />
 */
import type { SVGProps } from 'react';
import { cn } from '../../lib/utils';

type IconElement =
  | ['path', { d: string }]
  | ['circle', { cx: number; cy: number; r: number }]
  | ['rect', { x: number; y: number; width: number; height: number; rx?: number; ry?: number }]
  | ['line', { x1: number; y1: number; x2: number; y2: number }]
  | ['polyline', { points: string }]
  | ['polygon', { points: string }]
  | ['ellipse', { cx: number; cy: number; rx: number; ry: number }];

type IconNode = IconElement[];

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string };

/* @__NO_SIDE_EFFECTS__ */
function createIcon(name: string, nodes: IconNode) {
  function Icon({ size = 24, strokeWidth = 2, className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props['aria-label'] ? undefined : true}
        className={cn('shrink-0', className)}
        {...props}
      >
        {nodes.map(([Tag, attrs], i) => (
          <Tag key={i} {...(attrs as Record<string, unknown>)} />
        ))}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

const p = (d: string): IconElement => ['path', { d }];
const c = (cx: number, cy: number, r: number): IconElement => ['circle', { cx, cy, r }];
const r = (x: number, y: number, width: number, height: number, rx?: number, ry?: number): IconElement => [
  'rect',
  { x, y, width, height, rx, ry },
];
const l = (x1: number, y1: number, x2: number, y2: number): IconElement => ['line', { x1, y1, x2, y2 }];
const pl = (points: string): IconElement => ['polyline', { points }];
const pg = (points: string): IconElement => ['polygon', { points }];
const e = (cx: number, cy: number, rx: number, ry: number): IconElement => ['ellipse', { cx, cy, rx, ry }];

export const CheckIcon = createIcon('CheckIcon', [p('M20 6 9 17l-5-5')]);
export const XIcon = createIcon('XIcon', [p('M18 6 6 18'), p('m6 6 12 12')]);
export const ChevronDownIcon = createIcon('ChevronDownIcon', [p('m6 9 6 6 6-6')]);
export const ChevronUpIcon = createIcon('ChevronUpIcon', [p('m18 15-6-6-6 6')]);
export const ChevronLeftIcon = createIcon('ChevronLeftIcon', [p('m15 18-6-6 6-6')]);
export const ChevronRightIcon = createIcon('ChevronRightIcon', [p('m9 18 6-6-6-6')]);
export const ChevronsUpDownIcon = createIcon('ChevronsUpDownIcon', [p('m7 15 5 5 5-5'), p('m7 9 5-5 5 5')]);
export const ChevronsLeftIcon = createIcon('ChevronsLeftIcon', [p('m11 17-5-5 5-5'), p('m18 17-5-5 5-5')]);
export const ChevronsRightIcon = createIcon('ChevronsRightIcon', [p('m6 17 5-5-5-5'), p('m13 17 5-5-5-5')]);
export const SearchIcon = createIcon('SearchIcon', [c(11, 11, 8), p('m21 21-4.3-4.3')]);
export const PlusIcon = createIcon('PlusIcon', [p('M5 12h14'), p('M12 5v14')]);
export const MinusIcon = createIcon('MinusIcon', [p('M5 12h14')]);
export const MoreHorizontalIcon = createIcon('MoreHorizontalIcon', [c(12, 12, 1), c(19, 12, 1), c(5, 12, 1)]);
export const CalendarIcon = createIcon('CalendarIcon', [p('M8 2v4'), p('M16 2v4'), r(3, 4, 18, 18, 2), p('M3 10h18')]);
export const StarIcon = createIcon('StarIcon', [p('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z')]);
export const InfoIcon = createIcon('InfoIcon', [c(12, 12, 10), p('M12 16v-4'), p('M12 8h.01')]);
export const CircleAlertIcon = createIcon('CircleAlertIcon', [c(12, 12, 10), p('M12 8v4'), p('M12 16h.01')]);
export const TriangleAlertIcon = createIcon('TriangleAlertIcon', [
  p('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'),
  p('M12 9v4'),
  p('M12 17h.01'),
]);
export const CircleCheckIcon = createIcon('CircleCheckIcon', [c(12, 12, 10), p('m9 12 2 2 4-4')]);
export const CircleXIcon = createIcon('CircleXIcon', [c(12, 12, 10), p('m15 9-6 6'), p('m9 9 6 6')]);
export const LoaderIcon = createIcon('LoaderIcon', [p('M21 12a9 9 0 1 1-6.219-8.56')]);
export const UploadIcon = createIcon('UploadIcon', [p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), p('M17 8l-5-5-5 5'), p('M12 3v12')]);
export const ImageIcon = createIcon('ImageIcon', [r(3, 3, 18, 18, 2), c(9, 9, 2), p('m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21')]);
export const CopyIcon = createIcon('CopyIcon', [r(8, 8, 14, 14, 2), p('M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2')]);
export const SunIcon = createIcon('SunIcon', [
  c(12, 12, 4),
  p('M12 2v2'),
  p('M12 20v2'),
  p('m4.93 4.93 1.41 1.41'),
  p('m17.66 17.66 1.41 1.41'),
  p('M2 12h2'),
  p('M20 12h2'),
  p('m6.34 17.66-1.41 1.41'),
  p('m19.07 4.93-1.41 1.41'),
]);
export const MoonIcon = createIcon('MoonIcon', [p('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z')]);
export const MenuIcon = createIcon('MenuIcon', [p('M4 12h16'), p('M4 6h16'), p('M4 18h16')]);
export const PanelLeftIcon = createIcon('PanelLeftIcon', [r(3, 3, 18, 18, 2), p('M9 3v18')]);
export const GripVerticalIcon = createIcon('GripVerticalIcon', [c(9, 12, 1), c(9, 5, 1), c(9, 19, 1), c(15, 12, 1), c(15, 5, 1), c(15, 19, 1)]);
export const ArrowUpDownIcon = createIcon('ArrowUpDownIcon', [p('m21 16-4 4-4-4'), p('M17 20V4'), p('m3 8 4-4 4 4'), p('M7 4v16')]);
export const ArrowUpIcon = createIcon('ArrowUpIcon', [p('m5 12 7-7 7 7'), p('M12 19V5')]);
export const ArrowDownIcon = createIcon('ArrowDownIcon', [p('M12 5v14'), p('m19 12-7 7-7-7')]);
export const TrendingUpIcon = createIcon('TrendingUpIcon', [p('M22 7 13.5 15.5 8.5 10.5 2 17'), p('M16 7h6v6')]);
export const TrendingDownIcon = createIcon('TrendingDownIcon', [p('M22 17 13.5 8.5 8.5 13.5 2 7'), p('M16 17h6v-6')]);
export const FileIcon = createIcon('FileIcon', [p('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'), p('M14 2v4a2 2 0 0 0 2 2h4')]);
export const TrashIcon = createIcon('TrashIcon', [p('M3 6h18'), p('M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'), p('M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2')]);
export const BoldIcon = createIcon('BoldIcon', [p('M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8')]);
export const ItalicIcon = createIcon('ItalicIcon', [p('M19 4h-9'), p('M14 20H5'), p('M15 4 9 20')]);
export const UnderlineIcon = createIcon('UnderlineIcon', [p('M6 4v6a6 6 0 0 0 12 0V4'), p('M4 20h16')]);
export const ListIcon = createIcon('ListIcon', [p('M3 12h.01'), p('M3 18h.01'), p('M3 6h.01'), p('M8 12h13'), p('M8 18h13'), p('M8 6h13')]);
export const ListOrderedIcon = createIcon('ListOrderedIcon', [
  p('M10 12h11'),
  p('M10 18h11'),
  p('M10 6h11'),
  p('M4 10h2'),
  p('M4 6h1v4'),
  p('M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'),
]);
export const LinkIcon = createIcon('LinkIcon', [
  p('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'),
  p('M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'),
]);
export const HeadingIcon = createIcon('HeadingIcon', [p('M4 12h8'), p('M4 18V6'), p('M12 18V6'), p('M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1')]);
export const UndoIcon = createIcon('UndoIcon', [p('M9 14 4 9l5-5'), p('M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11')]);
export const RedoIcon = createIcon('RedoIcon', [p('m15 14 5-5-5-5'), p('M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13')]);
export const InboxIcon = createIcon('InboxIcon', [
  p('M22 12h-6l-2 3h-4l-2-3H2'),
  p('M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'),
]);
export const RefreshIcon = createIcon('RefreshIcon', [
  p('M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'),
  p('M21 3v5h-5'),
  p('M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16'),
  p('M8 16H3v5'),
]);
export const RotateCwIcon = createIcon('RotateCwIcon', [p('M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8'), p('M21 3v5h-5')]);
export const EyeIcon = createIcon('EyeIcon', [p('M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'), c(12, 12, 3)]);
export const EyeOffIcon = createIcon('EyeOffIcon', [
  p('M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49'),
  p('M14.084 14.158a3 3 0 0 1-4.242-4.242'),
  p('M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143'),
  p('m2 2 20 20'),
]);
export const UserIcon = createIcon('UserIcon', [p('M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'), c(12, 7, 4)]);
export const LogOutIcon = createIcon('LogOutIcon', [p('m16 17 5-5-5-5'), p('M21 12H9'), p('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4')]);
export const SettingsIcon = createIcon('SettingsIcon', [p('M20 7h-9'), p('M14 17H5'), c(17, 17, 3), c(7, 7, 3)]);
export const FilterIcon = createIcon('FilterIcon', [p('M3 6h18'), p('M7 12h10'), p('M10 18h4')]);
export const CropIcon = createIcon('CropIcon', [p('M6 2v14a2 2 0 0 0 2 2h14'), p('M18 22V8a2 2 0 0 0-2-2H2')]);
export const HomeIcon = createIcon('HomeIcon', [
  p('M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'),
  p('M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
]);
export const BellIcon = createIcon('BellIcon', [
  p('M10.268 21a2 2 0 0 0 3.464 0'),
  p('M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'),
]);
export const ShoppingBagIcon = createIcon('ShoppingBagIcon', [p('M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z'), p('M3 6h18'), p('M16 10a4 4 0 0 1-8 0')]);

// E-ticaret
export const ShoppingCartIcon = createIcon('ShoppingCartIcon', [
  p('m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18'),
  p('M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25'),
  c(18, 20, 2),
  c(8, 20, 2),
]);
export const ShoppingBasketIcon = createIcon('ShoppingBasketIcon', [
  p('m15 11-1 9'),
  p('m19 11-4-7'),
  p('M2 11h20'),
  p('m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4'),
  p('M4.5 15.5h15'),
  p('m5 11 4-7'),
  p('m9 11 1 9'),
]);
export const StoreIcon = createIcon('StoreIcon', [
  p('M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5'),
  p('M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244'),
  p('M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05'),
]);
export const PackageIcon = createIcon('PackageIcon', [
  p('M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z'),
  p('M12 22V12'),
  pl('3.29 7 12 12 20.71 7'),
  p('m7.5 4.27 9 5.15'),
]);
export const PackageCheckIcon = createIcon('PackageCheckIcon', [
  p('M12 22V12'),
  p('m16 17 2 2 4-4'),
  p('M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753'),
  p('M3.29 7 12 12l8.71-5'),
  p('m7.5 4.27 8.997 5.148'),
]);
export const TruckIcon = createIcon('TruckIcon', [
  p('M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'),
  p('M15 18H9'),
  p('M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'),
  c(17, 18, 2),
  c(7, 18, 2),
]);
export const CreditCardIcon = createIcon('CreditCardIcon', [r(2, 5, 20, 14, 2), l(2, 10, 22, 10), p('M6 14h2')]);
export const WalletIcon = createIcon('WalletIcon', [
  p('M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1'),
  p('M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'),
]);
export const ReceiptIcon = createIcon('ReceiptIcon', [
  p('M12 17V7'),
  p('M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8'),
  p('M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z'),
]);
export const TagIcon = createIcon('TagIcon', [
  p('M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z'),
  c(7.5, 7.5, 0.5),
]);
export const TagsIcon = createIcon('TagsIcon', [
  p('M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z'),
  p('M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193'),
  c(10.5, 6.5, 0.5),
]);
export const PercentIcon = createIcon('PercentIcon', [l(19, 5, 5, 19), c(6.5, 6.5, 2.5), c(17.5, 17.5, 2.5)]);
export const BadgePercentIcon = createIcon('BadgePercentIcon', [
  p('M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z'),
  p('m15 9-6 6'),
  p('M9 9h.01'),
  p('M15 15h.01'),
]);
export const GiftIcon = createIcon('GiftIcon', [
  p('M12 7v14'),
  p('M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8'),
  p('M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5'),
  r(3, 7, 18, 4, 1),
]);
export const HeartIcon = createIcon('HeartIcon', [
  p('M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5'),
]);
export const BookmarkIcon = createIcon('BookmarkIcon', [
  p('M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z'),
]);
export const BarcodeIcon = createIcon('BarcodeIcon', [p('M3 5v14'), p('M8 5v14'), p('M12 5v14'), p('M17 5v14'), p('M21 5v14')]);
export const ScanLineIcon = createIcon('ScanLineIcon', [
  p('M3 7V5a2 2 0 0 1 2-2h2'),
  p('M17 3h2a2 2 0 0 1 2 2v2'),
  p('M21 17v2a2 2 0 0 1-2 2h-2'),
  p('M7 21H5a2 2 0 0 1-2-2v-2'),
  p('M7 12h10'),
]);
export const RulerIcon = createIcon('RulerIcon', [
  p('M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z'),
  p('m14.5 12.5 2-2'),
  p('m11.5 9.5 2-2'),
  p('m8.5 6.5 2-2'),
  p('m17.5 15.5 2-2'),
]);
export const BoxIcon = createIcon('BoxIcon', [
  p('M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z'),
  p('m3.3 7 8.7 5 8.7-5'),
  p('M12 22V12'),
]);

// İletişim ve konum
export const PhoneIcon = createIcon('PhoneIcon', [
  p('M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384'),
]);
export const MailIcon = createIcon('MailIcon', [p('m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7'), r(2, 4, 20, 16, 2)]);
export const MessageCircleIcon = createIcon('MessageCircleIcon', [
  p('M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719'),
]);
export const MessageSquareIcon = createIcon('MessageSquareIcon', [
  p('M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z'),
]);
export const SendIcon = createIcon('SendIcon', [
  p('M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'),
  p('m21.854 2.147-10.94 10.939'),
]);
export const MapPinIcon = createIcon('MapPinIcon', [
  p('M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'),
  c(12, 10, 3),
]);
export const MapIcon = createIcon('MapIcon', [
  p('M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z'),
  p('M15 5.764v15'),
  p('M9 3.236v15'),
]);
export const NavigationIcon = createIcon('NavigationIcon', [pg('3 11 22 2 13 21 11 13 3 11')]);
export const GlobeIcon = createIcon('GlobeIcon', [c(12, 12, 10), p('M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'), p('M2 12h20')]);
export const ClockIcon = createIcon('ClockIcon', [c(12, 12, 10), p('M12 6v6l4 2')]);
export const HeadphonesIcon = createIcon('HeadphonesIcon', [
  p('M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3'),
]);
export const BuildingIcon = createIcon('BuildingIcon', [
  p('M12 10h.01'),
  p('M12 14h.01'),
  p('M12 6h.01'),
  p('M16 10h.01'),
  p('M16 14h.01'),
  p('M16 6h.01'),
  p('M8 10h.01'),
  p('M8 14h.01'),
  p('M8 6h.01'),
  p('M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3'),
  r(4, 2, 16, 20, 2),
]);
export const Building2Icon = createIcon('Building2Icon', [
  p('M10 12h4'),
  p('M10 8h4'),
  p('M14 21v-3a2 2 0 0 0-4 0v3'),
  p('M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2'),
  p('M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16'),
]);

// Kullanıcı ve hesap
export const UsersIcon = createIcon('UsersIcon', [
  p('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'),
  p('M16 3.128a4 4 0 0 1 0 7.744'),
  p('M22 21v-2a4 4 0 0 0-3-3.87'),
  c(9, 7, 4),
]);
export const UserPlusIcon = createIcon('UserPlusIcon', [
  p('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'),
  c(9, 7, 4),
  l(19, 8, 19, 14),
  l(22, 11, 16, 11),
]);
export const UserCheckIcon = createIcon('UserCheckIcon', [p('m16 11 2 2 4-4'), p('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'), c(9, 7, 4)]);
export const CircleUserIcon = createIcon('CircleUserIcon', [c(12, 12, 10), c(12, 10, 3), p('M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662')]);
export const LogInIcon = createIcon('LogInIcon', [p('m10 17 5-5-5-5'), p('M15 12H3'), p('M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4')]);
export const LockIcon = createIcon('LockIcon', [r(3, 11, 18, 11, 2), p('M7 11V7a5 5 0 0 1 10 0v4')]);
export const UnlockIcon = createIcon('UnlockIcon', [r(3, 11, 18, 11, 2), p('M7 11V7a5 5 0 0 1 9.9-1')]);
export const KeyRoundIcon = createIcon('KeyRoundIcon', [
  p('M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'),
  c(16.5, 7.5, 0.5),
]);
export const ShieldCheckIcon = createIcon('ShieldCheckIcon', [
  p('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'),
  p('m9 12 2 2 4-4'),
]);
export const FingerprintIcon = createIcon('FingerprintIcon', [
  p('M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4'),
  p('M14 13.12c0 2.38 0 6.38-1 8.88'),
  p('M17.29 21.02c.12-.6.43-2.3.5-3.02'),
  p('M2 12a10 10 0 0 1 18-6'),
  p('M2 16h.01'),
  p('M21.8 16c.2-2 .131-5.354 0-6'),
  p('M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2'),
  p('M8.65 22c.21-.66.45-1.32.57-2'),
  p('M9 6.8a6 6 0 0 1 9 5.2v2'),
]);

// Navigasyon ve yön
export const ArrowLeftIcon = createIcon('ArrowLeftIcon', [p('m12 19-7-7 7-7'), p('M19 12H5')]);
export const ArrowRightIcon = createIcon('ArrowRightIcon', [p('M5 12h14'), p('m12 5 7 7-7 7')]);
export const ArrowUpRightIcon = createIcon('ArrowUpRightIcon', [p('M7 7h10v10'), p('M7 17 17 7')]);
export const ExternalLinkIcon = createIcon('ExternalLinkIcon', [
  p('M15 3h6v6'),
  p('M10 14 21 3'),
  p('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'),
]);
export const ChevronFirstIcon = createIcon('ChevronFirstIcon', [p('m17 18-6-6 6-6'), p('M7 6v12')]);
export const ChevronLastIcon = createIcon('ChevronLastIcon', [p('m7 18 6-6-6-6'), p('M17 6v12')]);
export const CornerDownLeftIcon = createIcon('CornerDownLeftIcon', [p('M20 4v7a4 4 0 0 1-4 4H4'), p('m9 10-5 5 5 5')]);
export const MoveRightIcon = createIcon('MoveRightIcon', [p('M18 8L22 12L18 16'), p('M2 12H22')]);

// Eylemler
export const PencilIcon = createIcon('PencilIcon', [
  p('M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'),
  p('m15 5 4 4'),
]);
export const SquarePenIcon = createIcon('SquarePenIcon', [
  p('M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'),
  p('M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z'),
]);
export const SaveIcon = createIcon('SaveIcon', [
  p('M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z'),
  p('M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7'),
  p('M7 3v4a1 1 0 0 0 1 1h7'),
]);
export const DownloadIcon = createIcon('DownloadIcon', [p('M12 15V3'), p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), p('m7 10 5 5 5-5')]);
export const ShareIcon = createIcon('ShareIcon', [p('M12 2v13'), p('m16 6-4-4-4 4'), p('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8')]);
export const Share2Icon = createIcon('Share2Icon', [
  c(18, 5, 3),
  c(6, 12, 3),
  c(18, 19, 3),
  l(8.59, 13.51, 15.42, 17.49),
  l(15.41, 6.51, 8.59, 10.49),
]);
export const PrinterIcon = createIcon('PrinterIcon', [
  p('M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2'),
  p('M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6'),
  r(6, 14, 12, 8, 1),
]);
export const ArchiveIcon = createIcon('ArchiveIcon', [r(2, 3, 20, 5, 1), p('M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8'), p('M10 12h4')]);
export const BanIcon = createIcon('BanIcon', [c(12, 12, 10), p('M4.929 4.929 19.07 19.071')]);
export const CirclePlusIcon = createIcon('CirclePlusIcon', [c(12, 12, 10), p('M8 12h8'), p('M12 8v8')]);
export const CircleMinusIcon = createIcon('CircleMinusIcon', [c(12, 12, 10), p('M8 12h8')]);
export const MaximizeIcon = createIcon('MaximizeIcon', [
  p('M8 3H5a2 2 0 0 0-2 2v3'),
  p('M21 8V5a2 2 0 0 0-2-2h-3'),
  p('M3 16v3a2 2 0 0 0 2 2h3'),
  p('M16 21h3a2 2 0 0 0 2-2v-3'),
]);
export const MinimizeIcon = createIcon('MinimizeIcon', [
  p('M8 3v3a2 2 0 0 1-2 2H3'),
  p('M21 8h-3a2 2 0 0 1-2-2V3'),
  p('M3 16h3a2 2 0 0 1 2 2v3'),
  p('M16 21v-3a2 2 0 0 1 2-2h3'),
]);
export const ZoomInIcon = createIcon('ZoomInIcon', [c(11, 11, 8), l(21, 21, 16.65, 16.65), l(11, 8, 11, 14), l(8, 11, 14, 11)]);
export const ZoomOutIcon = createIcon('ZoomOutIcon', [c(11, 11, 8), l(21, 21, 16.65, 16.65), l(8, 11, 14, 11)]);
export const SlidersHorizontalIcon = createIcon('SlidersHorizontalIcon', [
  p('M10 5H3'),
  p('M12 19H3'),
  p('M14 3v4'),
  p('M16 17v4'),
  p('M21 12h-9'),
  p('M21 19h-5'),
  p('M21 5h-7'),
  p('M8 10v4'),
  p('M8 12H3'),
]);
export const LayoutGridIcon = createIcon('LayoutGridIcon', [r(3, 3, 7, 7, 1), r(14, 3, 7, 7, 1), r(14, 14, 7, 7, 1), r(3, 14, 7, 7, 1)]);
export const LayoutListIcon = createIcon('LayoutListIcon', [
  r(3, 3, 7, 7, 1),
  r(3, 14, 7, 7, 1),
  p('M14 4h7'),
  p('M14 9h7'),
  p('M14 15h7'),
  p('M14 20h7'),
]);
export const ColumnsIcon = createIcon('ColumnsIcon', [r(3, 3, 18, 18, 2), p('M12 3v18')]);
export const RowsIcon = createIcon('RowsIcon', [r(3, 3, 18, 18, 2), p('M3 12h18')]);
export const CogIcon = createIcon('CogIcon', [
  p('M11 10.27 7 3.34'),
  p('m11 13.73-4 6.93'),
  p('M12 22v-2'),
  p('M12 2v2'),
  p('M14 12h8'),
  p('m17 20.66-1-1.73'),
  p('m17 3.34-1 1.73'),
  p('M2 12h2'),
  p('m20.66 17-1.73-1'),
  p('m20.66 7-1.73 1'),
  p('m3.34 17 1.73-1'),
  p('m3.34 7 1.73 1'),
  c(12, 12, 2),
  c(12, 12, 8),
]);

// Durum ve geri bildirim
export const CircleHelpIcon = createIcon('CircleHelpIcon', [c(12, 12, 10), p('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'), p('M12 17h.01')]);
export const ThumbsUpIcon = createIcon('ThumbsUpIcon', [
  p('M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z'),
  p('M7 10v12'),
]);
export const ThumbsDownIcon = createIcon('ThumbsDownIcon', [
  p('M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z'),
  p('M17 14V2'),
]);
export const SparklesIcon = createIcon('SparklesIcon', [
  p('M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'),
  p('M20 2v4'),
  p('M22 4h-4'),
  c(4, 20, 2),
]);
export const ZapIcon = createIcon('ZapIcon', [
  p('M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z'),
]);
export const AwardIcon = createIcon('AwardIcon', [
  p('m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526'),
  c(12, 8, 6),
]);
export const BadgeCheckIcon = createIcon('BadgeCheckIcon', [
  p('M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z'),
  p('m16 9-5.5 5.5L8 12'),
]);
export const FlagIcon = createIcon('FlagIcon', [
  p('M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528'),
]);
export const ActivityIcon = createIcon('ActivityIcon', [
  p('M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2'),
]);
export const LoaderCircleIcon = createIcon('LoaderCircleIcon', [p('M21 12a9 9 0 1 1-6.219-8.56')]);

// Medya ve içerik
export const CameraIcon = createIcon('CameraIcon', [
  p('M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z'),
  c(12, 13, 3),
]);
export const VideoIcon = createIcon('VideoIcon', [
  p('m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5'),
  r(2, 6, 14, 12, 2),
]);
export const PlayIcon = createIcon('PlayIcon', [p('M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z')]);
export const PauseIcon = createIcon('PauseIcon', [r(14, 3, 5, 18, 1), r(5, 3, 5, 18, 1)]);
export const Volume2Icon = createIcon('Volume2Icon', [
  p('M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'),
  p('M16 9a5 5 0 0 1 0 6'),
  p('M19.364 18.364a9 9 0 0 0 0-12.728'),
]);
export const VolumeXIcon = createIcon('VolumeXIcon', [
  p('M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z'),
  p('m16.5 14.5 5-5'),
  p('m16.5 9.5 5 5'),
]);
export const FileTextIcon = createIcon('FileTextIcon', [
  p('M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'),
  p('M14 2v5a1 1 0 0 0 1 1h5'),
  p('M10 9H8'),
  p('M16 13H8'),
  p('M16 17H8'),
]);
export const FolderIcon = createIcon('FolderIcon', [
  p('M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'),
]);
export const PaperclipIcon = createIcon('PaperclipIcon', [
  p('m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551'),
]);
export const CalendarDaysIcon = createIcon('CalendarDaysIcon', [
  p('M8 2v3'),
  p('M16 2v3'),
  r(3, 3, 18, 18, 2),
  p('M3 9h18'),
  p('M8 13h.01'),
  p('M12 13h.01'),
  p('M16 13h.01'),
  p('M8 17h.01'),
  p('M12 17h.01'),
  p('M16 17h.01'),
]);
export const CalendarCheckIcon = createIcon('CalendarCheckIcon', [p('M8 2v3'), p('M16 2v3'), r(3, 3, 18, 18, 2), p('M3 9h18'), p('m9 15 2 2 4-4')]);
export const ImagesIcon = createIcon('ImagesIcon', [
  p('m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16'),
  p('M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2'),
  c(13, 7, 1),
  r(8, 2, 14, 14, 2),
]);

// Grafik ve analiz
export const ChartColumnIcon = createIcon('ChartColumnIcon', [p('M3 3v16a2 2 0 0 0 2 2h16'), p('M18 17V9'), p('M13 17V5'), p('M8 17v-3')]);
export const ChartLineIcon = createIcon('ChartLineIcon', [p('M3 3v16a2 2 0 0 0 2 2h16'), p('m19 9-5 5-4-4-3 3')]);
export const ChartPieIcon = createIcon('ChartPieIcon', [
  p('M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z'),
  p('M21.21 15.89A10 10 0 1 1 8 2.83'),
]);
export const DollarSignIcon = createIcon('DollarSignIcon', [p('M12 3v18'), p('M17 5H9.5a1 1 0 000 7h5a1 1 0 010 7H6')]);
export const TurkishLiraIcon = createIcon('TurkishLiraIcon', [
  p('m14 10-8 4'),
  p('M14 5 6 9'),
  p('M18 12a8 8 0 01-7.003 7.937c-.547.07-.997-.385-.997-.937V4'),
]);

// Arayüz
export const EllipsisVerticalIcon = createIcon('EllipsisVerticalIcon', [c(12, 12, 1), c(12, 5, 1), c(12, 19, 1)]);
export const PanelRightIcon = createIcon('PanelRightIcon', [r(3, 3, 18, 18, 2), p('M15 3v18')]);
export const CommandIcon = createIcon('CommandIcon', [p('M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3')]);
export const HashIcon = createIcon('HashIcon', [l(4, 9, 20, 9), l(4, 15, 20, 15), l(10, 3, 8, 21), l(16, 3, 14, 21)]);
export const AtSignIcon = createIcon('AtSignIcon', [c(12, 12, 4), p('M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8')]);
export const LanguagesIcon = createIcon('LanguagesIcon', [
  p('m5 8 6 6'),
  p('m4 14 6-6 2-3'),
  p('M2 5h12'),
  p('M7 2h1'),
  p('m22 22-5-10-5 10'),
  p('M14 18h6'),
]);
export const AccessibilityIcon = createIcon('AccessibilityIcon', [
  c(16, 4, 1),
  p('m18 19 1-7-6 1'),
  p('m5 8 3-3 5.5 3-2.36 3.5'),
  p('M4.24 14.5a5 5 0 0 0 6.88 6'),
  p('M13.76 17.5a5 5 0 0 0-6.88-6'),
]);
export const CircleDotIcon = createIcon('CircleDotIcon', [c(12, 12, 1), c(12, 12, 10)]);
export const SquareIcon = createIcon('SquareIcon', [r(3, 3, 18, 18, 2)]);
export const SquareCheckIcon = createIcon('SquareCheckIcon', [r(3, 3, 18, 18, 2), p('m16 9-5.5 5.5L8 12')]);

// Lucide'ın eski adlarıyla da kullanılabilsin
export const Loader2Icon = LoaderCircleIcon;
export const BarChartIcon = ChartColumnIcon;
export const LineChartIcon = ChartLineIcon;
export const PieChartIcon = ChartPieIcon;
export const MoreVerticalIcon = EllipsisVerticalIcon;
export const HelpCircleIcon = CircleHelpIcon;
export const EditIcon = SquarePenIcon;

export * from './brands';
