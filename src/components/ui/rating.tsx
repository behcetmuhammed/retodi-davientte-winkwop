/**
 * Yıldız puanı. `readOnly` ile gösterim, aksi halde seçim (ok tuşları destekli).
 *
 * @example
 * <Rating value={4.5} readOnly />                 // ürün kartı
 * <Rating value={score} onValueChange={setScore} /> // değerlendirme formu
 */
import { useState, type ComponentProps } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { clamp, cn } from '../../lib/utils';
import { StarIcon } from '../icons';

type RatingProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
};

const SIZES = { sm: 'size-3.5', md: 'size-4.5', lg: 'size-6' };

export function Rating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  disabled = false,
  size = 'md',
  name,
  className,
  ...props
}: RatingProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  const interactive = !readOnly && !disabled;

  const stars = Array.from({ length: max }, (_, i) => {
    const fill = clamp(shown - i, 0, 1);
    return (
      <span key={i} className={cn('relative inline-flex', SIZES[size])}>
        <StarIcon className="size-full fill-muted-foreground/15 text-muted-foreground/30" strokeWidth={1.5} />
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
          <StarIcon className={cn('fill-warning text-warning', SIZES[size])} strokeWidth={1.5} />
        </span>
      </span>
    );
  });

  if (!interactive) {
    return (
      <div
        role="img"
        aria-label={`${max} üzerinden ${value.toLocaleString('tr-TR')} puan`}
        data-slot="rating"
        className={cn('inline-flex items-center gap-0.5', disabled && 'opacity-50', className)}
        {...props}
      >
        {stars}
      </div>
    );
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={props['aria-label'] ?? 'Puan'}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${max} üzerinden ${value}`}
      data-slot="rating"
      onKeyDown={(event) => {
        const delta = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
        if (delta) {
          event.preventDefault();
          setValue(clamp(Math.round(value) + delta, 0, max));
        } else if (event.key === 'Home') setValue(0);
        else if (event.key === 'End') setValue(max);
      }}
      onPointerLeave={() => setHover(null)}
      className={cn('inline-flex items-center gap-0.5 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring', className)}
      {...props}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="cursor-pointer transition-transform hover:scale-110"
          onPointerEnter={() => setHover(i + 1)}
          onClick={() => setValue(value === i + 1 ? 0 : i + 1)}
        >
          {star}
        </span>
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
