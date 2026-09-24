import { useEffect, useRef } from 'react';
import type Lenis from 'lenis';

type LenisScrollHandler = (e: { scroll: number }) => void;

/**
 * Prefer Lenis scroll events for section sync; fall back to window scroll.
 */
export function useLenisScroll(
  onScroll: (scrollY: number) => void,
  enabled = true,
) {
  const cbRef = useRef(onScroll);

  useEffect(() => {
    cbRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    if (!enabled) return;

    const run = (y: number) => cbRef.current(y);

    const attachLenis = () => {
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
      if (!lenis) return null;

      const handler: LenisScrollHandler = ({ scroll }) => run(scroll);
      lenis.on('scroll', handler);
      run(lenis.scroll);
      return () => {
        lenis.off('scroll', handler);
      };
    };

    let detach = attachLenis();
    const retry = window.setInterval(() => {
      if (detach) {
        window.clearInterval(retry);
        return;
      }
      detach = attachLenis();
      if (detach) window.clearInterval(retry);
    }, 50);

    const onWin = () => run(window.scrollY);
    if (!detach) {
      window.addEventListener('scroll', onWin, { passive: true });
      run(window.scrollY);
    }

    return () => {
      window.clearInterval(retry);
      window.removeEventListener('scroll', onWin);
      detach?.();
    };
  }, [enabled]);
}
