import { useRef } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import TrueFocus from './TrueFocus';
import TactileButton from './ui/TactileButton';
import MagneticButton from './ui/MagneticButton';
import { Container } from './ui/Container';
import { scrollToHash } from '../utils/scrollToHash';
import { useMotionProfile } from '@/contexts/MotionContext';
import {
  DURATION,
  EASING,
  STAGGER,
  transition,
  staggerContainer,
  fadeUpHero,
  imageReveal,
  fadeOnly,
} from '@/lib/motion';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { isAdvanced, isLight, isOff, loopsPaused } = useMotionProfile();
  const allowLoops = isAdvanced && !reduced && !isOff && !loopsPaused;
  const allowParallax = !reduced && !isOff && !isLight;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax exit — transform + opacity only (no filter/blur jank)
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, allowParallax ? -80 : 0],
  );
  const contentScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, allowParallax ? 0.94 : 1],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.9],
    allowParallax ? [1, 0.7, 0] : [1, 1, 1],
  );

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, allowParallax ? 60 : 0],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, allowParallax ? 0.88 : 1],
  );
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.95],
    allowParallax ? [1, 0.55, 0] : [1, 1, 1],
  );

  const enter = reduced || isOff ? fadeOnly : staggerContainer;
  const item = reduced || isOff ? fadeOnly : fadeUpHero;
  const media = reduced || isOff ? fadeOnly : imageReveal;

  return (
    <section
      ref={sectionRef}
      id='home'
      className='relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pt-24 transition-colors duration-300 sm:pt-28 md:pt-32 lg:pt-8'
    >
      {allowLoops && (
        <div className='pointer-events-none absolute inset-0 z-[1] overflow-hidden'>
          <motion.div
            className='absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/15'
            animate={{ scale: [1, 1.15, 1], x: [0, 36, 0], y: [0, 20, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: EASING.easeInOutCubic,
            }}
          />
          <motion.div
            className='absolute bottom-20 right-10 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10'
            animate={{ scale: [1, 1.2, 1], x: [0, -36, 0], y: [0, -20, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: EASING.easeInOutCubic,
            }}
          />
        </div>
      )}

      <Container className='relative z-10'>
        <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
          <motion.div
            className='order-2 space-y-6 sm:space-y-8 lg:order-1'
            style={{
              y: contentY,
              scale: contentScale,
              opacity: contentOpacity,
              transformOrigin: 'left center',
            }}
            variants={enter}
            initial='hidden'
            animate='visible'
          >
            <div className='space-y-3 sm:space-y-4'>
              <motion.h2
                className='text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400 sm:text-base lg:text-lg'
                variants={item}
              >
                Hello, I&apos;m
              </motion.h2>
              <motion.div variants={item}>
                <TrueFocus
                  sentence='Md. Ridoy Hasan Kamrul'
                  manualMode={false}
                  blurAmount={reduced ? 0 : 3}
                  borderColor='#22D3EE'
                  glowColor='rgba(34, 211, 238, 0.55)'
                  animationDuration={DURATION.hero + 0.5}
                  pauseBetweenAnimations={0.8}
                />
              </motion.div>
              <motion.p
                className='hero-liquid-text mt-4 text-xl font-semibold sm:text-2xl lg:text-3xl'
                variants={item}
              >
                Frontend Developer | React.js | Next.js | TypeScript
              </motion.p>
            </div>

            <motion.p
              className='max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg lg:text-xl'
              variants={item}
            >
              Frontend Developer specializing in React.js, Next.js, TypeScript,
              and JavaScript. Building responsive, user-friendly, and
              production-ready web applications with Tailwind CSS, Redux, and
              RESTful APIs.
            </motion.p>

            <motion.div
              className='flex flex-col gap-4 pt-2 sm:flex-row sm:pt-4'
              variants={item}
            >
              <MagneticButton>
                <TactileButton
                  width={250}
                  height={64}
                  onClick={() => {
                    scrollToHash('#projects');
                    window.history.pushState({}, '', '#projects');
                  }}
                  ariaLabel='View my projects'
                  className='cursor-target'
                >
                  View My Work
                  <ArrowRight
                    className='ml-2 h-4 w-4 sm:h-5 sm:w-5'
                    aria-hidden='true'
                  />
                </TactileButton>
              </MagneticButton>
              <MagneticButton>
                <TactileButton
                  width={250}
                  height={64}
                  onClick={() => {
                    scrollToHash('#contact');
                    window.history.pushState({}, '', '#contact');
                  }}
                  ariaLabel='Get in touch'
                  className='cursor-target'
                >
                  Get In Touch
                </TactileButton>
              </MagneticButton>
            </motion.div>

            <motion.div
              className='flex gap-4 pt-4 sm:gap-6 sm:pt-8'
              variants={item}
            >
              {[
                {
                  href: 'https://github.com/Md-Ridoy-Hasan-Kamrul',
                  icon: Github,
                  label: 'GitHub',
                },
                {
                  href: 'https://www.linkedin.com/in/md-ridoy-hasan-kamrul',
                  icon: Linkedin,
                  label: 'LinkedIn',
                },
                {
                  href: 'https://mail.google.com/mail/?view=cm&fs=1&to=mdridoyhasankamrul@gmail.com',
                  icon: Mail,
                  label: 'Email',
                },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  aria-label={
                    social.label === 'Email'
                      ? 'Compose email in Gmail'
                      : `Visit my ${social.label} profile`
                  }
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...transition.element,
                    delay: STAGGER.delay + index * STAGGER.children,
                  }}
                  whileHover={reduced ? undefined : { y: -4, scale: 1.08 }}
                >
                  <social.icon
                    className='h-5 w-5 sm:h-6 sm:w-6'
                    aria-hidden='true'
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className='order-1 flex justify-center lg:order-2 lg:justify-end'
            style={{
              y: imageY,
              scale: imageScale,
              opacity: imageOpacity,
            }}
            variants={media}
            initial='hidden'
            animate='visible'
          >
            <motion.div
              className='relative'
              animate={allowLoops ? { y: [0, -14, 0] } : undefined}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: EASING.easeInOutCubic,
              }}
            >
              <div className='relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96'>
                <motion.div
                  className='absolute inset-0 rounded-full opacity-70 blur-xl'
                  style={{
                    background:
                      'conic-gradient(from 0deg, #00E6FF, #053B73, #67E8F9, #02182D, #00E6FF)',
                  }}
                  animate={allowLoops ? { rotate: 360 } : undefined}
                  transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: EASING.easeInOutCubic,
                  }}
                />
                <div
                  className='absolute inset-2 rounded-full p-[3px] sm:p-1'
                  style={{
                    background:
                      'linear-gradient(145deg, #67E8F9 0%, #00E6FF 28%, #0891B2 55%, #053B73 78%, #02182D 100%)',
                    boxShadow:
                      '0 0 28px rgba(0, 230, 255, 0.35), inset 0 0 0 1px rgba(224, 250, 255, 0.2)',
                  }}
                >
                  <div className='h-full w-full overflow-hidden rounded-full bg-[#050b11] ring-1 ring-cyan-400/20'>
                    <img
                      src='/images/Profile.png'
                      alt='Md. Ridoy Hasan Kamrul - Frontend Developer'
                      className='ml-auto mr-auto h-full w-full object-cover'
                      style={{ viewTransitionName: 'hero-portrait' }}
                    />
                  </div>
                </div>
                {allowLoops && (
                  <>
                    <motion.div
                      className='absolute -right-4 -top-4 h-20 w-20 rounded-full bg-cyan-400/25 blur-2xl'
                      animate={{
                        scale: [1, 1.35, 1],
                        opacity: [0.3, 0.55, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: EASING.easeInOutCubic,
                      }}
                    />
                    <motion.div
                      className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-sky-500/20 blur-2xl'
                      animate={{
                        scale: [1, 1.35, 1],
                        opacity: [0.3, 0.55, 0.3],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: EASING.easeInOutCubic,
                        delay: 1,
                      }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
