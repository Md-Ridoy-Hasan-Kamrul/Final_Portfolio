import { Pause, Play } from 'lucide-react';
import { useMotionProfile } from '@/contexts/MotionContext';
import { DURATION_CSS, EASING_CSS } from '@/lib/motion';

/**
 * WCAG 2.2.2 — visible control to pause infinite / autoplay motion
 * (ambient loops, WebGL liquid buttons, particle/weather systems).
 */
export default function MotionPauseToggle() {
  const { loopsPaused, toggleLoopsPaused, isOff } = useMotionProfile();

  if (isOff) return null;

  return (
    <button
      type='button'
      onClick={toggleLoopsPaused}
      className='fixed bottom-4 left-4 z-[90] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-2 font-inter text-[11px] uppercase tracking-[0.14em] text-white/90 backdrop-blur-md hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:bottom-6 sm:left-6'
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: DURATION_CSS.micro,
        transitionTimingFunction: EASING_CSS.easeOutExpo,
      }}
      aria-pressed={loopsPaused}
      aria-label={
        loopsPaused
          ? 'Play background animations'
          : 'Pause background animations'
      }
    >
      {loopsPaused ? (
        <Play className='h-3.5 w-3.5' aria-hidden />
      ) : (
        <Pause className='h-3.5 w-3.5' aria-hidden />
      )}
      <span>{loopsPaused ? 'Play motion' : 'Pause motion'}</span>
    </button>
  );
}
