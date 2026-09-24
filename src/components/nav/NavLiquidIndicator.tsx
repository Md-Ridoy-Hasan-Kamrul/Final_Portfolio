import { motion, useReducedMotion } from 'framer-motion';
import type { NavPersona } from '@/data/navPersonas';
import { SPRING, transition } from '@/lib/motion';

type NavLiquidIndicatorProps = {
  persona: NavPersona;
  layoutId?: string;
};

/**
 * FLIP liquid active pill — Framer layoutId = First/Last/Invert/Play.
 * Transform + opacity only; never width/left tweens.
 */
export default function NavLiquidIndicator({
  persona,
  layoutId = 'nav-liquid-active',
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
      transition={
        reduced
          ? transition.micro
          : {
              type: 'spring',
              stiffness: SPRING.snappy.stiffness,
              damping: SPRING.snappy.damping,
              mass: SPRING.snappy.mass,
            }
      }
      aria-hidden
    />
  );
}
