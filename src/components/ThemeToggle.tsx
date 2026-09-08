import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type ThemeToggleProps = {
  className?: string;
  /** Mobile menu: brand bone/crimson icon style */
  variant?: 'default' | 'mobile';
};

export function ThemeToggle({
  className = '',
  variant = 'default',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isMobile = variant === 'mobile';

  return (
    <motion.button
      onClick={toggleTheme}
      className={
        isMobile
          ? `nav-mobile-icon relative cursor-target ${className}`
          : `relative cursor-target rounded-full bg-gray-100 p-3 shadow-sm transition-all duration-300 hover:bg-gray-200 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 ${className}`
      }
      whileHover={{ scale: 1.12, y: isMobile ? -3 : 0 }}
      whileTap={{ scale: 0.92, rotate: 180 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0.85 : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className='relative h-5 w-5'
      >
        <motion.div
          className={`absolute inset-0 ${isMobile ? 'text-gold' : 'text-yellow-500'}`}
          animate={{
            opacity: theme === 'light' ? 1 : 0,
            scale: theme === 'light' ? 1 : 0.5,
            rotate: theme === 'light' ? 0 : 90,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className='h-5 w-5' />
        </motion.div>
        <motion.div
          className={`absolute inset-0 ${isMobile ? 'text-bone' : 'text-slate-300'}`}
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.5,
            rotate: theme === 'dark' ? 0 : -90,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className='h-5 w-5' />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
