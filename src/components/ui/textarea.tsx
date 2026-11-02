/**
 * Çok satırlı metin alanı. `autoResize` ile içeriğe göre uzar.
 *
 * @example
 * <Textarea placeholder="Sipariş notunuz" rows={4} />
 * <Textarea autoResize maxLength={500} showCount />
 */
import { useRef, useState, type ComponentProps } from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { cn, composeRefs } from '../../lib/utils';
import { useFieldControl } from './field';

type TextareaProps = ComponentProps<'textarea'> & {
  /** İçeriğe göre yüksekliği ayarlar. */
  autoResize?: boolean;
  /** `maxLength` ile birlikte karakter sayacı gösterir. */
  showCount?: boolean;
};

export function Textarea({ className, autoResize, showCount, ref, onChange, ...rest }: TextareaProps) {
  const props = useFieldControl(rest);
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const [count, setCount] = useState(String(props.value ?? props.defaultValue ?? '').length);

  const resize = () => {
    const el = innerRef.current;
    if (!autoResize || !el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  };

  useIsomorphicLayoutEffect(resize, [props.value, autoResize]);

  const textarea = (
    <textarea
      data-slot="textarea"
      ref={composeRefs(ref, innerRef)}
      onChange={(event) => {
        onChange?.(event);
        setCount(event.target.value.length);
        resize();
      }}
      className={cn(
        'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs',
        'transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground',
        'focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        autoResize && 'resize-none overflow-hidden',
        className,
      )}
      {...props}
    />
  );

  if (!showCount || !props.maxLength) return textarea;

  return (
    <div data-slot="textarea-wrapper" className="flex w-full flex-col gap-1">
      {textarea}
      <span aria-live="polite" className="self-end text-xs text-muted-foreground tabular-nums">
        {count}/{props.maxLength}
      </span>
    </div>
  );
}
