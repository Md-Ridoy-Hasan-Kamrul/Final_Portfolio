import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const VIDEO_SRC = 'https://cdn.zajno.com/dev/codepen/fossil/fossil.mp4';

const customEaseIn = CustomEase.create(
  'hero-video-ease-in',
  '0.52, 0.00, 0.48, 1.00',
);

const fourtyFrames = 1.3333333;

type HeroVideoBgProps = {
  className?: string;
};

/**
 * Full-bleed cinematic video background for the Hero.
 * Does not replace Hero copy/UI — only the backdrop layer.
 */
export default function HeroVideoBg({ className = '' }: HeroVideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(wrap, { autoAlpha: 1 });
      video.pause();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrap,
        { autoAlpha: 0, scale: 1.06 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: fourtyFrames,
          ease: customEaseIn,
        },
      );

      const play = () => {
        void video.play().catch(() => {
          /* autoplay can fail until user gesture; muted + playsInline usually ok */
        });
      };

      if (video.readyState >= 2) play();
      else video.addEventListener('loadeddata', play, { once: true });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0 ${className}`}
      aria-hidden='true'
    >
      <video
        ref={videoRef}
        className='hero-video absolute inset-0 h-full w-full object-cover'
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
      >
        <source src={VIDEO_SRC} type='video/mp4' />
      </video>

      {/* Readability scrim — keeps existing Hero text/UI legible */}
      <div className='absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-blue-50/75 dark:from-gray-950/80 dark:via-gray-900/75 dark:to-gray-950/85' />
    </div>
  );
}
