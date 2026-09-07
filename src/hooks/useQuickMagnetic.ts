import { useEffect, useRef } from 'react';
import { gsap, getMotionLevel } from '../lib/motion';

type Options = {
  strength?: number;
};

/**
 * Magnetic pull via gsap.quickTo — rAF-batched, transform-only.
 */
export function useQuickMagnetic<T extends HTMLElement>(options: Options = {}) {
  const ref = useRef<T | null>(null);
  const { strength = 0.4 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionLevel() !== 'full') return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.willChange = 'transform';
      xTo(dx * strength);
      yTo(dy * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      window.setTimeout(() => {
        el.style.willChange = 'auto';
      }, 400);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0, clearProps: 'willChange' });
    };
  }, [strength]);

  return ref;
}
