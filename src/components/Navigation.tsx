import { useState, useEffect, memo } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Container } from './ui/Container';
import HamburgerMenu from './HamburgerMenu';
import AnimatedSVGUnderline from './AnimatedSVGUnderline';
import FullscreenNavOverlay from './FullscreenNavOverlay';
import { scrollToHash } from '../utils/scrollToHash';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

/** Compact / fullscreen nav for ≤1020px; desktop horizontal links stay above that. */
const COMPACT_NAV = 'min-[1021px]:hidden';
const DESKTOP_NAV = 'hidden min-[1021px]:flex';

const Navigation = memo(() => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      let currentSection = '#home';

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition + windowHeight >= documentHeight - 50) {
        currentSection = '#contact';
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element) {
            const rect = element.getBoundingClientRect();
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close fullscreen menu if viewport grows into desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1021px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
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
  const useDarkLogo = theme === 'dark' || onDarkNav || isOpen;

  const navSurfaceClass = (() => {
    if (isOpen) {
      return 'bg-transparent border-transparent shadow-none';
    }

    switch (activeSection) {
      case '#about':
        return 'bg-[#041018]/88 backdrop-blur-xl border-b border-white/10 shadow-none';
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

  const fullscreenDark = onDarkNav || theme === 'dark';

  const menuPillClass = (() => {
    if (isOpen) {
      return fullscreenDark
        ? 'border-white/35 text-[#E8E2D6] bg-white/5'
        : 'border-black/25 text-[#14110f] bg-black/5';
    }
    if (onDarkNav) {
      return 'border-white/35 text-white bg-white/5 hover:bg-white/10';
    }
    if (onProjects) {
      return 'border-black/25 text-black bg-black/5 hover:bg-black/10';
    }
    return 'border-gray-800/30 text-gray-800 bg-black/5 hover:bg-black/10 dark:border-white/30 dark:text-white dark:bg-white/5 dark:hover:bg-white/10';
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
      {/* Gradient border bottom — hidden while fullscreen menu is open */}
      {!isOpen && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-60 ${
            onDarkNav
              ? 'via-blue-400/50'
              : onProjects
                ? 'via-[#175A67]/40'
                : 'via-zinc-400 dark:via-zinc-600'
          }`}
        />
      )}

      {/* Top bar stays above fullscreen overlay so MENU can close */}
      <Container className='relative z-[70]'>
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

          {/* Desktop Navigation — untouched above 1020px */}
          <div className={`${DESKTOP_NAV} items-center space-x-1 lg:space-x-3`}>
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

          {/* Compact MENU pill — Laptop 1020 / Tablet / Mobile only */}
          <div className={COMPACT_NAV}>
            <div
              role='button'
              tabIndex={0}
              onClick={() => setIsOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOpen((v) => !v);
                }
              }}
              className={`cursor-target inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-300 min-[375px]:gap-2.5 min-[375px]:px-4 min-[375px]:py-2 ${menuPillClass}`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <span className='font-inter text-[11px] font-semibold uppercase tracking-[0.18em] min-[375px]:text-xs'>
                {isOpen ? 'Close' : 'Menu'}
              </span>
              <HamburgerMenu
                isOpen={isOpen}
                onToggle={setIsOpen}
                size={28}
                strokeWidth={2.25}
                strokeColor='currentColor'
                className='pointer-events-none'
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Framer Fullscreen Navbars — ≤1020px only */}
      <FullscreenNavOverlay
        isOpen={isOpen}
        links={navLinks}
        activeSection={activeSection}
        dark={fullscreenDark}
        onLinkClick={handleLinkClick}
      />
    </motion.nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
