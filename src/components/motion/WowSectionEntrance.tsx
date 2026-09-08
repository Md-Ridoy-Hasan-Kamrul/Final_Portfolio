import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from 'framer-motion';
import type { ReactNode, RefObject } from 'react';

/**
 * Uncommon, heavy, eye-catching scroll entrances — each variant is a different
 * cinematic trick (not a basic fade/slide).
 */
export type WowVariant =
  | 'riftSplit' // About — center rift panels tear open
  | 'bladeSlash' // Experience — diagonal slash + streak
  | 'irisPunch' // Projects — iris aperture + overscale punch
  | 'prismTumble' // Skills — 3D prism tumble + blinds
  | 'vortexLock' // Contact — spin-lock from a speck
  | 'curtainBloom'; // Footer — curtain lift + bloom flash

type Props = {
  variant: WowVariant;
  sectionRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
};

function useProgress(ref: RefObject<HTMLElement | null>) {
  return useScroll({
    target: ref,
    offset: ['start end', 'start 18%'],
  }).scrollYProgress;
}

function Flash({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      className='pointer-events-none absolute inset-0 z-[40] mix-blend-overlay'
      style={{
        opacity,
        background:
          'radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, transparent 55%)',
      }}
    />
  );
}

function RiftSplit({
  p,
  children,
  className,
}: {
  p: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  const leftX = useTransform(p, [0, 0.55, 1], ['0%', '-105%', '-105%']);
  const rightX = useTransform(p, [0, 0.55, 1], ['0%', '105%', '105%']);
  const y = useTransform(p, [0, 0.75, 1], [320, -18, 0]);
  const scale = useTransform(p, [0, 0.7, 0.88, 1], [0.62, 1.1, 0.97, 1]);
  const rotateX = useTransform(p, [0, 1], [48, 0]);
  const opacity = useTransform(p, [0, 0.15, 0.45, 1], [0, 0.2, 0.85, 1]);
  const blur = useTransform(p, [0, 0.55, 1], [28, 10, 0]);
  const contrast = useTransform(p, [0, 0.4, 0.7, 1], [1.6, 1.35, 1.1, 1]);
  const filter = useMotionTemplate`blur(${blur}px) contrast(${contrast})`;
  const flash = useTransform(p, [0.25, 0.45, 0.65], [0, 0.75, 0]);
  const clip = useTransform(
    p,
    [0, 0.4, 0.75, 1],
    [
      'polygon(48% 0%, 52% 0%, 52% 100%, 48% 100%)',
      'polygon(22% 0%, 78% 0%, 78% 100%, 22% 100%)',
      'polygon(4% 0%, 96% 0%, 96% 100%, 4% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ]
  );

  return (
    <div className={`relative ${className ?? ''}`} style={{ perspective: 1400 }}>
      <motion.div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 left-0 z-[35] w-1/2 bg-black'
        style={{ x: leftX }}
      />
      <motion.div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 right-0 z-[35] w-1/2 bg-black'
        style={{ x: rightX }}
      />
      <Flash opacity={flash} />
      <motion.div
        className='relative z-10 origin-center will-change-transform'
        style={{
          y,
          scale,
          rotateX,
          opacity,
          filter,
          clipPath: clip,
          transformPerspective: 1400,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function BladeSlash({
  p,
  children,
  className,
}: {
  p: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  const x = useTransform(p, [0, 0.7, 0.9, 1], ['-42vw', '2vw', '-0.5vw', '0vw']);
  const skewX = useTransform(p, [0, 0.55, 0.85, 1], [28, -6, 2, 0]);
  const rotate = useTransform(p, [0, 0.6, 1], [-14, 3, 0]);
  const scale = useTransform(p, [0, 0.65, 0.88, 1], [0.78, 1.08, 0.98, 1]);
  const opacity = useTransform(p, [0, 0.12, 0.4, 1], [0, 0.15, 0.9, 1]);
  const blur = useTransform(p, [0, 0.5, 1], [24, 8, 0]);
  const saturate = useTransform(p, [0, 0.45, 1], [0.4, 1.4, 1]);
  const filter = useMotionTemplate`blur(${blur}px) saturate(${saturate})`;
  const clip = useTransform(
    p,
    [0, 0.35, 0.7, 1],
    [
      'polygon(0 0, 0 0, 0 100%, 0 100%)',
      'polygon(0 0, 55% 0, 35% 100%, 0 100%)',
      'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
      'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    ]
  );
  const streakX = useTransform(p, [0, 1], ['-120%', '140%']);
  const streakOp = useTransform(p, [0, 0.25, 0.55, 0.8], [0, 1, 1, 0]);
  const veil = useTransform(p, [0, 0.5, 1], [0.95, 0.35, 0]);
  const flash = useTransform(p, [0.3, 0.48, 0.62], [0, 0.9, 0]);

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-[34] bg-black'
        style={{ opacity: veil }}
      />
      <motion.div
        aria-hidden
        className='pointer-events-none absolute inset-y-[-20%] left-0 z-[36] w-[14%] -skew-x-[28deg]'
        style={{
          x: streakX,
          opacity: streakOp,
          background:
            'linear-gradient(90deg, transparent, rgba(223,54,64,0.95), rgba(212,175,55,0.9), transparent)',
          filter: 'blur(2px)',
        }}
      />
      <Flash opacity={flash} />
      <motion.div
        className='relative z-10 will-change-transform'
        style={{
          x,
          skewX,
          rotate,
          scale,
          opacity,
          filter,
          clipPath: clip,
          transformOrigin: 'left center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function IrisPunch({
  p,
  children,
  className,
}: {
  p: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  const scale = useTransform(p, [0, 0.55, 0.82, 1], [2.35, 0.9, 1.06, 1]);
  const rotate = useTransform(p, [0, 0.6, 0.85, 1], [22, -5, 1.5, 0]);
  const y = useTransform(p, [0, 0.7, 1], [180, -12, 0]);
  const opacity = useTransform(p, [0, 0.18, 0.5, 1], [0, 0.25, 1, 1]);
  const blur = useTransform(p, [0, 0.45, 0.8, 1], [32, 14, 4, 0]);
  const brightness = useTransform(p, [0, 0.4, 0.65, 1], [1.8, 1.35, 1.05, 1]);
  const filter = useMotionTemplate`blur(${blur}px) brightness(${brightness})`;
  const clip = useTransform(
    p,
    [0, 0.35, 0.7, 1],
    [
      'circle(0% at 50% 48%)',
      'circle(28% at 50% 48%)',
      'circle(72% at 50% 48%)',
      'circle(160% at 50% 48%)',
    ]
  );
  const ring = useTransform(p, [0, 0.5, 1], [0.05, 0.55, 1.6]);
  const ringOp = useTransform(p, [0, 0.2, 0.55, 0.85], [0, 1, 0.6, 0]);
  const flash = useTransform(p, [0.35, 0.5, 0.7], [0, 0.85, 0]);

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-1/2 z-[34] aspect-square w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70'
        style={{ scale: ring, opacity: ringOp }}
      />
      <Flash opacity={flash} />
      <motion.div
        className='relative z-10 will-change-transform'
        style={{
          scale,
          rotate,
          y,
          opacity,
          filter,
          clipPath: clip,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function BlindStrip({
  p,
  index,
  dir,
}: {
  p: MotionValue<number>;
  index: number;
  dir: -1 | 1;
}) {
  const x = useTransform(
    p,
    [0, 0.25 + index * 0.08, 0.7 + index * 0.04, 1],
    ['0%', '0%', `${dir * 110}%`, `${dir * 110}%`]
  );
  return (
    <motion.div
      className='flex-1 border-b border-white/5 bg-[#05070f]/92 last:border-b-0'
      style={{ x }}
    />
  );
}

function PrismTumble({
  p,
  children,
  className,
}: {
  p: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  const rotateX = useTransform(p, [0, 0.7, 1], [78, -6, 0]);
  const rotateY = useTransform(p, [0, 0.65, 1], [-42, 8, 0]);
  const rotateZ = useTransform(p, [0, 0.55, 1], [8, -2, 0]);
  const z = useTransform(p, [0, 1], [-520, 0]);
  const y = useTransform(p, [0, 0.75, 1], [220, -16, 0]);
  const scale = useTransform(p, [0, 0.7, 0.9, 1], [0.55, 1.12, 0.98, 1]);
  const opacity = useTransform(p, [0, 0.2, 0.55, 1], [0, 0.3, 1, 1]);
  const blur = useTransform(p, [0, 0.5, 1], [20, 7, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const flash = useTransform(p, [0.4, 0.55, 0.72], [0, 0.7, 0]);
  const blinds: Array<-1 | 1> = [-1, 1, -1, 1, -1];

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ perspective: 1600 }}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-[34] flex flex-col'
      >
        {blinds.map((dir, i) => (
          <BlindStrip key={i} p={p} index={i} dir={dir} />
        ))}
      </div>
      <Flash opacity={flash} />
      <motion.div
        className='relative z-10 will-change-transform'
        style={{
          rotateX,
          rotateY,
          rotateZ,
          z,
          y,
          scale,
          opacity,
          filter,
          transformPerspective: 1600,
          transformOrigin: 'center bottom',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function VortexLock({
  p,
  children,
  className,
}: {
  p: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  const scale = useTransform(p, [0, 0.55, 0.82, 1], [0.08, 1.18, 0.96, 1]);
  const rotate = useTransform(p, [0, 0.6, 0.88, 1], [210, -12, 4, 0]);
  const opacity = useTransform(p, [0, 0.15, 0.4, 1], [0, 0.2, 1, 1]);
  const blur = useTransform(p, [0, 0.4, 0.75, 1], [30, 12, 3, 0]);
  const brightness = useTransform(p, [0, 0.45, 1], [2.2, 1.25, 1]);
  const filter = useMotionTemplate`blur(${blur}px) brightness(${brightness})`;
  const clip = useTransform(
    p,
    [0, 0.4, 0.75, 1],
    [
      'circle(2% at 50% 50%)',
      'circle(35% at 50% 50%)',
      'circle(70% at 50% 50%)',
      'circle(160% at 50% 50%)',
    ]
  );
  const ring1 = useTransform(p, [0, 1], [0.2, 1.8]);
  const ring2 = useTransform(p, [0, 1], [0.05, 1.35]);
  const ringOp = useTransform(p, [0, 0.25, 0.65, 1], [0, 1, 0.45, 0]);
  const flash = useTransform(p, [0.4, 0.55, 0.7], [0, 1, 0]);

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-1/2 z-[34] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DF3640]/80'
        style={{ scale: ring1, opacity: ringOp }}
      />
      <motion.div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-1/2 z-[34] h-[min(50vw,380px)] w-[min(50vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/70'
        style={{ scale: ring2, opacity: ringOp }}
      />
      <Flash opacity={flash} />
      <motion.div
        className='relative z-10 will-change-transform'
        style={{
          scale,
          rotate,
          opacity,
          filter,
          clipPath: clip,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function CurtainBloom({
  p,
  children,
  className,
}: {
  p: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  const y = useTransform(p, [0, 0.7, 0.9, 1], [240, -28, 8, 0]);
  const scaleY = useTransform(p, [0, 0.55, 0.85, 1], [0.35, 1.12, 0.97, 1]);
  const scale = useTransform(p, [0, 0.7, 1], [0.88, 1.04, 1]);
  const opacity = useTransform(p, [0, 0.2, 0.55, 1], [0, 0.35, 1, 1]);
  const blur = useTransform(p, [0, 0.55, 1], [18, 6, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const clip = useTransform(
    p,
    [0, 0.4, 0.75, 1],
    [
      'inset(100% 0% 0% 0%)',
      'inset(45% 0% 0% 0%)',
      'inset(8% 0% 0% 0%)',
      'inset(0% 0% 0% 0%)',
    ]
  );
  const curtainY = useTransform(p, [0, 0.65, 1], ['0%', '-110%', '-110%']);
  const flash = useTransform(p, [0.35, 0.52, 0.75], [0, 0.65, 0]);

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-[35]'
        style={{
          y: curtainY,
          background:
            'linear-gradient(180deg, rgba(8,6,10,0.98) 0%, rgba(8,6,10,0.85) 70%, transparent 100%)',
        }}
      />
      <Flash opacity={flash} />
      <motion.div
        className='relative z-10 will-change-transform'
        style={{
          y,
          scaleY,
          scale,
          opacity,
          filter,
          clipPath: clip,
          transformOrigin: 'center top',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function WowSectionEntrance({
  variant,
  sectionRef,
  children,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const p = useProgress(sectionRef);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  switch (variant) {
    case 'riftSplit':
      return (
        <RiftSplit p={p} className={className}>
          {children}
        </RiftSplit>
      );
    case 'bladeSlash':
      return (
        <BladeSlash p={p} className={className}>
          {children}
        </BladeSlash>
      );
    case 'irisPunch':
      return (
        <IrisPunch p={p} className={className}>
          {children}
        </IrisPunch>
      );
    case 'prismTumble':
      return (
        <PrismTumble p={p} className={className}>
          {children}
        </PrismTumble>
      );
    case 'vortexLock':
      return (
        <VortexLock p={p} className={className}>
          {children}
        </VortexLock>
      );
    case 'curtainBloom':
      return (
        <CurtainBloom p={p} className={className}>
          {children}
        </CurtainBloom>
      );
    default:
      return <div className={className}>{children}</div>;
  }
}
