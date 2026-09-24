import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  getMotionProfile,
  prefersReducedMotion,
  type MotionProfile,
} from '@/lib/motion';

type MotionContextValue = {
  profile: MotionProfile;
  isAdvanced: boolean;
  isOptimized: boolean;
  isLight: boolean;
  isOff: boolean;
  /** WCAG 2.2.2 — user can pause infinite / autoplay motion */
  loopsPaused: boolean;
  setLoopsPaused: (paused: boolean) => void;
  toggleLoopsPaused: () => void;
};

const MotionContext = createContext<MotionContextValue>({
  profile: 'advanced',
  isAdvanced: true,
  isOptimized: false,
  isLight: false,
  isOff: false,
  loopsPaused: false,
  setLoopsPaused: () => undefined,
  toggleLoopsPaused: () => undefined,
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<MotionProfile>(() =>
    typeof window === 'undefined' ? 'advanced' : getMotionProfile(),
  );
  const [loopsPaused, setLoopsPaused] = useState(() =>
    typeof window === 'undefined' ? false : prefersReducedMotion(),
  );

  useEffect(() => {
    const update = () => {
      const next = getMotionProfile();
      setProfile(next);
      if (next === 'off') setLoopsPaused(true);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      mq.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motionLoops = loopsPaused
      ? 'paused'
      : 'running';
  }, [loopsPaused]);

  const value: MotionContextValue = {
    profile,
    isAdvanced: profile === 'advanced',
    isOptimized: profile === 'optimized',
    isLight: profile === 'light',
    isOff: profile === 'off',
    loopsPaused,
    setLoopsPaused,
    toggleLoopsPaused: () => setLoopsPaused((p) => !p),
  };

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotionProfile() {
  return useContext(MotionContext);
}
