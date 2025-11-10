import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true },
};

const staggerChildren = {
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function About() {
  return (
    <section
      id='about'
      className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden'
    >
      {/* Subtle background decoration */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 -z-0' />

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.h2
          className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 sm:mb-12'
          {...fadeInUp}
        >
          About Me
        </motion.h2>

        <div className='grid gap-8 sm:gap-12 md:grid-cols-2'>
          <motion.div
            className='space-y-4 sm:space-y-6'
            variants={staggerContainer}
            initial='initial'
            whileInView='whileInView'
            viewport={{ once: true }}
          >
            {[
              "I'm a Computer Science graduate from the University of Information Technology and Sciences (UITS), Dhaka, with a B.Sc. in CSE completed in 2022.",
              'Specializing in the MERN stack with a strong focus on frontend development, I build responsive, user-friendly web applications that deliver exceptional user experiences.',
              'I thrive in both team and independent work environments, bringing a problem-solving mindset and passion for creating impactful digital solutions. My goal is to grow globally as a frontend developer, contributing to projects that make a difference.',
            ].map((text, index) => (
              <motion.p
                key={index}
                className='text-base sm:text-lg text-gray-700 leading-relaxed'
                variants={fadeInUp}
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            className='space-y-4 sm:space-y-6'
            variants={staggerChildren}
            initial='initial'
            whileInView='whileInView'
            viewport={{ once: true }}
          >
            {[
              { title: 'Location', content: 'Dhaka, Bangladesh' },
              {
                title: 'Email',
                content: 'mdridoyhasankamrul@gmail.com',
                isLink: true,
                href: 'mailto:mdridoyhasankamrul@gmail.com',
              },
              {
                title: 'Phone',
                content: '+880 1680 092066',
                isLink: true,
                href: 'tel:+8801680092066',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className='group'
                variants={fadeInUp}
              >
                <h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3'>
                  {item.title}
                </h3>
                {item.isLink ? (
                  <a
                    href={item.href}
                    className='cursor-target text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors break-all'
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className='text-sm sm:text-base text-gray-700'>
                    {item.content}
                  </p>
                )}
              </motion.div>
            ))}

            <motion.div variants={fadeInUp} className='pt-2'>
              <h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3'>
                Education
              </h3>
              <div className='space-y-2 pl-4 border-l-4 border-blue-600'>
                <p className='text-sm sm:text-base text-gray-700 font-medium'>
                  B.Sc in Computer Science & Engineering
                </p>
                <p className='text-sm sm:text-base text-gray-600'>
                  University of Information Technology and Sciences
                </p>
                <p className='text-xs sm:text-sm text-gray-500'>2022</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
