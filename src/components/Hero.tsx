import { useRef } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import TrueFocus from './TrueFocus';
import { Container } from './ui/Container';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Heavy exit as you leave Home → About
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const contentScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.78]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75],
    [1, 0.55, 0]
  );
  const contentBlur = useTransform(scrollYProgress, [0, 0.9], [0, 18]);
  const contentFilter = useMotionTemplate`blur(${contentBlur}px)`;
  const contentRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.65]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.55, 0.9], [1, 0.4, 0]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const veilOpacity = useTransform(scrollYProgress, [0.25, 0.85], [0, 0.85]);

  return (
    <section
      ref={sectionRef}
      id='home'
      className='relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pt-24 transition-colors duration-300 sm:pt-28 md:pt-32 lg:pt-8'
    >
      {/* Soft accent orbs over video */}
      <div className='pointer-events-none absolute inset-0 z-[1] overflow-hidden'>
        <motion.div
          className='absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/10'
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-200/15 blur-3xl dark:bg-purple-500/10'
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Dark veil that rises as hero exits into About */}
      <motion.div
        className='pointer-events-none absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-black/40 to-black'
        style={{ opacity: veilOpacity }}
        aria-hidden
      />

      <Container className='relative z-10'>
        <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
          <motion.div
            className='order-2 space-y-6 sm:space-y-8 lg:order-1'
            style={{
              y: contentY,
              scale: contentScale,
              opacity: contentOpacity,
              filter: contentFilter,
              rotate: contentRotate,
              transformOrigin: 'left center',
            }}
          >
            <div className='space-y-3 sm:space-y-4'>
              <motion.h2
                className='text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400 sm:text-base lg:text-lg'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Hello, I&apos;m
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <TrueFocus
                  sentence='Md. Ridoy Hasan Kamrul'
                  manualMode={false}
                  blurAmount={3}
                  borderColor='#3B82F6'
                  glowColor='rgba(59, 130, 246, 0.6)'
                  animationDuration={1.5}
                  pauseBetweenAnimations={0.8}
                />
              </motion.div>
              <motion.p
                className='mt-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-semibold text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 sm:text-2xl lg:text-3xl'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Frontend Developer | React.js | Next.js | TypeScript
              </motion.p>
            </div>

            <motion.p
              className='max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg lg:text-xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Frontend Developer specializing in React.js, Next.js, TypeScript,
              and JavaScript. Building responsive, user-friendly, and
              production-ready web applications with Tailwind CSS, Redux, and
              RESTful APIs.
            </motion.p>

            <motion.div
              className='flex flex-col gap-4 pt-2 sm:flex-row sm:pt-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.a
                href='#projects'
                className='cursor-target group inline-flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-gray-800 hover:to-gray-700 hover:shadow-xl sm:px-8 sm:py-4 sm:text-base'
                aria-label='View my projects'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight
                  className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5'
                  aria-hidden='true'
                />
              </motion.a>
              <motion.a
                href='#contact'
                className='cursor-target inline-flex items-center justify-center border-2 border-gray-900 bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-md transition-all duration-300 hover:bg-gray-900 hover:text-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:px-8 sm:py-4 sm:text-base'
                aria-label='Get in touch'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
            </motion.div>

            <motion.div
              className='flex gap-4 pt-4 sm:gap-6 sm:pt-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
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
                  className='cursor-target text-gray-600 transition-all duration-300 hover:scale-110 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  aria-label={
                    social.label === 'Email'
                      ? 'Compose email in Gmail'
                      : `Visit my ${social.label} profile`
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4 }}
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
              rotate: imageRotate,
            }}
          >
            <motion.div
              className='relative'
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className='relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96'>
                <motion.div
                  className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75 blur-xl'
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div className='absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1'>
                  <div className='h-full w-full overflow-hidden rounded-full bg-white'>
                    <img
                      src='/images/Profile.png'
                      alt='Md. Ridoy Hasan Kamrul - Frontend Developer'
                      className='ml-auto mr-auto h-full w-full object-cover'
                    />
                  </div>
                </div>
                <motion.div
                  className='absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-400/20 blur-2xl'
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl'
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
