import { useState, useEffect, memo } from 'react';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

const Navigation = memo(() => {
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
        const navHeight = window.innerWidth >= 1024 ? 80 : 64;

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-blue-500/5'
          : 'bg-white/80 backdrop-blur-md'
      }`}
      role='navigation'
      aria-label='Main navigation'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
    >
      {/* Gradient border bottom */}
      <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 lg:h-20'>
          {/* Logo with 3D effect */}
          <motion.a
            href='#home'
            onClick={(e) => handleLinkClick(e, '#home')}
            className='cursor-target text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-500 relative group'
            aria-label='Go to home section'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className='relative z-10'>RH Kamrul</span>
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

          {/* Desktop Navigation with 3D effects */}
          <div className='hidden md:flex items-center space-x-1 lg:space-x-2'>
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`cursor-target relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Hover effect background - shows when NOT active */}
                  {!isActive && (
                    <motion.div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0' />
                  )}

                  {/* Active state background with gradient */}
                  {isActive && (
                    <motion.div
                      className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-lg shadow-lg shadow-blue-500/30 z-0'
                      layoutId='activeNavBg'
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                      style={{
                        backgroundSize: '200% 100%',
                      }}
                    />
                  )}

                  {/* Link text */}
                  <span className='relative z-10'>{link.label}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    />
                  )}
                </motion.a>
              );
            })}

            {/* Social icons in desktop nav */}
            <div className='hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-gray-200'>
              <motion.a
                href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-target p-2 text-gray-700 hover:text-white hover:bg-gray-900 rounded-full transition-all duration-300 group relative'
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
                className='cursor-target p-2 text-gray-700 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-300 group relative'
                aria-label='LinkedIn Profile'
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className='h-5 w-5' />
                <div className='absolute inset-0 bg-blue-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              </motion.a>
            </div>
          </div>

          {/* Mobile menu button with 3D effect */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-300 relative group shadow-md hover:shadow-xl'
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            whileHover={{ scale: 1.05, rotate: isOpen ? 180 : 0 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode='wait'>
              {isOpen ? (
                <motion.div
                  key='close'
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className='h-6 w-6' aria-hidden='true' />
                </motion.div>
              ) : (
                <motion.div
                  key='menu'
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className='h-6 w-6' aria-hidden='true' />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Animated background pulse */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10' />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl shadow-blue-500/10'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='px-4 py-6 space-y-2'>
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
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
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
                    {/* Hover gradient line */}
                    {!isActive && (
                      <div className='absolute left-0 top-1/2 w-1 h-0 group-hover:h-1/2 transform -translate-y-1/2 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r transition-all duration-300' />
                    )}
                  </motion.a>
                );
              })}

              {/* Social links in mobile menu */}
              <motion.div
                className='flex justify-center gap-4 pt-6 mt-6 border-t border-gray-200'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
              >
                <motion.a
                  href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target p-3 text-white bg-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
