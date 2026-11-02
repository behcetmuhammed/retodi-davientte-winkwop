import { useEffect, useLayoutEffect } from 'react';

/** Sunucuda uyarı vermeyen `useLayoutEffect`. */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
