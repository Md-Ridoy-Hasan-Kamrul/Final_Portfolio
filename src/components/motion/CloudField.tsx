import { motion, useReducedMotion } from 'framer-motion';
import { EASING } from '@/lib/motion';

type CloudSpec = {
  top: string;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
  yDrift: number;
};

const CLOUDS: CloudSpec[] = [
  { top: '8%', width: 220, duration: 52, delay: 0, opacity: 0.14, yDrift: 12 },
  { top: '22%', width: 160, duration: 38, delay: -8, opacity: 0.1, yDrift: -8 },
  { top: '36%', width: 280, duration: 64, delay: -18, opacity: 0.12, yDrift: 18 },
  { top: '48%', width: 140, duration: 44, delay: -4, opacity: 0.09, yDrift: -14 },
  { top: '58%', width: 200, duration: 56, delay: -22, opacity: 0.11, yDrift: 10 },
  { top: '72%', width: 170, duration: 40, delay: -12, opacity: 0.08, yDrift: -6 },
  { top: '18%', width: 120, duration: 34, delay: -28, opacity: 0.07, yDrift: 8 },
  { top: '64%', width: 240, duration: 70, delay: -16, opacity: 0.1, yDrift: -10 },
];

function CloudShape({ width }: { width: number }) {
  return (
    <svg
      width={width}
      height={width * 0.45}
      viewBox='0 0 180 80'
      fill='none'
      aria-hidden
    >
      <path
        d='M38 62c-14 0-26-10-26-24S24 14 38 14c3.2-10 13-18 25-18 13.5 0 24.5 9.2 27 21.5C97 12 110 6 124 6c18 0 33 13 35 30 12 1.5 22 11 22 23 0 13-11 24-25 24H38Z'
        fill='currentColor'
      />
    </svg>
  );
}

type CloudFieldProps = {
  className?: string;
};

/**
 * Ambient cloud drift — CSS transform only (x/y), no per-particle React state.
 */
export default function CloudField({ className = '' }: CloudFieldProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden opacity-40 ${className}`}
        aria-hidden='true'
      />
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden='true'
    >
      {CLOUDS.map((cloud, i) => (
        <motion.div
          key={i}
          className='absolute text-[#E8E2D6]'
          style={{
            top: cloud.top,
            left: 0,
            opacity: cloud.opacity,
          }}
          initial={{ x: '-30vw', y: 0 }}
          animate={{
            x: '110vw',
            y: [0, cloud.yDrift, 0],
          }}
          transition={{
            x: {
              duration: cloud.duration,
              repeat: Infinity,
              ease: EASING.easeInOutCubic,
              delay: cloud.delay,
            },
            y: {
              duration: cloud.duration / 3,
              repeat: Infinity,
              ease: EASING.easeInOutCubic,
              delay: cloud.delay,
            },
          }}
        >
          <CloudShape width={cloud.width} />
        </motion.div>
      ))}
    </div>
  );
}
