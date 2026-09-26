import { motion, useReducedMotion } from 'framer-motion';
import type { NavPersona } from '@/data/navPersonas';
import { DURATION, EASING, SPRING, transition } from '@/lib/motion';

type NavLiquidIndicatorProps = {
  persona: NavPersona;
  layoutId?: string;
  morphKey?: number;
  burst?: boolean;
};

/**
 * FLIP liquid active pill — Framer layoutId = First/Last/Invert/Play.
 * Transform + opacity only; never width/left tweens.
 */
export default function NavLiquidIndicator({
  persona,
  layoutId = 'nav-liquid-active',
  morphKey = 0,
  burst = false,
}: NavLiquidIndicatorProps) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      layoutId={reduced ? undefined : layoutId}
      className='pointer-events-none absolute inset-x-0 -bottom-1 mx-auto h-[3px] max-w-[85%] rounded-full'
      style={{
        background: `linear-gradient(90deg, transparent, ${persona.accent}, transparent)`,
      }}
      initial={false}
      animate={
        burst && !reduced
          ? {
              opacity: [0.55, 1, 0.9],
              scaleX: [0.7, 1.12, 1],
              scaleY: [1, 1.6, 1],
            }
          : { opacity: 1, scaleX: 1, scaleY: 1 }
      }
      transition={
        reduced
          ? transition.micro
          : burst
            ? {
                duration: DURATION.hero,
                ease: EASING.easeOutExpo,
              }
            : {
                type: 'spring',
                stiffness: SPRING.snappy.stiffness,
                damping: SPRING.snappy.damping,
                mass: SPRING.snappy.mass,
              }
      }
      key={`liquid-${persona.id}-${morphKey}`}
      aria-hidden
    />
  );
}
