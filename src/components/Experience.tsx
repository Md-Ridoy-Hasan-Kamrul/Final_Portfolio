import { useEffect, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from './ui/Container';
import FluidImage from './FluidImage';

const EXPERIENCE_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

const experiences: ExperienceItem[] = [
  {
    title: 'Front-End Developer',
    company: 'Maktech',
    period: 'January 2025 – Present',
    location: 'Dhaka, Bangladesh',
    responsibilities: [
      'Delivered multiple live, bespoke web applications for diverse clients via Fiverr, managing the end-to-end frontend development lifecycle.',
      'Architected scalable user interfaces utilizing React, Next.js, TypeScript, Redux, and Tailwind CSS, ensuring strict adherence to responsive design principles.',
      'Executed seamless API testing and version control using Postman, Git, and GitHub, facilitating efficient collaboration and high-quality code deployments.',
      'Optimized project architectures by identifying and integrating specialized NPM packages to solve complex technical client requirements.',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play video only while Experience is in view
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) {
      video.pause();
      return;
    }

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
      id='experience'
      className='experience-section relative min-h-screen w-full overflow-hidden bg-black py-12 sm:py-16 lg:py-20 transition-colors duration-300'
    >
      {/* Foldcraft-style looping video BG — UI unchanged */}
      <video
        ref={videoRef}
        className='absolute inset-0 h-full w-full object-cover'
        style={{ objectPosition: '70% center' }}
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        aria-hidden
      >
        <source src={EXPERIENCE_VIDEO_SRC} type='video/mp4' />
      </video>

      <Container className='relative z-10'>
        <motion.h2
          className='mb-10 text-3xl font-bold text-white sm:mb-14 sm:text-4xl lg:text-5xl'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Experience
        </motion.h2>

        <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12'>
          {/* Framer FluidImage — hover / drag for fluid effect */}
          <motion.div
            className='order-2 lg:col-span-5 lg:order-1'
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
          >
            <div className='relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900/40 shadow-xl shadow-black/20 ring-1 ring-white/10 sm:aspect-[3/4] lg:aspect-[4/5] lg:max-w-none'>
              <FluidImage
                image='/images/Profile2.png'
                objectFit='cover'
                colors={{ preset: 'ocean' }}
                effect={{
                  showGradient: true,
                  radius: 0.42,
                  strength: 0.85,
                  distortion: 0.38,
                  hueShift: 0.45,
                  colorCycle: 0.04,
                }}
                animation={{
                  speed: 0.4,
                  persistence: 0.97,
                  pointerSmooth: 0.08,
                }}
                advanced={{
                  quality: 'high',
                  fadeIn: true,
                  fadeInDuration: 0.6,
                  maxDpr: 1.5,
                  overflowPadding: 40,
                }}
              />
            </div>
            <p className='mt-3 text-center text-xs text-white/70'>
              Move your cursor over the image
            </p>
          </motion.div>

          <div className='order-1 space-y-8 sm:space-y-12 lg:col-span-7 lg:order-2'>
            {experiences.map((exp, index) => (
              <motion.article
                key={index}
                className='group relative border-l-2 border-white/30 pl-8 pb-8 last:pb-0 sm:pl-12'
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className='absolute left-0 top-0 -translate-x-1/2 rounded-full border-2 border-white/40 bg-black/50 p-2 transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-500/20'
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Briefcase
                    className='h-4 w-4 text-white transition-colors group-hover:text-blue-300'
                    aria-hidden='true'
                  />
                </motion.div>

                <div className='space-y-3 sm:space-y-4'>
                  <div>
                    <motion.h3
                      className='text-xl font-bold text-white sm:text-2xl'
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {exp.title}
                    </motion.h3>
                    <div className='mt-1 flex flex-wrap items-center gap-2'>
                      <p className='text-base font-medium text-blue-300 sm:text-lg'>
                        {exp.company}
                      </p>
                      {exp.period.includes('Present') && (
                        <motion.div
                          className='relative inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-2.5 py-1 shadow-lg'
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.3,
                            duration: 0.5,
                            type: 'spring',
                          }}
                        >
                          <motion.span
                            className='absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent'
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                          <motion.span
                            className='relative h-1.5 w-1.5 rounded-full bg-green-300 shadow-lg'
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [1, 0.7, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                          <span className='relative text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs'>
                            Currently Active
                          </span>
                        </motion.div>
                      )}
                    </div>
                    <div className='mt-2 flex flex-col text-white/70 sm:flex-row sm:gap-4'>
                      <p className='text-xs sm:text-sm'>{exp.period}</p>
                      <p className='hidden text-xs sm:block sm:text-sm'>•</p>
                      <p className='text-xs sm:text-sm'>{exp.location}</p>
                    </div>
                  </div>

                  <ul className='space-y-2'>
                    {exp.responsibilities.map((resp, idx) => (
                      <motion.li
                        key={idx}
                        className='flex text-sm text-white/85 sm:text-base'
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <span className='mr-2 flex-shrink-0 text-blue-300 sm:mr-3'>
                          •
                        </span>
                        <span>{resp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
