import { useEffect, useRef } from 'react';
import { gsap, getMotionLevel, prefersReducedMotion } from '../lib/motion';

/**
 * Contextual cursor label for `[data-cursor="View"]` etc.
 * Transform/opacity only; desktop + full motion.
 */
export default function CursorLabel() {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const label = labelRef.current;
    if (!label) return;
    if (prefersReducedMotion() || getMotionLevel() !== 'full') return;

    const xTo = gsap.quickTo(label, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(label, 'y', { duration: 0.28, ease: 'power3.out' });

    gsap.set(label, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.85 });

    let raf = 0;
    let mx = 0;
    let my = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          xTo(mx + 18);
          yTo(my + 18);
          raf = 0;
        });
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest('[data-cursor]') as
        | HTMLElement
        | null;
      if (!t) return;
      const text = t.getAttribute('data-cursor') || '';
      label.textContent = text;
      label.style.willChange = 'transform, opacity';
      gsap.to(label, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest?.('[data-cursor]')) return;
      gsap.to(label, {
        opacity: 0,
        scale: 0.85,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => {
          label.style.willChange = 'auto';
        },
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (typeof window !== 'undefined' && getMotionLevel() !== 'full') {
    return null;
  }

  return (
    <div
      ref={labelRef}
      className='pointer-events-none fixed left-0 top-0 z-[10000] rounded-full bg-gray-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white opacity-0 shadow-lg dark:bg-white dark:text-gray-900'
      aria-hidden='true'
    />
  );
}
