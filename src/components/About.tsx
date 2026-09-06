import { motion } from 'framer-motion';
import ScrambledText from './ScrambledText';
import { Container } from './ui/Container';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const education = [
  {
    title: 'B.Sc in Computer Science & Engineering',
    school: 'University of Information Technology and Sciences (UITS)',
    year: '2022',
  },
  {
    title: 'H.S.C',
    school: 'Shaheed Ramiz Uddin Cantonment College (SRCC)',
    year: '2016',
  },
  {
    title: 'S.S.C',
    school: 'Govt. Kalachandpur High School and College',
    year: '2014',
  },
];

export default function About() {
  return (
    <section
      id='about'
      className='py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 relative transition-colors duration-300'
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16'
        >
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            About Me
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded'></div>
        </motion.div>

        <div className='grid lg:grid-cols-3 gap-10 lg:gap-12 lg:items-start'>
          {/* Left — Profile */}
          <motion.div
            className='lg:col-span-2 space-y-6'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {[
              'Frontend Developer specializing in React.js, Next.js, TypeScript, and JavaScript, with a B.Sc. in Computer Science and Engineering from UITS, Dhaka.',
              'Experienced in building responsive, user-friendly, and production-ready web applications with Tailwind CSS, Redux, and RESTful APIs.',
              'Skilled at translating UI designs and client requirements into clean, maintainable interfaces, with a strong focus on performance, accessibility, SEO, and cross-browser compatibility.',
            ].map((text, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ScrambledText
                  className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'
                  radius={120}
                  duration={800}
                  scrambleChars='.:!@#$%&*'
                >
                  {text}
                </ScrambledText>
              </motion.div>
            ))}
          </motion.div>

          {/* Right — Contact only (balanced with bio) */}
          <motion.div
            className='space-y-6'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                Location
              </h3>
              <p className='text-base text-gray-600 dark:text-gray-300'>
                Dhaka, Bangladesh
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                Email
              </h3>
              <a
                href='mailto:mdridoyhasankamrul@gmail.com'
                className='cursor-target text-base text-blue-600 hover:text-blue-700 transition-colors break-all'
              >
                mdridoyhasankamrul@gmail.com
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                Phone
              </h3>
              <a
                href='tel:+8801680092066'
                className='cursor-target text-base text-blue-600 hover:text-blue-700 transition-colors'
              >
                +880 1680 092066
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-3'>
                Certification
              </h3>
              <div className='pl-4 border-l-4 border-blue-600 space-y-1'>
                <p className='text-base font-medium text-gray-900 dark:text-white'>
                  MERN Stack
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Ostad · 2024
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Education — full-width row so the sidebar stays balanced */}
        <motion.div
          className='mt-14 pt-10 border-t border-gray-200 dark:border-gray-700'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h3
            variants={itemVariants}
            className='text-lg font-bold text-gray-900 dark:text-white mb-6'
          >
            Education
          </motion.h3>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {education.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className='pl-4 border-l-4 border-blue-600 space-y-1'
              >
                <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
                  <p className='text-base font-medium text-gray-900 dark:text-white'>
                    {item.title}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {item.year}
                  </p>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {item.school}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
