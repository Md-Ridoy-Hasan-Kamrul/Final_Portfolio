import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage immediately
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Update document class and save to localStorage with animation
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Add transition overlay effect
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
      transition: opacity 0.4s ease-in-out;
    `;
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    setTimeout(() => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 400);
      }, 200);
    }, 200);
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
