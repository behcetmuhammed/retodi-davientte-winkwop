/**
 * Basılı/basılı değil durumu olan buton.
 *
 * @example
 * <Toggle aria-label="Kalın" pressed={bold} onPressedChange={setBold}><BoldIcon /></Toggle>
 * <Toggle variant="outline" size="sm">Sadece stoktakiler</Toggle>
 */
import type { ComponentProps } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { cn, composeEventHandlers, variants, type VariantProps } from '../../lib/utils';

export const toggleVariants = variants({
  base: [
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap',
    'transition-[color,background-color,box-shadow] outline-none hover:bg-muted hover:text-muted-foreground',
    'focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ],
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground data-[state=on]:border-primary/40',
    },
    size: {
      sm: 'h-8 min-w-8 px-2',
      md: 'h-9 min-w-9 px-2.5',
      lg: 'h-10 min-w-10 px-3',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export type ToggleProps = ComponentProps<'button'> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  };

export function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  variant,
  size,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const [pressed, setPressed] = useControllableState({ value: pressedProp, defaultValue: defaultPressed, onChange: onPressedChange });
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-slot="toggle"
      data-state={pressed ? 'on' : 'off'}
      onClick={composeEventHandlers(onClick, () => setPressed(!pressed))}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
