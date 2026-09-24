import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { NavPersona } from '@/data/navPersonas';
import { DURATION, EASING, fadeOnly, transition } from '@/lib/motion';

type NavMorphChromeProps = {
  persona: NavPersona;
  morphKey: number;
  isScrolled: boolean;
  isOpen: boolean;
  floating?: boolean;
};

/**
 * Section-synced nav chassis — clip-path + opacity morph only.
 * Each destination fires a unique entrance signature.
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

  const clipEnter =
    persona.morph === 'rift'
      ? 'inset(0 48% 0 48%)'
      : persona.morph === 'blade'
        ? 'inset(45% 0 45% 0)'
        : persona.morph === 'iris'
          ? 'circle(0% at 50% 50%)'
          : persona.morph === 'vortex'
            ? 'inset(0 0 100% 0)'
            : persona.morph === 'prism'
              ? 'inset(0 100% 0 0)'
              : 'inset(0 0 100% 0)';

  const clipIdle =
    persona.morph === 'iris' ? 'circle(150% at 50% 50%)' : 'inset(0 0 0% 0)';

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden>
      <AnimatePresence mode='sync'>
        <motion.div
          key={`${persona.id}-${morphKey}`}
          className='absolute inset-0'
          style={{
            background: persona.glass,
            borderBottom: floating ? 'none' : `1px solid ${persona.border}`,
            border: floating ? `1px solid ${persona.border}` : undefined,
            backdropFilter:
              isScrolled || persona.id !== 'home' ? 'blur(18px)' : 'blur(8px)',
            WebkitBackdropFilter:
              isScrolled || persona.id !== 'home' ? 'blur(18px)' : 'blur(8px)',
          }}
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, clipPath: clipEnter }
          }
          animate={
            reduced
              ? { opacity: 1 }
              : { opacity: 1, clipPath: clipIdle }
          }
          exit={reduced ? { opacity: 0 } : { opacity: 0.4, clipPath: clipEnter }}
          transition={transition.hero}
        />
      </AnimatePresence>

      <motion.div
        key={`rail-${persona.id}-${morphKey}`}
        className={`absolute left-0 right-0 h-[2px] origin-center ${
          floating ? 'bottom-0' : 'bottom-0'
        }`}
        style={{
          background: `linear-gradient(90deg, ${persona.rail[0]}, ${persona.rail[1]}, ${persona.rail[2]})`,
        }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
        animate={reduced ? { opacity: 0.85 } : { opacity: 0.85, scaleX: 1 }}
        transition={{
          duration: DURATION.hero,
          ease: EASING.easeOutExpo,
          delay: reduced ? 0 : 0.08,
        }}
      />

      <motion.div
        key={`bloom-${persona.id}`}
        className='absolute -top-16 left-1/2 h-32 w-[min(60vw,420px)] -translate-x-1/2 rounded-full'
        style={{ background: persona.accentSoft }}
        variants={reduced ? fadeOnly : undefined}
        initial={{ opacity: 0, scale: reduced ? 1 : 0.6 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={transition.hero}
      />
    </div>
  );
}
