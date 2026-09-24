import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { NavPersona } from '@/data/navPersonas';
import { DURATION, EASING, transition } from '@/lib/motion';

type NavSectionStampProps = {
  persona: NavPersona;
  morphKey: number;
  className?: string;
};

/**
 * Destination stamp — rematerializes on every section transition.
 * Matches cinematic overlay labels (HOME / ABOUT / …).
 */
export default function NavSectionStamp({
  persona,
  morphKey,
  className = '',
}: NavSectionStampProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`hidden min-[1021px]:flex flex-col items-start justify-center leading-none ${className}`}
      aria-hidden
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${persona.id}-${morphKey}`}
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: 10, scale: 0.92 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: -8, scale: 0.96 }
          }
          transition={transition.structural}
          className='flex flex-col gap-0.5'
        >
          <div className='flex items-baseline gap-2'>
            <motion.span
              className='font-mono text-[10px] tabular-nums tracking-[0.28em]'
              style={{ color: persona.accent }}
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: DURATION.structural,
                ease: EASING.easeOutExpo,
                delay: 0.04,
              }}
            >
              {persona.code}
            </motion.span>
            <span
              className='font-instrument text-lg tracking-[0.08em] lg:text-xl'
              style={{ color: persona.ink }}
            >
              {persona.label}
            </span>
          </div>
          <span
            className='font-inter text-[9px] uppercase tracking-[0.32em]'
            style={{ color: persona.inkMuted }}
          >
            {persona.tagline}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
