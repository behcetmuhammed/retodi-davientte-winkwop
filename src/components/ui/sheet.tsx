/**
 * Ekranın bir kenarından kayan panel (sepet, filtreler, mobil menü).
 *
 * @example
 * <Sheet>
 *   <SheetTrigger asChild><Button variant="outline">Filtreler</Button></SheetTrigger>
 *   <SheetContent side="right" size="md">
 *     <SheetHeader>
 *       <SheetTitle>Filtreler</SheetTitle>
 *       <SheetDescription>Sonuçları daraltın.</SheetDescription>
 *     </SheetHeader>
 *     <SheetBody>...</SheetBody>
 *     <SheetFooter><Button block>Uygula</Button></SheetFooter>
 *   </SheetContent>
 * </Sheet>
 */
import type { ComponentProps } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';
import { XIcon } from '../icons';
import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle, DialogTrigger, type DialogPopupProps, type DialogProps } from './dialog';

export function Sheet(props: DialogProps) {
  return <Dialog {...props} />;
}

export const SheetTrigger = DialogTrigger;
export const SheetClose = DialogClose;

const sheetContent = variants({
  base: 'flex flex-col bg-background text-foreground shadow-lg',
  variants: {
    side: {
      right: 'inset-y-0 right-0 h-full w-[calc(100%-3rem)] border-l data-[state=open]:animate-dv-slide-in-right data-[state=closed]:animate-dv-slide-out-right',
      left: 'inset-y-0 left-0 h-full w-[calc(100%-3rem)] border-r data-[state=open]:animate-dv-slide-in-left data-[state=closed]:animate-dv-slide-out-left',
      top: 'inset-x-0 top-0 max-h-[85dvh] border-b data-[state=open]:animate-dv-slide-in-top data-[state=closed]:animate-dv-slide-out-top',
      bottom: 'inset-x-0 bottom-0 max-h-[85dvh] border-t data-[state=open]:animate-dv-slide-in-bottom data-[state=closed]:animate-dv-slide-out-bottom',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  compoundVariants: [
    { side: 'right', size: 'sm', className: 'sm:max-w-xs' },
    { side: 'right', size: 'md', className: 'sm:max-w-sm' },
    { side: 'right', size: 'lg', className: 'sm:max-w-lg' },
    { side: 'right', size: 'xl', className: 'sm:max-w-2xl' },
    { side: 'left', size: 'sm', className: 'sm:max-w-xs' },
    { side: 'left', size: 'md', className: 'sm:max-w-sm' },
    { side: 'left', size: 'lg', className: 'sm:max-w-lg' },
    { side: 'left', size: 'xl', className: 'sm:max-w-2xl' },
  ],
  defaultVariants: { side: 'right', size: 'md' },
});

type SheetContentProps = Omit<DialogPopupProps, 'role'> & VariantProps<typeof sheetContent> & { showCloseButton?: boolean };

export function SheetContent({ side, size, showCloseButton = true, className, children, ...props }: SheetContentProps) {
  return (
    <DialogPopup exitMs={180} className={cn(sheetContent({ side, size }), className)} {...props}>
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

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('flex flex-col gap-1 border-b p-5 pr-12', className)} {...props} />;
}

export function SheetBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-body" className={cn('min-h-0 flex-1 overflow-y-auto p-5 dv-scrollbar', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('mt-auto flex flex-col gap-2 border-t p-5', className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<'h2'>) {
  return <DialogTitle className={cn('text-base', className)} {...props} />;
}

export const SheetDescription = DialogDescription;
