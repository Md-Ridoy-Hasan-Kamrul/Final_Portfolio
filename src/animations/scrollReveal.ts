import { gsap, ScrollTrigger, EASE, getMotionLevel, prefersReducedMotion } from '../lib/motion';

type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
};

/**
 * Fade/slide children of `root` into view via ScrollTrigger.
 * Batch-friendly — one trigger per group.
 */
export function revealChildren(
  root: Element | null,
  childSelector: string,
  options: RevealOptions = {},
) {
  if (!root || prefersReducedMotion()) return;

  const level = getMotionLevel();
  const {
    y = level === 'reduced' ? 24 : 48,
    duration = level === 'reduced' ? 0.55 : 0.85,
    stagger = level === 'reduced' ? 0.06 : 0.1,
    start = 'top 85%',
    once = true,
  } = options;

  const targets = root.querySelectorAll(childSelector);
  if (!targets.length) return;

  gsap.set(targets, { opacity: 0, y, force3D: true });

  ScrollTrigger.batch(targets, {
    start,
    once,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: EASE.out,
        overwrite: 'auto',
      });
    },
  });
}

export function revealHeading(
  el: Element | null,
  options: { y?: number; duration?: number; start?: string } = {},
) {
  if (!el || prefersReducedMotion()) {
    if (el) gsap.set(el, { clearProps: 'all' });
    return;
  }

  const level = getMotionLevel();
  const y = options.y ?? (level === 'reduced' ? 20 : 40);
  const duration = options.duration ?? (level === 'reduced' ? 0.5 : 0.8);
  const start = options.start ?? 'top 88%';

  gsap.fromTo(
    el,
    { opacity: 0, y, force3D: true },
    {
      opacity: 1,
      y: 0,
      duration,
      ease: EASE.out,
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
    },
  );
}
