import { createContext, useContext, useEffect, useState } from 'react';
import { DURATION, DURATION_CSS, EASING_CSS } from '@/lib/motion';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const ms = DURATION.hero * 1000;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${
        theme === 'light'
          ? 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3))'
          : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))'
      };
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity ${DURATION_CSS.hero} ${EASING_CSS.easeInOutCubic};
    `;
    document.body.appendChild(overlay);
    overlay.style.willChange = 'opacity';

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    window.setTimeout(() => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

      window.setTimeout(() => {
        overlay.style.opacity = '0';
        window.setTimeout(() => {
          overlay.style.willChange = 'auto';
          if (overlay.parentNode) document.body.removeChild(overlay);
        }, ms);
      }, DURATION.structural * 1000);
    }, DURATION.structural * 1000);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
