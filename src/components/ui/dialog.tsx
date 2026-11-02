/**
 * Modal pencere.
 *
 * Odak içeride döner, Escape ve dış tıklama kapatır, arka plan kaymaz,
 * kapanınca odak tetikleyiciye döner. Başlık ve açıklama otomatik olarak
 * `aria-labelledby` / `aria-describedby` ile bağlanır.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild><Button variant="outline">Adres ekle</Button></DialogTrigger>
 *   <DialogContent size="md">
 *     <DialogHeader>
 *       <DialogTitle>Yeni adres</DialogTitle>
 *       <DialogDescription>Teslimat için kullanılacak adres.</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>...</DialogBody>
 *     <DialogFooter>
 *       <DialogClose asChild><Button variant="outline">Vazgeç</Button></DialogClose>
 *       <Button>Kaydet</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 */
import { createContext, useContext, useId, useRef, type ComponentProps, type ReactNode, type RefObject } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDismissableLayer } from '../../hooks/use-dismissable-layer';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { usePresence } from '../../hooks/use-presence';
import { useScrollLock } from '../../hooks/use-scroll-lock';
import { cn, composeEventHandlers, composeRefs, variants, type VariantProps } from '../../lib/utils';
import { XIcon } from '../icons';
import { Portal } from './portal';
import { Slot } from './slot';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  triggerRef: RefObject<HTMLElement | null>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog bileşenleri <Dialog> içinde kullanılmalı.');
  return ctx;
}

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const id = useId().replace(/:/g, '');
  const triggerRef = useRef<HTMLElement | null>(null);
  return (
    <DialogContext.Provider
      value={{ open, setOpen, titleId: `dialog-${id}-title`, descriptionId: `dialog-${id}-description`, triggerRef }}
    >
      {children}
    </DialogContext.Provider>
  );
}

type TriggerProps = ComponentProps<'button'> & { asChild?: boolean };

export function DialogTrigger({ asChild, onClick, ref, ...props }: TriggerProps) {
  const ctx = useDialog();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-haspopup="dialog"
      aria-expanded={ctx.open}
      data-state={ctx.open ? 'open' : 'closed'}
      data-slot="dialog-trigger"
      ref={composeRefs(ref as never, ctx.triggerRef)}
      onClick={composeEventHandlers(onClick as never, () => ctx.setOpen(true))}
      {...(props as object)}
    />
  );
}

export function DialogClose({ asChild, onClick, ...props }: TriggerProps) {
  const ctx = useDialog();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      data-slot="dialog-close"
      onClick={composeEventHandlers(onClick as never, () => ctx.setOpen(false))}
      {...(props as object)}
    />
  );
}

export type DialogPopupProps = ComponentProps<'div'> & {
  role?: 'dialog' | 'alertdialog';
  overlayClassName?: string;
  /** Dışarı tıklayınca kapanır. Varsayılan: true (alertdialog'da false). */
  dismissOnOutside?: boolean;
  /** Kapanış animasyonu süresi. */
  exitMs?: number;
  /** Açılışta odaklanacak öğe. */
  initialFocus?: RefObject<HTMLElement | null>;
};

/**
 * Dialog, Sheet, Drawer ve AlertDialog'un ortak gövdesi: overlay, odak
 * tuzağı, kaydırma kilidi ve kapanma davranışı. Görünüm `className` ile verilir.
 */
export function DialogPopup({
  role = 'dialog',
  overlayClassName,
  dismissOnOutside = role !== 'alertdialog',
  exitMs = 150,
  initialFocus,
  className,
  children,
  ref,
  ...props
}: DialogPopupProps) {
  const ctx = useDialog();
  const present = usePresence(ctx.open, exitMs);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(ctx.open);
  useFocusTrap(contentRef, ctx.open && present, { initialFocus });
  useDismissableLayer(ctx.open, [contentRef], () => ctx.setOpen(false), { disableOutside: !dismissOnOutside });

  if (!present) return null;
  const state = ctx.open ? 'open' : 'closed';

  return (
    <Portal>
      <div
        data-slot="dialog-overlay"
        data-state={state}
        aria-hidden
        className={cn(
          'fixed inset-0 z-50 bg-overlay',
          'data-[state=open]:animate-dv-fade-in data-[state=closed]:animate-dv-fade-out',
          overlayClassName,
        )}
      />
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={ctx.descriptionId}
        tabIndex={-1}
        data-slot="dialog-content"
        data-state={state}
        ref={composeRefs(ref, contentRef)}
        className={cn('fixed z-50 outline-none', className)}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}

const dialogContent = variants({
  base: [
    'top-1/2 left-1/2 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4',
    'rounded-lg border bg-background p-6 text-foreground shadow-lg',
    'data-[state=open]:animate-dv-zoom-in data-[state=closed]:animate-dv-zoom-out',
  ],
  variants: {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)]',
    },
  },
  defaultVariants: { size: 'md' },
});

type DialogContentProps = Omit<DialogPopupProps, 'role'> &
  VariantProps<typeof dialogContent> & {
    /** Sağ üstte kapatma düğmesi. Varsayılan: true */
    showCloseButton?: boolean;
  };

export function DialogContent({ size, showCloseButton = true, className, children, ...props }: DialogContentProps) {
  return (
    <DialogPopup className={cn(dialogContent({ size }), className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogClose
          aria-label="Kapat"
          className="absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <XIcon className="size-4" />
        </DialogClose>
      )}
    </DialogPopup>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5 pr-8 text-left', className)} {...props} />;
}

/** İçerik uzunsa kendi içinde kayar; başlık ve alt bar sabit kalır. */
export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-body" className={cn('-mx-6 min-h-0 flex-1 overflow-y-auto px-6 dv-scrollbar', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<'h2'>) {
  const ctx = useDialog();
  return (
    <h2 id={ctx.titleId} data-slot="dialog-title" className={cn('font-heading text-lg leading-tight font-semibold', className)} {...props} />
  );
}

export function DialogDescription({ className, ...props }: ComponentProps<'p'>) {
  const ctx = useDialog();
  return <p id={ctx.descriptionId} data-slot="dialog-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
