import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
  },
] as const;

export interface SkillCategory {
  title: string;
  skills: string[];
}

const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" opacity="0.08"/>
  </svg>`,
);

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_MS = 650;

type Role = 'center' | 'left' | 'right' | 'back';

function roleStyle(role: Role, isMobile: boolean): CSSProperties {
  const shared: CSSProperties = {
    position: 'absolute',
    aspectRatio: '0.6 / 1',
    transition: `transform ${TRANSITION_MS}ms ${EASE}, filter ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}, left ${TRANSITION_MS}ms ${EASE}, height ${TRANSITION_MS}ms ${EASE}, bottom ${TRANSITION_MS}ms ${EASE}`,
    willChange: 'transform, filter, opacity',
  };

  if (role === 'center') {
    return {
      ...shared,
      left: '50%',
      height: isMobile ? '60%' : '92%',
      bottom: isMobile ? '22%' : 0,
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
      filter: 'none',
      opacity: 1,
      zIndex: 20,
    };
  }
  if (role === 'left') {
    return {
      ...shared,
      left: isMobile ? '20%' : '30%',
      height: isMobile ? '16%' : '28%',
      bottom: isMobile ? '32%' : '12%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)',
      opacity: 0.85,
      zIndex: 10,
    };
  }
  if (role === 'right') {
    return {
      ...shared,
      left: isMobile ? '80%' : '70%',
      height: isMobile ? '16%' : '28%',
      bottom: isMobile ? '32%' : '12%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)',
      opacity: 0.85,
      zIndex: 10,
    };
  }
  return {
    ...shared,
    left: '50%',
    height: isMobile ? '13%' : '22%',
    bottom: isMobile ? '32%' : '12%',
    transform: 'translateX(-50%) scale(1)',
    filter: 'blur(4px)',
    opacity: 1,
    zIndex: 5,
  };
}

type SkillsProps = {
  categories: SkillCategory[];
};

export default function Skills({ categories }: SkillsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  );

  const categoryCount = categories.length;
  const imageIndex = activeIndex % IMAGES.length;
  const activeCategory = categories[activeIndex % categoryCount];
  const activeImage = IMAGES[imageIndex];

  useEffect(() => {
    IMAGES.forEach((img) => {
      const preload = new Image();
      preload.src = img.src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (isAnimating || categoryCount === 0) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        dir === 'next'
          ? (prev + 1) % categoryCount
          : (prev + categoryCount - 1) % categoryCount,
      );
      window.setTimeout(() => setIsAnimating(false), TRANSITION_MS);
    },
    [isAnimating, categoryCount],
  );

  const roles = useMemo(() => {
    const center = imageIndex;
    return {
      center,
      left: (center + 3) % 4,
      right: (center + 1) % 4,
      back: (center + 2) % 4,
    };
  }, [imageIndex]);

  const getRole = (i: number): Role => {
    if (i === roles.center) return 'center';
    if (i === roles.left) return 'left';
    if (i === roles.right) return 'right';
    return 'back';
  };

  return (
    <section
      id='skills'
      className='relative w-full overflow-hidden'
      style={{
        backgroundColor: activeImage.bg,
        transition: `background-color ${TRANSITION_MS}ms ${EASE}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className='relative w-full overflow-hidden'
        style={{ height: '100vh' }}
      >
        {/* Grain */}
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
          aria-hidden
        />

        {/* Giant ghost text — matches active skill field (1–5) */}
        <div
          className='pointer-events-none absolute inset-x-0 flex select-none items-center justify-center px-2'
          style={{ zIndex: 2, top: '18%' }}
          aria-hidden
        >
          <AnimatePresence mode='wait'>
            <motion.span
              key={activeCategory?.title ?? activeIndex}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: isDark ? 0.85 : 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className='uppercase text-white text-center'
              style={{
                fontFamily: 'Anton, sans-serif',
                fontSize:
                  (activeCategory?.title.length ?? 0) > 18
                    ? 'clamp(36px, 9vw, 140px)'
                    : (activeCategory?.title.length ?? 0) > 12
                      ? 'clamp(48px, 12vw, 200px)'
                      : 'clamp(64px, 18vw, 280px)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {activeCategory?.title ?? 'Frontend'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Brand */}
        <p
          className='absolute left-4 top-6 z-[60] text-xs font-semibold uppercase text-white sm:left-8'
          style={{ letterSpacing: '0.18em', opacity: 0.9 }}
        >
          Skills
        </p>

        {/* Section title */}
        <div className='absolute left-4 right-4 top-14 z-[60] sm:left-8 sm:right-auto sm:top-16 md:left-24'>
          <h2
            className='text-2xl font-bold text-white drop-shadow-md sm:text-4xl lg:text-5xl'
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Skills & Expertise
          </h2>
          <p className='mt-2 max-w-md text-sm text-white/85 sm:text-base'>
            One focus area at a time swipe through with the arrows.
          </p>
        </div>

        {/* Carousel figures */}
        <div className='absolute inset-0' style={{ zIndex: 3 }}>
          {IMAGES.map((img, i) => (
            <div key={img.src} style={roleStyle(getRole(i), isMobile)}>
              <img
                src={img.src}
                alt=''
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          ))}
        </div>

        {/* Active skill field + nav */}
        <div className='absolute bottom-6 left-4 z-[60] max-w-[320px] sm:bottom-20 sm:left-24 sm:max-w-md'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCategory?.title ?? activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className={`mb-4 rounded-2xl border p-4 shadow-xl backdrop-blur-md sm:mb-5 sm:p-5 ${
                isDark
                  ? 'border-white/20 bg-black/45 text-white'
                  : 'border-white/50 bg-white/85 text-gray-900'
              }`}
              style={{
                backgroundColor: isDark
                  ? 'rgba(10, 12, 18, 0.55)'
                  : `color-mix(in srgb, ${activeImage.panel} 35%, white)`,
              }}
            >
              <p
                className={`mb-2 text-base font-bold uppercase tracking-widest sm:mb-3 sm:text-[22px] ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
                style={{ letterSpacing: '0.02em', opacity: 0.95 }}
              >
                {activeCategory?.title}
              </p>
              <div className='flex flex-wrap gap-2'>
                {activeCategory?.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium sm:text-sm ${
                      isDark
                        ? 'bg-white/15 text-white'
                        : 'bg-black/10 text-gray-800'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p
                className={`mt-3 text-[11px] uppercase tracking-wider sm:text-xs ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                {activeIndex + 1} / {categoryCount}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              aria-label='Previous skill'
              onClick={() => navigate('prev')}
              className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-[transform,background-color] duration-150 hover:scale-105 hover:bg-white/12 active:scale-95 sm:h-16 sm:w-16'
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type='button'
              aria-label='Next skill'
              onClick={() => navigate('next')}
              className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-[transform,background-color] duration-150 hover:scale-105 hover:bg-white/12 active:scale-95 sm:h-16 sm:w-16'
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right */}
        <a
          href='#projects'
          className='absolute bottom-6 right-4 z-[60] flex items-center gap-2 text-white no-underline opacity-95 transition-opacity duration-200 hover:opacity-100 sm:bottom-20 sm:right-10'
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          Discover it
          <ArrowRight className='h-5 w-5 sm:h-8 sm:w-8' strokeWidth={2.25} />
        </a>

        {/* Soft top wash for readability in both themes */}
        <div
          className='pointer-events-none absolute inset-x-0 top-0 h-40'
          style={{
            zIndex: 4,
            background: isDark
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.12), transparent)',
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
