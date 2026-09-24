import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from 'framer-motion';
import type { ReactNode } from 'react';
import { revealContainer, revealVariants, fadeOnly, VIEWPORT } from '@/lib/motion';

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  /** When true, children stagger via staggerContainer */
  stagger?: boolean;
} & Omit<
  HTMLMotionProps<'div'>,
  'children' | 'variants' | 'initial' | 'whileInView' | 'viewport'
>;

/**
 * One entrance rhythm for every section block:
 * whileInView + shared fadeUp / staggerContainer tokens.
 * Reduced motion → opacity cross-fade only (vestibular-safe).
 */
export default function SectionReveal({
  children,
  className,
  stagger = false,
  ...rest
}: SectionRevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduced
          ? fadeOnly
          : stagger
            ? revealContainer(false)
            : revealVariants(false)
      }
      initial='hidden'
      whileInView='visible'
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Child of a stagger SectionReveal — uses fadeUp / fadeOnly */
export function RevealItem({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children' | 'variants'>) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? fadeOnly : revealVariants(false)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
