import { describe, expect, it } from 'vitest';
import {
  DURATION,
  EASING,
  STAGGER,
  VIEWPORT,
  SCROLL,
  fadeUp,
  fadeOnly,
  imageReveal,
  staggerContainer,
  profileDuration,
} from '@/lib/motion';

describe('motion tokens', () => {
  it('enforces 100 / 250 / 400ms timing bands', () => {
    expect(DURATION.micro).toBe(0.1);
    expect(DURATION.interaction).toBe(0.1);
    expect(DURATION.structural).toBe(0.25);
    expect(DURATION.element).toBe(0.25);
    expect(DURATION.section).toBe(0.25);
    expect(DURATION.hero).toBe(0.4);
    expect(DURATION.cinematic).toBe(0.4);
    expect(DURATION.skyTransit).toBe(1.4);
  });

  it('uses expo / cubic easings (never linear defaults)', () => {
    expect(EASING.easeOutExpo).toEqual([0.16, 1, 0.3, 1]);
    expect(EASING.easeInOutCubic).toEqual([0.65, 0, 0.35, 1]);
  });

  it('locks Lenis lerp near 0.1', () => {
    expect(SCROLL.lerp).toBe(0.1);
    expect(SCROLL.duration).toBe(DURATION.hero);
  });

  it('shares stagger + viewport rhythm', () => {
    expect(STAGGER.children).toBe(0.05);
    expect(VIEWPORT).toEqual({ once: true, amount: 0.3 });
  });

  it('defines compositor-safe reveal variants', () => {
    expect(fadeUp.hidden).toMatchObject({ opacity: 0, y: 16 });
    expect(fadeOnly.hidden).toEqual({ opacity: 0 });
    expect(imageReveal.hidden).toMatchObject({ opacity: 0, scale: 1.04 });
    expect(staggerContainer.visible).toBeTruthy();
  });

  it('scales durations by motion profile', () => {
    expect(profileDuration(1, 'advanced')).toBe(1);
    expect(profileDuration(1, 'optimized')).toBe(0.92);
    expect(profileDuration(1, 'light')).toBe(0.85);
    expect(profileDuration(1, 'off')).toBe(0);
  });
});
