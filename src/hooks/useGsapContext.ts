import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

/**
 * Creates a GSAP context scoped to `scope` and reverts on unmount.
 * Pass a setup callback that registers tweens/ScrollTriggers.
 */
export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
) {
  const scope = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      setup(ctx);
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
