/**
 * Alttan açılan panel (mobilde tercih edilen modal biçimi). Tutamaçtan aşağı
 * sürükleyerek kapatılabilir.
 *
 * @example
 * <Drawer>
 *   <DrawerTrigger asChild><Button>Sepete ekle</Button></DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Beden seçin</DrawerTitle>
 *       <DrawerDescription>Stoktaki bedenler gösteriliyor.</DrawerDescription>
 *     </DrawerHeader>
 *     <DrawerBody>...</DrawerBody>
 *     <DrawerFooter><Button block>Devam</Button></DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 */
import { useRef, useState, type ComponentProps, type PointerEvent } from 'react';
import { cn } from '../../lib/utils';
import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle, DialogTrigger, useDialog, type DialogPopupProps, type DialogProps } from './dialog';

export function Drawer(props: DialogProps) {
  return <Dialog {...props} />;
}

export const DrawerTrigger = DialogTrigger;
export const DrawerClose = DialogClose;

const CLOSE_THRESHOLD = 0.3;

export function DrawerContent({ className, children, style, ...props }: Omit<DialogPopupProps, 'role'>) {
  const ctx = useDialog();
  const [offset, setOffset] = useState(0);
  const drag = useRef<{ startY: number; height: number } | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const content = event.currentTarget.closest<HTMLElement>('[data-slot=dialog-content]');
    drag.current = { startY: event.clientY, height: content?.offsetHeight ?? 1 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setOffset(Math.max(0, event.clientY - drag.current.startY));
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const shouldClose = offset / drag.current.height > CLOSE_THRESHOLD;
    drag.current = null;
    setOffset(0);
    if (shouldClose) ctx.setOpen(false);
  };

  return (
    <DialogPopup
      exitMs={180}
      style={{ ...style, transform: offset ? `translateY(${offset}px)` : undefined, transition: offset ? 'none' : undefined }}
      className={cn(
        'inset-x-0 bottom-0 mx-auto flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-t-xl border border-b-0 bg-background text-foreground shadow-lg',
        'transition-transform duration-200 data-[state=open]:animate-dv-slide-in-bottom data-[state=closed]:animate-dv-slide-out-bottom',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
      >
        <span className="h-1 w-10 rounded-full bg-border" />
      </div>
      {children}
    </DialogPopup>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="drawer-header" className={cn('flex flex-col gap-1 px-5 pb-3 text-center sm:text-left', className)} {...props} />;
}

export function DrawerBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="drawer-body" className={cn('min-h-0 flex-1 overflow-y-auto px-5 pb-4 dv-scrollbar', className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="drawer-footer" className={cn('flex flex-col gap-2 border-t px-5 py-4', className)} {...props} />;
}

export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
