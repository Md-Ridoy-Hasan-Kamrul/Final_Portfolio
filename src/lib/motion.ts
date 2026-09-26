import type { Transition, Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/* ═══════════════════════════════════════════════════════════
 * STRICT MOTION DESIGN TOKENS (Performance Architecture)
 *
 *  micro        100ms  — hover / tap / cursor micro-feedback
 *  structural   250ms  — baseline UI & section structure (200–300)
 *  hero         400ms  — full-viewport / hero / page morph
 *  skyTransit  1400ms  — day/night celestial diagonal flight
 *
 * Compositor-only: transform · opacity · clip-path
 * Never animate: width, height, top, left, margin, padding, box-shadow
 * ═══════════════════════════════════════════════════════════ */

export const DURATION = {
  /** Micro-interactions — ≤100ms */
  micro: 0.1,
  /** Alias kept for call sites that say "interaction" */
  interaction: 0.1,
  /** Standard structural transitions — 200–300ms band */
  structural: 0.25,
  element: 0.25,
  section: 0.25,
  /** Full-screen hero / route morph */
  hero: 0.4,
  page: 0.4,
  cinematic: 0.4,
  /** Theme day/night sky flight (BL ↔ TR) */
  skyTransit: 1.4,
} as const;

/** CSS custom-property mirrors (seconds → ms strings for stylesheets) */
export const DURATION_CSS = {
  micro: '100ms',
  structural: '250ms',
  hero: '400ms',
  skyTransit: '1400ms',
} as const;

export const EASING = {
  /** Deceleration — entrances, reveals */
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  /** Symmetric — loops, parallax scrub feel */
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,
  /** Snappy UI exit */
  easeInCubic: [0.32, 0, 0.67, 0] as const,
} as const;

export const EASING_CSS = {
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
} as const;

export const STAGGER = {
  children: 0.05,
  delay: 0.06,
} as const;

export const VIEWPORT = {
  once: true,
  amount: 0.3,
} as const;

/** Lenis virtual scroll — weighted inertia decoupled from native thread */
export const SCROLL = {
  lerp: 0.1,
  duration: DURATION.hero,
} as const;

export const SPRING = {
  magnetic: { stiffness: 280, damping: 28, mass: 0.35 },
  soft: { stiffness: 180, damping: 26, mass: 0.5 },
  snappy: { stiffness: 420, damping: 32, mass: 0.28 },
} as const;

export const transition = {
  micro: {
    duration: DURATION.micro,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  interaction: {
    duration: DURATION.interaction,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  structural: {
    duration: DURATION.structural,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  element: {
    duration: DURATION.element,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  section: {
    duration: DURATION.section,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  hero: {
    duration: DURATION.hero,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  cinematic: {
    duration: DURATION.cinematic,
    ease: EASING.easeOutExpo,
  } satisfies Transition,
  skyTransit: {
    duration: DURATION.skyTransit,
    ease: EASING.easeInOutCubic,
  } satisfies Transition,
  parallax: {
    duration: DURATION.structural,
    ease: EASING.easeInOutCubic,
  } satisfies Transition,
  loop: {
    duration: 8,
    ease: EASING.easeInOutCubic,
    repeat: Infinity,
  } satisfies Transition,
} as const;

/** Spatial entrance — transform + opacity only */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.structural,
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transition.structural,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.children,
      delayChildren: STAGGER.delay,
      ease: EASING.easeOutExpo,
    },
  },
};

export const fadeUpHero: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.hero,
  },
};

export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transition.structural,
  },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transition.hero,
  },
};

/** Vestibular-safe: opacity cross-fade only (no translate / scale / rotate) */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.structural, ease: EASING.easeOutExpo },
  },
};

export const instantShow: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0 } },
};

/* ── Device motion profiles ──────────────────────────────── */

export type MotionLevel = 'full' | 'reduced' | 'none';
export type MotionProfile = 'advanced' | 'optimized' | 'light' | 'off';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches;
}

export function getMotionLevel(): MotionLevel {
  if (prefersReducedMotion()) return 'none';
  if (isMobileViewport()) return 'reduced';
  if (isTouchDevice()) return 'reduced';
  return 'full';
}

export function getMotionProfile(): MotionProfile {
  if (prefersReducedMotion()) return 'off';
  if (isMobileViewport()) return 'light';
  if (isTabletViewport() || isTouchDevice()) return 'optimized';
  return 'advanced';
}

export function profileDuration(base: number, profile: MotionProfile): number {
  switch (profile) {
    case 'off':
      return 0;
    case 'light':
      return base * 0.85;
    case 'optimized':
      return base * 0.92;
    default:
      return base;
  }
}

export function revealVariants(reduced: boolean | null): Variants {
  if (reduced) return fadeOnly;
  return fadeUp;
}

export function revealContainer(reduced: boolean | null): Variants {
  return reduced ? fadeOnly : staggerContainer;
}

/* ── GSAP token map (no default "ease" / linear for motion) ─ */

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
  soft: 'power2.out',
  in: 'power3.in',
  elastic: 'elastic.out(1, 0.3)',
} as const;

/**
 * Apply will-change ONLY for the tween lifetime, then clear.
 * Prevents permanent compositor layers / VRAM leaks.
 */
export function withWillChange(
  targets: gsap.TweenTarget,
  props: gsap.TweenVars,
  propsHint: string = 'transform, opacity',
): gsap.core.Tween {
  const els = gsap.utils.toArray(targets) as HTMLElement[];
  els.forEach((el) => {
    el.style.willChange = propsHint;
  });
  return gsap.to(targets, {
    ...props,
    onComplete: () => {
      els.forEach((el) => {
        el.style.willChange = 'auto';
      });
      props.onComplete?.();
    },
    onInterrupt: () => {
      els.forEach((el) => {
        el.style.willChange = 'auto';
      });
      props.onInterrupt?.();
    },
  });
}

export function clearWillChange(targets: gsap.TweenTarget) {
  (gsap.utils.toArray(targets) as HTMLElement[]).forEach((el) => {
    el.style.willChange = 'auto';
  });
}

/** Arm will-change for a CSS transition, clear on transitionend / timeout */
export function armWillChange(
  el: HTMLElement,
  props: string = 'transform, opacity',
  ms: number = DURATION.structural * 1000 + 50,
) {
  el.style.willChange = props;
  const clear = () => {
    el.style.willChange = 'auto';
    el.removeEventListener('transitionend', clear);
    el.removeEventListener('animationend', clear);
  };
  el.addEventListener('transitionend', clear, { once: true });
  el.addEventListener('animationend', clear, { once: true });
  window.setTimeout(clear, ms);
}
