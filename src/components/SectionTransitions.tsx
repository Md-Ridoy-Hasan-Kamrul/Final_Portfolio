import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useTheme } from '../contexts/ThemeContext';

const EFFECTS = [
  'shutter',
  'portal',
  'diagonal',
  'chromatic',
  'ripple',
] as const;

type EffectName = (typeof EFFECTS)[number];

type SectionTransitionsProps = {
  children: ReactNode;
};

type TransitionRefs = {
  veil: HTMLDivElement | null;
  glow: HTMLDivElement | null;
  bars: HTMLDivElement[];
};

function setInitialState(refs: TransitionRefs) {
  if (!refs.veil || !refs.glow) return;
  gsap.set(refs.veil, { opacity: 0, clipPath: 'inset(0 100% 0 0)' });
  gsap.set(refs.glow, { opacity: 0, xPercent: -100, rotate: 0, scale: 1 });
  gsap.set(refs.bars, { scaleX: 0, scaleY: 0, opacity: 0, xPercent: 0, yPercent: 0 });
}

function buildTransition(
  timeline: gsap.core.Timeline,
  refs: TransitionRefs,
  effect: EffectName,
  isDark: boolean,
) {
  if (!refs.veil || !refs.glow) return;

  const veilColor = isDark
    ? 'rgba(3, 8, 18, 0.94)'
    : 'rgba(235, 240, 244, 0.94)';
  const glowColor = isDark
    ? 'linear-gradient(90deg, transparent, rgba(96,165,250,.95), rgba(45,212,191,.8), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(14,116,144,.75), rgba(245,158,11,.8), transparent)';

  gsap.set(refs.veil, { background: veilColor });
  gsap.set(refs.glow, { background: glowColor });

  if (effect === 'shutter') {
    timeline
      .to(refs.veil, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.42, ease: 'power3.inOut' })
      .to(refs.bars, { opacity: 0.9, scaleY: 1, stagger: 0.035, duration: 0.24, ease: 'power2.out' }, '<0.06')
      .to(refs.glow, { opacity: 1, xPercent: 0, duration: 0.24, ease: 'power2.out' }, '<')
      .to(refs.bars, { opacity: 0, scaleY: 0, stagger: 0.035, duration: 0.26, ease: 'power2.in' })
      .to(refs.veil, { opacity: 0, clipPath: 'inset(0 0% 0 100%)', duration: 0.44, ease: 'power3.inOut' }, '<0.08')
      .to(refs.glow, { opacity: 0, xPercent: 100, duration: 0.32 }, '<');
    return;
  }

  if (effect === 'portal') {
    timeline
      .set(refs.veil, { clipPath: 'circle(0% at 50% 50%)' })
      .to(refs.veil, { opacity: 1, clipPath: 'circle(78% at 50% 50%)', duration: 0.46, ease: 'power3.in' })
      .to(refs.glow, { opacity: 0.95, scale: 1.5, xPercent: 0, duration: 0.25, ease: 'power2.out' }, '<0.16')
      .to(refs.veil, { clipPath: 'circle(150% at 50% 50%)', duration: 0.46, ease: 'power3.out' })
      .to(refs.glow, { opacity: 0, scale: 3, duration: 0.34 }, '<0.04')
      .set(refs.veil, { opacity: 0 });
    return;
  }

  if (effect === 'diagonal') {
    timeline
      .set(refs.veil, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' })
      .to(refs.veil, { opacity: 1, clipPath: 'polygon(0 0, 115% 0, 85% 100%, 0 100%)', duration: 0.46, ease: 'power4.inOut' })
      .to(refs.glow, { opacity: 1, xPercent: 0, rotate: -8, duration: 0.28, ease: 'power2.out' }, '<0.08')
      .to(refs.veil, { clipPath: 'polygon(15% 0, 130% 0, 100% 100%, 0 100%)', duration: 0.44, ease: 'power3.out' })
      .to(refs.glow, { opacity: 0, xPercent: 115, duration: 0.3 }, '<')
      .to(refs.veil, { opacity: 0, duration: 0.2 });
    return;
  }

  if (effect === 'chromatic') {
    timeline
      .set(refs.veil, { clipPath: 'inset(0 0 0 100%)' })
      .to(refs.veil, { opacity: 1, clipPath: 'inset(0 0 0 0%)', duration: 0.42, ease: 'power3.inOut' })
      .to(refs.glow, { opacity: 1, xPercent: 0, scaleX: 1.6, duration: 0.25, ease: 'expo.out' }, '<0.08')
      .to(refs.veil, { clipPath: 'inset(0 100% 0 0%)', duration: 0.52, ease: 'power4.inOut' })
      .to(refs.glow, { opacity: 0, xPercent: -120, scaleX: 0.8, duration: 0.34 }, '<')
      .to(refs.veil, { opacity: 0, duration: 0.12 });
    return;
  }

  timeline
    .set(refs.veil, { clipPath: 'circle(0% at 50% 100%)' })
    .to(refs.veil, { opacity: 1, clipPath: 'circle(110% at 50% 100%)', duration: 0.5, ease: 'power3.out' })
    .to(refs.bars, { opacity: 0.7, scaleX: 1, stagger: 0.04, duration: 0.24, ease: 'power2.out' }, '<0.08')
    .to(refs.glow, { opacity: 0.9, yPercent: -30, xPercent: 0, duration: 0.28 }, '<')
    .to(refs.bars, { opacity: 0, scaleX: 0, stagger: 0.04, duration: 0.25 })
    .to(refs.veil, { opacity: 0, clipPath: 'circle(0% at 50% 0%)', duration: 0.48, ease: 'power3.inOut' }, '<0.04')
    .to(refs.glow, { opacity: 0, yPercent: -120, duration: 0.36 }, '<');
}

export default function SectionTransitions({ children }: SectionTransitionsProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const veil = veilRef.current;
    const glow = glowRef.current;
    if (!container || !overlay || !veil || !glow) return;

    const sections = Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && Boolean(child.id),
    );
    if (sections.length < 2) return;

    const refs: TransitionRefs = { veil, glow, bars: barRefs.current };
    setInitialState(refs);

    const ctx = gsap.context(() => {
      sections.slice(0, -1).forEach((section, index) => {
        const timeline = gsap.timeline({ paused: true });
        buildTransition(timeline, refs, EFFECTS[index % EFFECTS.length], theme === 'dark');

        ScrollTrigger.create({
          trigger: section,
          start: 'bottom 78%',
          end: 'bottom 22%',
          scrub: 0.7,
          animation: timeline,
          onLeaveBack: () => {
            timeline.progress(0).pause();
            setInitialState(refs);
          },
          onLeave: () => {
            timeline.progress(1).pause();
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
      <div ref={overlayRef} className='pointer-events-none fixed inset-0 z-[45] overflow-hidden' aria-hidden='true'>
        <div ref={veilRef} className='absolute inset-0 will-change-[clip-path,opacity]' />
        <div ref={glowRef} className='absolute left-[-15%] top-[-15%] h-[130%] w-[18%] rounded-full blur-xl will-change-transform' />
        <div className='absolute inset-0 flex flex-col justify-between py-[8vh]'>
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              ref={(element) => {
                if (element) barRefs.current[index] = element;
              }}
              className='h-px w-full origin-left bg-white/30 opacity-0'
            />
          ))}
        </div>
      </div>
    </div>
  );
}
