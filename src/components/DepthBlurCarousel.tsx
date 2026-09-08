import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'framer-motion';

export type DepthBlurSlide = {
  /** Image URL or CSS gradient / solid background */
  src: string;
  href?: string;
  alt?: string;
  title?: string;
  description?: string;
  category?: string;
  highlights?: string[];
  content?: ReactNode;
};

type DepthBlurCarouselProps = {
  images?: DepthBlurSlide[] | string[];
  itemWidth?: number;
  itemHeight?: number;
  sideItemWidth?: number;
  sideItemHeight?: number;
  gap?: number;
  maxRotation?: number;
  perspective?: number;
  borderRadius?: number;
  scrollDamping?: number;
  blurSpread?: number;
  blurStrength?: number;
  className?: string;
  style?: CSSProperties;
  onActiveChange?: (index: number) => void;
};

const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #1E3A8A, #3B82F6)',
  'linear-gradient(135deg, #064E3B, #10B981)',
  'linear-gradient(135deg, #b91c1c, #ef4444)',
  'linear-gradient(135deg, #c2410c, #f97316)',
  'linear-gradient(135deg, #4C1D95, #8B5CF6)',
  'linear-gradient(135deg, #164e63, #06b6d4)',
];

function normalizeSlides(images?: DepthBlurSlide[] | string[]): DepthBlurSlide[] {
  if (!images?.length) {
    return DEFAULT_GRADIENTS.map((src) => ({ src }));
  }
  return images.map((item) => (typeof item === 'string' ? { src: item } : item));
}

function isImageSrc(src: string) {
  return (
    src.startsWith('http') ||
    src.startsWith('data:') ||
    src.startsWith('/') ||
    src.startsWith('./') ||
    src.startsWith('../') ||
    /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(src)
  );
}

/**
 * Port of Framer Depth Blur Carousel
 * https://framer.com/m/Depth-Blur-Carousel-fvJ2lB.js@GXN6LrtdSMkVOzHCU8CD
 */
export default function DepthBlurCarousel({
  images,
  itemWidth = 500,
  itemHeight = 285,
  sideItemWidth = 320,
  sideItemHeight = 280,
  gap = 64,
  maxRotation = 90,
  perspective = 400,
  borderRadius = 10,
  scrollDamping = 100,
  blurSpread = 25,
  blurStrength = 24,
  className = '',
  style,
  onActiveChange,
}: DepthBlurCarouselProps) {
  const slides = useMemo(() => normalizeSlides(images), [images]);
  const uniqueCount = slides.length;

  const renderItems = useMemo(() => {
    const items: DepthBlurSlide[] = [];
    while (items.length < 18) {
      items.push(...slides);
    }
    return items.slice(0, 18);
  }, [slides]);

  const totalItems = renderItems.length;
  const scrollTarget = useRef(0);
  const rawScroll = useMotionValue(0);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActive = useRef(0);
  const panDistance = useRef(0);

  const smoothScroll = useSpring(rawScroll, {
    stiffness: 180,
    damping: scrollDamping,
    mass: 1,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothScroll, 'change', (v) => {
    if (!onActiveChange || uniqueCount === 0) return;
    const idx = ((Math.round(v) % uniqueCount) + uniqueCount) % uniqueCount;
    if (idx !== lastActive.current) {
      lastActive.current = idx;
      onActiveChange(idx);
    }
  });

  useEffect(() => {
    return () => {
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, []);

  const handleWheel = (e: { deltaX: number; deltaY: number }) => {
    const delta =
      Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY * 0.8;
    scrollTarget.current += delta * 0.004;
    rawScroll.set(scrollTarget.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      scrollTarget.current = Math.round(scrollTarget.current);
      rawScroll.set(scrollTarget.current);
    }, 150);
  };

  const handlePan = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    panDistance.current += Math.abs(info.delta.x);
    scrollTarget.current += -info.delta.x * 0.005;
    rawScroll.set(scrollTarget.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
  };

  const handlePanEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    scrollTarget.current += -info.velocity.x * 0.0015;
    scrollTarget.current = Math.round(scrollTarget.current);
    rawScroll.set(scrollTarget.current);
  };

  const handleClick = () => {
    if (panDistance.current > 8) {
      panDistance.current = 0;
      return;
    }
    panDistance.current = 0;
    const idx =
      ((Math.round(scrollTarget.current) % uniqueCount) + uniqueCount) %
      uniqueCount;
    const href = slides[idx]?.href;
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: Math.max(perspective, 1),
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
      role='region'
      aria-label='Project carousel'
    >
      <motion.div
        onWheel={handleWheel}
        onPanStart={() => {
          panDistance.current = 0;
        }}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        onClick={handleClick}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 9999,
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
        whileTap={{ cursor: 'grabbing' }}
      />

      <div
        style={{
          position: 'relative',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {renderItems.map((slide, i) => (
          <PremiumSmearCard
            key={`card-${i}`}
            slide={slide}
            index={i}
            total={totalItems}
            smoothScroll={smoothScroll}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            sideItemWidth={sideItemWidth}
            sideItemHeight={sideItemHeight}
            gap={gap}
            maxRotation={maxRotation}
            borderRadius={borderRadius}
          />
        ))}
      </div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${blurSpread}%`,
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${blurSpread}%`,
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to left, black 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
    </div>
  );
}

type CardProps = {
  slide: DepthBlurSlide;
  index: number;
  total: number;
  smoothScroll: MotionValue<number>;
  itemWidth: number;
  itemHeight: number;
  sideItemWidth: number;
  sideItemHeight: number;
  gap: number;
  maxRotation: number;
  borderRadius: number;
};

function PremiumSmearCard({
  slide,
  index,
  total,
  smoothScroll,
  itemWidth,
  itemHeight,
  sideItemWidth,
  sideItemHeight,
  gap,
  maxRotation,
  borderRadius,
}: CardProps) {
  const { src, alt, title, description, category, highlights, content, href } =
    slide;

  const localOffset = useTransform(smoothScroll, (v) => {
    let linearBase = index - v;
    let mapped = ((linearBase % total) + total) % total;
    if (mapped > total / 2) mapped -= total;
    return mapped;
  });

  const absOffset = useTransform(localOffset, Math.abs);
  const cardWidth = useTransform(absOffset, [0, 1], [itemWidth, sideItemWidth], {
    clamp: true,
  });
  const cardHeight = useTransform(
    absOffset,
    [0, 1],
    [itemHeight, sideItemHeight],
    { clamp: true }
  );
  const marginLeft = useTransform(cardWidth, (w) => -w / 2);
  const marginTop = useTransform(cardHeight, (h) => -h / 2);

  const x = useTransform(localOffset, (o) => {
    const a = Math.abs(o);
    const s = Math.sign(o);
    const centerToNext = itemWidth / 2 + gap + sideItemWidth / 2;
    const sideToSide = sideItemWidth + gap;
    if (a === 0) return 0;
    if (a <= 1) return s * centerToNext * a;
    return s * (centerToNext + (a - 1) * sideToSide * 0.85);
  });

  const z = useTransform(absOffset, (a) => -a * 200);
  const rotateY = useTransform(localOffset, (o) => {
    return Math.sign(o) * Math.min(Math.abs(o) * 35, maxRotation);
  });
  const zIndex = useTransform(absOffset, (a) => 1000 - Math.round(a * 10));
  const visibilityOpacity = useTransform(absOffset, [0, 5, 7], [1, 1, 0]);
  const contentOpacity = useTransform(absOffset, [0, 0.55, 1.15], [1, 0.85, 0.35]);

  const asImage = isImageSrc(src);
  const mediaStyle: CSSProperties = asImage
    ? {
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }
    : { background: src };

  const hasCopy =
    Boolean(content) ||
    Boolean(title) ||
    Boolean(description) ||
    Boolean(category) ||
    Boolean(highlights?.length);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft,
        marginTop,
        width: cardWidth,
        height: cardHeight,
        rotateY,
        x,
        z,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        role='img'
        aria-label={alt || title}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          opacity: visibilityOpacity,
          boxShadow: '0 24px 48px rgba(0,0,0,0.32)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: '#0b1220',
        }}
      >
        {/* Theme screenshot — fills leftover height */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 140,
            ...mediaStyle,
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(11,18,32,0.08) 0%, rgba(11,18,32,0.35) 75%, #0b1220 100%)',
            }}
          />
        </div>

        {/* Info panel hugs content — no empty bottom gap */}
        {hasCopy && (
          <motion.div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              padding:
                itemWidth <= 290
                  ? '0.55rem 0.7rem 0.65rem'
                  : itemWidth <= 340
                    ? '0.65rem 0.85rem 0.75rem'
                    : '0.75rem 1rem 0.85rem',
              background: '#0b1220',
              color: '#fff',
              opacity: contentOpacity,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {content ?? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                    marginBottom: 6,
                    flexWrap: 'wrap',
                  }}
                >
                  {category && (
                    <span
                      style={{
                        fontSize: itemWidth <= 290 ? 9 : 10,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        padding: itemWidth <= 290 ? '4px 8px' : '5px 10px',
                        borderRadius: 999,
                        background:
                          'linear-gradient(90deg, #2563eb 0%, #9333ea 100%)',
                      }}
                    >
                      {category}
                    </span>
                  )}
                  {href && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: itemWidth <= 290 ? 10 : 11,
                        fontWeight: 600,
                        color: '#93c5fd',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View live site
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden
                      >
                        <path d='M15 3h6v6' />
                        <path d='M10 14 21 3' />
                        <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                      </svg>
                    </span>
                  )}
                </div>

                {title && (
                  <h3
                    style={{
                      margin: 0,
                      fontSize:
                        itemWidth <= 290
                          ? '0.95rem'
                          : itemWidth <= 340
                            ? '1.05rem'
                            : 'clamp(1rem, 1.9vw, 1.3rem)',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {title}
                  </h3>
                )}

                {description && (
                  <p
                    style={{
                      margin: '0.25rem 0 0',
                      fontSize:
                        itemWidth <= 290
                          ? '0.7rem'
                          : itemWidth <= 340
                            ? '0.75rem'
                            : 'clamp(0.72rem, 1.15vw, 0.85rem)',
                      lineHeight: 1.35,
                      color: 'rgba(255,255,255,0.78)',
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: itemWidth <= 290 ? 2 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </p>
                )}

                {!!highlights?.length && (
                  <ul
                    style={{
                      margin: '0.4rem 0 0',
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    {highlights.map((line) => (
                      <li
                        key={line}
                        style={{
                          display: 'flex',
                          gap: 6,
                          fontSize:
                            itemWidth <= 290
                              ? '0.62rem'
                              : itemWidth <= 340
                                ? '0.68rem'
                                : 'clamp(0.66rem, 1.05vw, 0.78rem)',
                          lineHeight: 1.35,
                          color: 'rgba(255,255,255,0.72)',
                        }}
                      >
                        <span style={{ color: '#60a5fa', flexShrink: 0 }}>•</span>
                        <span
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: itemWidth <= 320 ? 2 : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
