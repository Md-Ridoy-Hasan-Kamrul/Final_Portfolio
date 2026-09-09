import { useState, useEffect, memo } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Container } from './ui/Container';
import HamburgerMenu from './HamburgerMenu';
import AnimatedSVGUnderline from './AnimatedSVGUnderline';
import { scrollToHash } from '../utils/scrollToHash';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

/** Motion Corner Menu–style field open (panel from top-right; fields cascade in) */
const cornerMenuPanel = {
  closed: {
    opacity: 0,
    scaleY: 0.72,
    scaleX: 0.92,
    transformOrigin: 'top right',
  },
  open: {
    opacity: 1,
    scaleY: 1,
    scaleX: 1,
    transformOrigin: 'top right',
    transition: {
      type: 'spring' as const,
      stiffness: 320,
      damping: 28,
      mass: 0.85,
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0.85,
    scaleX: 0.96,
    transformOrigin: 'top right',
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
};

const cornerMenuField = {
  closed: {
    opacity: 0,
    x: 48,
    y: -18,
    scale: 0.9,
    filter: 'blur(6px)',
  },
  open: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 26,
      mass: 0.7,
    },
  },
  exit: {
    opacity: 0,
    x: 28,
    y: -10,
    scale: 0.96,
    filter: 'blur(4px)',
    transition: { duration: 0.15 },
  },
};

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
            // Section is considered active if its top is near the nav band
            if (rect.top <= 160 && rect.bottom >= 160) {
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
    href: string,
  ) => {
    e.preventDefault();

    const targetId = href.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      setIsOpen(false);

      // Let mobile menu start closing, then scroll via shared helper
      window.setTimeout(() => {
        scrollToHash(href);
        setActiveSection(href);
        window.history.pushState({}, '', href);
      }, 60);
    }
  };

  const onProjects = activeSection === '#projects';
  const onProjectsNight = onProjects && theme === 'dark';
  const onSkills = activeSection === '#skills';
  const onExperience = activeSection === '#experience';
  const onContact = activeSection === '#contact';
  const onDarkNav =
    activeSection === '#about' ||
    onExperience ||
    onProjectsNight ||
    onSkills ||
    onContact;
  const useDarkLogo = theme === 'dark' || onDarkNav;

  const navSurfaceClass = (() => {
    if (isOpen && onDarkNav) {
      return 'bg-[#041018]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40';
    }
    if (isOpen && onProjects) {
      return 'bg-[#EAE3DE]/95 backdrop-blur-xl border-b border-black/10 shadow-lg';
    }
    if (isOpen) {
      return 'bg-gradient-to-b from-zinc-300/95 via-zinc-200/95 to-zinc-300/90 dark:from-zinc-800/95 dark:via-zinc-900/95 dark:to-zinc-800/90 backdrop-blur-lg shadow-lg';
    }

    switch (activeSection) {
      case '#about':
        return 'bg-[#041018]/88 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30';
      case '#experience':
        return theme === 'dark'
          ? 'bg-[#02080e]/88 backdrop-blur-xl border-b border-cyan-200/20 shadow-lg shadow-black/30'
          : 'bg-[#0c1824]/75 backdrop-blur-xl border-b border-orange-200/20 shadow-lg shadow-black/25';
      case '#projects':
        return theme === 'dark'
          ? 'bg-[#070d16]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30'
          : 'bg-white/55 backdrop-blur-xl border-b border-black/10 shadow-md shadow-black/5';
      case '#home':
        return isScrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-lg shadow-black/5'
          : 'bg-transparent';
      case '#skills':
        return theme === 'dark'
          ? 'bg-[#070b14]/88 backdrop-blur-xl border-b border-sky-200/15 shadow-lg shadow-black/40'
          : 'bg-black/20 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/15';
      case '#contact':
        return 'bg-[#080A19]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30';
      default:
        return isScrolled
          ? 'bg-gradient-to-b from-zinc-300/95 via-zinc-200/95 to-zinc-300/90 dark:from-zinc-800/95 dark:via-zinc-900/95 dark:to-zinc-800/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent';
    }
  })();

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navSurfaceClass}`}
      role='navigation'
      aria-label='Main navigation'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
    >
      {/* Gradient border bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-60 ${
          onDarkNav
            ? 'via-blue-400/50'
            : onProjects
              ? 'via-[#175A67]/40'
              : 'via-zinc-400 dark:via-zinc-600'
        }`}
      />

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
              src={useDarkLogo ? '/logo-dark.png' : '/logo.png'}
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
                      onDarkNav
                        ? isActive
                          ? '#93C5FD'
                          : '#E5E7EB'
                        : onProjects
                          ? isActive
                            ? '#175A67'
                            : '#111111'
                          : isActive
                            ? theme === 'dark'
                              ? '#60A5FA'
                              : '#2563EB'
                            : theme === 'dark'
                              ? '#D1D5DB'
                              : '#374151'
                    }
                    underlineColor={
                      onDarkNav
                        ? '#93C5FD'
                        : onProjects
                          ? '#175A67'
                          : theme === 'dark'
                            ? '#A78BFA'
                            : '#3B82F6'
                    }
                    strokeWidth={2.5}
                    gap={1}
                  />
                </motion.a>
              );
            })}

            {/* Social icons and theme toggle in desktop nav */}
            <div
              className={`hidden lg:flex items-center gap-2 ml-6 pl-6 border-l ${
                onDarkNav
                  ? 'border-white/20'
                  : onProjects
                    ? 'border-black/15'
                    : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <ThemeToggle />
              <motion.a
                href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                target='_blank'
                rel='noopener noreferrer'
                className={`cursor-target p-2 rounded-full transition-all duration-300 group relative ${
                  onDarkNav
                    ? 'text-gray-200 hover:text-white hover:bg-white/10'
                    : onProjects
                      ? 'text-black hover:text-white hover:bg-black'
                      : 'text-gray-700 hover:text-white hover:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
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
                className={`cursor-target p-2 rounded-full transition-all duration-300 group relative ${
                  onDarkNav
                    ? 'text-gray-200 hover:text-white hover:bg-blue-600/80'
                    : onProjects
                      ? 'text-black hover:text-white hover:bg-blue-600'
                      : 'text-gray-700 hover:text-white hover:bg-blue-600 dark:text-gray-300 dark:hover:bg-blue-600'
                }`}
                aria-label='LinkedIn Profile'
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className='h-5 w-5' />
              </motion.a>
            </div>
          </div>

          {/* Mobile hamburger — Framer HamburgerMenu morph */}
          <div
            className={`md:hidden relative flex items-center justify-center p-1 ${
              onDarkNav
                ? 'text-white'
                : onProjects
                  ? 'text-black'
                  : 'text-gray-800 dark:text-white'
            }`}
          >
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

      {/* Mobile dropdown — Motion Corner Menu field open; hamburger icon unchanged */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden overflow-hidden backdrop-blur-lg border-t shadow-2xl ${
              onDarkNav
                ? 'bg-[#041018]/98 border-white/10 shadow-black/40'
                : onProjects
                  ? 'bg-[#EAE3DE]/98 border-black/10 shadow-black/10'
                  : 'bg-gradient-to-b from-zinc-300/95 via-zinc-200/95 to-zinc-300/95 dark:from-zinc-800/95 dark:via-zinc-900/95 dark:to-zinc-800/95 border-zinc-400/40 dark:border-zinc-700 shadow-zinc-500/15 dark:shadow-black/40'
            }`}
            variants={cornerMenuPanel}
            initial='closed'
            animate='open'
            exit='exit'
          >
            <Container className='space-y-2 py-6'>
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    variants={cornerMenuField}
                    className={`cursor-target relative group block overflow-hidden rounded-xl px-6 py-3 font-medium transition-colors duration-300 ${
                      isActive
                        ? 'nav-active-pill text-white'
                        : onDarkNav
                          ? 'text-gray-200 hover:bg-white/10 hover:text-white'
                          : onProjects
                            ? 'text-black hover:bg-black/5 hover:text-[#175A67]'
                            : 'text-zinc-800 hover:bg-zinc-400/30 hover:text-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-700/50 dark:hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <span className='nav-active-wave' aria-hidden='true' />
                    )}
                    <span className='relative z-10 flex items-center'>
                      {isActive && (
                        <motion.span
                          className='mr-2 h-2 w-2 rounded-full bg-bone'
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        />
                      )}
                      {link.label}
                    </span>
                    {!isActive && (
                      <div className='absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r bg-crimson transition-all duration-300 group-hover:h-1/2' />
                    )}
                  </motion.a>
                );
              })}

              <motion.div
                className='mt-6 flex justify-center gap-4 border-t border-white/10 pt-6'
                variants={cornerMenuField}
              >
                <ThemeToggle variant='mobile' />
                <motion.a
                  href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='nav-mobile-icon cursor-target'
                  aria-label='GitHub Profile'
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Github className='h-5 w-5' />
                </motion.a>
                <motion.a
                  href='https://www.linkedin.com/in/md-ridoy-hasan-kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='nav-mobile-icon nav-mobile-icon--accent cursor-target'
                  aria-label='LinkedIn Profile'
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.92 }}
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
