/**
 * Kullanıcı / profil görseli. Görsel yüklenemezse baş harfleri gösterir.
 *
 * @example
 * <Avatar src={user.photo} name="Ayşe Yılmaz" />
 * <Avatar name="Mehmet Kaya" size="lg" status="online" />
 *
 * <AvatarGroup max={3}>
 *   {team.map((m) => <Avatar key={m.id} src={m.photo} name={m.name} />)}
 * </AvatarGroup>
 */
import { Children, cloneElement, isValidElement, useEffect, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';

const avatarVariants = variants({
  base: 'relative inline-flex shrink-0 items-center justify-center bg-muted font-medium text-muted-foreground select-none',
  variants: {
    size: {
      xs: 'size-6 text-[0.625rem]',
      sm: 'size-8 text-xs',
      md: 'size-10 text-sm',
      lg: 'size-12 text-base',
      xl: 'size-16 text-lg',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-md',
    },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
});

export function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toLocaleUpperCase('tr');
}

type AvatarProps = Omit<ComponentProps<'span'>, 'children'> &
  VariantProps<typeof avatarVariants> & {
    src?: string | null;
    name?: string;
    alt?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
    fallback?: ReactNode;
  };

const STATUS = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-destructive',
  away: 'bg-warning',
};

const STATUS_LABEL = { online: 'çevrimiçi', offline: 'çevrimdışı', busy: 'meşgul', away: 'uzakta' };

export function Avatar({ src, name, alt, status, fallback, size, shape, className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = src && !failed;

  return (
    <span data-slot="avatar" className={cn(avatarVariants({ size, shape }), className)} {...props}>
      <span className={cn('flex size-full items-center justify-center overflow-hidden', shape === 'square' ? 'rounded-md' : 'rounded-full')}>
        {showImage ? (
          <img src={src} alt={alt ?? name ?? ''} onError={() => setFailed(true)} className="size-full object-cover" loading="lazy" />
        ) : (
          (fallback ?? <span aria-label={name}>{getInitials(name)}</span>)
        )}
      </span>
      {status && (
        <span
          role="img"
          aria-label={STATUS_LABEL[status]}
          className={cn('absolute right-0 bottom-0 size-[28%] min-h-2 min-w-2 rounded-full ring-2 ring-background', STATUS[status])}
        />
      )}
    </span>
  );
}

type AvatarGroupProps = ComponentProps<'div'> & {
  /** En fazla bu kadar avatar gösterilir, kalanı "+N" olur. */
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
};

export function AvatarGroup({ max, size, className, children, ...props }: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const visible = max ? items.slice(0, max) : items;
  const rest = items.length - visible.length;

  return (
    <div data-slot="avatar-group" className={cn('flex items-center -space-x-2', className)} {...props}>
      {visible.map((child, i) => (
        <span key={child.key ?? i} className="rounded-full ring-2 ring-background">
          {size ? cloneElement(child, { size }) : child}
        </span>
      ))}
      {rest > 0 && (
        <span className={cn(avatarVariants({ size }), 'rounded-full ring-2 ring-background')} aria-label={`${rest} kişi daha`}>
          +{rest}
        </span>
      )}
    </div>
  );
}
