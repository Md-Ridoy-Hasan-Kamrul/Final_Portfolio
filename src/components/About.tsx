import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import ScrambledText from './ScrambledText';
import BadHandwriting from './BadHandwriting';
import { Container } from './ui/Container';
import WowSectionEntrance from './motion/WowSectionEntrance';
import { useEffect, useRef, useState } from 'react';

const ABOUT_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 56, scale: 0.94, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 18,
      mass: 0.9,
    },
  },
};

const education = [
  {
    title: 'B.Sc in Computer Science & Engineering',
    school: 'University of Information Technology and Sciences (UITS)',
    year: '2022',
  },
  {
    title: 'H.S.C',
    school: 'Shaheed Ramiz Uddin Cantonment College (SRCC)',
    year: '2016',
  },
  {
    title: 'S.S.C',
    school: 'Govt. Kalachandpur High School and College',
    year: '2014',
  },
];

export default function About() {
  const [fontSize, setFontSize] = useState(56);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 20%'],
  });

  const washOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.9, 0.35, 0]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 320) setFontSize(36);
      else if (w <= 375) setFontSize(42);
      else if (w <= 640) setFontSize(48);
      else if (w <= 1024) setFontSize(56);
      else setFontSize(64);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id='about'
      className='relative overflow-hidden bg-transparent py-16 sm:py-20 lg:py-24'
    >
      <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
        <video
          ref={videoRef}
          className='absolute inset-0 h-full w-full object-cover'
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
        >
          <source src={ABOUT_VIDEO_SRC} type='video/mp4' />
        </video>
        <div className='absolute inset-0 bg-[#041018]/72' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/55' />
      </div>

      <motion.div
        className='pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black via-black/60 to-transparent'
        style={{ opacity: washOpacity }}
        aria-hidden
      />

      <WowSectionEntrance
        variant='riftSplit'
        sectionRef={sectionRef}
        className='relative z-10'
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 16,
              mass: 1,
            }}
            className='mb-16'
          >
            <BadHandwriting
              text='About Me'
              fontSize={fontSize}
              color='#F3F4F6'
              letterSpacing={1}
              lineHeight={1.15}
              seed={42}
              alignment='left'
              className='mb-3'
            />
            <motion.div
              className='h-1 w-20 origin-left rounded bg-gradient-to-r from-crimson to-gold'
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
            />
          </motion.div>

          <div className='grid gap-10 lg:grid-cols-3 lg:items-start lg:gap-12'>
            <motion.div
              className='space-y-6 lg:col-span-2'
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.25 }}
            >
              {[
                'Frontend Developer specializing in React.js, Next.js, TypeScript, and JavaScript, with a B.Sc. in Computer Science and Engineering from UITS, Dhaka.',
                'Experienced in building responsive, user-friendly, and production-ready web applications with Tailwind CSS, Redux, and RESTful APIs.',
                'Skilled at translating UI designs and client requirements into clean, maintainable interfaces, with a strong focus on performance, accessibility, SEO, and cross-browser compatibility.',
              ].map((text, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ScrambledText
                    className='text-lg leading-relaxed text-gray-200'
                    radius={120}
                    duration={800}
                    scrambleChars='.:!@#$%&*'
                  >
                    {text}
                  </ScrambledText>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className='space-y-6'
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={itemVariants}>
                <h3 className='mb-2 text-lg font-bold text-white'>Location</h3>
                <p className='text-base text-gray-300'>Dhaka, Bangladesh</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className='mb-2 text-lg font-bold text-white'>Email</h3>
                <a
                  href='https://mail.google.com/mail/?view=cm&fs=1&to=mdridoyhasankamrul@gmail.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-target break-all text-base text-blue-400 transition-colors hover:text-blue-300'
                >
                  mdridoyhasankamrul@gmail.com
                </a>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className='mb-2 text-lg font-bold text-white'>Phone</h3>
                <a
                  href='tel:+8801680092066'
                  className='cursor-target text-base text-blue-400 transition-colors hover:text-blue-300'
                >
                  +880 1680 092066
                </a>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className='mb-3 text-lg font-bold text-white'>
                  Certification
                </h3>
                <motion.div
                  className='glass-field rounded-2xl px-5 py-4'
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <p className='glass-field-title text-base'>MERN Stack</p>
                  <p className='glass-field-meta mt-1 text-sm'>Ostad · 2024</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className='mt-14 border-t border-white/15 pt-10'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h3
              variants={itemVariants}
              className='mb-6 text-lg font-bold text-white sm:text-xl'
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Education
            </motion.h3>
            <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {education.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className='glass-field h-full rounded-2xl px-5 py-5'
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.02,
                  }}
                >
                  <div className='mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
                    <p className='glass-field-title text-base'>{item.title}</p>
                    <p className='glass-field-year text-sm'>{item.year}</p>
                  </div>
                  <p className='glass-field-meta text-sm leading-relaxed'>
                    {item.school}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </WowSectionEntrance>
    </section>
  );
}
