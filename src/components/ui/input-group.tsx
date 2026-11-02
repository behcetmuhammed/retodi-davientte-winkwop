/**
 * Input'u ikon, metin veya butonlarla tek bir çerçevede birleştirir.
 * Odak halkası bütün grubu sarar.
 *
 * @example
 * <InputGroup>
 *   <InputGroupAddon><SearchIcon /></InputGroupAddon>
 *   <InputGroupInput placeholder="Ürün ara" />
 *   <InputGroupAddon align="end"><Kbd>⌘K</Kbd></InputGroupAddon>
 * </InputGroup>
 *
 * <InputGroup>
 *   <InputGroupInput type="number" placeholder="0,00" />
 *   <InputGroupAddon align="end"><InputGroupText>TL</InputGroupText></InputGroupAddon>
 * </InputGroup>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from './button';
import { useFieldControl } from './field';

export function InputGroup({ className, size = 'md', ...props }: ComponentProps<'div'> & { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      role="group"
      data-slot="input-group"
      className={cn(
        'group/input-group relative flex w-full min-w-0 items-center rounded-md border border-input bg-background shadow-xs',
        'transition-[color,box-shadow,border-color] outline-none',
        'has-[[data-slot=input-group-control]:focus-visible]:border-primary/60 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring',
        'has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/20',
        'has-[[data-slot=input-group-control]:disabled]:bg-muted has-[[data-slot=input-group-control]:disabled]:opacity-60',
        'has-[textarea]:h-auto has-[textarea]:flex-col has-[textarea]:items-stretch',
        size === 'sm' && 'h-8 text-[0.8125rem]',
        size === 'md' && 'h-9 text-sm',
        size === 'lg' && 'h-10 text-[0.9375rem]',
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupAddon({
  align = 'start',
  className,
  onClick,
  ...props
}: ComponentProps<'div'> & { align?: 'start' | 'end' | 'block-start' | 'block-end' }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      onClick={(event) => {
        onClick?.(event);
        if ((event.target as HTMLElement).closest('button')) return;
        event.currentTarget.parentElement?.querySelector<HTMLElement>('[data-slot=input-group-control]')?.focus();
      }}
      className={cn(
        'flex h-full cursor-text items-center gap-2 text-muted-foreground select-none',
        "[&>svg:not([class*='size-'])]:size-4",
        align === 'start' && 'order-first pl-3 has-[>button]:pl-1',
        align === 'end' && 'order-last pr-3 has-[>button]:pr-1',
        align === 'block-start' && 'order-first w-full px-3 pt-2.5',
        align === 'block-end' && 'order-last w-full px-3 pb-2.5',
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupInput({ className, ...rest }: ComponentProps<'input'>) {
  const props = useFieldControl(rest);
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        'h-full min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
        'group-has-[[data-align=start]]/input-group:pl-2 group-has-[[data-align=end]]/input-group:pr-2',
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupTextarea({ className, ...rest }: ComponentProps<'textarea'>) {
  const props = useFieldControl(rest);
  return (
    <textarea
      data-slot="input-group-control"
      className={cn('min-h-16 w-full flex-1 resize-none bg-transparent px-3 py-2.5 outline-none placeholder:text-muted-foreground', className)}
      {...props}
    />
  );
}

export function InputGroupText({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('flex items-center gap-1.5 text-sm text-muted-foreground', className)} {...props} />;
}

export function InputGroupButton({ size = 'xs', variant = 'ghost', className, ...props }: ButtonProps) {
  return <Button size={size} variant={variant} className={cn('shadow-none', className)} {...props} />;
}
