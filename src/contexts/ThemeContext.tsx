import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  DURATION,
  DURATION_CSS,
  EASING_CSS,
  prefersReducedMotion,
} from '@/lib/motion';

type Theme = 'light' | 'dark';

export type ThemeTransit = {
  id: number;
  from: Theme;
  to: Theme;
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  transit: ThemeTransit | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'dark';
  });
  const [transit, setTransit] = useState<ThemeTransit | null>(null);
  const busyRef = useRef(false);
  const transitIdRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (busyRef.current) return;

    const from = theme;
    const to: Theme = from === 'light' ? 'dark' : 'light';
    const reduced = prefersReducedMotion();
    const flightMs = DURATION.skyTransit * 1000;
    /** Flip theme near mid-flight so sky + UI stay in sync */
    const flipAt = reduced ? 0 : flightMs * 0.48;
    const overlayFadeMs = DURATION.hero * 1000;

    busyRef.current = true;

    if (!reduced) {
      transitIdRef.current += 1;
      setTransit({ id: transitIdRef.current, from, to });
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${
        from === 'light'
          ? 'radial-gradient(circle at 12% 88%, rgba(255, 180, 60, 0.32), rgba(59, 130, 246, 0.14) 42%, transparent 72%)'
          : 'radial-gradient(circle at 88% 12%, rgba(186, 220, 255, 0.26), rgba(99, 102, 241, 0.14) 42%, transparent 72%)'
      };
      z-index: 9997;
      opacity: 0;
      pointer-events: none;
      transition: opacity ${DURATION_CSS.skyTransit} ${EASING_CSS.easeInOutCubic};
    `;
    document.body.appendChild(overlay);
    overlay.style.willChange = 'opacity';

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    window.setTimeout(() => {
      setTheme(to);

      window.setTimeout(() => {
        overlay.style.opacity = '0';
        window.setTimeout(() => {
          overlay.style.willChange = 'auto';
          if (overlay.parentNode) document.body.removeChild(overlay);
        }, overlayFadeMs);
      }, flightMs * 0.22);
    }, flipAt);

    window.setTimeout(() => {
      setTransit(null);
      busyRef.current = false;
    }, reduced ? overlayFadeMs : flightMs);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, transit }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
