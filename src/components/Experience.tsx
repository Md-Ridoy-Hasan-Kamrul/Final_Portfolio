import { useEffect, useRef } from 'react';
import { Briefcase, Calendar, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from './ui/Container';
import FluidImage from './FluidImage.tsx';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className={`experience-section relative min-h-screen w-full overflow-hidden py-14 sm:py-20 lg:py-24 transition-colors duration-500 ${
        isDark ? 'bg-[#02060c]' : 'bg-[#0c1824]'
      }`}
    >
      <video
        ref={videoRef}
        className='absolute inset-0 h-full w-full scale-105 object-cover transition-[filter,transform] duration-700'
        style={{
          objectPosition: '70% center',
          filter: isDark
            ? 'brightness(0.45) saturate(1.15) contrast(1.1)'
            : 'brightness(0.78) saturate(1.2) contrast(1.05)',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        aria-hidden
      >
        <source src={EXPERIENCE_VIDEO_SRC} type='video/mp4' />
      </video>

      {/* Cinematic color washes */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          background: isDark
            ? `
              radial-gradient(ellipse 90% 70% at 15% 10%, rgba(56, 189, 248, 0.22) 0%, transparent 50%),
              radial-gradient(ellipse 70% 55% at 90% 80%, rgba(168, 85, 247, 0.18) 0%, transparent 55%),
              linear-gradient(180deg, rgba(2,6,12,0.55) 0%, rgba(2,10,20,0.35) 40%, rgba(2,6,12,0.8) 100%)
            `
            : `
              radial-gradient(ellipse 90% 70% at 10% 0%, rgba(251, 146, 60, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 80% 60% at 95% 90%, rgba(59, 130, 246, 0.28) 0%, transparent 55%),
              linear-gradient(180deg, rgba(12,24,36,0.35) 0%, rgba(12,24,36,0.2) 45%, rgba(12,24,36,0.55) 100%)
            `,
        }}
        aria-hidden
      />

      {/* Soft floating orbs */}
      <motion.div
        className={`pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full blur-3xl ${
          isDark ? 'bg-cyan-400/20' : 'bg-orange-400/30'
        }`}
        animate={{ y: [0, 24, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className={`pointer-events-none absolute -right-16 bottom-32 h-72 w-72 rounded-full blur-3xl ${
          isDark ? 'bg-violet-500/20' : 'bg-sky-400/25'
        }`}
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      <Container className='relative z-10'>
        <motion.div
          className='mb-10 sm:mb-14'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${
              isDark
                ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-100'
                : 'border-orange-200/40 bg-orange-400/15 text-orange-50'
            }`}
          >
            <Sparkles className='h-3.5 w-3.5' />
            Career journey
          </div>
          <h2
            className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl ${
              isDark ? 'text-white' : 'text-white'
            }`}
            style={{
              textShadow: isDark
                ? '0 0 40px rgba(34,211,238,0.35)'
                : '0 0 40px rgba(251,146,60,0.4)',
            }}
          >
            Experience
          </h2>
          <div
            className={`mt-4 h-1.5 w-24 rounded-full ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500'
                : 'bg-gradient-to-r from-orange-400 via-rose-400 to-sky-400'
            }`}
          />
          <p
            className={`mt-4 max-w-xl text-sm sm:text-base ${
              isDark ? 'text-sky-100/75' : 'text-white/80'
            }`}
          >
            Shipping production interfaces with craft, speed, and obsessive
            attention to detail.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14'>
          <motion.div
            className='order-2 lg:col-span-5 lg:order-1'
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 90 }}
          >
            <div className='relative mx-auto max-w-md lg:max-w-none'>
              <div
                className={`absolute -inset-3 rounded-[1.75rem] opacity-70 blur-xl ${
                  isDark
                    ? 'bg-gradient-to-br from-cyan-400/40 via-blue-500/20 to-violet-500/40'
                    : 'bg-gradient-to-br from-orange-400/50 via-rose-400/30 to-sky-400/45'
                }`}
                aria-hidden
              />
              <motion.div
                className={`relative overflow-hidden rounded-[1.5rem] ring-1 ${
                  isDark
                    ? 'ring-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.55)]'
                    : 'ring-white/30 shadow-[0_25px_80px_rgba(0,0,0,0.35)]'
                }`}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className='aspect-[4/5] w-full sm:aspect-[3/4] lg:aspect-[4/5]'>
                  <FluidImage
                    image='/images/Profile2.png'
                    objectFit='cover'
                    colors={{ preset: isDark ? 'neon' : 'sunset' }}
                    effect={{
                      showGradient: true,
                      radius: 0.45,
                      strength: 0.95,
                      distortion: 0.42,
                      hueShift: isDark ? 0.55 : 0.35,
                      colorCycle: 0.06,
                    }}
                    animation={{
                      speed: 0.45,
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
              </motion.div>
              <p
                className={`mt-4 text-center text-xs font-medium tracking-wide ${
                  isDark ? 'text-cyan-100/70' : 'text-white/75'
                }`}
              >
                Hover the portrait fluid motion reacts to you
              </p>
            </div>
          </motion.div>

          <div className='order-1 space-y-6 lg:col-span-7 lg:order-2'>
            {experiences.map((exp, index) => (
              <motion.article
                key={index}
                className={`group relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                  isDark
                    ? 'border-cyan-300/25 bg-black/50 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl'
                    : 'border-white/35 bg-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl'
                }`}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
              >
                {/* Card sheen */}
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                    isDark
                      ? 'bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-500/10'
                      : 'bg-gradient-to-br from-orange-300/15 via-transparent to-sky-400/15'
                  }`}
                  aria-hidden
                />
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 ${
                    isDark
                      ? 'bg-gradient-to-b from-cyan-300 via-blue-500 to-violet-500'
                      : 'bg-gradient-to-b from-orange-300 via-rose-400 to-sky-400'
                  }`}
                  aria-hidden
                />

                <div className='relative space-y-5'>
                  <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                      <div className='mb-3 flex items-center gap-3'>
                        <span
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                            isDark
                              ? 'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/30'
                              : 'bg-white/20 text-white ring-1 ring-white/40'
                          }`}
                        >
                          <Briefcase className='h-5 w-5' aria-hidden />
                        </span>
                        <p
                          className={`text-lg font-bold sm:text-xl ${
                            isDark ? 'text-cyan-200' : 'text-orange-100'
                          }`}
                        >
                          {exp.company}
                        </p>
                      </div>
                      <h3 className='text-2xl font-black tracking-tight text-white sm:text-3xl'>
                        {exp.title}
                      </h3>
                    </div>
                    {exp.period.includes('Present') && (
                      <motion.div
                        className={`relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1.5 shadow-lg ${
                          isDark
                            ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500'
                            : 'bg-gradient-to-r from-orange-500 via-rose-500 to-sky-500'
                        }`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                      >
                        <motion.span
                          className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent'
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        <motion.span
                          className='relative h-2 w-2 rounded-full bg-white shadow'
                          animate={{ scale: [1, 1.35, 1] }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                          }}
                        />
                        <span className='relative text-[10px] font-bold uppercase tracking-wider text-white sm:text-xs'>
                          Currently Active
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-3'>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
                        isDark
                          ? 'bg-white/10 text-sky-100'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      <Calendar className='h-3.5 w-3.5' />
                      {exp.period}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
                        isDark
                          ? 'bg-white/10 text-sky-100'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      <MapPin className='h-3.5 w-3.5' />
                      {exp.location}
                    </span>
                  </div>

                  <ul className='space-y-3'>
                    {exp.responsibilities.map((resp, idx) => (
                      <motion.li
                        key={idx}
                        className={`flex gap-3 text-sm leading-relaxed sm:text-[15px] ${
                          isDark ? 'text-sky-50/90' : 'text-white/90'
                        }`}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + idx * 0.06 }}
                      >
                        <span
                          className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                            isDark
                              ? 'bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                              : 'bg-orange-300 shadow-[0_0_10px_rgba(251,146,60,0.9)]'
                          }`}
                          aria-hidden
                        />
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
