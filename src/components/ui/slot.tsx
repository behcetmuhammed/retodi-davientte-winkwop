import { cloneElement, isValidElement, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cn, composeRefs } from '../../lib/utils';

type SlotProps = HTMLAttributes<HTMLElement> & { children?: ReactNode; ref?: Ref<HTMLElement> };

/**
 * `asChild` desteği: kendi öğesini çizmek yerine prop'larını tek çocuğuna
 * aktarır. className'ler birleşir, olay handler'ları ikisi de çalışır,
 * ref'ler birleşir.
 *
 * @example <Button asChild><a href="/sepet">Sepete git</a></Button>
 */
export function Slot({ children, ref, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) return null;
  const childProps = children.props as Record<string, any>;
  const merged: Record<string, any> = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = (slotProps as Record<string, any>)[key];
    const childValue = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof slotValue === 'function' && typeof childValue === 'function') {
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        slotValue(...args);
      };
    }
  }

  merged.className = cn(slotProps.className, childProps.className);
  if (slotProps.style || childProps.style) merged.style = { ...slotProps.style, ...childProps.style };
  merged.ref = composeRefs(ref, childProps.ref);

  return cloneElement(children, merged);
}
