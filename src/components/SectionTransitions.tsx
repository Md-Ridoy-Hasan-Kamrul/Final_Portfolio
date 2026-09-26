import { useEffect, useRef, type ReactNode } from 'react';
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  DURATION,
  EASE,
  clearWillChange,
} from '../lib/motion';
import { useTheme } from '../contexts/ThemeContext';
import { SECTION_TRANSITION_EVENT } from '../utils/sectionTransitionEvent';

/** Token aliases — structural 250ms, hero/page morph 400ms, micro 100ms */
const T = {
  micro: DURATION.micro,
  structural: DURATION.structural,
  hero: DURATION.hero,
} as const;
/**
 * Cinematic section transitions (GSAP one-shot).
 *
 * Destination-aware: scroll boundaries AND nav clicks show the
 * section you are entering (Contact click → CONTACT, not ABOUT).
 */

type TransitionName =
  | 'horizonRift'
  | 'bladeGuillotine'
  | 'inkBloom'
  | 'prismBreach'
  | 'vortexStamp'
  | 'curtainFinale';

/** Destination section id → label + animation */
const DEST_META: Record<
  string,
  { label: string; transition: TransitionName }
> = {
  home: { label: 'HOME', transition: 'inkBloom' },
  about: { label: 'ABOUT', transition: 'horizonRift' },
  experience: { label: 'EXPERIENCE', transition: 'bladeGuillotine' },
  projects: { label: 'PROJECTS', transition: 'inkBloom' },
  skills: { label: 'SKILLS', transition: 'prismBreach' },
  contact: { label: 'CONTACT', transition: 'vortexStamp' },
  footer: { label: 'KAMRUL', transition: 'curtainFinale' },
};

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
      x: 0,
      y: 0,
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
      scale: 0.85,
      yPercent: 12,
      textShadow: 'none',
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
  // Dark-bar morphs stay cinematic. Labels need a strong ink halo in both
  // themes — especially Skills prism, where light FRONTEND ghost bleeds through.
  const darkBarMorph =
    name === 'horizonRift' ||
    name === 'prismBreach' ||
    name === 'curtainFinale';
  const veilColor = isDark || darkBarMorph ? BRAND.voidDeep : '#f2ebe2';
  const labelColor = darkBarMorph
    ? isDark
      ? '#FFF8EE'
      : BRAND.gold
    : isDark
      ? BRAND.bone
      : BRAND.ink;
  const labelShadow = darkBarMorph
    ? isDark
      ? `0 0 2px ${BRAND.voidDeep}, 0 1px 0 ${BRAND.voidDeep}, 0 2px 0 rgba(2,6,12,0.95), 0 0 28px rgba(2,6,12,0.85), 0 0 48px rgba(0,0,0,0.7)`
      : `0 1px 0 ${BRAND.ink}, 0 0 18px rgba(10,12,18,0.55), 0 2px 28px rgba(10,12,18,0.35)`
    : 'none';
  gsap.set(veil, { background: veilColor });
  gsap.set(label, { color: labelColor, textShadow: labelShadow });
  if (sub) {
    sub.textContent = 'ENTERING';
    gsap.set(sub, {
      color: isDark ? BRAND.gold : BRAND.crimson,
    });
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
      left: '50%',
      rotate: 0,
      scaleX: 0,
      y: 0,
      // Glow baked into background — never tween box-shadow (paint thrash)
      background: `linear-gradient(90deg, transparent 0%, ${BRAND.bone} 20%, ${BRAND.gold} 45%, ${BRAND.crimson} 55%, ${BRAND.gold} 70%, transparent 100%)`,
    });

    tl
      // Blackout slam — clip-path + opacity only
      .set(veil, { opacity: 0, clipPath: 'inset(50% 0 50% 0)' })
      .to(veil, {
        opacity: 1,
        clipPath: 'inset(0% 0 0% 0)',
        duration: T.hero,
        ease: EASE.in,
      })
      .to(grain, { opacity: 0.35, duration: T.structural }, '<0.08')
      .to(
        blade,
        {
          opacity: 1,
          scaleX: 1,
          duration: T.structural,
          ease: EASE.out,
        },
        '-=0.08',
      )
      // NEUTRALIZED: height tween → scaleY (compositor)
      .to(
        blade,
        {
          scaleY: 40,
          opacity: 0.85,
          duration: T.structural,
          ease: EASE.in,
        },
        '-=0.05',
      )
      .to(flash, { opacity: 0.9, duration: T.micro }, '<0.08')
      .to(flash, { opacity: 0, duration: T.structural }, '>')
      .fromTo(
        sub,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: T.structural,
          ease: EASE.out,
        },
        '-=0.2',
      )
      // NEUTRALIZED: filter/letterSpacing (paint/layout) → opacity + scale only
      .fromTo(
        label,
        { opacity: 0, scale: 1.12, yPercent: 8 },
        {
          opacity: 1,
          scale: 1,
          yPercent: 0,
          duration: T.hero,
          ease: EASE.expo,
        },
        '-=0.15',
      )
      .to(
        bars,
        {
          scaleY: 1,
          duration: T.structural,
          stagger: { each: 0.03, from: 'center' },
          ease: EASE.inOut,
        },
        '-=0.12',
      )
      .to(blade, { opacity: 0, duration: T.micro }, '<')
      .to(label, {
        scale: 1.04,
        opacity: 0.95,
        duration: T.micro,
        ease: EASE.inOut,
      })
      .to(
        bars,
        {
          scaleY: 0,
          opacity: 0,
          stagger: { each: 0.025, from: 'edges' },
          duration: T.structural,
          ease: EASE.inOut,
        },
        '+=0.06',
      )
      .to(
        label,
        {
          opacity: 0,
          scale: 0.92,
          yPercent: -10,
          duration: T.structural,
          ease: EASE.in,
        },
        '<0.04',
      )
      .to(sub, { opacity: 0, y: -12, duration: T.structural }, '<')
      .to(veil, { opacity: 0, duration: T.structural, ease: EASE.soft }, '<0.06')
      .to(grain, { opacity: 0, duration: T.structural }, '<');
    return tl;
  }

  /* ── 2. Blade Guillotine ───────────────────────────────────── */
  if (name === 'bladeGuillotine') {
    // NEUTRALIZED: top% tweens → y translate from off-screen
    gsap.set(blade, {
      width: '140%',
      height: '8px',
      top: '50%',
      left: '50%',
      rotate: 0,
      scaleX: 1,
      y: '-60vh',
      background: `linear-gradient(90deg, ${BRAND.crimson}, ${BRAND.gold}, ${BRAND.crimson})`,
    });
    gsap.set(veil, { clipPath: 'inset(0 0 100% 0)', opacity: 1 });

    tl
      .to(blade, {
        opacity: 1,
        y: 0,
        duration: T.hero,
        ease: EASE.in,
      })
      .to(
        veil,
        { clipPath: 'inset(0 0 0% 0)', duration: T.hero, ease: EASE.in },
        '<',
      )
      .to(flash, { opacity: 0.75, duration: T.micro }, '-=0.04')
      .to(flash, { opacity: 0, duration: T.structural })
      .fromTo(
        label,
        { opacity: 0, yPercent: 18, scale: 0.92 },
        {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          duration: T.structural,
          ease: EASE.expo,
        },
        '-=0.15',
      )
      .to(
        blade,
        { y: '60vh', opacity: 0, duration: T.structural, ease: EASE.in },
        '+=0.08',
      )
      .to(
        veil,
        {
          clipPath: 'inset(100% 0 0% 0)',
          duration: T.hero,
          ease: EASE.inOut,
        },
        '<0.04',
      )
      .to(label, { opacity: 0, yPercent: -12, duration: T.structural }, '<0.06')
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
        duration: T.hero,
        ease: EASE.in,
      })
      .to(ring, { opacity: 1, scale: 1.6, duration: T.hero, ease: EASE.soft }, '<0.06')
      .to(flash, { opacity: 0.7, duration: T.micro }, '<0.15')
      .to(flash, { opacity: 0, duration: T.structural })
      .fromTo(
        label,
        { opacity: 0, scale: 1.2 },
        {
          opacity: 1,
          scale: 1,
          duration: T.hero,
          ease: EASE.expo,
        },
        '-=0.2',
      )
      .to(veil, {
        clipPath: 'circle(160% at 50% 50%)',
        duration: T.hero,
        ease: EASE.out,
      })
      .to(ring, { opacity: 0, scale: 3.2, duration: T.structural }, '<')
      .to(label, { opacity: 0, scale: 0.94, duration: T.structural }, '<0.1')
      .to(veil, { opacity: 0, duration: T.structural });
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
    });

    tl
      .to(bars.slice(0, 3), {
        opacity: 1,
        stagger: 0.05,
        duration: T.structural,
        ease: EASE.out,
      })
      .to(blade, { opacity: 1, scaleY: 1, duration: T.structural, ease: EASE.out }, '<0.06')
      .to(flash, { opacity: 0.85, duration: T.micro }, '<0.12')
      .to(flash, { opacity: 0, duration: T.structural })
      .fromTo(
        label,
        { opacity: 0, rotate: -3, scale: 0.92 },
        {
          opacity: 1,
          rotate: 0,
          scale: 1,
          duration: T.structural,
          ease: EASE.expo,
        },
        '-=0.15',
      )
      // Fade label first so day mode never leaves gold SKILLS on white FRONTEND
      .to(
        label,
        { opacity: 0, yPercent: -10, duration: T.structural, ease: EASE.in },
        '+=0.04',
      )
      .to(bars[0], { xPercent: -130, opacity: 0, duration: T.hero, ease: EASE.inOut }, '<0.02')
      .to(bars[2], { xPercent: 130, opacity: 0, duration: T.hero, ease: EASE.inOut }, '<')
      .to(bars[1], { scaleY: 0, opacity: 0, duration: T.structural, ease: EASE.in }, '<0.06')
      .to(blade, { opacity: 0, scaleY: 0, duration: T.structural }, '<');
    return tl;
  }

  /* ── 5. Vortex Stamp ───────────────────────────────────────── */
  if (name === 'vortexStamp') {
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
        // NEUTRALIZED: height 0%→100% → fixed height + scaleY
        height: '100%',
        background: i % 2 === 0 ? `${BRAND.crimson}33` : `${BRAND.gold}28`,
        opacity: 1,
        scaleY: 0,
        transformOrigin: 'bottom center',
      });
    });

    tl
      .to(veil, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: T.structural,
        ease: EASE.out,
      })
      .to(
        bars,
        {
          scaleY: 1,
          stagger: 0.025,
          duration: T.structural,
          ease: EASE.out,
        },
        '<0.04',
      )
      .to(ring, { opacity: 1, scale: 2.2, duration: T.hero, ease: EASE.soft }, '<0.06')
      .to(flash, { opacity: 0.65, duration: T.micro }, '<0.12')
      .to(flash, { opacity: 0, duration: T.structural })
      .fromTo(
        label,
        { opacity: 0, scale: 0.7, rotate: 8 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: T.hero,
          ease: EASE.expo,
        },
        '-=0.2',
      )
      .to(
        bars,
        { scaleY: 0, stagger: 0.02, duration: T.structural, ease: EASE.in },
        '+=0.08',
      )
      .to(ring, { opacity: 0, scale: 4, duration: T.structural }, '<')
      .to(
        label,
        {
          opacity: 0,
          scale: 1.08,
          duration: T.structural,
          ease: EASE.in,
        },
        '<0.04',
      )
      .to(veil, { opacity: 0, duration: T.structural }, '<0.06');
    return tl;
  }

  /* ── 6. Contact → Footer: Curtain Finale ────────────────────── */
  bars.forEach((b, i) => {
    const n = bars.length;
    gsap.set(b, {
      left: 0,
      top: `${(i / n) * 100}%`,
      width: '100%',
      height: `${100 / n + 0.8}%`,
      scaleX: 0,
      transformOrigin: i % 2 === 0 ? 'left center' : 'right center',
      background: i % 2 === 0 ? BRAND.voidDeep : '#0a121c',
      opacity: 1,
      scaleY: 1,
    });
  });
  gsap.set(blade, {
    width: '120%',
    height: '3px',
    top: '50%',
    left: '50%',
    scaleX: 1,
    rotate: 0,
    y: '55vh',
    background: `linear-gradient(90deg, transparent, ${BRAND.gold}, ${BRAND.crimson}, ${BRAND.gold}, transparent)`,
  });
  gsap.set(veil, { opacity: 0, clipPath: 'inset(100% 0 0 0)' });
  if (sub) {
    sub.textContent = 'THE END AND BEGINNING';
    // Always gold on dark curtain bars — readable in day & night
    gsap.set(sub, { color: BRAND.gold });
  }

  tl
    .to(veil, {
      opacity: 1,
      clipPath: 'inset(0% 0 0 0)',
      duration: T.hero,
      ease: EASE.in,
    })
    .to(
      bars,
      {
        scaleX: 1,
        stagger: { each: 0.03, from: 'end' },
        duration: T.structural,
        ease: EASE.out,
      },
      '<0.06',
    )
    // NEUTRALIZED: top% → y translate
    .to(blade, { opacity: 1, y: 0, duration: T.structural, ease: EASE.out }, '<0.08')
    .to(flash, { opacity: 0.8, duration: T.micro }, '<0.15')
    .to(flash, { opacity: 0, duration: T.structural })
    .fromTo(
      sub,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: T.structural, ease: EASE.out },
      '-=0.18',
    )
    // NEUTRALIZED: filter + letterSpacing layout thrash → opacity/scale/yPercent
    .fromTo(
      label,
      { opacity: 0, scale: 1.15, yPercent: 16 },
      {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        duration: T.hero,
        ease: EASE.expo,
      },
      '-=0.12',
    )
    .to(blade, { opacity: 0, duration: T.structural }, '+=0.06')
    .to(
      bars,
      {
        scaleX: 0,
        stagger: { each: 0.025, from: 'start' },
        duration: T.structural,
        ease: EASE.inOut,
      },
      '+=0.06',
    )
    .to(
      label,
      {
        opacity: 0,
        yPercent: -14,
        scale: 0.94,
        duration: T.structural,
        ease: EASE.in,
      },
      '<0.04',
    )
    .to(sub, { opacity: 0, y: -10, duration: T.structural }, '<')
    .to(
      veil,
      {
        clipPath: 'inset(0 0 100% 0)',
        duration: T.hero,
        ease: EASE.inOut,
      },
      '<0.06',
    )
    .set(veil, { opacity: 0, clipPath: 'inset(0 0 0 0)' });
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
  /** Suppress scroll-boundary plays while nav/hash is scrolling to a target */
  const navLockRef = useRef(false);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

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

    const playForId = (sectionId: string, fromNav = false) => {
      const meta = DEST_META[sectionId];
      if (!meta) return;
      if (busyRef.current) return;
      if (!fromNav && navLockRef.current) return;

      busyRef.current = true;
      // Arm will-change only for the active transition lifetime
      const animated = [
        refs.veil,
        refs.blade,
        refs.flash,
        refs.label,
        refs.sub,
        refs.ring,
        refs.grain,
        ...refs.bars,
      ].filter(Boolean) as HTMLElement[];
      animated.forEach((el) => {
        el.style.willChange = 'transform, opacity, clip-path';
      });

      resetAll(refs);
      const tl = buildTimeline(
        refs,
        meta.transition,
        meta.label,
        themeRef.current === 'dark',
      );
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
        clearWillChange(animated);
        resetAll(refs);
      });
      tl.play(0);
    };

    const onNavTransition = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (!id) return;
      navLockRef.current = true;
      // Unlock after Lenis/smooth scroll finishes crossing boundaries
      window.setTimeout(() => {
        navLockRef.current = false;
      }, (DURATION.hero + DURATION.structural) * 1000 + 200);
      playForId(id, true);
    };

    window.addEventListener(SECTION_TRANSITION_EVENT, onNavTransition);

    const ctx = gsap.context(() => {
      // Fire when leaving section[i] → entering section[i+1]
      sections.slice(0, -1).forEach((section, index) => {
        const dest = sections[index + 1];
        if (!dest?.id) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom 58%',
          once: false,
          onEnter: () => playForId(dest.id),
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, container);

    return () => {
      busyRef.current = false;
      navLockRef.current = false;
      window.removeEventListener(SECTION_TRANSITION_EVENT, onNavTransition);
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
        <div ref={veilRef} className='absolute inset-0' />
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
              className='absolute'
            />
          ))}
        </div>
        <div
          ref={bladeRef}
          className='absolute'
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        <div
          ref={ringRef}
          className='pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2'
        />
        <div
          ref={flashRef}
          className='absolute inset-0'
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
            className='font-instrument text-center text-[clamp(3.2rem,14vw,9rem)] font-normal leading-none'
          />
        </div>
      </div>
    </div>
  );
}
