import { useEffect, useState, startTransition, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cover } from './ui/cover';
import { Container } from './ui/Container';
import DepthBlurCarousel from './DepthBlurCarousel';

const PROJECTS_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260901_122529_931c22c8-8d2d-47c0-ad51-b97f56a91e42.mp4';
const PROJECTS_VIDEO_POSTER =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4f690bd1-881a-4192-82f2-d714d34c8fb9.png';

interface Project {
  title: string;
  description: string;
  highlights: string[];
  liveUrl: string;
  category: string;
  image: string;
  fallback: string;
}

const projects: Project[] = [
  {
    title: 'CoorDeck Technologies',
    description: 'Connected Teams Coordinated Projects',
    highlights: [
      'An all-in-one B2B construction project management software to manage sites, coordinate teams, and track tasks.',
      'Tech: Next.js, Tailwind, Swiper',
    ],
    liveUrl: 'https://alex-coordinate.vercel.app',
    category: 'Next.js',
    image: '/images/projects/coordeck.jpg',
    fallback: 'linear-gradient(135deg, #0f766e, #38bdf8)',
  },
  {
    title: 'Dr. T UX Coaching',
    description: 'Every Stage of Your UX Career',
    highlights: [
      'Expert 1:1 UX coaching to help you build a standout portfolio, master interviews, and launch your design career.',
      'Tech: Next.js, Tailwind, Lenis, and Framer Motion',
    ],
    liveUrl: 'https://troyabel-gules.vercel.app',
    category: 'Next.js',
    image: '/images/projects/dr-t-ux.png',
    fallback: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  },
  {
    title: 'layls',
    description: 'Online Dress Marketplace',
    highlights: [
      "A Jordanian online marketplace for buying, selling, and renting new and used women's dresses.",
      'Tech: Next.js, Tailwind, and Framer Motion',
    ],
    liveUrl: 'https://www.layls.com',
    category: 'Next.js',
    image: '/images/projects/layls.png',
    fallback: 'linear-gradient(135deg, #be185d, #f472b6)',
  },
  {
    title: 'MakTech',
    description:
      'Full-Stack IT Solutions That Drive Business Growth at Every Stage',
    highlights: [
      'MakTech is a digital-first technology partner that provides end-to-end digital solutions for startups and enterprises.',
      'Tech: React, Tailwind, GSAP, React Router',
    ],
    liveUrl: 'https://maktechgroup.com',
    category: 'React.js',
    image: '/images/projects/maktech.jpg',
    fallback: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
  },
  {
    title: 'Elyxa AI',
    description:
      'Your plans should adapt to your life. Not the other way around.',
    highlights: [
      "Elyxa is an AI-powered execution planning platform that detects when you're falling behind and automatically recalibrates your day, so you can maintain momentum instead of starting over.",
      'Tech: React, Tailwind, GSAP',
    ],
    liveUrl: 'https://elyxaai.com',
    category: 'React.js',
    image: '/images/projects/elyxa.png',
    fallback: 'linear-gradient(135deg, #4c1d95, #8b5cf6)',
  },
  {
    title: 'Rain',
    description: 'Trusted Cryptocurrency Exchange',
    highlights: [
      'Rain is a leading digital asset platform for secure crypto investment, real-time markets, and exchange services.',
      'Tech: React, Tailwind, React Router',
    ],
    liveUrl: 'https://rainbitx.com',
    category: 'React.js',
    image: '/images/projects/rain.jpg',
    fallback: 'linear-gradient(135deg, #0f172a, #06b6d4)',
  },
  {
    title: 'Skyridge Group',
    description:
      'Global Real Estate Investment Opportunities and Strategic Development',
    highlights: [
      'A Greater Washington real estate platform with verified listings, agent connections, and AI market valuations.',
      'Tech: React, Tailwind CSS, GSAP',
    ],
    liveUrl: 'https://skyridgegroup.com',
    category: 'React.js',
    image: '/images/projects/skyridge.jpg',
    fallback: 'linear-gradient(135deg, #14532d, #22c55e)',
  },
  {
    title: 'M19 Logistics',
    description: 'Logistics Evolved. Delivery Delivered.',
    highlights: [
      'Same-day delivery, specialist transport, and end-to-end logistics across the UK and Europe.',
      'Tech: React, Tailwind, React Router',
    ],
    liveUrl: 'https://m19logistics.com',
    category: 'React.js',
    image: '/images/projects/m19.jpg',
    fallback: 'linear-gradient(135deg, #9a3412, #f97316)',
  },
];

/** Layout tuned for Mobile S 320 / M 375 / L 425 + tablet/desktop */
function getCarouselLayout(width: number) {
  // Mobile S (≤320)
  if (width <= 320) {
    return {
      frameClass: 'h-[380px]',
      itemWidth: 250,
      itemHeight: 340,
      sideItemWidth: 150,
      sideItemHeight: 280,
      gap: 18,
      maxRotation: 42,
      perspective: 700,
      borderRadius: 14,
      blurSpread: 0,
      blurStrength: 0,
    };
  }
  // Mobile M (≤375)
  if (width <= 375) {
    return {
      frameClass: 'h-[400px]',
      itemWidth: 290,
      itemHeight: 360,
      sideItemWidth: 170,
      sideItemHeight: 300,
      gap: 22,
      maxRotation: 48,
      perspective: 750,
      borderRadius: 15,
      blurSpread: 0,
      blurStrength: 0,
    };
  }
  // Mobile L (≤425)
  if (width <= 425) {
    return {
      frameClass: 'h-[420px]',
      itemWidth: 330,
      itemHeight: 375,
      sideItemWidth: 190,
      sideItemHeight: 315,
      gap: 26,
      maxRotation: 54,
      perspective: 800,
      borderRadius: 16,
      blurSpread: 0,
      blurStrength: 0,
    };
  }
  // Small tablet
  if (width < 768) {
    return {
      frameClass: 'h-[460px]',
      itemWidth: 400,
      itemHeight: 400,
      sideItemWidth: 220,
      sideItemHeight: 340,
      gap: 32,
      maxRotation: 60,
      perspective: 850,
      borderRadius: 16,
      blurSpread: 0,
      blurStrength: 0,
    };
  }
  // Desktop
  return {
    frameClass: 'h-[500px] lg:h-[540px]',
    itemWidth: 520,
    itemHeight: 420,
    sideItemWidth: 280,
    sideItemHeight: 360,
    gap: 40,
    maxRotation: 68,
    perspective: 900,
    borderRadius: 18,
    blurSpread: 0,
    blurStrength: 0,
  };
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resolvedSrc, setResolvedSrc] = useState<Record<string, string>>(() =>
    Object.fromEntries(projects.map((p) => [p.image, p.fallback]))
  );
  const [viewportW, setViewportW] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const onResize = () => {
      startTransition(() => setViewportW(window.innerWidth));
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      const img = new Image();
      img.onload = () => {
        startTransition(() => {
          setResolvedSrc((prev) => ({ ...prev, [project.image]: project.image }));
        });
      };
      img.onerror = () => {
        startTransition(() => {
          setResolvedSrc((prev) => ({
            ...prev,
            [project.image]: project.fallback,
          }));
        });
      };
      img.src = project.image;
    });
  }, []);

  // Play video only while Featured Projects is in view
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) return;

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

  const layout = useMemo(() => getCarouselLayout(viewportW), [viewportW]);

  const carouselSlides = projects.map((p) => ({
    src: resolvedSrc[p.image] ?? p.fallback,
    href: p.liveUrl,
    alt: p.title,
    title: p.title,
    description: p.description,
    category: p.category,
    highlights: p.highlights,
  }));

  return (
    <section
      ref={sectionRef}
      id='projects'
      className='projects-section transition-colors duration-300'
    >
      {/* Heritage Grove landscape — full-bleed on desktop, no scrim */}
      <div className='projects-media' aria-hidden='true'>
        <video
          ref={videoRef}
          className='projects-bg'
          autoPlay
          muted
          loop
          playsInline
          preload='auto'
          poster={PROJECTS_VIDEO_POSTER}
        >
          <source src={PROJECTS_VIDEO_SRC} type='video/mp4' />
        </video>
      </div>

      <div className='projects-inner'>
        <Container className='relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='mb-3 text-2xl font-bold text-[#175A67] min-[375px]:text-3xl sm:mb-4 sm:text-4xl lg:text-5xl'>
              Featured <Cover>Projects</Cover>
            </h2>
            <p className='mb-6 max-w-2xl text-sm text-[#2A707C] min-[375px]:text-base sm:mb-10 sm:text-lg'>
              Drag or scroll to explore. Click a card to open the live site.
            </p>
          </motion.div>
        </Container>

        {/* Full-bleed carousel across the viewport */}
        <div className={`relative z-10 w-full ${layout.frameClass}`}>
          <DepthBlurCarousel
            key={`${layout.itemWidth}-${layout.itemHeight}`}
            images={carouselSlides}
            itemWidth={layout.itemWidth}
            itemHeight={layout.itemHeight}
            sideItemWidth={layout.sideItemWidth}
            sideItemHeight={layout.sideItemHeight}
            gap={layout.gap}
            maxRotation={layout.maxRotation}
            perspective={layout.perspective}
            borderRadius={layout.borderRadius}
            blurSpread={layout.blurSpread}
            blurStrength={layout.blurStrength}
            className='w-full'
          />
        </div>
      </div>
    </section>
  );
}
