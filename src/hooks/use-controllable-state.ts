import { useCallback, useRef, useState } from 'react';

type Options<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

/**
 * Bileşenin hem kontrollü (`value` + `onChange`) hem kontrolsüz
 * (`defaultValue`) kullanılabilmesini sağlar.
 *
 * @example
 * const [open, setOpen] = useControllableState({ value: props.open, defaultValue: false, onChange: props.onOpenChange });
 */
export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const currentRef = useRef(current);
  currentRef.current = current;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      currentRef.current = resolved;
      if (!isControlled) setInternal(resolved);
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue] as const;
}
