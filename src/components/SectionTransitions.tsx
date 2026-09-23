import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Extreme-level cinematic section transitions.
 *
 * Instead of an overlay that hides/shows on scroll, this system
 * creates a fixed full-viewport "transition layer" that fires a
 * unique multi-step GSAP timeline each time the user crosses a
 * section boundary.  Each transition has:
 *
 *  - A themed color veil that sweeps or morphs
 *  - A high-energy glow streak
 *  - Particle-like bar elements
 *  - A flash burst at the peak
 *
 * 5 unique transitions cycle through, each radically different:
 *  1. Liquid Shutter   – vertical panels slam shut + glow streak
 *  2. Portal Warp      – circular iris expand + chromatic ring
 *  3. Diagonal Cascade – skew clip-path wipe + dual streaks
 *  4. Prism Split      – three diagonal panels peel apart + flash
 *  5. Ripple Pulse     – concentric circles + ascending bars
 */

const TRANSITIONS = [
  'liquidShutter',
  'portalWarp',
  'diagonalCascade',
  'prismSplit',
  'ripplePulse',
] as const;

type TransitionName = (typeof TRANSITIONS)[number];

type SectionTransitionsProps = {
  children: ReactNode;
};

type LayerRefs = {
  veil: HTMLDivElement | null;
  glow: HTMLDivElement | null;
  flash: HTMLDivElement | null;
  bars: HTMLDivElement[];
  ring1: HTMLDivElement | null;
  ring2: HTMLDivElement | null;
};

function resetAll(refs: LayerRefs) {
  const { veil, glow, flash, bars, ring1, ring2 } = refs;
  if (veil) gsap.set(veil, { opacity: 0, clipPath: 'inset(0 0 0 0)', background: 'transparent' });
  if (glow) gsap.set(glow, { opacity: 0, xPercent: 0, yPercent: 0, scaleX: 1, scaleY: 1, rotate: 0 });
  if (flash) gsap.set(flash, { opacity: 0 });
  if (ring1) gsap.set(ring1, { opacity: 0, scale: 0.1 });
  if (ring2) gsap.set(ring2, { opacity: 0, scale: 0.05 });
  bars.forEach((b) => gsap.set(b, { opacity: 0, scaleX: 0, scaleY: 0, xPercent: 0, yPercent: 0, rotate: 0 }));
}

function buildTimeline(
  refs: LayerRefs,
  name: TransitionName,
  isDark: boolean,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  const { veil, glow, flash, bars, ring1, ring2 } = refs;
  if (!veil || !glow || !flash) return tl;

  const veilBg = isDark
    ? 'linear-gradient(135deg, rgba(2,6,15,0.96), rgba(8,18,35,0.92))'
    : 'linear-gradient(135deg, rgba(240,245,250,0.96), rgba(220,230,240,0.92))';

  const glowBg = isDark
    ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.9), rgba(168,85,247,0.7), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(14,165,233,0.7), rgba(245,158,11,0.8), transparent)';

  const flashBg = isDark
    ? 'radial-gradient(ellipse at center, rgba(56,189,248,0.6) 0%, transparent 50%)'
    : 'radial-gradient(ellipse at center, rgba(251,191,36,0.5) 0%, transparent 50%)';

  gsap.set(veil, { background: veilBg });
  gsap.set(glow, { background: glowBg });
  gsap.set(flash, { background: flashBg });

  if (name === 'liquidShutter') {
    bars.forEach((b, i) => {
      gsap.set(b, {
        left: `${(i / bars.length) * 100}%`,
        width: `${100 / bars.length + 0.5}%`,
        top: 0,
        height: '100%',
        background: isDark ? 'rgba(3,8,18,0.97)' : 'rgba(235,240,245,0.97)',
        borderRadius: '0',
      });
    });
    tl
      .to(bars, {
        scaleY: 1,
        opacity: 1,
        stagger: { each: 0.04, from: 'center' },
        duration: 0.35,
        ease: 'power4.inOut',
      })
      .to(glow, {
        opacity: 1,
        xPercent: 100,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '<0.1')
      .to(flash, { opacity: 0.7, duration: 0.12, ease: 'power2.in' }, '<0.15')
      .to(flash, { opacity: 0, duration: 0.2 }, '<0.12')
      .to(bars, {
        scaleY: 0,
        opacity: 0,
        stagger: { each: 0.03, from: 'edges' },
        duration: 0.3,
        ease: 'power4.inOut',
      }, '>')
      .to(glow, { opacity: 0, duration: 0.2 }, '<');
    return tl;
  }

  if (name === 'portalWarp') {
    if (ring1) gsap.set(ring1, { borderColor: isDark ? 'rgba(56,189,248,0.8)' : 'rgba(14,165,233,0.7)' });
    if (ring2) gsap.set(ring2, { borderColor: isDark ? 'rgba(168,85,247,0.7)' : 'rgba(245,158,11,0.6)' });
    gsap.set(veil, { clipPath: 'circle(0% at 50% 50%)' });
    tl
      .to(veil, { opacity: 1, clipPath: 'circle(80% at 50% 50%)', duration: 0.5, ease: 'power3.in' })
      .to(ring1, { opacity: 1, scale: 1.8, duration: 0.4, ease: 'power2.out' }, '<0.1')
      .to(ring2, { opacity: 1, scale: 1.4, duration: 0.35, ease: 'power2.out' }, '<0.08')
      .to(flash, { opacity: 0.6, duration: 0.1 }, '<0.2')
      .to(flash, { opacity: 0, duration: 0.25 }, '<0.1')
      .to(veil, { clipPath: 'circle(160% at 50% 50%)', duration: 0.5, ease: 'power3.out' })
      .to(ring1, { opacity: 0, scale: 3, duration: 0.35 }, '<0.05')
      .to(ring2, { opacity: 0, scale: 2.5, duration: 0.3 }, '<')
      .to(veil, { opacity: 0, duration: 0.15 });
    return tl;
  }

  if (name === 'diagonalCascade') {
    gsap.set(veil, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' });
    gsap.set(glow, { width: '20%', height: '160%', top: '-30%', left: '0%', rotate: 12 });
    tl
      .to(veil, {
        opacity: 1,
        clipPath: 'polygon(0 0, 120% 0, 90% 100%, 0 100%)',
        duration: 0.5,
        ease: 'power4.inOut',
      })
      .to(glow, { opacity: 1, xPercent: 450, duration: 0.45, ease: 'power3.out' }, '<0.05')
      .to(flash, { opacity: 0.5, duration: 0.1 }, '<0.2')
      .to(flash, { opacity: 0, duration: 0.2 }, '<0.08')
      .to(veil, {
        clipPath: 'polygon(20% 0, 140% 0, 110% 100%, 0 100%)',
        duration: 0.45,
        ease: 'power3.inOut',
      })
      .to(glow, { opacity: 0, xPercent: 600, duration: 0.3 }, '<')
      .to(veil, { opacity: 0, duration: 0.15 });
    return tl;
  }

  if (name === 'prismSplit') {
    const panelColors = isDark
      ? ['rgba(2,8,20,0.97)', 'rgba(5,12,25,0.97)', 'rgba(3,10,22,0.97)']
      : ['rgba(235,240,248,0.97)', 'rgba(225,235,245,0.97)', 'rgba(240,245,250,0.97)'];
    bars.slice(0, 3).forEach((b, i) => {
      gsap.set(b, {
        left: `${i * 33.33}%`,
        width: '34%',
        top: 0,
        height: '100%',
        background: panelColors[i],
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        borderRadius: '0',
      });
    });
    tl
      .to(bars.slice(0, 3), {
        opacity: 1,
        scaleX: 1,
        stagger: 0.06,
        duration: 0.3,
        ease: 'power3.inOut',
      })
      .to(glow, { opacity: 1, xPercent: 200, duration: 0.4, ease: 'power2.out' }, '<0.1')
      .to(flash, { opacity: 0.8, duration: 0.08 }, '<0.15')
      .to(flash, { opacity: 0, duration: 0.22 }, '<0.06')
      .to(bars[0], { xPercent: -120, opacity: 0, duration: 0.4, ease: 'power4.inOut' }, '>')
      .to(bars[2], { xPercent: 120, opacity: 0, duration: 0.4, ease: 'power4.inOut' }, '<')
      .to(bars[1], { scaleY: 0, opacity: 0, duration: 0.3, ease: 'power3.inOut' }, '<0.05')
      .to(glow, { opacity: 0, duration: 0.15 }, '<');
    return tl;
  }

  // ripplePulse
  if (ring1) gsap.set(ring1, { borderColor: isDark ? 'rgba(56,189,248,0.8)' : 'rgba(14,165,233,0.7)' });
  if (ring2) gsap.set(ring2, { borderColor: isDark ? 'rgba(34,211,238,0.6)' : 'rgba(251,191,36,0.5)' });
  gsap.set(veil, { clipPath: 'circle(0% at 50% 100%)' });
  bars.forEach((b, i) => {
    gsap.set(b, {
      left: `${(i / bars.length) * 100}%`,
      width: `${100 / bars.length + 0.5}%`,
      bottom: 0,
      top: 'auto',
      height: '0%',
      background: isDark ? 'rgba(56,189,248,0.15)' : 'rgba(14,165,233,0.12)',
      borderRadius: '0',
    });
  });
  tl
    .to(bars, {
      height: '100%',
      opacity: 0.6,
      stagger: 0.04,
      duration: 0.3,
      ease: 'power2.out',
    })
    .to(veil, { opacity: 1, clipPath: 'circle(120% at 50% 100%)', duration: 0.5, ease: 'power3.out' }, '<')
    .to(ring1, { opacity: 1, scale: 2.5, duration: 0.4, ease: 'power2.out' }, '<0.1')
    .to(ring2, { opacity: 1, scale: 1.8, duration: 0.35, ease: 'power2.out' }, '<0.08')
    .to(flash, { opacity: 0.5, duration: 0.1 }, '<0.15')
    .to(flash, { opacity: 0, duration: 0.2 }, '<0.08')
    .to(bars, { height: '0%', opacity: 0, stagger: 0.03, duration: 0.25, ease: 'power2.in' }, '>')
    .to(veil, { opacity: 0, clipPath: 'circle(0% at 50% 0%)', duration: 0.4, ease: 'power3.inOut' }, '<0.05')
    .to(ring1, { opacity: 0, scale: 4, duration: 0.3 }, '<')
    .to(ring2, { opacity: 0, scale: 3, duration: 0.25 }, '<');
  return tl;
}

export default function SectionTransitions({ children }: SectionTransitionsProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const barRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    const sections = Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && Boolean(child.id),
    );
    if (sections.length < 2) return;

    const refs: LayerRefs = {
      veil: veilRef.current,
      glow: glowRef.current,
      flash: flashRef.current,
      bars: barRefs.current.filter(Boolean),
      ring1: ring1Ref.current,
      ring2: ring2Ref.current,
    };

    resetAll(refs);

    const ctx = gsap.context(() => {
      sections.slice(0, -1).forEach((section, index) => {
        const name = TRANSITIONS[index % TRANSITIONS.length];
        const tl = buildTimeline(refs, name, theme === 'dark');

        ScrollTrigger.create({
          trigger: section,
          start: 'bottom 75%',
          end: 'bottom 25%',
          scrub: 0.8,
          animation: tl,
          onLeaveBack: () => {
            tl.progress(0).pause();
            resetAll(refs);
          },
          onLeave: () => {
            tl.progress(1).pause();
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, container);

    return () => ctx.revert();
  }, [theme]);

  return (
    <div ref={containerRef}>
      {children}
      <div
        ref={layerRef}
        className='pointer-events-none fixed inset-0 z-[55] overflow-hidden'
        aria-hidden='true'
      >
        <div ref={veilRef} className='absolute inset-0 will-change-[clip-path,opacity]' />
        <div ref={flashRef} className='absolute inset-0 will-change-opacity' />
        <div ref={glowRef} className='absolute rounded-full blur-lg will-change-transform' />
        <div
          ref={ring1Ref}
          className='pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(80vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 will-change-[transform,opacity]'
        />
        <div
          ref={ring2Ref}
          className='pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(60vw,450px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 will-change-[transform,opacity]'
        />
        <div className='absolute inset-0'>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) barRefs.current[i] = el;
              }}
              className='absolute opacity-0 will-change-transform'
            />
          ))}
        </div>
      </div>
    </div>
  );
}
