import { useEffect, useRef } from 'react';
import { gsap, getMotionLevel, EASE } from '../lib/motion';

type MagneticOptions = {
  strength?: number;
  ease?: number;
};

/**
 * Lightweight magnetic pull toward the cursor. Desktop / full motion only.
 */
export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}) {
  const ref = useRef<T | null>(null);
  const { strength = 0.35, ease = 0.18 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (getMotionLevel() !== 'full') return;

    let raf = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      gsap.set(el, { x: currentX, y: currentY, force3D: true });
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) * strength;
      targetY = (e.clientY - cy) * strength;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: EASE.out, overwrite: true });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [strength, ease]);

  return ref;
}
