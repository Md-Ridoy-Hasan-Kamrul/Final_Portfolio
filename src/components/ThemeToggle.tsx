import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className='relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95, rotate: 180 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0.8 : 1,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
        className='relative w-5 h-5'
      >
        {/* Sun Icon */}
        <motion.div
          className='absolute inset-0 text-yellow-500'
          animate={{
            opacity: theme === 'light' ? 1 : 0,
            scale: theme === 'light' ? 1 : 0.5,
            rotate: theme === 'light' ? 0 : 90,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Sun className='w-5 h-5' />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          className='absolute inset-0 text-blue-500'
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.5,
            rotate: theme === 'dark' ? 0 : -90,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Moon className='w-5 h-5' />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
