import { gsap, EASE, getMotionLevel, prefersReducedMotion } from '../lib/motion';

/**
 * Staggered clip / fade reveal for a list of elements (hero labels, lines).
 */
export function playStaggerReveal(
  elements: gsap.TweenTarget,
  options: { delay?: number; y?: number; stagger?: number; duration?: number } = {},
) {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, clearProps: 'clipPath' });
    return null;
  }

  const level = getMotionLevel();
  const {
    delay = 0,
    y = level === 'reduced' ? 20 : 36,
    stagger = level === 'reduced' ? 0.08 : 0.12,
    duration = level === 'reduced' ? 0.55 : 0.9,
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y, force3D: true },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: EASE.out,
    },
  );
}

/**
 * Choreographed hero entrance timeline.
 */
export function createHeroTimeline(scope: HTMLElement) {
  const level = getMotionLevel();
  if (prefersReducedMotion() || level === 'none') {
    gsap.set(scope.querySelectorAll('[data-hero]'), { opacity: 1, y: 0, scale: 1 });
    return null;
  }

  const greeting = scope.querySelector('[data-hero="greeting"]');
  const title = scope.querySelector('[data-hero="title"]');
  const role = scope.querySelector('[data-hero="role"]');
  const body = scope.querySelector('[data-hero="body"]');
  const ctas = scope.querySelectorAll('[data-hero="cta"]');
  const socials = scope.querySelectorAll('[data-hero="social"]');
  const portrait = scope.querySelector('[data-hero="portrait"]');
  const orbs = scope.querySelectorAll('[data-hero="orb"]');

  const y = level === 'reduced' ? 24 : 40;
  const tl = gsap.timeline({ defaults: { ease: EASE.out } });

  gsap.set([greeting, title, role, body, ...ctas, ...socials, portrait].filter(Boolean), {
    opacity: 0,
    y,
    force3D: true,
  });
  if (portrait) gsap.set(portrait, { scale: 0.92 });

  if (orbs.length && level === 'full') {
    gsap.set(orbs, { opacity: 0, scale: 0.8 });
    tl.to(orbs, { opacity: 1, scale: 1, duration: 1.2, stagger: 0.15 }, 0);
  }

  if (greeting) tl.to(greeting, { opacity: 1, y: 0, duration: 0.6 }, 0.15);
  if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.85 }, 0.28);
  if (role) tl.to(role, { opacity: 1, y: 0, duration: 0.7 }, 0.48);
  if (body) tl.to(body, { opacity: 1, y: 0, duration: 0.7 }, 0.62);
  if (ctas.length) tl.to(ctas, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.78);
  if (socials.length) tl.to(socials, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.95);
  if (portrait) {
    tl.to(
      portrait,
      { opacity: 1, y: 0, scale: 1, duration: level === 'reduced' ? 0.7 : 1 },
      0.35,
    );
  }

  if (portrait && level === 'full') {
    gsap.to(portrait, {
      y: -14,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.4,
    });
  }

  return tl;
}
