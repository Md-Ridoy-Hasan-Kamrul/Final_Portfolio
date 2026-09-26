import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useMotionProfile } from '@/contexts/MotionContext';
import { DURATION, EASING, transition } from '@/lib/motion';

type Point = { x: number; y: number };

function cornerPoints(size: number): { bl: Point; tr: Point } {
  const pad = Math.max(20, Math.round(size * 0.35));
  return {
    bl: { x: pad, y: window.innerHeight - size - pad },
    tr: { x: window.innerWidth - size - pad, y: pad },
  };
}

function orbSize(): number {
  if (typeof window === 'undefined') return 56;
  const w = window.innerWidth;
  if (w <= 375) return 44;
  if (w <= 768) return 52;
  return 64;
}

/**
 * Day/night celestial flight — visible only while theme toggle runs.
 * Day → night: sun BL → TR. Night → day: moon TR → BL.
 * Compositor-only (transform + opacity).
 */
export default function ThemeDayNightOrb() {
  const { transit } = useTheme();
  const { isOff, isLight } = useMotionProfile();
  const reduced = useReducedMotion();
  const allowMotion = !reduced && !isOff && !isLight;

  return (
    <div
      className='pointer-events-none fixed inset-0 z-[9998] overflow-hidden'
      aria-hidden='true'
    >
      <AnimatePresence>
        {transit && allowMotion && (
          <TransitFlyer key={transit.id} from={transit.from} />
        )}
      </AnimatePresence>
    </div>
  );
}

function TransitFlyer({ from }: { from: 'light' | 'dark' }) {
  const size = orbSize();
  const { bl, tr } = cornerPoints(size);
  const goingToNight = from === 'light';
  const start = goingToNight ? bl : tr;
  const end = goingToNight ? tr : bl;
  const kind = goingToNight ? 'sun' : 'moon';
  const duration = DURATION.skyTransit;

  return (
    <motion.div
      className={kind === 'sun' ? 'theme-sky-sun' : 'theme-sky-moon'}
      style={{ width: size, height: size, left: 0, top: 0 }}
      initial={{
        opacity: 0,
        scale: 0.88,
        x: start.x,
        y: start.y,
        rotate: goingToNight ? -24 : 24,
      }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        scale: [0.88, 1.06, 1.02, 0.96, 0.72],
        x: end.x,
        y: end.y,
        rotate: goingToNight ? 160 : -160,
      }}
      exit={{ opacity: 0 }}
      transition={{
        ...transition.skyTransit,
        opacity: {
          duration,
          times: [0, 0.12, 0.45, 0.78, 1],
          ease: EASING.easeInOutCubic,
        },
        scale: {
          duration,
          times: [0, 0.18, 0.5, 0.82, 1],
          ease: EASING.easeInOutCubic,
        },
        x: { duration, ease: EASING.easeInOutCubic },
        y: { duration, ease: EASING.easeInOutCubic },
        rotate: { duration, ease: EASING.easeInOutCubic },
      }}
    />
  );
}
