import type { RefObject } from 'react';
import {
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionStyle,
} from 'framer-motion';

/**
 * Distinct heavy scroll entrances per section.
 * - riseClip    → About (up + clip)
 * - slamLeft    → Experience (hard from left)
 * - zoomPunch   → Projects (zoom from far)
 * - flipDeck    → Skills (3D flip up)
 * - burstCenter → Contact (scale burst)
 * - riseSoft    → Footer (slow rise)
 */
export type HeavyPreset =
  | 'riseClip'
  | 'slamLeft'
  | 'zoomPunch'
  | 'flipDeck'
  | 'burstCenter'
  | 'riseSoft';

export function useHeavySectionMotion(
  ref: RefObject<HTMLElement | null>,
  preset: HeavyPreset
): MotionStyle {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 20%'],
  });

  const yUp = useTransform(scrollYProgress, [0, 1], [220, 0]);
  const yFlip = useTransform(scrollYProgress, [0, 1], [160, 0]);
  const ySoft = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const xLeft = useTransform(scrollYProgress, [0, 1], [-200, 0]);

  const scalePunch = useTransform(scrollYProgress, [0, 1], [1.45, 1]);
  const scaleBurst = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const scaleRise = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const scaleSlam = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const scaleSoft = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.4, 1]);
  const opacitySoft = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.5, 1]);

  const blurHeavy = useTransform(scrollYProgress, [0, 0.65, 1], [22, 8, 0]);
  const blurMed = useTransform(scrollYProgress, [0, 0.7, 1], [14, 5, 0]);
  const filterHeavy = useMotionTemplate`blur(${blurHeavy}px)`;
  const filterMed = useMotionTemplate`blur(${blurMed}px)`;

  const rotateSlam = useTransform(scrollYProgress, [0, 1], [-8, 0]);
  const rotateZoom = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [58, 0]);
  const rotateBurst = useTransform(scrollYProgress, [0, 1], [-12, 0]);
  const skewSlam = useTransform(scrollYProgress, [0, 1], [10, 0]);

  const clipRise = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['inset(30% 0% 0% 0%)', 'inset(10% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );
  const clipSlam = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    ['inset(0% 0% 0% 40%)', 'inset(0% 0% 0% 8%)', 'inset(0% 0% 0% 0%)']
  );
  const clipZoom = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['inset(12% 12% 12% 12%)', 'inset(4% 4% 4% 4%)', 'inset(0% 0% 0% 0%)']
  );

  if (preset === 'riseClip') {
    return {
      y: yUp,
      scale: scaleRise,
      opacity,
      filter: filterHeavy,
      clipPath: clipRise,
    };
  }
  if (preset === 'slamLeft') {
    return {
      x: xLeft,
      scale: scaleSlam,
      opacity,
      filter: filterMed,
      rotate: rotateSlam,
      skewX: skewSlam,
      clipPath: clipSlam,
      transformOrigin: 'left center',
    };
  }
  if (preset === 'zoomPunch') {
    return {
      scale: scalePunch,
      opacity,
      filter: filterHeavy,
      rotate: rotateZoom,
      clipPath: clipZoom,
      transformOrigin: 'center center',
    };
  }
  if (preset === 'flipDeck') {
    return {
      y: yFlip,
      opacity,
      filter: filterMed,
      rotateX,
      transformPerspective: 1200,
      transformOrigin: 'center bottom',
    };
  }
  if (preset === 'burstCenter') {
    return {
      scale: scaleBurst,
      opacity,
      filter: filterHeavy,
      rotate: rotateBurst,
      transformOrigin: 'center center',
    };
  }
  // riseSoft
  return {
    y: ySoft,
    opacity: opacitySoft,
    scale: scaleSoft,
    filter: filterMed,
  };
}
