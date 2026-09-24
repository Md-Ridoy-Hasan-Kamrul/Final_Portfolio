import { DURATION, prefersReducedMotion, SCROLL } from '../lib/motion';
import { SECTION_TRANSITION_EVENT } from './sectionTransitionEvent';

type LenisLike = {
  scrollTo: (
    target: number,
    opts?: { duration?: number; immediate?: boolean },
  ) => void;
};

function performScroll(id: string) {
  const section = document.getElementById(id);
  if (!section) return;

  if (!prefersReducedMotion()) {
    window.dispatchEvent(
      new CustomEvent(SECTION_TRANSITION_EVENT, { detail: { id } }),
    );
  }

  const navEl = document.querySelector(
    'nav[aria-label="Main navigation"]',
  ) as HTMLElement | null;
  const navH = navEl?.getBoundingClientRect().height ?? 112;
  const offset = Math.max(0, navH - 8);
  const top = section.getBoundingClientRect().top + window.scrollY - offset;
  const y = Math.max(0, top);
  const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;

  document.documentElement.dataset.activeSection = id;

  if (lenis) {
    lenis.scrollTo(y, {
      duration: prefersReducedMotion() ? 0 : SCROLL.duration,
      immediate: prefersReducedMotion(),
    });
  } else {
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}

/**
 * Hash navigation with same-document View Transitions when supported.
 * Hero portrait / project thumbs use view-transition-name for morphing.
 */
export function scrollToHash(hash: string) {
  const id = hash.replace('#', '');
  if (!document.getElementById(id)) return;

  const reduced = prefersReducedMotion();
  const canVT =
    !reduced &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document;

  if (canVT) {
    (
      document as Document & {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      }
    ).startViewTransition(() => {
      performScroll(id);
    });
    return;
  }

  performScroll(id);
}

/** Token export for callers that need duration alignment */
export const HASH_SCROLL_DURATION = DURATION.hero;
