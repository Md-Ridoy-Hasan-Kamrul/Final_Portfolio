import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

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
    company: 'MAK Tech Solution',
    period: 'January 2025 – Present',
    location: 'Dhaka, Bangladesh',
    responsibilities: [
      'Delivered multiple live projects for clients',
      'Developed solutions tailored to specific client requirements',
      'Integrated new NPM packages to meet project needs',
      'Designed and implemented user interfaces using React, Next.js, Tailwind CSS, and JavaScript',
      'Utilized tools such as Postman, GitHub, Git, and Figma to collaborate effectively and ensure high-quality deliverables',
    ],
  },
  {
    title: 'Researcher',
    company: 'Business Process Outsourcing',
    period: 'January 2022 – December 2024',
    location: 'Dhaka, Bangladesh',
    responsibilities: [
      'Worked on property access point (APN) research',
      'Conducted market analysis for business process outsourcing',
      'Collaborated with direct marketing services team',
    ],
  },
  {
    title: 'Front-End Developer (Internship)',
    company: 'Matrix Apparels Ltd.',
    period: 'January 2021 – August 2021',
    location: 'Dhaka, Bangladesh',
    responsibilities: [
      'Learned to understand, analyze, design, and develop project requirements',
      'Gained proficiency in building frontend-based web applications',
      'Developed teamwork skills and the ability to approach problems from different perspectives',
      'Designed and implemented frontend interfaces using HTML, CSS, Bootstrap, and JavaScript',
    ],
  },
];

export default function Experience() {
  return (
    <section
      id='experience'
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300'
    >
      {/* Background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10 -z-0' />

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.h2
          className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-12 sm:mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Experience
        </motion.h2>

        <div className='space-y-8 sm:space-y-12'>
          {experiences.map((exp, index) => (
            <motion.article
              key={index}
              className='relative pl-8 sm:pl-12 border-l-2 border-gray-300 dark:border-gray-700 pb-8 last:pb-0 group'
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className='absolute left-0 top-0 -translate-x-1/2 bg-white dark:bg-gray-700 p-2 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-600 dark:group-hover:border-purple-400 group-hover:bg-blue-50 dark:group-hover:bg-purple-900/20 transition-all duration-300'
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase
                  className='h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors'
                  aria-hidden='true'
                />
              </motion.div>

              <div className='space-y-3 sm:space-y-4'>
                <div>
                  <motion.h3
                    className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {exp.title}
                  </motion.h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <p className='text-base sm:text-lg text-blue-600 dark:text-purple-400 font-medium'>
                      {exp.company}
                    </p>
                    {exp.period.includes('Present') && (
                      <motion.div
                        className='relative inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-md shadow-lg'
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3,
                          duration: 0.5,
                          type: 'spring',
                        }}
                      >
                        {/* Shimmer effect */}
                        <motion.span
                          className='absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent'
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />

                        {/* Pulsing dot */}
                        <motion.span
                          className='relative w-1.5 h-1.5 bg-green-300 rounded-full shadow-lg'
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

                        <span className='relative text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide'>
                          Currently Active
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <div className='flex flex-col sm:flex-row sm:gap-4 text-gray-600 dark:text-gray-400 mt-2'>
                    <p className='text-xs sm:text-sm'>{exp.period}</p>
                    <p className='text-xs sm:text-sm hidden sm:block'>•</p>
                    <p className='text-xs sm:text-sm'>{exp.location}</p>
                  </div>
                </div>

                <ul className='space-y-2'>
                  {exp.responsibilities.map((resp, idx) => (
                    <motion.li
                      key={idx}
                      className='text-sm sm:text-base text-gray-700 dark:text-gray-300 flex'
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <span className='mr-2 sm:mr-3 text-blue-600 dark:text-purple-400 flex-shrink-0'>
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
    </section>
  );
}
