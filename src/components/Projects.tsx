import { ExternalLink } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Cover } from './ui/cover';

interface Project {
  title: string;
  description: string;
  highlights: string[];
  liveUrl: string;
  category: string;
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
  },
  {
    title: 'MakTech',
    description:
      'Full-Stack IT Solutions That Drive Business Growth at Every Stage',
    highlights: [
      'MakTech is a digital-first technology partner that provides end-to-end digital solutions for startups and enterprises. Their team of over 180 professionals focuses on long-term digital success through strategy, design, and scalable infrastructure.',
      'Tech: React, Tailwind, GSAP, React Router',
    ],
    liveUrl: 'https://maktechgroup.com',
    category: 'React.js',
  },
  {
    title: 'Elyxa AI',
    description:
      'Your plans should adapt to your life. Not the other way around.',
    highlights: [
      'Elyxa is an AI-powered execution planning platform that detects when you\'re falling behind and automatically recalibrates your day, so you can maintain momentum instead of starting over.',
      'Tech: React, Tailwind, GSAP',
    ],
    liveUrl: 'https://elyxaai.com',
    category: 'React.js',
  },
  {
    title: 'Rain',
    description: 'Trusted Cryptocurrency Exchange',
    highlights: [
      'Rain is a leading digital asset platform designed for secure crypto investment opportunities, offering real-time market tracking, exchange services, options trading, and mining capabilities.',
      'Tech: React, Tailwind, React Router',
    ],
    liveUrl: 'https://rainbitx.com',
    category: 'React.js',
  },
  {
    title: 'Skyridge Group',
    description:
      'Global Real Estate Investment Opportunities and Strategic Development',
    highlights: [
      'A Greater Washington real estate platform that partners with investors to acquire and renovate properties, offering verified listings, instant agent connections, and real-time AI market valuations.',
      'Tech: React, Tailwind CSS, GSAP',
    ],
    liveUrl: 'https://skyridgegroup.com',
    category: 'React.js',
  },
  {
    title: 'M19 Logistics',
    description: 'Logistics Evolved. Delivery Delivered.',
    highlights: [
      'A comprehensive courier service providing rapid same-day delivery, specialist transport, and full end-to-end logistics solutions across the UK and Europe.',
      'Tech: React, Tailwind, React Router',
    ],
    liveUrl: 'https://m19logistics.com',
    category: 'React.js',
  },
];

const ProjectCard = memo(({ project }: { project: Project }) => (
  <motion.article
    className='cursor-target bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-purple-400 transition-all duration-300 group relative overflow-hidden shadow-md hover:shadow-xl dark:shadow-gray-900/50 h-full flex flex-col'
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5 }}
    whileHover={{
      rotateX: 10,
      rotateY: 5,
      scale: 1.05,
      transition: { duration: 0.3 },
    }}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Animated gradient overlay on hover */}
    <motion.div
      className='absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none'
      style={{
        background:
          'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)',
      }}
    />

    {/* Subtle corner glow */}
    <div className='absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl rounded-full pointer-events-none' />

    <div className='relative z-10 flex flex-col h-full'>
      <div className='flex justify-between items-start mb-3 sm:mb-4'>
        <motion.span
          className='text-xs sm:text-sm font-bold text-white uppercase tracking-wider px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md group-hover:shadow-lg group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300'
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          {project.category}
        </motion.span>
        <motion.a
          href={project.liveUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='cursor-target text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 p-2.5 rounded-full border-2 border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg'
          aria-label={`Visit ${project.title} live site`}
          whileHover={{ scale: 1.15, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <ExternalLink className='h-5 w-5' aria-hidden='true' />
        </motion.a>
      </div>
      <motion.h3
        className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {project.title}
      </motion.h3>
      <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 font-medium'>
        {project.description}
      </p>
      <ul className='space-y-2 mb-6 flex-grow'>
        {project.highlights.map((highlight, idx) => (
          <motion.li
            key={idx}
            className='text-gray-700 dark:text-gray-300 text-xs sm:text-sm flex'
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <span className='mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0'>
              •
            </span>
            <span>{highlight}</span>
          </motion.li>
        ))}
      </ul>{' '}
      <div className='mt-auto pt-4'>
        <motion.a
          href={project.liveUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='cursor-target inline-flex items-center text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-all duration-300 group/link'
          whileHover={{ x: 8 }}
        >
          View Live Site
          <motion.span
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <ExternalLink
              className='ml-2 h-4 w-4 text-blue-600 group-hover/link:text-purple-600 transition-colors'
              aria-hidden='true'
            />
          </motion.span>
        </motion.a>
      </div>
    </div>
  </motion.article>
));

ProjectCard.displayName = 'ProjectCard';

export default function Projects() {
  return (
    <section
      id='projects'
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transition-colors duration-300'
    >
      {/* Background decoration */}
      <div className='absolute top-20 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-0' />
      <div className='absolute bottom-20 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl -z-0' />

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Featured <Cover>Projects</Cover>
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-12 sm:mb-16 max-w-2xl'>
            A selection of production-ready web applications built with modern
            technologies, focusing on performance, accessibility, and user
            experience.
          </p>
        </motion.div>

        <div className='grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
