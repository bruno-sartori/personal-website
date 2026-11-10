'use client';

import { useSyncExternalStore } from 'react';

/** Live `window.matchMedia` result; `false` during SSR. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True once the page is scrolled past `offset` pixels; `false` during SSR. */
export function useScrolledPast(offset: number): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('scroll', onChange, { passive: true });
      return () => window.removeEventListener('scroll', onChange);
    },
    () => window.scrollY > offset,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** Apple platforms use ⌘ for shortcuts; assume so during SSR. */
export function useIsApple(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/i.test(navigator.userAgent),
    () => true,
  );
}
