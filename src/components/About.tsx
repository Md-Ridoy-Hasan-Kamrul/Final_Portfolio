import { motion } from 'framer-motion';
import ScrambledText from './ScrambledText';
import BadHandwriting from './BadHandwriting';
import { Container } from './ui/Container';
import { useEffect, useRef, useState } from 'react';

const ABOUT_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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

  // Play video only while About is in view
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
      { threshold: 0.12 },
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
      {/* Section-only cinematic video BG — UI unchanged */}
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
        {/* Darker cinematic wash so video reads deep, not washed-out */}
        <div className='absolute inset-0 bg-[#041018]/72' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/55' />
      </div>

      <Container className='relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
          <div className='w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded'></div>
        </motion.div>

        <div className='grid lg:grid-cols-3 gap-10 lg:gap-12 lg:items-start'>
          <motion.div
            className='lg:col-span-2 space-y-6'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {[
              'Frontend Developer specializing in React.js, Next.js, TypeScript, and JavaScript, with a B.Sc. in Computer Science and Engineering from UITS, Dhaka.',
              'Experienced in building responsive, user-friendly, and production-ready web applications with Tailwind CSS, Redux, and RESTful APIs.',
              'Skilled at translating UI designs and client requirements into clean, maintainable interfaces, with a strong focus on performance, accessibility, SEO, and cross-browser compatibility.',
            ].map((text, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ScrambledText
                  className='text-lg text-gray-200 leading-relaxed'
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
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-white mb-2'>Location</h3>
              <p className='text-base text-gray-300'>Dhaka, Bangladesh</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-white mb-2'>Email</h3>
              <a
                href='https://mail.google.com/mail/?view=cm&fs=1&to=mdridoyhasankamrul@gmail.com'
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-target text-base text-blue-400 hover:text-blue-300 transition-colors break-all'
              >
                mdridoyhasankamrul@gmail.com
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-white mb-2'>Phone</h3>
              <a
                href='tel:+8801680092066'
                className='cursor-target text-base text-blue-400 hover:text-blue-300 transition-colors'
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
          className='mt-14 pt-10 border-t border-white/15'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
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
    </section>
  );
}
