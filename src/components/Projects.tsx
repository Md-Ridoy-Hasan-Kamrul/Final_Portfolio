import { useEffect, useState, startTransition } from 'react';
import { motion } from 'framer-motion';
import { Cover } from './ui/cover';
import { Container } from './ui/Container';
import DepthBlurCarousel from './DepthBlurCarousel';

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

export default function Projects() {
  const [resolvedSrc, setResolvedSrc] = useState<Record<string, string>>(() =>
    Object.fromEntries(projects.map((p) => [p.image, p.fallback]))
  );

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
      id='projects'
      className='py-12 sm:py-16 lg:py-20 bg-transparent relative overflow-hidden transition-colors duration-300'
    >
      <Container className='relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Featured <Cover>Projects</Cover>
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl'>
            Drag or scroll to explore. Click a card to open the live site.
          </p>
        </motion.div>

        <div className='relative w-full h-[440px] sm:h-[500px] lg:h-[540px]'>
          <DepthBlurCarousel
            images={carouselSlides}
            itemWidth={520}
            itemHeight={420}
            sideItemWidth={280}
            sideItemHeight={360}
            gap={40}
            maxRotation={68}
            perspective={900}
            borderRadius={18}
            blurSpread={16}
            blurStrength={18}
          />
        </div>
      </Container>
    </section>
  );
}
