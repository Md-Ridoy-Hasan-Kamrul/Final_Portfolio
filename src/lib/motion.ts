import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export type MotionLevel = 'full' | 'reduced' | 'none';

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

export function getMotionLevel(): MotionLevel {
  if (prefersReducedMotion()) return 'none';
  if (isMobileViewport()) return 'reduced';
  if (isTouchDevice()) return 'reduced';
  return 'full';
}

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
  soft: 'power2.out',
  elastic: 'elastic.out(1, 0.3)',
} as const;

/** Set will-change only while tweening; clear on complete to free GPU. */
export function withWillChange(
  targets: gsap.TweenTarget,
  props: gsap.TweenVars,
): gsap.core.Tween {
  const els = gsap.utils.toArray(targets) as HTMLElement[];
  els.forEach((el) => {
    el.style.willChange = 'transform, opacity';
  });
  return gsap.to(targets, {
    ...props,
    onComplete: () => {
      els.forEach((el) => {
        el.style.willChange = 'auto';
      });
      props.onComplete?.();
    },
  });
}

export function clearWillChange(targets: gsap.TweenTarget) {
  (gsap.utils.toArray(targets) as HTMLElement[]).forEach((el) => {
    el.style.willChange = 'auto';
  });
}
