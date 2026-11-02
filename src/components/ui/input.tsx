/**
 * Tek satırlık giriş alanı.
 *
 * @example
 * <Input placeholder="Ad Soyad" />
 * <Input type="email" size="lg" aria-invalid />
 * <Input type="password" />   // göster/gizle düğmesi otomatik
 */
import { useState, type ComponentProps } from 'react';
import { cn, variants } from '../../lib/utils';
import { EyeIcon, EyeOffIcon } from '../icons';
import { useFieldControl } from './field';

export const inputVariants = variants({
  base: [
    'flex w-full min-w-0 rounded-md border border-input bg-background text-foreground shadow-xs',
    'transition-[color,box-shadow,border-color] outline-none',
    'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
    'file:inline-flex file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
    'read-only:bg-muted/60',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:focus-visible:ring-destructive/25',
  ],
  variants: {
    size: {
      sm: 'h-8 px-2.5 text-[0.8125rem]',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-3.5 text-[0.9375rem]',
    },
  },
  defaultVariants: { size: 'md' },
});

export type InputProps = Omit<ComponentProps<'input'>, 'size'> & {
  size?: 'sm' | 'md' | 'lg';
};

export function Input({ className, size, type = 'text', ...rest }: InputProps) {
  const props = useFieldControl(rest);
  const [revealed, setRevealed] = useState(false);

  if (type === 'password') {
    return (
      <div data-slot="input-password" className="relative w-full">
        <input
          data-slot="input"
          type={revealed ? 'text' : 'password'}
          className={cn(inputVariants({ size }), 'pr-9', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          disabled={props.disabled}
          aria-label={revealed ? 'Şifreyi gizle' : 'Şifreyi göster'}
          aria-pressed={revealed}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none"
        >
          {revealed ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    );
  }

  return <input data-slot="input" type={type} className={cn(inputVariants({ size }), className)} {...props} />;
}
