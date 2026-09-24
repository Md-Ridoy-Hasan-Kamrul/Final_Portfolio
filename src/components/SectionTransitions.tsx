import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Cinematic section boundary transitions (GSAP one-shot, not weak scrub).
 *
 * Home → About gets the signature “Horizon Rift” — heavy, eye-catching,
 * brand-locked (bone / crimson / gold / void). Other boundaries cycle
 * unique heavy variants so the page never feels like the same wipe twice.
 */

const TRANSITIONS = [
  'horizonRift', // Home → About (signature)
  'bladeGuillotine', // About → Experience
  'inkBloom', // Experience → Projects
  'prismBreach', // Projects → Skills
  'vortexStamp', // Skills → Contact
] as const;

type TransitionName = (typeof TRANSITIONS)[number];

const SECTION_LABELS = [
  'ABOUT',
  'EXPERIENCE',
  'PROJECTS',
  'SKILLS',
  'CONTACT',
] as const;

type SectionTransitionsProps = {
  children: ReactNode;
};

type LayerRefs = {
  root: HTMLDivElement | null;
  veil: HTMLDivElement | null;
  grain: HTMLDivElement | null;
  blade: HTMLDivElement | null;
  flash: HTMLDivElement | null;
  label: HTMLDivElement | null;
  sub: HTMLDivElement | null;
  ring: HTMLDivElement | null;
  bars: HTMLDivElement[];
};

const BRAND = {
  void: '#041018',
  voidDeep: '#02060c',
  bone: '#E8E2D6',
  crimson: '#DF3640',
  gold: '#C6A75E',
  ink: '#0a0c12',
};

function resetAll(refs: LayerRefs) {
  const { veil, grain, blade, flash, label, sub, ring, bars } = refs;
  gsap.killTweensOf(
    [veil, grain, blade, flash, label, sub, ring, ...bars].filter(Boolean),
  );
  if (veil) {
    gsap.set(veil, {
      opacity: 0,
      clipPath: 'inset(0 0 0 0)',
      background: BRAND.voidDeep,
      scale: 1,
      rotate: 0,
      xPercent: 0,
      yPercent: 0,
    });
  }
  if (grain) gsap.set(grain, { opacity: 0 });
  if (blade) {
    gsap.set(blade, {
      opacity: 0,
      scaleX: 0,
      scaleY: 1,
      xPercent: -50,
      yPercent: -50,
      left: '50%',
      top: '50%',
      width: '140%',
      height: '3px',
      rotate: 0,
      borderRadius: '0',
      background: `linear-gradient(90deg, transparent, ${BRAND.gold}, ${BRAND.crimson}, ${BRAND.gold}, transparent)`,
    });
  }
  if (flash) gsap.set(flash, { opacity: 0, scale: 1 });
  if (label) {
    gsap.set(label, {
      opacity: 0,
      scale: 0.7,
      yPercent: 20,
      letterSpacing: '0.4em',
      filter: 'blur(18px)',
    });
  }
  if (sub) gsap.set(sub, { opacity: 0, y: 24 });
  if (ring) gsap.set(ring, { opacity: 0, scale: 0.15, borderColor: BRAND.gold });
  bars.forEach((b) =>
    gsap.set(b, {
      opacity: 0,
      scaleX: 1,
      scaleY: 0,
      xPercent: 0,
      yPercent: 0,
      rotate: 0,
      clipPath: 'none',
      left: '0%',
      top: '0%',
      width: '100%',
      height: '100%',
      background: BRAND.void,
    }),
  );
}

function setLabel(refs: LayerRefs, text: string) {
  if (refs.label) refs.label.textContent = text;
}

function buildTimeline(
  refs: LayerRefs,
  name: TransitionName,
  labelText: string,
  isDark: boolean,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });
  const { veil, grain, blade, flash, label, sub, ring, bars } = refs;
  if (!veil || !blade || !flash || !label) return tl;

  setLabel(refs, labelText);
  const veilColor = isDark ? BRAND.voidDeep : '#f2ebe2';
  const labelColor = isDark ? BRAND.bone : BRAND.ink;
  gsap.set(veil, { background: veilColor });
  gsap.set(label, { color: labelColor });
  if (sub) {
    sub.textContent = 'ENTERING';
    gsap.set(sub, { color: isDark ? BRAND.gold : BRAND.crimson });
  }

  /* ── 1. Home → About: Horizon Rift ─────────────────────────── */
  if (name === 'horizonRift') {
    bars.forEach((b, i) => {
      const n = bars.length;
      gsap.set(b, {
        left: `${(i / n) * 100}%`,
        width: `${100 / n + 0.6}%`,
        top: 0,
        height: '100%',
        scaleY: 0,
        transformOrigin: i % 2 === 0 ? 'top center' : 'bottom center',
        background:
          i % 3 === 0
            ? BRAND.voidDeep
            : i % 3 === 1
              ? '#061018'
              : '#0a1520',
        opacity: 1,
      });
    });
    gsap.set(blade, {
      height: '4px',
      width: '160%',
      top: '50%',
      rotate: 0,
      scaleX: 0,
      background: `linear-gradient(90deg, transparent 0%, ${BRAND.bone} 20%, ${BRAND.gold} 45%, ${BRAND.crimson} 55%, ${BRAND.gold} 70%, transparent 100%)`,
      boxShadow: `0 0 40px ${BRAND.crimson}, 0 0 80px ${BRAND.gold}`,
    });

    tl
      // Blackout slam
      .set(veil, { opacity: 0, clipPath: 'inset(50% 0 50% 0)' })
      .to(veil, {
        opacity: 1,
        clipPath: 'inset(0% 0 0% 0)',
        duration: 0.45,
        ease: 'power4.in',
      })
      .to(grain, { opacity: 0.35, duration: 0.2 }, '<0.15')
      // Horizontal light blade tears open
      .to(
        blade,
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.35,
          ease: 'power4.out',
        },
        '-=0.1',
      )
      .to(
        blade,
        {
          height: '100%',
          opacity: 0.85,
          duration: 0.28,
          ease: 'power3.in',
        },
        '-=0.05',
      )
      .to(flash, { opacity: 0.9, duration: 0.08, ease: 'none' }, '<0.12')
      .to(flash, { opacity: 0, duration: 0.25 }, '>')
      // Giant title stamp
      .fromTo(
        sub,
        { opacity: 0, y: 30, letterSpacing: '0.6em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.35em',
          duration: 0.35,
          ease: 'power3.out',
        },
        '-=0.35',
      )
      .fromTo(
        label,
        {
          opacity: 0,
          scale: 1.45,
          yPercent: 10,
          filter: 'blur(24px)',
          letterSpacing: '0.55em',
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          letterSpacing: '0.12em',
          duration: 0.55,
          ease: 'expo.out',
        },
        '-=0.25',
      )
      // Vertical blinds peel
      .to(
        bars,
        {
          scaleY: 1,
          duration: 0.4,
          stagger: { each: 0.035, from: 'center' },
          ease: 'power3.inOut',
        },
        '-=0.2',
      )
      .to(blade, { opacity: 0, duration: 0.2 }, '<')
      // Hold beat then explode open
      .to(label, {
        scale: 1.08,
        opacity: 0.95,
        duration: 0.22,
        ease: 'power1.inOut',
      })
      .to(
        bars,
        {
          scaleY: 0,
          opacity: 0,
          stagger: { each: 0.028, from: 'edges' },
          duration: 0.42,
          ease: 'power4.inOut',
        },
        '+=0.08',
      )
      .to(
        label,
        {
          opacity: 0,
          scale: 0.85,
          filter: 'blur(12px)',
          yPercent: -18,
          duration: 0.35,
          ease: 'power3.in',
        },
        '<0.05',
      )
      .to(sub, { opacity: 0, y: -16, duration: 0.25 }, '<')
      .to(veil, { opacity: 0, duration: 0.35, ease: 'power2.out' }, '<0.1')
      .to(grain, { opacity: 0, duration: 0.3 }, '<');
    return tl;
  }

  /* ── 2. Blade Guillotine ───────────────────────────────────── */
  if (name === 'bladeGuillotine') {
    gsap.set(blade, {
      width: '140%',
      height: '8px',
      top: '-5%',
      left: '50%',
      rotate: 0,
      scaleX: 1,
      background: `linear-gradient(90deg, ${BRAND.crimson}, ${BRAND.gold}, ${BRAND.crimson})`,
      boxShadow: `0 0 60px ${BRAND.crimson}`,
    });
    gsap.set(veil, { clipPath: 'inset(0 0 100% 0)', opacity: 1 });

    tl
      .to(blade, { opacity: 1, top: '50%', duration: 0.45, ease: 'power4.in' })
      .to(
        veil,
        { clipPath: 'inset(0 0 0% 0)', duration: 0.45, ease: 'power4.in' },
        '<',
      )
      .to(flash, { opacity: 0.75, duration: 0.08 }, '-=0.05')
      .to(flash, { opacity: 0, duration: 0.2 })
      .fromTo(
        label,
        { opacity: 0, yPercent: 30, scale: 0.8, filter: 'blur(16px)' },
        {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'expo.out',
        },
        '-=0.25',
      )
      .to(blade, { top: '105%', opacity: 0, duration: 0.4, ease: 'power3.in' }, '+=0.12')
      .to(
        veil,
        { clipPath: 'inset(100% 0 0% 0)', duration: 0.45, ease: 'power3.inOut' },
        '<0.05',
      )
      .to(label, { opacity: 0, yPercent: -20, duration: 0.3 }, '<0.1')
      .set(veil, { opacity: 0, clipPath: 'inset(0 0 0 0)' });
    return tl;
  }

  /* ── 3. Ink Bloom ──────────────────────────────────────────── */
  if (name === 'inkBloom') {
    if (ring) {
      gsap.set(ring, {
        borderColor: BRAND.crimson,
        borderWidth: '3px',
        scale: 0.05,
      });
    }
    gsap.set(veil, {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 1,
      background: `radial-gradient(circle, ${BRAND.crimson}22 0%, ${veilColor} 55%)`,
    });

    tl
      .to(veil, {
        clipPath: 'circle(75% at 50% 50%)',
        duration: 0.5,
        ease: 'power3.in',
      })
      .to(ring, { opacity: 1, scale: 1.6, duration: 0.45, ease: 'power2.out' }, '<0.1')
      .to(flash, { opacity: 0.7, duration: 0.1 }, '<0.25')
      .to(flash, { opacity: 0, duration: 0.25 })
      .fromTo(
        label,
        { opacity: 0, scale: 1.6, filter: 'blur(20px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: 'expo.out',
        },
        '-=0.35',
      )
      .to(veil, {
        clipPath: 'circle(160% at 50% 50%)',
        duration: 0.55,
        ease: 'power3.out',
      })
      .to(ring, { opacity: 0, scale: 3.2, duration: 0.4 }, '<')
      .to(label, { opacity: 0, scale: 0.9, duration: 0.3 }, '<0.15')
      .to(veil, { opacity: 0, duration: 0.2 });
    return tl;
  }

  /* ── 4. Prism Breach ───────────────────────────────────────── */
  if (name === 'prismBreach') {
    const colors = [BRAND.voidDeep, '#0b1520', '#061018'];
    bars.slice(0, 3).forEach((b, i) => {
      gsap.set(b, {
        left: `${i * 33.34}%`,
        width: '34%',
        top: 0,
        height: '100%',
        background: colors[i],
        opacity: 0,
        scaleX: 1,
        clipPath:
          i === 1
            ? 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      });
    });
    gsap.set(blade, {
      width: '4px',
      height: '140%',
      left: '50%',
      top: '50%',
      rotate: 18,
      scaleX: 1,
      scaleY: 0,
      background: `linear-gradient(180deg, transparent, ${BRAND.gold}, ${BRAND.crimson}, transparent)`,
      boxShadow: `0 0 50px ${BRAND.gold}`,
    });

    tl
      .to(bars.slice(0, 3), {
        opacity: 1,
        stagger: 0.07,
        duration: 0.28,
        ease: 'power3.out',
      })
      .to(blade, { opacity: 1, scaleY: 1, duration: 0.35, ease: 'power4.out' }, '<0.1')
      .to(flash, { opacity: 0.85, duration: 0.08 }, '<0.2')
      .to(flash, { opacity: 0, duration: 0.2 })
      .fromTo(
        label,
        { opacity: 0, rotate: -4, scale: 0.85, filter: 'blur(12px)' },
        {
          opacity: 1,
          rotate: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'expo.out',
        },
        '-=0.25',
      )
      .to(bars[0], { xPercent: -130, opacity: 0, duration: 0.45, ease: 'power4.inOut' }, '+=0.1')
      .to(bars[2], { xPercent: 130, opacity: 0, duration: 0.45, ease: 'power4.inOut' }, '<')
      .to(bars[1], { scaleY: 0, opacity: 0, duration: 0.35, ease: 'power3.in' }, '<0.08')
      .to(blade, { opacity: 0, scaleY: 0, duration: 0.25 }, '<')
      .to(label, { opacity: 0, yPercent: -15, duration: 0.28 }, '<0.05');
    return tl;
  }

  /* ── 5. Vortex Stamp ───────────────────────────────────────── */
  if (ring) {
    gsap.set(ring, {
      borderColor: BRAND.gold,
      scale: 0.08,
      borderWidth: '2px',
    });
  }
  gsap.set(veil, {
    opacity: 0,
    scale: 1.15,
    rotate: -6,
    transformOrigin: '50% 50%',
  });
  bars.forEach((b, i) => {
    gsap.set(b, {
      left: `${(i / bars.length) * 100}%`,
      width: `${100 / bars.length + 0.5}%`,
      bottom: 0,
      top: 'auto',
      height: '0%',
      background: i % 2 === 0 ? `${BRAND.crimson}33` : `${BRAND.gold}28`,
      opacity: 1,
      scaleY: 1,
    });
  });

  tl
    .to(veil, { opacity: 1, scale: 1, rotate: 0, duration: 0.4, ease: 'power3.out' })
    .to(
      bars,
      {
        height: '100%',
        stagger: 0.03,
        duration: 0.35,
        ease: 'power2.out',
      },
      '<0.05',
    )
    .to(ring, { opacity: 1, scale: 2.2, duration: 0.45, ease: 'power2.out' }, '<0.1')
    .to(flash, { opacity: 0.65, duration: 0.1 }, '<0.2')
    .to(flash, { opacity: 0, duration: 0.22 })
    .fromTo(
      label,
      { opacity: 0, scale: 0.4, rotate: 12, filter: 'blur(20px)' },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'expo.out',
      },
      '-=0.35',
    )
    .to(bars, { height: '0%', stagger: 0.025, duration: 0.3, ease: 'power2.in' }, '+=0.12')
    .to(ring, { opacity: 0, scale: 4, duration: 0.35 }, '<')
    .to(
      label,
      {
        opacity: 0,
        scale: 1.2,
        filter: 'blur(10px)',
        duration: 0.3,
        ease: 'power2.in',
      },
      '<0.05',
    )
    .to(veil, { opacity: 0, duration: 0.3 }, '<0.1');
  return tl;
}

export default function SectionTransitions({ children }: SectionTransitionsProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const bladeRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<HTMLDivElement[]>([]);
  const busyRef = useRef(false);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    const sections = Array.from(container.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && Boolean(child.id),
    );
    if (sections.length < 2) return;

    const refs: LayerRefs = {
      root: layer,
      veil: veilRef.current,
      grain: grainRef.current,
      blade: bladeRef.current,
      flash: flashRef.current,
      label: labelRef.current,
      sub: subRef.current,
      ring: ringRef.current,
      bars: barRefs.current.filter(Boolean),
    };

    resetAll(refs);

    const play = (index: number) => {
      if (busyRef.current) return;
      const name = TRANSITIONS[index % TRANSITIONS.length];
      const labelText = SECTION_LABELS[index % SECTION_LABELS.length];
      busyRef.current = true;
      resetAll(refs);
      const tl = buildTimeline(
        refs,
        name,
        labelText,
        themeRef.current === 'dark',
      );
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
        resetAll(refs);
      });
      tl.play(0);
    };

    const ctx = gsap.context(() => {
      sections.slice(0, -1).forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom 58%',
          once: false,
          onEnter: () => play(index),
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, container);

    return () => {
      busyRef.current = false;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
      <div
        ref={layerRef}
        className='pointer-events-none fixed inset-0 z-[55] overflow-hidden'
        aria-hidden='true'
      >
        <div ref={veilRef} className='absolute inset-0 will-change-[clip-path,opacity,transform]' />
        <div
          ref={grainRef}
          className='absolute inset-0 opacity-0 mix-blend-overlay'
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
          }}
        />
        <div className='absolute inset-0'>
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) barRefs.current[i] = el;
              }}
              className='absolute will-change-transform'
            />
          ))}
        </div>
        <div
          ref={bladeRef}
          className='absolute will-change-transform'
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        <div
          ref={ringRef}
          className='pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 will-change-[transform,opacity]'
        />
        <div
          ref={flashRef}
          className='absolute inset-0 will-change-opacity'
          style={{
            background: `radial-gradient(ellipse at center, ${BRAND.bone}cc 0%, ${BRAND.gold}55 25%, transparent 58%)`,
          }}
        />
        <div className='absolute inset-0 flex flex-col items-center justify-center px-6'>
          <div
            ref={subRef}
            className='mb-3 font-inter text-[10px] font-semibold uppercase tracking-[0.35em] min-[375px]:text-xs'
          />
          <div
            ref={labelRef}
            className='font-instrument text-center text-[clamp(3.2rem,14vw,9rem)] font-normal leading-none will-change-[transform,opacity,filter]'
          />
        </div>
      </div>
    </div>
  );
}
