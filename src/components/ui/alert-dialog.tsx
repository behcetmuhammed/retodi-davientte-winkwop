/**
 * Önemli işlemler için onay penceresi. Dışarı tıklayınca kapanmaz; odak
 * açılışta "Vazgeç" düğmesine gelir (yanlışlıkla onaylamayı önler).
 *
 * @example
 * <AlertDialog>
 *   <AlertDialogTrigger asChild><Button variant="destructive">Hesabı sil</Button></AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Hesabınız silinsin mi?</AlertDialogTitle>
 *       <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Vazgeç</AlertDialogCancel>
 *       <AlertDialogAction variant="destructive" onClick={remove}>Sil</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type RefObject,
} from 'react';
import { cn, composeRefs } from '../../lib/utils';
import { Button, type ButtonProps } from './button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  useDialog,
  type DialogProps,
} from './dialog';

const CancelRefContext = createContext<RefObject<HTMLElement | null> | null>(null);

export function AlertDialog(props: DialogProps) {
  return <Dialog {...props} />;
}

export const AlertDialogTrigger = DialogTrigger;
export const AlertDialogHeader = DialogHeader;
export const AlertDialogFooter = DialogFooter;
export const AlertDialogTitle = DialogTitle;
export const AlertDialogDescription = DialogDescription;

export function AlertDialogContent({ className, children, ...props }: Omit<ComponentProps<'div'>, 'role'>) {
  const cancelRef = useRef<HTMLElement | null>(null);
  return (
    <DialogPopup
      role="alertdialog"
      initialFocus={cancelRef}
      className={cn(
        'top-1/2 left-1/2 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4',
        'rounded-lg border bg-background p-6 text-foreground shadow-lg',
        'data-[state=open]:animate-dv-zoom-in data-[state=closed]:animate-dv-zoom-out',
        '[&_[data-slot=dialog-header]]:pr-0',
        className,
      )}
      {...props}
    >
      <CancelRefContext value={cancelRef}>{children}</CancelRefContext>
    </DialogPopup>
  );
}

export function AlertDialogCancel({ variant = 'outline', onClick, ref, ...props }: ButtonProps) {
  const ctx = useDialog();
  const cancelRef = useContext(CancelRefContext);
  return (
    <Button
      variant={variant}
      ref={composeRefs<HTMLButtonElement>(ref, cancelRef as RefObject<HTMLButtonElement | null> | undefined)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setOpen(false);
      }}
      {...props}
    />
  );
}

type ActionProps = Omit<ButtonProps, 'onClick'> & {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
};

/**
 * Onay düğmesi. `onClick` bir Promise döndürürse tamamlanana kadar yükleme
 * gösterir; pencere yalnızca işlem başarılı olunca kapanır.
 */
export function AlertDialogAction({ onClick, loading: loadingProp, ...props }: ActionProps) {
  const ctx = useDialog();
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Button
      loading={loadingProp ?? loading}
      onClick={async (event) => {
        const result = onClick?.(event);
        if (event.defaultPrevented) return;
        if (!(result instanceof Promise)) {
          ctx.setOpen(false);
          return;
        }
        setLoading(true);
        try {
          await result;
          ctx.setOpen(false);
        } finally {
          if (mounted.current) setLoading(false);
        }
      }}
      {...props}
    />
  );
}
