import { useState, useEffect, memo } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Container } from './ui/Container';
import HamburgerMenu from './HamburgerMenu';
import AnimatedSVGUnderline from './AnimatedSVGUnderline';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

const Navigation = memo(() => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section based on scroll position
      const sections = navLinks.map((link) => link.href.substring(1));
      let currentSection = '#home';

      // Get viewport height and scroll position
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // If we're at the bottom of the page, activate the last section (contact)
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        currentSection = '#contact';
      } else {
        // Check from bottom to top to prioritize sections in view
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Section is considered active if its top is in the upper third of viewport
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = `#${sections[i]}`;
              break;
            }
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const targetId = href.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      // Close mobile menu first
      setIsOpen(false);

      // Wait a tiny bit for menu to start closing, then scroll
      setTimeout(() => {
        // Get actual navbar height dynamically
        const navHeight =
          window.innerWidth >= 1024
            ? 128
            : window.innerWidth >= 768
            ? 112
            : window.innerWidth >= 640
            ? 96
            : 80;

        // Get the element's position relative to the document
        const elementTop = element.offsetTop;

        // Calculate scroll position with navbar offset
        const scrollPosition = elementTop - navHeight;

        // Scroll to the calculated position
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });

        // Update active state
        setActiveSection(href);

        // Update URL
        window.history.pushState({}, '', href);
      }, 50);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled || isOpen
          ? 'bg-gradient-to-b from-zinc-300/95 via-zinc-200/95 to-zinc-300/90 dark:from-zinc-800/95 dark:via-zinc-900/95 dark:to-zinc-800/90 backdrop-blur-lg shadow-lg shadow-zinc-500/10 dark:shadow-black/30'
          : 'bg-transparent backdrop-blur-0'
      }`}
      role='navigation'
      aria-label='Main navigation'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
    >
      {/* Gradient border bottom */}
      <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-600 to-transparent opacity-60' />

      <Container>
        <div className='flex justify-between items-center h-20 sm:h-24 md:h-28 lg:h-28'>
          {/* Logo with 3D effect */}
          <motion.a
            href='#home'
            onClick={(e) => handleLinkClick(e, '#home')}
            className='cursor-target relative group'
            aria-label='Go to home section'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={theme === 'dark' ? '/logo-dark.png' : '/logo.png'}
              alt='KH Kamrul - Frontend Engineer'
              className='h-20 sm:h-20 md:h-24 lg:h-36 w-auto relative z-10 object-contain transition-opacity duration-300'
            />
            <motion.div
              className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10'
              animate={{
                scale: [1, 1.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          </motion.a>

          {/* Desktop Navigation — Framer AnimatedSVGUnderline */}
          <div className='hidden md:flex items-center space-x-1 lg:space-x-3'>
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className='cursor-target relative px-2 py-1 font-medium'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <AnimatedSVGUnderline
                    text={link.label}
                    forceShow={isActive}
                    textColor={
                      isActive
                        ? theme === 'dark'
                          ? '#60A5FA'
                          : '#2563EB'
                        : theme === 'dark'
                          ? '#D1D5DB'
                          : '#374151'
                    }
                    underlineColor={
                      theme === 'dark' ? '#A78BFA' : '#3B82F6'
                    }
                    strokeWidth={2.5}
                    gap={1}
                  />
                </motion.a>
              );
            })}

            {/* Social icons and theme toggle in desktop nav */}
            <div className='hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-gray-200 dark:border-gray-700'>
              <ThemeToggle />
              <motion.a
                href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-target p-2 text-gray-700 hover:text-white hover:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 rounded-full transition-all duration-300 group relative'
                aria-label='GitHub Profile'
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className='h-5 w-5' />
                <div className='absolute inset-0 bg-gray-900/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              </motion.a>
              <motion.a
                href='https://www.linkedin.com/in/md-ridoy-hasan-kamrul'
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-target p-2 text-gray-700 hover:text-white hover:bg-blue-600 dark:text-gray-300 dark:hover:bg-blue-600 rounded-full transition-all duration-300 group relative'
                aria-label='LinkedIn Profile'
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className='h-5 w-5' />
                <div className='absolute inset-0 bg-blue-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              </motion.a>
            </div>
          </div>

          {/* Mobile hamburger — Framer HamburgerMenu morph */}
          <div className='md:hidden relative flex items-center justify-center p-1 text-gray-800 dark:text-white'>
            <HamburgerMenu
              isOpen={isOpen}
              onToggle={setIsOpen}
              size={40}
              strokeWidth={2.5}
              strokeColor='currentColor'
              className='cursor-target'
            />
          </div>
        </div>
      </Container>

      {/* Mobile Menu with animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='md:hidden bg-gradient-to-b from-zinc-300/95 via-zinc-200/95 to-zinc-300/95 dark:from-zinc-800/95 dark:via-zinc-900/95 dark:to-zinc-800/95 backdrop-blur-lg border-t border-zinc-400/40 dark:border-zinc-700 shadow-2xl shadow-zinc-500/15 dark:shadow-black/40'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Container className='space-y-2 py-6'>
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`cursor-target block px-6 py-3 font-medium rounded-xl transition-all duration-300 relative group ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30'
                        : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-400/30 dark:hover:bg-zinc-700/50 hover:text-blue-700 dark:hover:text-blue-300'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className='relative z-10 flex items-center'>
                      {isActive && (
                        <motion.span
                          className='mr-2 w-2 h-2 bg-white rounded-full'
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        />
                      )}
                      {link.label}
                    </span>
                    {!isActive && (
                      <div className='absolute left-0 top-1/2 w-1 h-0 group-hover:h-1/2 transform -translate-y-1/2 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r transition-all duration-300' />
                    )}
                  </motion.a>
                );
              })}

              <motion.div
                className='flex justify-center gap-4 pt-6 mt-6 border-t border-zinc-400/50 dark:border-zinc-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
              >
                <ThemeToggle />
                <motion.a
                  href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target p-3 text-white bg-gray-900 dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
                  aria-label='GitHub Profile'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className='h-5 w-5' />
                </motion.a>
                <motion.a
                  href='https://www.linkedin.com/in/md-ridoy-hasan-kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target p-3 text-white bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
                  aria-label='LinkedIn Profile'
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className='h-5 w-5' />
                </motion.a>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
