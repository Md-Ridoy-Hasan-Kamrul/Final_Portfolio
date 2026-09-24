import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  ScrollTrigger,
  prefersReducedMotion,
  getMotionProfile,
  SCROLL,
  EASING,
} from '../lib/motion';
import { scrollToHash } from '../utils/scrollToHash';

type SmoothScrollProps = {
  children: React.ReactNode;
};

/**
 * Virtual smooth-scroll wrapper — Lenis lerp ≈ 0.1
 * Decouples scroll rendering from the native thread (weighted fluid nav).
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const profile = getMotionProfile();
    if (profile === 'off') return;

    // Strict token: lerp ~0.1 on all profiles (slightly higher on light for snappier feel)
    const lerp = profile === 'light' ? 0.14 : SCROLL.lerp;

    const lenis = new Lenis({
      duration: SCROLL.duration,
      easing: (t) => {
        void EASING.easeOutExpo;
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: profile === 'light' ? 1.1 : 1.4,
      wheelMultiplier: 1,
      lerp,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;
      if (target.closest('nav')) return;
      e.preventDefault();
      scrollToHash(href);
      window.history.pushState({}, '', href);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

export { scrollToHash } from '../utils/scrollToHash';
