import { motion } from 'framer-motion';

type CloudSpec = {
  top: string;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
  blur: number;
  yDrift: number;
};

const CLOUDS: CloudSpec[] = [
  {
    top: '8%',
    width: 220,
    duration: 52,
    delay: 0,
    opacity: 0.14,
    blur: 0,
    yDrift: 12,
  },
  {
    top: '22%',
    width: 160,
    duration: 38,
    delay: -8,
    opacity: 0.1,
    blur: 1,
    yDrift: -8,
  },
  {
    top: '36%',
    width: 280,
    duration: 64,
    delay: -18,
    opacity: 0.12,
    blur: 2,
    yDrift: 18,
  },
  {
    top: '48%',
    width: 140,
    duration: 44,
    delay: -4,
    opacity: 0.09,
    blur: 0,
    yDrift: -14,
  },
  {
    top: '58%',
    width: 200,
    duration: 56,
    delay: -22,
    opacity: 0.11,
    blur: 1,
    yDrift: 10,
  },
  {
    top: '72%',
    width: 170,
    duration: 40,
    delay: -12,
    opacity: 0.08,
    blur: 2,
    yDrift: -6,
  },
  {
    top: '18%',
    width: 120,
    duration: 34,
    delay: -28,
    opacity: 0.07,
    blur: 0,
    yDrift: 8,
  },
  {
    top: '64%',
    width: 240,
    duration: 70,
    delay: -35,
    opacity: 0.1,
    blur: 3,
    yDrift: -12,
  },
];

function CloudShape({ width }: { width: number }) {
  const h = width * 0.42;
  return (
    <svg
      width={width}
      height={h}
      viewBox='0 0 200 84'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
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
 * Slow ambient clouds that drift across the footer.
 * Atmosphere only — sits behind content (no interaction).
 */
export default function CloudField({ className = '' }: CloudFieldProps) {
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
            filter: cloud.blur ? `blur(${cloud.blur}px)` : undefined,
            willChange: 'transform',
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
              ease: 'linear',
              delay: cloud.delay,
            },
            y: {
              duration: cloud.duration / 3,
              repeat: Infinity,
              ease: 'easeInOut',
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
