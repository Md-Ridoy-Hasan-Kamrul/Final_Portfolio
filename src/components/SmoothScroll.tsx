import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ScrollTrigger, prefersReducedMotion, gsap } from '../lib/motion';

type SmoothScrollProps = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

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
      const navHeight = window.innerWidth >= 768 ? 100 : 80;
      scrollToHash(href, navHeight);
      window.history.pushState({}, '', href);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

export function scrollToHash(hash: string, offset = 96) {
  const id = hash.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  if (lenis) {
    lenis.scrollTo(top, { duration: 1.15 });
  } else {
    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}
