/**
 * Bildirimlerin gösterildiği alan. Uygulamada (ör. layout'ta) bir kez kullanın.
 *
 * @example
 * <Toaster position="bottom-right" />
 */
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon, XIcon } from '../icons';
import { Button } from './button';
import { Portal } from './portal';
import { Spinner } from './spinner';
import { defaultDuration, toast, useToasts, type ToastData } from './toast';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const POSITION: Record<Position, string> = {
  'top-left': 'top-0 left-0 items-start',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-0 right-0 items-end',
  'bottom-left': 'bottom-0 left-0 items-start flex-col-reverse',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
  'bottom-right': 'bottom-0 right-0 items-end flex-col-reverse',
};

const ICONS = {
  success: <CircleCheckIcon className="text-success" />,
  error: <CircleXIcon className="text-destructive" />,
  warning: <TriangleAlertIcon className="text-warning" />,
  info: <InfoIcon className="text-info" />,
  loading: <Spinner size="sm" className="text-muted-foreground" />,
  default: null,
};

type ToasterProps = {
  position?: Position;
  /** Aynı anda gösterilecek en fazla bildirim. Varsayılan: 4 */
  visibleToasts?: number;
  className?: string;
};

export function Toaster({ position = 'bottom-right', visibleToasts = 4, className }: ToasterProps) {
  const all = useToasts();
  const items = all.slice(-visibleToasts);
  const [paused, setPaused] = useState(false);

  return (
    <Portal>
      <section
        aria-label="Bildirimler"
        aria-live="polite"
        tabIndex={-1}
        data-slot="toaster"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className={cn(
          'pointer-events-none fixed z-100 flex max-h-svh w-full flex-col gap-2 p-4 sm:max-w-sm',
          POSITION[position],
          className,
        )}
      >
        {items.map((t) => (
          <ToastItem key={t.id} toast={t} paused={paused} fromTop={position.startsWith('top')} />
        ))}
      </section>
    </Portal>
  );
}

function ToastItem({ toast: t, paused, fromTop }: { toast: ToastData; paused: boolean; fromTop: boolean }) {
  const duration = t.duration ?? defaultDuration(t.type);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  useEffect(() => {
    remaining.current = duration;
  }, [duration, t.createdAt]);

  useEffect(() => {
    if (paused || t.closing || !Number.isFinite(duration)) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => toast.dismiss(t.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, t.closing, t.id, duration, t.createdAt]);

  const icon = ICONS[t.type];
  const assertive = t.type === 'error' || t.type === 'warning';

  return (
    <div
      role={assertive ? 'alert' : undefined}
      aria-atomic
      data-slot="toast"
      data-type={t.type}
      data-state={t.closing ? 'closed' : 'open'}
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border bg-background p-4 text-sm text-foreground shadow-lg',
        "[&>svg]:mt-0.5 [&_svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
        fromTop ? 'data-[state=open]:animate-dv-slide-in-top' : 'data-[state=open]:animate-dv-slide-in-bottom',
        'data-[state=closed]:animate-dv-fade-out',
      )}
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="font-medium">{t.title}</div>
        {t.description && <div className="text-muted-foreground">{t.description}</div>}
        {t.action && (
          <div className="mt-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                t.action!.onClick();
                toast.dismiss(t.id);
              }}
            >
              {t.action.label}
            </Button>
          </div>
        )}
      </div>
      {t.dismissible !== false && t.type !== 'loading' && (
        <button
          type="button"
          aria-label="Bildirimi kapat"
          onClick={() => toast.dismiss(t.id)}
          className="-mt-1 -mr-1 rounded-sm p-1 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}