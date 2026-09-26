import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { NavPersona } from '@/data/navPersonas';
import { DURATION, EASING, transition } from '@/lib/motion';

type NavMorphChromeProps = {
  persona: NavPersona;
  morphKey: number;
  isScrolled: boolean;
  isOpen: boolean;
  floating?: boolean;
};

type MorphKind = NavPersona['morph'];

function clipForMorph(morph: MorphKind): { enter: string; idle: string; exit: string } {
  switch (morph) {
    case 'rift':
      return {
        enter: 'inset(0 50% 0 50%)',
        idle: 'inset(0 0 0 0)',
        exit: 'inset(0 48% 0 48%)',
      };
    case 'blade':
      return {
        enter: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        idle: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        exit: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      };
    case 'iris':
      return {
        enter: 'circle(0% at 50% 50%)',
        idle: 'circle(150% at 50% 50%)',
        exit: 'circle(0% at 50% 50%)',
      };
    case 'prism':
      return {
        enter: 'inset(0 100% 0 0)',
        idle: 'inset(0 0 0 0)',
        exit: 'inset(0 0 0 100%)',
      };
    case 'vortex':
      return {
        enter: 'inset(100% 0 0 0)',
        idle: 'inset(0 0 0 0)',
        exit: 'inset(0 0 100% 0)',
      };
    case 'orbit':
    default:
      return {
        enter: 'inset(0 0 100% 0)',
        idle: 'inset(0 0 0 0)',
        exit: 'inset(100% 0 0 0)',
      };
  }
}

/**
 * Section-synced nav chassis — unique clip + FX per morph.
 * Compositor-only: transform · opacity · clip-path.
 */
export default function NavMorphChrome({
  persona,
  morphKey,
  isScrolled,
  isOpen,
  floating = false,
}: NavMorphChromeProps) {
  const reduced = useReducedMotion();

  if (isOpen) return null;

  const clips = clipForMorph(persona.morph);
  const blur =
    isScrolled || persona.id !== 'home'
      ? 'blur(22px)'
      : 'blur(10px)';

  return (
    <div
      className='pointer-events-none absolute inset-0 overflow-hidden'
      aria-hidden
    >
      <AnimatePresence mode='sync'>
        <motion.div
          key={`glass-${persona.id}-${morphKey}`}
          className='absolute inset-0'
          style={{
            background: persona.glass,
            borderBottom: floating ? 'none' : `1px solid ${persona.border}`,
            border: floating ? `1px solid ${persona.border}` : undefined,
            backdropFilter: blur,
            WebkitBackdropFilter: blur,
          }}
          initial={
            reduced
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  clipPath: clips.enter,
                  rotate: persona.morph === 'vortex' ? -8 : 0,
                  scale: persona.morph === 'vortex' ? 0.92 : 1,
                }
          }
          animate={
            reduced
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  clipPath: clips.idle,
                  rotate: 0,
                  scale: 1,
                }
          }
          exit={
            reduced
              ? { opacity: 0 }
              : {
                  opacity: 0.35,
                  clipPath: clips.exit,
                  rotate: persona.morph === 'vortex' ? 6 : 0,
                  scale: persona.morph === 'iris' ? 0.96 : 1,
                }
          }
          transition={{
            duration: reduced ? 0 : DURATION.hero,
            ease: EASING.easeOutExpo,
          }}
        />
      </AnimatePresence>

      {/* Morph-specific FX overlays */}
      <AnimatePresence mode='sync'>
        {!reduced && (
          <MorphFx
            key={`fx-${persona.id}-${morphKey}`}
            morph={persona.morph}
            persona={persona}
            floating={floating}
          />
        )}
      </AnimatePresence>

      {/* Accent rail */}
      <motion.div
        key={`rail-${persona.id}-${morphKey}`}
        className='absolute bottom-0 left-0 right-0 h-[2px] origin-center'
        style={{
          background: `linear-gradient(90deg, ${persona.rail[0]}, ${persona.rail[1]}, ${persona.rail[2]})`,
        }}
        initial={
          reduced
            ? { opacity: 0.85 }
            : persona.morph === 'prism'
              ? { opacity: 0, scaleX: 0, x: '-40%' }
              : persona.morph === 'orbit'
                ? { opacity: 0, scaleX: 0.2 }
                : { opacity: 0, scaleX: 0 }
        }
        animate={{ opacity: 0.9, scaleX: 1, x: 0 }}
        transition={{
          duration: reduced ? 0 : DURATION.hero,
          ease: EASING.easeOutExpo,
          delay: reduced ? 0 : 0.06,
        }}
      />

      {/* Soft bloom — stronger for floating docks */}
      <motion.div
        key={`bloom-${persona.id}-${morphKey}`}
        className='absolute -top-16 left-1/2 h-32 w-[min(60vw,420px)] -translate-x-1/2 rounded-full'
        style={{ background: persona.accentSoft }}
        initial={{ opacity: 0, scale: reduced ? 1 : 0.55 }}
        animate={{ opacity: floating ? 0.65 : 0.45, scale: 1 }}
        transition={transition.hero}
      />
    </div>
  );
}

function MorphFx({
  morph,
  persona,
  floating,
}: {
  morph: MorphKind;
  persona: NavPersona;
  floating: boolean;
}) {
  const common = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transition.hero,
  } as const;

  if (morph === 'orbit') {
    return (
      <motion.div {...common} className='absolute inset-0 overflow-hidden'>
        <motion.span
          className='absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25'
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.6, 1.15, 1.35], rotate: 40 }}
          transition={{
            duration: DURATION.hero + DURATION.structural,
            ease: EASING.easeOutExpo,
          }}
        />
        <motion.span
          className='absolute inset-y-0 left-0 w-1/3'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,230,255,0.18), transparent)',
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '220%', opacity: [0, 1, 0] }}
          transition={{
            duration: DURATION.hero + DURATION.structural,
            ease: EASING.easeInOutCubic,
          }}
        />
      </motion.div>
    );
  }

  if (morph === 'rift') {
    return (
      <motion.div {...common} className='absolute inset-0 overflow-hidden'>
        <motion.span
          className='absolute inset-y-0 left-1/2 w-px -translate-x-1/2'
          style={{ background: persona.accent }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 0.8, 0] }}
          transition={{
            duration: DURATION.hero + DURATION.structural,
            ease: EASING.easeOutExpo,
            times: [0, 0.25, 0.7, 1],
          }}
        />
        <motion.span
          className='absolute inset-y-0 left-0 w-1/2'
          style={{
            background: `linear-gradient(90deg, ${persona.accentSoft}, transparent)`,
          }}
          initial={{ x: '-8%', opacity: 0 }}
          animate={{ x: 0, opacity: [0, 0.5, 0] }}
          transition={transition.hero}
        />
        <motion.span
          className='absolute inset-y-0 right-0 w-1/2'
          style={{
            background: `linear-gradient(270deg, ${persona.accentSoft}, transparent)`,
          }}
          initial={{ x: '8%', opacity: 0 }}
          animate={{ x: 0, opacity: [0, 0.5, 0] }}
          transition={transition.hero}
        />
      </motion.div>
    );
  }

  if (morph === 'blade') {
    return (
      <motion.div {...common} className='absolute inset-0 overflow-hidden'>
        <motion.span
          className='absolute left-[-20%] top-1/2 h-[2px] w-[140%] origin-left'
          style={{
            background: `linear-gradient(90deg, transparent, ${persona.accent}, ${persona.rail[1]}, transparent)`,
            rotate: '-18deg',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 1, 0] }}
          transition={{
            duration: DURATION.hero,
            ease: EASING.easeInOutCubic,
          }}
        />
        <motion.span
          className='absolute inset-0'
          style={{
            background: `linear-gradient(115deg, transparent 35%, ${persona.accentSoft} 48%, transparent 62%)`,
          }}
          initial={{ opacity: 0, x: '-30%' }}
          animate={{ opacity: [0, 0.7, 0], x: '35%' }}
          transition={{
            duration: DURATION.hero + DURATION.structural,
            ease: EASING.easeOutExpo,
          }}
        />
      </motion.div>
    );
  }

  if (morph === 'iris') {
    return (
      <motion.div {...common} className='absolute inset-0 overflow-hidden'>
        <motion.span
          className='absolute left-1/2 top-1/2 aspect-square w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2'
          style={{ borderColor: persona.accent }}
          initial={{ opacity: 0, scale: 0.15 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.15, 1.1, 1.45] }}
          transition={{
            duration: DURATION.hero + DURATION.structural,
            ease: EASING.easeOutExpo,
          }}
        />
        <motion.span
          className='absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full'
          style={{ background: persona.accent }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0.2] }}
          transition={transition.hero}
        />
        {floating && (
          <motion.span
            className='absolute inset-0'
            style={{
              background: `radial-gradient(circle at 50% 100%, ${persona.accentSoft}, transparent 55%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.2] }}
            transition={transition.hero}
          />
        )}
      </motion.div>
    );
  }

  if (morph === 'prism') {
    return (
      <motion.div {...common} className='absolute inset-0 overflow-hidden'>
        {[persona.rail[0], persona.rail[1], persona.rail[2]].map(
          (color, i) => (
            <motion.span
              key={color}
              className='absolute inset-y-0 w-[28%]'
              style={{
                left: `${i * 24}%`,
                background: `linear-gradient(180deg, transparent, ${color}55, transparent)`,
              }}
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '160%', opacity: [0, 0.9, 0] }}
              transition={{
                duration: DURATION.hero + DURATION.structural,
                ease: EASING.easeInOutCubic,
                delay: i * 0.05,
              }}
            />
          ),
        )}
      </motion.div>
    );
  }

  // vortex
  return (
    <motion.div {...common} className='absolute inset-0 overflow-hidden'>
      <motion.span
        className='absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed'
        style={{ borderColor: `${persona.accent}66` }}
        initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
        animate={{
          opacity: [0, 0.7, 0],
          rotate: 120,
          scale: [0.4, 1.05, 1.2],
        }}
        transition={{
          duration: DURATION.hero + DURATION.structural,
          ease: EASING.easeOutExpo,
        }}
      />
      <motion.span
        className='absolute inset-x-0 bottom-0 h-full'
        style={{
          background: `linear-gradient(0deg, ${persona.accentSoft}, transparent 55%)`,
        }}
        initial={{ opacity: 0, y: '40%' }}
        animate={{ opacity: [0, 0.6, 0], y: ['40%', '0%', '-10%'] }}
        transition={transition.hero}
      />
    </motion.div>
  );
}
