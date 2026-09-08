import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  Crown,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useHeavySectionMotion } from '../hooks/useHeavySectionMotion';

const EXPERIENCE_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4';

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
  const [inView, setInView] = useState(false);
  const heavyStyle = useHeavySectionMotion(sectionRef, 'slamLeft');

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (!reduceMotion && video) {
            void video.play().catch(() => undefined);
          }
        } else if (video) {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  const exp = experiences[0];

  return (
    <section
      ref={sectionRef}
      id='experience'
      className={`experience-vanguard relative flex min-h-screen w-full flex-col overflow-hidden bg-black ${
        inView ? 'is-inview' : ''
      }`}
    >
      <video
        ref={videoRef}
        className='absolute inset-0 h-full w-full object-cover'
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        aria-hidden
      >
        <source src={EXPERIENCE_VIDEO_SRC} type='video/mp4' />
      </video>

      {/* Readability wash — keeps type sharp over the film */}
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/40'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35'
        aria-hidden
      />

      <motion.div
        className='relative z-10 flex flex-1 flex-col justify-center px-6 py-24 sm:px-10 lg:px-16 lg:py-28'
        style={heavyStyle}
      >
        <div className='max-w-3xl'>
          <div className='animate-fade-up mb-6 flex items-center gap-2 lg:mb-8'>
            <Crown className='h-4 w-4 text-white/70' aria-hidden />
            <span className='font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm'>
              Career journey
            </span>
          </div>

          <h2 className='animate-fade-up-delay-1 font-podium text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.92] tracking-tight text-white'>
            Experience
          </h2>

          {exp && (
            <>
              <p className='animate-fade-up-delay-2 mt-6 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8'>
                Shipping production interfaces with craft, speed, and obsessive
                attention to detail {' '}
                <span className='font-semibold text-white'>
                  that don&apos;t just ship, they lead.
                </span>
              </p>

              <div className='animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10'>
                <a
                  href='#projects'
                  className='group inline-flex items-center gap-2 bg-black px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs'
                >
                  See our work
                  <ArrowUpRight className='h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                </a>
                <div className='hidden items-center gap-3 sm:flex'>
                  <Award className='h-8 w-8 text-white/50' aria-hidden />
                  <div className='font-inter text-xs uppercase tracking-wider text-white/60'>
                    <div>Currently</div>
                    <div>Active role</div>
                  </div>
                </div>
              </div>

              <div className='animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16'>
                <div>
                  <p className='font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'>
                    {exp.company}
                  </p>
                  <p className='mt-1 font-inter text-[9px] uppercase tracking-widest text-white/50 sm:text-xs'>
                    {exp.title}
                  </p>
                </div>
                <div>
                  <p className='inline-flex items-center gap-2 font-inter text-lg font-bold tracking-tight text-white sm:text-2xl lg:text-3xl'>
                    <Calendar className='h-4 w-4 text-white/50 sm:h-5 sm:w-5' />
                    Present
                  </p>
                  <p className='mt-1 font-inter text-[9px] uppercase tracking-widest text-white/50 sm:text-xs'>
                    {exp.period}
                  </p>
                </div>
                <div>
                  <p className='inline-flex items-center gap-2 font-inter text-lg font-bold tracking-tight text-white sm:text-2xl lg:text-3xl'>
                    <MapPin className='h-4 w-4 text-white/50 sm:h-5 sm:w-5' />
                    Dhaka
                  </p>
                  <p className='mt-1 font-inter text-[9px] uppercase tracking-widest text-white/50 sm:text-xs'>
                    {exp.location}
                  </p>
                </div>
              </div>

              <article className='animate-fade-in-delay mt-8 max-w-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md sm:mt-10 sm:p-7'>
                <div className='mb-4 flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center border border-white/20 bg-white/5 text-white'>
                    <Briefcase className='h-4 w-4' aria-hidden />
                  </span>
                  <div>
                    <p className='font-inter text-xs uppercase tracking-widest text-white/50'>
                      Role focus
                    </p>
                    <h3 className='font-podium text-xl uppercase tracking-wide text-white sm:text-2xl'>
                      {exp.title}
                    </h3>
                  </div>
                </div>
                <ul className='space-y-3'>
                  {exp.responsibilities.map((resp) => (
                    <li
                      key={resp}
                      className='flex gap-3 font-inter text-sm leading-relaxed text-white/80 sm:text-[15px]'
                    >
                      <span
                        className='mt-2 h-1 w-1 flex-shrink-0 bg-white'
                        aria-hidden
                      />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
