import { useEffect, useRef, type ReactNode } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Container } from './ui/Container';
import WowSectionEntrance from './motion/WowSectionEntrance';
import MagneticButton from './ui/MagneticButton';
import {
  DURATION,
  fadeLeft,
  fadeUp,
  instantShow,
  scaleFade,
  staggerContainer,
  transition,
  VIEWPORT,
} from '@/lib/motion';

const APOGEE_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4';

const BAR_HEIGHTS = [
  23, 40, 53, 40, 33, 14, 7, 17, 75, 65, 88, 75, 65, 47, 33, 88, 4, 7, 9, 14, 95,
  65, 79, 37, 7, 40, 17, 20, 62, 47, 92, 72,
];

type RevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
};

function Reveal({ children, className = '', variants = fadeUp }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? instantShow : variants}
    >
      {children}
    </motion.div>
  );
}

function AvailabilityCard() {
  const maxHeight = Math.max(...BAR_HEIGHTS);
  const reduced = useReducedMotion();

  return (
    <Reveal variants={scaleFade} className='w-full'>
      <div className='contact-glass w-full rounded-[24px] p-5 pb-5 sm:rounded-[33px] sm:p-8 sm:pb-6'>
        <p className='mb-3 text-[16px] font-[450] leading-[20px] text-white sm:mb-4 sm:text-[20px]'>
          Available for Freelance
        </p>
        <p className='mb-4 text-[14px] font-[450] leading-relaxed text-white/80 sm:mb-6 sm:text-[15.5px]'>
          I&apos;m currently available for freelance work and open to discussing
          new opportunities. Whether you have a project in mind or just want to
          connect, I&apos;d love to hear from you.
        </p>

        <div className='relative mb-3'>
          <div className='flex h-[80px] items-end gap-[1.5px] sm:h-[100px]'>
            {BAR_HEIGHTS.map((h, i) => {
              const isProjected = i >= 28;
              const heightPercent = (h / maxHeight) * 100;
              return (
                <motion.div
                  key={i}
                  className='origin-bottom flex-1 rounded-[0.5px]'
                  style={{
                    height: `${heightPercent}%`,
                    transformOrigin: 'bottom',
                    backgroundColor: isProjected
                      ? 'rgba(255,255,255,0.1)'
                      : 'white',
                  }}
                  initial={
                    reduced
                      ? { scaleY: 1, opacity: 1 }
                      : { scaleY: 0, opacity: 0.4 }
                  }
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{
                    ...transition.element,
                    delay: reduced ? 0 : 0.35 + i * 0.018,
                  }}
                />
              );
            })}
          </div>
          <div className='pointer-events-none absolute inset-0'>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='absolute bottom-0 top-0 w-px bg-white/10'
                style={{ left: `${((i + 1) / 5) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className='flex justify-between'>
          {['Ready', 'Open', 'Remote', 'Dhaka', 'Now'].map((label, i) => (
            <span
              key={label}
              className='text-[9px] font-[450] leading-[10px] text-white/80 sm:text-[10px]'
              style={{ opacity: i >= 3 ? 0.4 : 1 }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const enter = reduced ? instantShow : staggerContainer;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void videoRef.current?.play().catch(() => undefined);
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  const contacts = [
    {
      icon: Mail,
      title: 'Email',
      content: 'mdridoyhasankamrul@gmail.com',
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=mdridoyhasankamrul@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+880 1680 092066',
      href: 'tel:+8801680092066',
    },
    { icon: MapPin, title: 'Location', content: 'Dhaka, Bangladesh' },
  ];

  return (
    <section
      ref={sectionRef}
      id='contact'
      className='contact-section relative min-h-screen w-full overflow-hidden bg-[#080A19] py-14 sm:py-20 lg:py-24'
    >
      <video
        ref={videoRef}
        className='absolute inset-0 h-full w-full object-cover'
        src={APOGEE_VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload='auto'
        aria-hidden
      />

      <Container className='relative z-10'>
        <WowSectionEntrance variant='vortexLock' sectionRef={sectionRef}>
          <div className='flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12'>
            <motion.div
              className='max-w-[593px]'
              variants={enter}
              initial='hidden'
              whileInView='visible'
              viewport={VIEWPORT}
            >
              <Reveal>
                <h2 className='mb-5 text-[36px] font-normal leading-[0.95] text-white sm:mb-8 sm:text-[52px] md:text-[64px] lg:text-[72px]'>
                  Let&apos;s Work Together
                </h2>
              </Reveal>

              <Reveal>
                <p className='mb-7 max-w-[370px] text-[16px] font-[450] leading-[1.3] text-white/80 sm:mb-10 sm:text-[18px] md:text-[20px]'>
                  I&apos;m always open to discussing new projects, creative
                  ideas, or opportunities to be part of your vision. Feel free
                  to reach out.
                </p>
              </Reveal>

              <div className='space-y-5 sm:space-y-6'>
                {contacts.map((item) => (
                  <Reveal key={item.title} variants={fadeLeft}>
                    <div className='flex items-start gap-3 sm:gap-4'>
                      <div className='mt-0.5 flex h-10 w-10 items-center justify-center rounded-[11px] bg-[rgba(10,7,7,0.35)] backdrop-blur-[17px] sm:h-11 sm:w-11'>
                        <item.icon
                          className='h-5 w-5 text-white/90'
                          aria-hidden
                        />
                      </div>
                      <div>
                        <h3 className='mb-1 text-[14px] font-[450] text-white/80 sm:text-[15.5px]'>
                          {item.title}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            {...(item.href.startsWith('http')
                              ? {
                                  target: '_blank' as const,
                                  rel: 'noopener noreferrer',
                                }
                              : {})}
                            className='cursor-target break-all text-[15px] font-[450] text-white transition-opacity hover:opacity-80 sm:text-[16px]'
                            style={{
                              transitionDuration: `${DURATION.interaction * 1000}ms`,
                            }}
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className='text-[15px] font-[450] text-white sm:text-[16px]'>
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal className='mt-8'>
                <div>
                  <h3 className='mb-4 text-[16px] font-[450] text-white sm:mb-5 sm:text-[20px]'>
                    Connect With Me
                  </h3>
                  <div className='flex gap-3 sm:gap-4'>
                    <MagneticButton strength={0.22}>
                      <a
                        href='https://github.com/Md-Ridoy-Hasan-Kamrul'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='cursor-target flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[rgba(10,7,7,0.35)] text-white backdrop-blur-[17px] transition-opacity hover:opacity-80 sm:h-[51px] sm:w-[51px]'
                        aria-label='Visit my GitHub profile'
                        style={{
                          transitionDuration: `${DURATION.interaction * 1000}ms`,
                        }}
                      >
                        <Github className='h-5 w-5' aria-hidden />
                      </a>
                    </MagneticButton>
                    <MagneticButton strength={0.22}>
                      <a
                        href='https://www.linkedin.com/in/md-ridoy-hasan-kamrul'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='cursor-target flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#E9E9E9] text-[#0A0707] transition-opacity hover:opacity-90 sm:h-[51px] sm:w-[51px]'
                        aria-label='Visit my LinkedIn profile'
                        style={{
                          transitionDuration: `${DURATION.interaction * 1000}ms`,
                        }}
                      >
                        <Linkedin className='h-5 w-5' aria-hidden />
                      </a>
                    </MagneticButton>
                  </div>
                </div>
              </Reveal>
            </motion.div>

            <div className='mx-auto w-full max-w-[405px] lg:mx-0'>
              <motion.div
                variants={enter}
                initial='hidden'
                whileInView='visible'
                viewport={VIEWPORT}
              >
                <AvailabilityCard />
              </motion.div>
            </div>
          </div>
        </WowSectionEntrance>
      </Container>
    </section>
  );
}
