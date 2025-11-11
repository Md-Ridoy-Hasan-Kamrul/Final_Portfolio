import { ExternalLink } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  highlights: string[];
  liveUrl: string;
  category: string;
}

const projects: Project[] = [
  {
    title: 'Q Global Living',
    description: 'Real Estate Platform',
    highlights: [
      'Built a full-stack real estate marketplace using Next.js 16, React 19, TypeScript, & Tailwind CSS v4 with internationalization (EN/FR), featuring property listings, event registration, admin dashboards, and escrow-protected transactions',
      'Implemented complete i18n system, responsive design (mobile-first), SEO optimization, custom authentication flows (admin/client/partner roles), and performance optimization with React Compiler compliance',
    ],
    liveUrl: 'https://qhomes.mtscorporate.com/en',
    category: 'Next.js',
  },
  {
    title: 'TherellWalker',
    description: 'Trading Journal & Performance Analytics Platform',
    highlights: [
      'Highlights the tech stack (React 19, Tailwind CSS, Vite) and main features (trade logging and reflections)',
      'Emphasizes key technical implementations (authentication, P&L calculations, responsive dark theme UI)',
    ],
    liveUrl: 'https://myledger.mtscorporate.com/',
    category: 'React.js',
  },
  {
    title: 'CoorDeck Technologies',
    description: 'Smarter Temporary Works Management',
    highlights: [
      'Built a 90+ Lighthouse site using Next.js 14, TypeScript, & Tailwind from a Figma design',
      'Implemented full SEO, WCAG 2.1 AA accessibility, and Framer Motion animations',
    ],
    liveUrl: 'https://alex-coordinate.vercel.app',
    category: 'Next.js',
  },
  {
    title: 'IndividUX',
    description: 'Your UX Career, Designed Around You',
    highlights: [
      'Professional UX career platform',
      'Built with Next.js and modern design principles',
    ],
    liveUrl: 'https://troyabel-gules.vercel.app',
    category: 'Next.js',
  },
  {
    title: 'Layls E-commerce',
    description: 'E-commerce Products Platform',
    highlights: [
      'Implemented complete authentication system with Google Auth 2.0 and WhatsApp/Email OTP',
      'Designed the home page and built key UI features like secure password toggle and login-gated content',
    ],
    liveUrl: 'https://www.layls.com',
    category: 'Next.js',
  },
  {
    title: 'Bundoora Courses',
    description: 'Interactive Course Platform',
    highlights: [
      'Interactive flow chart implementation',
      'Modern course browsing experience',
    ],
    liveUrl: 'https://interactive-flow-chart.vercel.app',
    category: 'React.js',
  },
  {
    title: 'Skywalker Rentals',
    description: 'Apartments for Rent, Houses for Sales',
    highlights: [
      'Built a React & Tailwind CSS rental app for browsing, searching, and booking properties',
      'Implemented user authentication, saved listing profiles, and property detail pages with image/video',
    ],
    liveUrl: 'https://skywalker-rho.vercel.app',
    category: 'React.js',
  },
  {
    title: 'Beatzingeez Music',
    description: 'Music Streaming Website',
    highlights: [
      'Modern music streaming platform',
      'Rich media player integration',
    ],
    liveUrl: 'https://beatzingeez.com',
    category: 'React.js',
  },
  {
    title: 'HuurScanner',
    description: 'Rental Home Scanner',
    highlights: [
      'Advanced property search and filtering',
      'Real-time rental market insights',
    ],
    liveUrl: 'https://huurscanner.nl',
    category: 'React.js',
  },
];

const ProjectCard = memo(({ project }: { project: Project }) => (
  <motion.article
    className='cursor-target bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-blue-400 transition-all duration-300 group relative overflow-hidden shadow-md hover:shadow-xl h-full flex flex-col'
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5 }}
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
        className='text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {project.title}
      </motion.h3>

      <p className='text-sm sm:text-base text-gray-600 mb-4 font-medium'>
        {project.description}
      </p>

      <ul className='space-y-2 mb-6 flex-grow'>
        {project.highlights.map((highlight, idx) => (
          <motion.li
            key={idx}
            className='text-gray-700 text-xs sm:text-sm flex'
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <span className='mr-2 text-blue-600 flex-shrink-0'>•</span>
            <span>{highlight}</span>
          </motion.li>
        ))}
      </ul>

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
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden'
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
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
            Featured Projects
          </h2>
          <p className='text-base sm:text-lg text-gray-600 mb-12 sm:mb-16 max-w-2xl'>
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
