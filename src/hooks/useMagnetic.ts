import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { getMotionLevel, SPRING } from '@/lib/motion';

type MagneticOptions = {
  strength?: number;
};

/**
 * Magnetic pointer-follow via useSpring (transform only).
 * Desktop / full motion only — no-ops under reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(
  options: MagneticOptions = {},
) {
  const ref = useRef<T | null>(null);
  const { strength = 0.35 } = options;
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnetic);
  const springY = useSpring(y, SPRING.magnetic);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || getMotionLevel() !== 'full') return;

    const unsubX = springX.on('change', (v) => {
      el.style.transform = `translate3d(${v}px, ${springY.get()}px, 0)`;
    });
    const unsubY = springY.on('change', (v) => {
      el.style.transform = `translate3d(${springX.get()}px, ${v}px, 0)`;
    });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
      el.style.willChange = 'transform';
    };

    const onLeave = () => {
      x.set(0);
      y.set(0);
      // Clear will-change after spring settles
      window.setTimeout(() => {
        if (ref.current) ref.current.style.willChange = 'auto';
      }, 120);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      unsubX();
      unsubY();
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';
      el.style.willChange = 'auto';
    };
  }, [strength, reduced, springX, springY, x, y]);

  return ref;
}
