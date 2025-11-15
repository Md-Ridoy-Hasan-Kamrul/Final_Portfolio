import { motion } from 'framer-motion';
import ScrambledText from './ScrambledText';

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

export default function About() {
  return (
    <section
      id='about'
      className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative transition-colors duration-300'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Title */}
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

        <div className='grid lg:grid-cols-3 gap-12'>
          {/* Left Column - Main Description */}
          <motion.div
            className='lg:col-span-2 space-y-6'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {[
              "I'm a Computer Science graduate from the University of Information Technology and Sciences (UITS), Dhaka, with a B.Sc. in CSE completed in 2022.",
              'Specializing in the MERN stack with a strong focus on frontend development, I build responsive, user-friendly web applications that deliver exceptional user experiences.',
              'I thrive in both team and independent work environments, bringing a problem-solving mindset and passion for creating impactful digital solutions. My goal is to grow globally as a frontend developer, contributing to projects that make a difference.',
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

          {/* Right Column - Contact & Education */}
          <motion.div
            className='space-y-8'
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
                Education
              </h3>
              <div className='pl-4 border-l-4 border-blue-600 space-y-2'>
                <p className='text-base font-medium text-gray-900 dark:text-white'>
                  B.Sc in Computer Science & Engineering
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  University of Information Technology and Sciences
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>2022</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
