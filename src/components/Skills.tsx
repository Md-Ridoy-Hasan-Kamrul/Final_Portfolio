import { memo } from 'react';
import { motion } from 'framer-motion';

interface SkillCategory {
  title: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Technologies',
    skills: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
  },
  {
    title: 'Styling & Design',
    skills: ['Tailwind CSS', 'Bootstrap 5', 'Responsive Design', 'Figma'],
  },
  {
    title: 'Backend & Tools',
    skills: ['Node.js', 'Postman', 'Git', 'GitHub'],
  },
  {
    title: 'Soft Skills',
    skills: [
      'Problem-Solving',
      'Team Collaboration',
      'Communication',
      'Client Requirement Analysis',
    ],
  },
];

const SkillCard = memo(
  ({ category, index }: { category: SkillCategory; index: number }) => (
    <motion.div
      className='bg-white p-6 sm:p-8 border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 group'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-blue-600 transition-colors'>
        {category.title}
      </h3>
      <div className='flex flex-wrap gap-2 sm:gap-3'>
        {category.skills.map((skill, idx) => (
          <motion.span
            key={idx}
            className='cursor-target px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-blue-50 hover:to-purple-50 text-gray-800 hover:text-blue-700 text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md'
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
);

SkillCard.displayName = 'SkillCard';

export default function Skills() {
  return (
    <section
      id='skills'
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden'
    >
      {/* Background decoration */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/30 to-transparent rounded-full blur-3xl -z-0' />

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
            Skills & Expertise
          </h2>
          <p className='text-base sm:text-lg text-gray-600 mb-12 sm:mb-16 max-w-2xl'>
            A comprehensive toolkit for building modern, performant web
            applications with focus on user experience and code quality.
          </p>
        </motion.div>

        <div className='grid gap-6 sm:gap-8 md:grid-cols-2'>
          {skillCategories.map((category, index) => (
            <SkillCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
