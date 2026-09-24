import { useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  Crown,
  MapPin,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import WowSectionEntrance from './motion/WowSectionEntrance';
import TactileButton from './ui/TactileButton';
import MagneticButton from './ui/MagneticButton';
import { scrollToHash } from '../utils/scrollToHash';
import {
  fadeUp,
  instantShow,
  staggerContainer,
  VIEWPORT,
} from '@/lib/motion';

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
  const reduced = useReducedMotion();
  const enter = reduced ? instantShow : staggerContainer;
  const item = reduced ? instantShow : fadeUp;

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!reduceMotion && video) {
            void video.play().catch(() => undefined);
          }
        } else if (video) {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  const exp = experiences[0];

  return (
    <section
      ref={sectionRef}
      id='experience'
      className='experience-vanguard relative flex min-h-screen w-full flex-col overflow-hidden bg-black'
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

      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/40'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35'
        aria-hidden
      />

      <WowSectionEntrance
        variant='bladeSlash'
        sectionRef={sectionRef}
        className='relative z-10 flex flex-1 flex-col justify-center'
      >
        <div className='flex flex-1 flex-col justify-center px-6 py-24 sm:px-10 lg:px-16 lg:py-28'>
          <motion.div
            className='max-w-3xl'
            variants={enter}
            initial='hidden'
            whileInView='visible'
            viewport={VIEWPORT}
          >
            <motion.div
              className='mb-6 flex items-center gap-2 lg:mb-8'
              variants={item}
            >
              <Crown className='h-4 w-4 text-white/70' aria-hidden />
              <span className='font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm'>
                Career journey
              </span>
            </motion.div>

            <motion.h2
              className='font-podium text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.92] tracking-tight text-white'
              variants={item}
            >
              Experience
            </motion.h2>

            {exp && (
              <>
                <motion.p
                  className='mt-6 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8'
                  variants={item}
                >
                  Shipping production interfaces with craft, speed, and
                  obsessive attention to detail{' '}
                  <span className='font-semibold text-white'>
                    that don&apos;t just ship, they lead.
                  </span>
                </motion.p>

                <motion.div
                  className='mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10'
                  variants={item}
                >
                  <MagneticButton>
                    <TactileButton
                      tone='ember'
                      width={220}
                      height={56}
                      onClick={() => {
                        scrollToHash('#projects');
                        window.history.pushState({}, '', '#projects');
                      }}
                      ariaLabel='See our work'
                    >
                      SEE OUR WORK
                      <ArrowUpRight className='ml-2 h-4 w-4' />
                    </TactileButton>
                  </MagneticButton>
                  <div className='hidden items-center gap-3 sm:flex'>
                    <Award className='h-8 w-8 text-white/50' aria-hidden />
                    <div className='font-inter text-xs uppercase tracking-wider text-white/60'>
                      <div>Currently</div>
                      <div>Active role</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className='mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16'
                  variants={item}
                >
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
                </motion.div>

                <motion.article
                  className='mt-8 max-w-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md sm:mt-10 sm:p-7'
                  variants={item}
                >
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
                </motion.article>
              </>
            )}
          </motion.div>
        </div>
      </WowSectionEntrance>
    </section>
  );
}
