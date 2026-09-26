import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useMotionProfile } from '../contexts/MotionContext';
import { Container } from './ui/Container';
import HamburgerMenu from './HamburgerMenu';
import AnimatedSVGUnderline from './AnimatedSVGUnderline';
import FullscreenNavOverlay from './FullscreenNavOverlay';
import NavMorphChrome from './nav/NavMorphChrome';
import NavLiquidIndicator from './nav/NavLiquidIndicator';
import MagneticButton from './ui/MagneticButton';
import { scrollToHash } from '../utils/scrollToHash';
import { SECTION_TRANSITION_EVENT } from '../utils/sectionTransitionEvent';
import { personaFromHash, type NavPersona } from '@/data/navPersonas';
import { useNavDockPose } from '@/hooks/useNavDockPose';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import {
  DURATION,
  EASING,
  STAGGER,
  transition,
} from '@/lib/motion';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

const COMPACT_NAV = 'min-[1021px]:hidden';
const DESKTOP_NAV = 'hidden min-[1021px]:flex';

const Navigation = memo(() => {
  const { theme } = useTheme();
  const { isAdvanced, loopsPaused } = useMotionProfile();
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [morphKey, setMorphKey] = useState(0);
  const [burst, setBurst] = useState(false);

  const persona: NavPersona = personaFromHash(activeSection);
  const { pose, springTransition, isBottom } = useNavDockPose(
    persona,
    isOpen,
    reduced,
  );

  const triggerMorph = useCallback((hash: string) => {
    const next = hash.startsWith('#') ? hash : `#${hash}`;
    setActiveSection(next);
    setBurst(true);
    window.setTimeout(() => setBurst(false), DURATION.hero * 1000 + 40);
  }, []);

  const prevSectionRef = useRef(activeSection);
  useEffect(() => {
    if (prevSectionRef.current === activeSection) return;
    prevSectionRef.current = activeSection;
    setMorphKey((k) => k + 1);
  }, [activeSection]);

  // Lenis-driven section detection (falls back to window scroll)
  useLenisScroll((scrollY) => {
    setIsScrolled(scrollY > 20);

    const sections = navLinks.map((link) => link.href.substring(1));
    let currentSection = '#home';
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= documentHeight - 50) {
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
  });

  useEffect(() => {
    const onTransition = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (!id) return;
      triggerMorph(`#${id}`);
    };
    window.addEventListener(SECTION_TRANSITION_EVENT, onTransition);
    return () =>
      window.removeEventListener(SECTION_TRANSITION_EVENT, onTransition);
  }, [triggerMorph]);

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
    if (!document.getElementById(targetId)) return;

    setIsOpen(false);
    window.setTimeout(() => {
      scrollToHash(href);
      triggerMorph(href);
      window.history.pushState({}, '', href);
    }, 60);
  };

  const fullscreenDark = persona.darkSurface || theme === 'dark';
  const menuPillClass = isOpen
    ? fullscreenDark
      ? 'border-white/35 text-[#E8E2D6] bg-white/5'
      : 'border-black/25 text-[#14110f] bg-black/5'
    : 'border-white/30 text-white bg-white/5 hover:bg-white/10';

  const floating = pose.borderRadius > 0;

  return (
    <>
      {/* Fixed viewport slot — shell moves via transform only */}
      <div
        className='pointer-events-none fixed inset-x-0 top-0 z-50'
        style={{ height: isBottom ? '100dvh' : 'auto' }}
        aria-hidden={false}
      >
        <motion.nav
          role='navigation'
          aria-label='Main navigation'
          data-nav-section={persona.id}
          data-nav-dock={pose.edge}
          className='pointer-events-auto relative mx-auto overflow-hidden'
          style={{
            width:
              pose.insetPct > 0
                ? `calc(100% - ${pose.insetPct * 2}%)`
                : '100%',
            transformOrigin:
              pose.x < 0
                ? 'left top'
                : pose.x > 0
                  ? 'right top'
                  : pose.edge === 'bottom'
                    ? 'center bottom'
                    : 'center top',
          }}
          initial={{ opacity: 0, y: -32 }}
          animate={{
            opacity: 1,
            x: pose.x,
            y: pose.y,
            scale: pose.scale,
            borderRadius: pose.borderRadius,
          }}
          transition={reduced ? transition.structural : springTransition}
          onAnimationStart={() => {
            const el = document.querySelector(
              'nav[aria-label="Main navigation"]',
            ) as HTMLElement | null;
            if (el) el.style.willChange = 'transform';
          }}
          onAnimationComplete={() => {
            const el = document.querySelector(
              'nav[aria-label="Main navigation"]',
            ) as HTMLElement | null;
            if (el) el.style.willChange = 'auto';
          }}
        >
          <NavMorphChrome
            persona={persona}
            morphKey={morphKey}
            isScrolled={isScrolled}
            isOpen={isOpen}
            floating={floating}
          />

          <AnimatePresence>
            {burst && !reduced && !loopsPaused && (
              <motion.div
                key={`burst-${morphKey}`}
                className='pointer-events-none absolute inset-0 z-[1]'
                style={{
                  background: `radial-gradient(ellipse at 50% ${
                    isBottom ? '100%' : '0%'
                  }, ${persona.accentSoft}, transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.micro}
                aria-hidden
              />
            )}
          </AnimatePresence>

          <Container className='relative z-[70]'>
            <div className='flex h-20 items-center justify-between sm:h-24 md:h-28 lg:h-28'>
              <div className='flex items-center gap-4 lg:gap-6'>
                <MagneticButton strength={0.18}>
                  <motion.a
                    href='#home'
                    onClick={(e) => handleLinkClick(e, '#home')}
                    className='cursor-target relative group block'
                    aria-label='Go to home section'
                    whileHover={reduced ? undefined : { scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={transition.micro}
                  >
                    <img
                      src='/logo-dark.png'
                      alt='KH Kamrul - Frontend Engineer'
                      className='relative z-10 h-20 w-auto object-contain sm:h-20 md:h-24 lg:h-36'
                    />
                    {!reduced && isAdvanced && !loopsPaused && (
                      <motion.span
                        className='pointer-events-none absolute inset-0 -z-10 rounded-full opacity-40 blur-2xl'
                        style={{ background: persona.accentSoft }}
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.25, 0.45, 0.25],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: EASING.easeInOutCubic,
                        }}
                        aria-hidden
                      />
                    )}
                  </motion.a>
                </MagneticButton>
              </div>

              <div
                key={`links-${persona.id}-${morphKey}`}
                className={`${DESKTOP_NAV} items-center gap-0.5 lg:gap-1`}
              >
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={
                        reduced ? { opacity: 0 } : { opacity: 0, y: -10 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        ...transition.structural,
                        delay: reduced
                          ? 0
                          : STAGGER.delay + index * STAGGER.children,
                      }}
                    >
                      <MagneticButton strength={0.2}>
                        <motion.a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className='cursor-target relative block px-2.5 py-1.5 lg:px-3'
                          whileTap={{ scale: 0.97 }}
                          aria-current={isActive ? 'page' : undefined}
                          animate={
                            burst && !reduced && isActive
                              ? { scale: [1, 1.08, 1] }
                              : { scale: 1 }
                          }
                          transition={transition.structural}
                        >
                          <AnimatedSVGUnderline
                            text={link.label}
                            forceShow={isActive}
                            textColor={
                              isActive ? persona.accent : persona.inkMuted
                            }
                            underlineColor={persona.accent}
                            strokeWidth={2.5}
                            gap={1}
                          />
                          {isActive && (
                            <NavLiquidIndicator
                              persona={persona}
                              morphKey={morphKey}
                              burst={burst && !reduced}
                            />
                          )}
                        </motion.a>
                      </MagneticButton>
                    </motion.div>
                  );
                })}

                <motion.div
                  className='ml-4 hidden items-center gap-1 border-l pl-4 lg:flex xl:ml-6 xl:pl-6'
                  style={{ borderColor: persona.border }}
                  initial={reduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...transition.structural,
                    delay: reduced ? 0 : STAGGER.delay + navLinks.length * STAGGER.children,
                  }}
                >
                  <ThemeToggle />
                  <motion.a
                    href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='cursor-target rounded-full p-2'
                    style={{ color: persona.inkMuted }}
                    aria-label='GitHub Profile'
                    whileHover={
                      reduced
                        ? undefined
                        : { scale: 1.08, color: persona.accent }
                    }
                    whileTap={{ scale: 0.92 }}
                    transition={transition.micro}
                  >
                    <Github className='h-5 w-5' />
                  </motion.a>
                  <motion.a
                    href='https://www.linkedin.com/in/md-ridoy-hasan-kamrul'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='cursor-target rounded-full p-2'
                    style={{ color: persona.inkMuted }}
                    aria-label='LinkedIn Profile'
                    whileHover={
                      reduced
                        ? undefined
                        : { scale: 1.08, color: persona.accent }
                    }
                    whileTap={{ scale: 0.92 }}
                    transition={transition.micro}
                  >
                    <Linkedin className='h-5 w-5' />
                  </motion.a>
                </motion.div>
              </div>

              <div className={COMPACT_NAV}>
                <motion.div
                  role='button'
                  tabIndex={0}
                  onClick={() => setIsOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsOpen((v) => !v);
                    }
                  }}
                  className={`cursor-target inline-flex items-center gap-2 rounded-full border px-3 py-1.5 min-[375px]:gap-2.5 min-[375px]:px-4 min-[375px]:py-2 ${menuPillClass}`}
                  style={{
                    borderColor: isOpen ? undefined : persona.border,
                    color: isOpen ? undefined : persona.ink,
                  }}
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isOpen}
                  whileTap={{ scale: 0.96 }}
                  animate={
                    burst && !reduced ? { scale: [1, 1.04, 1] } : { scale: 1 }
                  }
                  transition={transition.structural}
                >
                  <span className='font-inter text-[11px] font-semibold uppercase tracking-[0.18em] min-[375px]:text-xs'>
                    {isOpen ? 'Close' : 'Menu'}
                  </span>
                  <span
                    className='hidden font-mono text-[9px] tracking-[0.2em] min-[425px]:inline'
                    style={{ color: persona.accent }}
                  >
                    {persona.code}
                  </span>
                  <HamburgerMenu
                    isOpen={isOpen}
                    onToggle={setIsOpen}
                    size={28}
                    strokeWidth={2.25}
                    strokeColor='currentColor'
                    className='pointer-events-none'
                  />
                </motion.div>
              </div>
            </div>
          </Container>
        </motion.nav>
      </div>

      <FullscreenNavOverlay
        isOpen={isOpen}
        links={navLinks}
        activeSection={activeSection}
        dark={fullscreenDark}
        persona={persona}
        morphKey={morphKey}
        onClose={() => setIsOpen(false)}
        onLinkClick={handleLinkClick}
      />
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
