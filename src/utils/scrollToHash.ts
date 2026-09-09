import { prefersReducedMotion } from '../lib/motion';

type LenisLike = {
  scrollTo: (
    target: number,
    opts?: { duration?: number; immediate?: boolean }
  ) => void;
};

/** Scroll section top just under the fixed nav — tiny tuck to kill the leftover gap. */
export function scrollToHash(hash: string) {
  const id = hash.replace('#', '');
  const section = document.getElementById(id);
  if (!section) return;

  const navEl = document.querySelector(
    'nav[aria-label="Main navigation"]'
  ) as HTMLElement | null;
  const navH = navEl?.getBoundingClientRect().height ?? 112;
  // Slightly less than full nav height closes the small top gap
  const offset = Math.max(0, navH - 8);

  const top =
    section.getBoundingClientRect().top + window.scrollY - offset;

  const y = Math.max(0, top);
  const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;

  if (lenis) {
    lenis.scrollTo(y, {
      duration: prefersReducedMotion() ? 0 : 1.0,
      immediate: prefersReducedMotion(),
    });
  } else {
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}
